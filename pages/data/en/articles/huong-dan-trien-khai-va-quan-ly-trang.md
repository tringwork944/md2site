# Creating and managing pages
date: 12/09/2026
description: Create routes, connect content files, manage navigation, and add, rename, or remove pages in md2site.
keywords: md2site, page management, Markdown routes, pages index, navigation

This guide covers a page's lifecycle: creating its content file, declaring a route, managing navigation, changing URLs, and removing the page. Section design is covered in [Managing layouts](pages/?page=article&post=huong-dan-su-dung-mau-giao-dien.md). Content published in an article list is covered in [Managing articles](pages/?page=article&post=huong-dan-va-quan-ly-bai-viet.md).

A page needs two components:

- A Markdown file in `pages/content/<locale>/`.
- A route block in `pages/index.md`.

Without the content file, the route has nothing to load. Without the route, the Markdown file exists but has no public page URL.

## Step 1: choose a slug and filename

The slug is the value of the `page=` parameter. Use lowercase letters and hyphens:

```text
about-us
services
frequently-asked-questions
```

Use the same slug and filename when practical. For example, the `about-us` route can use `pages/content/en/about-us.md`. Avoid spaces, accented characters, and special characters in slugs and filenames.

## Step 2: create minimal content

Create `pages/content/en/about-us.md`:

```md
# About page

## page-meta
meta_title: About us — md2site
meta_description: Learn about our website.

## hero
variant: centered-borderless
eyebrow: About us
title: Our story
description: This page is managed directly in Markdown.
```

`page-meta` supplies a title and description for browser and SEO metadata. `hero` renders the introduction. This is enough to test routing. For additional sections and new templates, follow the layout guide rather than expanding route logic.

## Step 3: declare the route

Add a separate block to `pages/index.md`:

```md
## about-us
nguon_trang: pages/content/en/about-us.md
trang: about-us
tieu_de_trang: About us — md2site
tai_nguyen_phu_thuoc: assets/css/main.css, assets/css/site-shell.css
header: header-basic-01
body: body-basic-01
footer: footer-basic-01
title: About us
order: 25
```

Keep the configuration keys exactly as written; they are not translated. Their meanings are:

- `nguon_trang`: the route's default content file.
- `trang`: URL slug.
- `tieu_de_trang`: temporary title before page metadata is applied.
- `tai_nguyen_phu_thuoc`: shared CSS or JavaScript dependencies.
- `header`, `body`, `footer`: page shell templates.
- `title`: a literal navigation label.
- `label`: a dictionary key used instead of a literal title.
- `order`: navigation order; lower values come first.
- `nav: false`: keep the route accessible but omit it from navigation.
- `active`: the navigation item to highlight for a child route.

Open `pages/?page=about-us` to test it. For a bilingual page, add the same filename under both `pages/content/vi/` and `pages/content/en/`.

## Manage navigation

Navigation is generated from `pages/index.md`, rather than maintained independently on every page.

### Order navigation items

Leave gaps between values, such as `10`, `20`, and `30`. A new item can then use `order: 15` without renumbering the list.

### Translate navigation labels

Replace `title` with a key:

```md
label: nav_about
```

Add `## nav_about` to each `assets/content/<locale>/common.md`. See [Managing languages](pages/?page=article&post=tuy-chinh-giao-dien-va-ngon-ngu.md) for translation and testing instructions.

### Hide a page from navigation

Thank-you pages, policies, and landing pages can use `nav: false`. They remain accessible by URL and can be linked from other content.

### Highlight a parent item

For a detail route within the services section:

```md
active: services
nav: false
```

The Services item remains highlighted while visitors read the detail page.

## Update content without changing its URL

To change a title, description, or section, edit the content file and leave the route unchanged. Existing URLs and links continue to work.

After editing:

1. Reload the correct route.
2. Check title and description in the document head.
3. Check links and images.
4. Test a narrow screen and dark theme.
5. Update sitemap `lastmod` if the content changed substantially.

## Rename a file without changing its URL

You can rename `pages/content/en/about-us.md` to `pages/content/en/our-story.md` and change only the source:

```md
## about-us
nguon_trang: pages/content/en/our-story.md
trang: about-us
```

The public URL remains `pages/?page=about-us`. Update the corresponding filename in other languages as well. This approach is useful when reorganizing internal content without changing public links.

## Change a page URL

To change `about-us` to `our-story`:

1. Change `trang` and preferably the route heading.
2. Find links containing `page=about-us`.
3. Update navigation, CTAs, articles, and the sitemap.
4. Configure a redirect from the old URL if the website is already published.
5. Test old and new URLs in preview.

Find references before changing them:

```bash
rg "page=about-us|about-us.md" .
```

Renaming a file alone does not change the URL: the `trang` field determines the route.

## Remove a page

1. Find the route and incoming links.
2. Update or remove those links.
3. Remove the route block from `pages/index.md`.
4. Remove its URL from `sitemap.xml`.
5. Delete unused content files after checking their references.
6. Verify that the old URL shows the intended error or redirect.

To hide a page temporarily from navigation, use `nav: false` instead of removing it.

## Troubleshooting

- **The page shows 404:** compare the URL slug with `trang`.
- **The page cannot load:** check `nguon_trang`, `body`, `header`, and `footer`.
- **The shell is empty:** check the Markdown file and section names.
- **The item is missing from navigation:** check `nav`, `order`, `title`, or the `label` key.
- **The wrong item is highlighted:** check `active`.
- **Only one language fails:** check the matching file in `pages/content/<locale>/`.

## Page checklist

- Use a valid, unique slug.
- Ensure the declared source exists.
- Check content, title, and description at the public URL.
- Confirm navigation visibility, order, and highlighting.
- Resolve broken links and missing resources.
- Provide required translations.
- Update the sitemap for indexable routes.
- Handle old URLs when renaming or removing a page.

Once the route works, continue with [Managing layouts](pages/?page=article&post=huong-dan-su-dung-mau-giao-dien.md) to develop its presentation.
