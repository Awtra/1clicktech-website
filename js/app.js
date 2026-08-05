/* ============================================================
   1ClickTech — App Engine
   Live Google Sheet catalog · cart · filters · animations
   ============================================================ */
(function () {
  "use strict";
  const CFG = window.SITE_CONFIG || {};
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const money = n => CFG.CURRENCY + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ---------- STATE ---------- */
  let PRODUCTS = [];
  let activeCat = "all";
  let searchTerm = "";
  const cart = new Map();           // key -> {product, qty}
  const wishlist = new Set();

  /* =========================================================
     1) LIVE CATALOG  (Google Sheet → CSV → products)
     ========================================================= */

  // Robust CSV parser: handles quoted fields, commas, escaped quotes, CRLF.
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", i = 0, inQ = false;
    text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    while (i < text.length) {
      const c = text[i];
      if (inQ) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQ = false; i++; continue;
        }
        field += c; i++; continue;
      }
      if (c === '"') { inQ = true; i++; continue; }
      if (c === ",") { row.push(field); field = ""; i++; continue; }
      if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += c; i++;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter(r => r.some(cell => String(cell).trim() !== ""));
  }

  // Match a sheet header to one of our known column aliases.
  function buildHeaderMap(headers) {
    const norm = h => String(h).trim().toLowerCase().replace(/\s+/g, "_");
    const map = {};
    const H = headers.map(norm);
    for (const key in CFG.COLUMNS) {
      for (const alias of CFG.COLUMNS[key]) {
        const idx = H.indexOf(norm(alias));
        if (idx !== -1) { map[key] = idx; break; }
      }
    }
    return map;
  }

  // Turn Google Drive share links into hot-linkable direct image URLs.
  function normalizeImage(url) {
    if (!url) return "";
    url = url.trim();
    // https://drive.google.com/file/d/FILEID/view?...  OR ...open?id=FILEID
    let m = url.match(/drive\.google\.com\/file\/d\/([-\w]{20,})/) ||
            url.match(/drive\.google\.com\/open\?id=([-\w]{20,})/) ||
            url.match(/[?&]id=([-\w]{20,})/);
    if (m) return "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w1000";
    return url;
  }

  function toNumber(v) {
    if (v == null) return 0;
    const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
    return isNaN(n) ? 0 : n;
  }

  function rowsToProducts(rows) {
    if (!rows.length) return [];
    const map = buildHeaderMap(rows[0]);
    if (map.name == null || map.price == null) return []; // sheet not shaped right
    const out = [];
    for (let r = 1; r < rows.length; r++) {
      const cells = rows[r];
      const name = (cells[map.name] || "").trim();
      if (!name) continue;
      const price = toNumber(cells[map.price]);
      const sale  = map.sale_price != null ? toNumber(cells[map.sale_price]) : 0;
      out.push({
        name,
        price: price || sale,
        sale_price: (sale && sale < price) ? sale : (sale && !price ? 0 : sale),
        image: normalizeImage(map.image != null ? cells[map.image] : ""),
        category: (map.category != null ? cells[map.category] : "").trim() || "Products",
        badge: (map.badge != null ? cells[map.badge] : "").trim()
      });
    }
    return out;
  }

  async function fetchSheet() {
    const url = (CFG.SHEET_CSV_URL || "").trim();
    if (!url) return null;
    // cache-bust so refresh always sees latest
    const bust = (url.includes("?") ? "&" : "?") + "_cb=" + Date.now();
    const res = await fetch(url + bust, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    const products = rowsToProducts(parseCSV(text));
    if (!products.length) throw new Error("No valid rows in sheet");
    return products;
  }

  function setSync(state, text) {
    const el = $("#syncStatus");
    if (!el) return;
    el.className = "sync-status " + (state || "");
    el.innerHTML = (state === "ok" ? '<span class="live-dot"></span>' : "") + text;
  }

  async function loadCatalog(isRefresh) {
    const grid = $("#productGrid");
    if (!isRefresh) renderSkeletons(8);
    try {
      const fromSheet = await fetchSheet();
      if (fromSheet) {
        PRODUCTS = fromSheet;
        setSync("ok", "Live · synced " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } else {
        PRODUCTS = CFG.SAMPLE_PRODUCTS.slice();
        setSync("", "Sample catalog · connect a Google Sheet to go live");
      }
    } catch (err) {
      console.warn("[1ClickTech] Sheet load failed:", err.message);
      if (!PRODUCTS.length) PRODUCTS = CFG.SAMPLE_PRODUCTS.slice();
      setSync("warn", "Showing last known catalog · retrying");
    }
    PRODUCTS.forEach((p, i) => p._id = (p.name + i).replace(/\W+/g, "").slice(0, 40) + i);
    buildFilterChips();
    renderProducts();
  }

  /* =========================================================
     2) RENDER
     ========================================================= */
  function renderSkeletons(n) {
    const grid = $("#productGrid");
    grid.innerHTML = Array.from({ length: n }).map(() => `
      <div class="skl">
        <div class="skl__media"></div>
        <div class="skl__body">
          <div class="skl__line s"></div>
          <div class="skl__line l"></div>
          <div class="skl__line m"></div>
        </div>
      </div>`).join("");
  }

  function buildFilterChips() {
    const wrap = $("#filterChips");
    const cats = [...new Set(PRODUCTS.map(p => p.category).filter(Boolean))].sort();
    wrap.innerHTML = `<button class="chip chip--filter${activeCat === "all" ? " is-active" : ""}" data-cat="all">All</button>` +
      cats.map(c => `<button class="chip chip--filter${activeCat === c ? " is-active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
    $$(".chip--filter", wrap).forEach(btn => btn.addEventListener("click", () => {
      activeCat = btn.dataset.cat;
      $$(".chip--filter", wrap).forEach(b => b.classList.toggle("is-active", b === btn));
      renderProducts();
    }));
  }

  function filtered() {
    return PRODUCTS.filter(p => {
      const catOk = activeCat === "all" || p.category === activeCat;
      const q = searchTerm.toLowerCase();
      const searchOk = !q || (p.name + " " + p.category).toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }

  function renderProducts() {
    const grid = $("#productGrid");
    const list = filtered();
    $("#catalogEmpty").hidden = list.length > 0;
    grid.innerHTML = list.map(p => {
      const onSale = p.sale_price && p.sale_price > 0 && p.sale_price < p.price;
      const now = onSale ? p.sale_price : p.price;
      const badge = p.badge || (onSale ? "Sale" : "");
      return `
      <article class="pcard" data-id="${p._id}">
        <div class="pcard__media">
          ${badge ? `<span class="pcard__sale">${esc(badge)}</span>` : ""}
          <button class="pcard__wish${wishlist.has(p._id) ? " on" : ""}" data-wish="${p._id}" aria-label="Save">
            <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
          </button>
          <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"
               onerror="this.onerror=null;this.src='assets/logo.png';this.style.padding='2.4rem';this.style.opacity='.45';" />
        </div>
        <div class="pcard__body">
          <span class="pcard__cat">${esc(p.category)}</span>
          <h3 class="pcard__title">${esc(p.name)}</h3>
          <div class="pcard__foot">
            <div class="pcard__price">
              ${onSale ? `<span class="pcard__was">${money(p.price)}</span>` : ""}
              <span class="pcard__now">${money(now)}</span>
            </div>
            <button class="pcard__add" data-add="${p._id}" aria-label="Add to cart">
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>
      </article>`;
    }).join("");

    // wire buttons
    $$("[data-add]", grid).forEach(b => b.addEventListener("click", () => addToCart(b.dataset.add)));
    $$("[data-wish]", grid).forEach(b => b.addEventListener("click", () => {
      const id = b.dataset.wish;
      wishlist.has(id) ? wishlist.delete(id) : wishlist.add(id);
      b.classList.toggle("on");
      toast(wishlist.has(id) ? "Saved to wishlist" : "Removed from wishlist");
    }));

    // staggered entrance
    requestAnimationFrame(() => {
      $$(".pcard", grid).forEach((c, i) => setTimeout(() => c.classList.add("in"), i * 55));
    });
  }

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

  /* =========================================================
     3) CART
     ========================================================= */
  function productById(id) { return PRODUCTS.find(p => p._id === id); }
  function unitPrice(p) { return (p.sale_price && p.sale_price < p.price) ? p.sale_price : p.price; }

  function addToCart(id) {
    const p = productById(id);
    if (!p) return;
    const entry = cart.get(id) || { product: p, qty: 0 };
    entry.qty++;
    cart.set(id, entry);
    updateCart(true);
    toast("Added to cart", "🛒");
    bumpCartIcon();
  }
  function changeQty(id, delta) {
    const e = cart.get(id); if (!e) return;
    e.qty += delta;
    if (e.qty <= 0) cart.delete(id); else cart.set(id, e);
    updateCart();
  }
  function removeItem(id) { cart.delete(id); updateCart(); }

  function cartCount() { let n = 0; cart.forEach(e => n += e.qty); return n; }
  function cartTotal() { let t = 0; cart.forEach(e => t += unitPrice(e.product) * e.qty); return t; }

  function bumpCartIcon() {
    const el = $("#cartCount");
    el.style.transform = "scale(1.4)";
    setTimeout(() => el.style.transform = "", 200);
  }

  function updateCart(openDrawer) {
    const count = cartCount();
    const badge = $("#cartCount");
    badge.textContent = count;
    badge.classList.toggle("show", count > 0);

    // Never wipe #cartEmpty with innerHTML="" — remove only the item rows,
    // or every updateCart after the first add crashes on a null #cartEmpty.
    const body = $("#cartBody"), foot = $("#cartFoot"), empty = $("#cartEmpty");
    $$(".cart-item", body).forEach(r => r.remove());
    if (count === 0) {
      empty.style.display = "";
      foot.hidden = true;
    } else {
      empty.style.display = "none";
      cart.forEach((e, id) => {
        const p = e.product, up = unitPrice(p);
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
          <img class="cart-item__img" src="${esc(p.image)}" alt="" onerror="this.src='assets/logo.png';this.style.opacity='.4'" />
          <div class="cart-item__info">
            <div class="cart-item__title">${esc(p.name)}</div>
            <div class="cart-item__price">${money(up)}</div>
            <div class="cart-item__qty">
              <button aria-label="Decrease">−</button>
              <span>${e.qty}</span>
              <button aria-label="Increase">+</button>
              <button class="cart-item__remove">Remove</button>
            </div>
          </div>`;
        const [dec, inc] = row.querySelectorAll(".cart-item__qty button");
        dec.addEventListener("click", () => changeQty(id, -1));
        inc.addEventListener("click", () => changeQty(id, +1));
        row.querySelector(".cart-item__remove").addEventListener("click", () => removeItem(id));
        body.appendChild(row);
      });
      foot.hidden = false;
      const total = cartTotal();
      $("#cartTotal").textContent = money(total);
      const note = $("#shipNote");
      const th = CFG.FREE_SHIP_THRESHOLD || 75;
      if (total >= th) { note.textContent = "🎉 You've unlocked FREE shipping!"; note.classList.add("free"); }
      else { note.textContent = `Add ${money(th - total)} more to unlock free shipping.`; note.classList.remove("free"); }
    }
    if (openDrawer) openCart();
  }

  // Scrim + scroll-lock are shared by the cart drawer and the mobile menu.
  function syncOverlay() {
    const anyOpen = $("#cartDrawer").classList.contains("open") || $("#navLinks").classList.contains("open");
    $("#drawerScrim").classList.toggle("open", anyOpen);
    document.body.classList.toggle("no-scroll", anyOpen);
  }
  function openCart() { closeMenu(); $("#cartDrawer").classList.add("open"); $("#cartDrawer").setAttribute("aria-hidden", "false"); syncOverlay(); }
  function closeCart() { $("#cartDrawer").classList.remove("open"); $("#cartDrawer").setAttribute("aria-hidden", "true"); syncOverlay(); }

  function openMenu() {
    $("#hamburger").classList.add("open");
    $("#hamburger").setAttribute("aria-expanded", "true");
    $("#navLinks").classList.add("open");
    $("#nav").classList.add("menu-open");   // lifts the header above the scrim
    syncOverlay();
  }
  function closeMenu() {
    $("#hamburger").classList.remove("open");
    $("#hamburger").setAttribute("aria-expanded", "false");
    $("#navLinks").classList.remove("open");
    // keep the header above the scrim until the slide-out transition ends
    setTimeout(() => { if (!$("#navLinks").classList.contains("open")) $("#nav").classList.remove("menu-open"); }, 400);
    syncOverlay();
  }

  /* =========================================================
     4) TOAST
     ========================================================= */
  let toastTimer;
  function toast(msg, ico) {
    const t = $("#toast");
    t.innerHTML = (ico ? `<span class="toast__ico">${ico}</span>` : "") + esc(msg);
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* =========================================================
     5) UI: nav, reveal, counters, tilt, cursor, progress
     ========================================================= */
  function initUI() {
    $("#year").textContent = new Date().getFullYear();

    // sticky nav shadow
    const nav = $("#nav");
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 20);
      $("#toTop").classList.toggle("show", window.scrollY > 600);
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
      $(".scroll-progress span").style.width = (p * 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // mobile menu
    const burger = $("#hamburger"), links = $("#navLinks");
    burger.addEventListener("click", () => links.classList.contains("open") ? closeMenu() : openMenu());
    $$("#navLinks a").forEach(a => a.addEventListener("click", closeMenu));
    // if the viewport grows past the mobile breakpoint with the menu open, reset it
    matchMedia("(min-width: 961px)").addEventListener("change", e => { if (e.matches) closeMenu(); });

    // cart open/close
    $("#cartToggle").addEventListener("click", openCart);
    $("#cartClose").addEventListener("click", closeCart);
    $("#drawerScrim").addEventListener("click", () => { closeCart(); closeMenu(); });
    $("#cartShopBtn").addEventListener("click", closeCart);
    document.addEventListener("keydown", e => { if (e.key === "Escape") { closeCart(); closeMenu(); } });

    // search
    const doSearch = v => { searchTerm = v; renderProducts(); };
    $("#catalogSearch").addEventListener("input", e => doSearch(e.target.value));
    $("#searchToggle").addEventListener("click", () => {
      document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => $("#catalogSearch").focus(), 500);
    });

    // category tiles -> filter + scroll
    $$("#catGrid .cat-tile").forEach(tile => tile.addEventListener("click", e => {
      const cat = tile.dataset.cat;
      const chip = $(`#filterChips .chip--filter[data-cat="${cat}"]`);
      if (chip) chip.click();
    }));

    // refresh button
    $("#refreshBtn").addEventListener("click", () => {
      const b = $("#refreshBtn"); b.classList.add("spinning");
      loadCatalog(true).finally(() => setTimeout(() => b.classList.remove("spinning"), 700));
      toast("Refreshing catalog…", "🔄");
    });

    // forms (demo — no backend)
    ["quoteForm", "newsForm"].forEach(id => {
      const f = $("#" + id); if (!f) return;
      f.addEventListener("submit", e => {
        e.preventDefault();
        f.reset();
        toast(id === "newsForm" ? "You're on the list! 🎉" : "Quote request sent — we'll reply within 1 business hour.", "✓");
      });
    });

    // reveal on scroll
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(el => io.observe(el));

    // count-up
    const counterIO = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { countUp(en.target); counterIO.unobserve(en.target); } });
    }, { threshold: 0.5 });
    $$("[data-count]").forEach(el => counterIO.observe(el));

    initTilt();
    initCursor();
  }

  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimals = (String(target).split(".")[1] || "").length;
    const dur = 1500, start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = target * eased;
      el.textContent = prefix + val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    }
    requestAnimationFrame(tick);
  }

  function initTilt() {
    const tilt = $("#heroTilt"); if (!tilt) return;
    const host = tilt.parentElement;
    let raf;
    host.addEventListener("mousemove", e => {
      const r = host.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        tilt.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateZ(0)`;
      });
    });
    host.addEventListener("mouseleave", () => { tilt.style.transform = "rotateY(0) rotateX(0)"; });
  }

  function initCursor() {
    const glow = $(".cursor-glow"); if (!glow || matchMedia("(hover:none)").matches) return;
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", e => { x = e.clientX; y = e.clientY; });
    (function loop() {
      cx += (x - cx) * 0.12; cy += (y - cy) * 0.12;
      glow.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
  }

  /* =========================================================
     6) BOOT
     ========================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    initUI();
    loadCatalog(false);
    const mins = Math.max(1, CFG.REFRESH_MINUTES || 5);
    setInterval(() => loadCatalog(true), mins * 60 * 1000);
  });
})();
