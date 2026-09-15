/* Template: div-basic-12 — legal and policy document. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;
  runtime.register('div-basic-12', (section) => {
    const { escapeHtml, safeUrl } = runtime.helpers;
    const inlineText = (value = '') => {
      const tokens = [];
      const source = String(value).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
        const href = safeUrl(url, '');
        if (!href) return label;
        const token = `@@POLICY_LINK_${tokens.length}@@`;
        tokens.push(`<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`);
        return token;
      });
      let html = escapeHtml(source).replace(/`([^`]+)`/g, '<code>$1</code>');
      tokens.forEach((link, index) => { html = html.replace(`@@POLICY_LINK_${index}@@`, link); });
      return html;
    };
    const summary = section.meta.summary_title ? `<aside class="license-summary"><span class="eyebrow">${escapeHtml(section.meta.summary_eyebrow || '')}</span><h2 class="title-md">${escapeHtml(section.meta.summary_title)}</h2><p>${inlineText(section.meta.summary_description || '')}</p></aside>` : '';
    const items = section.items.map((item, index) => `<section><span>${String(index + 1).padStart(2, '0')}</span><div><h2>${escapeHtml(item.title)}</h2><p>${inlineText(item.description)}</p></div></section>`).join('');
    return `<section class="section template-div template-div-basic-12"><div class="container license-layout">${summary}<div class="license-content">${items}</div></div></section>`;
  });
})();
