/* Template: div-basic-02 — list left, copy right. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;
  runtime.register('div-basic-02', (section) => {
    const { featureList, sectionId, splitCopy } = runtime.helpers;
    return `<section class="section template-div template-div-basic-02 template-split-section"${sectionId(section.meta.id)}><div class="container split split-reverse">${featureList(section)}${splitCopy(section)}</div></section>`;
  });
})();
