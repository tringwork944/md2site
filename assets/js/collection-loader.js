/* Shared pagination controller. Renderers own markup; this owns request state. */
(() => {
  async function mount({ items, marker, loadItem, renderBatch, messages, batchSize = 4 }) {
    const button = marker.querySelector('button');
    const status = marker.querySelector('[aria-live]');
    let cursor = 0;
    let pending = null;
    let automaticPaused = false;
    let observer;

    function loadNext() {
      if (pending) return pending;
      if (cursor >= items.length) return Promise.resolve();
      automaticPaused = false;
      observer?.unobserve(marker);
      button.disabled = true;
      marker.setAttribute('aria-busy', 'true');
      status.textContent = messages.loading;
      pending = (async () => {
        try {
          const batch = await Promise.all(items.slice(cursor, cursor + batchSize).map((item, offset) => Promise.resolve().then(() => loadItem(item, cursor + offset))));
          renderBatch(batch, cursor);
          cursor += batch.length;
          if (cursor >= items.length) {
            observer?.disconnect();
            marker.remove();
          } else {
            status.textContent = messages.remaining(items.length - cursor);
            observer?.observe(marker);
          }
        } catch (error) {
          // Keep the cursor unchanged. Only an explicit click retries a failed
          // batch, even if an already queued observer notification arrives.
          automaticPaused = true;
          status.textContent = messages.error;
        } finally {
          button.disabled = false;
          marker.removeAttribute('aria-busy');
          pending = null;
        }
      })();
      return pending;
    }

    button.addEventListener('click', loadNext);
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        if (!automaticPaused && entries.some((entry) => entry.isIntersecting)) loadNext();
      }, { rootMargin: '200px 0px' });
    }
    if (items.length) await loadNext();
    else { observer?.disconnect(); marker.remove(); }
    return Object.freeze({ loadNext });
  }

  window.md2siteCollections = Object.freeze({ mount });
})();
