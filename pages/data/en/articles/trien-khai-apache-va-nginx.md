# Deploying md2site on Apache2 and Nginx
date: 12/09/2026
description: Deploy the complete md2site website on Apache2 hosting or a Nginx server and verify content loading and error handling.
keywords: md2site, Apache2, Nginx, static website deployment, Markdown

This guide covers Apache2 and Nginx server configuration. Git, preview branches, and Cloudflare Workers are covered in [Deploying and running md2site](pages/?page=article&post=bat-dau-voi-md2site.md).

Choose Apache or Nginx when you already have shared hosting, a VPS, or a reason to manage the server yourself. Keep source history in GitHub or another version-control service regardless of the hosting option.

md2site has no backend or database, but it still needs a web server to serve HTML, CSS, JavaScript, images, and Markdown. Uploading only `index.html` does not provide the files needed to render content.

Before deployment, replace example domains in your SEO configuration, `robots.txt`, and `sitemap.xml`, then test the local website again.

## What to upload

Preserve the project structure, including `assets/`, `pages/`, `index.html`, the 404 page, and relevant configuration files. The browser requests `.md` files directly, so public content files must be readable over HTTP.

md2site uses query-string routes such as `pages/?page=home`. Apache and Nginx preserve query strings without a separate rewrite rule for each page.

## Deploy on Apache2

Upload the project to the website's public directory, often named `public_html`, `htdocs`, or a document root supplied by your host.

The root `.htaccess` configures:

- `index.html` as the directory index.
- UTF-8 responses.
- The `text/markdown` MIME type for `.md` files.
- Cache revalidation for HTML and Markdown.
- `404.html` as the error document while preserving HTTP 404.

The server must permit the directives in `.htaccess`, for example with `AllowOverride All`. The supplied configuration no longer requires rewrite rules to redirect missing files.

Do not redirect missing Markdown, scripts, or images to a renderer returning HTTP 200. The browser must be able to recognize missing resources so language fallback and error messages work correctly.

When hosting in a subdirectory, review root-relative error-document paths in `.htaccess` and `404.html`; the supplied error page assumes deployment at the domain root.

## Deploy on Nginx

Use the provided `deploy/nginx.conf` as a starting point. Copy the website to a directory such as `/var/www/md2site`, then adjust:

```nginx
server_name example.com www.example.com;
root /var/www/md2site;
```

Replace the example domain and root with your actual values. The configuration declares UTF-8 and MIME types, revalidates HTML/Markdown, and serves `404.html` for missing resources without changing their status to HTTP 200:

```nginx
error_page 404 /404.html;
```

Check syntax before reloading:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

HTTPS certificates may be configured by Certbot or your hosting platform. Review the resulting configuration to avoid conflicting server blocks with the same `server_name`.

## Verify after deployment

Check more than the homepage:

- `/` should open `pages/?page=home`.
- `/pages/?page=articles` should display the article list.
- `/pages/?page=article&post=bat-dau-voi-md2site.md` should open an article.
- Both `/pages/data/vi/articles/index.md` and `/pages/data/en/articles/index.md` should return Markdown with HTTP 200.
- Switching language should update the list, article content, and theme controls.
- A missing resource should return HTTP 404.
- The visible error route should use `noindex` metadata.

If the shell loads without content, look for failing `.md` requests in DevTools Network. A 404 often means a missing file or incorrect document root. A 403 often means read permissions are wrong. Broken accented characters can indicate an encoding problem.

Once the URLs work, enable HTTPS and recheck canonical URLs, Open Graph metadata, `robots.txt`, and `sitemap.xml` on the production domain.
