/**
 * campus-search.js —— 建大圈 校内建筑三级级联搜索 + 红色高亮 + 步行导航
 *
 * 交互路径：
 *   点击搜索框 → 7 大分类宫格
 *     → 点击“基础教学楼” → 基A / 基B / 基C / 基D
 *     → 点击“基A” → 地图 zoom 18 + 红色图钉 + 红色脉冲圈 + 详情面板 + 步行导航
 *   直接输入“基A / 图书馆 / 医务室”回车 → 同等效果
 *
 * 依赖（必须已挂 window）：
 *   window.map, window.AMap, window.CampusSearch,
 *   window.highlightBuilding, window.planWalkRoute,
 *   window.getCurrentPosition, window.focusOn, window.haversine,
 *   window.isValidCoord, CONFIG.campus
 *
 * 数据：assets/data/campus.json
 *   category 白名单：library / dormitory / basic-teaching / college / gym / playground / clinic
 */

const CAMPUS_CATEGORIES = [
  { key: "library",        label: "图书馆",       icon: "📚" },
  { key: "dormitory",      label: "宿舍楼",       icon: "🏠" },
  { key: "basic-teaching", label: "基础教学楼",   icon: "🏫" },
  { key: "college",        label: "学院楼",       icon: "🏢" },
  { key: "gym",            label: "体育馆",       icon: "🏟️" },
  { key: "playground",     label: "操场",         icon: "🏃" },
  { key: "clinic",         label: "医务室",       icon: "💊" }
];

let CAMPUS_DATA = [];
let searchIndex = {};   // { category: { icon, subCategories: { name: [buildings] } } }
let currentView = "category";

/* ================= 初始化 ================= */
async function init() {
  bindElements();

  try {
    const res = await fetch("assets/data/campus.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    CAMPUS_DATA = await res.json();
  } catch (e) {
    console.error("[campus-search] campus.json 加载失败：", e);
    console.error("  → 若报 Failed to fetch / CORS：说明仍在 file:// 打开，请用 Live Server");
    console.error("  → 若报 404：路径应为 assets/data/campus.json");
    CAMPUS_DATA = [];
  }

  buildIndex();
  renderCategories();
}

/* 从 JSON 自动推导分类索引，避免手写菜单与实际数据不一致 */
function buildIndex() {
  searchIndex = {};
  CAMPUS_CATEGORIES.forEach(cat => {
    const items = CAMPUS_DATA.filter(p => p && p.category === cat.key);
    const sub = {};
    items.forEach(p => {
      const k = p.subCategory || "其他";
      if (!sub[k]) sub[k] = [];
      sub[k].push(p);
    });
    searchIndex[cat.key] = { icon: cat.icon, label: cat.label, subCategories: sub };
  });
}

/* ================= 视图渲染 ================= */
function renderCategories() {
  const box = el("categoryView");
  if (!box) return;

  const total = CAMPUS_DATA.length;
  box.innerHTML = `<div class="cat-grid"></div>`;
  const grid = box.querySelector(".cat-grid");

  CAMPUS_CATEGORIES.forEach(cat => {
    const idx = searchIndex[cat.key];
    const count = idx ? Object.values(idx.subCategories).flat().length : 0;
    const card = document.createElement("div");
    card.className = "cat-card";
    card.innerHTML = `
      <span class="ico">${cat.icon}</span>
      <span class="nm">${cat.label}</span>
      <span class="cnt">${count} 处</span>
    `;
    card.addEventListener("click", () => showSubCategories(cat.key));
    grid.appendChild(card);
  });

  currentView = "category";
  activate("categoryView");
}

function showSubCategories(categoryKey) {
  const idx = searchIndex[categoryKey];
  if (!idx) return;

  const box = el("subCategoryView");
  if (!box) return;

  const names = Object.keys(idx.subCategories).sort();
  box.innerHTML = `
    <div class="dropdown-header" data-back="category">
      <span class="back">‹</span>
      <span>全部${idx.label}</span>
    </div>
    <div class="sub-list"></div>
  `;

  const list = box.querySelector(".sub-list");
  names.forEach(name => {
    const items = idx.subCategories[name];
    const item = document.createElement("div");
    item.className = "sub-item";
    item.innerHTML = `
      <span>${name}</span>
      <span class="badge">${items.length}</span>
    `;
    item.addEventListener("click", () => showBuildings(items, name));
    list.appendChild(item);
  });

  bindBack(box, "category");
  currentView = "subCategory";
  activate("subCategoryView");
}

function showBuildings(items, groupName) {
  const box = el("buildingView");
  if (!box) return;

  const sorted = (items || []).slice().sort((a, b) =>
    (a.shortName || a.name).localeCompare(b.shortName || b.name, "zh")
  );

  box.innerHTML = `
    <div class="dropdown-header" data-back="sub">
      <span class="back">‹</span>
      <span>${groupName}</span>
    </div>
    <div class="building-list"></div>
  `;

  const list = box.querySelector(".building-list");
  if (!sorted.length) {
    list.innerHTML = `<div class="empty-hint">该分类暂无建筑数据</div>`;
  }

  sorted.forEach(b => {
    const row = document.createElement("div");
    row.className = "building-item";
    row.innerHTML = `
      <div>
        <div class="nm">${b.name}</div>
        <div class="meta">${b.floor || ""} · ${b.address || ""}</div>
      </div>
      <span class="go">导航 ›</span>
    `;
    row.addEventListener("click", () => selectBuilding(b));
    list.appendChild(row);
  });

  bindBack(box, "sub");
  currentView = "building";
  activate("buildingView");
}

/* ================= 选中：红点 + 面板 + 导航 ================= */
function selectBuilding(building) {
  hide();

  if (!building || !isValidCoord(building.longitude, building.latitude)) {
    console.warn("[campus-search] 建筑坐标非法：", building && building.name);
    return;
  }

  // 1) 视角聚焦
  if (typeof focusOn === "function") {
    focusOn(building.longitude, building.latitude, 18);
  }

  // 2) 红色高亮标记
  if (typeof highlightBuilding === "function") {
    highlightBuilding(building);
  }

  // 3) 详情面板
  renderDetail(building);

  // 4) 真实路网步行导航
  planRoute(building);
}

function renderDetail(building) {
  const panel = el("detailPanel");
  if (!panel) return;

  const tags = [building.category, building.type].filter(Boolean)
    .map(t => `<span class="tag">${t}</span>`).join("");

  const facilities = Array.isArray(building.facilities)
    ? building.facilities.map(f => `<span class="tag">${f}</span>`).join("")
    : "";

  panel.innerHTML = `
    <div class="poi-detail campus-detail">
      <div class="detail-head">
        <span class="red-dot"></span>
        <h2>${building.name}</h2>
      </div>
      ${tags}
      <p style="margin-top:12px">📍 ${building.address}</p>
      <p>🏢 ${building.floor || "—"}</p>
      <p>🕒 ${building.openHours || "按校区作息"}</p>
      <p>🚶 <span id="walkInfo">正在计算步行时间…</span></p>
      ${facilities ? `<p>🧰 设施：${facilities}</p>` : ""}
      <p>📝 ${building.description || ""}</p>
      <div class="detail-actions">
        <button onclick='focusOn(${building.longitude},${building.latitude},19)'>
          放大查看
        </button>
        <button onclick='CampusSearch._routeFromMe(${JSON.stringify(building).replace(/'/g, "&#39;")})'>
          🧭 从这里出发导航
        </button>
      </div>
    </div>
  `;
}

/**
 * 步行导航（三级降级）
 *   1. 高德 Walking API 真实路网
 *   2. 校园中心为虚拟起点
 *   3. Haversine 直线距离 / 80 米每分钟
 */
function planRoute(building) {
  const target = [building.longitude, building.latitude];
  const info = el("walkInfo");

  const done = (mins, km, source) => {
    if (!info) return;
    info.innerHTML =
      `约 <b style="color:#e53935">${mins}</b> 分钟 · ${km} 公里` +
      (source === "估算" ? "（估算值，实际以现场导航为准）" : "（高德路网）");
  };

  const fallback = () => {
    const d = haversine(
      CONFIG.campus.latitude, CONFIG.campus.longitude,
      building.latitude, building.longitude
    );
    done(Math.max(1, Math.round(d / 80)), (d / 1000).toFixed(2), "估算");
  };

  if (typeof getCurrentPosition !== "function" || typeof planWalkRoute !== "function") {
    return fallback();
  }

  getCurrentPosition()
    .then(from => {
      planWalkRoute(from, target, res => {
        done(res.timeMinutes, res.distanceKm, res.source);
      }, fallback);
    })
    .catch(err => {
      console.warn("[campus-search] 定位失败，以校园中心为虚拟起点：", err.message);
      // ★ 关键：不阻断页面，降级为虚拟起点
      planWalkRoute([CONFIG.campus.longitude, CONFIG.campus.latitude], target, res => {
        done(res.timeMinutes, res.distanceKm, "估算");
        if (info) info.insertAdjacentHTML("beforebegin",
          `<p style="color:#d97706;font-size:12px">⚠ 未获取到你当前位置，以下为从校园中心的示例距离</p>`);
      }, fallback);
    });
}

/* ================= 关键字搜索（供 main.js 的 doSearch 调用）================= */
function searchByKeyword(kw) {
  if (!kw) return false;
  const k = kw.toLowerCase();

  const hit = CAMPUS_DATA.find(b =>
    (b.name && b.name.toLowerCase().includes(k)) ||
    (b.shortName && b.shortName.toLowerCase().includes(k)) ||
    (Array.isArray(b.keywords) && b.keywords.some(x => String(x).toLowerCase().includes(k))) ||
    (b.type && b.type.toLowerCase().includes(k)) ||
    (b.category && b.category.toLowerCase().includes(k))
  );

  if (!hit) return false;

  hide();
  selectBuilding(hit);
  return true;
}

/* 展示全部分类（输入框聚焦时） */
function showAll() {
  if (!CAMPUS_DATA.length) return;
  renderCategories();
  const dd = el("searchDropdown");
  if (dd) dd.classList.remove("hidden");
}

function clearHighlight() {
  if (typeof highlightBuilding !== "function") return;
  // 由 map.js 维护的 window._redMarker / window._redPulse
  if (window.map) {
    if (window._redMarker) { window.map.remove(window._redMarker); window._redMarker = null; }
    if (window._redPulse)  { window.map.remove(window._redPulse);  window._redPulse = null;  }
  }
}

/* ================= DOM 工具 ================= */
function el(id) {
  return document.getElementById(id);
}

function activate(id) {
  ["categoryView", "subCategoryView", "buildingView", "keywordResults"].forEach(v => {
    const node = el(v);
    if (!node) return;
    node.classList.toggle("active", v === id);
  });
}

function hide() {
  const dd = el("searchDropdown");
  if (dd) dd.classList.add("hidden");
}

function bindElements() {
  const input = el("searchInput");
  if (input) {
    input.addEventListener("input", onInput);
    input.addEventListener("focus", showAll);
  }
}

function onInput(e) {
  const kw = (e.target.value || "").trim();
  if (!kw) {
    showAll();
    return;
  }
  // 输入时实时命中：命中校内建筑则高亮，否则显示关键词结果
  if (!searchByKeyword(kw)) {
    renderKeywordResults(kw);
  }
}

function renderKeywordResults(kw) {
  const box = el("keywordResults");
  if (!box) return;

  const k = kw.toLowerCase();
  const list = CAMPUS_DATA.filter(b =>
    (b.name && b.name.toLowerCase().includes(k)) ||
    (b.shortName && b.shortName.toLowerCase().includes(k)) ||
    (Array.isArray(b.keywords) && b.keywords.join("").toLowerCase().includes(k))
  ).slice(0, 8);

  if (!list.length) {
    box.innerHTML = `<div class="empty-hint">未找到“${escapeHtml(kw)}”相关建筑<br>试试：基A、图书馆、医务室、操场</div>`;
  } else {
    box.innerHTML = `<div class="building-list"></div>`;
    const ul = box.querySelector(".building-list");
    list.forEach(b => {
      const row = document.createElement("div");
      row.className = "building-item";
      row.innerHTML = `
        <div>
          <div class="nm">${b.name}</div>
          <div class="meta">${b.category} · ${b.address || ""}</div>
        </div>
        <span class="go">导航 ›</span>
      `;
      row.addEventListener("click", () => selectBuilding(b));
      ul.appendChild(row);
    });
  }

  currentView = "keyword";
  activate("keywordResults");
}

function bindBack(container, to) {
  const header = container.querySelector(".dropdown-header");
  if (!header) return;
  header.addEventListener("click", () => {
    if (to === "category") renderCategories();
    // to === "sub" 时回到分类页首屏：简化为重绘分类
    if (to === "sub") renderCategories();
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

/* ================= 对外接口 ================= */
window.CampusSearch = {
  init,
  _search: searchByKeyword,     // 供 main.js doSearch 调用
  _routeFromMe: planRoute,      // 供详情面板“从这里出发”按钮
  hide,
  showAll,
  clearHighlight,
  selectBuilding
};

window.CAMPUS_DATA = CAMPUS_DATA;