/* Staff — publish flight status changes */
(() => {
  const { $, $$, fmt } = UI;
  const STATUSES = ['On time', 'Delayed', 'Boarding', 'Gate changed', 'Departed', 'Arrived', 'Cancelled'];
  let flight = null;

  function render() {
    $('#status-rows').innerHTML = DB.flights.map(f => `
      <tr>
        <td class="mono fw-600">${f.no}</td>
        <td>${f.from} → ${f.to}</td>
        <td class="mono">${fmt.dateTime(f.dep)}${f.newTime ? `<span class="table-sub text-warning">Now ${fmt.time(f.newTime)}</span>` : ''}</td>
        <td class="mono">${f.gate}</td>
        <td class="num">${f.booked}</td>
        <td>${UI.badge(f.status)}</td>
        <td class="num"><button class="btn btn-outline btn-sm" data-update="${f.no}"><i data-lucide="radio-tower" class="icon-sm"></i>Update</button></td>
      </tr>`).join('');
    UI.icons();
  }

  $('#sm-options').innerHTML = STATUSES.map(s => `
    <label class="option"><input type="radio" name="st" value="${s}"><span class="opt-body" style="padding:12px">${UI.badge(s)}</span></label>`).join('');


  document.addEventListener('click', (e) => {
    const u = e.target.closest('[data-update]');
    if (!u) return;
    flight = DB.flight(u.dataset.update);
    $('#sm-no').textContent = flight.no;
    $('#sm-route').textContent = `${DB.airport(flight.from).city} → ${DB.airport(flight.to).city} · ${fmt.dateTime(flight.dep)} · Gate ${flight.gate}`;
    $('#sm-pax').textContent = flight.booked;
    $$('input[name="st"]').forEach(i => (i.checked = i.value === flight.status));
    $('#sm-newtime').value = flight.newTime || flight.dep;
    $('#sm-newgate').value = '';
    toggle();
    UI.openModal('status-modal');
  });

  function toggle() {
    const v = ($('input[name="st"]:checked') || {}).value;
    $('#sm-delay').hidden = v !== 'Delayed';
    $('#sm-gate').hidden = v !== 'Gate changed';
  }
  $('#sm-options').addEventListener('change', toggle);

  $('#sm-save').addEventListener('click', () => {
    const v = $('input[name="st"]:checked').value;
    if (v === 'Gate changed' && !$('#sm-newgate').value.trim()) { $('#sm-newgate').focus(); UI.toast('Enter the new gate', 'error'); return; }
    if (v === 'Gate changed') { flight.oldGate = flight.gate; flight.gate = $('#sm-newgate').value.trim().toUpperCase(); }
    if (v === 'Delayed') flight.newTime = $('#sm-newtime').value;
    flight.status = v;
    UI.closeModal('status-modal');
    render();
    UI.toast(`${flight.no} is now “${v}”. ${flight.booked} passengers notified by email, SMS & push.`);
  });

  render();
})();
