/* Admin dashboard */
(() => {
  const { $, fmt } = UI;

  UI.barChart($('#rev-chart'), DB.revenueByMonth, { format: v => `$${v.toFixed(2)}M`, label: 'Monthly revenue' });

  const routes = [...DB.routeRevenue].sort((a, b) => b.pax - a.pax).slice(0, 5);
  const max = routes[0].pax;
  $('#top-routes').innerHTML = routes.map((r, i) => `
    <div class="hbar">
      <span class="rank">${String(i + 1).padStart(2, '0')}</span>
      <span class="mono">${r.route}</span>
      <span class="track"><span class="fill" style="width:${(r.pax / max) * 100}%; display:block"></span></span>
      <span class="val">${fmt.num(r.pax)}</span>
    </div>`).join('');

  $('#flights-today').innerHTML = DB.flights.slice(0, 8).map(f => {
    const ci = (f.checkedIn / f.capacity) * 100;
    const bk = ((f.booked - f.checkedIn) / f.capacity) * 100;
    return `
      <tr>
        <td class="mono fw-600">${f.no}</td>
        <td>${f.from} → ${f.to}</td>
        <td class="mono">${fmt.dateTime(f.dep)}</td>
        <td class="num">${f.capacity}</td>
        <td class="num">${f.booked}</td>
        <td class="num">${f.checkedIn}</td>
        <td><div class="progress stacked" title="${f.checkedIn} checked in, ${f.booked} booked of ${f.capacity}">
          <span class="seg-checked" style="width:${ci}%"></span><span class="seg-booked" style="width:${bk}%"></span></div>
          <span class="table-sub">${Math.round((f.booked / f.capacity) * 100)}% booked</span></td>
        <td>${UI.badge(f.status)}</td>
      </tr>`;
  }).join('');
  UI.icons();
})();
