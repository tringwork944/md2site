(() => {
  const storageKey = 'md2site-theme';
  const preferences = ['light', 'dark', 'auto'];
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const saved = window.md2siteContent.storage.get(storageKey);
  const preference = preferences.includes(saved) ? saved : 'auto';

  const currentPreference = () => {
    const value = document.documentElement.dataset.themePreference;
    return preferences.includes(value) ? value : 'auto';
  };

  const syncControl = () => {
    const trigger = document.querySelector('[data-theme-trigger]');
    if (!trigger) return false;
    const active = currentPreference();
    const english = document.documentElement.lang.toLowerCase().startsWith('en');
    const labels = english ? { auto: 'Automatic', light: 'Light', dark: 'Dark' } : { auto: 'Tự động', light: 'Sáng', dark: 'Tối' };
    const icons = { auto: '◐', light: '☀', dark: '☾' };
    trigger.setAttribute('aria-label', `${english ? 'Theme' : 'Chế độ giao diện'}: ${labels[active]}`);
    document.querySelector('[data-theme-menu]')?.setAttribute('aria-label', english ? 'Choose theme' : 'Chọn chế độ giao diện');
    trigger.querySelector('.theme-icon')?.replaceChildren(icons[active]);
    trigger.querySelector('.theme-label')?.replaceChildren(labels[active]);
    document.querySelectorAll('[data-theme-option]').forEach((option) => {
      option.setAttribute('aria-checked', String(option.dataset.themeOption === active));
      option.querySelector('span:last-child')?.replaceChildren(labels[option.dataset.themeOption]);
    });
    return true;
  };

  const applyTheme = (value, persist = true) => {
    const next = preferences.includes(value) ? value : 'auto';
    document.documentElement.dataset.themePreference = next;
    document.documentElement.dataset.theme = next === 'auto'
      ? (systemTheme.matches ? 'dark' : 'light')
      : next;
    if (persist) window.md2siteContent.storage.set(storageKey, next);
    syncControl();
  };

  const setMenu = (open) => {
    const control = document.querySelector('[data-theme-control]');
    const trigger = document.querySelector('[data-theme-trigger]');
    if (!control || !trigger) return;
    control.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', String(open));
  };

  applyTheme(preference, false);
  document.addEventListener('md2site:language', syncControl);

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-theme-trigger]');
    if (trigger) {
      const control = trigger.closest('[data-theme-control]');
      setMenu(!control?.classList.contains('open'));
      return;
    }

    const option = event.target.closest('[data-theme-option]');
    if (option) {
      applyTheme(option.dataset.themeOption);
      setMenu(false);
      document.querySelector('[data-theme-trigger]')?.focus();
      return;
    }

    if (!event.target.closest('[data-theme-control]')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const control = document.querySelector('[data-theme-control].open');
    if (!control) return;
    setMenu(false);
    document.querySelector('[data-theme-trigger]')?.focus();
  });

  systemTheme.addEventListener('change', () => {
    if (currentPreference() === 'auto') applyTheme('auto', false);
  });

  const controlObserver = new MutationObserver(() => {
    if (syncControl()) controlObserver.disconnect();
  });
  controlObserver.observe(document.documentElement, { childList: true, subtree: true });
})();
