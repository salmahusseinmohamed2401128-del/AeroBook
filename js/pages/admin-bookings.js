/* Admin — bookings overview */
(() => {
  const { $, fmt } = UI;

  // Per-flight seat cards
  $('#occupancy-cards').innerHTML = DB.flights.filter(f => f.status !== 'Arrived' && f.status !== 'Departed').slice(0, 6).map(f => `
    <div class="card card-body">
      <div class="flex justify-between items-center">
        <div><div class="mono fw-600">${f.no}</div><div class="text-sm text-3">${f.from} → ${f.to} · ${fmt.dateTime(f.dep)}</div></div>
        ${UI.badge(f.status)}
      </div>
      <div class="grid grid-3 mt-4 text-center" style="gap:8px">
        <div><div class="text-xs text-3">Total seats</div><div class="fw-600 num text-lg">${f.capacity}</div></div>
        <div><div class="text-xs text-3">Booked</div><div class="fw-600 num text-lg">${f.booked}</div></div>
        <div><div class="text-xs text-3">Checked in</div><div class="fw-600 num text-lg">${f.checkedIn}</div></div>
      </div>
      <div class="progress stacked mt-4" title="${f.checkedIn} checked in · ${f.booked} booked · ${f.capacity} total">
        <span class="seg-checked" style="width:${(f.checkedIn / f.capacity) * 100}%"></span>
        <span class="seg-booked" style="width:${((f.booked - f.checkedIn) / f.capacity) * 100}%"></span>
      </div>
    </div>`).join('');

  // Filter options
  const flights = [...new Set(DB.bookings.map(b => b.flight))];
  const routes = [...new Set(DB.bookings.map(b => b.route))];
  $('#b-flight').innerHTML += flights.map(f => `<option>${f}</option>`).join('');
  $('#b-route').innerHTML += routes.map(r => `<option>${r}</option>`).join('');

  function render() {
    const fl = $('#b-flight').value, rt = $('#b-route').value, q = $('#b-q').value.trim().toLowerCase();
    const from = $('#b-from').value, to = $('#b-to').value;
    const rows = DB.bookings.filter(b =>
      (!fl || b.flight === fl) && (!rt || b.route === rt) &&
      (!from || b.date >= from) && (!to || b.date <= to) &&
      (!q || `${b.ref} ${b.pax}`.toLowerCase().includes(q)));

    $('#booking-rows').innerHTML = rows.map(b => `
      <tr>
        <td class="mono fw-600">${b.ref}</td>
        <td>${b.pax}</td>
        <td class="mono">${b.flight}</td>
        <td>${b.route}</td>
        <td>${fmt.date(b.date)}</td>
        <td>${b.fare}</td>
        <td class="mono">${b.seat}</td>
        <td class="num">${fmt.money(b.total)}</td>
        <td>${UI.badge(b.status)}</td>
      </tr>`).join('') || `<tr><td colspan="9"><div class="empty"><span class="empty-icon"><i data-lucide="ticket"></i></span>No bookings match these filters.<button class="btn btn-outline btn-sm" onclick="document.getElementById('b-reset').click()">Clear filters</button></div></td></tr>`;
    $('#b-count').textContent = `Showing ${rows.length} of ${DB.bookings.length} bookings`;
    UI.icons();
  }

  ['#b-flight', '#b-route', '#b-from', '#b-to', '#b-q'].forEach(s => $(s).addEventListener('input', render));
  $('#b-reset').addEventListener('click', () => {
    $('#b-flight').value = ''; $('#b-route').value = ''; $('#b-q').value = '';
    $('#b-from').value = '2026-10-21'; $('#b-to').value = '2026-10-31';
    render();
  });
  render();
})();
