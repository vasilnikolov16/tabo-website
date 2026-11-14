/* TÁBO — American Street Food
   Всичко тук е ванила JS: рисуване на бургерите слой по слой (SVG),
   меню-лаборатория с добавки, работно време на живо и дребни анимации. */

(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───────────────────────── ДАННИ ───────────────────────── */

  const BURGERS = [
    {
      id: 'og', short: 'OG', name: 'OG TÁBO', price: 8.99,
      note: 'Оригиналът. С него започна всичко.',
      ings: [['2× смаш кюфте', 'patty'], ['Чедър', 'cheese'], ['Лук', 'onion'], ['Кисели краставички', 'pickles'], ['Сос TÁBO', 'sauce']],
      stack: ['bunB', 'patty', 'cheese', 'patty', 'cheese', 'onion', 'pickles', 'sauce', 'bunT'],
    },
    {
      id: 'hangover', short: 'Hangover', name: 'Hangover Burger', price: 10.99,
      note: 'За сутринта след. Или за вечерта преди.',
      ings: [['2× смаш кюфте', 'patty'], ['Чедър', 'cheese'], ['Сладко от бекон', 'jam'], ['Лук', 'onion'], ['Кисели краставички', 'pickles'], ['Яйце', 'egg'], ['Сос TÁBO', 'sauce']],
      stack: ['bunB', 'patty', 'cheese', 'patty', 'cheese', 'jam', 'onion', 'pickles', 'egg', 'sauce', 'bunT'],
    },
    {
      id: 'classic', short: 'Classic', name: 'Classic TÁBO', price: 8.99,
      note: 'Класиката, както трябва да бъде.',
      ings: [['2× смаш кюфте', 'patty'], ['Чедър', 'cheese'], ['Маруля', 'lettuce'], ['Домати', 'tomato'], ['Лук', 'onion'], ['Кисели краставички', 'pickles'], ['Сос TÁBO', 'sauce']],
      stack: ['bunB', 'sauce', 'lettuce', 'patty', 'cheese', 'patty', 'cheese', 'tomato', 'onion', 'pickles', 'bunT'],
    },
    {
      id: 'spicy', short: 'Spicy', name: 'Spicy TÁBO', price: 8.99,
      note: 'Класиката, но с характер.',
      ings: [['2× смаш кюфте', 'patty'], ['Чедър', 'cheese'], ['Халапеньо', 'jalapeno'], ['Маруля', 'lettuce'], ['Домати', 'tomato'], ['Лук', 'onion'], ['Кисели краставички', 'pickles'], ['Сос TÁBO', 'sauce']],
      stack: ['bunB', 'sauce', 'lettuce', 'patty', 'cheese', 'patty', 'cheese', 'tomato', 'onion', 'pickles', 'jalapeno', 'bunT'],
    },
    {
      id: 'heart', short: 'Heart Attack', name: 'Heart Attack', price: 11.99,
      note: 'Името не е случайно.',
      ings: [['2× смаш кюфте', 'patty'], ['Чедър', 'cheese'], ['Бекон', 'bacon'], ['Мак енд чийз', 'mac'], ['Лук', 'onion'], ['BBQ сос', 'bbq'], ['Сос TÁBO', 'sauce']],
      stack: ['bunB', 'bbq', 'patty', 'cheese', 'patty', 'cheese', 'bacon', 'mac', 'onion', 'sauce', 'bunT'],
    },
    {
      id: 'junior', short: 'Junior', name: 'TÁBO Junior', price: 5.99,
      note: 'По-малък, не по-слаб.',
      ings: [['1× смаш кюфте', 'patty'], ['Чедър', 'cheese'], ['Маруля', 'lettuce'], ['Домати', 'tomato'], ['Лук', 'onion'], ['Кисели краставички', 'pickles'], ['Сос TÁBO', 'sauce']],
      stack: ['bunB', 'lettuce', 'patty', 'cheese', 'tomato', 'onion', 'pickles', 'sauce', 'bunT'],
    },
    {
      id: 'chicken', short: 'Chicken', name: 'TÁBO Chicken', price: 7.99,
      note: 'Хрупкаво отвън, сочно отвътре.',
      ings: [['Пилешко филе', 'chicken'], ['Салата коулслоу', 'slaw'], ['Кисели краставички', 'pickles'], ['Майо', 'mayo'], ['Сос TÁBO Chicken', 'csauce']],
      stack: ['bunB', 'mayo', 'chicken', 'slaw', 'pickles', 'csauce', 'bunT'],
    },
    {
      id: 'hotchick', short: 'Hotchick', name: 'TÁBO Hotchick', price: 7.99,
      note: 'Същото пиле, но люто.',
      ings: [['Пилешко филе', 'chicken'], ['Салата коулслоу', 'slaw'], ['Кисели краставички', 'pickles'], ['Халапеньо', 'jalapeno'], ['Майо', 'mayo'], ['Сос TÁBO Chicken', 'csauce']],
      stack: ['bunB', 'mayo', 'chicken', 'slaw', 'pickles', 'jalapeno', 'csauce', 'bunT'],
    },
  ];

  const EXTRAS = [
    { id: 'cheese', name: 'Чедър', price: 0.5 },
    { id: 'egg', name: 'Яйце', price: 1.0 },
    { id: 'bacon', name: 'Бекон', price: 1.0 },
    { id: 'patty', name: 'Смаш кюфте', price: 3.0 },
    { id: 'jalapeno', name: 'Халапеньо', price: 0.5 },
  ];
  const MAX_EXTRAS = 10;

  const QUIPS = [
    '', 'Добро начало.', 'Така те искам.', 'Вече става сериозно.', 'Ще ти трябват две ръце.',
    'И салфетки. Много салфетки.', 'Това още бургер ли е?', 'Челюстта ти има ли застраховка?',
    'Легенда.', 'Спри. Или недей.', 'Окей, това е кула.',
  ];

  // 0 = неделя … 6 = събота; минути от полунощ
  const HOURS = { 1: [570, 1320], 2: null, 3: [570, 1320], 4: [570, 1320], 5: [570, 1320], 6: [660, 1380], 0: [660, 1260] };
  const DAYS = ['Неделя', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота'];
  const DAYS_IN = ['в неделя', 'в понеделник', 'във вторник', 'в сряда', 'в четвъртък', 'в петък', 'в събота'];

  /* ───────────────────── РИСУВАНЕ НА СЛОЕВЕ ───────────────────── */

  const INK = '#140c08';
  const CX = 200;

  // детерминистичен „random", за да не мърда рисунката при всяко прерисуване
  const rng = (seed) => () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const o = (extra = '') => `stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" ${extra}`;

  // назъбен контур (смаш кюфте, панирано пиле)
  function craggy(w, h, seed, amp) {
    const r = rng(seed);
    const x0 = CX - w / 2, x1 = CX + w / 2;
    const n = Math.round(w / 22);
    const top = [], bot = [];
    for (let i = 0; i <= n; i++) {
      const x = x0 + (w * i) / n;
      top.push(`${x.toFixed(1)},${(r() * amp).toFixed(1)}`);
      bot.unshift(`${x.toFixed(1)},${(h - r() * amp).toFixed(1)}`);
    }
    return `M${x0 - 6},${h / 2} L${top.join(' L')} L${x1 + 6},${h / 2} L${bot.join(' L')} Z`;
  }

  function wavy(w, h, waves, drip, seed) {
    const r = rng(seed);
    const x0 = CX - w / 2;
    const step = w / waves;
    let d = `M${x0},${h * 0.5} Q${x0},0 ${x0 + 14},0 H${x0 + w - 14} Q${x0 + w},0 ${x0 + w},${h * 0.5}`;
    for (let i = waves; i > 0; i--) {
      const xa = x0 + step * i, xb = xa - step;
      const dy = h + (r() > 0.62 ? drip * (0.5 + r() * 0.6) : r() * 5);
      d += ` Q${xa - step * 0.5},${dy.toFixed(1)} ${xb},${h * 0.5 + 2}`;
    }
    return d + ' Z';
  }

  const LAYERS = {
    bunB: {
      h: 42,
      draw: () => {
        const w = 272, x0 = CX - w / 2, x1 = CX + w / 2;
        return `<path d="M${x0},8 Q${x0},0 ${x0 + 10},0 H${x1 - 10} Q${x1},0 ${x1},8 V18 Q${x1},42 ${x1 - 34},42 H${x0 + 34} Q${x0},42 ${x0},18 Z" fill="#e58a2c" ${o()}/>
                <path d="M${x0 + 6},9 H${x1 - 6}" stroke="#f8cf8e" stroke-width="7" stroke-linecap="round"/>
                <path d="M${x0 + 30},33 H${x1 - 30}" stroke="#b9661a" stroke-width="4" stroke-linecap="round" opacity=".6"/>`;
      },
    },
    bunT: {
      h: 92,
      draw: () => {
        const w = 284, x0 = CX - w / 2, x1 = CX + w / 2;
        return `<path d="M${x0},78 C${x0 - 4},20 ${x0 + 70},2 ${CX},2 C${x1 - 70},2 ${x1 + 4},20 ${x1},78 Q${x1},92 ${x1 - 14},92 H${x0 + 14} Q${x0},92 ${x0},78 Z" fill="#e8892a" ${o()}/>
                <path d="M${x0 + 26},50 C${x0 + 40},24 ${x0 + 84},14 ${CX - 20},13" fill="none" stroke="#ffd591" stroke-width="9" stroke-linecap="round" opacity=".85"/>
                <path d="M${x0 + 10},82 H${x1 - 10}" stroke="#b9661a" stroke-width="5" stroke-linecap="round" opacity=".55"/>
                <text x="${CX}" y="62" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="700" font-size="24" letter-spacing="3" fill="#a9540f" opacity=".75">TÁBO</text>`;
      },
    },
    patty: {
      h: 34,
      draw: (seed) => {
        const r = rng(seed + 5);
        let specks = '';
        for (let i = 0; i < 14; i++) {
          specks += `<circle cx="${(CX - 130 + r() * 260).toFixed(1)}" cy="${(8 + r() * 18).toFixed(1)}" r="${(1.6 + r() * 2.4).toFixed(1)}" fill="${r() > 0.5 ? '#2c1309' : '#8a4a2a'}"/>`;
        }
        return `<path d="${craggy(292, 34, seed, 7)}" fill="#5b2c16" ${o()}/>${specks}`;
      },
    },
    cheese: {
      h: 9,
      draw: (seed) => {
        const r = rng(seed + 9);
        const w = 304, x0 = CX - w / 2, x1 = CX + w / 2;
        const drips = [0.12, 0.34, 0.58, 0.83].map((p) => p + (r() - 0.5) * 0.08);
        let d = `M${x0},0 H${x1} L${x1 - 6},11`;
        [...drips].reverse().forEach((p) => {
          const x = x0 + w * p, len = 20 + r() * 20;
          d += ` L${x + 20},11 Q${x + 9},${len + 6} ${x},${len} Q${x - 9},${len + 6} ${x - 20},11`;
        });
        return `<path d="${d} L${x0 + 6},11 Z" fill="#ffc21a" ${o()}/><path d="M${x0 + 12},4 H${x1 - 12}" stroke="#ffe27a" stroke-width="3" stroke-linecap="round"/>`;
      },
    },
    pickles: {
      h: 13,
      draw: () => {
        let s = '';
        for (let i = 0; i < 6; i++) {
          const x = CX - 115 + i * 46;
          s += `<ellipse cx="${x}" cy="7" rx="27" ry="8" fill="#86ab3a" ${o()}/><ellipse cx="${x}" cy="6" rx="16" ry="3.2" fill="#c3da7b"/>`;
        }
        return s;
      },
    },
    onion: {
      h: 9,
      draw: () => {
        let s = '';
        for (let i = 0; i < 5; i++) {
          const x = CX - 108 + i * 54;
          s += `<ellipse cx="${x}" cy="5" rx="34" ry="6" fill="#f3e2ee" ${o()}/><ellipse cx="${x}" cy="5" rx="21" ry="2.4" fill="none" stroke="#a5407f" stroke-width="2.5"/>`;
        }
        return s;
      },
    },
    tomato: {
      h: 14,
      draw: () => {
        let s = '';
        for (let i = 0; i < 3; i++) {
          const x = CX - 138 + i * 94;
          s += `<rect x="${x}" y="0" width="88" height="14" rx="7" fill="#e3372b" ${o()}/><path d="M${x + 12},5 H${x + 60}" stroke="#ff8a78" stroke-width="3" stroke-linecap="round"/>`;
        }
        return s;
      },
    },
    lettuce: {
      h: 13,
      draw: (seed) => {
        const r = rng(seed + 3);
        const w = 318, x0 = CX - w / 2, n = 11, step = w / n;
        let d = `M${x0},4 Q${CX},-5 ${x0 + w},4`;
        for (let i = n; i > 0; i--) {
          const xa = x0 + step * i;
          d += ` Q${xa - step * 0.5},${(18 + r() * 14).toFixed(1)} ${xa - step},${(6 + r() * 4).toFixed(1)}`;
        }
        return `<path d="${d} Z" fill="#73bf43" ${o()}/><path d="M${x0 + 20},7 Q${CX},1 ${x0 + w - 20},7" fill="none" stroke="#b6e58b" stroke-width="3" stroke-linecap="round"/>`;
      },
    },
    jalapeno: {
      h: 12,
      draw: () => {
        let s = '';
        for (let i = 0; i < 7; i++) {
          const x = CX - 114 + i * 38;
          s += `<ellipse cx="${x}" cy="6" rx="19" ry="7" fill="#3f8a2a" ${o()}/><ellipse cx="${x}" cy="6" rx="10" ry="2.8" fill="#c9e79a"/><circle cx="${x - 4}" cy="6" r="1.3" fill="#3f8a2a"/><circle cx="${x + 4}" cy="6" r="1.3" fill="#3f8a2a"/>`;
        }
        return s;
      },
    },
    bacon: {
      h: 13,
      draw: () => {
        let s = '';
        [[-146, 3], [-4, 9]].forEach(([dx, y]) => {
          let d = `M${CX + dx},${y}`;
          for (let i = 0; i < 6; i++) d += ` q12.5,${i % 2 ? 9 : -9} 25,0`;
          s += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="${d}" fill="none" stroke="#b3212a" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="${d}" fill="none" stroke="#f3a08f" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="14 10"/>`;
        });
        return s;
      },
    },
    egg: {
      h: 15,
      draw: () => `<path d="${wavy(270, 13, 6, 9, 21)}" fill="#fffdf4" ${o()}/>
                   <path d="M${CX - 34},7 C${CX - 34},-20 ${CX + 34},-20 ${CX + 34},7 Z" fill="#ffab00" ${o()}/>
                   <path d="M${CX - 18},-4 Q${CX - 8},-11 ${CX + 4},-10" fill="none" stroke="#ffe08a" stroke-width="4" stroke-linecap="round"/>`,
    },
    mac: {
      h: 26,
      draw: (seed) => {
        const r = rng(seed + 31);
        let under = '', over = '';
        for (let i = 0; i < 26; i++) {
          const x = CX - 128 + r() * 256, y = 4 + r() * 16, rot = r() * 360;
          const d = 'M-8,0 a8,8 0 1 1 16,0';
          under += `<path d="${d}" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(0)})" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>`;
          over += `<path d="${d}" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(0)})" fill="none" stroke="${r() > 0.4 ? '#ffb82a' : '#ffd15c'}" stroke-width="6" stroke-linecap="round"/>`;
        }
        return `<path d="${wavy(280, 22, 7, 8, 44)}" fill="#f59a1b" ${o()}/>${under}${over}`;
      },
    },
    chicken: {
      h: 50,
      draw: (seed) => {
        const r = rng(seed + 17);
        let bumps = '';
        for (let i = 0; i < 26; i++) {
          const x = CX - 138 + r() * 276, y = 9 + r() * 32, rad = 4 + r() * 7;
          bumps += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(1)}" fill="${r() > 0.5 ? '#c5621a' : '#f3a552'}" opacity=".9"/>`;
        }
        return `<path d="${craggy(306, 50, seed + 2, 12)}" fill="#df7f2c" ${o()}/>${bumps}`;
      },
    },
    slaw: {
      h: 15,
      draw: (seed) => {
        const r = rng(seed + 23);
        const cols = ['#fff7e3', '#fff7e3', '#9a4c95', '#f08a24', '#fff7e3'];
        let under = '', over = '';
        for (let i = 0; i < 44; i++) {
          const x = CX - 132 + r() * 264, y = 2 + r() * 12, a = (r() - 0.5) * 1.3, len = 12 + r() * 14;
          const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len * 0.5;
          const seg = `M${x.toFixed(1)},${y.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`;
          under += `<path d="${seg}" stroke="${INK}" stroke-width="8.5" stroke-linecap="round"/>`;
          over += `<path d="${seg}" stroke="${cols[i % cols.length]}" stroke-width="4" stroke-linecap="round"/>`;
        }
        return under + over;
      },
    },
    sauce: { h: 8, draw: (s) => `<path d="${wavy(286, 9, 7, 20, s + 61)}" fill="#f59f5a" ${o()}/>` },
    csauce: { h: 8, draw: (s) => `<path d="${wavy(286, 9, 7, 20, s + 67)}" fill="#f7c873" ${o()}/>` },
    bbq: { h: 8, draw: (s) => `<path d="${wavy(286, 9, 7, 18, s + 71)}" fill="#6d2810" ${o()}/>` },
    mayo: { h: 8, draw: (s) => `<path d="${wavy(280, 9, 7, 14, s + 73)}" fill="#fff6dc" ${o()}/>` },
    jam: {
      h: 11,
      draw: (s) => {
        const r = rng(s + 79);
        let bits = '';
        for (let i = 0; i < 16; i++) bits += `<circle cx="${(CX - 120 + r() * 240).toFixed(1)}" cy="${(3 + r() * 5).toFixed(1)}" r="${(2 + r() * 2).toFixed(1)}" fill="#c5503c"/>`;
        return `<path d="${wavy(282, 12, 8, 14, s + 83)}" fill="#7c2a1c" ${o()}/>${bits}`;
      },
    },
  };

  /**
   * Рисува бургер в `host`. stack е масив от ключове на слоеве (отдолу нагоре).
   * Връща функции за разглобяване и осветяване на съставка.
   */
  function renderBurger(host, stack, { drop = true, fromIndex = 0 } = {}) {
    const PAD_TOP = 26, PAD_BOT = 14;
    const total = stack.reduce((s, k) => s + LAYERS[k].h, 0);
    const H = Math.max(300, total + PAD_TOP + PAD_BOT);
    let y = H - PAD_BOT;
    let html = '';
    const ys = [];
    stack.forEach((k, i) => {
      y -= LAYERS[k].h;
      ys.push(y);
      html += `<g class="layer" data-type="${k}" data-i="${i}">${LAYERS[k].draw(i * 13 + k.length)}</g>`;
    });
    host.innerHTML = `<svg viewBox="0 0 400 ${H}" class="burger-svg" role="img" aria-label="Илюстрация на бургер">${html}</svg>`;
    const svg = host.firstElementChild;
    const layers = $$('.layer', svg);
    let gap = 0;

    const place = (lift = true) => {
      layers.forEach((g, i) => {
        g.style.transform = `translate(0px, ${ys[i] - i * gap}px)`;
      });
      if (lift) svg.style.marginTop = gap ? `${gap * layers.length * 0.55}px` : '0px';
    };

    if (drop && !reduceMotion) {
      layers.forEach((g, i) => {
        if (i < fromIndex) {
          g.style.transition = 'none';
          g.style.transform = `translate(0px, ${ys[i]}px)`;
          return;
        }
        g.style.transition = 'none';
        g.style.opacity = '0';
        g.style.transform = `translate(0px, ${ys[i] - 420}px)`;
      });
      void svg.getBoundingClientRect();
      layers.forEach((g, i) => {
        g.style.transition = '';
        if (i >= fromIndex) {
          g.style.transitionDelay = `${(i - fromIndex) * 65}ms`;
          g.style.opacity = '1';
        }
      });
      place();
      setTimeout(() => layers.forEach((g) => { g.style.transitionDelay = ''; g.style.opacity = ''; }), layers.length * 65 + 700);
    } else {
      place();
    }

    return {
      explode(on) { gap = on ? Math.min(20, 230 / layers.length) : 0; place(); },
      spread(px) { gap = px; place(false); },
      highlight(type) {
        svg.classList.toggle('is-dim', !!type);
        layers.forEach((g) => g.classList.toggle('is-hot', !!type && g.dataset.type === type));
      },
    };
  }

  /* ───────────────────────── HERO ───────────────────────── */

  const heroHost = $('#heroBurger');
  const hero = $('#hero');
  let heroApi = null;

  // интро: топката пада, смачква се и „отваря" страницата
  const intro = $('#intro');
  const introMs = reduceMotion ? 0 : 1250;
  if (reduceMotion) intro.remove();
  else {
    document.body.classList.add('is-intro');
    setTimeout(() => document.body.classList.remove('is-intro'), introMs);
    setTimeout(() => intro.remove(), introMs + 600);
  }
  setTimeout(() => { heroApi = renderBurger(heroHost, BURGERS[0].stack); }, Math.max(0, introMs - 250));

  // при скрол бургерът в началото се разтваря на слоеве
  let heroTick = false;
  addEventListener('scroll', () => {
    if (heroTick || reduceMotion) return;
    heroTick = true;
    requestAnimationFrame(() => {
      heroTick = false;
      if (!heroApi) return;
      const p = Math.min(1, scrollY / (innerHeight * 0.75));
      heroApi.spread(p * 17);
      heroHost.style.setProperty('--lift', `${(p * -40).toFixed(1)}px`);
    });
  }, { passive: true });

  if (!reduceMotion && matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      hero.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      hero.style.setProperty('--tx', (px - 0.5).toFixed(3));
      hero.style.setProperty('--ty', (py - 0.5).toFixed(3));
    });
  }

  /* ───────────────────── МЕНЮ-ЛАБОРАТОРИЯ ───────────────────── */

  const picker = $('#picker');
  const stageHost = $('#stageBurger');
  const explodeBtn = $('#explodeBtn');
  const priceEl = $('#price');
  const fmt = (n) => n.toFixed(2);

  let current = BURGERS[0];
  let extras = []; // ids по реда на добавяне
  let api = null;
  let shownPrice = 0;

  picker.innerHTML = BURGERS.map(
    (b, i) => `<li><button type="button" data-id="${b.id}" aria-pressed="false">
      <span class="pk-no">${String(i + 1).padStart(2, '0')}</span>
      <span class="pk-name">${b.name}</span>
      <span class="pk-short">${b.short}</span>
      <span class="pk-price">€ ${fmt(b.price)}</span>
    </button></li>`
  ).join('');

  $('#extras').innerHTML = EXTRAS.map(
    (e) => `<button type="button" class="extra" data-id="${e.id}"><span>+ ${e.name}</span><b>€ ${fmt(e.price)}</b></button>`
  ).join('');

  function fullStack() {
    const base = current.stack.slice(0, -1);
    return [...base, ...extras, 'bunT'];
  }

  function tweenPrice(to) {
    const from = shownPrice;
    shownPrice = to;
    if (reduceMotion || from === to) { priceEl.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 450;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      priceEl.textContent = fmt(from + (to - from) * e);
      if (p < 1 && shownPrice === to) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const tag = priceEl.closest('.price-tag');
    tag.classList.remove('bump'); void tag.offsetWidth; tag.classList.add('bump');
  }

  function drawStage(opts) {
    api = renderBurger(stageHost, fullStack(), opts);
    const on = explodeBtn.getAttribute('aria-pressed') === 'true';
    if (on) api.explode(true);
  }

  function refreshMeta() {
    const total = current.price + extras.reduce((s, id) => s + EXTRAS.find((e) => e.id === id).price, 0);
    tweenPrice(total);
    $('#quip').textContent = QUIPS[Math.min(extras.length, QUIPS.length - 1)];
    $('#resetBtn').hidden = extras.length === 0;

    const counts = {};
    extras.forEach((id) => (counts[id] = (counts[id] || 0) + 1));
    $('#added').innerHTML = Object.entries(counts)
      .map(([id, n]) => {
        const e = EXTRAS.find((x) => x.id === id);
        return `<li><button type="button" data-remove="${id}" aria-label="Махни ${e.name}">${n > 1 ? n + '× ' : ''}${e.name}<i>×</i></button></li>`;
      })
      .join('');
    $$('.extra').forEach((b) => (b.disabled = extras.length >= MAX_EXTRAS));
  }

  function select(id, { animate = true } = {}) {
    current = BURGERS.find((b) => b.id === id);
    extras = [];
    $$('button', picker).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
    $('#stageNo').textContent = String(BURGERS.indexOf(current) + 1).padStart(2, '0');
    $('#cardName').textContent = current.name;
    $('#stageName').textContent = current.name;
    $('#stagePrice').textContent = `€ ${fmt(current.price)}`;
    $('#cardNote').textContent = current.note;
    $('#ings').innerHTML = current.ings.map(([label, type]) => `<li tabindex="0" data-type="${type}">${label}</li>`).join('');
    drawStage({ drop: animate });
    refreshMeta();
  }

  picker.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-id]');
    if (b && b.dataset.id !== current.id) select(b.dataset.id);
  });

  // осветяване на слой при посочване на съставка
  const ings = $('#ings');
  const hot = (e) => { const li = e.target.closest('li[data-type]'); if (li && api) api.highlight(li.dataset.type); };
  const cold = () => api && api.highlight(null);
  ings.addEventListener('pointerover', hot);
  ings.addEventListener('pointerout', cold);
  ings.addEventListener('focusin', hot);
  ings.addEventListener('focusout', cold);

  $('#extras').addEventListener('click', (e) => {
    const b = e.target.closest('.extra');
    if (!b || extras.length >= MAX_EXTRAS) return;
    extras.push(b.dataset.id);
    // пада само новият слой + горното хлебче
    drawStage({ drop: true, fromIndex: fullStack().length - 2 });
    refreshMeta();
  });

  $('#added').addEventListener('click', (e) => {
    const b = e.target.closest('[data-remove]');
    if (!b) return;
    const i = extras.lastIndexOf(b.dataset.remove);
    if (i > -1) extras.splice(i, 1);
    drawStage({ drop: false });
    refreshMeta();
  });

  $('#resetBtn').addEventListener('click', () => {
    extras = [];
    drawStage({ drop: false });
    refreshMeta();
  });

  explodeBtn.addEventListener('click', () => {
    const on = explodeBtn.getAttribute('aria-pressed') !== 'true';
    explodeBtn.setAttribute('aria-pressed', String(on));
    explodeBtn.textContent = on ? 'Сглоби' : 'Разглоби';
    api.explode(on);
  });

  select('og', { animate: false });
  // първото „падане" да стане, когато сцената влезе в екрана
  new IntersectionObserver((entries, io) => {
    if (entries[0].isIntersecting) { drawStage({ drop: true }); io.disconnect(); }
  }, { threshold: 0.35 }).observe(stageHost);

  /* ───────────────────── РАБОТНО ВРЕМЕ ───────────────────── */

  const hhmm = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

  function sofiaNow() {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Sofia', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { day, mins: (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10) };
  }

  function nextOpening(day, mins) {
    for (let i = 0; i < 8; i++) {
      const d = (day + i) % 7, h = HOURS[d];
      if (h && (i > 0 || mins < h[0])) {
        const when = i === 0 ? 'днес' : i === 1 ? 'утре' : DAYS_IN[d];
        return `${when} в ${hhmm(h[0])}`;
      }
    }
    return '';
  }

  function updateStatus() {
    const { day, mins } = sofiaNow();
    const h = HOURS[day];
    const open = !!h && mins >= h[0] && mins < h[1];
    const closingSoon = open && h[1] - mins <= 45;

    let pill, big, sub;
    if (open) {
      pill = `Отворено до ${hhmm(h[1])}`;
      big = closingSoon ? 'Още малко и затваряме.' : 'Отворено е. Идвай.';
      sub = `Днес работим до ${hhmm(h[1])}.`;
    } else {
      pill = `Затворено`;
      big = !h ? `${DAYS[day]} почиваме.` : 'В момента е затворено.';
      sub = `Отваряме ${nextOpening(day, mins)}.`;
    }
    $$('[data-status]').forEach((el) => {
      el.classList.toggle('is-open', open);
      el.querySelector('b').textContent = pill;
    });
    $('[data-status-big]').textContent = big;
    $('[data-status-sub]').textContent = sub;

    const order = [1, 2, 3, 4, 5, 6, 0];
    $('#hoursTable').innerHTML = order
      .map((d) => {
        const hh = HOURS[d];
        return `<tr class="${d === day ? 'is-today' : ''}${hh ? '' : ' is-closed'}">
          <th scope="row">${DAYS[d]}${d === day ? '<span>днес</span>' : ''}</th>
          <td>${hh ? `${hhmm(hh[0])} – ${hhmm(hh[1])}` : 'Почивен ден'}</td></tr>`;
      })
      .join('');
  }
  updateStatus();
  setInterval(updateStatus, 30000);

  /* ───────────────────── СПРЕЙ ПО СТЕНАТА ───────────────────── */
  // Мишка: задържаш и пръскаш. Пръст: първо включваш спрея (иначе плъзгането скролва страницата).

  (function spray() {
    const cv = $('#sprayCanvas'), ui = $('#sprayUi'), clearBtn = $('#sprayClear');
    const toggle = $('#sprayToggle'), hint = $('#sprayHint');
    const ctx = cv.getContext('2d');
    const TAU = Math.PI * 2;
    let color = '#ffc20e', down = false, last = null, drips = [], raf = 0;
    let touchOn = false, offTimer = 0, lastW = 0;

    const size = () => {
      const r = hero.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
      if (Math.round(r.width) === lastW && cv.height >= Math.round(r.height * d)) return; // лентата на браузъра не трие рисунката
      lastW = Math.round(r.width);
      cv.width = Math.round(r.width * d);
      cv.height = Math.round(r.height * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    size();
    addEventListener('resize', size);

    const puff = (x, y) => {
      ctx.fillStyle = color;
      for (let i = 0; i < 30; i++) {
        const a = Math.random() * TAU, rr = Math.pow(Math.random(), 1.5) * 27;
        ctx.globalAlpha = 0.2 + Math.random() * 0.5;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr, 0.6 + Math.random() * 1.5, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 0.13;
      ctx.beginPath(); ctx.arc(x, y, 14, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;
      if (Math.random() < 0.02) drips.push({ x: x + (Math.random() - 0.5) * 12, y: y + 8, left: 30 + Math.random() * 110, w: 2 + Math.random() * 2.5, c: color });
    };
    const stroke = (a, b) => {
      const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 5));
      for (let i = 1; i <= n; i++) puff(a.x + ((b.x - a.x) * i) / n, a.y + ((b.y - a.y) * i) / n);
    };
    const run = () => {
      if (down && last) puff(last.x, last.y); // задържане на място трупа боя
      drips = drips.filter((d) => d.left > 0);
      drips.forEach((d) => {
        const s = Math.min(d.left, 1.3);
        ctx.fillStyle = d.c; ctx.globalAlpha = 0.85;
        ctx.fillRect(d.x - d.w / 2, d.y, d.w, s + 0.6);
        d.y += s; d.left -= s;
      });
      ctx.globalAlpha = 1;
      raf = down || drips.length ? requestAnimationFrame(run) : 0;
    };
    const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

    // режим за пръст
    const armOff = () => { clearTimeout(offTimer); offTimer = setTimeout(() => setTouch(false), 10000); };
    function setTouch(on) {
      touchOn = on;
      hero.classList.toggle('spray-on', on);
      toggle.setAttribute('aria-pressed', String(on));
      toggle.textContent = on ? 'Готово ✓' : 'Включи спрея';
      hint.textContent = on ? 'рисувай с пръст по стената' : 'включи спрея и рисувай с пръст →';
      clearTimeout(offTimer);
      if (on) armOff();
    }
    if (matchMedia('(pointer: coarse)').matches) {
      toggle.hidden = false;
      setTouch(false);
      toggle.addEventListener('click', () => setTouch(!touchOn));
    }

    hero.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a, button')) return;
      if (e.pointerType === 'mouse' ? e.button !== 0 : !touchOn) return;
      e.preventDefault();
      down = true; last = pos(e);
      puff(last.x, last.y);
      hero.classList.add('is-spraying');
      clearBtn.hidden = false;
      if (touchOn) armOff();
      if (!raf) raf = requestAnimationFrame(run);
    });
    addEventListener('pointermove', (e) => {
      if (!down) return;
      const p = pos(e); stroke(last, p); last = p;
      if (touchOn) armOff();
    });
    const stop = () => { down = false; hero.classList.remove('is-spraying'); };
    addEventListener('pointerup', stop);
    addEventListener('pointercancel', stop);

    ui.addEventListener('click', (e) => {
      const c = e.target.closest('[data-c]');
      if (c) {
        color = c.dataset.c;
        $$('[data-c]', ui).forEach((b) => b.setAttribute('aria-pressed', String(b === c)));
      }
    });
    clearBtn.addEventListener('click', () => {
      drips = [];
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.restore();
      clearBtn.hidden = true;
    });
  })();

  /* ───────────────────── МОБИЛНО МЕНЮ ───────────────────── */

  const navToggle = $('#navToggle'), mnav = $('#mnav');
  const setNav = (open) => {
    navToggle.setAttribute('aria-expanded', String(open));
    mnav.classList.toggle('is-open', open);
    mnav.setAttribute('aria-hidden', String(!open));
    document.documentElement.classList.toggle('nav-open', open);
  };
  navToggle.addEventListener('click', () => setNav(navToggle.getAttribute('aria-expanded') !== 'true'));
  mnav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
  matchMedia('(min-width: 821px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

  /* ───────────────────── СТРЕЛКИ И СУАЙП ПО БУРГЕРА ───────────────────── */

  const stepBurger = (dir) => {
    const i = (BURGERS.indexOf(current) + dir + BURGERS.length) % BURGERS.length;
    select(BURGERS[i].id);
  };
  $('#stagePrev').addEventListener('click', () => stepBurger(-1));
  $('#stageNext').addEventListener('click', () => stepBurger(1));
  let sw = null;
  const stageEl = $('.stage');
  stageEl.addEventListener('touchstart', (e) => { const t = e.touches[0]; sw = { x: t.clientX, y: t.clientY }; }, { passive: true });
  stageEl.addEventListener('touchend', (e) => {
    if (!sw) return;
    const t = e.changedTouches[0], dx = t.clientX - sw.x, dy = t.clientY - sw.y;
    sw = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) stepBurger(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ───────────────────── „ЗАВЪРТИ" ───────────────────── */

  // ротативка: сцената прехвърля самите бургери и забавя, докато спре на един
  let rolling = false;
  $('#rollBtn').addEventListener('click', () => {
    if (rolling) return;
    const btns = $$('button', picker);
    const n = BURGERS.length;
    const from = BURGERS.indexOf(current);
    let to = Math.floor(Math.random() * (n - 1));
    if (to >= from) to++;
    const stage = $('.stage');
    stage.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    if (reduceMotion) { select(BURGERS[to].id); return; }

    rolling = true;
    $('#rollBtn').classList.add('is-rolling');
    stage.classList.add('is-slot');
    explodeBtn.setAttribute('aria-pressed', 'false');
    explodeBtn.textContent = 'Разглоби';
    $('#quip').textContent = '';

    const steps = n * 2 + ((to - from + n) % n);
    let k = 0;
    const step = () => {
      k++;
      const i = (from + k) % n, b = BURGERS[i];
      const delay = 55 + k * k * 0.95;
      btns.forEach((x, j) => x.classList.toggle('is-roll', j === i));
      // бургерът „пада" в прозорчето като барабан на ротативка
      renderBurger(stageHost, b.stack, { drop: false });
      stageHost.style.setProperty('--slot', `${Math.min(420, delay + 40).toFixed(0)}ms`);
      stageHost.classList.remove('slot-in'); void stageHost.offsetWidth; stageHost.classList.add('slot-in');
      $('#stageNo').textContent = String(i + 1).padStart(2, '0');
      $('#stageName').textContent = b.name;
      $('#stagePrice').textContent = `€ ${fmt(b.price)}`;
      priceEl.textContent = fmt(b.price);
      if (k < steps) return setTimeout(step, delay);

      // спря: истинският избор, със „удар" на сцената
      setTimeout(() => {
        btns.forEach((x) => x.classList.remove('is-roll'));
        $('#rollBtn').classList.remove('is-rolling');
        stage.classList.remove('is-slot');
        stageHost.classList.remove('slot-in');
        shownPrice = b.price;
        rolling = false;
        select(b.id);
        stage.classList.remove('is-jackpot'); void stage.offsetWidth; stage.classList.add('is-jackpot');
        $('#quip').textContent = 'Съдбата реши.';
        btns[to].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 260);
    };
    step();
  });

  /* ───────────────────── СНИМКИ: LIGHTBOX ───────────────────── */

  const lb = $('#lightbox');
  const shots = $$('[data-full]');
  let lbi = 0;
  const lbShow = (i) => {
    lbi = (i + shots.length) % shots.length;
    const s = shots[lbi];
    $('#lbImg').src = s.dataset.full;
    $('#lbImg').alt = $('img', s).alt;
    $('#lbCap').textContent = s.dataset.caption;
  };
  shots.forEach((s, i) => s.addEventListener('click', () => { lbShow(i); lb.showModal(); }));
  lb.addEventListener('click', (e) => {
    const a = e.target.closest('[data-lb]');
    if (a) {
      if (a.dataset.lb === 'close') lb.close();
      else lbShow(lbi + (a.dataset.lb === 'next' ? 1 : -1));
    } else if (e.target === lb) lb.close();
  });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') lbShow(lbi + 1);
    if (e.key === 'ArrowLeft') lbShow(lbi - 1);
  });

  /* ───────────────────── СМАЧКАЙ КЮФТЕТО ───────────────────── */

  const griddle = $('#griddle');
  const SMASH_QUIPS = { 1: 'Ето така.', 3: 'Имаш ръка за това.', 6: 'Плочата те харесва.', 10: 'Кандидатствай при нас.', 20: 'Окей, стига. Огладня ли?' };
  let smashN = 0, smashBusy = false;
  griddle.addEventListener('click', () => {
    if (smashBusy) return;
    smashBusy = true;
    griddle.classList.add('is-pressing', 'is-used');
    setTimeout(() => {
      griddle.classList.add('is-smashed');
      smashN++;
      $('#smashCount').textContent = smashN;
      if (SMASH_QUIPS[smashN]) $('#smashQuip').textContent = SMASH_QUIPS[smashN];
      for (let i = 0; i < 10; i++) {
        const s = document.createElement('span');
        s.className = 'steam';
        s.style.left = `${22 + Math.random() * 56}%`;
        s.style.setProperty('--dx', `${(Math.random() - 0.5) * 70}px`);
        s.style.animationDelay = `${Math.random() * 260}ms`;
        griddle.appendChild(s);
        setTimeout(() => s.remove(), 1500);
      }
    }, 170);
    setTimeout(() => griddle.classList.remove('is-pressing'), 560);
    setTimeout(() => griddle.classList.add('is-out'), 1300);
    setTimeout(() => {
      griddle.classList.remove('is-smashed', 'is-out');
      griddle.classList.add('is-new');
      smashBusy = false;
      setTimeout(() => griddle.classList.remove('is-new'), 520);
    }, 1750);
  });

  /* ───────────────────── ДРЕБНИ НЕЩА ───────────────────── */

  // бирата се налива, докато скролваш; лентата се накланя според скоростта
  const matchPanel = $('#matchPanel'), progress = $('#progress'), tape = $('.tape');
  let fxTick = false, lastY = scrollY, skewTimer = 0;
  const fx = () => {
    fxTick = false;
    const r = matchPanel.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight * 0.8) - 0.15));
    matchPanel.style.setProperty('--fill', (p * 0.93).toFixed(3));
    progress.style.transform = `scaleX(${(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)).toFixed(4)})`;
    if (!reduceMotion) {
      const v = Math.max(-14, Math.min(14, (scrollY - lastY) * 0.35));
      tape.style.setProperty('--skew', `${v.toFixed(1)}deg`);
      clearTimeout(skewTimer);
      skewTimer = setTimeout(() => tape.style.setProperty('--skew', '0deg'), 140);
    }
    lastY = scrollY;
  };
  addEventListener('scroll', () => { if (!fxTick) { fxTick = true; requestAnimationFrame(fx); } }, { passive: true });
  fx();


  // варели: под един има бургер; останалите казват „горещо / топло / студено"
  (function barrels() {
    const row = $('#barrels'), note = $('#barrelsNote'), again = $('#barrelsAgain');
    const N = 7;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    let prize = 0, tries = 0, done = false, busy = false;

    const mix = (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    };
    // скрива наградата под случаен варел и номерира варелите по реда им на екрана
    const hide = () => {
      [...row.children].forEach((b, i) => { b.dataset.i = i; b.setAttribute('aria-label', `Варел ${i + 1}`); });
      prize = Math.floor(Math.random() * N);
      tries = 0; done = false;
      again.hidden = true;
      note.textContent = 'под един варел има бургер ↓';
    };
    const build = () => {
      // случайни цветове (поне по два от всеки) и случайни размери
      const yellow = mix([true, true, false, false, ...Array.from({ length: N - 4 }, () => Math.random() < 0.5)]);
      row.innerHTML = yellow.map((y) =>
        `<button type="button" class="barrel${Math.random() < 0.45 ? ' sm' : ''}" style="--b:${y ? '#ffc20e' : '#141414'};--t:${y ? '#070707' : '#ffc20e'}">
          <span class="under"></span><svg aria-hidden="true"><use href="#barrel"/></svg></button>`).join('');
      hide();
    };

    // един рунд: варелите си сменят местата пред очите ти (FLIP)
    const round = async (ms) => {
      const els = [...row.children];
      const before = new Map(els.map((e) => [e, e.getBoundingClientRect().left]));
      let order = mix(els);
      if (order.every((e, i) => e === els[i])) order = [...els.slice(1), els[0]];
      order.forEach((e) => row.appendChild(e));
      order.forEach((e) => {
        e.style.transition = 'none';
        e.style.transform = `translateX(${before.get(e) - e.getBoundingClientRect().left}px)`;
      });
      void row.offsetWidth;
      order.forEach((e, k) => {
        e.style.transition = `transform ${ms}ms cubic-bezier(.55,0,.25,1)`;
        e.style.transform = '';
        e.style.setProperty('--hop', `${ms}ms`);
        e.classList.remove('hop-up', 'hop-down'); void e.offsetWidth;
        e.classList.add(k % 2 ? 'hop-up' : 'hop-down'); // едните минават отгоре, другите отдолу
      });
      await wait(ms + 30);
    };

    const shuffle = async () => {
      if (busy) return;
      busy = true;
      again.hidden = true;
      note.textContent = 'гледай внимателно…';
      $$('.barrel', row).forEach((b) => b.classList.remove('is-up', 'is-win'));
      await wait(reduceMotion ? 0 : 520);
      $$('.under', row).forEach((u) => (u.innerHTML = ''));
      if (!reduceMotion) {
        row.classList.add('is-shuffling');
        for (const ms of [460, 380, 300, 240, 220, 260, 360]) await round(ms);
        row.classList.remove('is-shuffling');
        $$('.barrel', row).forEach((b) => { b.classList.remove('hop-up', 'hop-down'); b.style.transition = ''; });
      } else {
        mix([...row.children]).forEach((e) => row.appendChild(e));
      }
      hide();
      note.textContent = 'е, къде е сега? ↓';
      busy = false;
    };

    row.addEventListener('click', (e) => {
      const b = e.target.closest('.barrel');
      if (!b || busy || done || b.classList.contains('is-up')) return;
      tries++;
      const d = Math.abs(Number(b.dataset.i) - prize);
      const under = $('.under', b);
      b.classList.add('is-up');
      if (d === 0) {
        done = true;
        b.classList.add('is-win');
        under.innerHTML = '<svg class="prize" aria-hidden="true"><use href="#burger-o"/></svg>';
        note.textContent = tries === 1 ? 'От първия път?! Легенда.' : tries <= 3 ? `Намери го от ${tries} опита. Нюх.` : `Намери го от ${tries} опита. Гладът не лъже.`;
        again.hidden = false;
      } else {
        const word = d === 1 ? 'горещо!' : d === 2 ? 'топло' : 'студено';
        under.innerHTML = `<em class="${d === 1 ? 'hot' : d === 2 ? 'warm' : 'cold'}">${word}</em>`;
        note.textContent = `${word} · опит ${tries}`;
      }
    });
    again.addEventListener('click', shuffle);
    build();
  })();

  // поява при скрол
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  // навигация: фон след скрол
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-stuck', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
