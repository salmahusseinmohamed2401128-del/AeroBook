/* Admin — revenue & route popularity reports */
(() => {
  const { $, fmt } = UI;

  UI.barChart($('#rev-chart'), DB.revenueByMonth, { format: v => `$${v.toFixed(2)}M`, label: 'Revenue by month' });

  const REV_TABLES = {
    route: {
      head: ['Route', 'Flights', 'Passengers', 'Avg fare', 'Revenue'],
      rows: DB.routeRevenue.map(r => [`<span class="mono">${r.route}</span>`, r.flights, fmt.num(r.pax), fmt.money(r.avgFare), `$${r.revenue.toFixed(2)}M`])
    },
    flight: {
      head: ['Flight', 'Route', 'Passengers', 'Avg fare', 'Revenue'],
      rows: DB.flights.slice(0, 8).map((f, i) => [`<span class="mono fw-600">${f.no}</span>`, `${f.from} → ${f.to}`, fmt.num(f.booked * 26), fmt.money(f.lowest + 40), `$${(f.booked * 26 * (f.lowest + 40) / 1e6).toFixed(2)}M`])
    },
    fare: {
      head: ['Fare class', 'Cabin', 'Passengers', 'Avg fare', 'Revenue'],
      rows: DB.fareClasses.map((f, i) => [`${f.name} <span class="text-3 mono">(${f.code})</span>`, f.cabin, fmt.num([2140, 3820, 4410, 21800, 48300, 27720][i]), fmt.money(f.base + f.taxes), `$${([2.73, 3.88, 3.18, 10.77, 17.53, 7.6][i] / 1).toFixed(2)}M`])
    }
  };

  function renderRevenue() {
    const t = REV_TABLES[$('#r-group').value];
    $('#rev-head').innerHTML = `<tr>${t.head.map((h, i) => `<th class="${i >= 2 ? 'num' : ''}">${h}</th>`).join('')}</tr>`;
    $('#rev-rows').innerHTML = t.rows.map(r => `<tr>${r.map((c, i) => `<td class="${i >= 2 ? 'num' : ''}">${c}</td>`).join('')}</tr>`).join('');
  }
  $('#r-group').addEventListener('change', renderRevenue);
  renderRevenue();

  const ranked = [...DB.routeRevenue].sort((a, b) => b.pax - a.pax);
  const max = ranked[0].pax;
  $('#pop-bars').innerHTML = ranked.map((r, i) => `
    <div class="hbar">
      <span class="rank">${String(i + 1).padStart(2, '0')}</span>
      <span class="mono">${r.route}</span>
      <span class="track"><span class="fill" style="display:block;width:${(r.pax / max) * 100}%"></span></span>
      <span class="val">${fmt.num(r.pax)}</span>
    </div>`).join('');
  $('#pop-rows').innerHTML = ranked.map((r, i) => `
    <tr><td class="mono">#${i + 1}</td><td class="mono fw-600">${r.route}</td><td class="num">${r.flights}</td>
      <td class="num">${fmt.num(r.pax)}</td><td class="num">$${r.revenue.toFixed(2)}M</td></tr>`).join('');
})();
