// 设施数据：正式提交前需用高德API批量获取并做实地核验
const POI_DATA = [
  {id:"BJ001",name:"基础食堂",category:"宜居",type:"餐饮",longitude:116.3300,latitude:39.7273,address:"校内",openHours:"06:30-21:00",tags:["学生","教职工"],walkMinutes:3,description:"支持校园卡支付"},
  {id:"BJ002",name:"风味食堂",category:"宜居",type:"餐饮",longitude:116.3295,latitude:39.7268,address:"校内",openHours:"10:30-20:00",tags:["学生"],walkMinutes:4,description:"地方风味窗口"},
  {id:"BJ003",name:"清真食堂",category:"宜居",type:"餐饮",longitude:116.3305,latitude:39.7272,address:"校内",openHours:"06:30-20:30",tags:["学生","教职工"],walkMinutes:5,description:"清真餐饮"},
  {id:"BJ004",name:"基础教学楼A",category:"宜业",type:"教学",longitude:116.3292,latitude:39.7275,address:"校内",openHours:"07:00-22:00",tags:["学生"],walkMinutes:4,description:"日常教学"},
  {id:"BJ005",name:"基础教学楼B",category:"宜业",type:"教学",longitude:116.3303,latitude:39.7265,address:"校内",openHours:"07:00-22:00",tags:["学生","教职工"],walkMinutes:5,description:"日常教学"},
  {id:"BJ006",name:"土木楼",category:"宜业",type:"教学",longitude:116.3290,latitude:39.7265,address:"校内",openHours:"07:00-22:00",tags:["学生"],walkMinutes:6,description:"专业教学楼"},
  {id:"BJ007",name:"机电楼",category:"宜业",type:"教学",longitude:116.3308,latitude:39.7267,address:"校内",openHours:"07:00-22:00",tags:["学生"],walkMinutes:7,description:"专业教学楼"},
  {id:"BJ008",name:"电气楼",category:"宜业",type:"教学",longitude:116.3306,latitude:39.7276,address:"校内",openHours:"07:00-22:00",tags:["学生"],walkMinutes:5,description:"专业教学楼"},
  {id:"BJ009",name:"环能楼",category:"宜业",type:"教学",longitude:116.3297,latitude:39.7263,address:"校内",openHours:"07:00-22:00",tags:["学生"],walkMinutes:6,description:"专业教学楼"},
  {id:"BJ010",name:"图书馆",category:"宜业",type:"图书自习",longitude:116.3302,latitude:39.7278,address:"校内",openHours:"08:00-22:00",tags:["学生","教职工"],walkMinutes:3,description:"借阅、自习、研讨"},
  {id:"BJ011",name:"学生宿舍区A",category:"宜居",type:"宿舍",longitude:116.3295,latitude:39.7279,address:"校内",openHours:"全天",tags:["学生"],walkMinutes:2,description:"本科生宿舍"},
  {id:"BJ012",name:"学生宿舍区B",category:"宜居",type:"宿舍",longitude:116.3310,latitude:39.7275,address:"校内",openHours:"全天",tags:["学生"],walkMinutes:4,description:"本科生宿舍"},
  {id:"BJ013",name:"学生宿舍区C",category:"宜居",type:"宿舍",longitude:116.3290,latitude:39.7270,address:"校内",openHours:"全天",tags:["学生"],walkMinutes:5,description:"研究生宿舍"},
  {id:"BJ014",name:"学生宿舍区D",category:"宜居",type:"宿舍",longitude:116.3308,latitude:39.7262,address:"校内",openHours:"全天",tags:["学生"],walkMinutes:6,description:"研究生宿舍"},
  {id:"BJ015",name:"体育馆",category:"宜游",type:"运动健身",longitude:116.3293,latitude:39.7260,address:"校内",openHours:"08:00-21:30",tags:["学生","教职工"],walkMinutes:7,description:"室内运动"},
  {id:"BJ016",name:"田径场",category:"宜游",type:"运动健身",longitude:116.3307,latitude:39.7279,address:"校内",openHours:"06:00-22:00",tags:["学生","教职工"],walkMinutes:4,description:"跑步、训练"},
  {id:"BJ017",name:"篮球场",category:"宜游",type:"运动健身",longitude:116.3298,latitude:39.7276,address:"校内",openHours:"06:00-22:00",tags:["学生"],walkMinutes:3,description:"室外篮球"},
  {id:"BJ018",name:"网球场",category:"宜游",type:"运动健身",longitude:116.3312,latitude:39.7272,address:"校内",openHours:"08:00-21:00",tags:["学生","教职工"],walkMinutes:6,description:"室外网球"},
  {id:"BJ019",name:"校医院",category:"宜小",type:"医疗",longitude:116.3304,latitude:39.7266,address:"校内",openHours:"08:00-17:00",tags:["学生","教职工"],walkMinutes:5,description:"门诊、医保、体检"},
  {id:"BJ020",name:"心理咨询室",category:"宜小",type:"心理医疗",longitude:116.3301,latitude:39.7275,address:"校内",openHours:"09:00-17:00",tags:["学生"],walkMinutes:3,description:"预约咨询"},
  {id:"BJ021",name:"一卡通中心",category:"宜居",type:"校园服务",longitude:116.3303,latitude:39.7271,address:"校内",openHours:"08:30-17:00",tags:["学生","教职工"],walkMinutes:2,description:"办卡、充值、挂失"},
  {id:"BJ022",name:"快递服务中心",category:"宜居",type:"快递",longitude:116.3296,latitude:39.7272,address:"校内",openHours:"09:00-19:00",tags:["学生","教职工"],walkMinutes:4,description:"快递收发"},
  {id:"BJ023",name:"打印店",category:"宜业",type:"打印复印",longitude:116.3300,latitude:39.7269,address:"校内",openHours:"08:00-20:00",tags:["学生"],walkMinutes:3,description:"资料打印复印"},
  {id:"BJ024",name:"校内便利店",category:"宜居",type:"便利店",longitude:116.3305,latitude:39.7274,address:"校内",openHours:"07:00-23:00",tags:["学生","教职工"],walkMinutes:3,description:"日用百货"},
  {id:"BJ025",name:"校内书店",category:"宜业",type:"图书自习",longitude:116.3299,latitude:39.7270,address:"校内",openHours:"08:30-20:30",tags:["学生","教职工"],walkMinutes:2,description:"教材教辅"},
  {id:"BJ026",name:"ATM自助银行",category:"宜居",type:"银行",longitude:116.3302,latitude:39.7267,address:"校内",openHours:"全天",tags:["学生","教职工"],walkMinutes:4,description:"自助存取款"},
  {id:"BJ027",name:"AED急救点",category:"宜小",type:"应急设施",longitude:116.3301,latitude:39.7272,address:"校内",openHours:"全天",tags:["学生","教职工"],walkMinutes:2,description:"紧急救护设备"},
  {id:"BJ028",name:"无障碍卫生间",category:"宜小",type:"无障碍",longitude:116.3298,latitude:39.7274,address:"校内",openHours:"全天",tags:["学生","教职工"],walkMinutes:3,description:"无障碍设施"},
  {id:"BJ029",name:"电动自行车充电点",category:"宜居",type:"停车充电",longitude:116.3306,latitude:39.7270,address:"校内",openHours:"全天",tags:["学生","教职工"],walkMinutes:5,description:"车辆充电"},
  {id:"BJ030",name:"共享单车停放点",category:"宜居",type:"停车充电",longitude:116.3297,latitude:39.7269,address:"校内",openHours:"全天",tags:["学生"],walkMinutes:4,description:"短途接驳"},
  {id:"BJ031",name:"自助打印机",category:"宜业",type:"打印复印",longitude:116.3304,latitude:39.7273,address:"校内",openHours:"全天",tags:["学生"],walkMinutes:3,description:"24小时自助打印"},
  {id:"BJ032",name:"失物招领处",category:"宜居",type:"校园服务",longitude:116.3302,latitude:39.7270,address:"校内",openHours:"08:30-17:00",tags:["学生","教职工"],walkMinutes:3,description:"失物登记与认领"},
  {id:"BJ033",name:"开水房",category:"宜居",type:"校园服务",longitude:116.3294,latitude:39.7271,address:"校内",openHours:"06:00-23:00",tags:["学生"],walkMinutes:4,description:"热水供应"},
  {id:"BJ034",name:"垃圾分类站",category:"宜居",type:"校园服务",longitude:116.3307,latitude:39.7265,address:"校内",openHours:"全天",tags:["学生","教职工"],walkMinutes:5,description:"分类投放"},
  {id:"BJ035",name:"校园警务室",category:"宜居",type:"应急设施",longitude:116.3303,latitude:39.7276,address:"校内",openHours:"全天",tags:["学生","教职工"],walkMinutes:2,description:"治安求助"},
  {id:"BJ036",name:"校外早餐店",category:"宜居",type:"餐饮",longitude:116.3288,latitude:39.7274,address:"校园周边",openHours:"06:00-10:00",tags:["学生","教职工"],walkMinutes:8,description:"校外早餐"},
  {id:"BJ037",name:"校园南门便利店",category:"宜居",type:"便利店",longitude:116.3289,latitude:39.7268,address:"校园周边",openHours:"07:00-23:00",tags:["学生","教职工"],walkMinutes:8,description:"校外便利购物"},
  {id:"BJ038",name:"社区菜店",category:"宜居",type:"买菜",longitude:116.3285,latitude:39.7270,address:"校园周边",openHours:"07:00-21:00",tags:["教职工"],walkMinutes:10,description:"生鲜蔬菜"},
  {id:"BJ039",name:"社区卫生服务中心",category:"宜小",type:"医疗",longitude:116.3282,latitude:39.7265,address:"周边社区",openHours:"08:00-17:30",tags:["学生","教职工"],walkMinutes:12,description:"社区门诊、疫苗接种"},
  {id:"BJ040",name:"社区养老服务站",category:"宜老",type:"养老服务",longitude:116.3280,latitude:39.7278,address:"周边社区",openHours:"08:30-17:00",tags:["教职工"],walkMinutes:13,description:"老人活动、助餐"},
  {id:"BJ041",name:"社区托育点",category:"宜小",type:"托育",longitude:116.3283,latitude:39.7279,address:"周边社区",openHours:"07:30-18:00",tags:["教职工"],walkMinutes:12,description:"0-3岁托育服务"},
  {id:"BJ042",name:"社区公园",category:"宜游",type:"公园绿地",longitude:116.3278,latitude:39.7272,address:"周边社区",openHours:"06:00-22:00",tags:["学生","教职工"],walkMinutes:14,description:"休闲散步"},
  {id:"BJ043",name:"公交站（永源路）",category:"宜居",type:"公共交通",longitude:116.3315,latitude:39.7270,address:"校园周边",openHours:"全天",tags:["学生","教职工"],walkMinutes:6,description:"公交换乘"},
  {id:"BJ044",name:"校外打印复印店",category:"宜业",type:"打印复印",longitude:116.3287,latitude:39.7266,address:"校园周边",openHours:"08:00-20:00",tags:["学生"],walkMinutes:9,description:"低价打印"},
  {id:"BJ045",name:"公共厕所",category:"宜居",type:"公共服务",longitude:116.3293,latitude:39.7262,address:"校园周边",openHours:"全天",tags:["学生","教职工"],walkMinutes:11,description:"公共卫生间"},
  {id:"BJ046",name:"电动车充电站",category:"宜居",type:"停车充电",longitude:116.3284,latitude:39.7263,address:"校园周边",openHours:"全天",tags:["教职工"],walkMinutes:11,description:"公共充电"},
  {id:"BJ047",name:"公共自行车站点",category:"宜居",type:"停车充电",longitude:116.3314,latitude:39.7276,address:"校园周边",openHours:"全天",tags:["学生","教职工"],walkMinutes:5,description:"短途接驳"},
  {id:"BJ048",name:"校外药店",category:"宜小",type:"医疗",longitude:116.3286,latitude:39.7276,address:"校园周边",openHours:"08:00-22:00",tags:["学生","教职工"],walkMinutes:9,description:"常用药品"},
  {id:"BJ049",name:"社区快递驿站",category:"宜居",type:"快递",longitude:116.3281,latitude:39.7273,address:"周边社区",openHours:"09:00-20:00",tags:["教职工"],walkMinutes:12,description:"社区快递代收"},
  {id:"BJ050",name:"校外书店",category:"宜业",type:"图书自习",longitude:116.3288,latitude:39.7271,address:"校园周边",openHours:"09:00-21:00",tags:["学生","教职工"],walkMinutes:8,description:"教辅与考试用书"}
];

// 分类配置
const CATEGORIES = [
  {key:"宜居",color:"#2ecc71",label:"宜居"},
  {key:"宜业",color:"#1f6feb",label:"宜业"},
  {key:"宜游",color:"#9b59b6",label:"宜游"},
  {key:"宜老",color:"#e67e22",label:"宜老"},
  {key:"宜小",color:"#e74c3c",label:"宜小"}
];

function getCategoryColor(category){
  const item = CATEGORIES.find(c => c.key === category);
  return item ? item.color : "#1f6feb";
}
