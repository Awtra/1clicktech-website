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
     2. Share ▸ General access ▸ "Anyone with the link" ▸ Viewer ▸ Done
     3. Copy the sheet's link from your browser address bar — that's it.
        (The old "Publish to web" CSV link also still works if you have one.)
     4. Paste it below as SHEET_CSV_URL.

     The link you paste is PERMANENT — you never change it again. Editing the
     sheet updates the same link's data, and the site re-reads it every
     REFRESH_MINUTES, so adding / editing / removing a row updates the
     website live within ~5 minutes.

     Leave SHEET_CSV_URL empty ("") to run on the built-in sample
     catalog below (great for previewing before you connect a sheet).
  --------------------------------------------------------- */
  SHEET_CSV_URL: "",              // <-- paste ANY Google Sheets link here (the normal share link works — see below)
  REFRESH_MINUTES: 5,             // auto-refresh interval

  // Column header names in your sheet (change only if you rename columns)
  COLUMNS: {
    name:       ["name", "product", "title"],
    image:      ["image", "img", "image_url", "photo", "picture"],
    category:   ["category", "cat", "department"]
  },

  /* ---------------------------------------------------------
     GOOGLE REVIEWS WIDGET
     ---------------------------------------------------------
     1. Get a Google Business Profile (business.google.com) so
        customers can leave Google reviews — free, ~10 min setup.
     2. On https://trustindex.io create the FREE Google Reviews
        widget for that profile (no card needed) — or use Elfsight.
     3. Copy the widget's <iframe ...></iframe> embed snippet
        and paste it WHOLE between the backticks below.
     4. Commit + push. The "Google Reviews" band appears in the
        testimonials section, auto-synced with new reviews.

     Leave it empty and the band stays hidden — nothing breaks.
  --------------------------------------------------------- */
  GOOGLE_REVIEW_EMBED: ``,       // <-- paste the widget iframe snippet between the backticks

  CURRENCY: "$",

  /* ---------------------------------------------------------
     QUOTE FORM → EMAIL (FormSubmit.co)
     ---------------------------------------------------------
     The form sends directly to the inbox below — no account
     needed. Just set the address you want submissions to go to.

     ⚠️ ONE-TIME ACTIVATION: after this is live, submit the form
     once → FormSubmit sends an activation email to the address
     below → click "Activate" in that email. After that, every
     quote request lands in the inbox (check spam if it's slow).
     --------------------------------------------------------- */
  FORM_EMAIL: "farhana@1clktech.com",    // <-- quote requests go here

  /* ---------------------------------------------------------
     FORMSPREE ALTERNATIVE (optional)
     Prefer Formspree? Create a free form at https://formspree.io
     and paste its endpoint here instead. Leave "" to use the
     FormSubmit.co address above.
  --------------------------------------------------------- */
  FORMSPREE_ENDPOINT: "",

  /* ---------------------------------------------------------
     LIVE CHAT (Tawk.to)
     ---------------------------------------------------------
     1. Go to https://tawk.to and create a free account.
     2. In the dashboard: Admin → Chat Widget → copy the
        "Widget Code" (a <script> tag containing a property ID).
     3. Paste the whole <script> tag below between the backticks.
     Done — a chat bubble appears bottom-right on desktop + mobile,
     and conversations land in the Tawk.to app (or your inbox).
     Leave empty ("") and no chat button shows.
  --------------------------------------------------------- */
  TAWK_WIDGET_CODE: `<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/6aa355cea9c2983442421808/1k270ec55';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->`,

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
