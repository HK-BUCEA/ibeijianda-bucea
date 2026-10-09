# 建大圈｜北建大大兴校区15分钟生活圈服务平台

## 项目说明
面向“天枢杯”智慧城市创新应用赛道中《基于时空大数据的15分钟宜居生活圈优化规划与应用》赛题的网页原型。
提供生活地图、生活圈体检、个性化推荐、办事导办和优化方案五个模块。

## 技术栈
- HTML5 / CSS3 / 原生 JavaScript
- 高德地图 JavaScript API（地图、标记、步行路线）
- ECharts（体检与优化图表）
- Python ＋ OSMnx / QGIS（路网、等时圈与空间指标计算，独立于网页运行）

## 目录结构
```
index.html        # 生活地图首页
circle.html       # 生活圈体检
recommend.html    # 个性化推荐
services.html     # 全周期办事事项
optimize.html     # 优化方案
assets/
  css/style.css
  js/config.js    # 高德Key配置
  js/poi.js       # 设施数据
  js/map.js       # 地图与路线
  js/main.js      # 首页交互
  js/recommend.js # 推荐算法
  js/services-data.js
  js/optimize-data.js
  js/chart.js     # ECharts封装
  js/circle.js
  js/recommend-page.js
  js/services.js
  js/optimize.js
```

## 运行方式
1. 用编辑器打开 `assets/js/config.js`；
2. 填入高德开放平台 Web端 Key 和安全密钥；
3. 使用 Live Server 或任意静态服务器打开 `index.html`；
4. 地图页面需通过 http/https 访问，直接双击 file:// 可能无法加载地图。

## 后续接真实分析
- Python 批量调用高德 Place / Walking API，生成真实设施数据与步行时间；
- OSMnx 计算真实路网等时圈，输出 GeoJSON；
- 将圈层半径、覆盖率、缺口数据回填到对应 JS 数据文件；
- 用 QGIS 制作专题图，导入网页作为成果图。
