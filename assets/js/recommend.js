// 身份偏好规则
const RECOMMEND_RULES = {
  student: ["餐饮","图书自习","打印复印","快递","运动健身","心理医疗","教学","校园服务","便利店"],
  staff: ["停车充电","医疗","办公场地","通勤","子女托育","养老退休","银行"]
};

// 计算单个设施推荐分
function calcScore(poi, rules){
  let score = 0;

  // 类型匹配
  if(rules.includes(poi.type)) score += 50;
  if(rules.includes(poi.category)) score += 10;

  // 步行时间越短越好
  score += Math.max(0, 30 - poi.walkMinutes);

  // 开放状态加分（有开放时间即视为可服务）
  if(poi.openHours) score += 5;

  return score;
}

// 生成推荐列表
function recommend(role, data, topN){
  const rules = RECOMMEND_RULES[role] || [];
  return data
    .map(poi => ({...poi, score: calcScore(poi, rules)}))
    .sort((a, b) => b.score - a.score || a.walkMinutes - b.walkMinutes)
    .slice(0, topN || 10);
}

// 生成推荐理由
function recommendReason(poi, role){
  const reasons = [];
  const rules = RECOMMEND_RULES[role] || [];

  if(rules.includes(poi.type)) reasons.push("符合你的服务偏好");
  if(poi.walkMinutes <= 5) reasons.push("步行5分钟内可达");
  else if(poi.walkMinutes <= 10) reasons.push("步行10分钟内可达");
  else reasons.push("步行15分钟内可达");
  if(poi.openHours) reasons.push("提供明确开放时段");

  return reasons.slice(0, 2).join(" · ");
}
