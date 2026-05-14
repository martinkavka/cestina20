# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is the **public** multi-project repository for **cestina20.cz** (Čeština 2.0 — a Czech language dictionary site running on WordPress). It holds web pages that are destined for the live site and serves as a GitHub Pages preview source.

Interní věci (prezentace, rozpracované drafty, interní nástroje, byznys poznámky) **nepatří sem** — žijí v odděleném privátním repu `cestina20-interni`. Před chystáním čehokoli nového se vždycky zeptej Martina, jestli to patří do veřejného nebo privátního repa.

Each project lives in its own directory and produces standalone `.html` files deployed alongside or within the WordPress site. The live WordPress site is at `https://cestina20.cz`. Its theme CSS and JS are loaded directly from the live CDN — no local build step exists.

## Directory structure

```
cestina20/
├── CLAUDE.md               # this file
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
├── prihlaseni-newsletter/   # Newsletter signup widget (Jekyll-excluded, čeká na programátora)
│   ├── index.html           # demo + zdroj embed snippetu pro WordPress (snippet má logo inline jako base64 data URI = samonosný)
│   └── assets/
│       └── logo-cestina20.png  # brand logo pro demo (žlutá hvězda)
├── _config.yml              # Jekyll config – exclude pro hand-off složky
└── .gitignore               # .DS_Store apod.
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
- The theme renders custom bullets on `ul li` via `::before` (filled dot) and `::after` (outer ring), not via `list-style`. To suppress them on a custom list, use `display: none !important` on both pseudo-elements and `padding: 0 !important` on the `li` to remove the `padding-left: 30px` the theme adds. Cleaner alternative for embedded widgets: skip `<ul>/<li>` entirely and use `<div>` based lists – theme rules don't match.
- The theme styles every `<button>` element: `text-transform: uppercase`, `box-shadow: 0 1px 3px rgba(0,0,0,.35)`, `padding: 10px 18px`, `line-height: 1.15`, gradient background. For custom-styled buttons explicitly override these (`text-transform: none`, `box-shadow: none`, explicit `padding` + `height`), otherwise the button will render UPPERCASE and taller than expected. The same gradient + uppercase rule also applies to `.button` class.

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

This is a **public** repository deployed via GitHub Pages at `https://martinkavka.github.io/cestina20/` (legacy Jekyll build z `main`, root path). To update after changes:
```bash
git add .
git commit -m "Popis změny"
git push
```
Pages update automatically within 1–2 minutes.

**Pozor: tahle repa je veřejná.** Všechno, co se pushne na `main`, je veřejně čitelné na GitHubu — i to, co `_config.yml` vyloučí z Jekyll buildu (`_config.yml` řeší jen publikaci na github.io, ne browsovatelnost repa). Cokoli interního (prezentace, rozpracované drafty, byznys strategie, klientská data) **nepatří do tohohle repa vůbec** — jde do privátního `cestina20-interni`. Před chystáním nové věci se vždy zeptej Martina, jestli je public nebo private.

## Header padding

Do NOT override `.header` padding globally — the theme manages header padding differently per breakpoint via media queries. A global override breaks the mobile layout (logo gets pushed down). If you need extra space between header and hero, use padding/margin on the hero element itself, not on `.header`.

## Product: Pražský literární kvíz (PLK)

- Contact email: `info@hados.cz`
- Created by Martin Kavka and Roman Věžník (Čeština 2.0)
- All purchases go through a **Benosaurus iframe** pointing at `https://benosaurus.cz/objednavka/plk1-8d005281?embed=1&teamy=1&studenti=30`. The iframe renders the full order form directly inline (no modal): konfigurátor (slider týmů, počet studentů, ceny, teploměr zábavnosti), fakturační údaje, a podle počtu týmů buď „Zaplatit kartou" + sekundární „Chci fakturu místo toho" pro 1 tým, nebo „Odeslat objednávku" (faktura, ARES autofill IČO) pro 2+ týmů. There is **no separate `.plk-cta` Stripe button on the page** — the iframe is the only purchase entry point.
- Pricing: degressive per-team pricing (990 Kč for 1 team down to 310 Kč/team for 10 teams); key messaging uses "od 33 Kč / student" as the anchor price (example: 30 students → 5 teams → 1 950 Kč → 65 Kč/student)
- Time limit: 12 hours (full day) — emphasize that there is no rush
- Route: Staroměstské náměstí → Pražský hrad, 6 km, 20 stops, ~3 hours walking; route is recommended, not mandatory
- Target audience for copy: **teachers** (they buy), not students (they play). Frame benefits for the decision-maker.
- Key selling point vs. competition: no reservation needed — buy and go anytime

### PLK page components

- **Price comparison cards** (`.plk-comparison`): 4 cards in a row comparing PLK price with other Prague activities (tour guide, museum/gallery, airport excursion). PLK card highlighted green with "Nejlepší volba" badge. Below: "Bez rezervace" note in green.
- **Benosaurus order iframe** (`.plk-config` wrapper around `<iframe class="plk-config__iframe">`): Sits right below the price comparison inside the same `.plk-section`. Iframe má pevně CSS `height: 1100px; max-height: 1500px;` jako základ. Listener na `postMessage({type: 'benosaurus-resize', height})` z origin `https://benosaurus.cz` výšku jemně doladí, ale **vstup se klampuje** přes `Math.max(400, Math.min(1500, height))` a updatuje se jen když se hodnota liší o víc než 4 px od aktuální. **Bez tohoto klampování + tolerance** by docházelo k feedback loopu: body uvnitř iframu má `min-h-full`, takže `scrollHeight` roste s iframem, posílá vyšší hodnotu, iframe roste dál — donekonečna. Nezjednodušuj protokol zpátky na `height + 20`. `allow="payment"` je nutné pro Stripe / Apple Pay. Initial query params `teamy=1&studenti=30` jsou jen výchozí stav.
- **Interactive route map**: Leaflet.js map (CARTO Voyager tiles) replacing the static `mapa-trasy.jpg`. 20 numbered stop markers with GPS coordinates from OpenStreetMap Nominatim. Walking figure (🚶) animates along the route on scroll-into-view; stops light up sequentially as the figure arrives. No route lines drawn (they'd cut through buildings).

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
- **Benosaurus order iframe** — `<iframe src="https://benosaurus.cz/objednavka/plk1-8d005281?embed=1&teamy=1&studenti=30" allow="payment">`. Iframe je cross-origin (Benosaurus běží na `benosaurus.cz`), takže host CSS dovnitř nesahá – vzhled formuláře plně řídí Benosaurus. Resize protokol: iframe posílá `postMessage({type: 'benosaurus-resize', height: <px>})`, parent posluchač nastavuje `iframe.style.height` (s klampováním, viz výše). Benosaurus je projekt Romana Věžníka — pokud iframe začne dělat něco divného, problém je skoro vždy na Benosaurus straně, řeš s Romanem, nehrabej do HTML.

## Tool: Newsletter signup widget (`/prihlaseni-newsletter`)

Vlastní formulář pro přihlášení k Substack newsletteru „Slovo dne z Češtiny 2.0", náhrada za originální Substack iframe. Cílem je sjednocený vzhled s webem cestina20.cz a lepší konverze.

`prihlaseni-newsletter/index.html` slouží jako demo + zdroj embed snippetu pro WordPress. Nasazení řeší programátor Martina (vloží snippet jako blok „Vlastní HTML"). Adresář je v `_config.yml` exclude listu, takže se na github.io nepublikuje.

### Architektura

- **Dvě varianty:** `.nl-card` (kompaktní – sidebar, ~320 px, vše vystředěné, button na plnou šířku) a `.nl-card--inline` (široká – obsahový blok, logo + headline + popis vedle sebe, bullets v řadě, vstup + tlačítko v řadě). Stejný HTML, jediný modifikátor přepíná layout.
- **Logo:** `prihlaseni-newsletter/assets/logo-cestina20.png` (žlutá hvězda, 222×192 px, ~7 KB), 120 px v sidebaru, 96 px v inline. **Ne** themový `logo-new.svg`. Demo používá lokální relativní cestu. **Embed snippet (`<template id="nlSnippet">`) má logo inline jako base64 data URI** (~10 KB), aby byl samonosný.
- **Bullets jako `<div>`, ne `<ul>/<li>`:** vyhne se theme custom bulletům (viz Visual style rules). `.nl-card__list-item::before` = vlastní zelený kruh s bílou fajfkou (SVG data-URI).
- **Tlačítko vs theme defaulty:** snippet defenzivně přebíjí theme `button` rules (`text-transform: none; box-shadow: none; margin: 0`) + explicitní `height: 48px; padding: 0 16px`. Bez těchto override bude tlačítko UPPERCASE a vyšší než input.
- **Input + button výška:** oba `height: 48px`. V inline variantě má `.nl-card__row` `align-items: center`.

### Substack endpoint

POST na `https://cestina20.substack.com/api/v1/free` – stejný endpoint, který Substack iframe volá interně. Při CORS / non-2xx fallback `window.location` na `https://cestina20.substack.com/subscribe?email=…` – Substackem hostovaná stránka má e-mail předvyplněný. Double opt-in drží Substack.

### Copy a tonalita

- Headline: **„Buďte o slovo napřed"**
- Lead: „Každý všední den jedno vybrané slovo z Češtiny 2.0, se kterým zaperlíte před rodinou, přáteli i kolegy."
- Intro nad bullets: **„Co dostanete:"** Bullets: Slovo dne / Definice / Příklad použití.
- Sociální důkaz: **„Odebírá už přes 1 500 lidí"** (3. os. j. č., ne plurál „nás" – Čeština 2.0 je solopodnik).
- CTA: **„Odebírat"**. Placeholder: **„Zadejte svůj e-mail"**.
- Podpis: **„Posílá Martin Kavka, zakladatel slovníku Čeština 2.0"**.
- **Bez „Zdarma"** a **bez „Bez spamu / odhlášení kdykoli"** mikrokopie.

## Contacts & branding

- **`ja@cestina20.cz`** – veřejná adresa Čeština 2.0. Používej v kontaktních blocích a marketingových materiálech.
- **`kavka.martin@gmail.com`** – osobní git identity pro Vercel, **ne na veřejné materiály**.
- **`info@hados.cz`** – kontakt pro PLK.
- **Kniha:** *Hacknutá čeština* (zmiňuj jako výstup projektu).
- **ČUNDR** je finální český překlad modelu FUDGE (Frequency, Unobtrusiveness, Diversity, Generation of forms, Endurance). Starší zkratka ČPOTR – nepoužívat.

## Typografické konvence (marketing copy Čeština 2.0)

- **České uvozovky `„…"`** (U+201E + U+201C), ne `"…"` ani `"…"`.
- **En-dash `–`**, nikdy em-dash `—`.
- **`&nbsp;`** po jednohláskových předložkách a spojkách (a, i, k, o, s, u, v, z) a u čísel s jednotkami (`13&nbsp;%`).
- **Bez teček za nadpisy.**
