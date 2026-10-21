/* Passenger — online check-in flow & boarding pass */
(() => {
  const { $, $$ } = UI;
  let step = 1, seat = null;

  function show(n) {
    step = n;
    $$('[data-ci]').forEach(c => (c.hidden = +c.dataset.ci !== n));
    $$('#ci-stepper li').forEach((li, i) => { li.classList.toggle('done', i + 1 < n); li.classList.toggle('current', i + 1 === n); });
  }

  // Required checkboxes gate the Continue button
  $$('.ci-req').forEach(cb => cb.addEventListener('change', () => {
    cb.closest('[data-ci]').querySelector('[data-ci-next]').disabled = !cb.checked;
  }));

  $('#start-checkin').addEventListener('click', () => {
    $('#flow').hidden = false;
    $('#pass').hidden = true;
    show(1);
    $('#flow').scrollIntoView({ behavior: 'smooth' });
  });

  document.addEventListener('click', (e) => {
    const next = e.target.closest('[data-ci-next]');
    if (next && !next.disabled) {
      if (step === 3) {
        if (next.hasAttribute('data-free')) seat = '23B';
        if (!seat) { UI.toast('Pick a seat or choose “Assign me a free seat”.', 'warning'); return; }
        issuePass({ no: 'AB510', ref: 'D3F8KW', from: 'CAI', to: 'IST', date: '22 OCT', seat, gate: 'D9', board: '17:05' });
        $('#flow').hidden = true;
        UI.toast('Check-in complete');
        return;
      }
      show(step + 1);
    }
    if (e.target.closest('[data-ci-back]')) show(step - 1);
    if (e.target.closest('[data-ci-cancel]')) $('#flow').hidden = true;
  });

  $('#ci-legend').innerHTML = SeatMap.legend();
  SeatMap.render($('#ci-map'), {
    mode: 'select',
    onSelect: (s) => { seat = s.id; $('#ci-seat').textContent = `Seat ${s.id} · ${s.price ? '$' + s.price : 'Free'}`; }
  });

  function issuePass(p) {
    $('#bp-no').textContent = p.no;
    $('#bp-ref').textContent = p.ref;
    $('#bp-from').textContent = p.from;
    $('#bp-to').textContent = p.to;
    $('#bp-from-city').textContent = DB.airport(p.from).city;
    $('#bp-to-city').textContent = DB.airport(p.to).city;
    $('#bp-date').textContent = p.date;
    $('#bp-seat').textContent = p.seat;
    $('#bp-gate').textContent = p.gate;
    $('#bp-board').textContent = p.board;
    $('#bp-barcode').innerHTML = UI.barcode(`${p.ref}${p.no}${p.seat}`);
    $('#bp-qr').innerHTML = UI.qr(`${p.ref}${p.no}${p.seat}`);
    $('#pass').hidden = false;
    UI.icons();
    $('#pass').scrollIntoView({ behavior: 'smooth' });
  }

  $('#show-pass').addEventListener('click', () => {
    $('#flow').hidden = true;
    issuePass({ no: 'AB101', ref: 'K7M2QX', from: 'CAI', to: 'DXB', date: '22 OCT', seat: '14C', gate: 'B12', board: '07:35' });
  });
})();
