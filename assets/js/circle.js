document.addEventListener("DOMContentLoaded", () => {
  // 示例统计结果：正式版由Python/OSMnx计算后注入
  const stats = [
    {label:"纳入统计的设施",num:50,cls:"num"},
    {label:"15分钟可达覆盖率",num:"78%",cls:"num green"},
    {label:"缺口设施类别数",num:3,cls:"num red"},
    {label:"重点关注区域",num:4,cls:"num orange"}
  ];

  document.getElementById("statCards").innerHTML = stats.map(s => `
    <div class="stat-card"><div class="${s.cls}">${s.num}</div><p>${s.label}</p></div>
  `).join("");

  // 圈层设施覆盖
  renderBarChart("chartCircle",
    ["5分钟","10分钟","15分钟"],
    [12, 27, 39],
    "各圈层设施数量"
  );

  // 类别达标率
  renderBarChart("chartCategory",
    ["餐饮","便利店","医疗","运动","托育","养老"],
    [100, 95, 70, 85, 45, 30],
    "类别达标率"
  );

  // 人群差异
  renderPieChart("chartGroup",[
    {name:"学生",value:68,itemStyle:{color:"#1f6feb"}},
    {name:"教职工",value:32,itemStyle:{color:"#e67e22"}}
  ]);

  // 缺口分布
  renderBarChart("chartGap",
    ["托育","养老","社区医疗","生鲜买菜","夜间餐饮"],
    [8, 6, 5, 4, 3],
    "缺口点位数量"
  );

  // 缺口清单
  const gaps = [
    {area:"校外西南社区",level:"high",levelText:"重点",desc:"托育、养老服务步行超过15分钟"},
    {area:"校园西侧宿舍",level:"high",levelText:"重点",desc:"缺少24小时便利店与应急设施"},
    {area:"校园东南角",level:"mid",levelText:"一般",desc:"社区医疗与买菜设施较远"},
    {area:"校外北侧社区",level:"low",levelText:"关注",desc:"夜间餐饮与运动设施不足"}
  ];

  document.getElementById("gapList").innerHTML = `
    <h3>重点短板区域</h3>
    ${gaps.map(g => `
      <div class="gap-item">
        <div><strong>${g.area}</strong>　<span style="color:#6b7280">${g.desc}</span></div>
        <span class="gap-level ${g.level === 'high' ? 'gap-high' : g.level === 'mid' ? 'gap-mid' : 'gap-low'}">${g.levelText}</span>
      </div>
    `).join("")}
  `;
});
