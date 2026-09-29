/* ============================================================
   personal.js — 个人主页交互脚本（vanilla JS，无依赖）
   复刻原站核心行为：加载开场 → 滚动入场动画 → 平滑滚动
   → 手风琴 → 移动端菜单 → 回到顶部
   ============================================================ */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 0. 内容渲染：作品与随笔由 content/ 下的数据文件生成 ----------
     添加内容只需编辑 content/works/works.js 和 content/essays/essays.js,
     index.html 不用动。渲染必须在其他模块之前,因为手风琴和画廊要绑定这些动态节点。 */

  const escHTML = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  function renderWorks() {
    const list = document.querySelector(".works-carousel");
    const works = window.WORKS;
    if (!list || !Array.isArray(works)) return;
    list.innerHTML = works
      .map((w, i) => {
        const no = String(i + 1).padStart(2, "0"); // PROJECT 01、02…按顺序自动编号
        const paras = String(w.desc || "")
          .split("\n\n")
          .map((p) => `<p>${escHTML(p).replace(/\n/g, "<br>")}</p>`)
          .join("");
        const links = (w.links || [])
          .map(
            (l) =>
              `<a href="${escHTML(l.href)}" target="_blank" rel="noopener">${escHTML(l.text)} →</a>`
          )
          .join("　");
        return (
          '<li class="works-slide">' +
            '<button type="button" class="works-card" aria-expanded="false">' +
              `<span class="works-card-en">PROJECT ${no}</span>` +
              `<span class="works-card-num">${no}</span>` +
              `<span class="works-card-name">${escHTML(w.name)}</span>` +
              `<span class="works-card-year">${escHTML(w.year)} / ${escHTML(w.tag)}</span>` +
            "</button>" +
            '<div class="works-slide-detail" hidden>' +
              paras +
              (links ? `<p>${links}</p>` : "") +
            "</div>" +
          "</li>"
        );
      })
      .join("");
  }

  function renderEssays() {
    const list = document.querySelector("#essays .item-list");
    const essays = window.ESSAYS;
    if (!list || !Array.isArray(essays)) return;
    list.insertAdjacentHTML(
      "beforeend",
      essays
        .map((e) => {
          /* 有 file 字段 → 站内文章页;否则用 url(外链新窗口打开,"#" 为占位) */
          const href = e.file
            ? `essay.html?p=${encodeURIComponent(e.file)}`
            : e.url || "#";
          const ext = /^https?:/i.test(href) ? ' target="_blank" rel="noopener"' : "";
          return (
            '<div class="item">' +
              '<button type="button" class="item-btn" aria-expanded="false">' +
                `<span class="item-name">${escHTML(e.date)} / ${escHTML(e.title)}</span>` +
                '<span class="item-icon"></span>' +
              "</button>" +
              '<div class="item-text">' +
                `<p>${escHTML(e.summary)} <a href="${escHTML(href)}"${ext}>阅读全文 →</a></p>` +
              "</div>" +
            "</div>"
          );
        })
        .join("")
    );
  }

  renderWorks();
  renderEssays();

  /* ---------- 1. 拆字：把 .animate-spec 文本拆成字母 span（复刻原站 footer 写法） ---------- */

  function splitText(el) {
    const text = el.textContent.trim();
    el.textContent = "";
    [...text].forEach((ch) => {
      if (ch === " ") {
        el.appendChild(document.createTextNode(" "));
      } else {
        const span = document.createElement("span");
        span.textContent = ch;
        el.appendChild(span);
      }
    });
  }

  document.querySelectorAll(".animate-spec").forEach(splitText);
  // .animate-links 在 HTML 里已手动拆好，无需处理

  /* ---------- 2. 加载开场（#loading 由 JS 注入，结构匹配 top.css 选择器） ---------- */

  function buildLoading() {
    const loading = document.createElement("div");
    loading.id = "loading";
    loading.innerHTML =
      '<div class="loading-text-box">' +
        '<h1><span class="loading-logo">YOUR NAME</span></h1>' +
        '<p class="loading-text">MY PORTFOLIO</p>' +
      "</div>" +
      '<div class="wave-box">' +
        '<div class="waves">' +
          '<svg class="parallax" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">' +
            '<defs><path id="personal-wave-shape" d="M0,30 C240,10 360,50 720,30 C1080,10 1200,50 1440,30 L1440,60 L0,60 Z"/></defs>' +
            '<use href="#personal-wave-shape" x="0" y="0" fill="#ffffff" opacity="0.6"></use>' +
            '<use href="#personal-wave-shape" x="-180" y="4" fill="#ffffff" opacity="0.4"></use>' +
            '<use href="#personal-wave-shape" x="120" y="2" fill="#ffffff" opacity="0.8"></use>' +
            '<use href="#personal-wave-shape" x="-60" y="6" fill="#ffffff" opacity="0.3"></use>' +
          "</svg>" +
        "</div>" +
      "</div>";
    document.body.appendChild(loading);
  }

  function runHero() {
    const kicker = document.querySelector(".hero-kicker");
    if (kicker) {
      kicker.querySelectorAll("span").forEach((s, i) => {
        setTimeout(() => s.classList.add("run"), 80 * i);
      });
    }
    document.querySelectorAll(".hero-name, .hero-sub").forEach((el, i) => {
      setTimeout(() => el.classList.add("run"), 200 + 250 * i);
    });
    const scrollBox = document.querySelector(".scroll-box");
    if (scrollBox) setTimeout(() => scrollBox.classList.add("run"), 900);
  }

  function runLoading() {
    if (prefersReduced) {
      document.body.classList.remove("hidden");
      runHero();
      return;
    }
    buildLoading();
    const loading = document.getElementById("loading");
    const waveBox = loading.querySelector(".wave-box");
    const finish = () => {
      loading.style.transition = "opacity 0.6s ease-out";
      loading.style.opacity = "0";
      setTimeout(() => {
        loading.remove();
        document.body.classList.remove("hidden");
        runHero();
      }, 600);
    };
    waveBox.addEventListener("transitionend", finish, { once: true });
    setTimeout(() => waveBox.classList.add("run"), 600);
    setTimeout(finish, 6000); // 兜底：transitionend 未触发时强制结束
  }

  /* 开场动画只在首页(有 .fv 首屏区块)播放;文章页等其他页面直接显示 */
  if (document.querySelector(".fv")) {
    runLoading();
  } else {
    document.body.classList.remove("hidden");
  }

  /* ---------- 3. IntersectionObserver 入场动画（与原站一致的 -20% 提前量） ---------- */

  function handleAnim(el) {
    if (el.classList.contains("animate-spec") || el.classList.contains("animate-links")) {
      el.querySelectorAll("span").forEach((s, i) => {
        setTimeout(() => s.classList.add("run"), 60 * i);
      });
    } else if (
      el.classList.contains("story-text1") ||
      el.classList.contains("story-text2") ||
      el.classList.contains("story-text4")
    ) {
      el.querySelectorAll("span").forEach((s, i) => {
        setTimeout(() => s.classList.add("run"), 150 * i);
      });
    } else if (el.classList.contains("story-text3")) {
      el.classList.add("run");
      el.querySelectorAll("span").forEach((s, i) => {
        setTimeout(() => s.classList.add("run"), 300 * i);
      });
    } else {
      el.classList.add("run");
    }
  }

  const observed =
    ".fade-up, .fade-down, .fade-left, .fade-right, .fade-scale, " +
    ".story-img, .spec-items, .link-items, .item-list, .p3r-logo, .bg-text, " +
    ".animate-spec:not(.hero-kicker), .animate-links, " +
    ".story-text1, .story-text2, .story-text4, .story-text3";

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        handleAnim(entry.target);
      });
    },
    { rootMargin: "0% 0% -20% 0%" }
  );

  document.querySelectorAll(observed).forEach((el) => io.observe(el));

  /* ---------- 4. 平滑滚动（自写 lerp + rAF，手感对齐原站 Lenis 默认 lerp 0.1） ---------- */

  let targetY = window.scrollY;
  let currentY = window.scrollY;
  let rafId = null;

  function smoothLoop() {
    currentY += (targetY - currentY) * 0.1;
    window.scrollTo(0, currentY);
    if (Math.abs(targetY - currentY) > 0.5) {
      rafId = requestAnimationFrame(smoothLoop);
    } else {
      currentY = targetY;
      rafId = null;
    }
  }

  function scrollToY(y) {
    targetY = Math.max(0, y);
    if (prefersReduced) {
      window.scrollTo(0, targetY);
      return;
    }
    if (!rafId) {
      currentY = window.scrollY;
      rafId = requestAnimationFrame(smoothLoop);
    }
  }

  // 用户滚轮 / 触摸时取消平滑滚动动画
  window.addEventListener("wheel", () => { targetY = window.scrollY; }, { passive: true });
  window.addEventListener("touchstart", () => { targetY = window.scrollY; }, { passive: true });

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href").slice(1);
    e.preventDefault();
    setMenu(false);
    if (id === "") return; // 占位链接（如 href="#"），仅阻止默认跳转
    if (id === "top") {
      scrollToY(0);
      return;
    }
    const target = document.getElementById(id);
    if (target) scrollToY(target.getBoundingClientRect().top + window.scrollY);
  });

  /* ---------- 5. 回到顶部按钮 ---------- */

  const toTop = document.querySelector(".to-top-btn");
  if (toTop) {
    window.addEventListener(
      "scroll",
      () => {
        toTop.classList.toggle("show", window.scrollY > window.innerHeight);
      },
      { passive: true }
    );
  }

  /* ---------- 6. 移动端菜单（≤750px 汉堡 + 毛玻璃抽屉） ---------- */

  const menuBtn = document.querySelector(".sp-menu-btn");
  const navBox = document.querySelector(".nav-box");

  function setMenu(open) {
    if (!menuBtn || !navBox) return;
    menuBtn.classList.toggle("open", open);
    navBox.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("hidden", open);
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      setMenu(!navBox.classList.contains("open"));
    });
  }

  document.querySelectorAll(".nav a").forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 750) setMenu(false);
  });

  /* ---------- 7. 手风琴（随笔列表） ---------- */

  document.querySelectorAll(".item-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".item");
      const text = item.querySelector(".item-text");
      const open = btn.classList.toggle("open");
      if (text) text.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- 8. 作品画廊（钉住式滚动：页面下滚 → 区块钉住 → 卡片向右切换 → 背景色插值渐变） ---------- */

  const pin = document.querySelector(".works-pin");
  const sticky = document.querySelector(".works-sticky");
  const band = document.querySelector(".works-band");
  const strip = document.querySelector(".works-carousel");
  const detailBox = document.querySelector(".works-detail");

  /* 无作品数据时(pin 里没有卡片)整个模块跳过,避免空数组取 [0] 报错 */
  if (pin && sticky && band && strip && strip.querySelector(".works-slide")) {
    const slides = [...strip.querySelectorAll(".works-slide")];
    const palette = ["#00d4ff", "#ff3de0", "#4f6bff", "#ff2e97", "#00e08a", "#ffd21e"];
    /* 滚动系数:卡片平移 1px 需要页面滚动的距离。1 = 原站 1:1 手感,1.5 = 更慢更从容 */
    const SCROLL_RATIO = 1.5;
    let activeIdx = 0;
    let detailOpen = false;

    /* 十六进制颜色插值 */
    function mixColor(a, b, t) {
      const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
      const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
      const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
      return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    }

    /* 进度 p（0~1）对应的背景色：在相邻两个色板色之间插值 */
    function colorAt(p) {
      const seg = p * (palette.length - 1);
      const i = Math.min(palette.length - 2, Math.floor(seg));
      return mixColor(palette[i], palette[i + 1], seg - i);
    }

    /* 撑高滚动区：100vh + 横向可滑动距离 × 滚动系数 */
    function resizePin() {
      if (prefersReduced) {
        pin.style.height = "auto";
        return;
      }
      const track = (strip.scrollWidth - strip.clientWidth) * SCROLL_RATIO;
      pin.style.height = `${window.innerHeight + track}px`;
      onPinScroll();
    }

    function setActive(i) {
      activeIdx = Math.max(0, Math.min(slides.length - 1, i));
      slides.forEach((s, idx) => {
        const card = s.querySelector(".works-card");
        card.classList.toggle("active", idx === activeIdx);
        card.setAttribute("aria-expanded", String(idx === activeIdx && detailOpen));
      });
      if (detailBox) {
        detailBox.innerHTML = slides[activeIdx].querySelector(".works-slide-detail").innerHTML;
      }
      if (prefersReduced) {
        band.style.backgroundColor = palette[activeIdx % palette.length];
      }
    }

    function setDetail(open) {
      detailOpen = open;
      if (detailBox) detailBox.classList.toggle("open", open);
      const card = slides[activeIdx].querySelector(".works-card");
      card.setAttribute("aria-expanded", String(open));
    }

    /* 元素的文档坐标位置（不能用 offsetTop：top.css 里 section 是定位祖先，offsetTop 是相对它的） */
    function docTopOf(el) {
      return el.getBoundingClientRect().top + window.scrollY;
    }

    /* 钉住主逻辑：进入 pin 区间时把画廊层切为 fixed 钉在视口，按进度平移卡片 */
    function onPinScroll() {
      if (prefersReduced || pin.style.height === "auto") return;
      const pinTop = docTopOf(pin);
      const pinHeight = pin.offsetHeight;
      const vh = window.innerHeight;
      const y = window.scrollY;
      let progress;
      if (y <= pinTop) {
        // 尚未进入：停在 pin 顶部
        sticky.style.position = "absolute";
        sticky.style.top = "0px";
        sticky.style.left = "";
        sticky.style.width = "";
        progress = 0;
      } else if (y >= pinTop + pinHeight - vh) {
        // 已滑完：停在 pin 底部，交还页面滚动
        sticky.style.position = "absolute";
        sticky.style.top = `${pinHeight - vh}px`;
        sticky.style.left = "";
        sticky.style.width = "";
        progress = 1;
      } else {
        // 钉住中
        sticky.style.position = "fixed";
        sticky.style.top = "0px";
        sticky.style.left = "0px";
        sticky.style.width = "100%";
        progress = (y - pinTop) / (pinHeight - vh);
      }
      const maxX = strip.scrollWidth - strip.clientWidth;
      strip.style.transform = `translateX(${-progress * maxX}px)`;
      band.style.backgroundColor = colorAt(progress);
      const idx = Math.round(progress * (slides.length - 1));
      if (idx !== activeIdx) setActive(idx);
    }

    /* 点击卡片：滚动到对应位置并展开详情；已激活再点则收起 */
    strip.addEventListener("click", (e) => {
      const slide = e.target.closest(".works-slide");
      if (!slide) return;
      const idx = slides.indexOf(slide);
      if (idx === activeIdx && detailOpen) {
        setDetail(false);
        return;
      }
      if (!prefersReduced) {
        const total = pin.offsetHeight - window.innerHeight;
        scrollToY(docTopOf(pin) + (idx / (slides.length - 1)) * total);
      }
      setActive(idx);
      setDetail(true);
    });

    window.addEventListener("scroll", onPinScroll, { passive: true });
    window.addEventListener("resize", resizePin);
    window.addEventListener("load", resizePin);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && detailOpen) setDetail(false);
    });

    resizePin();
    setActive(0);
  }
})();
