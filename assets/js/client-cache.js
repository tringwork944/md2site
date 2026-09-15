(() => {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return;

  window.addEventListener('load', () => {
    const serviceWorkerUrl = new URL('service-worker.js', document.baseURI);
    navigator.serviceWorker.register(serviceWorkerUrl, { scope: new URL('./', serviceWorkerUrl).pathname })
      .catch((error) => console.warn('Không thể bật cache phía trình duyệt.', error));
  }, { once: true });
})();
