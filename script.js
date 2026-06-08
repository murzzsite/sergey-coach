(() => {
  const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/MM9E8WJXQL';

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* scroll progress */
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;z-index:300;height:3px;width:0;background:linear-gradient(90deg,#1e4080,#4a7cc7);border-radius:0 2px 2px 0;transition:width .08s linear;pointer-events:none';
  document.body.prepend(bar);

  const header = document.getElementById('header');
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 8);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* burger */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger?.addEventListener('click', () => { burger.classList.toggle('is-open'); nav.classList.toggle('is-open'); });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { burger.classList.remove('is-open'); nav.classList.remove('is-open'); }));

  /* smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length <= 1) return;
      const t = document.querySelector(href);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    });
  });

  /* phone mask */
  document.querySelectorAll('input[type="tel"]').forEach(inp => {
    inp.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.startsWith('8')) v = '7' + v.slice(1);
      if (!v.startsWith('7')) v = '7' + v;
      v = v.slice(0, 11);
      let o = '+7';
      if (v.length > 1) o += ' (' + v.slice(1, 4);
      if (v.length >= 4) o += ') ' + v.slice(4, 7);
      if (v.length >= 7) o += '-' + v.slice(7, 9);
      if (v.length >= 9) o += '-' + v.slice(9, 11);
      e.target.value = o;
    });
  });

  /* form */
  const form = document.getElementById('leadForm');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    const payload = {};
    new FormData(form).forEach((v, k) => { payload[k] = v; });
    if (payload._gotcha) return;
    if (!payload.name || !payload.phone) { alert('Заполните имя и контакт'); return; }
    btn.disabled = true; btn.textContent = 'Отправляем…';
    try {
      const r = await fetch(LEAD_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error();
      btn.textContent = '✓ Заявка отправлена';
      btn.style.background = '#16a34a';
      form.reset();
      setTimeout(() => { btn.style.background = ''; }, 3200);
    } catch { btn.textContent = 'Ошибка — попробуйте ещё раз'; }
    finally { setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3200); }
  });

  /* ripple */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.cssText = `position:absolute;border-radius:50%;width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;background:rgba(255,255,255,0.28);animation:rpl .55s ease-out forwards;pointer-events:none`;
      if (!document.getElementById('rpl-s')) { const s = document.createElement('style'); s.id='rpl-s'; s.textContent='@keyframes rpl{from{transform:scale(0);opacity:1}to{transform:scale(2.8);opacity:0}}'; document.head.appendChild(s); }
      btn.appendChild(r);
      r.addEventListener('animationend', () => r.remove());
    });
  });

  /* stagger */
  ['.fw-grid', '.srv-grid', '.pkg-grid', '.proc-steps'].forEach(sel => {
    document.querySelectorAll(sel).forEach(g => {
      Array.from(g.children).filter(c => !c.classList.contains('proc-arrow')).forEach((c, i) => c.classList.add(`stagger-${Math.min(i+1,6)}`));
    });
  });

  /* reveal */
  const els = document.querySelectorAll('.fw-card, .srv-card, .pkg-card, .proc-step, .ind-card, .faq__item, .channel-card, .principle, .form-wrap');
  els.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  els.forEach(el => io.observe(el));

})();
