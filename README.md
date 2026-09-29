# 个人主页使用说明

仿《女神异闻录 3 Reload》官网风格的个人主页。双击 `index.html` 即可在浏览器打开;部署到 GitHub Pages 等静态托管时,整个 `personal` 文件夹上传即可(路径已是纯英文)。

## 文件结构

```
personal/                     ← 本目录就是一个 git 仓库(已初始化,main 分支)
├── index.html              首页骨架(板块、占位块;作品/随笔的内容不在这)
├── essay.html              文章阅读页(打开 essay.html?p=文件名 显示某一篇)
├── README.md               本文档
├── .gitignore
├── content/                ← 日常更新的内容都放在这几个文件夹
│   ├── works/works.js      作品数据(画廊卡片 + 详情)
│   └── essays/
│       ├── essays.js       随笔"目录"(列表条目 + 指向正文文件的文件名)
│       └── posts/          随笔正文,一篇一个文件
│           ├── _template.js   ← 新文章就复制它(空模板 + 写法注释)
│           ├── hello-world.js 示例:各种排版元素
│           └── study-notes.js 示例:学习笔记
└── assets/
    ├── css/
    │   ├── top.css         原站样式原样复制(唯一改动:删了 3 个失效字体声明)——不要改它
    │   ├── fonts.css       本地字体声明(Syncopate/Urbanist/Noto Sans SC,全部自托管)
    │   ├── personal.css    首页全部新增样式(覆盖/调色都写在这里)
    │   └── essay.css       文章页专属样式(含每篇文章的强调色变量)
    ├── fonts/              5 个 woff2 字体文件(Fontsource 下载,OFL 协议)
    ├── js/
    │   ├── personal.js     交互脚本:开场、入场动画、平滑滚动、画廊钉住滑动、手风琴、菜单、内容渲染
    │   ├── essay.js        文章页脚本:读 ?p= 参数、渲染正文、上一篇/下一篇、进度条
    │   └── vendor/marked.min.js  markdown 解析库(marked v12,MIT,本地自托管)
    └── img/                你自己的图片放这里(目前为空)
```

维护原则:**top.css 保持原样**(文章页样式也一律写进 `essay.css`),一切改动都往 `personal.css` / `personal.js` / `essay.css` / `essay.js` / HTML 里写。日常加作品/随笔**不用碰 index.html 和 essay.html**,只改 `content/` 下的数据文件和正文文件。

---

## 一、日常更新:添加作品 / 随笔

作品卡片和随笔条目**没有写死在 `index.html` 里**,而是打开页面时由两个数据文件自动生成的(纯本地脚本,双击打开、断网也能渲染):

| 想更新什么 | 编辑这个文件 |
|---|---|
| 作品(画廊卡片 + 点击后的详情) | `content/works/works.js` |
| 随笔(列表条目) | `content/essays/essays.js` |

### 添加一个作品

打开 `content/works/works.js`,复制任意一个 `{ ... }` 块,粘到数组末尾,改里面的内容:

```js
  {
    name: "作品名称",
    year: "2026",
    tag: "WEB",
    desc: "第一段介绍。\n\n第二段介绍——用 \n\n 分段。",
    links: [
      { text: "在线预览", href: "https://example.com" },
      { text: "GitHub", href: "https://github.com/..." }
    ]
  },
```

- 卡片编号(PROJECT 01、02…)按数组顺序**自动生成**,不用手写
- `desc` 用 `\n\n` 分段,显示在点击卡片后的详情框里
- `links` 可以写多条,一行一条;不需要链接就写 `links: []`
- 画廊背景色沿 6 色色板循环,作品超过 6 个会自动重复

### 写一篇随笔(三步)

**第 1 步**:复制 `content/essays/posts/_template.js`,把副本改名成一个英文短名,比如 `my-day.js`(只能用英文、数字、`-`、`_`,不要中文和空格)。

**第 2 步**:打开新文件,填标题、日期、标签和正文:

```js
window.POSTS["my-day"] = {                 // ← 中括号里必须和文件名一致
  title: "今天学到了什么",
  date: "2026-10-01",
  tags: ["随笔", "前端"],                   // 可选,显示成头图下的彩色小标签
  accent: "#4f6bff",                       // 可选,这篇文章的主题色(不写就按标题自动分一个)
  body: `
正文直接按 markdown 写,想空行就空行。

## 二级标题

普通段落。**加粗**、*斜体*、[链接](https://example.com)、\`行内代码\` 都能直接用。

- 无序列表
1. 有序列表
> 引用块
| 表头 | 表头 |
|---|---|
| 单元格 | 单元格 |
- [ ] 待办事项
- [x] 已完成的事项
`
};
```

**第 3 步**:回到 `content/essays/essays.js`,在数组**最前面**(列表里新的在上面)加一条目录:

```js
  {
    date: "2026-10-01",
    title: "今天学到了什么",
    summary: "一两句话的摘要,显示在列表里。",
    file: "my-day"
  },
```

保存后刷新首页,条目就出现了;点"阅读全文 →"进入文章页。

- `file` 写正文文件名(不带 `.js`),必须和 `posts/` 下的文件名、文件里的 `window.POSTS["..."]` 三处完全一致
- 只有不想写全文、要链到站外时才用 `url`(填完整网址);两个都想要就只写 `file`
- 写好的正文文件、目录条目**都不用再改 `index.html`/`essay.html`**

### 写正文的两条特殊规矩

因为正文是写在 JS 文件里的(这样双击打开、断网都能渲染,不用起服务器),有两个地方要注意:

1. **正文里的反引号要转义**:行内代码写成 `` \`npm run build\` ``(反斜杠 + 反引号),直接写反引号会把字符串截断、整页白屏
2. **代码块用三个波浪线 `~~~` 围起来**,不要用三反引号:

   ```
   ~~~js
   const greet = (name) => "hello, " + name;
   ~~~
   ```

   波浪线和反引号在 markdown 里效果一样,但波浪线不用转义,省事

### 两个最容易犯的错

1. **逗号**:块与块之间要有逗号,**最后一个块后面不要加逗号**——多一个逗号整个列表会消失(按 F12 控制台会报 SyntaxError)
2. **引号**:必须是英文半角 `"`,不能用中文全角引号;字段名后的冒号也用英文的

改完保存,浏览器刷新页面即可看到。自检口诀:整块内容消失 = 语法错误,九成出在逗号或引号。

---

## 二、还缺什么(待办清单)

### 文案(全部是占位符,搜索"你的名字"可快速定位)

| 位置 | 现在的内容 | 要改成 |
|---|---|---|
| `<title>` / meta description | 你的名字 · 个人主页 | 你的真实姓名/昵称 |
| 首屏 | 你的名字 / 个人主页 · 前端开发 / 设计 / 随笔 | 姓名 + 一句话定位 |
| 关于我三段 | 占位介绍 | 自我介绍(每段 1~2 行,过长会被裁剪,见下) |
| 项目作品简介 | 占位文案 | 作品区说明 |
| 6 个项目卡片 | 项目名称一~六 / 2026 / WEB | 在 `content/works/works.js` 里改成真实项目(见第一节) |
| 随笔 | 2 篇示例文章 | 在 `content/essays/essays.js` 里改成真实随笔(见第一节);两篇示例(`hello-world`、`study-notes`)写够自己的内容后可以连同 `posts/` 里的文件一起删掉 |
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

- ✅ **字体本地化**(已完成,2026-09-27):Syncopate / Urbanist / Noto Sans SC 已全部自托管在 `assets/fonts/`,不依赖任何外部网络。注意中文字体是"简体常用字"子集(每字重约 1.1MB),生僻字会回退系统字体;如需完整覆盖,去 Fontsource 重新下载 full 版替换。
- ✅ **og 分享标签**(已加):已指向 `https://woshinc.com/`,只剩 `assets/img/ogp.png` 预览图待你提供。
- **删除占位样式**:所有图片都换好后,可删除 `personal.css` 里 `.ph` 系列规则和 `--ph-*` 变量。

---

## 三、图片规格(准备图片时按这个尺寸做)

| 位置 | 建议尺寸 | 比例 | 说明 |
|---|---|---|---|
| 首屏背景(`.ph-fv`) | **1920×1080**(或 2560×1440) | 16:9 | 全屏铺满,会自动裁切适配窗口;页面文字是白色的,图选深色系 |
| 关于我头像(`story-img introduction-img`) | **1000×425**(2 倍清晰可给 2000×850) | 2.35:1 | 高度固定 425px、宽度最大 1000px 自适应;同一张图在移动端显示为 650×277,比例相同,无需另做 |
| 随笔配图(`story-img game-system-img`) | **1000×425** | 2.35:1 | 同上 |
| 作品卡片封面(可选) | 320×360(移动端 280×300) | 竖版 | 目前卡片是纯色块,换图时保留卡片结构、去掉背景色即可 |
| 页脚 LOGO(`.p3r-logo`) | **140×40**(2 倍清晰 280×80) | — | 浅色底,logo 颜色用深蓝 #1d384a 系最协调 |
| 文章正文配图 | 宽度 ≥ 820(2 倍清晰给 1640) | 任意 | 在正文里写 `![图片说明](assets/img/xx.jpg)`,自动限宽、圆角、投影 |
| 网站图标 | 16×16 或 32×32(SVG 矢量更佳) | 1:1 | 替换 head 里的 data URI |
| 分享预览图 ogp.png | **1200×630** | 1.91:1 | 放到 `assets/img/ogp.png`,并把 og 标签里的 example.com 换成你的域名 |

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

## 四、常用调节点

| 想调什么 | 在哪调 |
|---|---|
| 作品 / 随笔的内容 | `content/works/works.js`、`content/essays/essays.js` |
| 某篇文章的主题色 | 那一篇的 `posts/xxx.js` 里的 `accent`;不写则按标题自动分色 |
| 文章页全局默认色 / 头图配色 | `assets/css/essay.css` 开头的 `--post-accent`,和 `.post-hero` 的渐变 |
| 文章"约 N 分钟"的算法 | `assets/js/essay.js` 里搜 `350`(当前按 350 字/分钟估算) |
| 画廊滑动速度 | `personal.js` 顶部画廊模块的 `SCROLL_RATIO`(当前 1.5,越大越慢,1 = 原站手感) |
| 画廊六种背景色 | `personal.js` 里的 `palette` 数组(与卡片顺序一一对应) |
| 各板块英文标题色 | `personal.css` 里 `.title-kicker` 的四个板块规则(蓝/粉/绿/橙) |
| 首屏渐变/光晕 | `personal.css` 里 `.ph-fv` |
| 占位块配色 | `personal.css` 里 `.ph` / `.ph-blue` / `.ph-mint` 的 `--ph-from/mid/to` 变量 |
| 标题屏高度 | `personal.css` 里 `.works .wrapper` 的 `min-height` |
| 加载开场速度 | `personal.js` 里 `runLoading()` 的延时(600ms 起浪、2.5s 滑走) |

## 五、发布前检查清单

- [ ] F12 控制台零报错
- [ ] **文章页**:随便点开一篇,标题/日期/阅读时长/标签/正文/上一篇下一篇都在;文章页顶部导航是白字(深色头图上能看清)
- [ ] **文章页移动端**:窗口缩到 750px 以下,汉堡菜单展开后有浅色卡片底(否则白字压在深色头图上)
- [ ] 窗口缩到 750px 以下:汉堡菜单、手风琴、画廊手指滑动正常,无横向滚动条
- [ ] 断网刷新:字体回退系统字体,版面不破
- [ ] 所有 `data-ph` 占位块已换成自己的图;所有 `href="#"` 已替换为真实链接
- [ ] 版权行已改为自己的署名(保留"风格参考 Persona 3 Reload 官网"字样更稳妥)
- [ ] 文案里没有残留"你的名字 / you@example.com";`content/` 两个数据文件里没有残留"项目名称一 / 第一篇随笔的标题"

## 六、版权提示

页面布局、配色、动效为风格借鉴(学习用途);本项目中不含任何 ATLUS/SEGA 的图片、LOGO、词标或文案素材,波浪与装饰图形均为自绘。公开发布前请确认所有占位图都已替换为你拥有使用权的素材。

---

## 七、部署指南

本页面是**纯静态站**(无构建步骤、无后端),整个 `personal` 文件夹上传到任何静态托管即可,内部相对路径保持不变就行。

### 部署前必做

- [ ] 按第一节清单填完文案、换完图片,替换所有 `href="#"` 与 `data-ph` 占位
- [ ] favicon 换成自己的
- [ ] 图片压缩成 webp(首屏背景控制在 500KB 以内)
- [ ] head 里补 og: 分享标签(标题/描述/预览图)
- [ ] ✅ 字体已本地化(2026-09-27),离线可用,无需处理

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

## 八、进一步完善的方向

**建议按顺序做:**

1. ✅ **版本管理**(已完成):本目录已是 git 仓库,初始提交完成;后续改动 `git add -A && git commit -m "..."` 即可
2. **SEO**:og/twitter 标签已加(替换 example.com 占位);还需生成 `sitemap.xml`、`robots.txt`,`title` 和 description 换成真实姓名
3. **统计(可选)**:国内用百度统计,境外用 Google Analytics;注重隐私可用自托管 umami
4. **性能**:跑一次 Lighthouse;给首屏之外的图加 `loading="lazy"`;字体用 `preload`(本地化后)
5. ✅ **站内文章页**(已完成):`essay.html?p=文件名` 直接读 `content/essays/posts/` 下的 markdown 渲染,不用再折腾博客框架;想挂外部文章(语雀/掘金)就在目录条目里用 `url` 字段代替 `file`。下一步可加:文章底部评论区(Giscus,由 GitHub Discussions 驱动,无广告、免备案)、代码块语法高亮(现为纯色)、文章列表按年份分组
6. **功能扩展(按兴趣)**:暗色模式、作品详情加图、简历 PDF 下载、RSS
7. **无障碍**:已支持键盘焦点样式、`prefers-reduced-motion` 降级和 aria 属性,保持这个水准即可
