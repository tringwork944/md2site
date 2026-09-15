# Adding and managing languages
date: 12/09/2026
description: Add, translate, test, and maintain languages for shared labels, SEO, pages, and Markdown data in md2site.
keywords: md2site, languages, translations, multilingual website, locale, Markdown

This guide covers locales and translations. Colors, CSS, and template structure are covered in the layout guide.

md2site separates language support into the locale list, shared content, and page content. Articles, roadmap phases, and galleries live under `pages/data/<locale>/` and have their own translation files.

The examples use `en`. The same directory pattern can support other valid locale codes, such as `ja`, `fr`, or `th`; runtime interface labels also need translations when adding a language beyond the supplied Vietnamese and English versions.

## Language directories

- `assets/content/languages/index.md`: languages shown in the selector.
- `assets/content/vi/common.md`: shared Vietnamese labels.
- `assets/content/vi/seo.md`: shared Vietnamese keywords and default sharing image.
- `pages/content/vi/*.md`: Vietnamese pages.
- `pages/data/vi/`: Vietnamese articles, roadmap, and collection data.

English uses the same structure with `en` in place of `vi`.

## Step 1: declare the language

Edit `assets/content/languages/index.md`:

```md
# Supported languages

## vi
label: Tiếng Việt
file: assets/content/vi/common.md
default: true

## en
label: English
file: assets/content/en/common.md
```

The `##` heading is the locale code. `label` is its display name, and `file` points to its shared content. Set `default: true` on only one locale. Without it, the first language becomes the default.

Use lowercase locale codes such as `vi`, `en`, or `pt-br`, keeping directory names, saved preferences, and the HTML `lang` attribute consistent. A supported saved preference takes priority over the default.

## Step 2: translate shared content

Create `assets/content/en/common.md` with the same keys as the Vietnamese dictionary:

```md
# Shared content

## brand
md2site

## nav_home
Home

## nav_articles
Articles

## footer_tagline
A static website managed with Markdown.
```

Do not translate key names such as `nav_home`; translate the values below them. Templates look up keys exactly, so a misspelled heading can leave a label empty or unchanged.

Add new shared keys to all dictionaries in the same update. Runtime controls, including theme labels and article loading messages, also have Vietnamese and English text in the JavaScript modules.

## Step 3: translate shared SEO

Copy `assets/content/vi/seo.md` to `assets/content/en/seo.md`, preserve the keys, and translate the values:

```md
# Shared SEO

## og_image
assets/images/beestudiosns/01_bee_studio_sns_light.svg

## articles_keywords
md2site, Markdown guides, static website
```

Page-specific metadata belongs in the page's `## page-meta` section. Avoid duplicating every page title and description in shared SEO when the page already provides them.

## Step 4: translate pages

Every Vietnamese page should have a corresponding English file with the same name:

```text
pages/content/vi/contact.md
pages/content/en/contact.md
```

Preserve section and field names:

```md
## hero
eyebrow: Contact
title: Tell us about your project
description: Send the details and we will respond soon.
```

The router reads the route from `pages/index.md`, substitutes the selected locale in the source path, and tries the translation. If it is unavailable, it uses the route's declared source file.

Fallback keeps a page usable but can mix languages. Translate all navigation pages before exposing a new locale to visitors.

## Step 5: translate articles and collections

English articles now live in `pages/data/en/articles/`, including their own `index.md`. Keep translated filenames identical to their Vietnamese counterparts:

```text
pages/data/vi/articles/bat-dau-voi-md2site.md
pages/data/en/articles/bat-dau-voi-md2site.md
```

Both versions use the same public URL:

```text
pages/?page=article&post=bat-dau-voi-md2site.md
```

The current language selects the actual file. This lets readers switch language without changing articles. Translate the title, description, keywords, body, captions, and example text; keep working filenames, configuration keys, and internal route links intact.

Each language's index lists article filenames in display order. The data loader tries the selected locale first and then the declared source/Vietnamese fallback if the translation is missing. It rejects an HTML error page even if a misconfigured host returns HTTP 200.

The same locale-first loading applies to roadmap and showcase data. Provide corresponding files under `pages/data/en/` when a collection needs its own English content.

## Step 6: test the language selector

The selector stores the preference as `md2site-language` in browser local storage. Test the following:

1. Select each language from the header.
2. Reload and confirm the preference is retained.
3. Open each main route directly.
4. Check the HTML `lang` attribute.
5. Review title, description, navigation, and footer.
6. Open an article, switch language, and confirm the same `post` remains in the URL.
7. Check theme controls, loading messages, and article error messages.
8. Test a missing translation to confirm intentional fallback.

To test a new visitor, remove only the `md2site-language` key in DevTools Application → Local Storage, or use a private window. If storage is unavailable, the site uses its configured default without crashing.

## Maintain translations

When the source changes:

1. Identify matching files in each language.
2. Translate new content while preserving template names, keys, and working links.
3. Compare shared dictionary keys.
4. Check label lengths on desktop and mobile.
5. Review the preview before publishing.

Review translated SEO metadata and action labels carefully. Content changes in one language do not automatically update other files.

## Remove a language

1. Remove its block from the language index.
2. Choose another default if necessary.
3. Check that an old saved preference falls back to the default.
4. Remove translation directories only after checking references.
5. Update sitemap or `hreflang` declarations if you have implemented separate language URLs.

## Troubleshooting

- **The selector disappears:** check the language index, its `file` values, and dictionary requests.
- **A shared label is untranslated:** find its key in both dictionaries.
- **A page stays Vietnamese:** check the same filename in `pages/content/<locale>/`.
- **An article stays Vietnamese:** check its matching filename and index under `pages/data/en/articles/`; a missing translation triggers fallback.
- **The page mixes languages:** a source file or shared label may be falling back.
- **A label breaks navigation:** shorten the translation or adjust the responsive layout rather than shrinking only one language's text.

## Language checklist

- Show the correct locales and one default.
- Maintain matching shared keys and required page translations.
- Update SEO metadata with the selected language.
- Keep the preference after reload when storage is available.
- Check article list and reader in both languages.
- Resolve unintended missing translation requests.
- Keep menus, buttons, and headings readable on narrow screens.

See [Managing pages](pages/?page=article&post=huong-dan-trien-khai-va-quan-ly-trang.md) for how routes locate content files.
