/* Template: div-basic-08 — numbered deployment steps. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;
  runtime.register('div-basic-08', (section) => {
    const { escapeHtml } = runtime.helpers;
    const steps = section.items.map((item, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div></li>`).join('');
    return `<section class="section-sm download-steps-section template-div template-div-basic-08"><div class="container"><span class="eyebrow">${escapeHtml(section.meta.eyebrow || '')}</span><h2 class="title-lg">${escapeHtml(section.meta.title || '')}</h2><ol class="download-steps">${steps}</ol></div></section>`;
  });
})();
