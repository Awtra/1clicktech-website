# 1ClickTech — Premium Website

A modern, interactive storefront for 1ClickTech (enterprise IT hardware — HP/HPE servers, switches, printers, drives, networking). Built to feel premium while staying true to the existing brand: same navy/steel/terracotta palette, same products, same promises.

**The headline feature:** the product catalog is powered by a **Google Sheet** the team edits directly. Add/edit/remove a row and the site updates automatically every 5 minutes — no developer, no code, no redeploy.

---

## 📁 Project structure

```
1Click/
├── index.html              ← the page (all sections)
├── css/
│   └── styles.css          ← full design system
├── js/
│   ├── config.js           ← ⚙️ EDIT THIS: sheet URL + settings + sample catalog
│   └── app.js              ← engine: live sync, cart, filters, animations
├── assets/                 ← logo + product images (real 1ClickTech photos)
├── sample-products.csv     ← ready-to-import starter sheet (12 real products)
├── SETUP-GOOGLE-SHEET.md   ← 5-min guide to connect the live catalog
├── STRATEGY.md             ← the sections / $10K design / conversion-copy writeup
└── README.md               ← this file
```

---

## ▶️ Run it locally

Any static server works — no build step, no dependencies.

### On a Mac (macOS)

```bash
# 1. Clone the repo (or download the ZIP from GitHub)
git clone https://github.com/USERNAME/1clicktech-website.git
cd 1clicktech-website

# 2. Start a local server (Python 3 ships with macOS)
python3 -m http.server 8848

# 3. Open it in your browser
open http://localhost:8848
```

Prefer Node? `npx serve -l 8848` works too. To stop the server, press `Ctrl+C`.

### On Windows

```bash
python -m http.server 8848
# then open http://localhost:8848
```

> Quick peek without a server: just double-click `index.html`. Note that to load a **live Google Sheet** you must serve over `http://` (as above) rather than `file://`, because browsers block the sheet fetch from `file://` pages (CORS). A real host/CDN handles this automatically.

---

## ⚙️ Connect the live catalog

Open **`SETUP-GOOGLE-SHEET.md`** and follow the 5 steps. Short version:
1. Make a Google Sheet with columns: `name, price, sale_price, image, category, badge` (import `sample-products.csv` to start instantly).
2. **File ▸ Share ▸ Publish to web ▸ CSV**, copy the `output=csv` link.
3. Paste it into `SHEET_CSV_URL` in `js/config.js`.
4. Reload — the catalog status pill turns green **"Live · synced."**

Until you connect a sheet, the site runs on the built-in sample catalog, so it's never blank.

---

## 🎨 Brand

- **Colors:** navy `#334862`, steel `#446084`, terracotta `#D26E4B` (pulled from the live site). Terracotta is reserved for CTAs.
- **Fonts:** Space Grotesk (headings) + Lato (body).
- **Logo & product images:** real assets from 1clktech.com, saved locally in `assets/`.

---

## ✅ What's implemented & tested

- Live Google-Sheet catalog with 5-min auto-refresh + manual refresh (verified end-to-end against `sample-products.csv`, including comma-and-quote-heavy product names).
- Robust CSV parser (quoted fields, escaped quotes, flexible header aliases).
- Auto-generated category filters + live search.
- Slide-in cart with quantity controls, free-shipping progress, toast notifications.
- Scroll-reveal, count-up stats, 3D hero tilt, cursor glow, brand marquee, scroll progress bar.
- Fully responsive + mobile menu + `prefers-reduced-motion` support.
- Graceful image fallback (broken image → logo, never a broken icon).
- Zero console/JS errors.

## 🔧 Before going live (see STRATEGY.md §5)

- Replace placeholder phone number (`+1 610-555-3862`) with the real one.
- Wire the quote + newsletter forms to your email/CRM (currently front-end demos).
- Swap sample stats/testimonials for real figures.
- Deploy to Netlify / Vercel / Cloudflare Pages (free) or your host — no server required.
