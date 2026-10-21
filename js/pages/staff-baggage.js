/* Staff — bag registration, excess fees, status tracking */
(() => {
  const { $, fmt } = UI;
  const ALLOW = { pieces: 2, maxKg: 32, perKg: 16, perPiece: 90 };

  function excess() {
    const pieces = +$('#bg-pieces').value;
    const kg = +$('#bg-weight').value || 0;
    const overKg = Math.max(0, kg - ALLOW.maxKg);
    const extraPieces = Math.max(0, pieces - ALLOW.pieces);
    const wfee = overKg * ALLOW.perKg, pfee = extraPieces * ALLOW.perPiece;
    $('#ex-pieces').textContent = `${pieces} of ${ALLOW.pieces} allowed`;
    $('#ex-pieces').className = `num ${extraPieces ? 'text-warning fw-600' : ''}`;
    $('#ex-weight').textContent = `${kg} kg / ${ALLOW.maxKg} kg max`;
    $('#ex-weight').className = `num ${overKg ? 'text-warning fw-600' : ''}`;
    $('#ex-wfee').previousElementSibling.textContent = `Overweight fee (${overKg.toFixed(1)} kg)`;
    $('#ex-wfee').textContent = fmt.money2(wfee);
    $('#ex-pfee').textContent = fmt.money2(pfee);
    $('#ex-total').textContent = fmt.money2(wfee + pfee);
    $('#ex-total').className = `num ${wfee + pfee ? 'text-warning' : 'text-success'}`;
    $('#collect-fee').disabled = !(wfee + pfee);
  }
  $('#bg-weight').addEventListener('input', excess);
  $('#bg-pieces').addEventListener('change', excess);

  $('#gen-tag').addEventListener('click', () => {
    const tag = '0157' + String(Math.floor(100000 + Math.random() * 899999));
    $('#tag-no').textContent = `${tag.slice(0, 4)} ${tag.slice(4, 8)} ${tag.slice(8)}`;
    $('#tag-out').hidden = false;
    UI.icons();
    UI.toast(`Bag registered — tag ${tag} sent to printer`);
  });
  $('#collect-fee').addEventListener('click', () => UI.toast(`Excess fee of ${$('#ex-total').textContent} collected`));

  function render() {
    const f = $('#bf').value;
    $('#bag-rows').innerHTML = DB.bags.filter(b => !f || b.status === f).map(b => {
      const last = b.history[b.history.length - 1];
      return `<tr>
        <td class="mono fw-600">${b.tag}</td><td>${b.pax}<span class="table-sub mono">${b.ref}</span></td><td class="mono">${b.flight}</td>
        <td class="num">${b.weight} kg</td><td class="mono text-sm">${fmt.dateTime(last.at)}</td><td class="text-sm">${last.loc}</td><td>${UI.badge(b.status)}</td></tr>`;
    }).join('');
    UI.icons();
  }
  $('#bf').addEventListener('change', render);

  excess();
  render();
})();
