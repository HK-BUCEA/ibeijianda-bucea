document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("optimizeSummary").innerHTML = OPTIMIZE_DATA.summary.map(s => `
    <div class="stat-card"><div class="${s.cls}">${s.value}</div><p>${s.label}</p></div>
  `).join("");

  // 优化前后对比
  const chart = echarts.init(document.getElementById("chartBeforeAfter"));
  chart.setOption({
    tooltip:{trigger:"axis"},
    legend:{data:["现状","优化后"],bottom:0},
    grid:{left:50,right:20,top:30,bottom:50},
    xAxis:{type:"category",data:OPTIMIZE_DATA.beforeAfter.categories,axisLabel:{color:"#6b7280"}},
    yAxis:{type:"value",max:100,axisLabel:{formatter:"{value}%",color:"#6b7280"}},
    series:[
      {name:"现状",type:"bar",data:OPTIMIZE_DATA.beforeAfter.before,itemStyle:{color:"#c7d2fe",borderRadius:[6,6,0,0]},barWidth:"30%"},
      {name:"优化后",type:"bar",data:OPTIMIZE_DATA.beforeAfter.after,itemStyle:{color:"#1f6feb",borderRadius:[6,6,0,0]},barWidth:"30%"}
    ]
  });

  // 优先级
  renderBarChart("chartPriority",
    OPTIMIZE_DATA.priority.map(p => p.name),
    OPTIMIZE_DATA.priority.map(p => p.value),
    "补建优先级"
  );

  // 候选点表
  document.getElementById("candidateTable").innerHTML = `
    <h3>候选补建点建议（研究阶段）</h3>
    <table>
      <thead>
        <tr><th>候选点位</th><th>建议设施</th><th>可用面积</th><th>预计受益</th><th>优先级</th><th>改造成本</th></tr>
      </thead>
      <tbody>
        ${OPTIMIZE_DATA.candidates.map(c => `
          <tr>
            <td>${c.name}</td><td>${c.type}</td><td>${c.area}</td>
            <td>${c.benefit}</td>
            <td><span class="gap-level ${c.priority === '高' ? 'gap-high' : 'gap-mid'}">${c.priority}</span></td>
            <td>${c.cost}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <p style="font-size:12px;color:#6b7280;margin-top:12px">优先级由缺口数量、受益人口、步行时间、改造条件综合评分得到，具体落地需结合校园与社区规划。</p>
  `;
});
