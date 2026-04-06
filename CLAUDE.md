# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is a multi-project repository for **cestina20.cz** (Čeština 2.0 — a Czech language dictionary site running on WordPress). Each project lives in its own directory and produces standalone `.html` files deployed alongside or within the WordPress site.

The live WordPress site is at `https://cestina20.cz`. Its theme CSS and JS are loaded directly from the live CDN — no local build step exists.

## Directory structure

```
cestina20/
├── CLAUDE.md               # this file (global)
├── sdilene/                 # shared reference assets (do not edit)
│   ├── style.100.min.css    # local copy of the theme CSS
│   └── vzor-stranka.html    # reference page exported from WordPress
├── prazsky-literarni-kviz/  # PLK landing page project
│   ├── index.html
│   └── assets/
│       ├── praha.jpg            # hero background (1000x750, 236 KB)
│       ├── nahled-otazky.png    # original screenshot (do not serve directly)
│       ├── nahled-otazky-560.jpg # optimized screenshot for mockup (1000px, 118 KB)
│       ├── og-image.png         # OG image original (1200x630)
│       └── og-image.jpg         # OG image optimized (200 KB)
├── generator-karet/         # Word card image generator (internal tool)
│   └── index.html
└── dalsi-projekt/           # future projects follow the same pattern
    ├── index.html
    └── assets/
```

Each project has its own `index.html` and `assets/` directory. Shared resources (theme CSS, reference page) live in `sdilene/`.

## How to work with these files

Open a project's HTML directly in a browser:
```
open prazsky-literarni-kviz/index.html
```

There is no build process, bundler, or package manager. All CSS is loaded from:
```
https://cestina20.cz/wp-content/themes/cestina20/css/style.100.min.css?ver=145
```

Asset paths in HTML/CSS are relative to the project's `index.html` (e.g. `assets/praha.jpg`).

## Visual style rules

- **Never edit** `sdilene/style.100.min.css`. It is a read-only reference.
- New page-specific styles go in a `<style>` block inside the HTML file, using a page-specific CSS prefix (e.g. `plk-` for the kvíz page) to avoid collisions with the theme.
- Theme color palette: header/nav background `#223276` (dark navy); button gradient `#15851d` → `#319f39` (green).
- The `.button` class from the theme gives the standard green CTA button. Use it for all primary CTAs.
- Key layout classes from the theme: `.container` (max-width 950px), `.content__list` (white card with border, `padding: 20px 25px`), `.header`, `.footer`.
- The sidebar (`.sidebar`) is 310px wide and uses `position: absolute`. For full-width landing pages, set `padding-right: 0` on `.content__inner` and omit the sidebar entirely.
- The theme renders custom bullets on `ul li` via `::before` (filled dot) and `::after` (outer ring), not via `list-style`. To suppress them on a custom list, use `display: none !important` on both pseudo-elements and `padding: 0 !important` on the `li` to remove the `padding-left: 30px` the theme adds.

## Page structure for standalone HTML pages

To match the look of a standard cestina20.cz subpage, include these elements in order:

1. **`<header class="header">`** — logo, claim, desktop search form (with spinner markup), `#header__menu__button`, „Přidat slovo" button.
2. **`#menu__wrap.menu__wrap`** — left nav (Slovo dne, Dle abecedy dropdown, Nejoblíbenější, Nově přidaná) + right nav (Kniha a TV pořad, O Češtině 2.0, Kontakt).
3. **`#submenu__wrap.submenu__wrap`** — the "Dle abecedy" letter picker (A–Z horizontal strip). This is a **separate div** after `menu__wrap`, not nested inside it. The theme JS toggles its visibility when "Dle abecedy" is clicked. Uses `.submenu` class (not `.sub-menu`). The `sub-menu` ul inside `menu__letters` li is kept for mobile; the `submenu__wrap` is the desktop letter bar.
4. **`.header__search__wrap--mobile`** — mobile search form (hidden on desktop by the theme CSS).
4. **Hero or page content** — for landing pages, a full-width hero sits directly after the nav bar. Use a lighter blue (e.g. `#2d4ea8`) for the hero so it contrasts with the darker header (`#223276`). Background images use a semi-transparent dark overlay via CSS gradient (`rgba(26,38,96,0.72)`) to keep white text readable.
5. **`<footer class="footer">`**

Load these scripts before `</body>` for navigation (hamburger menu, dropdowns, live search) to work:
```html
<script type="text/javascript">
var ef_string = {"ajax_url":"https:\/\/cestina20.cz\/wp-admin\/admin-ajax.php","template_directory":"https:\/\/cestina20.cz\/wp-content\/themes\/cestina20"};
</script>
<script src="https://cestina20.cz/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"></script>
<script src="https://cestina20.cz/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1"></script>
<script src="https://cestina20.cz/wp-includes/js/hoverintent-js.min.js?ver=2.2.1"></script>
<script src="https://cestina20.cz/wp-content/themes/cestina20/js/min/script.100.min.js?ver=145"></script>
```
The theme JS (`script.100.min.js`) depends on jQuery and hoverintent. The `ef_string` config object must be defined before the theme JS runs.

## Image optimization

- Do not serve original full-size assets directly. Resize images with `sips` to the needed display size (2x for retina) and convert to JPEG with quality 85%.
- Example: `sips -Z 1000 original.png --out optimized.jpg -s format jpeg -s formatOptions 85`
- Each project's `assets/` directory holds both originals and optimized versions. Reference the optimized versions in HTML/CSS.

## Header padding

Do NOT override `.header` padding globally — the theme manages header padding differently per breakpoint via media queries. A global override breaks the mobile layout (logo gets pushed down). If you need extra space between header and hero, use padding/margin on the hero element itself, not on `.header`.

## Tool: Generátor slovních karet

`generator-karet/index.html` — standalone HTML tool for generating 1080×1080 word card images (PNG). No build, runs locally in Chrome.

- User inputs words (one per line), optionally with meaning in parentheses: `šmejd (podvodník, expresivní)`
- The meaning hint drives semantic matching → font style + color mood selection
- Words with Czech diacritics get fonts from a curated whitelist (`CZECH_FONTS` array); ASCII-only words get a much larger pool including decorative/display fonts
- Colors: 180 curated pairs in 6 mood categories + procedural generator (HSL → hex with WCAG 4.5:1 contrast check)
- Export: individual PNG via `canvas.toBlob()`, bulk ZIP via JSZip from CDN

### Critical: Google Fonts latin-ext on Canvas

Google Fonts CSS2 API uses **unicode-range subsetting** — the latin-ext subset (háčky, čárky) is only downloaded when the browser encounters these characters in **DOM text**. `Canvas.fillText()` bypasses the DOM and does NOT trigger this download, causing diacritics to fall back to the system font.

**Fix:** After loading each font, insert a hidden `<span>` with Czech probe text (`áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ`) into the DOM, then wait via `document.fonts.load()` with the Czech text as the second argument. This forces the latin-ext subset download before Canvas rendering.

If a font still renders diacritics poorly despite this fix, remove it from `CZECH_FONTS` and move it to the ASCII-only pool in `FONTS[category].ascii`.

## Product: Pražský literární kvíz (PLK)

- CTA purchase link: `https://go.aharta.com/api.stripe.php?mode=game_activation&c=gE6I8RIGWM&g=2`
- Contact email: `info@hados.cz`
- Created by Martin Kavka and Roman Věžník (Čeština 2.0)
- Multi-team purchases are handled via email (no multi-team Stripe links yet)
- Introductory pricing valid until 30. 6. 2026
