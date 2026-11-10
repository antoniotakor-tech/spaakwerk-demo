# Spaakwerk landing page

**Live: https://antoniotakor-tech.github.io/spaakwerk-demo/**

A landing page for a small bike and e-bike repair shop in Amsterdam-Noord. It is a practice client job: Spaakwerk is an invented business, and the phone number, KvK, VAT, reviews and photo on the page are placeholders. The site is hidden from search engines.

## What the page does

- Shows the full price list first, with what "from" includes
- Lets a visitor pick bike type and problem, then opens a pre-filled WhatsApp message to book
- Says honestly what is possible the same day and what is not
- Privacy statement and cookie policy in English and Dutch

## How it is built

- Plain HTML, CSS and a small vanilla JavaScript file, assembled from partials with a short Python build script
- Playfair Display and Inter, self-hosted. Colours from the client's own logo (green, orange, cream)
- No cookies, no storage, no analytics, no third-party requests
- Strict Content Security Policy, a script that hides the page when it is framed, custom 404, sitemap and manifest
- Works at phone width and at 200% text size. Contrast values are computed and every tap target is at least 44px
- Animated bicycle in the hero (SVG motion along a path), switched off for visitors who prefer reduced motion

## Note on hosting

GitHub Pages cannot send security headers. A real deployment should use a host that applies the `_headers` file (Cloudflare Pages or Netlify).

---

Made by [Antonio Frungillo](https://antoniotakor-tech.github.io). Fonts: Inter and Playfair Display, SIL Open Font License.
