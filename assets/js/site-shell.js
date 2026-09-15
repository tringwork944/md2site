window.md2siteShellReady = (async () => {
  const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[character]));
  const pathParts = location.pathname.split('/').filter(Boolean);
  const requestedSlug = new URLSearchParams(location.search).get('page');
  const routeSlug = requestedSlug || (pathParts.at(-1) === 'index.html' ? pathParts.at(-2) : pathParts.at(-1));
  let currentSlug = document.body.dataset.seoPage || (routeSlug || 'home').trim().toLowerCase();
  const fallbackPages = [
    { slug: 'home', href: 'pages/?page=home', label: 'nav_home' },
    { slug: 'showcase', href: 'pages/?page=showcase', label: 'nav_showcase' },
    { slug: 'articles', href: 'pages/?page=articles', label: 'nav_articles' },
    { slug: 'roadmap', href: 'pages/?page=roadmap', label: 'nav_roadmap' },
    { slug: 'contact', href: 'pages/?page=contact', label: 'nav_contact' },
    { slug: 'download', href: 'pages/?page=download', label: 'nav_download' }
  ];

  let pages = fallbackPages;
  try {
    const manifest = await window.md2siteContent.manifest();
    currentSlug = manifest.find((page) => page.slug === currentSlug)?.active || currentSlug;
    const parsed = manifest.map((meta) => {
      const slug = meta.slug;
      return {
        slug,
        href: /^pages\/[a-z0-9][a-z0-9/?=&_-]*$/i.test(meta.href || '')
          ? meta.href
          : meta.shell === 'custom' ? `pages/${slug}/` : `pages/?page=${encodeURIComponent(slug)}`,
        label: meta.label || `nav_${slug.replace(/-/g, '_')}`,
        title: meta.title || '',
        active: meta.active || slug,
        order: Number(meta.order) || 0,
        visible: meta.nav !== 'false'
      };
    }).filter((page) => /^[a-z0-9][a-z0-9-]*$/.test(page.slug) && page.visible)
      .sort((a, b) => a.order - b.order);
    if (parsed.length) pages = parsed;
  } catch (error) {
    console.warn('Không thể đọc pages/index.md; dùng menu mặc định.', error);
  }

  const navLinks = pages.map((page) =>
    `<a${currentSlug === page.active || currentSlug === page.slug ? ' class="active"' : ''} href="${escapeHtml(page.href)}"${page.title ? '' : ` data-custom-key="${escapeHtml(page.label)}"`}>${escapeHtml(page.title)}</a>`
  ).join('');

  const header = document.querySelector('[data-site-header]');
  if (header) {
    const template = window.md2siteHeaderTemplate;
    header.outerHTML = template
      ? template.render({ navLinks })
      : '<header class="site-header"><div class="container"><a class="brand" href="pages/?page=home"><span class="brand-fallback">B</span><span>md2site</span></a></div></header>';
  }

  const footer = document.querySelector('[data-site-footer]');
  if (footer) {
    const template = window.md2siteFooterTemplate;
    footer.outerHTML = template
      ? template.render({ navLinks })
      : '<footer class="site-footer"><div class="container footer-bottom"><span>© md2site</span></div></footer>';
  }

  document.querySelectorAll('.brand-mark').forEach((mark) => {
    const images = [...mark.querySelectorAll('img')];
    if (!images.length) return;
    const failedImages = new Set();
    const registerFailure = (image) => {
      failedImages.add(image);
      if (failedImages.size === images.length) mark.classList.add('logo-error');
    };
    images.forEach((image) => {
      image.addEventListener('error', () => registerFailure(image), { once: true });
      if (image.complete && image.naturalWidth === 0) registerFailure(image);
    });
  });

  if (!document.querySelector('.site-background')) {
    document.body.insertAdjacentHTML('afterbegin', '<div class="site-background" aria-hidden="true"></div>');
  }

  if (!document.querySelector('[data-theme-control]')) {
    document.body.insertAdjacentHTML('beforeend', `<div class="theme-control" data-theme-control>
      <div class="theme-menu" role="menu" aria-label="Chọn chế độ giao diện" data-theme-menu>
        <button type="button" role="menuitemradio" data-theme-option="auto"><span aria-hidden="true">◐</span><span>Tự động</span></button>
        <button type="button" role="menuitemradio" data-theme-option="light"><span aria-hidden="true">☀</span><span>Sáng</span></button>
        <button type="button" role="menuitemradio" data-theme-option="dark"><span aria-hidden="true">☾</span><span>Tối</span></button>
      </div>
      <button class="theme-toggle floating-theme-toggle" type="button" aria-label="Chọn chế độ giao diện" aria-haspopup="menu" aria-expanded="false" data-theme-trigger>
        <span class="theme-icon" aria-hidden="true">◐</span><span class="theme-label">Tự động</span>
      </button>
    </div>`);
  }
})();
