/* ==========================================================================
   个人简历网站 · 交互脚本
   纯原生 JS，无任何依赖。所有功能均做了「脚本失败时不影响内容阅读」的降级处理。
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. 主题切换（深浅色）
     ------------------------------------------------------------------ */
  var THEME_KEY = 'resume-theme';
  var themeToggle = $('#themeToggle');
  var metaTheme = $('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#0a0e15' : '#ffffff');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? '切换到浅色主题' : '切换到深色主题');
    }
  }

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  applyTheme(currentTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 隐私模式下忽略 */ }
    });
  }

  /* ------------------------------------------------------------------
     2. 导航：吸顶状态 + 阅读进度 + 移动端菜单
     ------------------------------------------------------------------ */
  var nav = $('#nav');
  var navLinks = $('#navLinks');
  var burger = $('#navBurger');
  var progress = $('#navProgress');

  function closeMenu() {
    if (!navLinks || !burger) return;
    navLinks.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', '打开菜单');
  }

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    });

    // 点击菜单项后自动收起
    $$('.nav__link, .nav__cta', navLinks).forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    // 点击页面其他区域收起
    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('is-open')) return;
      if (nav.contains(e.target)) return;
      closeMenu();
    });

    // Esc 收起
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // 视口放大回桌面端时重置菜单
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  /* ------------------------------------------------------------------
     3. 滚动相关（吸顶 / 进度 / 高亮 / 回到顶部）—— 统一用 rAF 节流
     ------------------------------------------------------------------ */
  var sections = $$('main section[id]');
  var navLinkMap = {};
  $$('.nav__link').forEach(function (a) {
    navLinkMap[a.getAttribute('href').slice(1)] = a;
  });

  var toTop = $('#toTop');
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  var navH = 68;
  var ticking = false;

  function syncNavHeight() {
    var h = nav ? nav.offsetHeight : 68;
    if (h) navH = h;
  }

  function onScroll() {
    var y = window.pageYOffset || root.scrollTop;

    // 吸顶阴影
    if (nav) nav.classList.toggle('is-stuck', y > 8);

    // 阅读进度
    if (progress) {
      var max = root.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
      progress.style.width = pct + '%';
    }

    // 当前区块高亮
    var line = y + navH + 90;
    var activeId = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= line) activeId = sec.id;
    });
    if (activeId && navLinkMap[activeId]) {
      $$('.nav__link').forEach(function (a) { a.classList.remove('is-current'); });
      navLinkMap[activeId].classList.add('is-current');
    }

    // 回到顶部按钮
    if (toTop) {
      var show = y > window.innerHeight * 0.9;
      toTop.hidden = !show;
    }

    ticking = false;
  }

  function requestScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }

  syncNavHeight();
  onScroll();
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', function () { syncNavHeight(); requestScroll(); });

  /* ------------------------------------------------------------------
     4. 进入视口时揭示元素
     ------------------------------------------------------------------ */
  var reveals = $$('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        if (delay) el.style.transitionDelay = delay + 'ms';
        el.classList.add('is-visible');
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    reveals.forEach(function (el) { revealIO.observe(el); });
  }

  /* ------------------------------------------------------------------
     5. Hero 数字滚动
     ------------------------------------------------------------------ */
  var counters = $$('.count');

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-to')) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }

    var duration = 1200;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);            // easeOutCubic
      el.textContent = String(Math.round(target * eased));
      if (p < 1) window.requestAnimationFrame(step);
      else el.textContent = String(target);
    }
    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCounter);
    } else {
      var countIO = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.4 });

      counters.forEach(function (el) { countIO.observe(el); });
    }
  }

  /* ------------------------------------------------------------------
     6. 复制到剪贴板 + 轻提示
     ------------------------------------------------------------------ */
  var toast = $('#toast');
  var toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    // 触发过渡
    window.requestAnimationFrame(function () { toast.classList.add('is-on'); });
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-on');
      window.setTimeout(function () { toast.hidden = true; }, 280);
    }, 2000);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // 降级方案：本地以 file:// 打开时 clipboard API 不可用
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject();
      } catch (e) {
        reject(e);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = btn.getAttribute('data-copy');
      copyText(val).then(function () {
        var label = btn.getAttribute('data-label') || '已复制';
        showToast(label + '：' + val);
      }).catch(function () {
        showToast('复制失败，请手动选择文本');
      });
    });
  });

  /* ------------------------------------------------------------------
     7. 打印 / 存为 PDF
     ------------------------------------------------------------------ */
  $$('[data-print]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.print();
    });
  });

  /* ------------------------------------------------------------------
     8. 页脚年份
     ------------------------------------------------------------------ */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
