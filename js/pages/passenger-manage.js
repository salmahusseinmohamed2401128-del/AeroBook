/* Passenger — retrieve & manage a booking */
(() => {
  const { $, $$, fmt } = UI;

  const DETAILS = {
    Y8E3RT: { no: 'AB905', from: 'CAI', to: 'JFK', dep: '2026-12-18T11:00', arr: '2026-12-18T16:45', dur: 645, seat: '31A', status: 'Confirmed', meal: 'Halal', extras: 'Extra baggage (1 × 23 kg)', locked: false },
    K7M2QX: { no: 'AB101', from: 'CAI', to: 'DXB', dep: '2026-10-22T08:15', arr: '2026-10-22T12:50', dur: 215, seat: '14C', status: 'Checked in', meal: 'Standard', extras: 'None', locked: true }
  };

  function load(ref, scroll = true) {
    const d = DETAILS[ref];
    if (!d) return false;
    $('#booking').hidden = false;
    $('#d-ref').textContent = ref;
    $('#d-status').innerHTML = UI.badge(d.status);
    $('#d-dep').textContent = fmt.time(d.dep);
    $('#d-arr').textContent = fmt.time(d.arr);
    $('#d-from').textContent = `${d.from} · ${DB.airport(d.from).city}`;
    $('#d-to').textContent = `${d.to} · ${DB.airport(d.to).city}`;
    $('#d-dur').textContent = fmt.duration(d.dur);
    $('#d-no').textContent = d.no;
    $('#d-date').textContent = new Date(d.dep).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    $('#d-seat').textContent = d.seat;
    $('#st-cur').textContent = d.seat;
    $('#d-meal').textContent = d.meal;
    $('#d-extras').textContent = d.extras;
    $('#locked-alert').hidden = !d.locked;
    $$('#actions button').forEach(b => (b.disabled = d.locked));
    UI.icons();
    if (scroll) $('#booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  $('#retrieve-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const ref = $('#m-ref').value.trim().toUpperCase();
    const last = $('#m-last').value.trim().toLowerCase();
    const ok = last === 'hussam' && load(ref);
    $('#m-err').hidden = ok;
  });
  $$('[data-load]').forEach(b => b.addEventListener('click', () => load(b.dataset.load)));

  // Seat map inside the change-seat modal
  $('#st-legend').innerHTML = SeatMap.legend();
  SeatMap.render($('#st-map'), {
    mode: 'select',
    onSelect: (s) => ($('#st-new').innerHTML = `New seat <strong class="mono">${s.id}</strong> · ${s.price ? `+${fmt.money(s.price)}` : 'no charge'}`)
  });

  const pre = new URLSearchParams(location.search).get('ref');
  load(pre && DETAILS[pre] ? pre : 'Y8E3RT', false);
})();
