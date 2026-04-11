# SEO & GEO Optimalisatie — Equiprovet B.V.

Documentatie van alle aangebrachte wijzigingen voor vindbaarheid door Google, AI-tools (ChatGPT, Perplexity, Claude, Gemini), voice search en sociale netwerken.

**Domein:** `https://www.equiprovet.nl`
**Datum:** April 2026
**Uitgevoerd door:** Claude Code (Anthropic)

---

## Inhoudsopgave

1. [Nieuwe bestanden](#1-nieuwe-bestanden)
2. [Meta tags in index.html](#2-meta-tags-in-indexhtml)
3. [Structured data (JSON-LD)](#3-structured-data-json-ld)
4. [Core Web Vitals & Performance](#4-core-web-vitals--performance)
5. [Toegankelijkheid](#5-toegankelijkheid)
6. [Verificatiestappen](#6-verificatiestappen)
7. [Openstaande acties](#7-openstaande-acties)
8. [Hergebruik voor nieuwe projecten](#8-hergebruik-voor-nieuwe-projecten)

---

## 1. Nieuwe bestanden

### `robots.txt`
Vertelt zoekmachines en AI-crawlers wat ze mogen indexeren. Expliciete toestemming voor:
- `Googlebot` (Google)
- `GPTBot` (ChatGPT)
- `ChatGPT-User` (ChatGPT browsing)
- `Google-Extended` (Google AI / Gemini training)
- `PerplexityBot` (Perplexity AI)
- `ClaudeBot` (Anthropic / Claude)
- `anthropic-ai` (Anthropic)

Verwijst naar `sitemap.xml` zodat crawlers de site-structuur vinden.

### `sitemap.xml`
XML sitemap met alle pagina's/secties:
- Hoofdpagina (priority 1.0)
- `#products`, `#science`, `#alpha2eq` (priority 0.8)
- `#faq`, `#contact` (priority 0.7–0.9)

Bevat `hreflang` annotaties voor taaltargeting. **Indienen via Google Search Console.**

### `og-image.png`
Sociale preview-afbeelding (1200×630 px, PNG). Getoond bij het delen van de URL op:
- LinkedIn, Facebook, WhatsApp, Slack, Discord, X (Twitter)
- AI-tools die link-previews tonen

> **Waarom PNG en niet SVG?** Facebook en LinkedIn ondersteunen geen SVG als OG-afbeelding. PNG werkt overal.

### `og-image.svg`
SVG-versie van de social card (backup/print-gebruik).

### `favicon.svg`
Vectorieel favicon voor moderne browsers (Chrome, Firefox, Safari, Edge). Wordt getoond in browsertabs, bookmarks en zoekresultaten.

### `apple-touch-icon.png`
180×180 px icon voor iPhone/iPad homescreen wanneer gebruikers de site opslaan als shortcut.

### `manifest.json`
PWA-manifest voor browser-integratie en mobile discoverability. Bevat naam, beschrijving, thema-kleur en taal.

---

## 2. Meta tags in `index.html`

### SEO core
```html
<title>Equiprovet — The Equine Orthopaedic Specialist | Equine farmaceutica voor dierenartsen</title>
<meta name="description" content="...150-160 tekens...">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta name="author" content="Equiprovet B.V.">
<meta name="publisher" content="Equiprovet B.V.">
<link rel="canonical" href="https://www.equiprovet.nl/">
```

**Vuistregels:**
- Meta description: 150–160 tekens, bevat primaire zoekwoorden, is een call-to-action
- Canonical: altijd de definitieve URL zonder trailing variaties

### Geografisch (local SEO)
```html
<meta name="geo.region" content="NL-OV">         <!-- Overijssel -->
<meta name="geo.placename" content="Hengelo">
<meta name="geo.position" content="52.2660;6.7943">
<meta name="ICBM" content="52.2660, 6.7943">
```
Versterkt vindbaarheid bij zoekopdrachten met locatie ("equine dierenarts Hengelo").

### Open Graph (sociale media & AI-tools)
```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.equiprovet.nl/">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://www.equiprovet.nl/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="...">
<meta property="og:image:type" content="image/png">
<meta property="og:locale" content="nl_NL">
<meta property="og:site_name" content="Equiprovet">
```

### Twitter / X Cards
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://www.equiprovet.nl/og-image.png">
<meta name="twitter:image:alt" content="...">
```

### PWA & Mobile
```html
<meta name="theme-color" content="#B8924A">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Equiprovet">
<link rel="manifest" href="/manifest.json">
```

### Hreflang (taaltargeting)
```html
<link rel="alternate" hreflang="nl" href="https://www.equiprovet.nl/">
<link rel="alternate" hreflang="nl-NL" href="https://www.equiprovet.nl/">
<link rel="alternate" hreflang="nl-BE" href="https://www.equiprovet.nl/">
<link rel="alternate" hreflang="x-default" href="https://www.equiprovet.nl/">
```
> Voor DE, PL, GB: vertaalde pagina's aanmaken en toevoegen als `hreflang="de"`, `hreflang="pl"`, `hreflang="en-GB"`.

### Favicon
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

### Font preloading
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?...">
```

---

## 3. Structured Data (JSON-LD)

Zeven `<script type="application/ld+json">` blokken in `<head>`. Dit is de belangrijkste factor voor **GEO (Generative Engine Optimization)** — AI-tools lezen deze data om antwoorden te genereren.

### 1. WebSite + SearchAction
Definieert de website als entiteit. SearchAction vertelt Google dat er een zoekfunctie is (activeert Sitelinks Search Box in zoekresultaten).

### 2. Organization
Het meest kritische blok voor AI-vindbaarheid. Definieert Equiprovet als entiteit in de Google Knowledge Graph. Bevat:
- Officiële naam + alternatieve namen
- URL, logo, beschrijving
- Vestigingsadres
- Contactpunt met beschikbare talen
- `areaServed` (NL, BE, DE, PL, GB, EU)
- `sameAs` (LinkedIn — versterkt de entiteit)
- `knowsAbout` (expertise-signalen voor AI)

### 3. LocalBusiness / MedicalBusiness
Voor local SEO en Google Maps. Bevat adres, geo-coördinaten, openingstijden, telefoonnummer (⚠️ nog invullen).

### 4. FAQPage
Alle 6 FAQ-vragen als gestructureerde data. AI-tools (ChatGPT, Perplexity, Claude) citeren FAQ-schema direct als antwoord op gebruikersvragen. Dit is de snelste route naar AI-citaties.

### 5. ItemList (producten)
Zes `Product`-objecten met naam, beschrijving, categorie en URL. Activeert rich results in Google Shopping en product-blokken in AI-antwoorden.

### 6. AggregateRating + Reviews
Drie testimonials van Dr. van Dijk (NL), Dr. Wiśniewski (PL) en Dr. Braun (DE) als gestructureerde reviews. Activeert sterren in zoekresultaten (rich snippets).

### 7. WebPage + Speakable + BreadcrumbList
- `WebPage`: koppelt pagina aan Organization-entiteit
- `Speakable`: markeert welke CSS-selectors citeerbare content bevatten voor voice search en AI-assistenten (`h1`, `h2`, `.section-desc`, `.faq-answer-inner`)
- `BreadcrumbList`: navigatiehiërarchie voor Google

---

## 4. Core Web Vitals & Performance

### LCP (Largest Contentful Paint) — was kritiek
De intro-overlay blokkeerde de pagina **2,6 seconden** — dit is boven Google's grens van 2,5s voor "goed".

**Wijziging:**
```css
/* Oud */
animation: overlayExit 0.7s 1.8s cubic-bezier(0.76,0,0.24,1) forwards;

/* Nieuw */
animation: overlayExit 0.3s 0.1s cubic-bezier(0.76,0,0.24,1) forwards;
```
```js
// Oud
setTimeout(() => { overlay.style.display = 'none'; }, 2600);

// Nieuw
setTimeout(() => { overlay.style.display = 'none'; }, 500);
```
Totale overlay-tijd: **0,4 seconden** (was 2,6s).

### Preview-banner verwijderd
De banner "WEBSITE PREVIEW — Niet voor publicatie" is verwijderd. Schaadde geloofwaardigheid en E-E-A-T.

### Noscript fallback
```html
<noscript>
  <!-- Volledige tekstinhoud voor crawlers zonder JS-rendering -->
</noscript>
```
Zoekmachines die geen JavaScript uitvoeren zien alsnog alle kerninhoud.

---

## 5. Toegankelijkheid

### prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  #intro-overlay { display: none !important; }
  .reveal { opacity: 1 !important; transform: none !important; }
}
```
Google gebruikt toegankelijkheid als rankingfactor. Gebruikers met `prefers-reduced-motion` (vaak mensen met vestibulaire aandoeningen) zien de pagina direct zonder animaties.

---

## 6. Verificatiestappen

Na livegang op `www.equiprovet.nl` uitvoeren:

| Tool | URL | Wat te controleren |
|---|---|---|
| Google Rich Results Test | search.google.com/test/rich-results | FAQPage, Review, Organization, Product rich results |
| Schema.org Validator | validator.schema.org | Alle 7 JSON-LD blokken valideren |
| Facebook OG Debugger | developers.facebook.com/tools/debug | OG-afbeelding preview + scrape vernieuwen |
| LinkedIn Post Inspector | linkedin.com/post-inspector | LinkedIn preview controleren |
| Twitter Card Validator | cards-dev.twitter.com/validator | Twitter/X card preview |
| Google Search Console | search.google.com/search-console | Sitemap indienen, crawlfouten monitoren |
| PageSpeed Insights | pagespeed.web.dev | Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms |
| Mobile-Friendly Test | search.google.com/test/mobile-friendly | Mobiele weergave controleren |

---

## 7. Openstaande acties

Deze punten vereisen input van Equiprovet en vallen buiten de code:

- [ ] **Telefoonnummer invullen** — staat als placeholder in HTML (regels ~800, ~1450) én in het LocalBusiness JSON-LD schema. Slecht voor local SEO.
- [ ] **LinkedIn URL bevestigen** — nu `https://www.linkedin.com/company/equiprovet`; aanpassen indien anders.
- [ ] **Google Search Console** — account aanmaken, domein verifiëren, sitemap.xml indienen via `https://www.equiprovet.nl/sitemap.xml`.
- [ ] **Google Business Profile** — bedrijfsprofiel aanmaken/claimen voor de Hengelo-locatie (essentieel voor local pack in zoekresultaten).
- [ ] **Vertaalde pagina's** — voor volledige hreflang-ondersteuning van DE, PL en GB zijn aparte URL's nodig (`/de/`, `/pl/`, `/en/`).
- [ ] **Backlinks opbouwen** — links van veterinaire vakbladen, universiteitspartners (UU, Hannover), congreswebsites en productfabrikanten.
- [ ] **Google Analytics 4** — implementeer GA4 voor conversie-tracking (registraties, contactverzoeken).

---

## 8. Hergebruik voor nieuwe projecten

### Minimale SEO-checklist voor elke nieuwe site

**Bestanden (altijd aanmaken):**
- `robots.txt` — minimaal: `User-agent: * / Allow: / / Sitemap: https://domein.nl/sitemap.xml`
- `sitemap.xml` — alle publieke URLs
- `favicon.svg` + `apple-touch-icon.png`
- `manifest.json`
- `og-image.png` (1200×630 px)

**Meta tags (altijd in `<head>`):**
```html
<title>Paginatitel — Merknaam | Zoekwoord</title>
<meta name="description" content="150-160 tekens met primaire zoekwoorden">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="https://definitieve-url/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://definitieve-url/">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://domein.nl/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="nl_NL">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://domein.nl/og-image.png">
<meta name="theme-color" content="#hexkleur">
<link rel="manifest" href="/manifest.json">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

**JSON-LD (minimaal voor B2B-site):**
1. `Organization` — naam, url, logo, contactPoint, areaServed, sameAs
2. `LocalBusiness` — adres, geo, openingstijden, telefoon
3. `FAQPage` — alle FAQ's als gestructureerde vragen/antwoorden
4. `WebSite` — met SearchAction

**AI-vindbaarheid (GEO) specifiek:**
- `Speakable` schema op webpagina's met citeerbare content
- `knowsAbout` array in Organization-schema
- FAQ's uitgebreid en inhoudelijk — AI-tools citeren hier direct uit
- Duidelijke autoriteitsignalen: auteursnamen, certificeringen, partners

**Performance:**
- Intro/splash overlays: maximaal 400ms totaal
- `prefers-reduced-motion` media query
- Font preconnect + dns-prefetch
- `<noscript>` fallback met kerninhoud
