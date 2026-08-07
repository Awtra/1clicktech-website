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
    { name:"Networking Starter Kit — Wi-Fi Router, 24-Port Switch & Cat6 Cable", price:349, sale_price:279, image:"assets/products/networking-bundle.jpg", category:"Networking", badge:"Bestseller" },
    { name:"Enterprise Tower Servers — Multi-Bay Storage, LED Status, Rack Ready", price:1899, sale_price:1599, image:"assets/products/tower-servers.jpg", category:"Servers", badge:"Featured" },
    { name:"Business Chromebook — Chrome OS, Full Keyboard & Trackpad", price:549, sale_price:449, image:"assets/products/chromebook.jpg", category:"Chromebooks", badge:"Sale" },
    { name:"Storage Bundle — 4-Bay NAS + 4TB SATA Drive + SSD", price:799, sale_price:649, image:"assets/products/storage-bundle.jpg", category:"Storage", badge:"Featured" },
    { name:"Yealink IP Desk Phone — Color LCD, HD Voice Handset", price:189, sale_price:149, image:"assets/products/ip-phone.jpg", category:"IP Phones", badge:"Sale" },
    { name:"Epson Flatbed Scanner — Open Lid, High-Resolution Platen", price:229, sale_price:189, image:"assets/products/scanner.jpg", category:"Printers & Scanners", badge:"Sale" },
    { name:"Brother Color Multifunction Printer — Touchscreen, ADF", price:449, sale_price:379, image:"assets/products/mfp-printer.jpg", category:"Printers & Scanners", badge:"Featured" },
    { name:"Epson 3LCD Projector — Bright Lens, Adjustable Focus", price:599, sale_price:499, image:"assets/products/projector.jpg", category:"Projectors", badge:"Sale" },
    { name:"Gigabyte GeForce RTX Graphics Card — Triple-Fan Cooling", price:899, sale_price:749, image:"assets/products/gpu.jpg", category:"GPU", badge:"Featured" },
    { name:"Epson Thermal Receipt Printer — POS, Top-Exit Paper", price:299, sale_price:249, image:"assets/products/receipt-printer.jpg", category:"Receipt Printers", badge:"Sale" },
    { name:"Laptop Accessory Bundle — Bag, Mouse, USB-C Hub, Stand & Cooler", price:159, sale_price:129, image:"assets/products/laptop-accessories.jpg", category:"Laptop Accessories", badge:"Bestseller" },
    { name:"Bullet IP Security Camera — IR Night Vision, Wall Mount", price:139, sale_price:109, image:"assets/products/ip-camera.jpg", category:"IP Camera", badge:"Sale" },
    { name:"Compact Thermal Receipt Printer — 80mm POS, LED Indicators", price:179, sale_price:149, image:"assets/products/thermal-printer.jpg", category:"Thermal Printer", badge:"Sale" }
  ]
};
