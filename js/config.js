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
            name | image | category
        (name and image are required; category is optional but recommended)
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
    image:      ["image", "img", "image_url", "photo", "picture"],
    category:   ["category", "cat", "department"]
  },

  CURRENCY: "$",

  /* ---------------------------------------------------------
     QUOTE FORM → EMAIL (Formspree)
     ---------------------------------------------------------
     1. Go to https://formspree.io and sign up (free: 50 submissions/mo).
     2. New Form → name it e.g. "Quote Requests" → set the send-to
        email (sales@1clktech.com) → confirm the email they send you.
     3. Copy your form's endpoint, e.g. https://formspree.io/f/xwpekqjr
     4. Paste it below. Done — every quote request now lands in the inbox.

     Leave it empty ("") and the form shows a friendly demo message
     instead of sending anything.
  --------------------------------------------------------- */
  FORMSPREE_ENDPOINT: "",         // <-- paste your Formspree endpoint here

  /* ---------------------------------------------------------
     FALLBACK / SAMPLE CATALOG
     Used when SHEET_CSV_URL is empty, or if the sheet ever
     fails to load (so the sourcing list is never blank).

     B2B note: prices are intentionally NOT shown to visitors —
     every item is quoted per request. That's why each product
     here carries only name / image / category. (If you later
     connect a Google Sheet, extra columns like price are simply
     ignored by the site.)
  --------------------------------------------------------- */
  SAMPLE_PRODUCTS: [
    { name:"Networking Starter Kit — Wi-Fi Router, 24-Port Switch & Cat6 Cable", image:"assets/products/networking-bundle.jpg", category:"Networking" },
    { name:"Enterprise Tower Servers — Multi-Bay Storage, LED Status, Rack Ready", image:"assets/products/tower-servers.jpg", category:"Servers" },
    { name:"Business Chromebook — Chrome OS, Full Keyboard & Trackpad", image:"assets/products/chromebook.jpg", category:"Chromebooks" },
    { name:"Storage Bundle — 4-Bay NAS + 4TB SATA Drive + SSD", image:"assets/products/storage-bundle.jpg", category:"Storage" },
    { name:"Yealink IP Desk Phone — Color LCD, HD Voice Handset", image:"assets/products/ip-phone.jpg", category:"IP Phones" },
    { name:"Epson Flatbed Scanner — Open Lid, High-Resolution Platen", image:"assets/products/scanner.jpg", category:"Printers & Scanners" },
    { name:"Brother Color Multifunction Printer — Touchscreen, ADF", image:"assets/products/mfp-printer.jpg", category:"Printers & Scanners" },
    { name:"Epson 3LCD Projector — Bright Lens, Adjustable Focus", image:"assets/products/projector.jpg", category:"Projectors" },
    { name:"Gigabyte GeForce RTX Graphics Card — Triple-Fan Cooling", image:"assets/products/gpu.jpg", category:"GPU" },
    { name:"Epson Thermal Receipt Printer — POS, Top-Exit Paper", image:"assets/products/receipt-printer.jpg", category:"Receipt Printers" },
    { name:"Laptop Accessory Bundle — Bag, Mouse, USB-C Hub, Stand & Cooler", image:"assets/products/laptop-accessories.jpg", category:"Laptop Accessories" },
    { name:"Bullet IP Security Camera — IR Night Vision, Wall Mount", image:"assets/products/ip-camera.jpg", category:"IP Camera" },
    { name:"Compact Thermal Receipt Printer — 80mm POS, LED Indicators", image:"assets/products/thermal-printer.jpg", category:"Thermal Printer" }
  ]
};
