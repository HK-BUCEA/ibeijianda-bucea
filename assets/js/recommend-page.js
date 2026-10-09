let recRole = "student";
let recMap = null;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#roleBar .role-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#roleBar .role-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      recRole = btn.dataset.role;
      renderRecommend();
    });
  });

  // 初始化推荐页地图
  AMapLoader.load({
    key: CONFIG.amapKey,
    version: "2.0",
    plugins: ["AMap.Walking"]
  }).then(AMap => {
    recMap = new AMap.Map("recMap", {
      zoom: CONFIG.map.zoom,
      center: [CONFIG.campus.longitude, CONFIG.campus.latitude]
    });
    new AMap.Marker({
      position: [CONFIG.campus.longitude, CONFIG.campus.latitude],
      title: CONFIG.campus.name
    }).setMap(recMap);
    renderRecommend();
  }).catch(() => {
    document.getElementById("recMap").innerHTML =
      '<div style="padding:40px;text-align:center;color:#6b7280">请在config.js中配置高德Key后查看地图</div>';
  });
});

function renderRecommend(){
  const list = recommend(recRole, POI_DATA, 12);
  const container = document.getElementById("recList");
  container.innerHTML = list.map((poi, i) => `
    <div class="rec-item" onclick="focusRec(${poi.longitude},${poi.latitude})">
      <span class="rank">${i + 1}</span>
      <h4>${poi.name}</h4>
      <p>${poi.type} · 约${poi.walkMinutes}分钟 · ${recommendReason(poi, recRole)}</p>
    </div>
  `).join("");

  // 在地图上高亮推荐点位
  if(recMap){
    recMap.clearMap();
    list.forEach(poi => {
      new AMap.Marker({
        position: [poi.longitude, poi.latitude],
        title: poi.name,
        content: '<div style="width:14px;height:14px;border-radius:50%;background:' +
          getCategoryColor(poi.category) +
          ';border:2px solid #fff"></div>',
        offset: new AMap.Pixel(-7, -7)
      }).setMap(recMap);
    });
  }
}

function focusRec(lng, lat){
  if(recMap) recMap.setZoomAndCenter(17, [lng, lat]);
}
