/* Passenger — travel history */
(() => {
  const { $, fmt } = UI;
  const trips = [...DB.trips].sort((a, b) => b.date.localeCompare(a.date));

  function card(t) {
    const d = new Date(t.date);
    const cancelled = t.status === 'Cancelled';
    const hasPass = t.status === 'Checked in' || t.status === 'Completed';
    return `
      <article class="card trip-card ${t.upcoming ? '' : 'past'}">
        <div class="trip-date"><div class="d">${d.getDate()}</div><div class="m">${d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</div></div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h3>${DB.airport(t.from).city} → ${DB.airport(t.to).city}</h3>${UI.badge(t.status)}
          </div>
          <p class="text-sm text-3 mt-1"><span class="mono">${t.flight}</span> · ${fmt.time(t.date)} · ${t.cabin} · Seat <span class="mono">${t.seat}</span> · Ref <span class="mono fw-600" style="color:var(--c-text)">${t.ref}</span></p>
        </div>
        <div class="trip-actions">
          <button class="btn btn-outline btn-sm" data-toast="E-ticket for ${t.ref} downloaded" ${cancelled ? 'disabled' : ''}><i data-lucide="ticket" class="icon-sm"></i>E-ticket</button>
          <button class="btn btn-outline btn-sm" data-toast="Receipt for ${t.ref} downloaded"><i data-lucide="receipt" class="icon-sm"></i>Receipt</button>
          <button class="btn btn-outline btn-sm" data-toast="Boarding pass for ${t.ref} downloaded" ${hasPass ? '' : 'disabled title="Available after check-in"'}><i data-lucide="qr-code" class="icon-sm"></i>Boarding pass</button>
          ${t.upcoming ? `<a class="btn btn-primary btn-sm" href="manage-booking.html?ref=${t.ref}">Manage</a>` : ''}
        </div>
      </article>`;
  }

  const up = trips.filter(t => t.upcoming), past = trips.filter(t => !t.upcoming);
  $('#tp-up').innerHTML = up.map(card).join('');
  $('#tp-past').innerHTML = past.map(card).join('');
  $('#n-up').textContent = up.length;
  $('#n-past').textContent = past.length;
  UI.icons();
})();
