/* Admin — fare classes and promo codes */
(() => {
  const { $, $$, fmt } = UI;

  function renderFares(cabin = '') {
    $('#fare-rows').innerHTML = DB.fareClasses.filter(f => !cabin || f.cabin === cabin).map(f => `
      <tr>
        <td><span class="fw-600">${f.name}</span><span class="table-sub mono">Code ${f.code}</span></td>
        <td><span class="badge badge-${f.color}">${f.cabin}</span></td>
        <td class="num">${fmt.money(f.base)}</td>
        <td class="num">${fmt.money(f.taxes)}</td>
        <td><span class="inline-flex items-center gap-1"><i data-lucide="luggage" class="icon-sm text-3"></i>${f.bags}</span></td>
        <td>${f.change}</td>
        <td>${f.refund}</td>
        <td><div class="row-actions">
          <button class="btn btn-ghost btn-icon btn-sm" aria-label="Edit ${f.name}" data-open-modal="fare-modal"><i data-lucide="pencil" class="icon-sm"></i></button>
        </div></td>
      </tr>`).join('');
    UI.icons();
  }

  function renderPromos() {
    $('#promo-rows').innerHTML = DB.promos.map(p => {
      const pct = Math.round((p.used / p.max) * 100);
      return `
        <tr>
          <td><span class="mono fw-600">${p.code}</span></td>
          <td>${p.type === 'percent' ? `${p.value}% off` : `${fmt.money(p.value)} off`}</td>
          <td class="text-sm">${fmt.date(p.from)} – ${fmt.date(p.to)}</td>
          <td class="text-sm">${p.routes}</td>
          <td><div class="progress"><span style="width:${pct}%;${pct >= 100 ? 'background:var(--c-danger)' : ''}"></span></div>
            <span class="table-sub num">${fmt.num(p.used)} / ${fmt.num(p.max)}</span></td>
          <td>${UI.badge(p.status)}</td>
          <td><div class="row-actions">
            <button class="btn btn-ghost btn-icon btn-sm" aria-label="Edit ${p.code}" data-open-modal="promo-modal"><i data-lucide="pencil" class="icon-sm"></i></button>
            <button class="btn btn-ghost btn-icon btn-sm" aria-label="Deactivate ${p.code}" data-toast="${p.code} deactivated" data-toast-type="info"><i data-lucide="power" class="icon-sm"></i></button>
          </div></td>
        </tr>`;
    }).join('');
    UI.icons();
  }

  $$('#cabin-filter [data-cabin]').forEach(b => b.addEventListener('click', () => renderFares(b.dataset.cabin)));

  renderFares();
  renderPromos();
})();
