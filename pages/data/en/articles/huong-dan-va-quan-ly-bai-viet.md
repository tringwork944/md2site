# Creating and managing articles
date: 12/09/2026
description: Create, publish, order, update, rename, and remove Markdown articles in md2site, with metadata, images, captions, and links.
keywords: md2site, articles, content management, images, Markdown
image: assets/images/beestudiosns/01_bee_studio_sns_light.svg

This guide covers content in the Articles list: files, metadata, images, ordering, and publication. Independent pages with their own routes or navigation entries are covered in [Managing pages](pages/?page=article&post=huong-dan-trien-khai-va-quan-ly-trang.md).

English articles live in `pages/data/en/articles/`; Vietnamese articles live in `pages/data/vi/articles/`. The `index.md` in each directory determines which articles appear and in what order. Use the same filename for translations so language switching keeps readers on the same article.

Articles do not need separate declarations in `pages/index.md`:

1. Create the article Markdown file.
2. Add its filename to the article index.
3. Open the article URL to check content, images, and links.
4. Update, reorder, or remove it as needed.

## A complete article example

Create `pages/data/en/articles/readable-content.md`:

```md
# Writing content that is easy to read
date: 11/09/2026
description: Practical principles for clear, readable website articles.
keywords: website content, Markdown, md2site
image: assets/images/beestudiosns/01_bee_studio_sns_light.svg

Start with a short introduction that explains what readers will learn.

## Divide content into sections

Focus each section on one main idea. Use clear headings and manageable paragraphs.

![md2site logo](assets/images/beestudiosns/01_bee_studio_sns_light.svg "An illustration in the article"){width=240 align=center}

## Link to related content

Explore the [article list](pages/?page=articles) to learn more about md2site.

## Before publishing

Check the title, images, and links before finishing the article.
```

The example includes metadata, introductory text, headings, a captioned image, and an internal link. Replace the content while keeping the metadata structure at the top.

## Article metadata

- `#` heading: article title.
- `date`: display date; use a consistent `dd/mm/yyyy` format.
- `description`: a short summary for article metadata.
- `keywords`: related terms separated by commas.
- `image`: the image used in sharing metadata.

The body starts after metadata. Use `##` for main sections and `###` for subsections.

## Add an article to the list

Add this line to `pages/data/en/articles/index.md`:

```md
- readable-content.md
```

Select English and open `pages/?page=articles`. The article should appear and link to:

```text
pages/?page=article&post=readable-content.md
```

Use lowercase ASCII filenames with hyphens. The filename becomes part of the URL, so choose it carefully. Add a Vietnamese translation with the same filename and list it in the Vietnamese index when it is ready.

## Insert images

Store article images in `assets/images/` or a subdirectory. Image paths are relative to the md2site root, not the article directory. Keep filenames lowercase and avoid spaces or accented characters.

### A basic image

Place an image on its own line:

```md
![md2site logo](assets/images/beestudiosns/01_bee_studio_sns_light.svg)
```

Result:

![md2site logo](assets/images/beestudiosns/01_bee_studio_sns_light.svg)

The text in square brackets is alternative text. Describe the image's content or purpose so the article makes sense to someone who cannot see it.

### Add a caption

Put a quoted caption after the path:

```md
![md2site logo](assets/images/beestudiosns/01_bee_studio_sns_light.svg "The logo used on this website")
```

Result:

![md2site logo](assets/images/beestudiosns/01_bee_studio_sns_light.svg "The logo used on this website")

Alternative text explains the image. A caption adds visible context beneath it.

### Set width and alignment

Append `{width=... align=...}`:

```md
![md2site logo](assets/images/beestudiosns/01_bee_studio_sns_light.svg "Centered logo"){width=240 align=center}
```

Result:

![md2site logo](assets/images/beestudiosns/01_bee_studio_sns_light.svg "Centered logo"){width=240 align=center}

`width` accepts `small`, `medium`, `large`, `full`, pixel values such as `480`, or percentages such as `60%`. `align` accepts `left`, `center`, or `right`.

Images remain constrained by the reading area's width. Clicking an image opens its source in the larger viewer.

### Sharing images and body images

The `image:` field at the beginning supplies sharing metadata:

```md
# Article title
date: 11/09/2026
description: A short article summary.
image: assets/images/beestudiosns/01_bee_studio_sns_light.svg
```

It does not insert an image into the article body. Add Markdown image syntax wherever the image should appear in the content.

### If an image does not appear

- Check filename, extension, and letter case.
- Confirm the image is in the expected directory.
- Use a path relative to the md2site root.
- Check brackets, parentheses, and quotation marks.
- Try opening the image URL directly.
- Check Network for a 404 response.

## Insert links and code

Internal links use md2site paths:

```md
[View all articles](pages/?page=articles)
```

Wrap short code in backticks:

```md
Open `pages/data/en/articles/index.md`.
```

For multiline code, use triple-backtick fences and an optional language such as `md`, `html`, `css`, or `js`.

## Order articles

Index line order determines display order:

```md
- new-article.md
- guide.md
- older-article.md
```

To move the guide first, move the whole line:

```md
- guide.md
- new-article.md
- older-article.md
```

No `order` field is needed in an article.

## Update or rename an article

Edit the Markdown file and reload its URL. Keep the filename when the URL does not need to change.

If you rename `readable-content.md` to `writing-guide.md`, update:

1. Its entry in every relevant language index.
2. Links containing `post=readable-content.md`.
3. Other references, translations, and the sitemap.

The new URL becomes `pages/?page=article&post=writing-guide.md`.

## Remove an article

1. Remove its filename from the relevant indexes.
2. Find and update incoming links.
3. Delete the unused Markdown files.
4. Remove the URL from the sitemap.
5. Reload the list and confirm the old entry is gone.

Removing index entries first avoids links to files that have already been deleted.

## Check after editing

- Confirm the article appears in the intended list position.
- Open its `page=article&post=...` URL.
- Check title, date, description, and sharing image metadata.
- Keep a clear heading hierarchy.
- Resolve broken images and links.
- Test captions, image sizes, and alignment.
- Check reading and code blocks on a narrow screen.
- Switch between English and Vietnamese while staying on the same article.
