/* ============================================================
   1ClickTech — App Engine (B2B Sourcing Mode)
   Live Google Sheet catalog · category filters · RFQ prefill
   No retail mechanics: no cart, no prices, no sale badges.
   ============================================================ */
(function () {
  "use strict";
  const CFG = window.SITE_CONFIG || {};
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- STATE ---------- */
  let PRODUCTS = [];
  let activeCat = "all";
  let searchTerm = "";
  let showAll = false;              // grid collapsed until expanded

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
    let m = url.match(/drive\.google\.com\/file\/d\/([-\w]{20,})/) ||
            url.match(/drive\.google\.com\/open\?id=([-\w]{20,})/) ||
            url.match(/[?&]id=([-\w]{20,})/);
    if (m) return "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w1000";
    return url;
  }

  function rowsToProducts(rows) {
    if (!rows.length) return [];
    const map = buildHeaderMap(rows[0]);
    if (map.name == null) return []; // sheet not shaped right
    const out = [];
    for (let r = 1; r < rows.length; r++) {
      const cells = rows[r];
      const name = (cells[map.name] || "").trim();
      if (!name) continue;
      out.push({
        name,
        image: normalizeImage(map.image != null ? cells[map.image] : ""),
        category: (map.category != null ? cells[map.category] : "").trim() || "Products",
        badge: (map.badge != null ? cells[map.badge] : "").trim()
      });
    }
    return out;
  }

  // Accept ANY Google Sheets link the team pastes and turn it into CSV feeds:
  //  - regular share link  (docs.google.com/spreadsheets/d/ID/edit...) → gviz CSV (CORS-friendly), export CSV fallback
  //  - published CSV link  (...output=csv) → used as-is
  // Requires the sheet's Share setting: "Anyone with the link → Viewer".
  function sheetUrlToCsv(url) {
    url = (url || "").trim();
    if (!url) return [];
    if (/output=csv|format=csv/i.test(url)) return [url];    // already a CSV endpoint
    const m = url.match(/docs\.google\.com\/spreadsheets\/(?:u\/\d+\/)?d\/([-\w]+)/);
    if (m) {
      const gid = url.match(/[?#&]gid=(\d+)/);               // keep the specific tab if given
      const gidQ = gid ? "&gid=" + gid[1] : "";
      return [
        "https://docs.google.com/spreadsheets/d/" + m[1] + "/gviz/tq?tqx=out:csv" + gidQ,   // CORS-friendly
        "https://docs.google.com/spreadsheets/d/" + m[1] + "/export?format=csv" + gidQ      // fallback
      ];
    }
    return [url];                                            // some other CSV-ish URL: try as-is
  }
  window.__sheetUrlToCsv = sheetUrlToCsv;                    // exposed for tests

  async function fetchSheet() {
    const urls = sheetUrlToCsv(CFG.SHEET_CSV_URL);
    if (!urls.length) return null;
    let lastErr = null;
    for (const url of urls) {
      try {
        const bust = (url.includes("?") ? "&" : "?") + "_cb=" + Date.now();
        const res = await fetch(url + bust, { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const text = await res.text();
        if (/^\s*</.test(text)) throw new Error("Got HTML back (sheet not shared?)"); // login page = not public
        const products = rowsToProducts(parseCSV(text));
        if (!products.length) throw new Error("No valid rows in sheet");
        return products;
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error("No sheet URL");
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
        setSync("ok", "Inventory synced " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } else {
        PRODUCTS = CFG.SAMPLE_PRODUCTS.slice();
        setSync("", "Sample list · connect a Google Sheet to go live");
      }
    } catch (err) {
      console.warn("[1ClickTech] Sheet load failed:", err.message);
      if (!PRODUCTS.length) PRODUCTS = CFG.SAMPLE_PRODUCTS.slice();
      setSync("warn", "Showing last known list · retrying");
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

  /* Grid is collapsed by default; searching or picking a category auto-expands. */
  const COLLAPSED_COUNT = 8;
  const isBrowsingDefault = () => activeCat === "all" && !searchTerm;

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
    const collapsed = !showAll && isBrowsingDefault();
    const visible = collapsed ? list.slice(0, COLLAPSED_COUNT) : list;

    $("#catalogEmpty").hidden = list.length > 0;
    grid.classList.toggle("is-collapsed", collapsed);
    grid.innerHTML = visible.map(p => {
      const badge = p.badge && !/^(sale|featured|bestseller|new|top|hot)/i.test(p.badge) ? p.badge : "";
      return `
      <article class="pcard" data-id="${p._id}">
        <div class="pcard__media">
          ${badge ? `<span class="pcard__sale">${esc(badge)}</span>` : ""}
          <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"
               onerror="this.onerror=null;this.src='assets/logo.png';this.style.padding='2.4rem';this.style.opacity='.45';" />
        </div>
        <div class="pcard__body">
          <span class="pcard__cat">${esc(p.category)}</span>
          <h3 class="pcard__title">${esc(p.name)}</h3>
          <div class="pcard__foot pcard__foot--b2b">
            <span class="pcard__avail">Available to quote</span>
            <button class="btn btn--tiny btn--accent pcard__quote" data-quote="${p._id}">Request Pricing</button>
          </div>
        </div>
      </article>`;
    }).join("");

    // wire Request Pricing → prefill RFQ form
    $$("[data-quote]", grid).forEach(b => b.addEventListener("click", () => prefillQuote(b.dataset.quote)));

    // staggered entrance
    requestAnimationFrame(() => {
      $$(".pcard", grid).forEach((c, i) => setTimeout(() => c.classList.add("in"), i * 45));
    });

    // "Show all" button — only in the default browsing view with hidden items
    const btn = $("#showAllBtn");
    if (btn) {
      const overflow = list.length - COLLAPSED_COUNT;
      if (isBrowsingDefault() && overflow > 0) {
        btn.hidden = false;
        btn.textContent = showAll ? "Show fewer ↑" : `Show all categories (${list.length - visible.length} more) ↓`;
      } else {
        btn.hidden = true;
      }
    }
  }

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

  /* =========================================================
     3) RFQ PREFILL
     ========================================================= */
  function prefillQuote(id) {
    const p = PRODUCTS.find(x => x._id === id);
    if (!p) return;
    const ta = $("#quoteRequirements");
    if (ta) {
      const line = `${p.name} (${p.category})`;
      const existing = ta.value.trim();
      ta.value = existing && !existing.includes(line) ? existing + "\n" + line + " — qty: " : line + " — qty: ";
    }
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => { const ta2 = $("#quoteRequirements"); if (ta2) ta2.focus(); }, 600);
    toast("Added to your quote request", "📋");
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
     5) UI: nav, reveal, counters, cursor, progress
     ========================================================= */
  function initUI() {
    $("#year").textContent = new Date().getFullYear();

    // sticky nav shadow + scroll progress + back-to-top
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
    matchMedia("(min-width: 961px)").addEventListener("change", e => { if (e.matches) closeMenu(); });

    function openMenu() {
      burger.classList.add("open"); burger.setAttribute("aria-expanded", "true");
      links.classList.add("open"); nav.classList.add("menu-open");
      document.body.classList.add("no-scroll");
    }
    function closeMenu() {
      burger.classList.remove("open"); burger.setAttribute("aria-expanded", "false");
      links.classList.remove("open");
      setTimeout(() => { if (!links.classList.contains("open")) nav.classList.remove("menu-open"); }, 400);
      document.body.classList.remove("no-scroll");
    }
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

    // search
    $("#catalogSearch").addEventListener("input", e => { searchTerm = e.target.value; renderProducts(); });

    // show all / show fewer
    $("#showAllBtn").addEventListener("click", () => {
      showAll = !showAll;
      renderProducts();
      if (!showAll) document.getElementById("solutions").scrollIntoView({ behavior: "smooth" });
    });

    // quote form → email via Formspree (see config.js to connect)
    const qf = $("#quoteForm");
    if (qf) qf.addEventListener("submit", async e => {
      e.preventDefault();
      const btn = qf.querySelector("button[type=submit]");
      const endpoint = (CFG.FORMSPREE_ENDPOINT || "").trim();

      // No endpoint configured → friendly demo mode (nothing is sent)
      if (!endpoint) {
        toast("Form is in preview mode — connect it in js/config.js to receive emails.", "ℹ️");
        return;
      }

      btn.disabled = true;
      const orig = btn.innerHTML;
      btn.innerHTML = "Sending…";

      try {
        const data = new FormData(qf);
        data.append("_subject", "New quote request — 1ClickTech website");
        data.append("_template", "table");     // nicely formatted email
        data.append("_captcha", "false");      // Formspree bot filter handles spam
        const res = await fetch(endpoint, {
          method: "POST",
          body: data,
          headers: { "Accept": "application/json" }
        });
        if (res.ok) {
          qf.reset();
          toast("Quote request sent — we'll reply within 1 business day.", "✓");
        } else {
          const err = await res.json().catch(() => ({}));
          toast((err.errors || []).map(x => x.message).join(" ") || "Something went wrong — please call us instead.", "⚠️");
        }
      } catch (err) {
        toast("Couldn't reach the form service — please call +1 (484) 221-8279.", "⚠️");
      } finally {
        btn.disabled = false;
        btn.innerHTML = orig;
      }
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

    initMarquee();
    initCursor();
  }

  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimals = (String(target).split(".")[1] || "").length;
    const dur = 1500, start = performance.now();
    // Only group thousands for big numbers — years like 2016 must stay "2016", not "2,016"
    const fmt = v => v.toLocaleString("en-US", {
      minimumFractionDigits: decimals, maximumFractionDigits: decimals,
      useGrouping: target >= 10000
    });
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + fmt(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + fmt(target) + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* Marquee: constant calm speed regardless of screen size (a fixed-duration
     animation feels frantic on narrow phones). Pauses on hover, stops for
     reduced-motion users, recalibrates on resize + after fonts load. */
  function initMarquee() {
    const track = $(".marquee__track"); if (!track) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.classList.add("paused");                          // respect user preference: no motion
      return;
    }
    const calm = () => {
      const half = track.scrollWidth / 2;
      if (!half) return;
      const pxPerSec = window.innerWidth <= 560 ? 10 : 24;   // very gentle on phones
      track.style.animationDuration = (half / pxPerSec) + "s";
    };
    calm();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(calm);
    window.addEventListener("resize", calm);
    track.addEventListener("mouseenter", () => track.classList.add("paused"));
    track.addEventListener("mouseleave", () => track.classList.remove("paused"));
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
