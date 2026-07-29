# 🔌 Connect Your Live Product Catalog (Google Sheets)

Your website reads products from a **Google Sheet** you control. Add a row → it appears on the site. Change a price → it updates on the site. Delete a row → it disappears. **No developer, no code, no re-deploy.** The site re-checks the sheet automatically **every 5 minutes**.

This is the single most valuable feature of the build: your non-technical team runs the entire storefront from a spreadsheet.

---

## ⏱️ 5-Minute Setup

### Step 1 — Make your sheet
1. Go to **[sheets.google.com](https://sheets.google.com)** and create a new blank sheet.
2. In **row 1**, type these column headers exactly (order doesn't matter):

   | name | price | sale_price | image | category | badge |
   |------|-------|-----------|-------|----------|-------|

   - **name** *(required)* — the product title shown on the card
   - **price** *(required)* — the regular price (numbers only, e.g. `1499`)
   - **sale_price** *(optional)* — the discounted price. Leave blank if it isn't on sale. If it's lower than `price`, the card automatically shows a strike-through original + a "Sale" badge.
   - **image** *(required)* — the product photo (see **Step 2** — this is the one part people get wrong, so read it)
   - **category** *(optional)* — e.g. `Servers`, `Networking`, `Printers`. Categories become filter buttons **automatically**. New category on the sheet = new filter button on the site.
   - **badge** *(optional)* — a little tag on the corner of the card, e.g. `Bestseller`, `New`, `Renewed`, `Only 2 left`.

3. Fastest start: open **`sample-products.csv`** (included in this project) → in Google Sheets do **File ▸ Import ▸ Upload** → pick that file → **Replace current sheet**. You'll have all 12 real products loaded instantly, then just edit from there.

---

### Step 2 — Add your product images (pick ONE method)

**Method A — Image already lives on a website (easiest).**
Paste the full image URL, e.g. `https://1clktech.com/wp-content/uploads/2020/04/j9773a.jpg`. Done.

**Method B — Upload your own photos to Google Drive.**
1. Put the photo in Google Drive → right-click it → **Share** → **Anyone with the link** → **Viewer**. *(This "Anyone with the link" step is mandatory — without it the image shows blank.)*
2. Copy the share link and paste it into the `image` column. Any of these formats work — the site converts them automatically:
   - `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
   - `https://drive.google.com/open?id=FILE_ID`

> 💡 If an image ever fails to load, the card gracefully falls back to the 1ClickTech logo instead of a broken-image icon — the store never looks broken.

---

### Step 3 — Publish the sheet as CSV
1. In your sheet: **File ▸ Share ▸ Publish to web**.
2. In the dialog: **Link** tab → first dropdown = pick your sheet's tab (e.g. *Sheet1*) → second dropdown = **Comma-separated values (.csv)**.
3. Click **Publish** → **OK**.
4. Copy the URL it gives you. It looks like:
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-XXXXXXXX/pub?gid=0&single=true&output=csv
   ```

> ⚠️ "Publish to web" is **not** the same as the normal "Share" button. You must use *Publish to web* so the site can read the CSV. The published CSV only exposes the columns above — nothing else in your Google account.

---

### Step 4 — Plug it into the site
1. Open **`js/config.js`** in the project.
2. Paste your URL between the quotes on the `SHEET_CSV_URL` line:
   ```js
   SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv",
   ```
3. Save. Refresh the website.

You'll know it worked when the little status pill under the catalog heading turns **green: "Live · synced 3:42 PM"**. 🎉

---

## 🔄 How the live sync behaves

- The site auto-refreshes the catalog **every 5 minutes** (change this with `REFRESH_MINUTES` in `config.js`).
- Visitors can also hit the **Refresh** button in the catalog toolbar to pull the latest instantly.
- If Google is briefly unreachable, the site keeps showing the **last known catalog** and quietly retries — customers never see an empty or broken store.
- Until you paste a URL, the site runs on the built-in **sample catalog** (the 12 real products), so it's never blank while you set up.

---

## 🧰 Everyday tasks (for your team)

| I want to… | Do this in the Google Sheet |
|------------|------------------------------|
| **Add a product** | Add a new row. Fill name, price, image. |
| **Remove a product** | Delete its row (or clear the name cell). |
| **Change a price** | Edit the `price` cell. |
| **Put something on sale** | Fill in `sale_price` lower than `price`. |
| **End a sale** | Clear the `sale_price` cell. |
| **Add a "New!" tag** | Type `New` in the `badge` cell. |
| **Create a new category** | Type a new value in `category` — a filter button appears automatically. |
| **Reorder products** | Reorder the rows; top row shows first. |

Changes appear on the site within 5 minutes (or instantly via the Refresh button). That's the whole workflow.

---

## 🛠️ Troubleshooting

| Symptom | Fix |
|--------|-----|
| Status pill stays orange / "sample catalog" | The `SHEET_CSV_URL` is empty or wrong. Re-copy the **output=csv** link from *Publish to web*. |
| Products don't load at all | Make sure the URL ends in `output=csv` and the sheet is **Published to web**, not just shared. |
| An image is blank | Drive file isn't set to **"Anyone with the link → Viewer"**, or the URL is a folder, not a file. |
| Prices show as `$0.00` | The `price` cell has letters/symbols. Use numbers only (`1499`, not `$1,499`). |
| A product won't disappear after deleting | Wait up to 5 min for the next sync, or click **Refresh**. Google also caches published sheets ~5 min. |

---

## 🚀 Going live (hosting)

The site is plain static files (HTML/CSS/JS) — it runs anywhere, cheaply or free:

- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop the `1Click` folder, done. Free tier is plenty.
- **Existing host / cPanel** — upload the folder contents via FTP.
- **GitHub Pages** — push the folder to a repo, enable Pages.

Nothing server-side is required because the Google Sheet *is* your backend.
