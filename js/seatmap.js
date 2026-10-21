/* ==========================================================================
   AeroBook — interactive seat map (visual only)
   SeatMap.render(container, options)
     options.mode      'select' (passenger) | 'staff' (move passengers)
     options.occupied  array of seat ids that are taken
     options.manifest  [{ seat, name, ssr }] (staff mode)
     options.selected  pre-selected seat id
     options.onSelect  (seatInfo) => void
   ========================================================================== */

const SeatMap = (() => {
  const LAYOUT = {
    cabins: [
      { name: 'Business', cls: 'business', rows: [1, 3], cols: ['A', 'C', '|', 'D', 'F'], price: 0 },
      { name: 'Economy', cls: 'economy', rows: [4, 26], cols: ['A', 'B', 'C', '|', 'D', 'E', 'F'], price: 12 }
    ],
    premiumRows: [4, 5, 6],
    exitRows: [12, 13],
    prices: { standard: 12, premium: 35, exit: 45 }
  };

  // Deterministic "random" occupancy so the map looks realistic but stable
  function defaultOccupied() {
    const taken = [];
    let s = 7;
    LAYOUT.cabins.forEach(c => {
      for (let r = c.rows[0]; r <= c.rows[1]; r++) {
        c.cols.forEach(col => {
          if (col === '|') return;
          s = (s * 9301 + 49297) % 233280;
          if (s / 233280 < 0.55) taken.push(`${r}${col}`);
        });
      }
    });
    return taken;
  }

  function seatInfo(row, col, cabin) {
    const id = `${row}${col}`;
    const exit = LAYOUT.exitRows.includes(row);
    const premium = LAYOUT.premiumRows.includes(row);
    let type = cabin.cls === 'business' ? 'business' : exit ? 'exit' : premium ? 'premium' : 'standard';
    const price = type === 'business' ? 0 : LAYOUT.prices[type];
    return { id, row, col, cabin: cabin.name, type, exit, price };
  }

  function render(container, opts = {}) {
    const mode = opts.mode || 'select';
    const manifest = opts.manifest || [];
    const occupied = new Set(opts.occupied || defaultOccupied());
    manifest.forEach(p => occupied.add(p.seat));
    let selected = opts.selected || null;

    const html = [`<div class="seatmap-scroll"><div class="fuselage" role="grid" aria-label="Aircraft seat map">`];
    LAYOUT.cabins.forEach(cabin => {
      const tmpl = cabin.cols.map(c => (c === '|' ? 'var(--aisle-w)' : cabin.cls === 'business' ? 'var(--seat-wb)' : 'var(--seat-w)')).join(' ');
      html.push(`<div class="cabin-label"><i data-lucide="${cabin.cls === 'business' ? 'crown' : 'armchair'}" class="icon-sm"></i>${cabin.name}</div>`);
      html.push(`<div class="seat-cols" style="grid-template-columns:${tmpl}">${cabin.cols.map(c => `<span>${c === '|' ? '' : c}</span>`).join('')}</div>`);
      for (let r = cabin.rows[0]; r <= cabin.rows[1]; r++) {
        const exitRow = LAYOUT.exitRows.includes(r);
        html.push(`<div class="seat-row ${exitRow ? 'exit-row' : ''}" role="row" style="grid-template-columns:${tmpl}">`);
        cabin.cols.forEach(col => {
          if (col === '|') { html.push(`<span class="row-no" aria-hidden="true">${r}</span>`); return; }
          const s = seatInfo(r, col, cabin);
          const pax = manifest.find(p => p.seat === s.id);
          const taken = occupied.has(s.id);
          const classes = ['seat', s.type === 'business' ? 'business' : '', s.type === 'premium' ? 'premium' : '', s.exit ? 'exit' : '', taken ? 'occupied' : '',
            pax && mode === 'staff' ? 'pickable' : '', pax && pax.ssr.length ? 'ssr' : ''].filter(Boolean).join(' ');
          const label = `Seat ${s.id}, ${s.cabin}${s.exit ? ', exit row' : ''}, ${taken ? (pax && mode === 'staff' ? 'occupied by ' + pax.name : 'occupied') : (s.price ? '$' + s.price : 'included')}`;
          const disabled = taken && !(pax && mode === 'staff');
          const text = pax && mode === 'staff' ? pax.name.split(' ').map(n => n[0]).join('') : col;
          html.push(`<button type="button" role="gridcell" class="${classes}" data-seat="${s.id}" aria-label="${label}" aria-pressed="${selected === s.id}" ${disabled ? 'disabled' : ''} title="${label}">${text}</button>`);
        });
        html.push(`</div>`);
      }
    });
    html.push(`</div></div>`);

    container.innerHTML = html.join('');
    UI.icons();

    container.onclick = (e) => {
      const btn = e.target.closest('.seat');
      if (!btn || btn.disabled) return;
      const id = btn.dataset.seat;
      const row = parseInt(id, 10);
      const col = id.replace(String(row), '');
      const cabin = LAYOUT.cabins.find(c => row >= c.rows[0] && row <= c.rows[1]);
      const info = seatInfo(row, col, cabin);
      info.passenger = manifest.find(p => p.seat === id) || null;
      info.occupied = btn.classList.contains('occupied');

      if (mode === 'select') {
        container.querySelectorAll('.seat[aria-pressed="true"]').forEach(s => s.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        selected = id;
      }
      if (opts.onSelect) opts.onSelect(info, btn);
    };

    return { layout: LAYOUT };
  }

  function legend(extra = []) {
    const items = [
      ['available', 'Available'], ['premium', 'Extra legroom'], ['exit', 'Exit row'],
      ['business', 'Business'], ['occupied', 'Occupied'], ['selected', 'Selected'], ...extra
    ];
    return `<div class="seatmap-legend">${items.map(([c, l]) => `<span class="lg"><span class="sw ${c}"></span>${l}</span>`).join('')}</div>`;
  }

  return { render, legend, LAYOUT };
})();
