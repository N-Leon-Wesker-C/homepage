/* ============================================================
   essay.js — 文章页(essay.html)脚本
   流程:读取地址栏 ?p=xxx → 动态加载 content/essays/posts/xxx.js
        → 用 marked 把 markdown 正文渲染成 HTML → 生成上一篇/下一篇
   零依赖:marked 已本地化在 assets/js/vendor/marked.min.js
   ============================================================ */
(() => {
  "use strict";

  /* 与首页画廊同一套霓虹色板:文章没指定强调色时按标题自动分配 */
  const PALETTE = ["#00d4ff", "#ff3de0", "#4f6bff", "#ff2e97", "#00e08a", "#ffd21e"];

  const bodyEl = document.getElementById("postBody");
  const titleEl = document.getElementById("postTitle");
  const dateEl = document.getElementById("postDate");
  const readEl = document.getElementById("postRead");
  const tagsEl = document.getElementById("postTags");
  const siblingsEl = document.getElementById("postSiblings");
  const progressEl = document.getElementById("postProgress");

  const slug = (new URLSearchParams(location.search).get("p") || "").trim();

  /* 只允许字母数字下划线连字符,防止路径穿越 */
  if (!/^[a-z0-9_-]+$/i.test(slug)) {
    showError("没有指定文章。");
    return;
  }

  /* ---------- 工具 ---------- */

  function hashColor(str) {
    let h = 0;
    for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return PALETTE[h % PALETTE.length];
  }

  function toSoft(hex, alpha) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }

  function showError(msg) {
    titleEl.textContent = "找不到这篇文章";
    bodyEl.innerHTML = `<p class="post-error">${msg} <a href="index.html#essays">← 返回随笔列表</a></p>`;
  }

  /* ---------- 1. 动态加载文章数据 ---------- */

  const script = document.createElement("script");
  script.src = `content/essays/posts/${slug}.js`;
  script.onload = () => {
    const post = (window.POSTS || {})[slug];
    if (!post) {
      showError("文章数据里没有这个条目。");
      return;
    }
    render(post);
  };
  script.onerror = () => {
    showError("文章文件不存在(检查 content/essays/posts/ 下有没有 " + slug + ".js)。");
  };
  document.body.appendChild(script);

  /* ---------- 2. 渲染 ---------- */

  function render(post) {
    const accent = post.accent || hashColor(post.title || slug);
    document.documentElement.style.setProperty("--post-accent", accent);
    document.documentElement.style.setProperty("--post-accent-soft", toSoft(accent, 0.14));

    /* 标题 / 时间 / 阅读时长 */
    document.title = `${post.title} · 随笔`;
    titleEl.textContent = post.title || "(无标题)";
    if (dateEl) dateEl.textContent = post.date || "";
    if (readEl) {
      const chars = String(post.body || "").replace(/\s/g, "").length;
      readEl.textContent = `约 ${Math.max(1, Math.round(chars / 350))} 分钟`;
    }

    /* 标签小色块 */
    if (tagsEl && Array.isArray(post.tags)) {
      tagsEl.innerHTML = post.tags
        .map((t, i) => {
          const color = PALETTE[(i + 3) % PALETTE.length];
          return `<li style="--chip:${color}">${escapeHTML(t)}</li>`;
        })
        .join("");
    }

    /* markdown 正文(breaks:true = 回车即换行,对中文写作更直观) */
    if (typeof window.marked === "undefined") {
      bodyEl.innerHTML = '<p class="post-error">markdown 渲染库没加载成功,检查 assets/js/vendor/marked.min.js 是否存在。</p>';
      return;
    }
    window.marked.setOptions({ gfm: true, breaks: true });
    bodyEl.innerHTML = window.marked.parse(String(post.body || "").trim());

    /* 正文里的外链新窗口打开;图片懒加载 */
    bodyEl.querySelectorAll('a[href^="http"]').forEach((a) => {
      a.target = "_blank";
      a.rel = "noopener";
    });
    bodyEl.querySelectorAll("img").forEach((img) => {
      img.loading = "lazy";
      img.alt = img.alt || post.title || "";
    });

    bindSiblings();
    bindProgress();
  }

  function escapeHTML(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  /* ---------- 3. 上一篇 / 下一篇(按随笔列表顺序) ---------- */

  function bindSiblings() {
    if (!siblingsEl) return;
    const list = (window.ESSAYS || []).filter((e) => e && e.file);
    const idx = list.findIndex((e) => e.file === slug);
    if (idx < 0 || list.length < 2) return;

    const prev = list[idx - 1];
    const next = list[idx + 1];
    const card = (item, label, color) =>
      `<a class="post-sibling" href="essay.html?p=${encodeURIComponent(item.file)}" style="--chip:${color}">` +
      `<span class="post-sibling-label">${label}</span>` +
      `<span class="post-sibling-title">${escapeHTML(item.title)}</span></a>`;

    siblingsEl.innerHTML =
      (prev ? card(prev, "← NEWER", "#00d4ff") : "") +
      (next ? card(next, "OLDER →", "#ff3de0") : "");
  }

  /* ---------- 4. 顶部阅读进度条 ---------- */

  function bindProgress() {
    if (!progressEl) return;
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressEl.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }
})();
