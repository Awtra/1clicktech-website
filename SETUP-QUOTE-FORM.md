# ✉️ Connect the Quote Form to Email (Formspree)

The "Request My Quote" form at the bottom of the site is fully wired — you just need to
give it a destination inbox. We use **Formspree**: free, no backend needed, spam-filtered,
and every submission arrives as a clean email.

---

## ⏱️ 5-Minute Setup

### Step 1 — Create the Formspree account & form
1. Go to **[formspree.io](https://formspree.io)** → **Sign Up** (the Free plan covers 50 submissions/month — plenty to start).
2. Click **+ New Form**.
3. Name it something like **Quote Requests**.
4. **Send To:** enter the inbox that should receive requests → `sales@1clktech.com`.
5. Click **Create Form**. Formspree emails that inbox a confirmation link — click it (required before submissions flow).

### Step 2 — Copy your endpoint
Formspree shows your form's endpoint, which looks like:
```
https://formspree.io/f/xwpekqjr
```
(The `xwpekqjr` part is unique to your form.) Copy it.

### Step 3 — Plug it into the site
1. Open **`js/config.js`**.
2. Paste the endpoint between the quotes:
   ```js
   FORMSPREE_ENDPOINT: "https://formspree.io/f/xwpekqjr",
   ```
3. Save, commit, push. Done — live in ~1 minute when Pages redeploys.

### Step 4 — Test it
Open the site, fill the quote form, hit **Request My Quote**. You should see the green
"Quote request sent" toast, and the email lands in `sales@1clktech.com` formatted as a
clean table: Name, Email, Company, Phone, Requirements.

---

## 📧 What each email looks like
Subject: **New quote request — 1ClickTech website**

| field | example |
|-------|---------|
| Name | Jordan Reyes |
| Email | jordan@acmeconsulting.com |
| Company | Acme Consulting |
| Phone | (555) 010-2233 |
| Requirements | 12x 24-port PoE switches + 30 Chromebooks, install Oct 15 |

(When a visitor clicks **Request Pricing** on a product card, that product's name is
pre-filled into the Requirements field automatically — so you always know what they're asking about.)

---

## 🛡️ Spam protection
- Formspree's built-in bot filter is on by default.
- The site also appends a honeypot-free setup (`_captcha: false` because Formspree's own filter handles it). If you ever get spam, flip on Formspree's CAPTCHA in your form's settings — no code change needed.

## 💸 Limits & upgrading
- **Free:** 50 submissions/month.
- **Paid ($10/mo):** unlimited submissions + auto-reply emails.
Only worth upgrading once quote volume takes off.

## 🧪 Preview mode
Until you paste an endpoint, submitting the form shows a toast:
*"Form is in preview mode — connect it in js/config.js to receive emails."*
Nothing is sent and nothing breaks — safe to demo to the client as-is.
