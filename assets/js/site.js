/* Pro Fitness Studio: menu, scroll reveals, open-now status, before/after slider, BMI, WhatsApp form. No libraries. */
(function () {
  const WA = '923090503334';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- menu ---------- */
  const burger = $('.burger');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  if (burger) {
    burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
    $$('.drawer a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- scroll reveals ---------- */
  const rv = $$('.rv');
  if (reduce || !('IntersectionObserver' in window)) rv.forEach(e => e.classList.add('in'));
  else {
    const io = new IntersectionObserver(en => en.forEach(x => {
      if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(e => io.observe(e));
  }

  /* ---------- count up numbers ---------- */
  const nums = $$('[data-count]');
  if (nums.length && !reduce && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver(en => en.forEach(x => {
      if (!x.isIntersecting) return;
      co.unobserve(x.target);
      const el = x.target, to = +el.dataset.count, t0 = performance.now();
      const step = now => {
        const p = Math.min(1, (now - t0) / 1100);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      el.textContent = '0';
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    nums.forEach(n => co.observe(n));
  }

  /* ---------- open now (Pakistan time) ---------- */
  // Mon to Sat 4 PM to 11 PM, ladies only 10 to 11:30 AM and 2 to 4 PM, Sunday closed
  const OPEN = 16 * 60, CLOSE = 23 * 60;
  const LADIES = [[10 * 60, 11 * 60 + 30], [14 * 60, 16 * 60]];
  function pkNow() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const g = t => parts.find(p => p.type === t).value;
    return { day: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[g('weekday')], min: (+g('hour') % 24) * 60 + +g('minute') };
  }
  function status() {
    const { day, min } = pkNow();
    const ladies = day !== 0 && LADIES.some(([a, b]) => min >= a && min < b);
    const main = day !== 0 && min >= OPEN && min < CLOSE;
    let text;
    if (ladies) text = 'Open now, ladies only';
    else if (main) text = 'Open now, till 11 PM';
    else if (day === 0 || (day === 6 && min >= CLOSE)) text = 'Closed, opens Monday';
    else if (min >= CLOSE) text = 'Closed, opens tomorrow';
    else text = 'Closed, opens 4 PM';
    $$('[data-status]').forEach(el => {
      el.classList.toggle('is-open', ladies || main); el.classList.toggle('is-closed', !(ladies || main));
      el.querySelector('span').textContent = text;
    });
    $$('.day').forEach(d => d.classList.toggle('is-today', +d.dataset.d === day));
  }
  status(); setInterval(status, 60000);
  $$('[data-year]').forEach(e => { e.textContent = new Date().getFullYear(); });

  /* ---------- before / after slider ---------- */
  const ba = $('.ba');
  if (ba) {
    const range = $('.ba__range', ba), kg = $('[data-kg]', ba), kgTag = $('[data-kgtag]', ba);
    const imgA = $('.ba__after', ba), imgB = $('.ba__before img', ba);
    const set = v => { ba.style.setProperty('--x', v + '%'); range.value = v; };
    range.addEventListener('input', () => set(+range.value));
    function sweep() {
      if (reduce) return;
      const t0 = performance.now();
      const step = now => {
        const p = Math.min(1, (now - t0) / 1500);
        set(50 + 30 * Math.sin(p * Math.PI * 2) * (1 - p));
        if (p < 1) requestAnimationFrame(step); else set(50);
      };
      requestAnimationFrame(step);
    }
    $$('.pick__btn').forEach(b => b.addEventListener('click', () => {
      $$('.pick__btn').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      const i = b.dataset.i;
      imgA.src = `assets/img/ba-${i}-after.webp`;
      imgB.src = `assets/img/ba-${i}-before.webp`;
      ba.classList.remove('swap'); void ba.offsetWidth; ba.classList.add('swap');
      kg.textContent = b.dataset.from ? `${b.dataset.from} → ${b.dataset.to} kg` : 'Before → After';
      kgTag.textContent = b.dataset.tag;
      kgTag.style.color = b.dataset.tag.startsWith('Lost') ? '' : '#9cc0ff';
      set(50);
    }));
    // load the other pairs once the slider is near, so switching is instant
    if ('IntersectionObserver' in window) {
      const o = new IntersectionObserver(en => {
        if (!en[0].isIntersecting) return;
        o.disconnect();
        $$('.pick__btn').forEach(b => ['before', 'after'].forEach(t => { new Image().src = `assets/img/ba-${b.dataset.i}-${t}.webp`; }));
        setTimeout(sweep, 500);
      }, { threshold: 0.5 });
      o.observe(ba);
    }
  }

  /* ---------- BMI ---------- */
  const bmi = $('#bmi');
  if (bmi) {
    let unit = 'ft';
    const w = $('#bmi-w'), ft = $('#bmi-ft'), inch = $('#bmi-in'), cm = $('#bmi-cm');
    $$('.seg button', bmi).forEach(b => b.addEventListener('click', () => {
      unit = b.dataset.u;
      $$('.seg button', bmi).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      $('#bmi-ftrow').hidden = unit !== 'ft'; $('#bmi-cmrow').hidden = unit !== 'cm';
      calc();
    }));
    const CATS = [
      [18.5, 'Underweight', '#5aa8ff', 'Under the healthy range. A weight gain diet with strength training will help.', 'strength training and a weight gain diet'],
      [25, 'Healthy', '#2fc27a', 'In the healthy range. Keep it there with regular training.', 'strength and cardio'],
      [30, 'Overweight', '#f0a63c', 'A bit above the healthy range. Cardio with a diet plan is the usual fix.', 'the weight loss program'],
      [99, 'Obese', '#ef5563', 'Well above the healthy range. Start with a guided weight loss plan.', 'guided weight loss'],
    ];
    const pin = $('#bmi-pin'), val = $('#bmi-val'), cat = $('#bmi-cat'), tip = $('#bmi-tip'), cta = $('#bmi-cta');
    const TIP0 = tip.textContent;
    function calc() {
      const kgv = parseFloat(w.value);
      const m = unit === 'ft' ? ((parseFloat(ft.value) || 0) * 30.48 + (parseFloat(inch.value) || 0) * 2.54) / 100 : (parseFloat(cm.value) || 0) / 100;
      if (!(kgv > 20 && kgv < 300 && m > 1 && m < 2.5)) { val.textContent = '--'; cat.textContent = 'Enter your details'; cat.style.color = ''; tip.textContent = TIP0; pin.hidden = true; return; }
      const v = kgv / (m * m), c = CATS.find(x => v < x[0]);
      val.textContent = v.toFixed(1);
      cat.textContent = c[1]; cat.style.color = c[2];
      tip.textContent = c[3];
      // meter scale: 12 to 40
      pin.hidden = false;
      pin.style.left = Math.max(1, Math.min(99, (v - 12) / 28 * 100)) + '%';
      cta.href = `https://wa.me/${WA}?text=${encodeURIComponent(`Hi Pro Fitness Studio! My BMI is ${v.toFixed(1)} (${c[1]}). I am interested in ${c[4]}. Please share the details.`)}`;
    }
    [w, ft, inch, cm].forEach(i => i.addEventListener('input', calc));
  }

  /* ---------- contact form: opens WhatsApp with the message ready ---------- */
  const form = $('#join-form');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const lines = [
      'Hi Pro Fitness Studio! I want to join.',
      `Name: ${f.get('name')}`,
      `Goal: ${f.get('goal')}`,
      `Preferred time: ${f.get('time')}`,
      f.get('msg') ? `Message: ${f.get('msg')}` : '',
    ].filter(Boolean);
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
})();
