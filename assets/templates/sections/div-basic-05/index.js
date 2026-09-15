/* Template: div-basic-05 — roadmap navigation and lazy-loaded phases. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;
  runtime.register('div-basic-05', (section) => {
    const { escapeHtml, safeUrl } = runtime.helpers;
    const index = safeUrl(section.meta.index || 'pages/data/vi/roadmap/index.md', 'pages/data/vi/roadmap/index.md');
    const heading = section.meta.title ? `<header class="container template-section-heading"><span class="eyebrow">${escapeHtml(section.meta.eyebrow || '')}</span><h2 class="title-lg">${escapeHtml(section.meta.title)}</h2><p class="lead">${escapeHtml(section.meta.description || '')}</p></header>` : '';
    return `<section class="section template-div template-div-basic-05">${heading}<div class="container roadmap-layout" data-roadmap-root data-roadmap-index="${escapeHtml(index)}"><aside class="roadmap-nav" aria-label="Mục lộ trình" data-roadmap-nav></aside><div data-roadmap-content aria-live="polite"></div></div></section>`;
  });
})();
