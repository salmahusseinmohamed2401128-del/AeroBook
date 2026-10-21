/* ==========================================================================
   AeroBook — mock authentication & role-based access (front-end only)
   Session lives in localStorage; there is no real security here.
   ========================================================================== */

const Auth = (() => {
  const SESSION_KEY = 'aerobook.session';
  const ATTEMPTS_KEY = 'aerobook.attempts';
  const MAX_ATTEMPTS = 5;
  const LOCK_MINUTES = 15;

  const HOME = {
    admin: 'admin/dashboard.html',
    staff: 'staff/check-in.html',
    passenger: 'passenger/search.html'
  };

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* storage unavailable */ } }
  };

  function attempts(email) {
    const all = store.get(ATTEMPTS_KEY) || {};
    return all[email.toLowerCase()] || { count: 0, lockedUntil: 0 };
  }

  function setAttempts(email, value) {
    const all = store.get(ATTEMPTS_KEY) || {};
    all[email.toLowerCase()] = value;
    store.set(ATTEMPTS_KEY, all);
  }

  /** Returns { ok, user } or { ok:false, reason, remaining, lockedUntil } */
  function login(email, password) {
    const a = attempts(email);
    if (a.lockedUntil > Date.now()) return { ok: false, reason: 'locked', lockedUntil: a.lockedUntil };

    const user = DB.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      setAttempts(email, { count: 0, lockedUntil: 0 });
      store.set(SESSION_KEY, { id: user.id, role: user.role, name: user.name, email: user.email, title: user.title });
      return { ok: true, user };
    }

    const count = a.count + 1;
    if (count >= MAX_ATTEMPTS) {
      const lockedUntil = Date.now() + LOCK_MINUTES * 60 * 1000;
      setAttempts(email, { count: 0, lockedUntil });
      return { ok: false, reason: 'locked', lockedUntil };
    }
    setAttempts(email, { count, lockedUntil: 0 });
    return { ok: false, reason: 'invalid', remaining: MAX_ATTEMPTS - count };
  }

  function unlock(email) { setAttempts(email, { count: 0, lockedUntil: 0 }); }
  /** Session holds the user id; name/email/title are always read fresh from DB. */
  function current() {
    const s = store.get(SESSION_KEY);
    if (!s) return null;
    const u = DB.users.find(x => x.id === s.id);
    if (!u) { store.del(SESSION_KEY); return null; }
    return { id: u.id, role: u.role, name: u.name, email: u.email, title: u.title };
  }
  function logout(base = '') { store.del(SESSION_KEY); location.href = base + 'index.html'; }
  function home(role) { return HOME[role]; }

  /** Page guard: redirect when the signed-in role does not match the page role. */
  function guard() {
    const role = document.body.dataset.role;
    if (!role) return null;
    const base = document.body.dataset.base || '';
    const user = current();
    if (!user) { location.replace(`${base}index.html?next=${encodeURIComponent(location.pathname)}`); return null; }
    if (user.role !== role) { location.replace(`${base}${HOME[user.role]}?denied=${role}`); return null; }
    return user;
  }

  return { login, logout, current, guard, home, unlock, MAX_ATTEMPTS, LOCK_MINUTES };
})();
