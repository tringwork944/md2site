/* Template: div-basic-06 — Markdown article list. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;
  runtime.register('div-basic-06', (section) => {
    const { escapeHtml, safeUrl } = runtime.helpers;
    const index = safeUrl(section.meta.index || 'pages/data/vi/articles/index.md', 'pages/data/vi/articles/index.md');
    const heading = section.meta.title ? `<header class="container template-section-heading"><span class="eyebrow">${escapeHtml(section.meta.eyebrow || '')}</span><h2 class="title-lg">${escapeHtml(section.meta.title)}</h2><p class="lead">${escapeHtml(section.meta.description || '')}</p></header>` : '';
    return `<section class="section articles-section template-div template-div-basic-06" data-articles-root data-articles-index="${escapeHtml(index)}">${heading}<div class="container"><div class="articles-list" data-articles-list aria-live="polite"></div></div></section>`;
  });
})();
