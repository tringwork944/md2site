/* Template: div-basic-07 — release download panel. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;
  runtime.register('div-basic-07', (section) => {
    const { escapeHtml, safeUrl } = runtime.helpers;
    const meta = section.meta;
    const details = section.items.map((item) => `<div><dt>${escapeHtml(item.title)}</dt><dd>${escapeHtml(item.description)}</dd></div>`).join('');
    return `<section class="section download-section template-div template-div-basic-07"><div class="container download-panel"><div class="download-copy"><span class="eyebrow">${escapeHtml(meta.eyebrow || '')}</span><h2 class="title-lg">${escapeHtml(meta.title || '')}</h2><p class="lead">${escapeHtml(meta.description || '')}</p><div class="download-actions"><a class="btn btn-primary" download href="${escapeHtml(safeUrl(meta.download_url || '#'))}">${escapeHtml(meta.download_label || 'Tải xuống')}</a><a class="btn btn-secondary" href="${escapeHtml(safeUrl(meta.docs_href || 'pages/?page=articles'))}">${escapeHtml(meta.docs_label || 'Xem hướng dẫn')}</a></div></div><dl class="download-meta">${details}</dl></div></section>`;
  });
})();
