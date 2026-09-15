# Creating and maintaining a sitemap
date: 12/09/2026
description: Build, update, validate, and submit sitemap.xml for md2site pages and articles.
keywords: md2site, sitemap.xml, technical SEO, Google Search Console

This guide covers publishing URLs for search engines. Page creation, article writing, and server configuration are covered in their respective guides.

The root `sitemap.xml` lists public URLs you want search engines to discover. It does not list physical Markdown file paths.

The supplied sitemap is maintained manually. As the site grows, a generator based on the route manifest and article indexes can help prevent omissions.

## Routes are not content paths

A page might use `pages/content/en/contact.md`, but its sitemap URL is:

```text
https://your-domain.com/pages/?page=contact
```

An article file named `new-guide.md` has a public URL such as:

```text
https://your-domain.com/pages/?page=article&post=new-guide.md
```

List accessible canonical URLs rather than source files.

## Step 1: replace the example domain

Replace every `https://example.com` in `sitemap.xml` with your HTTPS production domain. Then update `robots.txt`:

```text
User-agent: *
Allow: /
Sitemap: https://your-domain.com/sitemap.xml
```

Do not mix localhost, preview domains, and both www/non-www versions. Use the canonical domain published by the website.

## Step 2: add a page URL

Pages are declared in `pages/index.md`. A route can be hidden from navigation using `nav: false` while remaining public and eligible for your sitemap:

```xml
<url>
  <loc>https://your-domain.com/pages/?page=faq</loc>
  <lastmod>2026-09-12</lastmod>
</url>
```

Only add this entry after creating the FAQ route and its content. Exclude the article shell without `post`, the 404 page, administration URLs, Markdown files, and pages marked `noindex`.

## Step 3: add an article URL

For `new-guide.md`, add:

```xml
<url>
  <loc>https://your-domain.com/pages/?page=article&amp;post=new-guide.md</loc>
  <lastmod>2026-09-12</lastmod>
</url>
```

XML requires `&amp;` instead of a raw `&`. Use `YYYY-MM-DD` for `lastmod`, reflecting the latest substantial change to content, structured data, or important links.

Do not set every entry to the deployment date when its content has not changed.

## Step 4: keep URLs synchronized

Update related files together:

- New page: route manifest, content, and sitemap.
- New article: content, language indexes, and sitemap.
- Renamed article: filenames, `post=` links, indexes, translations, and sitemap.
- Removed content: sitemap entries and internal links.
- Moved URL: hosting redirect and canonical sitemap URL.

The order of sitemap entries does not determine article display order. Group pages and articles in a way that is easy to maintain.

## Step 5: validate XML and HTTP responses

Before release:

1. Open `sitemap.xml` in a browser or XML validator.
2. Confirm UTF-8 encoding.
3. Look for example domains, unescaped ampersands, and duplicate URLs.
4. Open representative homepage, list, and article entries.
5. Check that they return real content rather than soft error pages.
6. Compare sitemap URLs with the pages' canonical links.

The sitemap protocol limits a single sitemap to 50 MB uncompressed or 50,000 URLs. Larger sites need multiple sitemaps and a sitemap index.

## Step 6: publish and submit

Deploy the sitemap with the website and open:

```text
https://your-domain.com/sitemap.xml
```

It should return HTTP 200 and XML content. Submit the URL through the **Sitemaps** report in Google Search Console. The `Sitemap:` declaration in `robots.txt` also helps discovery.

Submission supports URL discovery; it does not guarantee that every page will be indexed.

## Multilingual websites

md2site currently selects content using a browser preference while keeping the same route URL. English and Vietnamese translations with the same article filename therefore share a URL. List that canonical URL once.

If you later implement stable, separate language URLs such as `/en/...` and `/vi/...`, list each canonical URL and implement consistent `hreflang` references in HTML or the sitemap. Do not declare separate language URLs before they actually exist.

## Automate when the website grows

A sitemap generator should:

1. Read valid routes from `pages/index.md`.
2. Exclude the 404 route, bare article shell, and intentionally non-indexable pages.
3. Read article filenames from the language indexes.
4. Generate absolute URLs using a production-domain setting.
5. Escape XML and normalize `lastmod`.
6. Detect duplicate URLs and missing declared files.
7. Write the sitemap before deployment and fail validation when entries are invalid.

Do not turn every `.md` file into a sitemap URL: many are supporting data without a public reader route.

## Troubleshooting

- **Sitemap returns 404:** check the deployed root directory.
- **Invalid XML:** look for unescaped ampersands or missing closing tags.
- **An entry cannot be accessed:** inspect its HTTP response, redirects, and Markdown requests.
- **Canonical differs from the sitemap:** choose one form and update canonical, sitemap, and internal links.
- **New content is absent:** the sitemap does not update automatically; add the URL or rerun your generator.
- **Deleted URLs are still crawled:** remove entries and incoming links, then provide appropriate missing-resource responses or redirects.

## Sitemap checklist

- Remove example domains before production.
- Use absolute HTTPS URLs.
- Escape query strings correctly in XML.
- Exclude duplicate, missing, `noindex`, and internal URLs.
- Keep `lastmod` accurate.
- Point `robots.txt` to the correct file.
- Check HTTP 200 after deployment.
- Review processing errors in Search Console.

References: [Google Search Central — Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) and [Sitemaps XML protocol](https://www.sitemaps.org/protocol.html).
