/* Template: footer-basic-01 */
(() => {
  function render() {
    return `<footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <a class="brand" href="pages/?page=home" aria-label="md2site">
            <span class="brand-mark" aria-hidden="true"><span class="brand-fallback">B</span><img class="brand-logo brand-logo-light" src="assets/images/beestudiosns/01_bee_studio_sns_light.svg" alt="" width="32" height="32"><img class="brand-logo brand-logo-dark" src="assets/images/beestudiosns/02_bee_studio_sns_dark.svg" alt="" width="32" height="32"></span>
            <span data-custom-key="brand">md2site</span>
          </a>
          <p data-custom-key="footer_tagline"></p>
        </div>
        <nav class="footer-navigation" aria-labelledby="footer-navigation-title">
          <h4 id="footer-navigation-title" data-custom-key="footer_website"></h4>
          <div class="footer-links">
            <a href="pages/?page=home" data-custom-key="nav_home"></a>
            <a href="pages/?page=articles" data-custom-key="footer_articles"></a>
            <a href="pages/?page=roadmap" data-custom-key="footer_roadmap"></a>
            <a href="pages/?page=download" data-custom-key="nav_download"></a>
          </div>
        </nav>
      </div>
      <div class="container footer-bottom">
        <span data-custom-key="footer_copyright"></span>
        <nav class="footer-legal-links" aria-label="Chính sách"><a href="pages/?page=privacy-policy" data-custom-key="footer_privacy_policy"></a><a href="pages/?page=license" data-custom-key="footer_license"></a></nav>
      </div>
    </footer>`;
  }
  window.md2siteFooterTemplate = Object.freeze({ render });
})();
