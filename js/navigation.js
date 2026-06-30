// THE HUMANIST ENGINEER - keyboard navigation and command palette

(function () {
  const pages = [
    { label: 'Home', command: 'home', path: 'index.html' },
    { label: 'Roadmap', command: 'roadmap', path: 'pages/roadmap.html' },
    { label: 'Articles', command: 'articles', path: 'pages/articles.html' },
    { label: 'Projects', command: 'projects', path: 'pages/projects.html' },
    { label: 'Books', command: 'books', path: 'pages/books.html' },
    { label: 'Links', command: 'links', path: 'pages/links.html' },
    { label: 'Documents', command: 'documents', path: 'pages/documents.html' },
    { label: 'About', command: 'about', path: 'pages/about.html' },
    { label: 'Contact', command: 'contact', path: 'pages/contact.html' }
  ];

  let pendingG = false;
  let commandIndex = 0;

  function repoRoot() {
    const path = location.pathname;
    if (path.includes('/articles/chapters/')) return '../../';
    if (path.includes('/pages/')) return '../';
    return '';
  }

  function currentPageIndex() {
    const normalized = location.pathname.replace(/\/$/, '/index.html');
    const root = repoRoot();
    return pages.findIndex(page => normalized.endsWith((root + page.path).replace(root, '')));
  }

  function isTypingTarget(target) {
    const tag = target.tagName;
    return target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }

  function goTo(page) {
    location.href = repoRoot() + page.path;
  }

  function goRelative(delta) {
    const index = currentPageIndex();
    const next = index < 0 ? 0 : (index + delta + pages.length) % pages.length;
    goTo(pages[next]);
  }

  function ensureHelp() {
    let el = document.querySelector('.keyboard-help');
    if (el) return el;
    el = document.createElement('div');
    el.className = 'keyboard-help';
    el.innerHTML = `
      <div class="keyboard-panel" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
        <h2>// keyboard shortcuts</h2>
        <div class="shortcut-grid">
          <div><kbd>j</kbd><span>scroll down</span></div>
          <div><kbd>k</kbd><span>scroll up</span></div>
          <div><kbd>h</kbd><span>previous page</span></div>
          <div><kbd>l</kbd><span>next page</span></div>
          <div><kbd>g g</kbd><span>top</span></div>
          <div><kbd>G</kbd><span>bottom</span></div>
          <div><kbd>/</kbd><span>command palette</span></div>
          <div><kbd>:</kbd><span>command palette</span></div>
          <div><kbd>Esc</kbd><span>close</span></div>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    el.addEventListener('click', event => {
      if (event.target === el) closeOverlays();
    });
    return el;
  }

  function ensurePalette() {
    let el = document.querySelector('.command-palette');
    if (el) return el;
    el = document.createElement('div');
    el.className = 'command-palette';
    el.innerHTML = `
      <div class="command-panel" role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="command-line">
          <span class="command-prefix">:</span>
          <input id="command-input" type="text" autocomplete="off" spellcheck="false" placeholder="goto books, cd roadmap, theme light...">
        </div>
        <div class="command-results" id="command-results"></div>
      </div>
    `;
    document.body.appendChild(el);
    const input = el.querySelector('#command-input');
    input.addEventListener('input', renderCommands);
    input.addEventListener('keydown', event => {
      const results = [...el.querySelectorAll('.command-result')];
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        commandIndex = Math.min(commandIndex + 1, results.length - 1);
        renderCommands();
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        commandIndex = Math.max(commandIndex - 1, 0);
        renderCommands();
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        results[commandIndex]?.click();
      }
    });
    el.addEventListener('click', event => {
      if (event.target === el) closeOverlays();
    });
    return el;
  }

  function commandItems(query) {
    const normalized = query.toLowerCase().replace(/^(goto|cd|open)\s+/, '').trim();
    const navItems = pages
      .filter(page => !normalized || page.label.toLowerCase().includes(normalized) || page.command.includes(normalized))
      .map(page => ({
        label: `goto ${page.label}`,
        hint: page.path,
        run: () => goTo(page)
      }));
    const themeItems = [
      { label: 'theme dark', hint: 'localStorage', run: () => setThemeCommand('dark') },
      { label: 'theme light', hint: 'localStorage', run: () => setThemeCommand('light') }
    ].filter(item => item.label.includes(normalized) || normalized.startsWith('theme'));
    return [...navItems, ...themeItems].slice(0, 8);
  }

  function setThemeCommand(theme) {
    localStorage.setItem('theme', theme);
    if (window.applyTheme) window.applyTheme(theme);
    else location.reload();
    closeOverlays();
  }

  function renderCommands() {
    const palette = ensurePalette();
    const input = palette.querySelector('#command-input');
    const results = palette.querySelector('#command-results');
    const items = commandItems(input.value);
    commandIndex = Math.min(commandIndex, Math.max(items.length - 1, 0));
    results.innerHTML = items.map((item, index) => `
      <button class="command-result${index === commandIndex ? ' is-active' : ''}" type="button" data-index="${index}">
        <span>${item.label}</span>
        <span>${item.hint}</span>
      </button>
    `).join('') || '<div class="command-result">no command</div>';
    results.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => items[Number(button.dataset.index)].run());
    });
  }

  function openPalette(prefix) {
    const palette = ensurePalette();
    const input = palette.querySelector('#command-input');
    palette.classList.add('open');
    palette.querySelector('.command-prefix').textContent = prefix;
    input.value = '';
    commandIndex = 0;
    renderCommands();
    setTimeout(() => input.focus(), 0);
  }

  function toggleHelp() {
    ensureHelp().classList.toggle('open');
  }

  function closeOverlays() {
    document.querySelector('.keyboard-help')?.classList.remove('open');
    document.querySelector('.command-palette')?.classList.remove('open');
    if (isTypingTarget(document.activeElement)) document.activeElement.blur();
  }

  document.addEventListener('keydown', event => {
    if (isTypingTarget(event.target)) {
      if (event.key === 'Escape') closeOverlays();
      return;
    }

    if (event.key === 'Escape') {
      closeOverlays();
      return;
    }
    if (event.key === '?') {
      event.preventDefault();
      toggleHelp();
      return;
    }
    if (event.key === '/' || event.key === ':') {
      event.preventDefault();
      openPalette(event.key);
      return;
    }
    if (event.key === 'j' || event.key === 'ArrowDown') {
      event.preventDefault();
      window.scrollBy({ top: 90, behavior: 'smooth' });
      return;
    }
    if (event.key === 'k' || event.key === 'ArrowUp') {
      event.preventDefault();
      window.scrollBy({ top: -90, behavior: 'smooth' });
      return;
    }
    if (event.key === 'h' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goRelative(-1);
      return;
    }
    if (event.key === 'l' || event.key === 'ArrowRight') {
      event.preventDefault();
      goRelative(1);
      return;
    }
    if (event.key === 'g') {
      if (pendingG) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        pendingG = false;
      } else {
        pendingG = true;
        setTimeout(() => { pendingG = false; }, 600);
      }
      return;
    }
    if (event.key === 'G') {
      event.preventDefault();
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  });
})();
