/* Public flight status board */
(() => {
  const { $, fmt } = UI;

  const applyTheme = (t) => {
    document.documentElement.dataset.theme = t;
    $('#theme-btn').innerHTML = `<i data-lucide="${t === 'dark' ? 'sun' : 'moon'}"></i>`;
    UI.icons();
  };
  let theme;
  try { theme = localStorage.getItem('aerobook.theme'); } catch { /* ignore */ }
  applyTheme(theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  $('#theme-btn').addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('aerobook.theme', t); } catch { /* ignore */ }
    applyTheme(t);
  });

  function render() {
    const q = $('#q').value.trim().toLowerCase();
    const dir = $('#dir').value;
    const rows = DB.flights.filter(f => {
      const text = `${f.no} ${f.from} ${f.to} ${DB.airport(f.from).city} ${DB.airport(f.to).city}`.toLowerCase();
      if (q && !text.includes(q)) return false;
      if (dir === 'dep' && f.from !== 'CAI') return false;
      if (dir === 'arr' && f.to !== 'CAI') return false;
      return true;
    });
    $('#board').innerHTML = rows.length ? rows.map(f => `
      <tr>
        <td><span class="mono fw-600">${f.no}</span><span class="table-sub">${f.airline}</span></td>
        <td>${DB.airport(f.from).city} <span class="text-3">(${f.from})</span> → ${DB.airport(f.to).city} <span class="text-3">(${f.to})</span></td>
        <td class="mono">${fmt.time(f.dep)}<span class="table-sub">${fmt.dateShort(f.dep)}</span></td>
        <td class="mono ${f.status === 'Delayed' ? 'text-warning fw-600' : ''}">${f.status === 'Cancelled' ? '—' : fmt.time(f.newTime || f.dep)}</td>
        <td class="mono">${f.oldGate ? `<s class="text-3">${f.oldGate}</s> ` : ''}${f.gate}</td>
        <td>${UI.badge(f.status)}</td>
      </tr>`).join('')
      : `<tr><td colspan="6"><div class="empty"><span class="empty-icon"><i data-lucide="plane"></i></span>No flights match “${q}”. Try a flight number like AB205.</div></td></tr>`;
    UI.icons();
  }

  $('#q').addEventListener('input', render);
  $('#dir').addEventListener('change', render);
  render();
})();
