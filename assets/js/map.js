/**
 * map.js —— 建大圈 高德地图封装
 *
 * 对外暴露（挂到 window，供 main.js / campus-search.js 调用）：
 *   window.map                      地图实例
 *   window.AMap                     高德命名空间（loader 回调内）
 *   window.initMap(center)           初始化，返回 Promise<boolean>
 *   window.drawWalkingCircles(mins) 重绘步行圈（★ 圈层开关依赖此项）
 *   window.renderMarkers(list, onClick)
 *   window.clearMarkers()
 *   window.focusOn(lng, lat, zoom)
 *
 * 关键约束：
 *   1. 必须用 AMapLoader.load，不能直接 <script src="https://webapi.amap.com/maps?v=...">，
 *      否则新版 JSAPI 会报 SECURITY_KEY_REQUIRED。
 *   2. 所有对外函数必须挂 window，否则 main.js 访问不到（const 为块级作用域）。
 *   3. 圈层重绘必须先 remove 旧圈再 add 新圈，否则会出现“圈越勾越多”。
 */

let map = null;
let markers = [];
let circles = [];

// 地图配置：zoom 与中心由 CONFIG 决定，避免坐标写死在多处
const MAP_OPTIONS = {
  zoom: 16,
  mapStyle: "amap://styles/light",
  features: ["bg", "road", "building", "point"]
};

/**
 * 初始化地图
 * @param {number[]} center [longitude, latitude]
 * @returns {Promise<boolean>} 成功/失败
 */
function initMap(center) {
  return new Promise(resolve => {
    if (!CONFIG || !CONFIG.amapKey) {
      console.error("[map] CONFIG.amapKey 未配置");
      showMapError("未配置高德 Key，请在 assets/js/config.js 中填写");
      return resolve(false);
    }

    window._AMapSecurityConfig = {
      securityJsCode: CONFIG.securityJsCode
    };

    AMapLoader.load({
      key: CONFIG.amapKey,
      version: "2.0",
      plugins: ["AMap.Walking", "AMap.Geocoder"]
    })
      .then(AMap => {
        window.AMap = AMap;   // ★ 供 campus-search.js 使用

        map = new AMap.Map("map", Object.assign({}, MAP_OPTIONS, {
          center: center || [CONFIG.campus.longitude, CONFIG.campus.latitude]
        }));

        window.map = map;     // ★ 挂全局

        addCampusMarker();
        bindMapClick();

        resolve(true);
      })
      .catch(err => {
        console.error("[map] 高德地图加载失败：", err);
        showMapError(err && err.message ? err.message : "网络或 Key 错误");
        resolve(false);
      });
  });
}

/**
 * 校园中心标记
 * 使用默认蓝标即可，红色保留给“用户选中的校内建筑”（见 campus-search.js）
 */
function addCampusMarker() {
  const marker = new AMap.Marker({
    position: [CONFIG.campus.longitude, CONFIG.campus.latitude],
    title: CONFIG.campus.name,
    label: {
      content: CONFIG.campus.name,
      direction: "top",
      offset: new AMap.Pixel(0, -8),
      style: {
        background: "#2563eb",
        color: "#fff",
        padding: "2px 8px",
        borderRadius: "6px",
        fontSize: "12px",
        whiteSpace: "nowrap"
      }
    }
  });
  map.add(marker);
}

/**
 * 绘制步行圈（★ 核心：供圈层开关调用）
 * @param {number[]} activeMinutes [5, 10, 15] 的子集
 *
 * 注意：本函数按“直线半径”绘制，仅为示意。
 * 正式提交前须用 OSMnx / 高德 Walking API 计算真实路网等时圈后替换。
 */
function drawWalkingCircles(activeMinutes) {
  if (!map || !CONFIG.walking) return;

  // ★ 先清旧圈，防止重复叠加
  if (circles.length) {
    circles.forEach(c => map.remove(c));
    circles = [];
  }

  const defs = {
    5:  { r: CONFIG.walking.fiveMinutes,    color: "#2ecc71", name: "5分钟圈" },
    10: { r: CONFIG.walking.tenMinutes,     color: "#f39c12", name: "10分钟圈" },
    15: { r: CONFIG.walking.fifteenMinutes, color: "#e74c3c", name: "15分钟圈" }
  };

  activeMinutes.forEach(m => {
    const d = defs[m];
    if (!d) return;
    const circle = new AMap.Circle({
      center: [CONFIG.campus.longitude, CONFIG.campus.latitude],
      radius: d.r,
      strokeColor: d.color,
      fillColor: d.color,
      fillOpacity: 0.07,
      strokeWeight: 2,
      strokeStyle: "dashed"
    });
    map.add(circle);
    circles.push(circle);
  });
}

/**
 * 渲染 POI 标记点（周边设施，蓝色）
 * @param {Array} list
 * @param {Function} onClick
 */
function renderMarkers(list, onClick) {
  if (!map) return;
  clearMarkers();

  (list || []).forEach(poi => {
    if (!isValidCoord(poi.longitude, poi.latitude)) return;

    const marker = new AMap.Marker({
      position: [poi.longitude, poi.latitude],
      title: poi.name,
      animation: "AMAP_ANIMATION_DROP"
    });

    marker.on("click", () => {
      if (typeof onClick === "function") onClick(poi);
    });

    map.add(marker);
    markers.push(marker);
  });
}

function clearMarkers() {
  markers.forEach(m => {
    try { map.remove(m); } catch (e) { /* 已销毁的标记忽略 */ }
  });
  markers = [];
}

/**
 * 校内建筑红色高亮标记
 * 与 POI 蓝标区分：红色 = 用户主动选择的校内目标
 * @param {Object} building
 * @returns {AMap.Marker}
 */
function highlightBuilding(building) {
  if (!map || !window.AMap) return null;
  if (!isValidCoord(building.longitude, building.latitude)) return null;

  // 先清除上一次的红点，保证只有一个
  if (window._redMarker) {
    map.remove(window._redMarker);
    window._redMarker = null;
  }

  const marker = new AMap.Marker({
    position: [building.longitude, building.latitude],
    title: building.name,
    zIndex: 999,
    animation: "AMAP_ANIMATION_DROP",
    label: {
      content: building.shortName || building.name,
      direction: "top",
      offset: new AMap.Pixel(0, -10),
      style: {
        background: "#e53935",
        color: "#fff",
        padding: "3px 9px",
        borderRadius: "7px",
        fontSize: "13px",
        fontWeight: "700",
        boxShadow: "0 3px 10px rgba(229,57,53,.4)",
        whiteSpace: "nowrap"
      }
    }
  });

  map.add(marker);
  window._redMarker = marker;

  // 脉冲圈：半径取步行 3 分钟的示意值
  if (window._redPulse) map.remove(window._redPulse);
  window._redPulse = new AMap.Circle({
    center: [building.longitude, building.latitude],
    radius: 45,
    strokeColor: "#e53935",
    fillColor: "#e53935",
    fillOpacity: 0.16,
    strokeWeight: 1
  });
  map.add(window._redPulse);

  return marker;
}

/**
 * 真实路网步行导航
 * @param {number[]} from [lng, lat]
 * @param {number[]} to   [lng, lat]
 * @param {Function} onComplete  ({ timeMinutes, distanceKm, route })
 * @param {Function} onFail
 *
 * 降级策略（三级）：
 *   1. 高德 Walking API 真实路径
 *   2. 以校园中心为虚拟起点
 *   3. Haversine 直线距离 / 80 米每分钟 估算
 */
function planWalkRoute(from, to, onComplete, onFail) {
  const fallback = () => {
    const d = haversine(from[1], from[0], to[1], to[0]);
    const t = Math.max(1, Math.round(d / 80));
    if (typeof onComplete === "function") {
      onComplete({
        timeMinutes: t,
        distanceKm: (d / 1000).toFixed(2),
        route: null,
        source: "估算"   // 标注数据来源，避免误导
      });
    }
  };

  if (!window.AMap || !window.AMap.Walking) return fallback();

  try {
    const walking = new window.AMap.Walking({ map: null });
    walking.search(
      new window.AMap.LngLat(from[0], from[1]),
      new window.AMap.LngLat(to[0], to[1]),
      (status, result) => {
        if (status === "complete" && result && result.routes && result.routes[0]) {
          const route = result.routes[0];
          if (typeof onComplete === "function") {
            onComplete({
              timeMinutes: Math.max(1, Math.round(route.time / 60)),
              distanceKm: (route.distance / 1000).toFixed(2),
              route: route,
              source: "高德路网"
            });
          }
        } else {
          fallback();
        }
      }
    );
  } catch (e) {
    console.warn("[map] Walking 规划异常，降级为估算", e);
    fallback();
  }
}

/**
 * 获取用户当前位置（GNSS）
 * @returns {Promise<number[]|null>} [lng, lat]
 *
 * 注意：必须在 https 或 localhost 下才可用；用户拒绝授权时 reject。
 */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      return reject(new Error("当前浏览器/环境不支持定位"));
    }
    navigator.geolocation.getCurrentPosition(
      p => resolve([p.coords.longitude, p.coords.latitude]),
      e => reject(new Error(geoErrorMessage(e.code))),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

function geoErrorMessage(code) {
  switch (code) {
    case 1: return "用户拒绝了定位权限";
    case 2: return "设备无法获取位置";
    case 3: return "定位超时";
    default: return "定位失败";
  }
}

/**
 * 视角聚焦
 */
function focusOn(lng, lat, zoom) {
  if (!map) return;
  if (!isValidCoord(lng, lat)) return;
  map.setZoomAndCenter(zoom || 18, [lng, lat], false, 300);
}

/**
 * 经纬度合法性校验
 * 高德 GCJ02：经度 73~136，纬度 3~54
 */
function isValidCoord(lng, lat) {
  const lo = Number(lng);
  const la = Number(lat);
  if (!isFinite(lo) || !isFinite(la)) return false;
  if (lo < 73 || lo > 136 || la < 3 || la > 54) return false;
  return true;
}

/**
 * Haversine 公式：两点间直线距离（米）
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 */
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function bindMapClick() {
  map.on("click", () => {
    // 点击地图空白处：收起搜索下拉，避免遮挡
    if (window.CampusSearch && typeof window.CampusSearch.hide === "function") {
      window.CampusSearch.hide();
    }
  });
}

function showMapError(msg) {
  const el = document.getElementById("map");
  if (!el) return;
  el.innerHTML = [
    '<div style="padding:36px;color:#64748b;font-size:14px;line-height:2">',
    '<b style="color:#334155;font-size:16px">地图未能加载</b><br>',
    msg || "请检查网络与高德 Key 配置",
    "<br><br>以下页面可正常预览：",
    "<br>· 生活圈体检（circle.html）",
    "<br>· 为你推荐（recommend.html）",
    "<br>· 办事事项（services.html）",
    "<br>· 优化方案（optimize.html）",
    "</div>"
  ].join("");
}

/* ============ 挂载全局 ============ */
window.map = map;
window.initMap = initMap;
window.drawWalkingCircles = drawWalkingCircles;
window.renderMarkers = renderMarkers;
window.clearMarkers = clearMarkers;
window.highlightBuilding = highlightBuilding;
window.planWalkRoute = planWalkRoute;
window.getCurrentPosition = getCurrentPosition;
window.focusOn = focusOn;
window.haversine = haversine;
window.isValidCoord = isValidCoord;