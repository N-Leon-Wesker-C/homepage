# 个人主页使用说明

仿《女神异闻录 3 Reload》官网风格的个人主页。双击 `index.html` 即可在浏览器打开;部署到 GitHub Pages 等静态托管时,整个 `personal` 文件夹上传即可(路径已是纯英文)。

## 文件结构

```
personal/
├── index.html              页面内容(文案、板块、占位块都在这)
└── assets/
    ├── css/
    │   ├── top.css         原站样式原样复制(唯一改动:删了 3 个失效字体声明)——不要改它
    │   ├── fonts.css       中文字体 Noto Sans SC(远程加载)
    │   └── personal.css    本页全部新增样式(覆盖/调色都写在这里)
    ├── js/personal.js      交互脚本:开场、入场动画、平滑滚动、画廊钉住滑动、手风琴、菜单
    └── img/                你自己的图片放这里(目前为空)
```

维护原则:**top.css 保持原样**,一切改动都往 `personal.css` / `personal.js` / `index.html` 里写。

---

## 一、还缺什么(待办清单)

### 文案(全部是占位符,搜索"你的名字"可快速定位)

| 位置 | 现在的内容 | 要改成 |
|---|---|---|
| `<title>` / meta description | 你的名字 · 个人主页 | 你的真实姓名/昵称 |
| 首屏 | 你的名字 / 个人主页 · 前端开发 / 设计 / 随笔 | 姓名 + 一句话定位 |
| 关于我三段 | 占位介绍 | 自我介绍(每段 1~2 行,过长会被裁剪,见下) |
| 项目作品简介 | 占位文案 | 作品区说明 |
| 6 个项目卡片 | 项目名称一~六 / 2026 / WEB | 真实项目名、年份、类型、简介、技术栈、链接(href="#" 处) |
| 随笔 | 2 条占位条目 | 随笔标题(日期+标题)、摘要、全文链接 |
| 联系方式 | you@example.com / 上海 · 可远程 | 邮箱、坐标、状态 |
| 页脚链接 | GitHub / Email / Blog、bilibili | 真实链接 |
| 版权行 | © 2026 你的名字 | 你的署名 |
| 加载屏 | YOUR NAME / MY PORTFOLIO | 在 `personal.js` 里搜 `loading-logo`、`loading-text` |
| 关于我底部水印 | PORTFOLIO | `index.html` 里搜 `bg-word`(可选) |
| 三行格言 | Stay hungry / Stay foolish / Keep shipping | 搜 `story-text3`(可选) |

> 关于我三段文字的注意:原站动画是"固定高度 + 逐行上滑",每段超过 2 行会被裁掉。要写长文请改 `personal.css` 里 `.story-text1 > p` 的 `height`(当前 66px ≈ 两行)。

### 素材

| 项目 | 现在 | 要做 |
|---|---|---|
| 首屏背景 | 渐变占位 | 换成你的图(规格见下) |
| 关于我头像 | 蓝色渐变占位 | 换成头像/照片 |
| 随笔配图 | 薄荷渐变占位 | 换成配图 |
| 页脚 LOGO | "MY LOGO" 色块 | 换成自己的 LOGO |
| 网站图标 favicon | 纯蓝方块(data URI) | 换成自己的图标 |

### 可选的增强

- **字体本地化**:Syncopate / Urbanist 目前从 Google Fonts 在线加载,断网回退系统字体。想彻底离线:从 GitHub(google/fonts 仓库)下载这两个字体(OFL 协议,可商用)放 `assets/fonts/`,在 `personal.css` 里重新声明 `@font-face`。
- **分享标签**:`index.html` head 里目前没有 og: 标签,部署后可补(标题、描述、预览图)。
- **删除占位样式**:所有图片都换好后,可删除 `personal.css` 里 `.ph` 系列规则和 `--ph-*` 变量。

---

## 二、图片规格(准备图片时按这个尺寸做)

| 位置 | 建议尺寸 | 比例 | 说明 |
|---|---|---|---|
| 首屏背景(`.ph-fv`) | **1920×1080**(或 2560×1440) | 16:9 | 全屏铺满,会自动裁切适配窗口;页面文字是白色的,图选深色系 |
| 关于我头像(`story-img introduction-img`) | **1000×425**(2 倍清晰可给 2000×850) | 2.35:1 | 高度固定 425px、宽度最大 1000px 自适应;同一张图在移动端显示为 650×277,比例相同,无需另做 |
| 随笔配图(`story-img game-system-img`) | **1000×425** | 2.35:1 | 同上 |
| 作品卡片封面(可选) | 320×360(移动端 280×300) | 竖版 | 目前卡片是纯色块,换图时保留卡片结构、去掉背景色即可 |
| 页脚 LOGO(`.p3r-logo`) | **140×40**(2 倍清晰 280×80) | — | 浅色底,logo 颜色用深蓝 #1d384a 系最协调 |
| 网站图标 | 16×16 或 32×32(SVG 矢量更佳) | 1:1 | 替换 head 里的 data URI |

### 怎么换图

`.story-img` 系列的占位块是 `<div>` + CSS 背景的实现方式(原站模式),换图有两种做法:

**做法 A(推荐,保持原站实现)**:在 `personal.css` 里给你的图加一条背景规则:

```css
.story-img.introduction-img {
  background: url(../img/me.webp) center top no-repeat;
  background-size: auto 100%;
}
```

然后从 `index.html` 里删掉对应的 `ph` 类。

**做法 B(直接放 `<img>` 标签)**:删掉 `ph` 类和 `data-ph` 属性,在 div 里放 `<img src="assets/img/me.webp" alt="">`,并在 `personal.css` 补一条 `.story-img img { width: 100%; height: 100%; object-fit: cover; }`。

首屏、页脚 LOGO 同理;所有占位块都带 `data-ph="xxx"` 标签文字,换完记得删干净 `ph` 类。

---

## 三、常用调节点

| 想调什么 | 在哪调 |
|---|---|
| 画廊滑动速度 | `personal.js` 顶部画廊模块的 `SCROLL_RATIO`(当前 1.5,越大越慢,1 = 原站手感) |
| 画廊六种背景色 | `personal.js` 里的 `palette` 数组(与卡片顺序一一对应) |
| 各板块英文标题色 | `personal.css` 里 `.title-kicker` 的四个板块规则(蓝/粉/绿/橙) |
| 首屏渐变/光晕 | `personal.css` 里 `.ph-fv` |
| 占位块配色 | `personal.css` 里 `.ph` / `.ph-blue` / `.ph-mint` 的 `--ph-from/mid/to` 变量 |
| 标题屏高度 | `personal.css` 里 `.works .wrapper` 的 `min-height` |
| 加载开场速度 | `personal.js` 里 `runLoading()` 的延时(600ms 起浪、2.5s 滑走) |

## 四、发布前检查清单

- [ ] F12 控制台零报错
- [ ] 窗口缩到 750px 以下:汉堡菜单、手风琴、画廊手指滑动正常,无横向滚动条
- [ ] 断网刷新:字体回退系统字体,版面不破
- [ ] 所有 `data-ph` 占位块已换成自己的图;所有 `href="#"` 已替换为真实链接
- [ ] 版权行已改为自己的署名(保留"风格参考 Persona 3 Reload 官网"字样更稳妥)
- [ ] 文案里没有残留"你的名字 / 项目名称一 / you@example.com"

## 五、版权提示

页面布局、配色、动效为风格借鉴(学习用途);本项目中不含任何 ATLUS/SEGA 的图片、LOGO、词标或文案素材,波浪与装饰图形均为自绘。公开发布前请确认所有占位图都已替换为你拥有使用权的素材。

---

## 六、部署指南

本页面是**纯静态站**(无构建步骤、无后端),整个 `personal` 文件夹上传到任何静态托管即可,内部相对路径保持不变就行。

### 部署前必做

- [ ] 按第一节清单填完文案、换完图片,替换所有 `href="#"` 与 `data-ph` 占位
- [ ] favicon 换成自己的
- [ ] 图片压缩成 webp(首屏背景控制在 500KB 以内)
- [ ] head 里补 og: 分享标签(标题/描述/预览图)
- [ ] ⚠️ **字体问题(重要)**:现在 Syncopate/Urbanist/Noto Sans SC 都从 Google Fonts 加载,**国内无法访问**。部署到国内访问的环境前,把字体本地化:下载字体文件放 `assets/fonts/`,在 `personal.css` 重新声明 `@font-face`,并删除 `index.html` 里的 Google Fonts `<link>` 与 `fonts.css` 引用(或干脆接受系统字体回退,中文回退微软雅黑效果也可接受)

### 托管选择

| 平台 | 适合场景 | 说明 |
|---|---|---|
| **GitHub Pages** | 有 GitHub 账号 | 免费;把 `personal` 文件夹作为仓库根目录推送,Settings → Pages 启用即可;国内访问不稳定 |
| **Cloudflare Pages** | 免备案、国内可用 | 免费;连接 GitHub 仓库自动部署,自带 HTTPS 和全球 CDN |
| **Netlify / Vercel** | 最省事 | 免费;Netlify Drop 直接拖文件夹上传即可获得网址;国内速度一般 |
| **Gitee Pages** | 纯国内 | 免费但需实名认证、人工审核,且服务时有暂停 |
| **腾讯云 COS / 阿里云 OSS** | 有已备案域名 | 静态网站托管 + CDN,国内速度最好;需域名 ICP 备案 |

自定义域名:各平台后台绑定域名后,去域名服务商(阿里云/腾讯云)加一条 CNAME 记录即可,HTTPS 证书平台自动签发。境外托管(Cloudflare/Vercel/Netlify)不需要备案。

### 首次部署(GitHub Pages 示例)

```bash
cd personal
git init
git add .
git commit -m "init: personal homepage"
# 在 GitHub 新建仓库后:
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

然后 GitHub 仓库 Settings → Pages → Source 选 main 分支根目录 → 保存,几分钟后访问 `https://<用户名>.github.io/<仓库名>/`。

---

## 七、进一步完善的方向

**建议按顺序做:**

1. **版本管理**:现在还不是 git 仓库,尽快 `git init` 提交一次,之后的改动都有据可查
2. **SEO**:补 og/twitter 标签、生成 `sitemap.xml`、`robots.txt`;`title` 和 description 用真实姓名
3. **统计(可选)**:国内用百度统计,境外用 Google Analytics;注重隐私可用自托管 umami
4. **性能**:跑一次 Lighthouse;给首屏之外的图加 `loading="lazy"`;字体用 `preload`(本地化后)
5. **随笔接真实博客**:条目链接指向 Hexo/Hugo 生成的博客,或语雀/掘金文章;想要评论区可用 Giscus(GitHub Discussions 驱动,无广告)
6. **功能扩展(按兴趣)**:暗色模式、作品详情加图、简历 PDF 下载、RSS
7. **无障碍**:已支持键盘焦点样式、`prefers-reduced-motion` 降级和 aria 属性,保持这个水准即可
