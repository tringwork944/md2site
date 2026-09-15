# Using icons in md2site
date: 12/09/2026
description: Use built-in icons, Font Awesome sprites, or individual SVG files in md2site content blocks.
keywords: md2site, SVG icons, Font Awesome, Markdown, accessibility

This guide explains icon declarations and rendering. For section selection, card grids, and shared CSS, see [Managing layouts](pages/?page=article&post=huong-dan-su-dung-mau-giao-dien.md).

Icons appear mainly in `div-basic-03` cards. Declare an icon name in Markdown and the template renders its SVG. Cards can share consistent size, color, and stroke styling without putting HTML in content files.

## Four built-in icons

The default names are:

- `document`: a document or content page.
- `book`: knowledge and guides.
- `trend`: roadmap or growth.
- `list`: checklist or process.

Example:

```md
## div-basic-03
eyebrow: Categories
title: Featured content

### Getting started
icon: document
Learn the first steps with md2site.

### Background knowledge
icon: book
What to know before customizing the website.

### Roadmap
icon: trend
Explore the project's development phases.

### Checklist
icon: list
Review the essentials before publishing.
```

If `icon:` is absent or an unsupported name is used, md2site falls back to `document`. This keeps cards usable when content contains a typo.

## Use a Font Awesome SVG sprite

The runtime understands `fa-solid:`, `fa-regular:`, and `fa-brands:`:

```md
### Home
icon: fa-solid:house
Visit the homepage.

### GitHub
icon: fa-brands:github
Open the project repository.
```

For these declarations to work, add the corresponding sprite files:

```text
assets/images/fontawesome/sprites/solid.svg
assets/images/fontawesome/sprites/regular.svg
assets/images/fontawesome/sprites/brands.svg
```

The starter directory contains instructions rather than the sprites themselves. Supply files you are licensed to use. The text after the colon is a symbol ID within the sprite, such as `house` or `arrow-right`. If that ID is absent, the SVG element has no symbol to display.

Use lowercase names and hyphens. No Font Awesome webfont or JavaScript is required: md2site references the same-site SVG sprite directly.

## Use an individual SVG file

Use the `svg:` prefix for a standalone SVG:

```md
### Completed
icon: svg:assets/images/icons/check.svg
This step is complete.
```

The runtime accepts SVG paths through the template's URL filter. The icon image is marked decorative because the adjacent card title already communicates its meaning.

Keep shared icons in `assets/images/icons/`. Use consistent view boxes, stroke widths, and visual padding. Mixing unrelated icon sets can make a card group look inconsistent.

## Icons inside an article

The article reader does not interpret `icon:` fields like a card template. Use Markdown images for illustrations:

```md
![Completed check mark](assets/images/icons/check.svg)
```

For a purely decorative image, alternative text can be empty:

```md
![](assets/images/icons/decorative.svg)
```

Emoji render as ordinary text, but their appearance varies by operating system. SVG provides a more consistent appearance for branding or important visual states.

## If an icon is missing

Check the `icon:` syntax first. For Font Awesome, open the sprite and locate the expected symbol ID. For `svg:`, open the file URL directly in the browser.

If an icon appears but is hard to see in dark mode, check whether the SVG uses fixed colors. Built-in icons use `currentColor` to follow the surrounding text color.

Default icons and parsing logic live in `assets/templates/sections/runtime.js`. Test new icons on Showcase before using them throughout the website.
