# Building and managing md2site layouts
date: 12/09/2026
description: Choose, combine, customize, and maintain md2site layouts, from page shells and templates to Markdown sections.
keywords: md2site, layout, templates, Markdown sections, responsive design

md2site separates layout into layers so Markdown content does not need to contain HTML. A page uses the `header`, `body`, and `footer` declared in `pages/index.md`, then renders the sections in its content file.

This guide covers presentation: choosing sections, composing layouts, developing templates, and maintaining CSS. URL creation, menu declarations, and route changes are covered in [Managing pages](pages/?page=article&post=huong-dan-trien-khai-va-quan-ly-trang.md).

## The layout system

The main directories inside `assets/templates/` are:

- `pages/page-basic-01/`: parses page Markdown and coordinates rendering.
- `header/header-basic-01/`: branding, desktop and mobile navigation, and language selection.
- `body/body-basic-01/`: wraps sections and arranges them in Markdown order.
- `footer/footer-basic-01/`: footer and secondary navigation.
- `sections/div-basic-*/`: reusable content blocks.
- `sections/runtime.js` and `body/runtime.js`: registries and shared helpers.

A template normally contains:

- `index.js`: converts Markdown data into HTML.
- `style.css`: its layout and states.
- `example.md`: a minimal example you can copy.

## Choose the right level of customization

- To change text, links, or lists, edit `pages/content/`.
- To reorder blocks, move complete `##` sections in Markdown.
- To change shared colors, fonts, or spacing, edit tokens in `assets/css/main.css`.
- To change the site background and shell, edit `assets/css/site-shell.css`.
- To change a block's HTML structure, edit or create a template in `assets/templates/sections/`.
- To change navigation or footer structure, edit their templates and the corresponding keys in `assets/content/<locale>/common.md`.

Avoid duplicating template HTML across pages. Keep the data in Markdown so renderer changes apply consistently.

## Compose a layout in Markdown

This example combines a hero, a card grid, and a callout:

```md
## page-meta
meta_title: Services — md2site
meta_description: Explore our services.

## hero
variant: centered-borderless
eyebrow: Services
title: Clear solutions for your needs
description: Choose the right service and get started.

## div-basic-03
id: services
eyebrow: Categories
title: Featured services

### Website design
icon: document
Build responsive interfaces with md2site templates.

### Content management
icon: book
Update pages and articles directly in Markdown.

## div-basic-04
eyebrow: Next step
title: Tell us about your project
description: Share the details so we can help.
button_label: Contact
button_href: pages/?page=contact
```

The order of `##` blocks determines display order. Within a section, `###` headings usually create child items. Fields in `field_name: value` format supply metadata to the renderer.

## Available sections

- `hero` or `div-basic-13`: introductory content.
- `div-basic-01`: text on the left, numbered list on the right.
- `div-basic-02`: numbered list on the left, text on the right.
- `div-basic-03`: content card grid.
- `div-basic-04`: callout with an action button.
- `div-basic-05`: roadmap phases.
- `div-basic-06`: article list.
- `div-basic-07`: download panel.
- `div-basic-08`: ordered deployment steps.
- `div-basic-09`: contact information and form.
- `div-basic-10`: image gallery.
- `div-basic-11`: article reader.
- `div-basic-12`: policy or legal document layout.
- `div-basic-14`: error state.

Check [Showcase](pages/?page=showcase) and each section's `example.md` before creating a new template.

## How layouts load

Once the router selects the content file, `page-router.js` detects its `div-basic-*` sections and loads their stylesheets and JavaScript. Editors only declare sections in Markdown; they do not add each template manually to `pages/index.html`.

The header, body, and footer are chosen at route level. See [Managing pages](pages/?page=article&post=huong-dan-trien-khai-va-quan-ly-trang.md) for those declarations.

## Create a new section template

Only add a template when existing sections cannot express the content appropriately:

1. Copy the closest existing section, such as `div-basic-03`.
2. Choose an unused name, such as `div-basic-15`.
3. Update `index.js`, `style.css`, and `example.md` together.
4. Keep one root `<section class="template-div">` element.
5. Use semantic HTML and escape data inserted into markup.
6. Add the template to `assets/templates/README.md`.
7. Test it on Showcase before using it on a production page.

Handle missing data, empty lists, invalid URLs, and long content. Do not assume every Markdown file is perfectly formed.

## Maintain CSS safely

Prefer shared tokens for backgrounds, text, borders, and spacing in `assets/css/main.css`. Scope section-specific rules to its template class so they do not affect unrelated components.

For responsive layouts:

- Start with a single column on narrow screens.
- Add columns only when there is enough room.
- Allow long text and links to wrap.
- Scroll code blocks horizontally instead of widening the page.
- Keep keyboard focus visible on buttons and links.
- Respect `prefers-reduced-motion` when adding animation.

## Manage template changes

Before changing a shared template, find every page that uses it:

```bash
rg "## div-basic-03" pages/content
```

Test at least one page for each distinct data shape. When adding a field, supply a default so older Markdown still works. When removing a field, update the renderer, example, Showcase, and related guides together.

## Troubleshooting

- **A section is missing:** check its `## div-basic-N` heading and `index.js` file.
- **Content has no styling:** check the stylesheet, directory name, and Network errors.
- **Sections appear in the wrong order:** move complete sections in Markdown rather than hiding the data order with CSS.
- **Only mobile is broken:** check fixed widths, grids, and unbreakable strings.
- **Dark mode is hard to read:** replace fixed colors with tokens and check contrast.
- **A new template breaks the page:** check the console for JavaScript errors or an invalid registry root element.

## Layout checklist

- Use the intended section order and one main `h1`.
- Avoid page-wide horizontal overflow on small screens.
- Make navigation, buttons, and links usable by keyboard.
- Keep focus visible.
- Keep content understandable when an image is missing.
- Check contrast in both light and dark themes.
- Keep `index.js`, `style.css`, and `example.md` consistent.
- Resolve console and Network errors.

Continue with [Managing pages](pages/?page=article&post=huong-dan-trien-khai-va-quan-ly-trang.md) to apply the layout to a complete route.
