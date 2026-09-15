/* Registry for body templates. */
(() => {
  const templates = new Map();
  let activeName = '';

  window.md2siteBodyTemplates = Object.freeze({
    register(name, renderer) {
      if (!/^[a-z0-9][a-z0-9-]*$/i.test(name) || typeof renderer !== 'function') {
        throw new Error('Invalid body template registration');
      }
      templates.set(name.toLowerCase(), renderer);
    },
    activate(name) {
      const normalizedName = String(name || '').toLowerCase();
      if (!templates.has(normalizedName)) throw new Error(`Body template not registered: ${normalizedName}`);
      activeName = normalizedName;
    },
    active() {
      return activeName ? templates.get(activeName) : null;
    },
    activeName: () => activeName,
    names: () => Object.freeze([...templates.keys()])
  });
})();
