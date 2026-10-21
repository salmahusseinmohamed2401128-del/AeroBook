/* Passenger — booking wizard (visual flow only, no real payment) */
(() => {
  const { $, $$, fmt } = UI;
  const FARE = 215, TAXES = 74;
  const state = { step: 1, seat: null, seatPrice: 0, extras: 0, discount: 0, code: '' };

  /* ---------- Steps ---------- */
  function go(n) {
    state.step = n;
    $$('[data-step-panel]').forEach(p => (p.hidden = +p.dataset.stepPanel !== n));
    $$('#stepper li').forEach((li, i) => {
      li.classList.toggle('done', i + 1 < n);
      li.classList.toggle('current', i + 1 === n);
      li.querySelector('button').disabled = n === 5 || i + 1 === 5;
    });
    if (n >= 2 && n < 5) startHold();
    if (n === 5) { stopHold(); $('#hold-timer').hidden = true; }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-next]')) {
      if (e.target.closest('[data-skip-seat]')) selectSeat(null);
      go(state.step + 1);
    }
    if (e.target.closest('[data-prev]')) go(state.step - 1);
    const g = e.target.closest('[data-goto]');
    if (g && !g.disabled) go(+g.dataset.goto);
  });

  /* ---------- 15-minute seat hold ---------- */
  let holdEnd = null, holdTimer = null;
  function startHold() {
    if (holdTimer) return;
    holdEnd = Date.now() + 15 * 60 * 1000;
    $('#hold-timer').hidden = false;
    const tick = () => {
      const s = Math.max(0, Math.round((holdEnd - Date.now()) / 1000));
      $('#hold-clock').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      if (!s) { stopHold(); UI.toast('Your seat hold expired and the seat was released.', 'warning'); }
    };
    tick();
    holdTimer = setInterval(tick, 1000);
  }
  function stopHold() { clearInterval(holdTimer); holdTimer = null; }

  /* ---------- Seat map ---------- */
  $('#legend').innerHTML = SeatMap.legend();
  SeatMap.render($('#seatmap'), {
    mode: 'select',
    onSelect(info, btn) {
      // Demo of concurrent-booking protection
      if (info.id === '10C') {
        btn.setAttribute('aria-pressed', 'false');
        btn.classList.add('occupied');
        btn.disabled = true;
        UI.toast('Sorry — 10C was just taken by another traveller. Please choose another seat.', 'error');
        return;
      }
      selectSeat(info);
    }
  });
  function selectSeat(info) {
    state.seat = info ? info.id : null;
    state.seatPrice = info ? info.price : 0;
    $('#seat-chosen').textContent = info ? `Seat ${info.id} · ${info.price ? fmt.money(info.price) : 'Included'}` : 'No seat selected';
    $('#sum-seat-id').textContent = info ? info.id : '';
    totals();
  }

  /* ---------- Meals & extras ---------- */
  const MEALS = [
    ['standard', 'Standard', 'utensils', 'Chef’s choice hot meal'],
    ['vegetarian', 'Vegetarian', 'leaf', 'Lacto-ovo vegetarian (VLML)'],
    ['vegan', 'Vegan', 'sprout', 'Strict plant-based (VGML)'],
    ['halal', 'Halal', 'moon-star', 'Prepared to halal standards'],
    ['child', 'Child meal', 'baby', 'For ages 2–11 (CHML)'],
    ['diabetic', 'Diabetic', 'heart-pulse', 'Low sugar (DBML)'],
    ['gluten', 'Gluten-free', 'wheat-off', 'No gluten (GFML)'],
    ['none', 'No meal', 'circle-slash', 'I won’t need a meal']
  ];
  $('#meals').innerHTML = MEALS.map(([v, t, i, d], idx) => `
    <label class="option"><input type="radio" name="meal" value="${v}" ${idx === 0 ? 'checked' : ''}>
      <span class="opt-body"><span class="opt-title"><i data-lucide="${i}" class="icon-sm"></i>${t}</span><span class="opt-desc">${d}</span><span class="opt-price text-3">Included</span></span></label>`).join('');

  document.addEventListener('change', (e) => {
    if (e.target.name === 'extra') {
      state.extras = $$('input[name="extra"]:checked').reduce((s, i) => s + +i.dataset.price, 0);
      totals();
    }
  });

  /* ---------- Promo code ---------- */
  $('#promo-apply').addEventListener('click', () => {
    const code = $('#promo').value.trim().toUpperCase();
    const field = $('#promo-field');
    field.classList.remove('has-error');
    const p = DB.promos.find(x => x.code === code);
    let err = '';
    if (!p) err = 'We don’t recognise this code.';
    else if (p.status === 'Expired' || p.used >= p.max) err = `${code} has expired.`;
    else if (p.status === 'Scheduled') err = `${code} isn't active yet.`;
    else if (p.routes !== 'All routes' && !p.routes.includes('CAI–DXB')) err = `${code} isn't valid for Cairo → Dubai.`;
    if (err) { $('#promo-err').textContent = err; field.classList.add('has-error'); state.discount = 0; totals(); return; }
    state.code = code;
    state.discount = p.type === 'percent' ? +(FARE * p.value / 100).toFixed(2) : p.value;
    UI.toast(`${code} applied — you save ${fmt.money(state.discount)}`);
    totals();
  });

  /* ---------- Totals ---------- */
  function totals() {
    const total = FARE + TAXES + state.seatPrice + state.extras - state.discount;
    $('#sum-seat').textContent = fmt.money2(state.seatPrice);
    $('#sum-extras').textContent = fmt.money2(state.extras);
    $('#sum-disc-row').hidden = !state.discount;
    $('#sum-disc').textContent = `−${fmt.money2(state.discount)}`;
    $('#sum-code').textContent = state.code;
    $('#sum-total').textContent = fmt.money2(total);
    $('#pay-amount').textContent = fmt.money(total);
  }

  /* ---------- Pay ---------- */
  $('#pay-btn').addEventListener('click', () => {
    UI.openModal('paying-modal');
    setTimeout(() => { UI.closeModal('paying-modal'); go(5); UI.toast('Payment successful — e-ticket emailed'); }, 1600);
  });

  totals();
})();
