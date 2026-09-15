/* Template: div-basic-10 — showcase gallery. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;
  runtime.register('div-basic-10', (section) => {
    const { escapeHtml, safeUrl } = runtime.helpers;
    const source = safeUrl(section.meta.index || 'pages/data/vi/showcase.md', 'pages/data/vi/showcase.md');
    const heading = section.meta.title ? `<header class="container template-section-heading"><span class="eyebrow">${escapeHtml(section.meta.eyebrow || '')}</span><h2 class="title-lg">${escapeHtml(section.meta.title)}</h2><p class="lead">${escapeHtml(section.meta.description || '')}</p></header>` : '';
    return `<section class="showcase-page template-div template-div-basic-10" data-showcase="${escapeHtml(source)}">${heading}<div class="showcase-gallery" data-showcase-grid aria-live="polite"></div></section>`;
  });
})();
