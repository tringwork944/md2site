/* Template: div-basic-04 — compact callout. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;
  runtime.register('div-basic-04', (section) => {
    const { escapeHtml, safeUrl, sectionId } = runtime.helpers;
    return `<section class="section callout-section template-div template-div-basic-04"${sectionId(section.meta.id)}><div class="container callout callout-compact"><div><span class="eyebrow">${escapeHtml(section.meta.eyebrow || '')}</span><h2 class="title-md callout-title">${escapeHtml(section.meta.title || section.name)}</h2><p>${escapeHtml(section.meta.description || '')}</p></div>${section.meta.button_label ? `<a class="btn btn-primary" href="${escapeHtml(safeUrl(section.meta.button_href))}">${escapeHtml(section.meta.button_label)}</a>` : ''}</div></section>`;
  });
})();
