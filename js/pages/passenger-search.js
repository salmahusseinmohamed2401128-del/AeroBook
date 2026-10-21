/* Passenger — flight search with sort & filters (static results) */
(() => {
  const { $, $$, fmt } = UI;
  const TODAY = '2026-10-21';

  const opts = DB.airports.map(a => `<option value="${a.code}">${a.city} (${a.code})</option>`).join('');
  $('#s-from').innerHTML = opts;
  $('#s-to').innerHTML = opts;
  $('#s-from').value = 'CAI';
  $('#s-to').value = 'DXB';

  $('#swap').addEventListener('click', () => {
    const a = $('#s-from').value;
    $('#s-from').value = $('#s-to').value;
    $('#s-to').value = a;
  });

  $$('[data-trip]').forEach(b => b.addEventListener('click', () => {
    $('#sf-ret').hidden = b.dataset.trip === 'oneway';
  }));

  // Party summary
  document.addEventListener('change', (e) => {
    if (!e.target.matches('#party-menu output')) return;
    const a = +$('#c-adults').value, c = +$('#c-children').value, i = +$('#c-infants').value;
    const parts = [`${a} Adult${a > 1 ? 's' : ''}`];
    if (c) parts.push(`${c} Child${c > 1 ? 'ren' : ''}`);
    if (i) parts.push(`${i} Infant${i > 1 ? 's' : ''}`);
    $('#party-btn').textContent = parts.join(', ');
  });

  function partySize() { return +$('#c-adults').value + +$('#c-children').value; }

  function card(r) {
    const stopTxt = r.stops ? `1 stop · ${r.via}` : 'Direct';
    return `
      <article class="card card-interactive flight-card">
        <div class="flight-main">
          <div class="flight-meta">
            <span class="airline-logo"><i data-lucide="plane" class="icon-sm"></i></span>
            <span class="fw-600" style="color:var(--c-text)">${r.airline}</span>
            <span class="mono">${r.no}</span><span>·</span><span>${r.aircraft}</span>
            ${r.seatsLeft < 10 ? `<span class="badge badge-warning">${r.seatsLeft} seats left</span>` : ''}
          </div>
          <div class="route">
            <div class="pt"><div class="time">${r.dep}</div><div class="code">${r.from}</div></div>
            <div class="path"><span>${fmt.duration(r.duration)}</span><div class="line">${r.stops ? '<span class="stop"></span>' : ''}</div><span>${stopTxt}</span></div>
            <div class="pt end"><div class="time">${r.arr}${r.nextDay ? '<sup class="text-xs text-accent"> +1</sup>' : ''}</div><div class="code">${r.to}</div></div>
          </div>
          ${r.stops ? `<div class="connection-note"><i data-lucide="clock" class="icon-sm"></i>Change planes in ${DB.airport(r.via).city} (${r.via}) · ${fmt.duration(r.layover)} connection</div>` : ''}
        </div>
        <div class="flight-price">
          <div class="text-right"><div class="from">Lowest fare from</div><div class="amount">${fmt.money(r.fare)}</div><div class="from">per adult, incl. taxes</div></div>
          <a class="btn btn-accent" href="book.html?flight=${encodeURIComponent(r.no)}">Select<i data-lucide="arrow-right" class="icon-sm"></i></a>
        </div>
      </article>`;
  }

  function render() {
    const stops = $$('input[name="stops"]:checked').map(i => +i.value);
    const airlines = $$('input[name="airline"]:checked').map(i => i.value);
    const tods = $$('input[name="tod"]:checked').map(i => i.value);
    const sort = $('#sort').value;
    const toMin = (t) => +t.slice(0, 2) * 60 + +t.slice(3);

    let rows = DB.searchResults.filter(r => r.seatsLeft >= partySize() && stops.includes(r.stops) && airlines.includes(r.airline) && tods.includes(r.tod));
    rows.sort((a, b) => sort === 'price' ? a.fare - b.fare : sort === 'dep' ? toMin(a.dep) - toMin(b.dep) : a.duration - b.duration);

    $('#results').innerHTML = rows.length ? rows.map(card).join('') : `
      <div class="card"><div class="empty"><span class="empty-icon"><i data-lucide="search-x"></i></span>
        <div><strong>No flights match your filters</strong><p class="text-sm text-3">Try allowing connections or another time of day.</p></div>
        <button class="btn btn-outline btn-sm" onclick="document.getElementById('clear-filters').click()">Reset filters</button></div></div>`;
    $('#connect-note').hidden = rows.some(r => r.stops === 0) || !rows.length;
    UI.icons();
  }

  $('#results-area').addEventListener('change', render);
  $('#clear-filters').addEventListener('click', () => { $$('#results-area aside input').forEach(i => (i.checked = true)); render(); });

  $('#search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const same = $('#s-from').value === $('#s-to').value;
    const past = $('#s-dep').value < TODAY;
    $('#sf-to').classList.toggle('has-error', same);
    $('#sf-dep').classList.toggle('has-error', past);
    if (same || past) return;
    const from = DB.airport($('#s-from').value), to = DB.airport($('#s-to').value);
    $('#results-title').textContent = `${from.city} → ${to.city}`;
    const a = +$('#c-adults').value, c = +$('#c-children').value, i = +$('#c-infants').value;
    $('#results-sub').textContent = `${fmt.date($('#s-dep').value)} · ${a} adult${a > 1 ? 's' : ''}${c ? `, ${c} child` : ''}${i ? `, ${i} infant` : ''} · ${$('#s-cabin').value} · only flights with enough seats for your party`;
    render();
    $('#results-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  render();
})();
