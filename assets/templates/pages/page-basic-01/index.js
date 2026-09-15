/* Template registry: page-basic-01 */
(() => {
  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

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

  function parse(markdown = '') {
    return markdown.replace(/\r/g, '').split(/^##\s+/m).slice(1).map((chunk, index) => {
      const lines = chunk.trim().split('\n');
      const name = lines.shift()?.trim() || `section-${index + 1}`;
      const meta = {};
      while (lines.length) {
        const line = lines[0].trim();
        if (!line) { lines.shift(); continue; }
        const match = line.match(/^([a-z][a-z0-9_]*):\s*(.*)$/i);
        if (!match) break;
        meta[match[1].toLowerCase()] = match[2].trim();
        lines.shift();
      }
      if (!meta.template && /^(?:page-meta|hero|div-basic-[0-9]+)$/i.test(name)) {
        meta.template = name.toLowerCase();
      }
      const items = lines.join('\n').split(/^###\s+/m).slice(1).map((itemChunk) => {
        const itemLines = itemChunk.trim().split('\n');
        const title = itemLines.shift()?.trim() || '';
        const itemMeta = {};
        while (itemLines.length) {
          const line = itemLines[0].trim();
          if (!line) { itemLines.shift(); continue; }
          const match = line.match(/^([a-z][a-z0-9_]*):\s*(.*)$/i);
          if (!match) break;
          itemMeta[match[1].toLowerCase()] = match[2].trim();
          itemLines.shift();
        }
        return { title, meta: itemMeta, description: itemLines.join(' ').trim() };
      }).filter((item) => item.title);
      const declaredOrder = Number.parseFloat(meta.order);
      return { name, meta, items, order: Number.isFinite(declaredOrder) ? declaredOrder : index };
    }).filter((section) => section.meta.template && section.meta.hidden !== 'true')
      .sort((a, b) => a.order - b.order);
  }

  const registry = {
    'page-meta': (section) => {
      if (section.meta.meta_title) document.title = section.meta.meta_title;
      if (section.meta.meta_description) document.querySelector('meta[name="description"]')?.setAttribute('content', section.meta.meta_description);
      return '';
    },
    hero: (section) => {
      const meta = section.meta;
      const variantClass = meta.variant === 'centered-borderless' ? ' hero-centered-borderless' : '';
      const bullets = section.items.length ? `<ul>${section.items.map((item) => `<li>${escapeHtml(item.title)}</li>`).join('')}</ul>` : '';
      const primary = meta.primary_label ? `<a class="btn btn-primary" href="${escapeHtml(safeUrl(meta.primary_href))}">${escapeHtml(meta.primary_label)}</a>` : '';
      const secondary = meta.secondary_label ? `<a class="btn btn-secondary" href="${escapeHtml(safeUrl(meta.secondary_href))}">${escapeHtml(meta.secondary_label)}</a>` : '';
      const visual = meta.image ? `<figure class="product-shell product-visual"><img src="${escapeHtml(safeUrl(meta.image, ''))}" alt="${escapeHtml(meta.image_alt || '')}" width="800" height="600" fetchpriority="high"></figure>` : '';
      return `<section class="hero${variantClass}"${sectionId(meta.id)}><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">${escapeHtml(meta.eyebrow || '')}</span><h1 class="title-xl">${escapeHtml(meta.title || section.name)}</h1><p class="lead">${escapeHtml(meta.description || '')}</p>${bullets}<div class="hero-actions">${primary}${secondary}</div>${meta.note ? `<div class="hero-note">${escapeHtml(meta.note)}</div>` : ''}</div>${visual}</div></section>`;
    }
  };

  function renderSection(section) {
      const templateName = section.meta.template.toLowerCase();
      const renderer = registry[templateName] || window.md2siteDivTemplates?.get(templateName);
      return renderer
        ? renderer(section)
        : `<section class="section"><div class="container"><p class="muted">Mẫu “${escapeHtml(templateName)}” chưa được hỗ trợ.</p></div></section>`;
  }

  function render(sections = []) {
    const bodyRenderer = window.md2siteBodyTemplates?.active();
    if (!bodyRenderer) throw new Error('Page requires an active body template');
    return bodyRenderer(sections, renderSection);
  }

  window.md2sitePageTemplates = Object.freeze({
    names: () => Object.freeze([...Object.keys(registry), ...(window.md2siteDivTemplates?.names() || [])]),
    parse,
    render
  });
})();
