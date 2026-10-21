/* ==========================================================================
   AeroBook — UI helpers (icons, toasts, modals, tabs, formatting)
   Purely presentational: nothing here talks to a server.
   ========================================================================== */

const UI = (() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------- Icons (Lucide) ---------- */
  function icons() {
    if (window.lucide) window.lucide.createIcons();
  }

  /* ---------- Formatting ---------- */
  const fmt = {
    money: (n, cur = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n),
    money2: (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n),
    date: (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    dateShort: (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    time: (iso) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    dateTime: (iso) => `${fmt.dateShort(iso)} · ${fmt.time(iso)}`,
    duration: (min) => `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}m`,
    num: (n) => new Intl.NumberFormat('en-US').format(n)
  };

  /* ---------- Status badges ---------- */
  const STATUS = {
    'On time': ['success', 'circle-check'],
    'Delayed': ['warning', 'clock'],
    'Boarding': ['info', 'door-open'],
    'Gate changed': ['accent', 'arrow-left-right'],
    'Departed': ['primary', 'plane-takeoff'],
    'Arrived': ['success', 'plane-landing'],
    'Cancelled': ['danger', 'circle-x'],
    'Cancelled by airline': ['danger', 'circle-x'],
    'Confirmed': ['success', 'check'],
    'Checked in': ['info', 'badge-check'],
    'Completed': ['', 'check'],
    'Pending payment': ['warning', 'hourglass'],
    'Active': ['success', 'circle-check'],
    'Expired': ['', 'circle-slash'],
    'Scheduled': ['info', 'calendar-clock'],
    'Loaded': ['primary', 'package-check'],
    'Transferred': ['info', 'repeat'],
    'Missing': ['danger', 'search-x'],
    'Security screened': ['info', 'scan-line']
  };
  function badge(status) {
    const [tone, icon] = STATUS[status] || ['', 'circle'];
    return `<span class="badge ${tone ? 'badge-' + tone : ''}"><i data-lucide="${icon}" class="icon-sm"></i>${status}</span>`;
  }

  /* ---------- Toasts ---------- */
  let region;
  function toast(message, type = 'success') {
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    const icon = { success: 'circle-check', error: 'circle-alert', info: 'info', warning: 'triangle-alert' }[type];
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i data-lucide="${icon}" class="t-icon"></i><div>${message}</div>`;
    region.appendChild(el);
    icons();
    setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 160); }, 3800);
  }

  /* ---------- Modals (native <dialog>) ---------- */
  function openModal(id) {
    const d = document.getElementById(id);
    if (d && !d.open) { d.showModal(); icons(); }
  }
  function closeModal(id) {
    const d = typeof id === 'string' ? document.getElementById(id) : id;
    if (d && d.open) d.close();
  }

  /* ---------- Tabs ---------- */
  function initTabs(root = document) {
    $$('[role="tablist"]', root).forEach(list => {
      const tabs = $$('[role="tab"]', list);
      const select = (tab) => {
        tabs.forEach(t => {
          const on = t === tab;
          t.setAttribute('aria-selected', on);
          t.tabIndex = on ? 0 : -1;
          const panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.hidden = !on;
        });
        list.dispatchEvent(new CustomEvent('tabchange', { detail: tab }));
      };
      tabs.forEach((t, i) => {
        t.addEventListener('click', () => select(t));
        t.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
            next.focus(); select(next);
          }
        });
      });
    });
  }

  /* ---------- Decorative barcode / QR (visual only) ---------- */
  function hash(str) {
    let h = 2166136261;
    for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
  }
  function barcode(text) {
    const rnd = hash(text);
    let x = 0, bars = '';
    while (x < 300) {
      const w = 1 + Math.floor(rnd() * 3);
      bars += `<rect x="${x}" y="0" width="${w}" height="56" fill="currentColor"/>`;
      x += w + 1 + Math.floor(rnd() * 3);
    }
    return `<svg viewBox="0 0 300 56" preserveAspectRatio="none" role="img" aria-label="Barcode ${text}">${bars}</svg>`;
  }
  function qr(text) {
    const n = 25, rnd = hash(text);
    let cells = '';
    const finder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (finder(r, c)) continue;
      if (rnd() > 0.52) cells += `<rect x="${c}" y="${r}" width="1" height="1"/>`;
    }
    const f = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
    return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" fill="#0F172A" role="img" aria-label="Mobile boarding pass code">${f(0, 0)}${f(n - 7, 0)}${f(0, n - 7)}${cells}</svg>`;
  }

  /* ---------- Simple bar chart (single series) ---------- */
  function barChart(el, data, { format = (v) => v, label = 'Value' } = {}) {
    const max = Math.max(...data.map(d => d.value)) * 1.1;
    el.innerHTML = `
      <div class="bar-chart" role="img" aria-label="${label} chart">
        ${data.map(d => `
          <div class="bar-col" tabindex="0" aria-label="${d.label}: ${format(d.value)}">
            <span class="bar-tip">${d.label} · ${format(d.value)}</span>
            <div class="bar" style="height:${(d.value / max) * 100}%"></div>
          </div>`).join('')}
      </div>
      <div class="bar-labels" aria-hidden="true">${data.map(d => `<span>${d.label}</span>`).join('')}</div>`;
  }

  /* ---------- Global delegated behaviours ---------- */
  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-open-modal]');
    if (open) { e.preventDefault(); openModal(open.dataset.openModal); }

    const close = e.target.closest('[data-close-modal]');
    if (close) { e.preventDefault(); closeModal(close.closest('dialog')); }

    const t = e.target.closest('[data-toast]');
    if (t) { toast(t.dataset.toast, t.dataset.toastType || 'success'); }

    const pr = e.target.closest('[data-print]');
    if (pr) { e.preventDefault(); window.print(); }

    // Dropdowns
    const dd = e.target.closest('[data-dropdown]');
    $$('.dropdown-menu').forEach(m => {
      if (!dd || m !== document.getElementById(dd.dataset.dropdown)) {
        if (!m.contains(e.target)) { m.hidden = true; const b = $(`[data-dropdown="${m.id}"]`); if (b) b.setAttribute('aria-expanded', 'false'); }
      }
    });
    if (dd) {
      const menu = document.getElementById(dd.dataset.dropdown);
      menu.hidden = !menu.hidden;
      dd.setAttribute('aria-expanded', String(!menu.hidden));
    }

    // Segmented toggle buttons
    const seg = e.target.closest('.segmented [aria-pressed]');
    if (seg) $$('[aria-pressed]', seg.parentElement).forEach(b => b.setAttribute('aria-pressed', String(b === seg)));

    // Counters
    const step = e.target.closest('[data-step]');
    if (step) {
      const out = step.parentElement.querySelector('output');
      const min = Number(out.dataset.min || 0), max = Number(out.dataset.max || 9);
      out.value = Math.min(max, Math.max(min, Number(out.value) + Number(step.dataset.step)));
      out.textContent = out.value;
      out.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Close dialogs on backdrop click
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'DIALOG' && e.target.classList.contains('modal')) e.target.close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') $$('.dropdown-menu').forEach(m => (m.hidden = true));
  });

  document.addEventListener('DOMContentLoaded', () => { initTabs(); icons(); });

  return { $, $$, icons, fmt, badge, toast, openModal, closeModal, initTabs, barcode, qr, barChart };
})();
