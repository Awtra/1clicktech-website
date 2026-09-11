# ✉️ Quote Form → Email (FormSubmit.co)

The "Request My Quote" form at the bottom of the site sends submissions straight
to the inbox configured in `js/config.js`:

```js
FORM_EMAIL: "farhana@1clktech.com",
```

No account, no API key — FormSubmit.co just forwards the form POST.

## ⚠️ One-time activation (important)
The very first time the form is submitted, FormSubmit.co sends an **activation
email** to the address above. Until someone clicks **Activate** in that email,
submissions are NOT delivered.

1. Deploy the site with `FORM_EMAIL` set.
2. Open the live site, submit the quote form once (test submission).
3. Have Farhana check her inbox (and **spam/junk**) for the activation email
   from FormSubmit.co → click **Activate**.
4. Done — every quote request now arrives as a clean table email:
   Name, Email, Company, Phone, Requirements, and the product name if the
   visitor clicked "Request Pricing" on a category card.

After activation, test again to confirm delivery. If emails are slow, check
spam once more; you can also mark the sender as trusted.

## Prefer Formspree instead?
Formspree gives you a dashboard and 50 free submissions/month. Create a free
form at https://formspree.io, then paste its endpoint into `FORMSPREE_ENDPOINT`
in `js/config.js` (it takes priority over `FORM_EMAIL`). Same activation idea:
Formspree emails you to confirm the form's inbox.
