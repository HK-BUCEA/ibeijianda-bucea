// ===== 高德地图 JS API 配置 =====
// 使用方式：
// 1. 在高德开放平台创建“Web端 JS API”应用
// 2. 将下方 key 换成你的 Web端 Key
// 3. 将 securityJsCode 换成对应的安全密钥
// 4. 若使用本地文件协议(file://)无法加载地图，请用 Live Server 或部署到 https
window._AMapSecurityConfig = {
  securityJsCode: "fc4d39f7fb073e57b546c27738fcd92c"
};

const CONFIG = {
  amapKey: "3fec68ce9c7a712a986c7a5a4e2bf2c5",

  campus: {
    name: "北京建筑大学大兴校区",
    longitude: 116.286182,
    latitude: 39.752322,
    address: "北京市大兴区永源路15号"
  },

  // 步行圈初值（米），后续用真实路网/实测数据校准
  walking: {
    fiveMinutes: 350,
    tenMinutes: 700,
    fifteenMinutes: 1050
  },

  map: {
    zoom: 16,
    zoomControl: true
  },

  storageKey: "jiandaquan_user"
};
