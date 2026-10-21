/* Login, registration (OTP) and password reset views */
(() => {
  const { $, $$ } = UI;

  // Theme follows saved preference on the public page too
  try { document.documentElement.dataset.theme = localStorage.getItem('aerobook.theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch { /* ignore */ }

  const views = ['login', 'register', 'otp', 'forgot', 'reset'];
  function show(view) {
    views.forEach(v => ($(`#view-${v}`).hidden = v !== view));
    const first = $(`#view-${view} input, #view-${view} button`);
    if (first) first.focus();
  }
  document.addEventListener('click', (e) => {
    const v = e.target.closest('[data-view]');
    if (v) show(v.dataset.view);
  });

  // Already signed in? go home
  const session = Auth.current();
  if (session) location.replace(Auth.home(session.role));

  // Show/hide password
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-toggle-pw]');
    if (!t) return;
    const input = document.getElementById(t.dataset.togglePw);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    t.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    t.innerHTML = `<i data-lucide="${show ? 'eye-off' : 'eye'}"></i>`;
    UI.icons();
  });

  // Login + lockout feedback
  let timer;
  function showLock(until) {
    $('#lock-alert').hidden = false;
    clearInterval(timer);
    const tick = () => {
      const s = Math.max(0, Math.round((until - Date.now()) / 1000));
      $('#lock-countdown').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
      if (!s) { clearInterval(timer); $('#lock-alert').hidden = true; }
    };
    tick();
    timer = setInterval(tick, 1000);
  }
  $('#demo-unlock').addEventListener('click', () => {
    Auth.unlock($('#email').value.trim());
    clearInterval(timer);
    $('#lock-alert').hidden = true;
    UI.toast('Demo lock cleared', 'info');
  });

  $('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#email').value.trim();
    const pw = $('#password').value;
    const field = $('#f-password');
    field.classList.remove('has-error');
    if (!email || !pw) {
      field.classList.add('has-error');
      $('#login-error span').textContent = 'Enter your email/phone and password.';
      return;
    }
    const res = Auth.login(email, pw);
    if (res.ok) {
      location.href = Auth.home(res.user.role);
      return;
    }
    if (res.reason === 'locked') { showLock(res.lockedUntil); return; }
    field.classList.add('has-error');
    $('#login-error span').textContent = `Incorrect email or password. ${res.remaining} attempt${res.remaining === 1 ? '' : 's'} left before your account is locked for ${Auth.LOCK_MINUTES} minutes.`;
  });

  // Registration
  let regMode = 'email';
  $$('[data-reg]').forEach(b => b.addEventListener('click', () => {
    regMode = b.dataset.reg;
    $('#reg-email-field').hidden = regMode !== 'email';
    $('#reg-phone-field').hidden = regMode !== 'phone';
  }));
  $('#register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    $('#otp-target').textContent = (regMode === 'email' ? $('#r-email').value : $('#r-phone').value) || (regMode === 'email' ? 'your email' : 'your phone');
    show('otp');
  });

  // OTP inputs: auto-advance
  const otp = $$('.otp input');
  otp.forEach((inp, i) => {
    inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, ''); if (inp.value && otp[i + 1]) otp[i + 1].focus(); });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !inp.value && otp[i - 1]) otp[i - 1].focus(); });
  });
  $('#otp-form').addEventListener('submit', (e) => {
    e.preventDefault();
    UI.toast('Account verified — you can now sign in');
    show('login');
  });

  // Forgot / reset
  $('#forgot-form').addEventListener('submit', (e) => {
    e.preventDefault();
    $('#forgot-target').textContent = $('#f-email-in').value || 'your email';
    $('#forgot-sent').hidden = false;
    UI.icons();
  });
  $('#reset-form').addEventListener('submit', (e) => {
    e.preventDefault();
    UI.toast('Password updated. Please sign in.');
    show('login');
  });
})();
