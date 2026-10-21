/* Staff — move passengers between seats and record SSRs */
(() => {
  const { $, $$ } = UI;
  const manifest = DB.manifest.map(p => ({ ...p, ssr: [...p.ssr] }));
  let selected = null;

  // Background occupancy without the named manifest seats
  const base = [];
  let s = 11;
  for (let r = 1; r <= 26; r++) ['A', 'B', 'C', 'D', 'E', 'F'].forEach(c => {
    if (r <= 3 && (c === 'B' || c === 'E')) return;
    s = (s * 9301 + 49297) % 233280;
    if (s / 233280 < 0.45) base.push(`${r}${c}`);
  });
  const occupied = base.filter(id => !manifest.some(p => p.seat === id));

  $('#legend').innerHTML = SeatMap.legend([['occupied', 'Passenger (initials)']]);

  function draw() {
    SeatMap.render($('#seatmap'), { mode: 'staff', occupied: [...occupied], manifest, onSelect });
    if (selected) {
      const b = $(`#seatmap [data-seat="${selected.seat}"]`);
      if (b) b.classList.add('selected');
    }
    renderSSR();
  }

  function onSelect(info) {
    if (info.passenger) {
      selected = info.passenger;
      showPassenger();
      draw();
      return;
    }
    if (!selected) { UI.toast('Select a passenger first, then choose a free seat.', 'info'); return; }
    if (info.occupied) return;

    const needsHelp = selected.ssr.some(r => /Infant|Wheelchair|minor/i.test(r));
    if (info.exit && needsHelp) {
      UI.toast(`${selected.name} can't sit in exit row ${info.row} (${selected.ssr.join(', ')}).`, 'error');
      return;
    }
    const from = selected.seat;
    selected.seat = info.id;
    showPassenger();
    draw();
    UI.toast(`${selected.name} moved ${from} → ${info.id}. Seat map updated for all users.`);
  }

  function showPassenger() {
    $('#sel-empty').hidden = true;
    $('#sel-body').hidden = false;
    $('#sel-foot').hidden = false;
    $('#sel-moving').hidden = false;
    $('#sel-name').textContent = selected.name;
    $('#sel-ref').textContent = selected.ref;
    $('#sel-seat').textContent = selected.seat;
    $('#sel-av').textContent = selected.name.split(' ').map(n => n[0]).join('');
    $$('#ssr-list input').forEach(i => (i.checked = selected.ssr.some(r => r.split(' (')[0] === i.value.split(' (')[0])));
    UI.icons();
  }

  $('#ssr-save').addEventListener('click', () => {
    selected.ssr = $$('#ssr-list input:checked').map(i => i.value);
    const row = parseInt(selected.seat, 10);
    draw();
    if ([12, 13].includes(row) && selected.ssr.some(r => /Infant|Wheelchair|minor/i.test(r))) {
      UI.toast(`Warning: ${selected.name} is in an exit row — please move them before boarding.`, 'warning');
    } else {
      UI.toast(`Special service requests saved for ${selected.name}`);
    }
  });

  function renderSSR() {
    $('#ssr-rows').innerHTML = manifest.filter(p => p.ssr.length).map(p => `
      <tr><td class="mono fw-600">${p.seat}</td><td>${p.name}</td><td class="mono">${p.ref}</td>
        <td>${p.ssr.map(r => `<span class="badge badge-accent">${r}</span>`).join(' ')}</td>
        <td>${p.checkedIn ? UI.badge('Checked in') : '<span class="badge">Not checked in</span>'}</td></tr>`).join('');
    UI.icons();
  }

  $('#flight-sel').addEventListener('change', () => UI.toast('Loaded seat map for ' + $('#flight-sel').value.split(' ·')[0], 'info'));
  draw();
})();
