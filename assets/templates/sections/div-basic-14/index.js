/* Template: div-basic-14 — reusable error page state. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;

  runtime.register('div-basic-14', (section) => {
    const { escapeHtml, safeUrl, sectionId } = runtime.helpers;
    const meta = section.meta;
    const headingTag = meta.heading_level === 'h1' ? 'h1' : 'h2';
    const headingId = `${String(meta.id || 'error-state').replace(/[^a-z0-9_-]+/gi, '-').toLowerCase()}-title`;
    const primary = meta.primary_label
      ? `<a class="btn btn-primary" href="${escapeHtml(safeUrl(meta.primary_href))}">${escapeHtml(meta.primary_label)}</a>`
      : '';
    const secondary = meta.secondary_label
      ? `<a class="btn btn-secondary" href="${escapeHtml(safeUrl(meta.secondary_href))}">${escapeHtml(meta.secondary_label)}</a>`
      : '';
    const actions = primary || secondary ? `<div class="hero-actions">${primary}${secondary}</div>` : '';

    return `<section class="section template-div template-div-basic-14"${sectionId(meta.id)} aria-labelledby="${escapeHtml(headingId)}"><div class="container error-state"><span class="error-code" aria-hidden="true">${escapeHtml(meta.code || '404')}</span><span class="eyebrow">${escapeHtml(meta.eyebrow || 'Lỗi')}</span><${headingTag} class="title-xl" id="${escapeHtml(headingId)}">${escapeHtml(meta.title || section.name)}</${headingTag}><p class="lead">${escapeHtml(meta.description || '')}</p>${actions}${meta.note ? `<p class="error-note">${escapeHtml(meta.note)}</p>` : ''}</div></section>`;
  });
})();
