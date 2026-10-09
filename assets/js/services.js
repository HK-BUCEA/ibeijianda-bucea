let serviceRole = "student";
let activeStage = 0;

document.addEventListener("DOMContentLoaded", () => {
  const bars = document.querySelectorAll(".role-bar");
  bars.forEach(bar => {
    bar.querySelectorAll(".role-btn").forEach(btn => {
      btn.addEventListener("click", () => switchRole(btn.dataset.role));
    });
  });
  renderStages();
  renderItems();
});

function switchRole(role){
  serviceRole = role;
  activeStage = 0;
  document.querySelectorAll(".role-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.role === role);
  });
  renderStages();
  renderItems();
}

function currentData(){
  return SERVICES_DATA[serviceRole] || [];
}

function renderStages(){
  const container = document.getElementById("serviceTabs");
  const data = currentData();
  container.innerHTML = data.map((group, i) => {
    return `<button class="service-tab${i === activeStage ? " active" : ""}" data-i="${i}">${group.stage}</button>`;
  }).join("");
  container.querySelectorAll(".service-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      activeStage = Number(tab.dataset.i);
      renderStages();
      renderItems();
    });
  });
}

function renderItems(){
  const data = currentData();
  const group = data[activeStage];
  const container = document.getElementById("serviceList");
  if(!group){container.innerHTML="";return;}
  container.innerHTML = group.items.map(item => `
    <div class="service-card">
      <h4>${item.name}</h4>
      <dl>
        <dt>责任部门</dt><dd>${item.dept}</dd>
        <dt>所需材料</dt><dd>${item.materials.join("、")}</dd>
        <dt>办理时长</dt><dd>${item.time}</dd>
        <dt>线上入口</dt><dd>${item.online}</dd>
        <dt>最近办理点</dt><dd>${item.nearby}</dd>
      </dl>
      <span class="badge ${item.onlineDo ? "online" : ""}">${item.onlineDo ? "可掌上办" : "线下办理"}</span>
      <span class="badge near">${item.nearDo ? "可就近办" : "需前往办理"}</span>
    </div>
  `).join("");
}
