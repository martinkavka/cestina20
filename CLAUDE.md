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
│       ├── nahled-otazky-560.jpg # optimized screenshot (kept as fallback, not used in HTML)
│       ├── ukazka-hry.MP4       # original screen recording (do not serve directly)
│       ├── ukazka-hry-web.mp4   # compressed video for mockup (7.5 MB, h264/aac)
│       ├── og-image.png         # OG image original (1200x630)
│       ├── og-image.jpg         # OG image optimized (200 KB)
│       └── mapa-trasy.jpg       # route map screenshot (1900x1188, 625 KB) – no longer used in HTML, replaced by Leaflet map
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

## Video optimization

- Compress screen recordings with `ffmpeg` before serving. Target: single-digit MB for a ~1 minute screencast.
- Example: `ffmpeg -i original.MP4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k output-web.mp4`
- Use a different output filename than the input to avoid macOS case-insensitive filesystem conflicts.

## Phone mockup (PLK)

The `.plk-mockup` CSS component simulates an iPhone frame around a video. Key values tuned for iPhone 14 screen recordings at 1170×2532 px:

- Base mockup size: `280 × 606px`; large variant `.plk-mockup--large`: `320 × 693px`
- `border-radius: 56px` on the frame — do not reduce
- Video uses `clip-path: inset(2px 2px round 56px)` to prevent light background bleeding through corners. The 2px inset keeps the black border visually symmetric around the video
- Video uses `autoplay loop muted playsinline` and `object-fit: cover`
- Video playback rate set to `0.85` via JS to smooth out screen recording jitter
- The mockup is now in a standalone full-width section (`.plk-video-feature`) positioned right after "Rychlý přehled", not in a two-column layout

## Deployment

The repository is deployed via GitHub Pages at `https://martinkavka.github.io/cestina20/`. To update after changes:
```bash
git add .
git commit -m "Popis změny"
git push
```
Pages update automatically within 1–2 minutes.

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

- Contact email: `info@hados.cz`
- Created by Martin Kavka and Roman Věžník (Čeština 2.0)
- All purchases go through the **Benosaurus JS widget** (`https://benosaurus.pages.dev/embed/kviz.js`). The widget unifies both paths: for 1 team it shows a primary „Zaplatit kartou" (Stripe via aharta wrapper, URL configured in Benosaurus admin) with a secondary „Chci fakturu místo toho" link; for 2+ teams it shows a single „Objednat" button that opens the invoice form (with ARES autofill for IČO). Benosaurus is built by **Roman Věžník**. There is **no longer a separate `.plk-cta` Stripe button on the page** — the widget is the only purchase entry point. Styling of the widget (accent, gradient, font, uppercase/shadow on CTA, bare mode) is set via `data-*` attributes on the embed div plus Benosaurus admin
- Pricing: degressive per-team pricing (990 Kč for 1 team down to 310 Kč/team for 10 teams); key messaging uses "od 33 Kč / student" as the anchor price (example: 30 students → 5 teams → 1 950 Kč → 65 Kč/student)
- Time limit: 12 hours (full day) — emphasize that there is no rush
- Route: Staroměstské náměstí → Pražský hrad, 6 km, 20 stops, ~3 hours walking; route is recommended, not mandatory
- Target audience for copy: **teachers** (they buy), not students (they play). Frame benefits for the decision-maker.
- Key selling point vs. competition: no reservation needed — buy and go anytime

### PLK page components

- **Price comparison cards** (`.plk-comparison`): 4 cards in a row comparing PLK price with other Prague activities (tour guide, museum/gallery, airport excursion). PLK card highlighted green with "Nejlepší volba" badge. Below: "Bez rezervace" note in green.
- **Benosaurus order widget** (`.plk-config` wrapper around `<div data-benosaurus-kviz>`): Sits right below the price comparison inside the same `.plk-section`. Uses `data-bare="1"` so the widget renders without its own card chrome – the surrounding `.content__list` provides the card. `data-button-uppercase="1"` and `data-button-shadow="0 1px 3px rgba(0, 0, 0, 0.35)"` align the widget's CTA with the theme `.button`. The fun meter, team stepper, and order form all live inside the widget. If you see references to `.plk-calc`, `.plk-funmeter`, or a cross-origin iframe at `naveromag.cz` in older commits, those were prior implementations replaced by this JS widget.
- **Interactive route map**: Leaflet.js map (CARTO Voyager tiles) replacing the static `mapa-trasy.jpg`. 20 numbered stop markers with GPS coordinates from OpenStreetMap Nominatim. Walking figure (🚶) animates along the route on scroll-into-view; stops light up sequentially as the figure arrives. No route lines drawn (they'd cut through buildings) — students get the recommended route in-game.

### PLK route stops (exact GPS from Nominatim)

1–9: Staroměstské náměstí (clustered around center 50.08745, 14.42097)
10–11: Stavovské divadlo (50.08596, 14.42364)
12: U Fleků (50.07874, 14.41702)
13: Národní divadlo (50.08086, 14.41357)
14: Kavárna Slavie (50.08154, 14.41324)
15: Betlémská kaple (50.08435, 14.41750)
16: Karlův most (50.08663, 14.41015)
17: Werichova vila (50.08540, 14.40802)
18: Chrám sv. Mikuláše (50.08797, 14.40322)
19: Dům U Dvou slunců, Nerudova 47 (50.08848, 14.39722)
20: Socha TGM – Hradčanské nám. (50.08959, 14.39767)

### External JS dependencies (PLK)

- **Leaflet 1.9.4** — loaded from unpkg CDN (CSS + JS) with SRI hashes. Used for the interactive route map only. `scrollWheelZoom: false` to prevent hijacking page scroll.
- **Benosaurus order widget** — JS from `benosaurus.pages.dev/embed/kviz.js` (async). Renders into the host DOM (same-origin), so host CSS can reach inside if needed. Supports `data-accent`, `data-font="inherit"`, `data-bare="1"`, `data-button-uppercase="1"`, `data-button-shadow="..."`. The Stripe card-payment URL is set in Benosaurus admin, not hardcoded here.
