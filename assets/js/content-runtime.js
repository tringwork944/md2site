/* Shared content loading and language selection for the static renderer. */
(() => {
  const documents = new Map();
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ } }
  };

  async function read(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, { cache: 'default', signal: controller.signal });
      if (!response.ok) throw new Error(`Content unavailable (${response.status}): ${url}`);
      const text = await response.text();
      if (/\btext\/html\b/i.test(response.headers.get('content-type') || '') || /^\s*(?:<!doctype\s+html|<html\b)/i.test(text)) {
        throw new Error(`Expected Markdown, received HTML: ${url}`);
      }
      return text;
    } finally {
      clearTimeout(timeout);
    }
  }

  function fetchText(url) {
    const absolute = new URL(url, document.baseURI).href;
    if (!documents.has(absolute)) {
      documents.set(absolute, read(absolute).catch((error) => {
        documents.delete(absolute);
        throw error;
      }));
    }
    return documents.get(absolute);
  }

  function parseLanguages(markdown) {
    return markdown.replace(/\r/g, '').split(/^##\s+/m).slice(1).map((chunk) => {
      const lines = chunk.trim().split('\n');
      const code = lines.shift().trim().toLowerCase();
      const meta = {};
      for (const line of lines) {
        const match = line.match(/^([a-z_]+):\s*(.+)$/i);
        if (match) meta[match[1].toLowerCase()] = match[2].trim();
      }
      return { code, label: meta.label || code, file: meta.file || '', isDefault: meta.default === 'true' };
    }).filter((language) => /^[a-z]{2,8}(?:-[a-z0-9]{2,8})?$/.test(language.code) && /^assets\/content\/[a-z0-9/_-]+\.md$/i.test(language.file));
  }

  function selectLanguage(languages, saved) {
    const selected = languages.find((language) => language.code === saved)
      || languages.find((language) => language.isDefault) || languages[0];
    if (!selected) throw new Error('No supported languages configured');
    return selected;
  }

  async function firstAvailable(urls) {
    let lastError;
    for (const url of [...new Set(urls)]) {
      try { return { text: await fetchText(url), url: new URL(url, document.baseURI).href }; }
      catch (error) { lastError = error; }
    }
    throw lastError || new Error('No content source configured');
  }

  function parseManifest(markdown = '') {
    return markdown.replace(/\r/g, '').split(/^##\s+/m).slice(1).map((chunk) => {
      const lines = chunk.trim().split('\n');
      const heading = lines.shift().trim().toLowerCase();
      const meta = {};
      for (const line of lines) {
        const match = line.match(/^([a-z_]+):\s*(.+)$/i);
        if (match) meta[match[1].toLowerCase()] = match[2].trim();
      }
      return Object.freeze({
        ...meta,
        slug: (meta.trang || heading).toLowerCase(),
        source: meta.nguon_trang || meta.source || '',
        pageTitle: meta.tieu_de_trang || meta.title || '',
        dependencies: meta.tai_nguyen_phu_thuoc || meta.dependencies || '',
        header: meta.header || 'header-basic-01',
        footer: meta.footer || 'footer-basic-01',
        body: meta.body || ''
      });
    });
  }

  let manifestPromise;
  function manifest() {
    return manifestPromise ||= fetchText('pages/index.md')
      .then((markdown) => Object.freeze(parseManifest(markdown)))
      .catch((error) => { manifestPromise = null; throw error; });
  }

  let languagePromise;
  function language() {
    return languagePromise ||= fetchText('assets/content/languages/index.md').then((markdown) => {
      const languages = parseLanguages(markdown);
      return { languages, selected: selectLanguage(languages, storage.get('md2site-language')) };
    }).catch((error) => { languagePromise = null; throw error; });
  }

  window.md2siteContent = Object.freeze({ storage, fetchText, firstAvailable, language, parseLanguages, selectLanguage, manifest, parseManifest });
})();
