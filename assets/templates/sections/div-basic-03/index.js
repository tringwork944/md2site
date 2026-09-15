/* Template: div-basic-03 — responsive card grid. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;
  runtime.register('div-basic-03', (section) => {
    const { escapeHtml, iconMarkup, sectionId } = runtime.helpers;
    return `<section class="section-sm template-div template-div-basic-03 template-card-grid"${sectionId(section.meta.id)}><div class="container"><span class="eyebrow">${escapeHtml(section.meta.eyebrow || '')}</span><h2 class="title-lg">${escapeHtml(section.meta.title || section.name)}</h2><div class="use-grid">${section.items.map((item) => `<article class="use-item">${iconMarkup(item.meta.icon)}<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join('')}</div></div></section>`;
  });
})();
