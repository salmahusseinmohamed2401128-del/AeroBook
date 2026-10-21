/* Staff — counter check-in */
(() => {
  const { $, $$ } = UI;
  const active = DB.bookings.filter(b => !b.status.startsWith('Cancelled') && b.paid);
  let current = null;

  $('#q-flight').innerHTML = [...new Set(active.map(b => b.flight))].map(f => `<option>${f}</option>`).join('');

  function rows(list) {
    $('#match-rows').innerHTML = list.map(b => `
      <tr>
        <td class="mono fw-600">${b.ref}</td>
        <td>${b.pax}</td>
        <td class="mono">${b.passport}</td>
        <td><span class="mono">${b.flight}</span><span class="table-sub">${b.route}</span></td>
        <td class="mono">${b.seat}</td>
        <td>${b.checkedIn ? '<span class="badge badge-warning"><i data-lucide="smartphone" class="icon-sm"></i>Checked in online</span>' : '<span class="badge">Not checked in</span>'}</td>
        <td class="num"><button class="btn btn-outline btn-sm" data-open-pax="${b.ref}">Open</button></td>
      </tr>`).join('') || `<tr><td colspan="7"><div class="empty"><span class="empty-icon"><i data-lucide="user-x"></i></span>No booking found. Check the details and try again.</div></td></tr>`;
    UI.icons();
  }

  $('#find-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const tab = $('[role="tab"][aria-selected="true"]').id;
    let list = active;
    if (tab === 'ts-ref') list = active.filter(b => b.ref === $('#q-ref').value.trim().toUpperCase());
    if (tab === 'ts-pass') list = active.filter(b => b.passport === $('#q-pass').value.trim().toUpperCase());
    if (tab === 'ts-name') list = active.filter(b => b.lastName.toLowerCase() === $('#q-name').value.trim().toLowerCase() && b.flight === $('#q-flight').value);
    $('#match-sub').textContent = `${list.length} result${list.length === 1 ? '' : 's'}`;
    rows(list);
    if (list.length === 1) openPax(list[0]);
  });

  function openPax(b) {
    current = b;
    const [first, ...rest] = b.pax.split(' ');
    const docName = `${rest.join(' ').toUpperCase()}/${first.toUpperCase()}`;
    const f = DB.flight(b.flight);
    $('#pax-panel').hidden = false;
    $('#pp-name').textContent = b.pax;
    $('#pp-sub').textContent = `${b.ref} · ${b.flight} ${b.route} · ${b.fare}`;
    $('#pp-badge').innerHTML = b.checkedIn ? UI.badge('Checked in') : '<span class="badge">Not checked in</span>';
    $('#pp-docname').textContent = docName;
    $('#pp-passport').textContent = b.passport;
    $('#dup-alert').hidden = !b.checkedIn;
    $$('.doc-req').forEach(c => { c.checked = b.checkedIn; c.disabled = b.checkedIn; });
    $('#do-checkin').disabled = true;
    $('#do-checkin').hidden = b.checkedIn;
    $('#print-bp').disabled = !b.checkedIn;

    $('#mbp-name').textContent = docName;
    $('#mbp-no').textContent = b.flight;
    $('#mbp-from').textContent = b.route.slice(0, 3);
    $('#mbp-to').textContent = b.route.slice(-3);
    $('#mbp-seat').textContent = b.seat === '—' ? 'TBA' : b.seat;
    $('#mbp-gate').textContent = f ? f.gate : '—';
    $('#mbp-cabin').textContent = b.fare.split(' ')[0].toUpperCase();
    $('#mbp-barcode').innerHTML = UI.barcode(b.ref + b.flight);
    UI.icons();
    $('#pax-panel').scrollIntoView({ behavior: 'smooth' });
  }

  $$('.doc-req').forEach(c => c.addEventListener('change', () => {
    $('#do-checkin').disabled = !$$('.doc-req').every(x => x.checked);
  }));

  $('#do-checkin').addEventListener('click', () => {
    current.checkedIn = true;
    $('#pp-badge').innerHTML = UI.badge('Checked in');
    $('#do-checkin').hidden = true;
    $('#print-bp').disabled = false;
    UI.icons();
    UI.toast(`${current.pax} checked in — boarding pass ready to print`);
  });
  $('#close-pax').addEventListener('click', () => ($('#pax-panel').hidden = true));

  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open-pax]');
    if (o) openPax(active.find(b => b.ref === o.dataset.openPax));
  });

  rows(active);
})();
