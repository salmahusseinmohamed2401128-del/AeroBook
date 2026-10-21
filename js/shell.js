/* ==========================================================================
   AeroBook — app shell: role-based sidebar, topbar, theme, notifications
   Each app page sets <body data-role="…" data-page="…" data-base="../">
   ========================================================================== */

const Shell = (() => {
  const NAV = {
    admin: [
      { group: 'Overview', items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: 'admin/dashboard.html' }
      ] },
      { group: 'Operations', items: [
        { id: 'flights', label: 'Manage Flights', icon: 'plane', href: 'admin/flights.html' },
        { id: 'pricing', label: 'Fares & Promotions', icon: 'tags', href: 'admin/pricing.html' },
        { id: 'bookings', label: 'Bookings', icon: 'ticket', href: 'admin/bookings.html' }
      ] },
      { group: 'Insights', items: [
        { id: 'reports', label: 'Reports', icon: 'chart-column', href: 'admin/reports.html' },
        { id: 'changelog', label: 'Flight Change Log', icon: 'history', href: 'admin/change-log.html' }
      ] }
    ],
    staff: [
      { group: 'Airport', items: [
        { id: 'checkin', label: 'Passenger Check-in', icon: 'scan-line', href: 'staff/check-in.html' },
        { id: 'seats', label: 'Seat Assignments', icon: 'armchair', href: 'staff/seats.html' },
        { id: 'baggage', label: 'Baggage Handling', icon: 'luggage', href: 'staff/baggage.html' },
        { id: 'status', label: 'Update Flight Status', icon: 'radio-tower', href: 'staff/flight-status.html' }
      ] }
    ],
    passenger: [
      { group: 'Travel', items: [
        { id: 'search', label: 'Search Flights', icon: 'search', href: 'passenger/search.html' },
        { id: 'trips', label: 'My Trips', icon: 'briefcase', href: 'passenger/trips.html' },
        { id: 'manage', label: 'Manage Booking', icon: 'square-pen', href: 'passenger/manage-booking.html' },
        { id: 'checkin', label: 'Online Check-in', icon: 'badge-check', href: 'passenger/check-in.html' },
        { id: 'bags', label: 'Track Bags', icon: 'luggage', href: 'passenger/bags.html' }
      ] },
      { group: 'Account', items: [
        { id: 'profile', label: 'Profile & Alerts', icon: 'user-cog', href: 'passenger/profile.html' }
      ] }
    ]
  };

  const ROLE_LABEL = { admin: 'Administrator', staff: 'Airline Staff', passenger: 'Passenger' };

  const initials = (name) => name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

  function theme(set) {
    const key = 'aerobook.theme';
    if (set) { try { localStorage.setItem(key, set); } catch { /* ignore */ } }
    let t = set;
    if (!t) { try { t = localStorage.getItem(key); } catch { /* ignore */ } }
    t = t || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = t;
    return t;
  }

  function render(user) {
    const body = document.body;
    const base = body.dataset.base || '';
    const page = body.dataset.page;
    const role = body.dataset.role;
    const title = body.dataset.title || document.title.split('·')[0].trim();

    const sidebar = document.getElementById('sidebar');
    sidebar.setAttribute('aria-label', 'Main navigation');
    sidebar.innerHTML = `
      <a class="brand" href="${base}${Auth.home(role)}">
        <span class="brand-mark"><i data-lucide="plane"></i></span>
        <span>AeroBook<small>${ROLE_LABEL[role]} portal</small></span>
      </a>
      <nav>
        ${NAV[role].map(g => `
          <div class="nav-group">
            <div class="nav-label">${g.group}</div>
            ${g.items.map(i => `
              <a class="nav-link" href="${base}${i.href}" ${i.id === page ? 'aria-current="page"' : ''}>
                <i data-lucide="${i.icon}"></i>${i.label}
              </a>`).join('')}
          </div>`).join('')}
        <div class="nav-group">
          <div class="nav-label">Public</div>
          <a class="nav-link" href="${base}flight-status.html"><i data-lucide="radar"></i>Flight Status Board</a>
        </div>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <span class="avatar">${initials(user.name)}</span>
          <div class="flex-1"><div class="name">${user.name}</div><div class="role">${user.id} · ${ROLE_LABEL[role]}</div></div>
        </div>
        <button class="nav-link w-full" style="border:0;background:none" data-logout><i data-lucide="log-out"></i>Sign out</button>
      </div>`;

    const notifs = DB.notifications[role] || [];
    const topbar = document.getElementById('topbar');
    topbar.innerHTML = `
      <button class="btn btn-ghost btn-icon menu-toggle" aria-label="Open navigation" data-nav-toggle><i data-lucide="menu"></i></button>
      <div>
        <div class="topbar-title">${title}</div>
        <div class="topbar-crumb">${ROLE_LABEL[role]} · ${user.title}</div>
      </div>
      <div class="topbar-actions">
        <button class="btn btn-ghost btn-icon" aria-label="Toggle dark mode" data-theme-toggle><i data-lucide="moon"></i></button>
        <div class="dropdown">
          <button class="btn btn-ghost btn-icon" aria-label="Notifications" aria-haspopup="true" aria-expanded="false" data-dropdown="notif-menu" style="position:relative">
            <i data-lucide="bell"></i>${notifs.length ? '<span class="notif-dot"></span>' : ''}
          </button>
          <div class="dropdown-menu notif-menu" id="notif-menu" hidden>
            <header>Notifications <button class="link-btn text-sm" data-toast="All notifications marked as read">Mark all read</button></header>
            ${notifs.map(n => `
              <div class="notif-item">
                <span class="notif-icon"><i data-lucide="${n.icon}" class="icon-sm"></i></span>
                <div><div>${n.text}</div><div class="time">${n.time}</div></div>
              </div>`).join('')}
          </div>
        </div>
        <div class="dropdown">
          <button class="btn btn-ghost" style="padding:0 6px" aria-label="Account menu" aria-haspopup="true" aria-expanded="false" data-dropdown="user-menu">
            <span class="avatar avatar-sm">${initials(user.name)}</span><i data-lucide="chevron-down" class="icon-sm"></i>
          </button>
          <div class="dropdown-menu" id="user-menu" hidden>
            <div style="padding:8px 12px"><div class="fw-600">${user.name}</div><div class="text-xs text-3">${user.email}</div></div>
            <div class="dropdown-sep"></div>
            ${role === 'passenger' ? `<a class="dropdown-item" href="${base}passenger/profile.html"><i data-lucide="user-cog" class="icon-sm"></i>Profile & alerts</a>` : ''}
            <button class="dropdown-item" data-open-modal="pw-modal"><i data-lucide="key-round" class="icon-sm"></i>Change password</button>
            <div class="dropdown-sep"></div>
            <button class="dropdown-item danger" data-logout><i data-lucide="log-out" class="icon-sm"></i>Sign out</button>
          </div>
        </div>
      </div>`;

    // Mobile scrim
    const scrim = document.createElement('div');
    scrim.className = 'sidebar-scrim';
    scrim.dataset.navToggle = '';
    sidebar.after(scrim);

    // Shared change-password modal
    document.body.insertAdjacentHTML('beforeend', `
      <dialog class="modal modal-sm" id="pw-modal" aria-labelledby="pw-title">
        <div class="modal-header"><div><h3 id="pw-title">Change password</h3><p>Use at least 8 characters with a number and a symbol.</p></div>
          <button class="btn btn-ghost btn-icon btn-sm" data-close-modal aria-label="Close"><i data-lucide="x"></i></button></div>
        <div class="modal-body stack">
          <div class="field"><label for="pw-cur">Current password</label><input class="input" id="pw-cur" type="password" autocomplete="current-password"></div>
          <div class="field"><label for="pw-new">New password</label><input class="input" id="pw-new" type="password" autocomplete="new-password"></div>
          <div class="field"><label for="pw-new2">Confirm new password</label><input class="input" id="pw-new2" type="password" autocomplete="new-password"></div>
        </div>
        <div class="modal-footer"><button class="btn btn-outline" data-close-modal>Cancel</button><button class="btn btn-primary" data-close-modal data-toast="Password updated">Update password</button></div>
      </dialog>`);

    const sync = () => {
      const btn = topbar.querySelector('[data-theme-toggle]');
      btn.innerHTML = `<i data-lucide="${document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon'}"></i>`;
      UI.icons();
    };
    sync();

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-theme-toggle]')) { theme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); sync(); }
      if (e.target.closest('[data-nav-toggle]')) document.querySelector('.app').classList.toggle('nav-open');
      if (e.target.closest('[data-logout]')) Auth.logout(base);
    });

    const denied = new URLSearchParams(location.search).get('denied');
    if (denied) setTimeout(() => UI.toast(`Access denied: the ${denied} area is not available for your role.`, 'error'), 200);
  }

  theme();
  document.addEventListener('DOMContentLoaded', () => {
    const user = Auth.guard();
    if (user) render(user);
    UI.icons();
  });

  return { theme, initials };
})();
