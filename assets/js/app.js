const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

function uiText(vietnamese, english) {
  return document.documentElement.lang.toLowerCase().startsWith('en') ? english : vietnamese;
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

function bindContactForm() {
  const contactForm = document.querySelector('[data-contact-form]');
  if (!contactForm || contactForm.dataset.bound === 'true') return;
  contactForm.dataset.bound = 'true';
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = contactForm.querySelector('[data-form-status]');
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      status.textContent = uiText("Vui lòng điền đầy đủ họ tên, email và nội dung.", "Please enter your name, email, and message.");
      status.style.color = 'var(--danger)';
      return;
    }

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      status.textContent = uiText("Vui lòng nhập địa chỉ email hợp lệ.", "Please enter a valid email address.");
      status.style.color = 'var(--danger)';
      return;
    }

    status.textContent = uiText("Đã ghi nhận nội dung. Đây là form demo phía frontend, chưa gửi dữ liệu lên máy chủ.", "This is a frontend demo. Your message has not been sent to a server.");
    status.style.color = 'var(--success)';
    contactForm.reset();
  });
}

// Keep the decorative background rotation continuous across page navigation.
const backgroundRotationDuration = 120000;
const backgroundRotationKey = 'md2site-background-rotation-start';

function syncBackgroundRotation() {
  let startedAt = Number(window.md2siteContent.storage.get(backgroundRotationKey));
  if (!Number.isFinite(startedAt) || startedAt <= 0 || startedAt > Date.now()) {
    startedAt = Date.now();
    window.md2siteContent.storage.set(backgroundRotationKey, String(startedAt));
  }
  const elapsed = (Date.now() - startedAt) % backgroundRotationDuration;
  document.documentElement.style.setProperty('--dong-son-delay', `-${elapsed}ms`);
}

syncBackgroundRotation();
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) syncBackgroundRotation();
});

// Lightweight Markdown helpers used by roadmap and article pages.
function escapeHtml(value = '') {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.append(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

function canonicalUrl() {
  const url = new URL(location.href);
  const canonical = new URL('pages/', document.baseURI);
  const page = document.body.dataset.routeError === 'true'
    ? '404'
    : (url.searchParams.get('page') || 'home');
  canonical.searchParams.set('page', page);
  if (page === 'article') {
    const post = url.searchParams.get('post');
    if (post) canonical.searchParams.set('post', post);
  }
  return canonical.href;
}

function markdownExcerpt(markdown = '', maxLength = 160) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^[#>*+-]+\s*/gm, '')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).replace(/\s+\S*$/, '')}…`;
}

function normalizeArticleDate(value = '') {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : value;
}

function updateSeo({ title, description, keywords = '', type = 'website', published = '', image = '', noindex = false } = {}) {
  const pageTitle = (title || document.title || 'md2site').trim();
  const currentDescription = document.querySelector('meta[name="description"]')?.content || '';
  const pageDescription = (description || currentDescription || 'md2site — website tĩnh quản lý nội dung bằng Markdown.').trim();
  const canonical = canonicalUrl();
  const socialImage = new URL(image || 'assets/images/beestudiosns/01_bee_studio_sns_light.svg', document.baseURI).href;
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  document.title = pageTitle;
  document.documentElement.lang = document.documentElement.lang || 'vi';
  upsertMeta('meta[name="description"]', { name: 'description', content: pageDescription });
  upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
  if (keywords) upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'md2site' });
  const locale = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en_US' : 'vi_VN';
  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: locale });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: pageDescription });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: socialImage });
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: pageDescription });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: socialImage });
  if (published) upsertMeta('meta[property="article:published_time"]', { property: 'article:published_time', content: published });

  let canonicalLink = document.head.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.append(canonicalLink);
  }
  canonicalLink.href = canonical;

  let schema = document.head.querySelector('script[data-seo-schema]');
  if (!schema) {
    schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.dataset.seoSchema = '';
    document.head.append(schema);
  }
  const structuredData = type === 'article'
    ? { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: pageTitle.replace(/\s+[—-]\s+md2site$/i, ''), description: pageDescription, datePublished: published || undefined, mainEntityOfPage: canonical, image: socialImage, publisher: { '@type': 'Organization', name: 'md2site' } }
    : { '@context': 'https://schema.org', '@type': 'WebPage', name: pageTitle, description: pageDescription, url: canonical, isPartOf: { '@type': 'WebSite', name: 'md2site', url: new URL('pages/?page=home', document.baseURI).href } };
  schema.textContent = JSON.stringify(structuredData);
}

function safeMarkdownUrl(value = '', fallback = '#') {
  const url = value.trim();
  if (!url || /^(?:javascript|data|vbscript):/i.test(url)) return fallback;
  if (/^(?:https?:\/\/|mailto:|tel:|#|\/|\.\.?\/)/i.test(url)) return escapeHtml(url);
  if (/^[a-z0-9][a-z0-9._~!$&'()*+,;=:@%/?#-]*$/i.test(url)) return escapeHtml(url);
  return fallback;
}

function safeMarkdownImageUrl(value = '', fallback = '') {
  const url = value.trim();
  if (!url || /^(?:javascript|data|vbscript|mailto|tel):/i.test(url) || url.startsWith('#')) return fallback;
  return safeMarkdownUrl(url, fallback);
}

function safeImagePosition(value = 'center') {
  const parts = String(value).trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!parts.length || parts.length > 2) return 'center';
  const keywords = new Set(['left', 'center', 'right', 'top', 'bottom']);
  const isSafePart = (part) => {
    if (keywords.has(part)) return true;
    const percent = part.match(/^(\d{1,3})%$/);
    return Boolean(percent && Number(percent[1]) <= 100);
  };
  return parts.every(isSafePart) ? parts.join(' ') : 'center';
}

function parseMarkdownImage(value = '') {
  const match = value.match(/^!\[([^\]]*)\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+(?:"([^"]*)"|'([^']*)'|\(([^)]*)\)))?\s*\)(?:\s*\{([^}]*)\})?$/);
  if (!match) return null;

  const rawOptions = match[7] || '';
  const options = {};
  for (const option of rawOptions.matchAll(/\b(width|align)\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s]+))/gi)) {
    options[option[1].toLowerCase()] = (option[2] || option[3] || option[4] || '').toLowerCase();
  }

  const widthPresets = { small: '360px', medium: '720px', large: '1080px', full: '100%' };
  let width = widthPresets[options.width] || '';
  const pixelWidth = options.width?.match(/^(\d{2,4})(?:px)?$/);
  const percentWidth = options.width?.match(/^(\d{1,3})%$/);
  if (pixelWidth) {
    const pixels = Number(pixelWidth[1]);
    if (pixels >= 80 && pixels <= 1400) width = `${pixels}px`;
  } else if (percentWidth) {
    const percent = Number(percentWidth[1]);
    if (percent >= 10 && percent <= 100) width = `${percent}%`;
  }

  return {
    alt: match[1].trim(),
    url: (match[2] || match[3] || '').trim(),
    title: (match[4] || match[5] || match[6] || '').trim(),
    width,
    align: ['left', 'center', 'right'].includes(options.align) ? options.align : 'left'
  };
}

function inlineMarkdown(value = '') {
  const tokens = [];
  const keep = (markup) => {
    const token = `@@MARKDOWN_TOKEN_${tokens.length}@@`;
    tokens.push(markup);
    return token;
  };

  let source = value.replace(/!\[([^\]]*)\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+(?:"([^"]*)"|'([^']*)'))?\s*\)/g, (_, alt, enclosedUrl, plainUrl, title, singleQuotedTitle) => {
    const url = enclosedUrl || plainUrl || '';
    const imageTitle = title || singleQuotedTitle || '';
    const src = safeMarkdownImageUrl(url, '');
    if (!src) return escapeHtml(alt);
    const titleAttr = imageTitle ? ` title="${escapeHtml(imageTitle)}"` : '';
    return keep(`<img src="${src}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async"${titleAttr}>`);
  });
  source = source.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_, label, url) => {
    const href = safeMarkdownUrl(url);
    const external = /^https?:\/\//i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return keep(`<a href="${href}"${external}>${escapeHtml(label)}</a>`);
  });

  let text = escapeHtml(source);
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  tokens.forEach((markup, index) => {
    text = text.replace(`@@MARKDOWN_TOKEN_${index}@@`, markup);
  });
  return text;
}

function renderMarkdown(markdown = '') {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const out = [];
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let code = [];
  let codeLanguage = '';

  const highlightCode = (source, language) => source.split('\n').map((rawLine) => {
    const line = escapeHtml(rawLine);
    if (/^(?:md|markdown)$/.test(language)) {
      const heading = rawLine.match(/^(#{1,6}\s+)(.*)$/);
      if (heading) return `<span class="code-heading">${escapeHtml(heading[1] + heading[2])}</span>`;
      const field = rawLine.match(/^([a-z][a-z0-9_-]*:\s*)(.*)$/i);
      if (field) return `<span class="code-key">${escapeHtml(field[1])}</span><span class="code-value">${escapeHtml(field[2])}</span>`;
    }
    if (/^(?:bash|sh|shell|console)$/.test(language)) {
      const command = rawLine.match(/^(\s*[$#>]\s*)(.*)$/);
      if (command) {
        const highlightedCommand = escapeHtml(command[2]).replace(/(^|\s)(--?[a-z0-9-]+)/gi, '$1<span class="code-flag">$2</span>');
        return `<span class="code-prompt">${escapeHtml(command[1])}</span><span class="code-command">${highlightedCommand}</span>`;
      }
    }
    return line;
  }).join('\n');

  const flushParagraph = () => {
    if (paragraph.length) {
      out.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('```')) {
      flushParagraph(); closeList();
      if (inCode) {
        const languageClass = codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : '';
        const languageData = codeLanguage ? ` data-code-language="${escapeHtml(codeLanguage)}"` : '';
        out.push(`<pre${languageData}><code${languageClass}>${highlightCode(code.join('\n'), codeLanguage)}</code></pre>`);
        code = []; codeLanguage = ''; inCode = false;
      } else {
        codeLanguage = (line.match(/^```([a-z0-9_-]+)/i)?.[1] || '').toLowerCase();
        inCode = true;
      }
      continue;
    }
    if (inCode) { code.push(raw); continue; }
    if (!line.trim()) { flushParagraph(); closeList(); continue; }
    if (/^---+$/.test(line.trim())) { flushParagraph(); closeList(); out.push('<hr>'); continue; }
    const image = parseMarkdownImage(line.trim());
    if (image) {
      flushParagraph(); closeList();
      const src = safeMarkdownImageUrl(image.url, '');
      if (!src) {
        out.push(`<p class="article-image-error">${escapeHtml(image.alt || 'Ảnh không hợp lệ')}</p>`);
        continue;
      }
      const titleAttr = image.title ? ` title="${escapeHtml(image.title)}"` : '';
      const caption = image.title ? `<figcaption>${escapeHtml(image.title)}</figcaption>` : '';
      const widthStyle = image.width ? ` style="--article-image-width:${image.width}"` : '';
      out.push(`<figure class="article-image article-image-align-${image.align}"${widthStyle}><button class="article-image-zoom-trigger" type="button" data-image-zoom><img src="${src}" alt="${escapeHtml(image.alt)}" loading="lazy" decoding="async"${titleAttr}></button>${caption}</figure>`);
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph(); closeList();
      const level = heading[1].length;
      out.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }
    const quote = line.match(/^>\s?(.*)$/);
    if (quote) { flushParagraph(); closeList(); out.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`); continue; }
    const ul = line.match(/^[-*]\s+(.+)$/);
    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (ul || ol) {
      flushParagraph();
      const nextType = ul ? 'ul' : 'ol';
      if (listType !== nextType) { closeList(); listType = nextType; out.push(`<${listType}>`); }
      out.push(`<li>${inlineMarkdown((ul || ol)[1])}</li>`);
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph(); closeList();
  if (inCode) out.push(`<pre><code>${highlightCode(code.join('\n'), codeLanguage)}</code></pre>`);
  return out.join('');
}

function enhanceCodeBlocks(root = document) {
  root.querySelectorAll('.article-page-reader pre:not([data-copy-ready])').forEach((pre) => {
    const code = pre.querySelector('code');
    if (!code) return;
    pre.dataset.copyReady = 'true';
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrap';
    const button = document.createElement('button');
    button.className = 'code-copy-button';
    button.type = 'button';
    button.textContent = document.documentElement.lang.toLowerCase().startsWith('en') ? 'Copy' : 'Sao chép';
    button.setAttribute('aria-label', button.textContent);
    pre.before(wrapper);
    wrapper.append(pre, button);

    button.addEventListener('click', async () => {
      if (button.disabled) return;
      button.disabled = true;
      const originalLabel = document.documentElement.lang.toLowerCase().startsWith('en') ? 'Copy' : 'Sao chép';
      const successLabel = document.documentElement.lang.toLowerCase().startsWith('en') ? 'Copied' : 'Đã sao chép';
      try {
        const value = code.textContent || '';
        if (navigator.clipboard?.writeText && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = value;
          textarea.setAttribute('readonly', '');
          textarea.className = 'code-copy-fallback';
          document.body.append(textarea);
          const previousFocus = document.activeElement;
          try {
            textarea.select();
            if (!document.execCommand('copy')) throw new Error('copy command failed');
          } finally {
            textarea.remove();
            previousFocus?.focus();
          }
        }
        button.textContent = successLabel;
        button.classList.add('copied');
        window.setTimeout(() => {
          button.textContent = originalLabel;
          button.classList.remove('copied');
          button.disabled = false;
        }, 1800);
      } catch (error) {
        button.textContent = uiText('Không thể sao chép', 'Copy failed');
        button.disabled = false;
      }
    });
  });
}

let activeImageTrigger = null;

function enhanceImageZoom(root = document) {
  const triggers = root.querySelectorAll('[data-image-zoom]:not([data-zoom-ready])');
  if (!triggers.length || typeof HTMLDialogElement === 'undefined') return;

  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
  let dialog = document.querySelector('[data-article-image-viewer]');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.className = 'article-image-viewer';
    dialog.dataset.articleImageViewer = '';
    dialog.setAttribute('aria-label', isEnglish ? 'Enlarged image' : 'Ảnh phóng to');

    const closeButton = document.createElement('button');
    closeButton.className = 'article-image-viewer-close';
    closeButton.type = 'button';
    closeButton.dataset.articleImageViewerClose = '';
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', isEnglish ? 'Close enlarged image' : 'Đóng ảnh phóng to');

    const image = document.createElement('img');
    image.dataset.articleImageViewerImage = '';

    const caption = document.createElement('p');
    caption.className = 'article-image-viewer-caption';
    caption.dataset.articleImageViewerCaption = '';
    caption.hidden = true;

    dialog.append(closeButton, image, caption);
    document.body.append(dialog);

    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        dialog.close();
      }
    });
    dialog.addEventListener('close', () => {
      activeImageTrigger?.focus();
      activeImageTrigger = null;
    });
  }

  const viewerImage = dialog.querySelector('[data-article-image-viewer-image]');
  const viewerCaption = dialog.querySelector('[data-article-image-viewer-caption]');
  triggers.forEach((trigger) => {
    const image = trigger.querySelector('img');
    if (!image) return;
    trigger.dataset.zoomReady = 'true';
    trigger.setAttribute('aria-label', `${isEnglish ? 'Enlarge image' : 'Phóng to ảnh'}: ${image.alt || (isEnglish ? 'illustration' : 'hình minh họa')}`);
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.addEventListener('click', () => {
      activeImageTrigger = trigger;
      viewerImage.src = trigger.dataset.imageViewerSrc || image.currentSrc || image.src;
      viewerImage.alt = image.alt;
      const caption = trigger.dataset.imageCaption || trigger.closest('figure')?.querySelector('figcaption')?.textContent?.trim() || '';
      viewerCaption.textContent = caption;
      viewerCaption.hidden = !caption;
      dialog.showModal();
    });
  });
}

async function fetchText(url, errorMessage) {
  return window.md2siteContent.fetchText(url);
}

function localizedDataCandidates(url) {
  const absolute = new URL(url, document.baseURI);
  const localePattern = /\/pages\/data\/[a-z]{2,8}(?:-[a-z0-9]{2,8})?\//i;
  if (!localePattern.test(absolute.pathname)) return [absolute.href];

  const fallback = new URL(absolute.href);
  fallback.pathname = fallback.pathname.replace(localePattern, '/pages/data/vi/');
  const localized = new URL(absolute.href);
  localized.pathname = localized.pathname.replace(localePattern, `/pages/data/${document.body.dataset.contentLanguage || 'vi'}/`);
  return [...new Set([localized.href, absolute.href, fallback.href])];
}

async function fetchLocalizedData(url, errorMessage) {
  return window.md2siteContent.firstAvailable(localizedDataCandidates(url));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColumnParts(totalColumns, itemCount, minimumSpan) {
  const parts = Array(itemCount).fill(minimumSpan);
  let remaining = totalColumns - (itemCount * minimumSpan);
  while (remaining > 0) {
    parts[randomInt(0, itemCount - 1)] += 1;
    remaining -= 1;
  }
  return parts.sort(() => Math.random() - .5);
}

function applyShowcaseLayout(items) {
  const width = window.innerWidth;
  const settings = width <= 620
    ? { columns: 2, minItems: 1, maxItems: 2, minSpan: 1, minHeight: 28, maxHeight: 48 }
    : width <= 900
      ? { columns: 6, minItems: 2, maxItems: 3, minSpan: 2, minHeight: 28, maxHeight: 52 }
      : { columns: 12, minItems: 2, maxItems: 4, minSpan: 3, minHeight: 30, maxHeight: 60 };

  let cursor = 0;
  let row = 0;
  while (cursor < items.length) {
    const remainingItems = items.length - cursor;
    let itemCount = remainingItems <= settings.maxItems
      ? remainingItems
      : randomInt(settings.minItems, settings.maxItems);
    if (remainingItems - itemCount === 1 && itemCount > settings.minItems) itemCount -= 1;
    if (row === 0 && width > 620 && remainingItems > 1) itemCount = 2;

    const columnParts = randomColumnParts(settings.columns, itemCount, settings.minSpan);
    const rowSpan = randomInt(settings.minHeight, settings.maxHeight);
    columnParts.forEach((columnSpan, offset) => {
      const item = items[cursor + offset];
      item.style.gridColumn = `span ${columnSpan}`;
      item.style.gridRow = `span ${rowSpan}`;
    });
    cursor += itemCount;
    row += 1;
  }
}

async function loadShowcase(root = document.querySelector('[data-showcase]')) {
  if (!root) return;
  const grid = root.querySelector('[data-showcase-grid]');

  try {
    const { text: markdown } = await fetchLocalizedData(root.dataset.showcase, 'showcase fetch failed');
    const images = parseMarkdownCollection(markdown).map((item) => {
      const markdownImage = parseMarkdownImage(item.description);
      return {
        title: item.title,
        src: markdownImage?.url || item.meta.src || '',
        alt: markdownImage?.alt || item.meta.alt || item.title,
        position: safeImagePosition(item.meta.position || 'center'),
        note: markdownImage?.title || item.meta.note || (markdownImage ? '' : item.description) || ''
      };
    }).filter((item) => item.src && safeMarkdownImageUrl(item.src, ''));
    if (!images.length) throw new Error('showcase is empty');

    grid.innerHTML = images.map((item, index) => {
      const viewerSrc = item.src.replace(/([?&])w=\d+/i, '$1w=2800');
      return `<button class="showcase-photo" type="button" data-showcase-item="${index}" data-image-zoom data-image-viewer-src="${escapeHtml(viewerSrc)}" data-image-caption="${escapeHtml(item.note)}"><img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" style="object-position:${escapeHtml(item.position)}"${index ? ' loading="lazy"' : ''} decoding="async"></button>`;
    }).join('');
    const items = [...grid.querySelectorAll('[data-showcase-item]')];
    applyShowcaseLayout(items);
    enhanceImageZoom(grid);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => applyShowcaseLayout(items), 180);
    });
  } catch (error) {
    grid.innerHTML = uiText("<p class=\"showcase-error\">Không thể tải showcase. Hãy kiểm tra file Markdown và đường dẫn ảnh.</p>", "<p class=\"showcase-error\">Unable to load the gallery. Check the Markdown file and image paths.</p>");
  }
}

function markdownFiles(indexText, baseUrl) {
  const files = [...indexText.matchAll(/^-\s+([^\s]+\.md)\s*$/gm)]
    .map((match) => match[1].trim());
  const uniqueFiles = [...new Set(files)];
  return baseUrl ? uniqueFiles.map((file) => new URL(file, baseUrl).href) : uniqueFiles;
}

async function loadRoadmap(root = document.querySelector('[data-roadmap-root]')) {
  if (!root) return;
  const nav = root.querySelector('[data-roadmap-nav]');
  nav.setAttribute('aria-label', uiText('Mục lộ trình', 'Roadmap phases')); 
  const content = root.querySelector('[data-roadmap-content]');
  try {
    const requestedIndexUrl = root.dataset.roadmapIndex;
    const { text: indexText, url: indexUrl } = await fetchLocalizedData(requestedIndexUrl, 'roadmap index fetch failed');
    const baseUrl = new URL(indexUrl);
    const phaseFiles = markdownFiles(indexText, baseUrl);
    if (!phaseFiles.length) throw new Error('roadmap index is empty');

    const parsePhase = (text, index) => {
      const lines = text.replace(/\r/g, '').trim().split('\n');
      const heading = lines.shift().match(/^#\s+(.+)$/);
      if (!heading) throw new Error(`roadmap phase ${index + 1} has no title`);
      const title = heading[1].trim();
      const meta = {};
      while (lines.length && !lines[0].startsWith('## ')) {
        const line = lines.shift().trim();
        const m = line.match(/^([a-z]+):\s*(.+)$/i);
        if (m) meta[m[1].toLowerCase()] = m[2].trim();
      }
      const body = lines.join('\n');
      const items = body.split(/^##\s+/m).slice(1).map((part) => {
        const itemLines = part.trim().split('\n');
        const itemTitle = itemLines.shift().trim();
        const itemMeta = {};
        while (itemLines.length) {
          const m = itemLines[0].match(/^([a-z]+):\s*(.+)$/i);
          if (!m) break;
          itemMeta[m[1].toLowerCase()] = m[2].trim();
          itemLines.shift();
        }
        return { title: itemTitle, meta: itemMeta, description: itemLines.join(' ').trim() };
      });
      return { title, meta: { id: `phase-${index + 1}`, ...meta }, items };
    };

    const renderPhase = (phase) => {
      const p = phase;
      const rawStatus = (p.meta.status || '').toLowerCase();
      const statusClass = /available|done|ready|sẵn/.test(rawStatus)
        ? ' done'
        : /progress/.test(rawStatus)
          ? ' progress'
          : /planned/.test(rawStatus)
            ? ' planned'
            : '';
      const items = p.items.map(item => {
        const state = item.meta.state || 'planned';
        const icons = {
          done: '<svg viewBox="0 0 16 16" fill="none"><path d="m4 8.2 2.4 2.4L12 5"/></svg>',
          progress: '<svg viewBox="0 0 16 16" fill="none"><path d="M3.5 8h8M8.5 4.5 12 8l-3.5 3.5"/></svg>',
          planned: '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="2.25"/></svg>'
        };
        const icon = icons[state] || icons.planned;
        return `<article class="roadmap-item ${escapeHtml(state)}"><div class="mark" aria-hidden="true">${icon}</div><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div><time>${escapeHtml(item.meta.date || '')}</time></article>`;
      }).join('');
      return `<section class="phase" id="${escapeHtml(p.meta.id)}"><div class="phase-header"><div><span class="eyebrow">${escapeHtml(p.meta.label || '')}</span><h2 class="title-lg">${escapeHtml(p.title)}</h2></div><span class="status${statusClass}">${escapeHtml(p.meta.status || '')}</span></div><div class="roadmap-items">${items}</div></section>`;
    };

    nav.innerHTML = '';
    content.innerHTML = '<div class="roadmap-load-more" data-roadmap-load-more><button class="btn btn-secondary" type="button"></button><span aria-live="polite"></span></div>';
    const marker = content.querySelector('[data-roadmap-load-more]');
    marker.querySelector('button').textContent = uiText('Tải thêm giai đoạn', 'Load more phases');
    await window.md2siteCollections.mount({
      items: phaseFiles, marker,
      loadItem: async (url, index) => parsePhase((await fetchLocalizedData(url)).text, index),
      renderBatch: (phases) => {
        nav.insertAdjacentHTML('beforeend', phases.map((p) => '<a href="#' + escapeHtml(p.meta.id) + '">' + escapeHtml(p.title) + '</a>').join(''));
        marker.insertAdjacentHTML('beforebegin', phases.map(renderPhase).join(''));
        normalizeFragmentLinks(nav);
      },
      messages: {
        loading: uiText('Đang tải các giai đoạn tiếp theo…', 'Loading more phases…'),
        remaining: (count) => uiText('Còn ' + count + ' giai đoạn chưa tải.', count + ' phases remaining.'),
        error: uiText('Không thể tải thêm giai đoạn. Bạn có thể thử lại.', 'Unable to load more phases. Please try again.')
      }
    });
  } catch (error) {
    nav.innerHTML = '';
    content.innerHTML = uiText("<p class=\"muted\">Không thể đọc danh sách giai đoạn trong thư mục nội dung của trang roadmap. Hãy kiểm tra file chỉ mục và chạy website qua HTTP/hosting tĩnh.</p>", "<p class=\"muted\">Unable to load roadmap phases. Check the index file and serve the website over HTTP.</p>");
  }
}

function parseArticleMarkdown(markdown, fallbackTitle = '') {
  const lines = markdown.replace(/\r/g, '').trim().split('\n');
  const heading = lines.shift()?.match(/^#\s+(.+)$/);
  const title = heading ? heading[1].trim() : fallbackTitle;
  const meta = {};
  while (lines.length) {
    const line = lines[0].trim();
    if (!line) { lines.shift(); continue; }
    const match = line.match(/^([a-z]+):\s*(.+)$/i);
    if (!match) break;
    meta[match[1].toLowerCase()] = match[2].trim();
    lines.shift();
  }
  return { title, meta, body: `# ${title}\n\n${lines.join('\n').trim()}` };
}

async function loadArticlesIndex(root = document.querySelector('[data-articles-root]')) {
  if (!root) return;
  const list = root.querySelector('[data-articles-list]');
  try {
    const { text, url: indexUrl } = await fetchLocalizedData(root.dataset.articlesIndex, 'articles index fetch failed');
    const articleFiles = markdownFiles(text);
    const articlesBaseUrl = new URL('./', indexUrl);
    if (!articleFiles.length) throw new Error('articles index is empty');

    list.innerHTML = '<div class="articles-load-more" data-articles-load-more><button class="btn btn-secondary" type="button"></button><span aria-live="polite"></span></div>';
    const marker = list.querySelector('[data-articles-load-more]');
    marker.querySelector('button').textContent = uiText('Tải thêm bài viết', 'Load more articles');
    await window.md2siteCollections.mount({
      items: articleFiles, marker,
      loadItem: async (file) => ({ file, ...parseArticleMarkdown((await fetchLocalizedData(new URL(file, articlesBaseUrl).href)).text, file.replace(/\.md$/i, '')) }),
      renderBatch: (articles, cursor) => {
        const markup = articles.map((article, offset) => {
          const params = new URLSearchParams({ post: article.file });
          const number = String(cursor + offset + 1).padStart(2, '0');
          params.set('page', 'article');
          return `<a class="article-list-item" href="pages/?${params.toString()}"><span class="article-number">${number}</span><h2>${escapeHtml(article.title)}</h2><time>${escapeHtml(article.meta.date || '')}</time><span class="article-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"/></svg></span></a>`;
        }).join('');
        marker.insertAdjacentHTML('beforebegin', markup);
      },
      messages: {
        loading: uiText('Đang tải các bài viết tiếp theo…', 'Loading more articles…'),
        remaining: (count) => uiText('Còn ' + count + ' bài viết chưa tải.', count + ' articles remaining.'),
        error: uiText('Không thể tải thêm bài viết. Bạn có thể thử lại.', 'Unable to load more articles. Please try again.')
      }
    });
  } catch (error) {
    list.innerHTML = `<p class="muted">${uiText('Không thể đọc danh sách bài viết trong thư mục nội dung của trang articles. Hãy kiểm tra file chỉ mục và chạy website qua HTTP/hosting tĩnh.', 'Unable to load the article list. Check the index file and serve the website over HTTP.')}</p>`;
  }
}

async function loadArticlePage() {
  const root = document.querySelector('[data-article-page]');
  if (!root) return;
  const reader = root.querySelector('[data-article-page-reader]');
  const file = new URLSearchParams(location.search).get('post') || '';
  if (!/^[a-z0-9][a-z0-9-]*\.md$/i.test(file)) {
    const title = uiText('Không tìm thấy bài viết', 'Article not found');
    const description = uiText('Đường dẫn bài viết không hợp lệ.', 'The article URL is invalid.');
    reader.innerHTML = `<h1>${title}</h1><p>${description}</p>`;
    updateSeo({ title: `${title} — md2site`, description, noindex: true });
    return;
  }
  try {
    const { text: markdown } = await fetchLocalizedData(`pages/data/vi/articles/${file}`, 'article fetch failed');
    const article = parseArticleMarkdown(markdown, file.replace(/\.md$/i, ''));
    reader.innerHTML = renderMarkdown(article.body);
    normalizeFragmentLinks(reader);
    enhanceCodeBlocks(reader);
    enhanceImageZoom(reader);
    const heading = reader.querySelector('h1');
    const articleTitle = heading ? `${heading.textContent} — md2site` : `${article.title} — md2site`;
    const articleDescription = article.meta.description || article.meta.meta_description || markdownExcerpt(article.body.replace(/^#\s+.*$/m, ''));
    updateSeo({
      title: articleTitle,
      description: articleDescription,
      keywords: article.meta.keywords || document.querySelector('meta[name="keywords"]')?.content || '',
      type: 'article',
      published: normalizeArticleDate(article.meta.date || ''),
      image: article.meta.image || ''
    });
  } catch (error) {
    const title = uiText('Không thể tải bài viết', 'Unable to load article');
    const description = uiText('Bài viết không tồn tại hoặc không thể tải.', 'The article does not exist or could not be loaded.');
    reader.innerHTML = `<h1>${title}</h1><p>${description}</p>`;
    updateSeo({ title: `${title} — md2site`, description, noindex: true });
  }
}

function parseMarkdownCollection(markdown = '') {
  return markdown.replace(/\r/g, '').split(/^##\s+/m).slice(1).map((chunk) => {
    const lines = chunk.trim().split('\n');
    const title = lines.shift()?.trim() || '';
    const meta = {};
    while (lines.length) {
      const line = lines[0].trim();
      if (!line) { lines.shift(); continue; }
      const match = line.match(/^([a-z]+):\s*(.+)$/i);
      if (!match) break;
      meta[match[1].toLowerCase()] = match[2].trim();
      lines.shift();
    }
    return { title, meta, description: lines.join(' ').trim() };
  }).filter((item) => item.title);
}

let activeLanguageContent = new Map();

function configureContactForm(getContent) {
  const slot = document.querySelector('[data-contact-form-slot]');
  if (!slot) return;
  const grid = slot.closest('.contact-grid');
  const mode = (getContent('form_mode') || 'default').trim().toLowerCase();

  if (mode === 'hidden') {
    slot.hidden = true;
    grid?.classList.add('contact-grid-form-hidden');
    return;
  }

  if (mode !== 'embed') return;
  const rawUrl = (getContent('form_embed_url') || '').trim();
  const title = (getContent('form_embed_title') || 'Biểu mẫu liên hệ').trim();
  const requestedHeight = Number.parseInt(getContent('form_embed_height') || '640', 10);
  const height = Number.isFinite(requestedHeight) ? Math.min(Math.max(requestedHeight, 320), 1600) : 640;

  try {
    const url = new URL(rawUrl, location.href);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('unsupported form URL');
    slot.innerHTML = `<div class="contact-form contact-form-embed"><iframe src="${escapeHtml(url.href)}" title="${escapeHtml(title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" style="height:${height}px"></iframe><p><a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">Mở biểu mẫu trong cửa sổ mới →</a></p></div>`;
  } catch (error) {
    slot.innerHTML = '<div class="contact-form contact-form-config-error"><p>Không thể nhúng biểu mẫu. Hãy kiểm tra <code>form_embed_url</code> trong file Markdown.</p></div>';
  }
}

async function loadLanguages() {
  const picker = document.querySelector('[data-language-picker]');
  const trigger = document.querySelector('[data-language-trigger]');
  const menu = document.querySelector('[data-language-menu]');
  if (!picker || !trigger || !menu) return;

  try {
    const { languages, selected } = await window.md2siteContent.language();
    trigger.querySelector('[data-language-code]').textContent = selected.code.slice(0, 2).toUpperCase();
    trigger.setAttribute('aria-label', `Language: ${selected.label}`);
    menu.innerHTML = languages.map((language) => `<button type="button" role="menuitemradio" aria-checked="${language.code === selected.code}" data-language-option="${escapeHtml(language.code)}"><span>${escapeHtml(language.code.slice(0, 2).toUpperCase())}</span><span>${escapeHtml(language.label)}</span></button>`).join('');
    document.documentElement.lang = selected.code;
    document.dispatchEvent(new Event('md2site:language'));
    document.querySelector('.nav')?.setAttribute('aria-label', uiText('Điều hướng chính', 'Main navigation'));
    document.querySelector('[data-menu-button]')?.setAttribute('aria-label', uiText('Mở menu', 'Open menu'));
    document.querySelector('.footer-legal-links')?.setAttribute('aria-label', uiText('Chính sách', 'Policies'));

    const translation = await fetchText(selected.file, `language fetch failed: ${selected.file}`);
    activeLanguageContent = new Map(parseMarkdownCollection(translation).map((item) => [item.title, item.description]));

    const setMenu = (open) => {
      picker.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', String(open));
    };
    trigger.addEventListener('click', () => setMenu(!picker.classList.contains('open')));
    menu.querySelectorAll('[data-language-option]').forEach((option) => {
      option.addEventListener('click', () => {
        window.md2siteContent.storage.set('md2site-language', option.dataset.languageOption);
        location.reload();
      });
    });
    document.addEventListener('click', (event) => { if (!picker.contains(event.target)) setMenu(false); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && picker.classList.contains('open')) { setMenu(false); trigger.focus(); }
    });
  } catch (error) {
    picker.remove();
  }
}

async function loadCustomContent() {
  const sources = (document.body.dataset.customSources || '').split(/\s+/).filter(Boolean);
  if (!sources.length) return;

  try {
    const documents = await Promise.all(sources.map((source) => fetchText(source, `custom content fetch failed: ${source}`)));
    const content = new Map();
    documents.forEach((markdown) => {
      parseMarkdownCollection(markdown).forEach((item) => content.set(item.title, item.description));
    });
    activeLanguageContent.forEach((value, key) => content.set(key, value));
    const pagePrefix = document.body.dataset.seoPage || '';
    const getContent = (key) => {
      const pageKey = pagePrefix ? `${pagePrefix}_${key}` : '';
      return (pageKey && content.has(pageKey)) ? content.get(pageKey) : content.get(key);
    };

    document.querySelectorAll('[data-custom-key]').forEach((element) => {
      const key = element.dataset.customKey;
      const value = getContent(key);
      if (value !== undefined) element.textContent = value;
    });

    const attributeBindings = {
      customSrc: 'src',
      customAlt: 'alt',
      customPlaceholder: 'placeholder',
      customHref: 'href'
    };
    Object.entries(attributeBindings).forEach(([datasetKey, attribute]) => {
      const selector = `[data-${datasetKey.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}]`;
      document.querySelectorAll(selector).forEach((element) => {
        const value = getContent(element.dataset[datasetKey]);
        if (value !== undefined) element.setAttribute(attribute, value);
      });
    });

    const title = getContent('meta_title');
    const description = getContent('meta_description');
    const seoPage = document.body.dataset.seoPage;
    const keywords = seoPage ? getContent('keywords') : '';
    if (!document.querySelector('[data-article-page]')) {
      updateSeo({
        title: title || document.title,
        description,
        keywords,
        image: getContent('og_image') || '',
        noindex: document.body.dataset.routeError === 'true'
      });
    }
    configureContactForm(getContent);
    normalizeFragmentLinks();
  } catch (error) {
    document.body.classList.add('custom-content-error');
  }
}

async function loadPageTemplates() {
  const root = document.querySelector('[data-page-templates]');
  const source = root?.closest('[data-page-templates-source]')?.dataset.pageTemplatesSource;
  if (!root || !source) return;
  try {
    const templates = window.md2sitePageTemplates;
    if (!templates) throw new Error('page templates module is unavailable');
    root.setAttribute('aria-busy', 'true');
    const markdown = await fetchText(source, `page templates fetch failed: ${source}`);
    const sections = templates.parse(markdown);
    if (!sections.length) throw new Error('page templates are empty');
    root.innerHTML = templates.render(sections);
    normalizeFragmentLinks(root);
    enhanceCodeBlocks(root);
  } catch (error) {
    root.innerHTML = `<section class="section"><div class="container"><p class="muted">Không thể dựng trang từ <code>${escapeHtml(source)}</code>.</p></div></section>`;
  } finally {
    root.removeAttribute('aria-busy');
  }
}

// A base URL is used for assets. Fragment links must still address this page,
// including its page/post query, when opened by keyboard or in a new tab.
function normalizeFragmentLinks(root = document) {
  const links = [...root.querySelectorAll('a[href^="#"]')];
  if (root.matches?.('a[href^="#"]')) links.push(root);
  links.forEach((link) => {
    const url = new URL(location.href);
    url.hash = link.getAttribute('href');
    link.href = url.href;
  });
}

normalizeFragmentLinks();
async function initializeSite() {
  await window.md2siteShellReady;
  await loadLanguages();
  await loadPageTemplates();
  bindContactForm();
  await loadCustomContent();
  await Promise.all([
    ...[...document.querySelectorAll('[data-roadmap-root]')].map((root) => loadRoadmap(root)),
    ...[...document.querySelectorAll('[data-articles-root]')].map((root) => loadArticlesIndex(root)),
    loadArticlePage(),
    ...[...document.querySelectorAll('[data-showcase]')].map((root) => loadShowcase(root))
  ]);
  if (location.hash) {
    try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView(); }
    catch { /* Ignore malformed fragments. */ }
  }
}

window.md2siteReady = initializeSite().catch((error) => {
  document.body.classList.add("site-initialization-error");
  console.error("Site initialization failed", error);
});
