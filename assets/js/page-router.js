(() => {
  const root = document.querySelector('[data-page-router-root]');
  const requestedSlug = (new URLSearchParams(location.search).get('page') || 'home').trim().toLowerCase();

  const showError = (title, message) => {
    if (root) root.innerHTML = `<section class="section"><div class="container"><h1 class="title-lg">${title}</h1><p class="muted">${message}</p></div></section>`;
  };
  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`script load failed: ${src}`));
    document.body.append(script);
  });
  const loadStyle = (href) => new Promise((resolve, reject) => {
    const targetPath = new URL(href, document.baseURI).pathname;
    if ([...document.styleSheets].some((sheet) => sheet.href && new URL(sheet.href).pathname === targetPath)) { resolve(); return; }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = () => reject(new Error(`style load failed: ${href}`));
    document.head.append(link);
  });
  const sectionTemplates = (markdown = '') => {
    const names = new Set();
    for (const match of markdown.matchAll(/^(?:template:\s*|##\s+)(div-basic-[0-9]+)\s*$/gmi)) names.add(match[1].toLowerCase());
    return [...names];
  };

  window.md2siteRouteReady = (async () => {
    try {
      const content = window.md2siteContent;
      const [manifest, { selected }] = await Promise.all([
        content.manifest(), content.language()
      ]);
      const validSlug = /^[a-z0-9][a-z0-9-]*$/.test(requestedSlug);
      const requestedPage = validSlug ? manifest.find((item) => item.slug === requestedSlug) : null;
      const page = requestedPage || manifest.find((item) => item.slug === '404');
      if (!page) { showError('Không tìm thấy trang', 'Trang lỗi chưa được khai báo trong pages/index.md.'); return; }
      if (!/^pages\/[a-z0-9][a-z0-9/_-]*\.md$/i.test(page.source)) throw new Error('invalid page source');
      if (!/^[a-z0-9][a-z0-9-]*$/i.test(page.header) || !/^[a-z0-9][a-z0-9-]*$/i.test(page.footer)) throw new Error('invalid header or footer');
      if (!/^[a-z0-9][a-z0-9-]*$/i.test(page.body)) throw new Error('missing or invalid body');

      const selectedLanguage = selected.code;
      document.documentElement.lang = selectedLanguage;
      const localizedSource = page.source.replace(
        /^pages\/content\/(?:[a-z]{2,8}(?:-[a-z0-9]{2,8})?\/)?/i,
        `pages/content/${selectedLanguage}/`
      );
      const { text: sourceMarkdown, url: resolvedSource } = await content.firstAvailable([localizedSource, page.source]);
      const templates = sectionTemplates(sourceMarkdown);
      const dependencies = page.dependencies.split(/[\s,]+/).filter(Boolean);

      document.body.dataset.seoPage = requestedPage ? page.slug : '404';
      document.body.dataset.routeError = !requestedPage || page.slug === '404' ? 'true' : 'false';
      document.body.dataset.contentLanguage = selectedLanguage;
      document.body.dataset.customSources = `${selected.file} ${resolvedSource} assets/content/${selectedLanguage}/seo.md`;
      root.dataset.pageTemplatesSource = resolvedSource;
      if (page.pageTitle) document.title = page.pageTitle;

      // Independent asset groups load together. Each group preserves its own
      // registration dependencies before the application begins rendering.
      await Promise.all([
        Promise.all([
          loadStyle('assets/templates/body/' + page.body + '/style.css?v=15'),
          ...templates.map((name) => loadStyle('assets/templates/sections/' + name + '/style.css?v=26')),
          ...dependencies.filter((path) => /^assets\/[a-z0-9/_-]+\.css$/i.test(path)).map(loadStyle)
        ]),
        (async () => {
          for (const path of dependencies.filter((path) => /^assets\/[a-z0-9/_-]+\.js$/i.test(path))) await loadScript(path);
          await Promise.all([
            loadScript('assets/templates/header/' + page.header + '/index.js?v=1'),
            loadScript('assets/templates/footer/' + page.footer + '/index.js?v=3')
          ]);
          await loadScript('assets/js/site-shell.js?v=20');
          await window.md2siteShellReady;
        })(),
        (async () => {
          await Promise.all([
            loadScript('assets/templates/sections/runtime.js?v=4'),
            loadScript('assets/templates/body/runtime.js?v=1'),
            loadScript('assets/templates/pages/page-basic-01/index.js?v=5'),
            ...(templates.some((name) => ['div-basic-05', 'div-basic-06'].includes(name))
              ? [loadScript('assets/js/collection-loader.js?v=1')] : [])
          ]);
          await Promise.all([
            loadScript('assets/templates/body/' + page.body + '/index.js?v=1'),
            ...templates.map((name) => loadScript('assets/templates/sections/' + name + '/index.js?v=10'))
          ]);
          window.md2siteBodyTemplates.activate(page.body);
        })()
      ]);
      await loadScript('assets/js/app.js?v=37');
      await window.md2siteReady;
    } catch (error) {
      console.error(error);
      showError('Không thể tải trang', 'Hãy kiểm tra khai báo trang, source, body, header, footer và tài nguyên phụ thuộc.');
    }
  })();
})();
