/* Template: div-basic-13 — centered, borderless hero section. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;

  runtime.register('div-basic-13', (section) => {
    const { escapeHtml, safeUrl, sectionId } = runtime.helpers;
    const meta = section.meta;
    const primary = meta.primary_label
      ? `<a class="btn btn-primary" href="${escapeHtml(safeUrl(meta.primary_href))}">${escapeHtml(meta.primary_label)}</a>`
      : '';
    const secondary = meta.secondary_label
      ? `<a class="btn btn-secondary" href="${escapeHtml(safeUrl(meta.secondary_href))}">${escapeHtml(meta.secondary_label)}</a>`
      : '';
    const actions = primary || secondary ? `<div class="hero-actions">${primary}${secondary}</div>` : '';

    return `<section class="section template-div template-div-basic-13"${sectionId(meta.id)}><div class="container div-hero-basic"><div class="hero-copy"><span class="eyebrow">${escapeHtml(meta.eyebrow || '')}</span><h2 class="title-xl">${escapeHtml(meta.title || section.name)}</h2><p class="lead">${escapeHtml(meta.description || '')}</p>${actions}${meta.note ? `<p class="hero-note">${escapeHtml(meta.note)}</p>` : ''}</div></div></section>`;
  });
})();
