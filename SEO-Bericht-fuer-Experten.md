# SEO & GEO Optimierung — Equiprovet B.V.
**Technischer Bericht für den SEO-Experten**
Domain: `https://www.equiprovet.nl` | April 2026

---

## Ausgangslage

Einseitige HTML-Website (Single Page Application) ohne jegliche SEO-Infrastruktur: keine Meta-Description, kein Structured Data, kein Sitemap, kein robots.txt, keine Open Graph Tags, keine Favicons. LCP-kritisch: Intro-Overlay blockierte die Seite 2,6 Sekunden.

---

## Durchgeführte Maßnahmen

### 1. Technische Infrastruktur

| Datei | Inhalt |
|---|---|
| `robots.txt` | Explizite Crawling-Erlaubnis für Googlebot, GPTBot, ClaudeBot, PerplexityBot, Google-Extended, ChatGPT-User, anthropic-ai |
| `sitemap.xml` | XML-Sitemap mit Hauptseite + allen 6 Abschnitten, inkl. hreflang-Annotationen |
| `manifest.json` | PWA-Manifest (Name, Beschreibung, Theme-Color, Sprache) |
| `favicon.svg` | Vektorielles Favicon für moderne Browser |
| `apple-touch-icon.png` | 180×180 px Icon für iOS-Homescreen |
| `og-image.png` | Social Card 1200×630 px als PNG (SVG wird von LinkedIn/Facebook nicht unterstützt) |

---

### 2. Meta-Tags (`<head>`)

Vollständig neu implementiert:

- **SEO Core:** `<title>` (optimiert mit primärem Keyword), `<meta name="description">` (155 Zeichen), `<meta name="robots">` mit `max-snippet:-1, max-image-preview:large`, `<link rel="canonical">`
- **Geo-Tags:** `geo.region` (NL-OV), `geo.placename`, `geo.position`, `ICBM` — für lokale Suchanfragen und Google Maps
- **Open Graph:** Vollständige Suite (type, url, title, description, image, image:width/height/alt/type, locale, site_name)
- **Twitter/X Cards:** `summary_large_image` mit allen Pflichtfeldern
- **hreflang:** `nl`, `nl-NL`, `nl-BE`, `x-default` — Erweiterung auf DE/PL/GB nach Erstellung übersetzter Seiten möglich
- **PWA & Mobile:** `theme-color`, `apple-mobile-web-app-*`, `<link rel="manifest">`
- **Font-Optimierung:** `preconnect`, `dns-prefetch`, `preload` für Google Fonts

---

### 3. Structured Data — 7 JSON-LD Blöcke

| Schema-Typ | Zweck |
|---|---|
| `WebSite` + SearchAction | Sitelinks Search Box in Google-Ergebnissen |
| `Organization` | Entitätsdefinition für Google Knowledge Graph und KI-Tools; inkl. `knowsAbout`, `areaServed`, `sameAs` (LinkedIn) |
| `LocalBusiness` / `MedicalBusiness` | Adresse, Geo-Koordinaten, Öffnungszeiten — ⚠️ Telefonnummer muss noch ergänzt werden |
| `FAQPage` | Alle 6 FAQs als Structured Data — primäre Quelle für KI-Zitate (ChatGPT, Perplexity, Claude) |
| `ItemList` + 6× `Product` | Produktübersicht für Rich Results und KI-Produktblöcke |
| `AggregateRating` + 3× `Review` | Bewertungsterne in den Suchergebnissen (3 Testimonials, je 5/5) |
| `WebPage` + `Speakable` + `BreadcrumbList` | Voice Search, KI-Assistenten; Speakable markiert `h1`, `h2`, `.section-desc`, `.faq-answer-inner` als zitierfähig |

---

### 4. Core Web Vitals

**LCP-Problem behoben:** Die Intro-Überlagerung blockierte den First Paint 2,6 Sekunden (oberhalb des Google-Schwellenwerts von 2,5 s).

- CSS-Animation: Verzögerung von 1,8 s auf 0,1 s reduziert, Dauer von 0,7 s auf 0,3 s
- JS-Fallback: 2.600 ms → 500 ms
- **Ergebnis:** Gesamtblockierung 0,4 Sekunden

**Weitere Maßnahmen:**
- `prefers-reduced-motion` Media Query: Animationen werden bei Nutzereinstellung deaktiviert (Accessibility-Rankingsignal)
- `<noscript>` Fallback: Vollständiger Textinhalt für Crawler ohne JS-Rendering
- Preview-Banner entfernt („Niet voor publicatie" — war sichtbar und schadete E-E-A-T)

---

## Noch ausstehend (außerhalb des Codes)

| Punkt | Priorität | Begründung |
|---|---|---|
| Telefonnummer eintragen | Kritisch | Steht noch als Platzhalter — schadet Local SEO und LocalBusiness-Schema |
| Google Search Console | Hoch | Sitemap einreichen unter `https://www.equiprovet.nl/sitemap.xml` |
| Google Business Profile | Hoch | Standort Hengelo beanspruchen — essentiell für Local Pack |
| LinkedIn-URL bestätigen | Mittel | Aktuell `linkedin.com/company/equiprovet` — bei Abweichung anpassen |
| GA4 implementieren | Mittel | Kein Analytics vorhanden — Conversion-Tracking fehlt |
| Übersetzte Seiten (DE/PL/GB) | Mittel | Für vollständige hreflang-Unterstützung auf Zielmärkten |
| Backlink-Aufbau | Mittel | Veterinäre Fachzeitschriften, Universitätspartner, Kongresswebsites |
| Produktfotos | Niedrig | Keine `<img>`-Elemente auf der Seite — Image Search nicht nutzbar |

---

## Anmerkung zu GEO (Generative Engine Optimization)

Die Seite wurde bewusst auf KI-Suchmaschinen ausgerichtet. Die FAQPage- und Speakable-Schemata sowie die detaillierten `knowsAbout`-Felder im Organization-Schema erhöhen die Wahrscheinlichkeit, dass ChatGPT, Perplexity und ähnliche Tools Equiprovet als autoritative Quelle für Fragen zu equiner Orthopädie zitieren.
