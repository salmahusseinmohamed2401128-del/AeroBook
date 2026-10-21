/* Passenger — bag tracking by tag number */
(() => {
  const { $, fmt } = UI;
  const STAGES = ['Checked in', 'Loaded', 'Transferred', 'Arrived'];
  const ICON = { 'Checked in': 'tag', 'Security screened': 'scan-line', 'Loaded': 'package-check', 'Transferred': 'repeat', 'Arrived': 'plane-landing', 'Missing': 'search-x' };

  function show(tag) {
    const bag = DB.bags.find(b => b.tag === tag);
    $('#tag-field').classList.toggle('has-error', !bag);
    $('#result').hidden = !bag;
    if (!bag) return;

    $('#r-tag').textContent = bag.tag;
    $('#r-sub').textContent = `${bag.pax} · ${bag.flight} · ${bag.weight} kg`;
    $('#r-status').innerHTML = UI.badge(bag.status);

    const done = bag.history.map(h => `
      <li class="${h.status === 'Missing' ? 'alert' : 'done'}">
        <span class="t-dot"><i data-lucide="${ICON[h.status] || 'circle'}" class="icon-sm"></i></span>
        <div><div class="t-title">${h.status}</div><div class="t-meta">${fmt.dateTime(h.at)} · ${h.loc}</div></div>
      </li>`);
    const reached = bag.history.map(h => h.status);
    const pending = bag.status === 'Missing' ? [] : STAGES.filter(s => !reached.includes(s) && !(s === 'Transferred' && bag.flight !== 'AB317')).map(s => `
      <li><span class="t-dot"><i data-lucide="${ICON[s]}" class="icon-sm"></i></span>
        <div><div class="t-title text-3">${s}</div><div class="t-meta">Pending</div></div></li>`);
    if (done.length) done[done.length - 1] = done[done.length - 1].replace('class="done"', 'class="current"');
    $('#r-timeline').innerHTML = done.join('') + pending.join('');
    UI.icons();
  }

  $('#my-bags').innerHTML = DB.bags.filter(b => b.ref === 'K7M2QX').map(b => `
    <button class="btn btn-outline w-full" style="justify-content:space-between;height:auto;padding:12px 16px" data-tag="${b.tag}">
      <span class="text-left"><span class="mono fw-600">${b.tag}</span><span class="table-sub">${b.weight} kg</span></span>${UI.badge(b.status)}</button>`).join('');
  $('#my-bags').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tag]');
    if (b) { $('#tag').value = b.dataset.tag; show(b.dataset.tag); }
  });

  $('#track-form').addEventListener('submit', (e) => { e.preventDefault(); show($('#tag').value.trim()); });

  const q = new URLSearchParams(location.search).get('tag');
  if (q) $('#tag').value = q;
  show($('#tag').value.trim());
})();
