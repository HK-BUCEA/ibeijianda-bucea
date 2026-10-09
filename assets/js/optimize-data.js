// 优化方案候选点与效果数据
const OPTIMIZE_DATA = {
  summary: [
    {label:"现状综合覆盖率",value:"68%",cls:"num red"},
    {label:"优化后覆盖率",value:"86%",cls:"num green"},
    {label:"建议补建设施",value:5,cls:"num"},
    {label:"重点受益人群",value:"1200+",cls:"num orange"}
  ],
  candidates: [
    {name:"校园西南角闲置用房",type:"社区托育点",area:"60㎡",benefit:"服务教职工子女120人",priority:"高",cost:"低"},
    {name:"校外西南社区边角地",type:"社区养老服务站",area:"80㎡",benefit:"服务周边老人80人",priority:"高",cost:"中"},
    {name:"宿舍区架空层",type:"24小时自助服务站",area:"40㎡",benefit:"覆盖西侧宿舍600人",priority:"高",cost:"低"},
    {name:"校园东南临街商铺",type:"生鲜便利店",area:"50㎡",benefit:"服务师生500人",priority:"中",cost:"中"},
    {name:"校外北侧社区闲置房",type:"社区医疗延伸点",area:"70㎡",benefit:"补充社区医疗服务",priority:"中",cost:"高"}
  ],
  beforeAfter: {
    categories: ["餐饮","便利店","医疗","托育","养老","运动","公共服务"],
    before: [100, 60, 70, 20, 15, 85, 75],
    after: [100, 92, 88, 65, 60, 90, 95]
  },
  priority: [
    {name:"社区托育",value:9.2},
    {name:"养老服务",value:8.5},
    {name:"24小时便利店",value:8.0},
    {name:"社区医疗",value:7.4},
    {name:"生鲜买菜",value:6.8}
  ]
};
