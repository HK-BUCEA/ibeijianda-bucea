// 通用图表初始化
function renderBarChart(id, categories, series, title){
  const chart = echarts.init(document.getElementById(id));
  chart.setOption({
    tooltip: {trigger:"axis"},
    grid: {left:50,right:20,top:30,bottom:40},
    xAxis: {type:"category",data:categories,axisLabel:{color:"#6b7280"}},
    yAxis: {type:"value",axisLabel:{color:"#6b7280"}},
    series: [{
      type:"bar",
      data: series,
      itemStyle:{color:"#1f6feb",borderRadius:[6,6,0,0]},
      barWidth:"50%"
    }]
  });
  return chart;
}

function renderPieChart(id, data){
  const chart = echarts.init(document.getElementById(id));
  chart.setOption({
    tooltip:{trigger:"item"},
    legend:{bottom:0,textStyle:{color:"#6b7280"}},
    series:[{
      type:"pie",
      radius:["40%","65%"],
      center:["50%","45%"],
      data: data,
      label:{formatter:"{b}: {d}%"}
    }]
  });
  return chart;
}

// 响应式
window.addEventListener("resize", () => {
  document.querySelectorAll(".chart").forEach(el => {
    const inst = echarts.getInstanceByDom(el);
    if(inst) inst.resize();
  });
});
