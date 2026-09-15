/* Template: div-basic-01 — copy left, list right. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;
  runtime.register('div-basic-01', (section) => {
    const { featureList, sectionId, splitCopy } = runtime.helpers;
    return `<section class="section template-div template-div-basic-01 template-split-section"${sectionId(section.meta.id)}><div class="container split">${splitCopy(section)}${featureList(section)}</div></section>`;
  });
})();
