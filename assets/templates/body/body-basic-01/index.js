/* Body template: body-basic-01 */
(() => {
  window.md2siteBodyTemplates?.register('body-basic-01', (sections, renderSection) => {
    if (!Array.isArray(sections) || typeof renderSection !== 'function') {
      throw new Error('Invalid body render context');
    }
    return `<div class="body-template body-basic-01" data-body-template="body-basic-01">${sections.map(renderSection).join('')}</div>`;
  });
})();
