/* Builds the pages of the Pro Fitness Studio site (shared header, footer, icons).
   All text, timings, phone and programs live here. Run: node build/build.js (from the site folder). */
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..');
const V = 1; // asset version, bump to break cache
const SITE_URL = 'https://abdullahsattar98.github.io/pro-fitness-studio/';

/* ---------- business data ---------- */
const PHONE = '0309 0503334', TEL = '+923090503334', WA = '923090503334';
const ADDRESS = 'Baldia Street, near Zahid, G Block Centre, Vehari';
const GEO = '30.0417523,72.3540467';
const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const WA_JOIN = wa('Hi Pro Fitness Studio! I want to join. Please share the details.');
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${GEO}`;
const MAPS = 'https://www.google.com/maps/place/Profitness+Studio/@30.0417523,72.3540467,17z';
const TIKTOK = 'https://www.tiktok.com/@pro_fitness_studio0';
const TIKTOK_COACH = 'https://www.tiktok.com/@fitnessabouthasham';
const INSTA = 'https://www.instagram.com/pro_fitness_studio1/';
const RATING = '5.0', REVIEW_COUNT = 48;
const HOURS = '4 PM to 11 PM';
const LADIES = [['Morning', '10:00 to 11:30 AM'], ['Afternoon', '2:00 to 4:00 PM']];

/* ---------- icons (Lucide style, 24px stroke) ---------- */
const P = d => `<path d="${d}"/>`;
const ICONS = {
  wa: '<path fill="currentColor" stroke="none" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.2-1.2l-.5-.2z"/>',
  phone: P('M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z'),
  pin: P('M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z') + '<circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/>' + P('M12 6v6l4 2'),
  arrow: P('M5 12h14M13 6l6 6-6 6'),
  check: P('M20 6 9 17l-5-5'),
  star: '<path fill="currentColor" stroke="none" d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/>',
  dumbbell: P('M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11'),
  flame: P('M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1-3.6 2.2-4.6.2 1.6 1 2.6 2 3 .3-3 .3-5.6.8-8.4z'),
  pulse: P('M3 12h4l2.5-6 4 12 2.5-6H21'),
  trophy: P('M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6'),
  coach: '<circle cx="12" cy="7" r="3.5"/>' + P('M5 21c.6-4 3.3-6.5 7-6.5s6.4 2.5 7 6.5'),
  diet: P('M12 7c-3-2.5-8-1-8 4.5C4 17 8 21 10.5 21c.8 0 1-.5 1.5-.5s.7.5 1.5.5C16 21 20 17 20 11.5 20 6 15 4.5 12 7zM12 7c0-2 1-3.5 3-4'),
  rehab: P('M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z') + P('M3.2 12h4.3l1.5-3 3 6 1.5-3h7.3'),
  female: '<circle cx="12" cy="9" r="5"/>' + P('M12 14v8M9 19h6'),
  tiktok: '<path fill="currentColor" stroke="none" d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z"/>',
  insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
  bolt: '<path fill="currentColor" stroke="none" d="M13.5 2H20l-3.2 7.7H20L8.8 22l2.2-9.4H7.4z"/>',
  menu: P('M4 7h16M4 12h16M4 17h16'),
  close: P('M6 6l12 12M18 6 6 18'),
};
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${Object.entries(ICONS)
  .map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${v}</symbol>`).join('')}</svg>`;
const ic = (n, cls = 'ic') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const stars = `<span class="stars" aria-label="5 out of 5 stars">${ic('star').repeat(5)}</span>`;

/* Temporary text logo, replaced by their real logo file when it arrives */
const LOGO = `<a class="logo" href="./" aria-label="Pro Fitness Studio, home"><span class="logo__main">PRO${ic('bolt', 'logo__bolt')}FITNESS</span><span class="logo__sub">STUDIO</span></a>`;

const PAGES = [['./', 'Home'], ['programs', 'Programs'], ['about', 'About'], ['contact', 'Contact']];

/* ---------- content ---------- */
const PROGRAMS = [
  { ic: 'dumbbell', t: 'Strength training', d: 'Machines and free weights, with help on form.', li: ['Machines, benches and free weights', 'The coach shows you the right form', 'A plan for muscle gain'] },
  { ic: 'flame', t: 'Weight loss', d: 'Workouts, cardio and a diet plan together.', li: ['Fat loss workouts', 'Diet plan from a dietitian', 'Weight checked every week'] },
  { ic: 'pulse', t: 'Cardio', d: 'Proper cardio sessions for stamina.', li: ['Guided cardio sessions', 'Good for stamina and heart health', 'Can be mixed with weights'] },
  { ic: 'trophy', t: 'Body transformation', d: 'A full plan for a big change.', li: ['Workout and diet plan made for you', 'Progress photos and weight tracking', 'Real member results on the home page'] },
  { ic: 'coach', t: 'Personal training', d: 'One to one with a trainer.', li: ['A trainer with you the whole session', 'Plan changes as you improve', 'Best for beginners'] },
  { ic: 'diet', t: 'Diet plans', d: 'Normal home food, made by a dietitian.', li: ['Normal Pakistani food, no fancy items', 'For weight loss or weight gain', 'Updated as you progress'] },
  { ic: 'rehab', t: 'Rehab', d: 'Safe training after an injury or with back pain.', li: ['Back, knee and shoulder problems', 'Slow, safe exercises', 'Guided by a rehab specialist'] },
  { ic: 'female', t: 'Ladies only', d: 'Separate hours with a female trainer.', li: [`Morning ${LADIES[0][1]}`, `Afternoon ${LADIES[1][1]}`, 'Female trainer'] },
];
const progMsg = p => wa(`Hi Pro Fitness Studio! I want to ask about ${p.t.toLowerCase()}.`);

const RESULTS = [
  { i: 1, from: 130, to: 90, tag: 'Lost 40 kg' },
  { i: 2, from: 148, to: 100, tag: 'Lost 48 kg' },
  { i: 3, from: 122, to: 91, tag: 'Lost 31 kg' },
  { i: 5, from: 58, to: 80, tag: 'Gained 22 kg' },
  { i: 4, tag: 'Muscle gain' },
  { i: 6, tag: 'Body shape' },
];
// Google reviews, copied from the Maps listing (research-socials.md, 2026-11-26)
const REVIEWS = [
  ['Fazal Joyia', 'An absolute game-changer for my fitness journey! Profitness Studio offers state-of-the-art equipment, a very clean environment, and expert trainers who genuinely care about your progress.'],
  ['Rashid Sahu', 'Nice gym, first time in Vehari a professional gym with certified coach. Coaches guide everyone very nicely and the gym fees is very affordable.'],
  ['Sadia Amjad', 'Dr. Memona Hasham is a dedicated, professional, and highly encouraging trainer. Her guidance and motivating approach make workouts more effective and enjoyable. Highly recommended!'],
  ['Hasaan Bajwa', 'My dream gym, best in the whole Vehari with the best mentor Hasham Ahmad Siddiqui.'],
  ['Hamza Mushtaq', 'Very fabulous and great gym in our Vehari. Affordable fee and much care. Professional trainer and staff.'],
  ['Abdul Wahab', 'Very good gym for ladies n gents. Very good environment for all and very well trained persons for guidance.'],
];
// Owner titles, from his own Instagram, TikTok and Facebook bios
const TITLES = [['Mr Pakistan Olympia', '2021'], ['Mr Punjab', '2023'], ['Mr South Punjab', '2018']];
const DAYS = [['Monday', 1], ['Tuesday', 2], ['Wednesday', 3], ['Thursday', 4], ['Friday', 5], ['Saturday', 6], ['Sunday', 0]];

/* ---------- shared parts ---------- */
const img = (name, widths, alt, sizes, extra = '') => {
  const big = widths[widths.length - 1];
  return `<img src="assets/img/${name}-${big}.webp" srcset="${widths.map(w => `assets/img/${name}-${w}.webp ${w}w`).join(', ')}" sizes="${sizes}" alt="${alt}" ${extra}>`;
};

function head(title, desc, file) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#0a0c0f">
<link rel="canonical" href="${SITE_URL}${file === 'index.html' ? '' : file.replace('.html', '')}">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${SITE_URL}assets/img/og.jpg">
<meta property="og:url" content="${SITE_URL}">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62,800;0,100,400..700;1,62,900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css?v=${V}">
${file === 'index.html' ? '<link rel="preload" as="image" href="assets/img/gym-floor-640.webp" imagesrcset="assets/img/gym-floor-640.webp 640w, assets/img/gym-floor-1080.webp 1080w, assets/img/gym-floor-1800.webp 1800w" imagesizes="100vw">' : ''}
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'ExerciseGym', name: 'Pro Fitness Studio', alternateName: 'Profitness Studio',
    telephone: TEL, url: SITE_URL, image: SITE_URL + 'assets/img/og.jpg', sameAs: [INSTA, TIKTOK],
    address: { '@type': 'PostalAddress', streetAddress: 'Baldia Street, near Zahid, G Block Centre', addressLocality: 'Vehari', postalCode: '61100', addressCountry: 'PK' },
    geo: { '@type': 'GeoCoordinates', latitude: 30.0417523, longitude: 72.3540467 },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '16:00', closes: '23:00' }],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: RATING, reviewCount: REVIEW_COUNT },
  })}</script>
<script>document.documentElement.classList.add('js')</script>
</head>`;
}

function header(active) {
  const cur = h => (h === active ? ' aria-current="page"' : '');
  return `<body>
${SPRITE}
<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <div class="wrap nav__bar">
    ${LOGO}
    <nav class="nav__links" aria-label="Main">${PAGES.map(([h, n]) => `<a href="${h}"${cur(h)}>${n}</a>`).join('')}</nav>
    <a class="btn btn--blue btn--sm nav__cta" href="${WA_JOIN}" target="_blank" rel="noopener">${ic('wa')}Join on WhatsApp</a>
    <button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">${ic('menu', 'ic burger__open')}${ic('close', 'ic burger__close')}</button>
  </div>
  <div class="drawer" id="drawer">
    <nav aria-label="Menu">${PAGES.map(([h, n]) => `<a href="${h}"${cur(h)}>${n}${ic('arrow')}</a>`).join('')}</nav>
    <div class="drawer__foot">
      <a class="btn btn--blue" href="${WA_JOIN}" target="_blank" rel="noopener">${ic('wa')}Join on WhatsApp</a>
      <a class="btn btn--line" href="tel:${TEL}">${ic('phone')}Call ${PHONE}</a>
    </div>
  </div>
</header>
<main id="main">`;
}

const FOOTER = `
</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot__top">
      <div class="foot__brand">
        ${LOGO}
        <p>Gym in G Block Centre, Vehari. Training, diet plans and rehab with Mr. Pakistan Hasham Ahmad Siddiqui.</p>
        <div class="socials">
          <a href="${INSTA}" target="_blank" rel="noopener" aria-label="Instagram">${ic('insta')}</a>
          <a href="${TIKTOK}" target="_blank" rel="noopener" aria-label="TikTok">${ic('tiktok')}</a>
          <a href="${WA_JOIN}" target="_blank" rel="noopener" aria-label="WhatsApp">${ic('wa')}</a>
        </div>
      </div>
      <div class="foot__col">
        <h2>Pages</h2>
        <ul>${PAGES.map(([h, n]) => `<li><a href="${h}">${n}</a></li>`).join('')}</ul>
      </div>
      <div class="foot__col">
        <h2>Timings</h2>
        <ul><li>Mon to Sat, ${HOURS}</li><li>Ladies: ${LADIES.map(l => l[1]).join(' and ')}</li><li>Sunday closed</li></ul>
      </div>
      <div class="foot__col">
        <h2>Visit</h2>
        <ul>
          <li><a href="${DIRECTIONS}" target="_blank" rel="noopener">${ADDRESS}</a></li>
          <li><a href="tel:${TEL}">${PHONE}</a></li>
        </ul>
      </div>
    </div>
    <div class="foot__bottom">
      <span>© <span data-year>2026</span> Pro Fitness Studio, Vehari</span>
      <span>Website by <a href="https://abdullahsattar.online" target="_blank" rel="noopener">Abdullah Sattar</a></span>
    </div>
  </div>
</footer>
<a class="wa-float" href="${WA_JOIN}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${ic('wa')}</a>
<script src="assets/js/site.js?v=${V}" defer></script>
</body>
</html>`;

const TICKER = (() => {
  const items = PROGRAMS.map(p => `<span>${p.t}</span>${ic('bolt', 'ic tick__bolt')}`).join('');
  return `<div class="band band--tick" aria-hidden="true"><div class="tick"><div class="tick__track">${items}${items}</div></div></div>`;
})();

const status = `<span class="status" data-status><i></i><span>Checking hours</span></span>`;

/* ---------- sections ---------- */
const HERO = `
<section class="hero">
  <div class="hero__bg">${img('gym-floor', [640, 1080, 1800], 'The main floor of Pro Fitness Studio with hexagon ceiling lights', '100vw', 'fetchpriority="high"')}</div>
  <div class="wrap hero__in">
    <p class="eyebrow">${ic('pin')}G Block Centre, Vehari</p>
    <h1 class="display hero__title"><span class="ln"><span>Train with</span></span><span class="ln"><span class="blue">Mr. Pakistan.</span></span></h1>
    <p class="hero__lead">Hasham Ahmad Siddiqui's gym. He makes your workout and your diet plan himself, then keeps an eye on your progress.</p>
    <div class="hero__ctas">
      <a class="btn btn--blue" href="${WA_JOIN}" target="_blank" rel="noopener">${ic('wa')}Join on WhatsApp</a>
      <a class="btn btn--line" href="tel:${TEL}">${ic('phone')}Call now</a>
    </div>
    <ul class="hero__facts">
      <li><b>${RATING} ${stars}</b><small>${REVIEW_COUNT} Google reviews</small></li>
      <li><b>${HOURS}</b><small>Mon to Sat</small></li>
      <li><b>${status}</b><small>Right now</small></li>
    </ul>
  </div>
</section>
${TICKER}`;

const COACH = `
<section class="sec coach">
  <div class="wrap coach__grid">
    <figure class="coach__photo rv">
      <img src="assets/img/coach-600.webp" alt="Hasham Ahmad Siddiqui, owner and head coach of Pro Fitness Studio" width="600" height="1190" loading="lazy">
      <figcaption class="tag">${ic('trophy')}Mr. Pakistan</figcaption>
    </figure>
    <div class="coach__txt">
      <h2 class="display h2 rv">The coach is<br>the owner.</h2>
      <p class="lead rv">Hasham Ahmad Siddiqui runs the floor himself. Every member gets a plan from him: what to train, what to eat at home, and how to train around old injuries.</p>
      <ul class="titles rv">${TITLES.map(([t, y]) => `<li><b>${t}</b><span>${y}</span></li>`).join('')}</ul>
      <ul class="chips rv">
        <li>${ic('check')}Certified fitness trainer</li>
        <li>${ic('check')}Dietitian</li>
        <li>${ic('check')}Rehab specialist</li>
      </ul>
      <div class="row rv">
        <a class="btn btn--blue" href="${wa('Hi! I want to train with Hasham Ahmad Siddiqui at Pro Fitness Studio. Please share the details.')}" target="_blank" rel="noopener">${ic('wa')}Join on WhatsApp</a>
        <a class="btn btn--ghost" href="${TIKTOK_COACH}" target="_blank" rel="noopener">${ic('tiktok')}Watch him train</a>
      </div>
    </div>
  </div>
</section>`;

const RESULTS_SEC = `
<section class="sec results" id="results">
  <div class="wrap">
    <div class="sec__head rv">
      <h2 class="display h2">Real members.<br><span class="blue">Real kilos.</span></h2>
      <p>Drag the line to see before and after. Every one of them trained here.</p>
    </div>
    <div class="results__grid">
      <div class="ba rv" style="--x:50%">
        <img class="ba__after" src="assets/img/ba-1-after.webp" alt="Member after training" width="480" height="600" draggable="false">
        <div class="ba__before"><img src="assets/img/ba-1-before.webp" alt="Member before training" width="480" height="600" draggable="false"></div>
        <span class="ba__tag ba__tag--b">Before</span><span class="ba__tag ba__tag--a">After</span>
        <div class="ba__line"><span class="ba__knob">${ic('bolt')}</span></div>
        <div class="ba__kg"><b data-kg>130 → 90 kg</b><span data-kgtag>Lost 40 kg</span></div>
        <input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after">
      </div>
      <div class="results__side">
        <div class="score rv">
          <div><b class="num" data-count="48">48</b><span>kg</span><small>Biggest weight loss</small></div>
          <div><b class="num" data-count="22">22</b><span>kg</span><small>Muscle gained</small></div>
        </div>
        <div class="pick rv" role="group" aria-label="Choose a member">${RESULTS.map((m, k) => `<button type="button" class="pick__btn${k === 0 ? ' on' : ''}" aria-pressed="${k === 0}" data-i="${m.i}" ${m.from ? `data-from="${m.from}" data-to="${m.to}"` : ''} data-tag="${m.tag}"><b>${m.from ? `${m.from} → ${m.to}` : m.tag}</b><small>${m.from ? m.tag : 'Before and after'}</small></button>`).join('')}</div>
      </div>
    </div>
  </div>
</section>`;

const PROGRAMS_SEC = `
<section class="sec">
  <div class="wrap">
    <div class="sec__head sec__head--row rv">
      <h2 class="display h2">What you can<br>train for</h2>
      <a class="more" href="programs">All programs ${ic('arrow')}</a>
    </div>
    <div class="cards">${PROGRAMS.map((p, k) => `
      <a class="card rv" style="--d:${(k % 4) * 60}ms" href="${progMsg(p)}" target="_blank" rel="noopener">
        <span class="card__ic">${ic(p.ic)}</span>
        <b>${p.t}</b>
        <small>${p.d}</small>
        <span class="card__go">Ask ${ic('arrow')}</span>
      </a>`).join('')}
    </div>
  </div>
</section>`;

const LADIES_SEC = `
<section class="sec sec--tight">
  <div class="wrap">
    <div class="ladies rv">
      <div class="ladies__txt">
        <h2 class="display h2">Ladies only hours</h2>
        <p>Only women in the gym during these hours, with a female trainer, Dr. Mamoona Hasham.</p>
        <span class="ur" lang="ur" dir="rtl">خواتین کے لیے الگ اوقات</span>
      </div>
      <div class="ladies__slots">
        ${LADIES.map(([n, t]) => `<div class="slot"><small>${n}</small><b>${t}</b></div>`).join('')}
        <a class="btn btn--blue" href="${wa('Hi Pro Fitness Studio! I want to ask about the ladies only hours.')}" target="_blank" rel="noopener">${ic('wa')}Ask on WhatsApp</a>
      </div>
    </div>
  </div>
</section>`;

const GALLERY = `
<section class="sec sec--tight">
  <div class="wrap">
    <div class="sec__head rv"><h2 class="display h2">Inside the gym</h2></div>
    <div class="gallery swipe rv">
      <figure>${img('gym-floor', [640, 1080], 'Main floor with dumbbell racks and benches', '(min-width: 900px) 50vw, 85vw', 'loading="lazy"')}<figcaption>Main floor</figcaption></figure>
      <figure>${img('gym-machines', [640, 1200], 'Machines and cable stations', '(min-width: 900px) 25vw, 85vw', 'loading="lazy"')}<figcaption>Machines</figcaption></figure>
      <figure>${img('gym-reception', [640, 1200], 'Reception with the trophies', '(min-width: 900px) 25vw, 85vw', 'loading="lazy"')}<figcaption>Reception and trophies</figcaption></figure>
    </div>
  </div>
</section>`;

const REVIEWS_SEC = `
<section class="sec sec--tight">
  <div class="wrap">
    <div class="sec__head sec__head--row rv">
      <h2 class="display h2">What members say</h2>
      <a class="gscore" href="${MAPS}" target="_blank" rel="noopener"><b>${RATING}</b><span>${stars}<small>${REVIEW_COUNT} reviews on Google</small></span></a>
    </div>
    <div class="reviews swipe rv">${REVIEWS.map(([n, q]) => `
      <figure class="rev">
        ${stars}
        <blockquote>${q}</blockquote>
        <figcaption><span class="rev__av">${n[0]}</span><span><b>${n}</b><small>Google review</small></span></figcaption>
      </figure>`).join('')}
    </div>
  </div>
</section>`;

const TIMES = `
<div class="times rv">
  <div class="times__head"><h3>Opening hours</h3>${status}</div>
  <div class="week">${DAYS.map(([n, d]) => `<div class="day${d === 0 ? ' off' : ''}" data-d="${d}"><span>${n}</span><b>${d === 0 ? 'Closed' : HOURS}</b></div>`).join('')}</div>
  <p class="muted small">Ladies only: ${LADIES.map(l => l[1]).join(' and ')}, Monday to Saturday.</p>
</div>`;

const VISIT = `
<section class="sec">
  <div class="wrap visit">
    <div class="visit__cta band band--cta rv">
      <h2 class="display h2">Come and see<br>the gym.</h2>
      <p>Walk in any day except Sunday, or send a WhatsApp message and we'll reply.</p>
      <div class="row">
        <a class="btn btn--white" href="${WA_JOIN}" target="_blank" rel="noopener">${ic('wa')}Join on WhatsApp</a>
        <a class="btn btn--line" href="${DIRECTIONS}" target="_blank" rel="noopener">${ic('pin')}Get directions</a>
      </div>
    </div>
    ${TIMES}
  </div>
</section>`;

const pageHead = (title, lead, imgName) => `
<section class="phead">
  ${imgName ? `<div class="phead__bg">${img(imgName, [640, 1200], '', '100vw', 'fetchpriority="high"')}</div>` : ''}
  <div class="wrap">
    <h1 class="display h1">${title}</h1>
    <p class="lead">${lead}</p>
  </div>
</section>
${TICKER}`;

/* ---------- pages ---------- */
const home = `${HERO}${COACH}${RESULTS_SEC}${PROGRAMS_SEC}${LADIES_SEC}${GALLERY}${REVIEWS_SEC}${VISIT}`;

const BMI = `
<section class="sec" id="bmi">
  <div class="wrap">
    <div class="sec__head rv"><h2 class="display h2">Check your BMI</h2><p>Enter your weight and height to see where you stand and which program fits.</p></div>
    <div class="bmi rv">
      <div class="bmi__form">
        <div class="seg" role="group" aria-label="Height unit"><button class="on" aria-pressed="true" data-u="ft" type="button">Feet and inches</button><button aria-pressed="false" data-u="cm" type="button">Centimetres</button></div>
        <label class="field"><span>Weight</span><span class="unit"><input id="bmi-w" type="number" inputmode="decimal" placeholder="70" min="20" max="300"><i>kg</i></span></label>
        <div class="field" id="bmi-ftrow"><span>Height</span><div class="two"><label class="unit"><input id="bmi-ft" type="number" inputmode="numeric" placeholder="5" min="3" max="8" aria-label="Feet"><i>ft</i></label><label class="unit"><input id="bmi-in" type="number" inputmode="numeric" placeholder="8" min="0" max="11" aria-label="Inches"><i>in</i></label></div></div>
        <label class="field" id="bmi-cmrow" hidden><span>Height</span><span class="unit"><input id="bmi-cm" type="number" inputmode="numeric" placeholder="172" min="100" max="250"><i>cm</i></span></label>
      </div>
      <div class="bmi__out" aria-live="polite">
        <div class="bmi__val"><b id="bmi-val">--</b><span id="bmi-cat">Enter your details</span></div>
        <div class="meter"><i style="--c:#5aa8ff"></i><i style="--c:#2fc27a"></i><i style="--c:#f0a63c"></i><i style="--c:#ef5563"></i><span class="meter__pin" id="bmi-pin" hidden></span></div>
        <div class="meter__lab"><span>Under</span><span>Healthy</span><span>Over</span><span>Obese</span></div>
        <p id="bmi-tip" class="muted">BMI is only a rough guide. The coach checks you properly when you visit.</p>
        <a class="btn btn--blue" id="bmi-cta" href="${WA_JOIN}" target="_blank" rel="noopener">${ic('wa')}Ask for a plan</a>
      </div>
    </div>
  </div>
</section>`;

const programs = `
${pageHead('Programs', 'Every program comes with a plan from a certified trainer. Tap one to ask about it on WhatsApp.', 'gym-machines')}
<section class="sec">
  <div class="wrap">
    <div class="pcards">${PROGRAMS.map((p, k) => `
      <article class="pcard rv" style="--d:${(k % 2) * 80}ms">
        <span class="card__ic">${ic(p.ic)}</span>
        <h2>${p.t}</h2>
        <p>${p.d}</p>
        <ul>${p.li.map(l => `<li>${ic('check')}${l}</li>`).join('')}</ul>
        <a class="btn btn--line btn--sm" href="${progMsg(p)}" target="_blank" rel="noopener">${ic('wa')}Ask about this</a>
      </article>`).join('')}
    </div>
    <p class="muted small note">Fees depend on the program. Send a WhatsApp message and we'll tell you.</p>
  </div>
</section>
${BMI}
${VISIT}`;

const STEPS = [
  ['Message or walk in', 'Send a WhatsApp message or come to the gym, Monday to Saturday.'],
  ['Meet the coach', 'Tell him your goal, your weight and any old injuries or pain.'],
  ['Get your plan', 'A workout plan and a diet plan with normal home food.'],
  ['Train and track', 'Your weight and progress get checked, and the plan changes as you improve.'],
];
const about = `
${pageHead('About the gym', 'A gym in G Block Centre, Vehari, run by Mr. Pakistan Hasham Ahmad Siddiqui: certified trainer, dietitian and rehab specialist.', 'gym-reception')}
${COACH}
<section class="sec sec--tight">
  <div class="wrap">
    <div class="sec__head rv"><h2 class="display h2">How joining works</h2></div>
    <ol class="steps">${STEPS.map(([t, d], k) => `<li class="rv" style="--d:${k * 70}ms"><span class="steps__n">${k + 1}</span><b>${t}</b><p>${d}</p></li>`).join('')}</ol>
  </div>
</section>
<section class="sec sec--tight">
  <div class="wrap">
    <div class="sec__head rv"><h2 class="display h2">The trainers</h2></div>
    <div class="trainers">
      <article class="trainer rv"><img src="assets/img/coach-600.webp" alt="" width="600" height="1190" loading="lazy"><div><h3>Hasham Ahmad Siddiqui</h3><p class="blue-t">Owner and head coach</p><p>Mr. Pakistan. Certified fitness trainer, dietitian and rehab specialist.</p><a class="more" href="${TIKTOK_COACH}" target="_blank" rel="noopener">${ic('tiktok')}His TikTok</a></div></article>
      <article class="trainer rv"><span class="trainer__av">M</span><div><h3>Dr. Mamoona Hasham</h3><p class="blue-t">Female trainer, ladies hours</p><p>Members on Google call her supportive, professional and very motivating.</p></div></article>
      <article class="trainer rv"><span class="trainer__av">F</span><div><h3>Farhan Mustafa</h3><p class="blue-t">Trainer</p><p>Named by members on Google as one of the gym's professional trainers.</p></div></article>
    </div>
  </div>
</section>
${GALLERY}
${VISIT}`;

const contact = `
${pageHead('Contact', 'Fill the form and WhatsApp opens with your message ready. Or just call.', '')}
<section class="sec">
  <div class="wrap contact">
    <form class="cform rv" id="join-form">
      <h2 class="h3">Join the gym</h2>
      <label class="field"><span>Your name</span><input name="name" required autocomplete="name" placeholder="Ali Khan"></label>
      <fieldset class="field"><legend>Your goal</legend><div class="opts">${[...PROGRAMS.map(p => p.t), 'Not sure yet'].map((t, k) => `<label class="opt"><input type="radio" name="goal" value="${t}"${k === 0 ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div></fieldset>
      <fieldset class="field"><legend>Preferred time</legend><div class="opts">${['Evening (4 to 8 PM)', 'Night (8 to 11 PM)', 'Ladies morning (10 to 11:30 AM)', 'Ladies afternoon (2 to 4 PM)'].map((t, k) => `<label class="opt"><input type="radio" name="time" value="${t}"${k === 0 ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div></fieldset>
      <label class="field"><span>Message (optional)</span><textarea name="msg" rows="3" placeholder="Anything the coach should know, like an injury"></textarea></label>
      <button class="btn btn--blue btn--full" type="submit">${ic('wa')}Send on WhatsApp</button>
    </form>
    <div class="contact__side">
      <div class="info rv">
        <a href="${WA_JOIN}" target="_blank" rel="noopener"><span class="info__ic info__ic--wa">${ic('wa')}</span><span><small>WhatsApp</small><b>${PHONE}</b></span></a>
        <a href="tel:${TEL}"><span class="info__ic">${ic('phone')}</span><span><small>Call</small><b>${PHONE}</b></span></a>
        <a href="${DIRECTIONS}" target="_blank" rel="noopener"><span class="info__ic">${ic('pin')}</span><span><small>Address</small><b>${ADDRESS}</b></span></a>
        <a href="${INSTA}" target="_blank" rel="noopener"><span class="info__ic">${ic('insta')}</span><span><small>Instagram</small><b>@pro_fitness_studio1</b></span></a>
        <a href="${TIKTOK}" target="_blank" rel="noopener"><span class="info__ic">${ic('tiktok')}</span><span><small>TikTok</small><b>@pro_fitness_studio0</b></span></a>
      </div>
      ${TIMES}
    </div>
  </div>
  <div class="wrap"><div class="map rv"><iframe src="https://www.google.com/maps?q=${GEO}&z=16&output=embed" title="Pro Fitness Studio on Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div>
</section>`;

const notFound = `
<section class="phead nf">
  <div class="wrap">
    <h1 class="display h1">404</h1>
    <p class="lead">This page doesn't exist.</p>
    <a class="btn btn--blue" href="./">Back to home</a>
  </div>
</section>`;

const DESC = 'Pro Fitness Studio, G Block Centre, Vehari. Training, diet plans, rehab and ladies only hours with Mr. Pakistan Hasham Ahmad Siddiqui. Call or WhatsApp 0309 0503334.';
const build = [
  ['index.html', './', 'Pro Fitness Studio | Gym in Vehari', home],
  ['programs.html', 'programs', 'Programs | Pro Fitness Studio Vehari', programs],
  ['about.html', 'about', 'About | Pro Fitness Studio Vehari', about],
  ['contact.html', 'contact', 'Contact | Pro Fitness Studio Vehari', contact],
  ['404.html', '', 'Page not found | Pro Fitness Studio', notFound],
];
for (const [file, url, title, body] of build) {
  let html = head(title, DESC, file) + '\n' + header(url) + body + FOOTER;
  if (file === '404.html') html = html.replace('<head>', '<head>\n<base href="/pro-fitness-studio/">');
  fs.writeFileSync(path.join(OUT, file), html);
  console.log('built', file, (html.length / 1024).toFixed(0) + ' KB');
}
fs.writeFileSync(path.join(OUT, 'assets', 'img', 'favicon.svg'),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0a0c0f"/><path d="M36 6h17l-8.5 20.5H53L23 58l6-25H19.6z" fill="#2f6fe4"/></svg>');
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
