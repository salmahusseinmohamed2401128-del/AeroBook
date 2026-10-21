/* Admin — manage flights (UI only; nothing is persisted) */
(() => {
  const { $, fmt } = UI;
  let editing = null;
  let cancelling = null;

  // Populate selects
  const airportOpts = DB.airports.map(a => `<option value="${a.code}">${a.code} — ${a.city}</option>`).join('');
  $('#fm-from').innerHTML = airportOpts;
  $('#fm-to').innerHTML = airportOpts;
  $('#fm-ac').innerHTML = DB.aircraft.map(a => `<option value="${a.reg}">${a.reg} · ${a.type}</option>`).join('');
  $('#f-aircraft').innerHTML += DB.aircraft.map(a => `<option value="${a.reg}">${a.reg}</option>`).join('');

  function render() {
    const q = $('#f-q').value.trim().toLowerCase();
    const st = $('#f-status').value;
    const ac = $('#f-aircraft').value;
    const rows = DB.flights.filter(f =>
      (!q || `${f.no} ${f.from} ${f.to}`.toLowerCase().includes(q)) && (!st || f.status === st) && (!ac || f.aircraft === ac));

    $('#flight-rows').innerHTML = rows.map(f => {
      const ac = DB.aircraft.find(a => a.reg === f.aircraft);
      const cancelled = f.status === 'Cancelled';
      return `
        <tr>
          <td class="mono fw-600">${f.no}</td>
          <td><span class="mono">${f.from} → ${f.to}</span><span class="table-sub">${DB.airport(f.from).city} – ${DB.airport(f.to).city}</span></td>
          <td class="mono">${fmt.dateTime(f.dep)}</td>
          <td class="mono">${fmt.dateTime(f.arr)}</td>
          <td>${f.aircraft}<span class="table-sub">${ac ? ac.type : ''}</span></td>
          <td class="num">${f.booked}/${f.capacity}</td>
          <td>${UI.badge(f.status)}</td>
          <td><div class="row-actions">
            <button class="btn btn-ghost btn-icon btn-sm" aria-label="Edit ${f.no}" data-edit="${f.no}" ${cancelled ? 'disabled' : ''}><i data-lucide="pencil" class="icon-sm"></i></button>
            <a class="btn btn-ghost btn-icon btn-sm" aria-label="View change log for ${f.no}" href="change-log.html?flight=${f.no}"><i data-lucide="history" class="icon-sm"></i></a>
            <button class="btn btn-ghost btn-icon btn-sm" aria-label="Cancel ${f.no}" data-cancel="${f.no}" ${cancelled ? 'disabled' : ''} style="color:var(--c-danger)"><i data-lucide="ban" class="icon-sm"></i></button>
          </div></td>
        </tr>`;
    }).join('') || `<tr><td colspan="8"><div class="empty"><span class="empty-icon"><i data-lucide="plane"></i></span>No flights match these filters.</div></td></tr>`;
    UI.icons();
  }

  ['#f-q', '#f-status', '#f-aircraft'].forEach(s => $(s).addEventListener('input', render));

  function capTotal() {
    $('#cap-total').textContent = ['#cap-j', '#cap-w', '#cap-y'].reduce((s, id) => s + Number($(id).value || 0), 0);
  }
  ['#cap-j', '#cap-w', '#cap-y'].forEach(s => $(s).addEventListener('input', capTotal));

  function openForm(flight) {
    editing = flight || null;
    $('#fm-title').textContent = flight ? `Edit flight ${flight.no}` : 'Create flight';
    $('#fm-save').textContent = flight ? 'Save changes' : 'Create flight';
    $('#edit-impact').hidden = !(flight && flight.booked);
    $('#impact-count').textContent = flight ? flight.booked : 0;
    $('#fm-no').value = flight ? flight.no : '';
    $('#fm-no').readOnly = !!flight;
    $('#fm-from').value = flight ? flight.from : 'CAI';
    $('#fm-to').value = flight ? flight.to : 'DXB';
    $('#fm-dep').value = flight ? flight.dep : '2026-11-02T09:00';
    $('#fm-arr').value = flight ? flight.arr : '2026-11-02T13:35';
    $('#fm-ac').value = flight ? flight.aircraft : 'SU-ABB';
    document.querySelectorAll('#flight-form .field').forEach(f => f.classList.remove('has-error'));
    UI.openModal('flight-modal');
  }

  function validate() {
    let ok = true;
    const from = $('#fm-from').value, to = $('#fm-to').value;
    const dep = $('#fm-dep').value, arr = $('#fm-arr').value;
    const ac = $('#fm-ac').value;

    $('#fld-to').classList.toggle('has-error', from === to);
    if (from === to) ok = false;

    const badTime = dep && arr && new Date(arr) <= new Date(dep);
    $('#fld-arr').classList.toggle('has-error', !!badTime);
    if (badTime) ok = false;

    // Overlap check against other flights using the same aircraft
    const clash = DB.flights.find(f => f.aircraft === ac && f.status !== 'Cancelled' && (!editing || f.no !== editing.no) &&
      new Date(dep) < new Date(f.arr) && new Date(arr) > new Date(f.dep));
    $('#fld-ac').classList.toggle('has-error', !!clash);
    if (clash) { $('#ac-msg').textContent = `${ac} is already assigned to ${clash.no} (${fmt.dateTime(clash.dep)}–${fmt.time(clash.arr)}).`; ok = false; }

    return ok;
  }
  ['#fm-from', '#fm-to', '#fm-dep', '#fm-arr', '#fm-ac'].forEach(s => $(s).addEventListener('change', validate));

  $('#flight-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      const first = document.querySelector('#flight-form .has-error select, #flight-form .has-error input');
      if (first) first.focus();
      return;
    }
    UI.closeModal('flight-modal');
    UI.toast(editing
      ? `${editing.no} updated. ${editing.booked} passengers will be notified within 5 minutes.`
      : `Flight ${$('#fm-no').value || 'AB???'} created and logged.`);
  });

  $('#new-flight-btn').addEventListener('click', () => openForm(null));

  document.addEventListener('click', (e) => {
    const ed = e.target.closest('[data-edit]');
    if (ed) openForm(DB.flight(ed.dataset.edit));

    const cn = e.target.closest('[data-cancel]');
    if (cn) {
      cancelling = DB.flight(cn.dataset.cancel);
      $('#cm-no').textContent = cancelling.no;
      $('#cm-route').textContent = `${cancelling.from} → ${cancelling.to} · ${fmt.dateTime(cancelling.dep)}`;
      $('#cm-pax').textContent = cancelling.booked;
      $('#cm-confirm').checked = false;
      $('#cm-go').disabled = true;
      UI.openModal('cancel-modal');
    }
  });
  $('#cm-confirm').addEventListener('change', (e) => ($('#cm-go').disabled = !e.target.checked));
  $('#cm-go').addEventListener('click', () => {
    cancelling.status = 'Cancelled';
    UI.closeModal('cancel-modal');
    render();
    UI.toast(`${cancelling.no} cancelled. ${cancelling.booked} passengers notified with rebooking/refund options.`);
  });

  render();
  if (new URLSearchParams(location.search).get('new')) openForm(null);
})();
