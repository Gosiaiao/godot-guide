(function () {
  const data = JSON.parse(document.getElementById('site-data').textContent);
  const sidebarNav = document.getElementById('sidebar-nav');
  const docContent = document.getElementById('doc-content');
  const breadcrumbs = document.getElementById('breadcrumbs');
  const pager = document.getElementById('pager');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const menuToggle = document.getElementById('menu-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const rstVersions = document.getElementById('rst-versions');
  const rstCurrentVersion = document.getElementById('rst-current-version');
  const verDarkBtn = document.getElementById('ver-dark-btn');
  const verLightBtn = document.getElementById('ver-light-btn');
  const floatingPill = document.getElementById('floating-pill');

  const HOME_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>';
  const COPY_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const CHECK_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  const SUN_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  const MOON_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  let currentChapterId = 'home';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('godot_47_theme', theme); } catch (_) {}
    if (theme === 'dark') {
      themeToggle.textContent = '切换浅色主题';
      themeToggleMobile.innerHTML = SUN_SVG;
    } else {
      themeToggle.textContent = '切换深色主题';
      themeToggleMobile.innerHTML = MOON_SVG;
    }
  }

  function toggleTheme() {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }

  function initTheme() {
    let saved = 'dark';
    try { saved = localStorage.getItem('godot_47_theme') || 'dark'; } catch (_) {}
    applyTheme(saved);
  }

  themeToggle.addEventListener('click', toggleTheme);
  themeToggleMobile.addEventListener('click', toggleTheme);
  verDarkBtn.addEventListener('click', () => { applyTheme('dark'); rstVersions.classList.remove('shift-up'); });
  verLightBtn.addEventListener('click', () => { applyTheme('light'); rstVersions.classList.remove('shift-up'); });
  rstCurrentVersion.addEventListener('click', () => rstVersions.classList.toggle('shift-up'));
  floatingPill.addEventListener('click', toggleTheme);

  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  }
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    backdrop.classList.toggle('open');
  });
  backdrop.addEventListener('click', closeSidebar);

  // Exact upstream p.caption + ul accordion sidebar from godot-docs/_static/js/custom.js
  function renderSidebar() {
    const groups = [];
    const map = {};
    data.chapters.forEach(ch => {
      if (!map[ch.group]) {
        map[ch.group] = [];
        groups.push(ch.group);
      }
      map[ch.group].push(ch);
    });

    let html = '';
    groups.forEach((g, idx) => {
      const itemsHtml = map[g].map(ch => {
        const hasSubs = ch.sections && ch.sections.length > 0;
        const subs = hasSubs ? ch.sections.map(s =>
          '<li class="toctree-l2"><a class="reference internal rtd-sublink" data-section="' + s.id + '" href="#' + ch.id + '/' + s.id + '">' + s.title + '</a></li>'
        ).join('') : '';
        const expandBtn = hasSubs
          ? '<button class="toctree-expand" type="button" aria-label="展开小节">+</button>'
          : '';
        return (
          '<li class="toctree-l1" data-chapter-item="' + ch.id + '">' +
            '<a class="reference internal" href="#' + ch.id + '">' +
              expandBtn +
              '<span>' + ch.shortTitle + '</span>' +
            '</a>' +
            (hasSubs ? '<ul class="rtd-sublist">' + subs + '</ul>' : '') +
          '</li>'
        );
      }).join('');

      const activeClass = idx === 0 ? ' active' : '';
      html +=
        '<p class="caption' + activeClass + '" role="heading" data-group="' + g + '">' +
          '<span class="caption-text">' + g + '</span>' +
        '</p>' +
        '<ul class="' + (idx === 0 ? 'active' : '') + '">' + itemsHtml + '</ul>';
    });

    sidebarNav.innerHTML = html;

    // Official accordion toggle behavior from custom.js lines 445-468
    const menuHeaders = sidebarNav.querySelectorAll('.caption[role="heading"]');
    menuHeaders.forEach(it => {
      const connectedMenu = it.nextElementSibling;
      it.addEventListener('click', () => {
        if (connectedMenu.classList.contains('active')) {
          connectedMenu.classList.remove('active');
          it.classList.remove('active');
        } else {
          connectedMenu.classList.add('active');
          it.classList.add('active');
        }
        menuHeaders.forEach(other => {
          if (other !== it && other.classList.contains('active')) {
            other.nextElementSibling.classList.remove('active');
            other.classList.remove('active');
          }
        });
      });
    });

    sidebarNav.querySelectorAll('.toctree-expand').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const item = btn.closest('li.toctree-l1');
        if (!item) return;
        const expanded = item.classList.toggle('expanded');
        btn.textContent = expanded ? '−' : '+';
      });
    });

    sidebarNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeSidebar);
    });
  }

  function openSidebarCaption(captionEl) {
    const menuHeaders = sidebarNav.querySelectorAll('.caption[role="heading"]');
    menuHeaders.forEach(h => {
      const ul = h.nextElementSibling;
      if (h === captionEl) {
        h.classList.add('active');
        if (ul) ul.classList.add('active');
      } else {
        h.classList.remove('active');
        if (ul) ul.classList.remove('active');
      }
    });
  }

  function updateSidebarActive(chapterId, sectionId) {
    sidebarNav.querySelectorAll('li.toctree-l1.current').forEach(el => {
      el.classList.remove('current', 'expanded');
      const btn = el.querySelector('.toctree-expand');
      if (btn) btn.textContent = '+';
    });
    sidebarNav.querySelectorAll('.rtd-sublink.active').forEach(el => el.classList.remove('active'));

    if (chapterId === 'home') {
      const firstCaption = sidebarNav.querySelector('.caption[role="heading"]');
      if (firstCaption) openSidebarCaption(firstCaption);
      return;
    }

    const item = sidebarNav.querySelector('[data-chapter-item="' + chapterId + '"]');
    if (item) {
      const ul = item.parentElement;
      const caption = ul ? ul.previousElementSibling : null;
      if (caption && caption.classList.contains('caption')) {
        openSidebarCaption(caption);
      }
      item.classList.add('current', 'expanded');
      const btn = item.querySelector('.toctree-expand');
      if (btn) btn.textContent = '−';
    }
    if (sectionId) {
      const sub = sidebarNav.querySelector('[data-section="' + sectionId + '"]');
      if (sub) sub.classList.add('active');
    }
  }

  function bindCopyButtons() {
    docContent.querySelectorAll('.copybtn').forEach(btn => {
      btn.addEventListener('click', () => {
        const box = btn.closest('.highlight');
        const codeEl = box ? box.querySelector('pre code') : null;
        if (!codeEl) return;
        const text = codeEl.textContent;
        const done = () => {
          btn.innerHTML = CHECK_ICON;
          btn.classList.add('success');
          btn.title = '已复制';
          setTimeout(() => {
            btn.innerHTML = COPY_ICON;
            btn.classList.remove('success');
            btn.title = '复制代码';
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
        } else {
          fallbackCopy(text, done);
        }
      });
    });
  }

  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
    cb();
  }

  function renderRoute() {
    const rawHash = decodeURIComponent((location.hash || '#home').slice(1));
    const parts = rawHash.split('/');
    let chapterId = parts[0] || 'home';
    const sectionId = parts[1] || '';

    const chIdx = data.chapters.findIndex(c => c.id === chapterId);
    if (chapterId !== 'home' && chIdx === -1) {
      chapterId = 'home';
    }

    currentChapterId = chapterId;
    searchResults.hidden = true;

    if (chapterId === 'home') {
      document.title = data.title + ' — Godot Engine 4.7 简体中文文档';
      breadcrumbs.innerHTML = '<li><span class="crumb-home-icon">' + HOME_ICON + '</span></li><li>/</li><li>Godot 4 系统学习指南</li>';
      docContent.innerHTML = data.homeHtml;
      pager.innerHTML =
        '<a class="btn-neutral btn-next" href="#' + data.chapters[0].id + '">下一页：' + data.chapters[0].shortTitle + ' →</a>';
      updateSidebarActive('home', '');
      window.scrollTo(0, 0);
      return;
    }

    const chapter = data.chapters[chIdx];
    document.title = chapter.title + ' — ' + data.title;
    breadcrumbs.innerHTML =
      '<li><a class="crumb-home-icon" href="#home" title="返回首页">' + HOME_ICON + '</a></li>' +
      '<li>/</li>' +
      '<li>' + chapter.title + '</li>';

    docContent.innerHTML = chapter.html;
    bindCopyButtons();

    const prev = chIdx > 0 ? data.chapters[chIdx - 1] : null;
    const next = chIdx + 1 < data.chapters.length ? data.chapters[chIdx + 1] : null;
    let pagerHtml = '';
    if (prev) {
      pagerHtml += '<a class="btn-neutral" href="#' + prev.id + '">← 上一页：' + prev.shortTitle + '</a>';
    } else {
      pagerHtml += '<a class="btn-neutral" href="#home">← 上一页：文档首页</a>';
    }
    if (next) {
      pagerHtml += '<a class="btn-neutral btn-next" href="#' + next.id + '">下一页：' + next.shortTitle + ' →</a>';
    }
    pager.innerHTML = pagerHtml;

    updateSidebarActive(chapterId, sectionId);

    if (sectionId) {
      const target = document.getElementById(sectionId);
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 20);
        return;
      }
    }
    window.scrollTo(0, 0);
  }

  let scrollTimer = null;
  window.addEventListener('scroll', () => {
    if (currentChapterId === 'home') return;
    if (scrollTimer) return;
    scrollTimer = setTimeout(() => {
      scrollTimer = null;
      const targets = docContent.querySelectorAll('h3[id], .admonition.tip[id]');
      let activeId = '';
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= 110) {
          activeId = el.id;
        }
      }
      if (activeId) {
        sidebarNav.querySelectorAll('.rtd-sublink.active').forEach(el => el.classList.remove('active'));
        const sub = sidebarNav.querySelector('[data-section="' + activeId + '"]');
        if (sub) sub.classList.add('active');
      }
    }, 80);
  });

  function escapeReg(s) {
    return s.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
  }

  function runSearch(query) {
    const q = query.trim();
    if (!q) {
      searchResults.hidden = true;
      return;
    }
    const qLower = q.toLowerCase();
    const hits = [];

    data.chapters.forEach(ch => {
      const textLower = ch.plainText.toLowerCase();
      const idx = textLower.indexOf(qLower);
      if (idx !== -1 || ch.title.toLowerCase().includes(qLower)) {
        const start = Math.max(0, (idx === -1 ? 0 : idx) - 40);
        const end = Math.min(ch.plainText.length, (idx === -1 ? 0 : idx) + q.length + 80);
        const snippet = (start > 0 ? '...' : '') + ch.plainText.slice(start, end) + (end < ch.plainText.length ? '...' : '');
        const safeSnippet = snippet.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const highlighted = safeSnippet.replace(new RegExp(escapeReg(q), 'gi'), m => '<span class="highlighted">' + m + '</span>');
        hits.push({ id: ch.id, title: ch.title, snippet: highlighted });
      }
    });

    let html = '<div class="search-summary"><span>搜索 “' + q.replace(/</g, '&lt;') + '” 找到 ' + hits.length + ' 条结果</span><button class="search-clear-btn" type="button">关闭</button></div>';
    if (hits.length === 0) {
      html += '<p style="color:var(--footer-color)">未找到匹配结果，可尝试更换关键词。</p>';
    } else {
      html += '<ul class="search">' + hits.map(h =>
        '<li>' +
          '<a class="search-result-link" href="#' + h.id + '">' + h.title + '</a>' +
          '<div class="context">' + h.snippet + '</div>' +
        '</li>'
      ).join('') + '</ul>';
    }
    searchResults.innerHTML = html;
    searchResults.hidden = false;

    const clearBtn = searchResults.querySelector('.search-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchResults.hidden = true;
      });
    }
    searchResults.querySelectorAll('.search-result-link').forEach(item => {
      item.addEventListener('click', () => {
        searchResults.hidden = true;
        closeSidebar();
      });
    });
  }

  searchInput.addEventListener('input', () => runSearch(searchInput.value));
  // Official '/' focus + select shortcut from custom.js lines 307-316
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      searchResults.hidden = true;
      searchInput.blur();
    }
  });

  initTheme();
  renderSidebar();
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
})();
