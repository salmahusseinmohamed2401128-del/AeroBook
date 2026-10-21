/* Admin — flight change log (audit trail) */
(() => {
  const { $, fmt } = UI;
  $('#l-flight').innerHTML += [...new Set(DB.auditLog.map(l => l.flight))].map(f => `<option>${f}</option>`).join('');
  const pre = new URLSearchParams(location.search).get('flight');
  if (pre) $('#l-flight').value = pre;
  function render() {
    const fl = $('#l-flight').value, ad = $('#l-admin').value, fd = $('#l-field').value;
    const rows = DB.auditLog.filter(l => (!fl || l.flight === fl) && (!ad || l.admin === ad) && (!fd || l.field === fd));
    $('#log-rows').innerHTML = rows.map(l => `
      <tr>
        <td class="mono text-sm">${fmt.date(l.at)}<span class="table-sub">${l.at.slice(11)}</span></td>
        <td><span class="badge badge-primary mono">${l.admin}</span></td>
        <td class="mono fw-600">${l.flight}</td>
        <td>${l.field}</td>
        <td><span class="text-danger" style="text-decoration:line-through">${l.old}</span></td>
        <td><span class="text-success fw-500">${l.new}</span></td>
        <td class="num">${l.notified ? `${l.notified} pax` : '—'}</td>
      </tr>`).join('') || `<tr><td colspan="7"><div class="empty"><span class="empty-icon"><i data-lucide="history"></i></span>No changes recorded for these filters.</div></td></tr>`;
    UI.icons();
  }
  ['#l-flight', '#l-admin', '#l-field'].forEach(s => $(s).addEventListener('change', render));
  render();
})();
