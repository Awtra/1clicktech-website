# 🔌 Connect Your Live Product Catalog (Google Sheets)

Your website reads products from a **Google Sheet** you control. Add a row → it appears on the site. Edit a row → it updates on the site. Delete a row → it disappears. **No developer, no code, no re-deploy.** The site re-checks the sheet automatically **every 5 minutes**.

Because this is a B2B quote-based site, **prices are never shown to visitors** — each product card shows "Available to quote" with a Request Pricing button. Your sheet only needs to describe *what you can source*.

---

## ⏱️ 5-Minute Setup

### Step 1 — Make your sheet
1. Go to **[sheets.google.com](https://sheets.google.com)** and create a new blank sheet.
2. In **row 1**, type these column headers exactly (order doesn't matter):

   | name | image | category |
   |------|-------|----------|

   - **name** *(required)* — the product title shown on the card
   - **image** *(required)* — the product photo (see **Step 2** — this is the one part people get wrong, so read it)
   - **category** *(recommended)* — e.g. `Servers`, `Networking`, `Printers & Scanners`. Categories become filter buttons **automatically**. New category on the sheet = new filter button on the site.

   > Have a sheet that also has price columns? No problem — extra columns are simply ignored. Only `name`, `image`, and `category` are read.

3. Fastest start: open **`sample-products.csv`** (included in this project) → in Google Sheets do **File ▸ Import ▸ Upload** → pick that file → **Replace current sheet**. You'll have all 13 real products loaded instantly, then just edit from there.

---

### Step 2 — Add your product images (pick ONE method)

**Method A — Image already lives on a website (easiest).**
Paste the full image URL, e.g. `https://1clktech.com/wp-content/uploads/2020/04/j9773a.jpg`. Done.

**Method B — Upload your own photos to Google Drive.**
1. Put the photo in Google Drive → right-click it → **Share** → **Anyone with the link** → **Viewer**. *(This "Anyone with the link" step is mandatory — without it the image shows blank.)*
2. Copy the share link and paste it into the `image` column. Any of these formats work — the site converts them automatically:
   - `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
   - `https://drive.google.com/open?id=FILE_ID`

> 💡 If an image ever fails to load, the card gracefully falls back to the 1ClickTech logo instead of a broken-image icon — the site never looks broken.

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
3. Save, commit, push (GitHub Pages redeploys in ~1 minute).

You'll know it worked when the little status pill under the "What we source" heading turns **green: "Inventory synced 3:42 PM"**. 🎉

---

## 🔄 How the live sync behaves

- The site auto-refreshes the catalog **every 5 minutes** (change this with `REFRESH_MINUTES` in `config.js`).
- If Google is briefly unreachable, the site keeps showing the **last known catalog** and quietly retries — visitors never see an empty page.
- Until you paste a URL, the site runs on the built-in **sample catalog** (the 13 real products), so it's never blank while you set up.

---

## 🧰 Everyday tasks (for your team)

| I want to… | Do this in the Google Sheet |
|------------|------------------------------|
| **Add a product** | Add a new row. Fill name + image (+ category). |
| **Remove a product** | Delete its row (or clear the name cell). |
| **Rename a product** | Edit the `name` cell. |
| **Swap a photo** | Replace the `image` cell. |
| **Create a new category** | Type a new value in `category` — a filter button appears automatically. |
| **Reorder products** | Reorder the rows; top row shows first. |

Changes appear on the site within ~5 minutes. That's the whole workflow.

---

## 🛠️ Troubleshooting

| Symptom | Fix |
|--------|-----|
| Status pill stays grey / "Sample list" | The `SHEET_CSV_URL` is empty or wrong. Re-copy the **output=csv** link from *Publish to web*. |
| Products don't load at all | Make sure the URL ends in `output=csv` and the sheet is **Published to web**, not just shared. |
| An image is blank | Drive file isn't set to **"Anyone with the link → Viewer"**, or the URL is a folder, not a file. |
| A product won't disappear after deleting | Wait up to 5 min for the next sync. Google also caches published sheets ~5 min. |

---

## ✉️ Bonus: Quote form → email

The "Request My Quote" form is wired to **Formspree** (see `FORMSPREE_ENDPOINT` in `js/config.js`).
Setup guide: **SETUP-QUOTE-FORM.md** in this project.
