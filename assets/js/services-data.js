// 办事事项库：按人群与阶段组织
const SERVICES_DATA = {
  student: [
    {
      stage: "入学报到",
      items: [
        {name:"新生注册",dept:"教务处",materials:["录取通知书","身份证","档案"],online:"学校迎新系统",nearby:"基础教学楼A",time:"当天",onlineDo:true,nearDo:true},
        {name:"学籍信息确认",dept:"教务处",materials:["学生证","身份证"],online:"教务管理系统",nearby:"基础教学楼A",time:"3个工作日",onlineDo:true,nearDo:false},
        {name:"校园卡办理",dept:"一卡通中心",materials:["身份证","一寸照片"],online:"一卡通平台",nearby:"一卡通中心",time:"当场",onlineDo:true,nearDo:true},
        {name:"宿舍入住登记",dept:"学生处",materials:["录取通知书","身份证"],online:"—",nearby:"各宿舍楼",time:"当天",onlineDo:false,nearDo:true}
      ]
    },
    {
      stage: "在校学习",
      items: [
        {name:"图书借阅",dept:"图书馆",materials:["校园卡"],online:"图书馆官网",nearby:"图书馆",time:"当场",onlineDo:true,nearDo:true},
        {name:"自习室预约",dept:"图书馆",materials:["校园卡"],online:"预约系统",nearby:"图书馆",time:"当天",onlineDo:true,nearDo:true},
        {name:"奖助学金申请",dept:"学生处",materials:["成绩单","申请表","证明"],online:"学工系统",nearby:"学生处办公室",time:"10个工作日",onlineDo:true,nearDo:false},
        {name:"学生证补办",dept:"教务处",materials:["挂失凭证","一寸照片","工本费"],online:"教务管理系统",nearby:"基础教学楼A",time:"5个工作日",onlineDo:true,nearDo:true},
        {name:"论文查重",dept:"图书馆",materials:["论文电子版"],online:"查重系统",nearby:"图书馆电子阅览室",time:"当天",onlineDo:true,nearDo:true}
      ]
    },
    {
      stage: "生活服务",
      items: [
        {name:"宿舍报修",dept:"后勤处",materials:["房间号","故障描述"],online:"后勤报修系统",nearby:"宿舍楼值班室",time:"1-3天",onlineDo:true,nearDo:true},
        {name:"快递代收查询",dept:"快递服务中心",materials:["取件码"],online:"快递平台",nearby:"快递服务中心",time:"当场",onlineDo:true,nearDo:true},
        {name:"校园卡充值",dept:"一卡通中心",materials:["校园卡"],online:"一卡通App",nearby:"一卡通中心",time:"当场",onlineDo:true,nearDo:true},
        {name:"心理咨询预约",dept:"心理咨询室",materials:["校园卡"],online:"心理预约系统",nearby:"心理咨询室",time:"1-3天",onlineDo:true,nearDo:true},
        {name:"医保参保",dept:"校医院",materials:["身份证","照片"],online:"学校医保平台",nearby:"校医院",time:"7个工作日",onlineDo:true,nearDo:true}
      ]
    },
    {
      stage: "就业创业",
      items: [
        {name:"就业协议签约",dept:"就业指导中心",materials:["三方协议","成绩单"],online:"就业系统",nearby:"就业指导中心",time:"3个工作日",onlineDo:true,nearDo:true},
        {name:"实习证明开具",dept:"学院办公室",materials:["实习证明模板","单位盖章"],online:"—",nearby:"各学院办公室",time:"3个工作日",onlineDo:false,nearDo:true},
        {name:"创业补贴查询",dept:"就业指导中心",materials:["创业计划书"],online:"就业系统",nearby:"就业指导中心",time:"5个工作日",onlineDo:true,nearDo:false}
      ]
    },
    {
      stage: "医疗健康",
      items: [
        {name:"校医院门诊",dept:"校医院",materials:["校园卡"],online:"—",nearby:"校医院",time:"当场",onlineDo:false,nearDo:true},
        {name:"医保报销",dept:"校医院",materials:["发票","病历","银行卡"],online:"—",nearby:"校医院",time:"5个工作日",onlineDo:false,nearDo:true},
        {name:"体检预约",dept:"校医院",materials:["校园卡"],online:"校医院公众号",nearby:"校医院",time:"当天",onlineDo:true,nearDo:true}
      ]
    }
  ],
  staff: [
    {
      stage: "入职报到",
      items: [
        {name:"入职登记",dept:"人事处",materials:["身份证","学历学位证","体检报告"],online:"人事系统",nearby:"行政楼",time:"3个工作日",onlineDo:true,nearDo:true},
        {name:"工牌办理",dept:"人事处",materials:["一寸照片"],online:"人事系统",nearby:"行政楼",time:"当天",onlineDo:true,nearDo:true}
      ]
    },
    {
      stage: "工作服务",
      items: [
        {name:"办公场地预约",dept:"行政办公室",materials:["申请单","用途说明"],online:"OA系统",nearby:"行政楼",time:"1个工作日",onlineDo:true,nearDo:true},
        {name:"会议室预订",dept:"行政办公室",materials:["校园卡"],online:"OA系统",nearby:"行政楼",time:"当天",onlineDo:true,nearDo:true},
        {name:"科研设备申请",dept:"科研处",materials:["项目编号","申请表"],online:"科研管理系统",nearby:"科研处办公室",time:"3个工作日",onlineDo:true,nearDo:false}
      ]
    },
    {
      stage: "生活服务",
      items: [
        {name:"住房补贴申请",dept:"人事处",materials:["劳动合同","房产证明"],online:"人事系统",nearby:"行政楼",time:"10个工作日",onlineDo:true,nearDo:false},
        {name:"停车证办理",dept:"保卫处",materials:["行驶证","工作证"],online:"—",nearby:"保卫处",time:"当场",onlineDo:false,nearDo:true},
        {name:"通勤班车查询",dept:"后勤处",materials:["校园卡"],online:"后勤公众号",nearby:"校园南门",time:"当场",onlineDo:true,nearDo:true},
        {name:"补充医疗报销",dept:"人事处",materials:["发票","诊断证明"],online:"人事系统",nearby:"行政楼",time:"10个工作日",onlineDo:true,nearDo:false}
      ]
    },
    {
      stage: "家庭子女",
      items: [
        {name:"子女入学咨询",dept:"工会",materials:["户口本","工作证"],online:"—",nearby:"工会办公室",time:"当面咨询",onlineDo:false,nearDo:true},
        {name:"托育服务查询",dept:"工会",materials:["出生证明","工作证"],online:"—",nearby:"周边社区托育点",time:"当面咨询",onlineDo:false,nearDo:true},
        {name:"家属医保办理",dept:"人事处",materials:["户口本","身份证"],online:"人事系统",nearby:"行政楼",time:"7个工作日",onlineDo:true,nearDo:false}
      ]
    },
    {
      stage: "养老退休",
      items: [
        {name:"退休手续办理",dept:"人事处",materials:["身份证","工作档案"],online:"人事系统",nearby:"行政楼",time:"15个工作日",onlineDo:true,nearDo:true},
        {name:"养老保险查询",dept:"人事处",materials:["身份证"],online:"社保平台",nearby:"—",time:"当天",onlineDo:true,nearDo:false},
        {name:"社区养老服务咨询",dept:"周边社区",materials:["身份证"],online:"—",nearby:"社区养老服务站",time:"当面咨询",onlineDo:false,nearDo:true}
      ]
    }
  ]
};
