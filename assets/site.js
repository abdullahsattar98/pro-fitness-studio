/* core.js */
{
/* core: header, menu, bottom bar, reveal-on-view, swipe arrows, shared helpers on window.PF */
const PF = window.PF = {
  reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
  /* Current time in Pakistan (UTC+5, no daylight saving), whatever the visitor's clock says.
     Returns { day: 0-6 (0 = Sunday), min: minutes since midnight } */
  nowPK() { const d = new Date(Date.now() + 5 * 3600e3); return { day: d.getUTCDay(), min: d.getUTCHours() * 60 + d.getUTCMinutes() }; },
  toMin(hm) { const [h, m] = hm.split(':').map(Number); return h * 60 + m; },
  t12(min) { let h = Math.floor(min / 60) % 24, m = min % 60; const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${String(m).padStart(2, '0')} ${ap}`; },
  /* Run cb(el) once when el is mostly in view (at least `share` of it, or as much as fits on screen). */
  onView(el, cb, share = 0.55) {
    if (!('IntersectionObserver' in window)) return cb(el);
    const fit = () => Math.min(share, (innerHeight * 0.85) / Math.max(1, el.offsetHeight));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio >= fit() - 0.01) { io.disconnect(); cb(el); } }),
      { threshold: [0, .1, .2, .3, .4, .5, .55, .6, .7, .8, .9, 1] });
    io.observe(el);
  },
};

/* header turns solid after scrolling; bottom bar shows after the first screen */
const hdr = document.querySelector('[data-hdr]'), bar = document.querySelector('[data-bar]');
let ticking = false;
const onScroll = () => {
  ticking = false; const y = scrollY;
  hdr && hdr.classList.toggle('is-solid', y > 24);
  bar && bar.classList.toggle('is-on', y > innerHeight * 0.55);
};
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* phone menu */
const mBtn = document.querySelector('[data-menu-btn]'), menu = document.querySelector('[data-menu]');
if (mBtn && menu) {
  const set = open => {
    mBtn.setAttribute('aria-expanded', open); document.documentElement.classList.toggle('menu-open', open);
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); }
    else { menu.classList.remove('is-open'); setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 320); }
  };
  mBtn.addEventListener('click', () => set(mBtn.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && mBtn.getAttribute('aria-expanded') === 'true') { set(false); mBtn.focus(); } });
}

/* reveal: elements with data-rv fade up once they are mostly in view. data-rv-delay="120" adds a delay in ms. */
document.querySelectorAll('[data-rv]').forEach(el => {
  if (PF.reduced) return el.classList.add('in');
  PF.onView(el, () => { const d = +el.dataset.rvDelay || 0; d ? setTimeout(() => el.classList.add('in'), d) : el.classList.add('in'); }, 0.4);
});

/* swipe rows: <div class="swipe" id="x">, arrows: <div class="swipe-nav" data-swipe-for="x"><button data-dir="-1">..</button><button data-dir="1">..</button></div> */
document.querySelectorAll('[data-swipe-for]').forEach(nav => {
  const row = document.getElementById(nav.dataset.swipeFor); if (!row) return;
  const [prev, next] = nav.querySelectorAll('button');
  const step = () => (row.firstElementChild ? row.firstElementChild.getBoundingClientRect().width + 12 : row.clientWidth);
  nav.addEventListener('click', e => { const b = e.target.closest('button'); if (b) row.scrollBy({ left: step() * +b.dataset.dir, behavior: PF.reduced ? 'auto' : 'smooth' }); });
  const upd = () => { prev.disabled = row.scrollLeft < 4; next.disabled = row.scrollLeft + row.clientWidth > row.scrollWidth - 4; };
  row.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
});

}
/* contact-page.js */
{
/* Contact page: WhatsApp message builder (nothing is sent by the site, it only fills the WhatsApp link) and the lazy map. */
const form = document.querySelector('[data-ct-form]');
if (form) {
  const out = document.querySelector('[data-ct-preview]'), send = document.querySelector('[data-ct-send]');
  const base = form.dataset.wa; // "https://wa.me/<number>?text="
  const list = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  const cleanName = v => v.replace(/[<>{}[\]\\/@#*_~`|=+^$%&]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40)
    .replace(/(^|\s)(\p{Ll})/gu, (m, s, c) => s + c.toUpperCase());

  const build = () => {
    const name = cleanName(form.elements.name.value);
    const goals = [...form.querySelectorAll('input[name="goal"]:checked')].map(i => i.dataset.say);
    const time = form.querySelector('input[name="time"]:checked');
    const parts = ['Hi Pro Fitness Studio!'];
    if (name) parts.push(`My name is ${name}.`);
    parts.push(goals.length ? `I want to ${list(goals)}.` : 'I want to join.');
    if (time) parts.push(`I would like to come in the ${time.dataset.say}.`);
    parts.push('Please share the details.');
    return parts.join(' ');
  };
  const chips = [...form.querySelectorAll('.ct-chip input')];
  const update = () => {
    const m = build(); out.textContent = m; send.href = base + encodeURIComponent(m);
    chips.forEach(i => i.closest('.ct-chip').classList.toggle('is-on', i.checked));
  };

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  /* tap a chosen time again to clear it (radios cannot do that on their own) */
  form.querySelectorAll('input[name="time"]').forEach(r => {
    let was = false;
    r.closest('label').addEventListener('pointerdown', () => { was = r.checked; });
    r.addEventListener('click', () => { if (was) { r.checked = false; update(); } was = false; });
  });
  /* Enter in the name field: open WhatsApp with the message */
  form.addEventListener('submit', e => { e.preventDefault(); update(); window.open(send.href, '_blank', 'noopener'); });
  update();
}

/* map: insert the Google map only when the frame comes into view, so the phone loads fast */
const ctMap = document.querySelector('[data-ct-map]');
if (ctMap && ctMap.dataset.src) {
  PF.onView(ctMap, () => {
    const f = document.createElement('iframe');
    f.className = 'ct-map__frame';
    f.title = 'Map';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.addEventListener('load', () => ctMap.classList.add('is-map'), { once: true });
    f.src = ctMap.dataset.src;
    ctMap.appendChild(f);
  }, 0.25);
}

}
/* daytrack.js */
{
/* Live day track: status line, lit current block, "now" marker, row tags, today in the day strip. Pakistan time. */
const DAYNAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function state(S) {
  const { day, min } = PF.nowPK();
  const bl = S.blocks.map((b, i) => ({ ...b, i, a: PF.toMin(b.from), z: PF.toMin(b.to) }));
  const openToday = S.days.includes(day);
  const nextOpenDay = d => { for (let k = 1; k <= 7; k++) { const n = (d + k) % 7; if (S.days.includes(n)) return { n, k }; } return null; };
  const first = bl[0], last = bl[bl.length - 1];
  const kindWord = b => b.kind === 'ladies' ? 'Ladies time' : 'Co-ed time';
  let cur = -1, next = -1, head, sub, open = false;
  if (openToday) {
    cur = bl.findIndex(b => min >= b.a && min < b.z);
    next = bl.findIndex(b => b.a > min);
  }
  if (cur > -1) {
    const b = bl[cur]; open = true;
    head = b.kind === 'ladies' ? 'Ladies time now' : 'Open now';
    sub = b.kind === 'ladies' ? `Women only until ${PF.t12(b.z)}` : `Men and women until ${PF.t12(b.z)}`;
  } else if (openToday && next > -1) {
    const b = bl[next];
    head = next === 0 ? `Opens at ${PF.t12(b.a)}` : 'Closed now';
    sub = next === 0 ? `Ladies first, co-ed from ${PF.t12(last.a)}` : `${kindWord(b)} starts at ${PF.t12(b.a)}`;
  } else {
    const nd = nextOpenDay(day);
    head = openToday ? 'Closed for today' : 'Closed today';
    sub = nd ? `Opens ${nd.k === 1 ? 'tomorrow' : DAYNAME[nd.n]} at ${PF.t12(first.a)}` : '';
  }
  const A = PF.toMin(S.from), Z = PF.toMin(S.to);
  const nowPct = openToday && min >= A && min <= Z ? (min - A) / (Z - A) * 100 : null;
  return { day, min, cur, next: cur > -1 ? (bl.findIndex(b => b.a > min)) : next, head, sub, open, nowPct, openToday };
}

document.querySelectorAll('[data-dt]').forEach(el => {
  const S = JSON.parse(el.dataset.sched);
  const render = () => {
    const st = state(S);
    el.classList.toggle('is-open', st.open);
    el.querySelector('[data-dt-head]').textContent = st.head;
    el.querySelector('[data-dt-sub]').textContent = st.sub;
    el.querySelectorAll('.dt__blk').forEach(b => { const i = +b.dataset.i; b.classList.toggle('is-now', i === st.cur); b.classList.toggle('is-next', i === st.next && st.cur === -1); });
    const now = el.querySelector('[data-dt-now]');
    if (st.nowPct === null) now.hidden = true; else { now.hidden = false; now.style.setProperty('--x', st.nowPct.toFixed(2) + '%'); now.dataset.edge = st.nowPct < 12 ? 'l' : st.nowPct > 88 ? 'r' : ''; now.querySelector('[data-dt-nowlabel]').textContent = 'Now ' + PF.t12(st.min); }
    el.querySelectorAll('.dt__row').forEach(r => {
      const i = +r.dataset.i, tag = r.querySelector('[data-dt-tag]');
      const b = S.blocks[i], done = st.openToday && st.min >= PF.toMin(b.to);
      r.classList.toggle('is-now', i === st.cur); r.classList.toggle('is-next', i === st.next && st.cur === -1); r.classList.toggle('is-done', done && i !== st.cur);
      tag.textContent = i === st.cur ? 'Now' : (i === st.next && st.cur === -1 ? 'Next' : (!st.openToday ? '' : done ? 'Done today' : ''));
    });
    el.querySelectorAll('.dt__day').forEach(d => d.classList.toggle('is-today', +d.dataset.day === st.day));
  };
  render();
  setInterval(render, 30000);
  // draw-in: bars grow, then the now marker slides to its place, once the track is mostly in view
  if (PF.reduced) el.classList.add('is-drawn');
  else PF.onView(el.querySelector('.dt__rail'), () => el.classList.add('is-drawn'), 0.9);
});

}
/* ladies.js */
{
/* Ladies hours: mark the slot that is on now, or the next one today (Pakistan time). */
const list = document.querySelector('[data-ladies]');
if (list) {
  const days = (list.dataset.days || '').split(',').map(Number);
  const mark = () => {
    const { day, min } = PF.nowPK();
    let next = null;
    list.querySelectorAll('.ladies__slot').forEach(li => {
      const tag = li.querySelector('.ladies__tag'); const a = PF.toMin(li.dataset.from), b = PF.toMin(li.dataset.to);
      li.classList.remove('is-now'); tag.hidden = true;
      if (!days.includes(day)) return;
      if (min >= a && min < b) { li.classList.add('is-now'); tag.textContent = 'On now'; tag.hidden = false; }
      else if (min < a && !next) next = li;
    });
    if (next && !list.querySelector('.is-now')) { const t = next.querySelector('.ladies__tag'); t.textContent = 'Next today'; t.hidden = false; }
  };
  mark(); setInterval(mark, 60e3);
}

}
/* results.js */
{
/* Results: before/after comparison slider (mouse, touch, keyboard) + member picker */
const frame = document.querySelector('[data-ba]');
if (frame) {
  const handle = frame.querySelector('.results__handle');
  const chips = [...document.querySelectorAll('.results [data-pick]')];
  let p = 50, tween = 0, touched = false;

  const set = v => {
    p = Math.max(0, Math.min(100, v));
    frame.style.setProperty('--p', p + '%');
    const r = Math.round(p);
    handle.setAttribute('aria-valuenow', r);
    handle.setAttribute('aria-valuetext', r <= 2 ? 'All after' : r >= 98 ? 'All before' : `${r} percent before`);
  };
  /* calm eased move from the current spot to `to` (used for the first hint and on member change) */
  const animate = (to, ms = 500, then) => {
    cancelAnimationFrame(tween);
    if (PF.reduced) { set(to); return then && then(); }
    const from = p, t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3); set(from + (to - from) * e); k < 1 ? (tween = requestAnimationFrame(step)) : then && then(); };
    tween = requestAnimationFrame(step);
  };
  const stop = () => { touched = true; cancelAnimationFrame(tween); };
  const fromX = x => { const r = frame.getBoundingClientRect(); return ((x - r.left) / r.width) * 100; };

  /* pointer: mouse drags at once; touch moves only on a sideways drag (so up/down still scrolls the page) or a tap */
  let drag = null;
  frame.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    stop();
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, live: e.pointerType === 'mouse' };
    if (drag.live) { set(fromX(e.clientX)); frame.classList.add('is-drag'); try { frame.setPointerCapture(e.pointerId); } catch (_) {} e.preventDefault(); }
  });
  frame.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.live) {
      const dx = Math.abs(e.clientX - drag.x), dy = Math.abs(e.clientY - drag.y);
      if (dx > 6 && dx > dy) { drag.live = true; frame.classList.add('is-drag'); try { frame.setPointerCapture(e.pointerId); } catch (_) {} }
      else return;
    }
    set(fromX(e.clientX));
  });
  const end = e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (e.type === 'pointerup' && !drag.live) animate(fromX(e.clientX), 280); // a tap jumps the line there
    drag = null; frame.classList.remove('is-drag');
  };
  frame.addEventListener('pointerup', end);
  frame.addEventListener('pointercancel', e => { drag = null; frame.classList.remove('is-drag'); });

  /* keyboard on the handle */
  handle.addEventListener('keydown', e => {
    const k = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -20, PageUp: 20 }[e.key];
    if (k) { stop(); set(p + k); e.preventDefault(); }
    else if (e.key === 'Home') { stop(); set(0); e.preventDefault(); }
    else if (e.key === 'End') { stop(); set(100); e.preventDefault(); }
  });

  /* member picker */
  chips.forEach(c => c.addEventListener('click', () => {
    const k = c.dataset.pick, cur = frame.querySelector('.results__pair:not([hidden])'), next = frame.querySelector(`[data-pair="${k}"]`);
    chips.forEach(x => x.setAttribute('aria-pressed', x === c));
    if (!next || next === cur) return;
    stop();
    if (cur) { cur.hidden = true; cur.classList.remove('is-in', 'is-on'); }
    next.hidden = false; next.classList.add('is-on');
    if (!PF.reduced) { next.classList.remove('is-in'); void next.offsetWidth; next.classList.add('is-in'); }
    animate(50, 380);
  }));

  /* when the slider is mostly in view: load the other members' photos, then one calm hint sweep */
  PF.onView(frame, () => {
    frame.querySelectorAll('.results__pair[hidden] img').forEach(i => { const im = new Image(); im.src = i.currentSrc || i.src; i.loading = 'eager'; });
    if (PF.reduced || touched) return;
    setTimeout(() => { if (!touched) animate(30, 550, () => { if (!touched) animate(50, 550); }); }, 250);
  }, 0.6);
}

}
/* training-page.js */
{
/* Training page: goal picker switches one offer panel (WAI-ARIA tabs, arrow keys work). */
const root = document.querySelector('[data-tp-offers]');
if (root) {
  const tabs = [...root.querySelectorAll('.tp-tab')], panels = [...root.querySelectorAll('.tp-panel')];
  const set = (i, focus) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      on ? t.removeAttribute('tabindex') : t.setAttribute('tabindex', '-1');
      panels[j].classList.toggle('is-on', on);
    });
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => t.addEventListener('click', () => set(i)));
  root.querySelector('.tp-tabs').addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement); if (i < 0) return;
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (k) { e.preventDefault(); set((i + k + tabs.length) % tabs.length, true); }
    else if (e.key === 'Home') { e.preventDefault(); set(0, true); }
    else if (e.key === 'End') { e.preventDefault(); set(tabs.length - 1, true); }
  });
  root.classList.add('is-ready');
}

}
/* visit.js */
{
/* Visit: insert the Google map only when the panel comes into view, so the phone loads fast */
const map = document.querySelector('[data-map]');
if (map && map.dataset.src) {
  PF.onView(map, () => {
    const f = document.createElement('iframe');
    f.className = 'visit__frame';
    f.title = 'Map: Pro Fitness Studio, Idress Plaza, Vehari';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.setAttribute('tabindex', '-1');
    f.addEventListener('load', () => map.classList.add('is-map'), { once: true });
    f.src = map.dataset.src;
    map.querySelector('.visit__canvas').appendChild(f);
  }, 0.25);
}

}