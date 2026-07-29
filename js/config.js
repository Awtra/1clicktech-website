/* ============================================================
   1ClickTech — SITE CONFIG
   Everything the 1ClickTech team can tweak lives here.
   No developer required for day-to-day catalog changes:
   that happens in the Google Sheet (see SHEET section below).
   ============================================================ */

window.SITE_CONFIG = {

  /* ---------------------------------------------------------
     GOOGLE SHEET LIVE CATALOG
     ---------------------------------------------------------
     HOW IT WORKS
     1. Open your Google Sheet with columns:
            name | price | sale_price | image | category | badge
        (only name, price and image are required — the rest are optional)
     2. File ▸ Share ▸ Publish to web ▸ pick the sheet ▸ CSV ▸ Publish
     3. Copy the URL it gives you (it ends in output=csv)
     4. Paste it below as SHEET_CSV_URL.

     The site re-reads the sheet every REFRESH_MINUTES automatically,
     so adding / editing / removing a row updates the website live.

     Leave SHEET_CSV_URL empty ("") to run on the built-in sample
     catalog below (great for previewing before you connect a sheet).
  --------------------------------------------------------- */
  SHEET_CSV_URL: "",              // <-- paste your published CSV URL here
  REFRESH_MINUTES: 5,             // auto-refresh interval

  // Column header names in your sheet (change only if you rename columns)
  COLUMNS: {
    name:       ["name", "product", "title"],
    price:      ["price", "msrp", "was"],
    sale_price: ["sale_price", "sale", "now", "price_now"],
    image:      ["image", "img", "image_url", "photo", "picture"],
    category:   ["category", "cat", "department"],
    badge:      ["badge", "tag", "label"]
  },

  CURRENCY: "$",
  FREE_SHIP_THRESHOLD: 75,

  /* ---------------------------------------------------------
     FALLBACK / SAMPLE CATALOG
     Used when SHEET_CSV_URL is empty, or if the sheet ever
     fails to load (so the store is never blank).
     These are seeded from the real 1ClickTech catalog.
  --------------------------------------------------------- */
  SAMPLE_PRODUCTS: [
    { name:"HP MicroServer Gen10 Plus — Xeon E-2224, 32GB RAM, 4TB SSD, Windows Server 2019", price:1499, sale_price:989, image:"assets/microserver-gen10.jpg", category:"Servers", badge:"Bestseller" },
    { name:"HP ProLiant ML30 Gen10 Business Server — Xeon 4-Core 3.5GHz, 64GB DDR4, 8TB SSD, RAID", price:2199, sale_price:1749, image:"assets/proliant-ml30.jpg", category:"Servers", badge:"Sale" },
    { name:"HP Z440 Tower Workstation — Xeon E5-2609 V3, 64GB DDR4, 2TB SSD, Win 10 Pro (Renewed)", price:1299, sale_price:899, image:"assets/z440-tower.jpg", category:"Servers", badge:"Renewed" },
    { name:"HP J9773A 2530-24G-PoE+ Switch — 24 Ports, Managed, Rack-Mountable", price:749, sale_price:519, image:"assets/switch-j9773a.jpg", category:"Networking", badge:"Sale" },
    { name:"HP ProCurve J9772A 2530-48G-PoE+ Switch — 48 Ports Gigabit Managed", price:1099, sale_price:799, image:"assets/switch-j9772a.jpg", category:"Networking", badge:"Sale" },
    { name:"HP J9776A 2530-24G — 24-Port Gigabit Switch", price:449, sale_price:299, image:"assets/switch-j9776a.jpg", category:"Networking", badge:"Sale" },
    { name:"HP LaserJet 5200TN Monochrome Printer (Renewed)", price:599, sale_price:389, image:"assets/laserjet-5200.jpg", category:"Printers", badge:"Renewed" },
    { name:"HP Instant Ink Business $20 Prepaid Enrollment Card (3YN94AN)", price:25, sale_price:20, image:"assets/ink-card.jpg", category:"Software", badge:"Sale" },
    { name:"HP 2TB SATA 3.0 3.5\" Internal Hard Drive (AW556A)", price:189, sale_price:129, image:"assets/hdd-2tb.jpg", category:"Hard Drives", badge:"Sale" },
    { name:"HPE 1.2TB 12GB 10K SAS SFF Enterprise Hard Disk Drive", price:249, sale_price:179, image:"assets/hdd-sas.jpg", category:"Hard Drives", badge:"Sale" },
    { name:"HPE 2920 1.0M Switch Stacking Cable", price:89, sale_price:59, image:"assets/stacking-cable.jpg", category:"Cables", badge:"Sale" },
    { name:"HP 628059-B21 — 3TB 3.5\" SATA 7.2K 6Gb/s Midline Hard Drive", price:279, sale_price:199, image:"assets/server-generic.jpg", category:"Hard Drives", badge:"Sale" }
  ]
};
