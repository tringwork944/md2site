/* Shared registry and helpers for div templates. */
(() => {
  const registry = new Map();
  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const icons = {
    document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4 5h16v14H4zM8 9h8M8 13h5"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 19V5h14v14zM8 8h8M8 12h8M8 16h5"/></svg>',
    trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 17l5-5 4 4 8-9M16 7h4v4"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h7"/></svg>'
  };

  function iconMarkup(value = '') {
    const icon = String(value).trim().toLowerCase();
    if (icons[icon]) return icons[icon];

    const fontAwesome = icon.match(/^fa-(solid|regular|brands):([a-z0-9]+(?:-[a-z0-9]+)*)$/);
    if (fontAwesome) {
      const [, style, name] = fontAwesome;
      const href = `assets/images/fontawesome/sprites/${style}.svg#${name}`;
      return `<svg class="content-icon content-icon-fontawesome" aria-hidden="true" focusable="false"><use href="${href}"></use></svg>`;
    }

    if (icon.startsWith('svg:')) {
      const source = safeUrl(String(value).trim().slice(4), '');
      if (source && /\.svg(?:[?#].*)?$/i.test(source)) {
        return `<img class="content-icon content-icon-svg" src="${escapeHtml(source)}" alt="" loading="lazy" decoding="async">`;
      }
    }

    return icons.document;
  }

  function safeUrl(value = '', fallback = '#') {
    const candidate = value.trim();
    if (!candidate) return fallback;
    if (candidate.startsWith('#')) return candidate;
    try {
      const url = new URL(candidate, location.href);
      return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? candidate : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function sectionId(value = '') {
    const id = value.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
    return id ? ` id="${escapeHtml(id)}"` : '';
  }

  function splitCopy(section) {
    const meta = section.meta;
    return `<div class="split-copy"><span class="eyebrow">${escapeHtml(meta.eyebrow || '')}</span><h2 class="title-lg">${escapeHtml(meta.title || section.name)}</h2><p class="lead">${escapeHtml(meta.description || '')}</p></div>`;
  }

  function featureList(section) {
    return `<div class="feature-list">${section.items.map((item, index) => `<article class="feature-row"><div class="feature-index">${String(index + 1).padStart(2, '0')}</div><div><h3 class="title-md">${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div></article>`).join('')}</div>`;
  }

  function mount(name, root = document) {
    const normalizedName = String(name).toLowerCase();
    const renderer = registry.get(normalizedName);
    if (!renderer) return 0;
    const targets = root.querySelectorAll(`[data-div-template="${normalizedName}"]`);
    targets.forEach((target, index) => {
      const meta = { ...target.dataset };
      delete meta.divTemplate;
      target.outerHTML = renderer({
        name: meta.name || normalizedName,
        meta,
        items: [],
        order: index
      });
    });
    return targets.length;
  }

  window.md2siteDivTemplates = Object.freeze({
    get: (name) => registry.get(String(name).toLowerCase()),
    names: () => Object.freeze([...registry.keys()]),
    register(name, renderer) {
      if (typeof renderer !== 'function') throw new TypeError('Div template renderer must be a function');
      const normalizedName = String(name).toLowerCase();
      const validatedRenderer = (section) => {
        const html = renderer(section);
        if (typeof html !== 'string' || !/^\s*<section\b/i.test(html)) {
          throw new TypeError(`Template "${normalizedName}" must render a <section> root`);
        }
        if (!/^\s*<section\b[^>]*class=["'][^"']*\btemplate-div\b/i.test(html)) {
          throw new TypeError(`Template "${normalizedName}" root must include the "template-div" class`);
        }
        return html;
      };
      registry.set(normalizedName, validatedRenderer);
      mount(normalizedName);
    },
    mount,
    helpers: Object.freeze({ escapeHtml, featureList, iconMarkup, icons, safeUrl, sectionId, splitCopy })
  });
})();
