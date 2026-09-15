/* Template: div-basic-11 — article reader. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;
  runtime.register('div-basic-11', (section) => {
    const { escapeHtml, safeUrl } = runtime.helpers;
    const english = document.documentElement.lang.toLowerCase().startsWith('en');
    const backLabel = section.meta.back_label || (english ? '← All articles' : '← Tất cả bài viết');
    const previewHeading = english ? 'Content heading' : 'Tiêu đề nội dung';
    const previewText = english ? 'This sample content demonstrates the template typography and reading width.' : 'Đây là nội dung mẫu để xem typography và chiều rộng đọc của template.';
    const backHref = safeUrl(section.meta.back_href || 'pages/?page=articles', 'pages/?page=articles');
    if (section.meta.preview === 'true') {
      return `<section class="article-page template-div template-div-basic-11" id="div-basic-11"><div class="container article-page-wrap"><a class="article-back" href="${escapeHtml(backHref)}">${escapeHtml(backLabel)}</a><article class="article-page-reader"><h2>${escapeHtml(section.meta.title || (english ? 'Sample article' : 'Bài viết mẫu'))}</h2><p>${escapeHtml(section.meta.description || '')}</p><h3>${escapeHtml(previewHeading)}</h3><p>${escapeHtml(previewText)}</p><pre data-code-language="text"><code class="language-text">assets/templates/sections/div-basic-11/example.md</code></pre></article></div></section>`;
    }
    return `<section class="article-page template-div template-div-basic-11" data-article-page><div class="container article-page-wrap"><a class="article-back" href="${escapeHtml(backHref)}">${escapeHtml(backLabel)}</a><article class="article-page-reader" data-article-page-reader aria-live="polite"></article></div></section>`;
  });
})();
