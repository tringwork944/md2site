# Deploying and running md2site
date: 12/09/2026
description: Learn the md2site structure, run it on a local web server, deploy with GitHub and Cloudflare Workers, and manage updates.
keywords: md2site, deployment, Cloudflare Workers, GitHub, Markdown, static website

Start here if you are new to md2site. This guide explains the required files, local testing, deployment with GitHub and Cloudflare Workers, and a reliable update workflow.

Creating pages, writing articles, building templates, and translating content are covered in the dedicated guides linked at the end.

## How does md2site work?

md2site is a static website that uses Markdown as its content source. It needs no database, backend, or build step. The browser loads an HTML shell, reads the route from the URL, and fetches the corresponding Markdown and templates.

Opening `pages/?page=home` starts this sequence:

1. Load the shared shell in `pages/index.html`.
2. Read the `home` route from the query string.
3. Find its declaration in `pages/index.md`.
4. Select the content file for the current language.
5. Detect the sections declared in Markdown.
6. Load the required templates and stylesheets.
7. Render content, navigation, footer, and SEO metadata.

Articles use the `article` route and a `post` parameter:

```text
pages/?page=article&post=bat-dau-voi-md2site.md
```

## Files to keep together

A complete md2site package includes:

- `index.html`: redirects visitors to the main page.
- `pages/index.html`: the shared HTML shell.
- `pages/index.md`: route and navigation declarations.
- `pages/content/`: page content.
- `pages/data/`: articles, roadmap phases, and collection data.
- `assets/`: CSS, JavaScript, templates, and images.
- `wrangler.jsonc`: Cloudflare Workers configuration.
- `404.html`, `robots.txt`, and `sitemap.xml`: error handling and technical SEO.

Do not upload only `index.html`. Paths depend on this directory structure, so extract and deploy the complete package together.

## Step 1: run the website locally

Use a local web server that can serve static files. Download md2site, extract the complete source into its website directory, and start the server.

Open the localhost address shown by your server and navigate to md2site. Do not open the files using `file://`: the browser must fetch Markdown over HTTP.

Before deployment, check that:

- The homepage displays content and navigation.
- The Articles page loads its list.
- An article opens correctly from that list.
- CSS, JavaScript, images, and Markdown load successfully.
- A missing URL shows an error page.

If the shell appears without content, open DevTools Network and look for failed `.md` requests.

## Step 2: check the Cloudflare configuration

The project includes `wrangler.jsonc`:

```json
{
  "name": "md2site",
  "compatibility_date": "2026-08-26",
  "assets": {
    "directory": ".",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

`assets.directory` is `.` because the project directory contains the static assets to publish. `not_found_handling: 404-page` uses `404.html` for missing resources. `html_handling` controls consistent HTML URL handling.

You may change `name` before the first deployment. The Worker name in the Cloudflare dashboard must match it.

## Step 3: upload the source to GitHub

Create an empty GitHub repository. If the md2site directory is not already a Git repository, run:

```bash
git init
git add .
git commit -m "Initialize md2site"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your repository. If it already has history, check `git status` and `git remote -v` before changing configuration.

Do not commit tokens, passwords, environment files, or local-only data. Keep GitHub as your source of truth so changes have history and can be recovered.

## Step 4: connect Cloudflare Workers Builds

In the Cloudflare dashboard:

1. Open **Workers & Pages** and choose **Create application**.
2. Choose **Get started** under **Import a repository**.
3. Connect GitHub and select your md2site repository.
4. Select `main` as the production branch.
5. Leave **Build command** empty: md2site needs no compilation.
6. Keep **Deploy command** as `npx wrangler deploy`.
7. Set **Root directory** to `/` if `wrangler.jsonc` is at the repository root.
8. Save and wait for the first deployment to finish.

For an existing Worker, open **Settings → Builds → Connect**. If deployment fails because names differ, compare the dashboard name with `name` in `wrangler.jsonc`.

## Step 5: manage preview and production

Enable builds for non-production branches under **Settings → Build → Branch control**. The intended workflow is:

- Production runs `npx wrangler deploy` and updates the active deployment.
- Other branches run `npx wrangler versions upload` to create a preview without replacing production.

For each update:

1. Create a branch for a related set of changes.
2. Edit content or presentation.
3. Test with your local server.
4. Push the branch to GitHub.
5. Open its Cloudflare preview URL.
6. Check small and large screens.
7. Merge into `main` once the changes are ready.
8. Check the production website again.

Avoid editing deployment files directly: the next push will replace those edits.

## Daily maintenance

Keep each commit focused on a clear task. For an article update, for example:

```bash
git checkout -b content/update-articles
git add pages/data/vi/articles pages/data/en/articles
git commit -m "Update articles"
git push -u origin content/update-articles
```

Before merging, review titles, internal links, images, light and dark themes, and the browser console. To restore an earlier state, prefer a revert commit that preserves the history of what happened.

## Connect a domain and finish SEO setup

Once the `workers.dev` site works, add a custom domain under the Worker's **Domains & Routes**. After DNS and HTTPS are ready:

1. Replace `https://example.com` in `sitemap.xml` with your real domain.
2. Update the `Sitemap:` line in `robots.txt`.
3. Check canonical and Open Graph metadata on representative routes.
4. Submit the sitemap in Google Search Console if you want the website indexed.

## Troubleshooting

- **Deployment fails immediately:** check the Worker name, root directory, and GitHub integration permissions.
- **The shell loads but content is blank:** verify that Markdown files were uploaded and return valid content with HTTP 200.
- **An article is absent:** check its filename in the selected language's article index.
- **Preview is correct but production has not changed:** confirm that the commit is on the production branch and its deployment is active.
- **The 404 page is wrong:** check `404.html` and `not_found_handling`.
- **Old content remains visible:** reload without cache and confirm the deployment and domain you are viewing.

## Handoff checklist

- Deploy the complete directory structure.
- Check homepage, navigation, and footer.
- Confirm article list and reader load Markdown.
- Check missing URLs and missing resources.
- Resolve unexpected Network errors.
- Keep preview branches separate from production.
- Enable HTTPS on the production domain.
- Use the same domain in canonical URLs, `robots.txt`, and `sitemap.xml`.

## Continue with a dedicated guide

- [Managing layouts](pages/?page=article&post=huong-dan-su-dung-mau-giao-dien.md): sections, templates, and CSS.
- [Managing pages](pages/?page=article&post=huong-dan-trien-khai-va-quan-ly-trang.md): routes, navigation, and page lifecycle.
- [Managing articles](pages/?page=article&post=huong-dan-va-quan-ly-bai-viet.md): publishing, ordering, and removing articles.
- [Managing languages](pages/?page=article&post=tuy-chinh-giao-dien-va-ngon-ngu.md): locales and translations.
- [Managing the sitemap](pages/?page=article&post=khai-bao-sitemap-xml.md): publishing URLs for search engines.
- [Deploying on Apache2 and Nginx](pages/?page=article&post=trien-khai-apache-va-nginx.md): alternative hosting options.

References: [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), and [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/).
