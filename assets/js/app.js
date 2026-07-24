/**
 * CodeAtlas Application Controller
 * Handles SPA navigation, theme switching, documentation search, lightbox modals, and accessibility.
 * Refactored for Security Hardening & Official Extension Metadata Integration.
 */

document.addEventListener('DOMContentLoaded', function () {
  // Theme Management
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const htmlEl = document.documentElement;

  function setTheme(theme) {
    if (theme === 'light') {
      htmlEl.classList.remove('dark');
      htmlEl.classList.add('light');
      localStorage.setItem('codeatlas_theme', 'light');
    } else {
      htmlEl.classList.remove('light');
      htmlEl.classList.add('dark');
      localStorage.setItem('codeatlas_theme', 'dark');
    }
  }

  const savedTheme = localStorage.getItem('codeatlas_theme') || 'dark';
  setTheme(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = htmlEl.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
    });
  });

  // SPA View Navigation via Hash
  const navLinks = document.querySelectorAll('[data-view-target]');
  const views = document.querySelectorAll('.page-view');

  function navigateTo(targetId) {
    const targetView = document.getElementById(targetId);
    if (!targetView) return;

    views.forEach(v => {
      v.classList.add('hidden');
      v.setAttribute('aria-hidden', 'true');
    });

    targetView.classList.remove('hidden');
    targetView.setAttribute('aria-hidden', 'false');

    // Update nav links active styling
    navLinks.forEach(link => {
      if (link.getAttribute('data-view-target') === targetId) {
        link.classList.add('text-accent', 'border-b-2', 'border-accent');
        link.classList.remove('text-on-surface-variant');
      } else {
        link.classList.remove('text-accent', 'border-b-2', 'border-accent');
        link.classList.add('text-on-surface-variant');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize graph engine if target is home
    if (targetId === 'view-home' && window.CodeAtlasGraph) {
      window.CodeAtlasGraph.init();
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-view-target');
      window.location.hash = targetId.replace('view-', '');
      navigateTo(targetId);

      // Close mobile drawer if open
      const mobileDrawer = document.getElementById('mobile-drawer');
      if (mobileDrawer) mobileDrawer.classList.add('hidden');
    });
  });

  const btnTryGraph = document.getElementById('btn-try-graph-explorer');
  if (btnTryGraph) {
    btnTryGraph.addEventListener('click', () => {
      const section = document.getElementById('interactive-graph-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Handle Hash Routing on Load and Change
  function handleHash() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const targetId = 'view-' + hash;
    navigateTo(targetId);
  }

  window.addEventListener('hashchange', handleHash);
  handleHash();

  // IDE Tab Switching Mockup in Hero
  const ideTabs = document.querySelectorAll('.ide-tab');
  const ideContents = document.querySelectorAll('.ide-tab-content');

  ideTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabTarget = tab.getAttribute('data-tab');
      
      ideTabs.forEach(t => {
        t.classList.remove('border-accent', 'bg-surface-container', 'text-on-background');
        t.classList.add('text-on-surface-variant');
      });
      tab.classList.add('border-accent', 'bg-surface-container', 'text-on-background');

      ideContents.forEach(c => {
        if (c.getAttribute('id') === 'ide-content-' + tabTarget) {
          c.classList.remove('hidden');
        } else {
          c.classList.add('hidden');
        }
      });
    });
  });

  // Image Lightbox Modal Viewer
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxTriggers = document.querySelectorAll('[data-lightbox-src]');

  lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-lightbox-src');
      const title = trigger.getAttribute('data-lightbox-title') || 'CodeAtlas Screenshot';
      if (lightboxImg && lightboxModal) {
        lightboxImg.src = src;
        if (lightboxTitle) lightboxTitle.textContent = title;
        lightboxModal.classList.remove('hidden');
        lightboxModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.add('hidden');
      lightboxModal.setAttribute('aria-hidden', 'true');
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.add('hidden');
        lightboxModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Live Documentation Search
  const docsSearchInput = document.getElementById('docs-search-input');
  const docsSections = document.querySelectorAll('.docs-section');

  if (docsSearchInput) {
    docsSearchInput.addEventListener('input', function (e) {
      const query = e.target.value.toLowerCase().trim();
      docsSections.forEach(section => {
        const text = section.textContent.toLowerCase();
        if (query === '' || text.includes(query)) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      });
    });
  }

  // Search Modal Dialog & Safe DOM Rendering
  const searchModal = document.getElementById('search-modal');
  const searchTriggers = document.querySelectorAll('.search-trigger');
  const searchClose = document.getElementById('search-modal-close');
  const searchInput = document.getElementById('global-search-input');
  const searchResults = document.getElementById('global-search-results');

  const SEARCH_ITEMS = [
    { title: "Installation (VarunKulkarni.codeatlas-vscode)", view: "view-docs", target: "doc-install", snippet: "VS Code extension marketplace (VarunKulkarni.codeatlas-vscode), Java 17+, Maven & Gradle support." },
    { title: "Supported Spring Annotations", view: "view-docs", target: "doc-requirements", snippet: "@RestController, @Service, @Repository, @Bean, @Autowired AST parsing." },
    { title: "Extension Commands Reference", view: "view-docs", target: "doc-commands", snippet: "CodeAtlas: Open Architecture Explorer, CodeAtlas: Analyze Project." },
    { title: "Configuration Schema (.vscode/codeatlas.json)", view: "view-docs", target: "doc-config", snippet: "Custom layer rules, package exclusion filters, scoring weights." },
    { title: "Architecture Rules Reference", view: "view-docs", target: "doc-rules", snippet: "BYPASS_SERVICE_LAYER, CIRCULAR_DEPENDENCY, UNUSED_SPRING_BEAN." },
    { title: "Interactive Graph Explorer", view: "view-home", target: "interactive-graph-section", snippet: "Real-time Controller -> Service -> Repository dependency visualization." },
    { title: "Showcase Screenshot Gallery", view: "view-gallery", target: "gallery-section", snippet: "Real Spring Boot topology screenshots and violation detection logs." }
  ];

  function openSearchModal() {
    if (searchModal) {
      searchModal.classList.remove('hidden');
      searchModal.setAttribute('aria-hidden', 'false');
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        renderSearchResults('');
      }
    }
  }

  function closeSearchModal() {
    if (searchModal) {
      searchModal.classList.add('hidden');
      searchModal.setAttribute('aria-hidden', 'true');
    }
  }

  searchTriggers.forEach(t => t.addEventListener('click', openSearchModal));
  if (searchClose) searchClose.addEventListener('click', closeSearchModal);

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.toLowerCase().trim());
    });
  }

  function renderSearchResults(q) {
    if (!searchResults) return;

    // Safely clear previous results
    while (searchResults.firstChild) {
      searchResults.removeChild(searchResults.firstChild);
    }

    const matches = SEARCH_ITEMS.filter(item => 
      q === '' || item.title.toLowerCase().includes(q) || item.snippet.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      const p = document.createElement("p");
      p.className = "p-4 text-xs text-on-surface-variant text-center";
      p.textContent = "No matching documentation or feature topics found.";
      searchResults.appendChild(p);
      return;
    }

    matches.forEach(item => {
      const itemEl = document.createElement("div");
      itemEl.className = "p-3 border-b border-outline-variant/30 hover:bg-surface-container cursor-pointer transition-colors";
      itemEl.setAttribute("role", "button");
      itemEl.setAttribute("tabindex", "0");

      const h5 = document.createElement("h5");
      h5.className = "text-xs font-semibold text-accent";
      h5.textContent = item.title;

      const p = document.createElement("p");
      p.className = "text-[11px] text-on-surface-variant mt-0.5";
      p.textContent = item.snippet;

      itemEl.appendChild(h5);
      itemEl.appendChild(p);

      itemEl.addEventListener("click", function () {
        jumpToSearch(item.view, item.target);
      });
      itemEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          jumpToSearch(item.view, item.target);
        }
      });

      searchResults.appendChild(itemEl);
    });
  }

  function jumpToSearch(viewId, targetElementId) {
    closeSearchModal();
    window.location.hash = viewId.replace('view-', '');
    navigateTo(viewId);
    setTimeout(() => {
      const el = document.getElementById(targetElementId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  // Keyboard accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearchModal();
      if (lightboxModal) lightboxModal.classList.add('hidden');
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }
  });

  // Mobile Hamburger Menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('hidden');
    });
  }

  window.CodeAtlasApp = {
    jumpToSearch: jumpToSearch
  };
});
