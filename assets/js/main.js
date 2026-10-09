/**
 * main.js —— 建大圈 首页交互控制
 *
 * 职责：
 *   1. 维护筛选状态 state
 *   2. 初始化分类按钮
 *   3. 绑定搜索 / 圈层 / 重置事件
 *   4. 等待地图就绪后：画圈、打 POI 点、启动校内建筑搜索
 *
 * 关键约束（★ 与搜索无反应、圈层不动直接相关）：
 *   - initMap 必须返回 Promise，且地图实例挂 window.map
 *   - drawWalkingCircles / renderMarkers 必须挂 window
 *   - CampusSearch.init() 必须在 initMap 的 then 内调用
 *   - doSearch 必须优先调用 CampusSearch._search
 */

// ============ 筛选状态 ============
const state = {
  keyword: "",
  categories: new Set(),
  minutes: [5, 10, 15]
};

// ============ 入口 ============
document.addEventListener("DOMContentLoaded", () => {
  renderCategoryFilter();
  bindEvents();

  // ★ 关键：必须 await 地图就绪，否则 window.map 为 null，
  //   CampusSearch.highlightBuilding 无法添加红色标记。
  const center = CONFIG && CONFIG.campus
    ? [CONFIG.campus.longitude, CONFIG.campus.latitude]
    : [116.3309, 39.7267];

  initMap(center).then(ready => {
    if (!ready) {
      console.warn("[main] 地图未就绪，POI 与圈层不可用，但页面不崩溃");
    }

    // 以下三个函数来自 map.js，必须已挂 window
    if (typeof drawWalkingCircles === "function") {
      drawWalkingCircles(state.minutes);
    }
    if (typeof renderMarkers === "function" && Array.isArray(window.POI_DATA)) {
      renderMarkers(window.POI_DATA, showPoiDetail);
    }

    // ★ 关键：启动校内建筑级联搜索
    //   若不调用，searchDropdown / categoryView 全为 null，点搜索框无任何反应
    if (window.CampusSearch && typeof window.CampusSearch.init === "function") {
      window.CampusSearch.init();
    } else {
      console.warn(
        "[main] CampusSearch.init 不可用。请确认：\n" +
        "  1. assets/js/campus-search.js 已放入项目\n" +
        "  2. index.html 的 script 链中包含 campus-search.js，且在 map.js 之后\n" +
        "  3. campus-search.js 未被其他 script 报错中断"
      );
    }
  });
});

// ============ 分类筛选按钮 ============
function renderCategoryFilter() {
  const container = document.getElementById("categoryFilter");
  if (!container) return;
  container.innerHTML = "";

  (CATEGORIES || []).forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "cat-btn";
    btn.textContent = cat.label;
    btn.dataset.key = cat.key;
    btn.addEventListener("click", () => {
      if (state.categories.has(cat.key)) {
        state.categories.delete(cat.key);
        btn.classList.remove("active");
      } else {
        state.categories.add(cat.key);
        btn.classList.add("active");
      }
      refresh();
    });
    container.appendChild(btn);
  });
}

// ============ 事件绑定 ============
function bindEvents() {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  if (searchBtn) searchBtn.addEventListener("click", doSearch);
  if (searchInput) {
    searchInput.addEventListener("keyup", e => {
      if (e.key === "Enter") doSearch();
    });
    // 聚焦时若已有关键字，直接展示校内命中，提升体验
    searchInput.addEventListener("focus", () => {
      if (window.CampusSearch && typeof window.CampusSearch.showAll === "function") {
        window.CampusSearch.showAll();
      }
    });
  }

  // ★ 圈层开关：必须重新调用 drawWalkingCircles，且该函数会先 remove 旧圈
  document.querySelectorAll(".circle-control input").forEach(cb => {
    cb.addEventListener("change", () => {
      state.minutes = Array.from(
        document.querySelectorAll(".circle-control input:checked")
      ).map(i => Number(i.dataset.minutes));

      if (typeof drawWalkingCircles === "function") {
        drawWalkingCircles(state.minutes);
      } else {
        console.warn("[main] drawWalkingCircles 未定义：map.js 未挂 window");
      }
    });
  });

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) resetBtn.addEventListener("click", resetFilter);

  // 移动端汉堡菜单
  const toggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }

  // 点击页面空白处收起搜索下拉
  document.addEventListener("click", e => {
    if (!e.target) return;
    const box = document.querySelector(".search-box");
    if (box && !box.contains(e.target)) {
      if (window.CampusSearch && typeof window.CampusSearch.hide === "function") {
        window.CampusSearch.hide();
      }
    }
  });
}

// ============ 搜索（★ 校内建筑优先）============
function doSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  state.keyword = input.value.trim();

  // ★ 关键逻辑：
  //   输入“基A / 图书馆 / 医务室”期望：红色高亮 + 真实路网步行导航
  //   若先走下方 refresh() 的 POI 模糊匹配，校内建筑会被周边 POI 淹没，表现为“无反应”
  if (state.keyword) {
    if (window.CampusSearch && typeof window.CampusSearch._search === "function") {
      const hit = window.CampusSearch._search(state.keyword);
      if (hit) return;   // 校内命中即止
    }
  }

  // 兜底：走周边 POI 筛选（食堂、快递、充电桩等）
  refresh();
}

// ============ 重置 ============
function resetFilter() {
  state.keyword = "";
  state.categories.clear();
  state.minutes = [5, 10, 15];

  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";

  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".circle-control input").forEach(cb => cb.checked = true);

  if (typeof drawWalkingCircles === "function") drawWalkingCircles(state.minutes);
  if (typeof renderMarkers === "function" && Array.isArray(window.POI_DATA)) {
    renderMarkers(window.POI_DATA, showPoiDetail);
  }

  if (window.CampusSearch && typeof window.CampusSearch.clearHighlight === "function") {
    window.CampusSearch.clearHighlight();
  }
}

// ============ 筛选数据（周边 POI）============
function refresh() {
  if (!Array.isArray(window.POI_DATA)) {
    console.warn("[main] window.POI_DATA 为空：poi.js 未导出或路径错误");
    return;
  }

  const list = window.POI_DATA.filter(poi => {
    if (state.categories.size && !state.categories.has(poi.category)) return false;
    if (state.keyword) {
      const kw = state.keyword.toLowerCase();
      const hay = (poi.name + " " + (poi.type || "") + " " + (poi.description || "")).toLowerCase();
      if (!hay.includes(kw)) return false;
    }
    return true;
  });

  if (typeof renderMarkers === "function") {
    renderMarkers(list, showPoiDetail);
  }
}

// ============ 设施详情面板 ============
function showPoiDetail(poi) {
  const panel = document.getElementById("detailPanel");
  if (!panel) return;

  const tags = Array.isArray(poi.tags)
    ? poi.tags.map(t => `<span class="tag">${t}</span>`).join("")
    : "";

  panel.innerHTML = `
    <div class="poi-detail">
      <h2>${poi.name}</h2>
      <span class="tag">${poi.category}</span>
      <span class="tag">${poi.type}</span>
      ${tags}
      <p style="margin-top:12px">📍 ${poi.address}</p>
      <p>🕒 ${poi.openHours}</p>
      <p>🚶 约 ${poi.walkMinutes} 分钟（直线估算，实际以导航为准）</p>
      <p>📝 ${poi.description}</p>
      <button onclick='focusOn(${poi.longitude},${poi.latitude},18)'>
        定位到地图
      </button>
      <button onclick='window.CampusSearch && window.CampusSearch._routeFromMe && window.CampusSearch._routeFromMe(${JSON.stringify(poi).replace(/'/g, "&#39;")})'>
        从这里导航
      </button>
    </div>
  `;
}