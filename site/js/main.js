(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const dict = window.PW_I18N;
  // Endereço do site funcional (o app). Trocar quando ele existir.
  const APP_URL = '#';
  // Link do checkout da Kiwify para os botões "Adquirir agora". Trocar quando existir.
  const CHECKOUT_URL = '#';

  // Gerador pseudoaleatório com semente: a arte dos tiles é sempre igual.
  const seeded = seed => () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const rgba = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  };

  /* ---------- Dados ---------- */
  const AESTHETICS = ['minimal', 'cyberpunk', 'quiet', 'anime', 'oldmoney', 'academia', 'lofi', 'synthwave', 'y2k', 'brutal', 'nature'];

  // [destaque, claro, meio, fundo]
  const PALETTES = {
    brasa: ['#F66F14', '#FFAD75', '#3A1606', '#0B0707'],
    oceano: ['#2F7BF6', '#9CC3FF', '#0B1B3A', '#050A16'],
    musgo: ['#7C9A56', '#D4DDB0', '#1E2A17', '#0A0F08'],
    neon: ['#FF2E88', '#00E5FF', '#2B0F54', '#08040F'],
    areia: ['#D8B98F', '#F4EDE3', '#6B5741', '#17120D']
  };

  const LIBRARY = [
    { f: 'brasa-lenta', a: 'minimal', p: 'brasa', s: 'horizon', live: true },
    { f: 'neon-rain', a: 'cyberpunk', p: 'neon', s: 'grid' },
    { f: 'mar-de-vidro', a: 'quiet', p: 'oceano', s: 'mesh' },
    { f: 'biblioteca-noite', a: 'academia', p: 'areia', s: 'blinds' },
    { f: 'musgo-alto', a: 'nature', p: 'musgo', s: 'mesh', live: true },
    { f: 'sol-de-arcade', a: 'synthwave', p: 'neon', s: 'horizon' },
    { f: 'papel-cru', a: 'minimal', p: 'areia', s: 'rings' },
    { f: 'azul-pasta', a: 'y2k', p: 'oceano', s: 'conic' },
    { f: 'chuva-lofi', a: 'lofi', p: 'oceano', s: 'blinds' },
    { f: 'fogo-frio', a: 'brutal', p: 'brasa', s: 'conic' },
    { f: 'sakura-2am', a: 'anime', p: 'neon', s: 'mesh', live: true },
    { f: 'cinza-quente', a: 'quiet', p: 'areia', s: 'horizon' },
    { f: 'floresta-ruido', a: 'nature', p: 'musgo', s: 'rings' },
    { f: 'terminal-verde', a: 'cyberpunk', p: 'musgo', s: 'grid' },
    { f: 'duna', a: 'minimal', p: 'areia', s: 'mesh', live: true },
    { f: 'brasa-grid', a: 'synthwave', p: 'brasa', s: 'grid' },
    { f: 'onda-azul', a: 'lofi', p: 'oceano', s: 'rings' },
    { f: 'lanterna', a: 'anime', p: 'brasa', s: 'mesh' }
  ];

  const ART = {
    mesh: (c, r) => `radial-gradient(at ${r() * 40 | 0}% ${r() * 50 | 0}%, ${c[0]} 0, transparent 55%),
      radial-gradient(at ${60 + r() * 40 | 0}% ${30 + r() * 60 | 0}%, ${c[1]} 0, transparent 48%),
      radial-gradient(at ${30 + r() * 40 | 0}% 100%, ${c[2]} 0, transparent 60%), ${c[3]}`,
    horizon: (c, r) => `radial-gradient(110% 85% at ${40 + r() * 20 | 0}% 128%, ${c[1]} 0, ${c[0]} 26%, ${rgba(c[0], 0)} 55%),
      linear-gradient(180deg, ${c[3]} 25%, ${c[2]} 100%)`,
    rings: (c, r) => {
      const x = 20 + r() * 60 | 0, y = 20 + r() * 60 | 0;
      return `repeating-radial-gradient(circle at ${x}% ${y}%, ${rgba(c[1], .22)} 0 1.5px, transparent 1.5px 12px),
        radial-gradient(circle at ${x}% ${y}%, ${c[0]} 0, ${c[2]} 40%, ${c[3]} 80%)`;
    },
    grid: (c) => `linear-gradient(${rgba(c[0], .45)} 1px, transparent 1px) 0 0 / 100% 14px,
      linear-gradient(90deg, ${rgba(c[1], .3)} 1px, transparent 1px) 0 0 / 18px 100%,
      radial-gradient(80% 60% at 50% 100%, ${rgba(c[0], .8)}, transparent 70%),
      linear-gradient(180deg, ${c[3]} 20%, ${c[2]})`,
    conic: (c, r) => `radial-gradient(circle, transparent 20%, ${rgba(c[3], .9)} 85%),
      conic-gradient(from ${r() * 360 | 0}deg at ${30 + r() * 40 | 0}% ${30 + r() * 40 | 0}%, ${c[3]}, ${c[2]}, ${c[0]}, ${c[1]}, ${c[3]})`,
    blinds: (c, r) => `repeating-linear-gradient(90deg, rgba(0,0,0,.28) 0 2px, transparent 2px 11px),
      linear-gradient(${120 + r() * 60 | 0}deg, ${c[3]} 10%, ${c[2]} 45%, ${c[0]} 78%, ${c[1]})`
  };

  /* ---------- Idioma ---------- */
  const storage = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sem storage */ } }
  };
  let lang = storage.get('pw-lang') || ((navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en');
  if (!dict[lang]) lang = 'pt';
  const t = key => (dict[lang][key] ?? dict.pt[key] ?? key);

  /* ---------- Texto por palavra ---------- */
  function split(el) {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            const wi = document.createElement('span');
            w.className = 'w'; wi.className = 'wi';
            wi.style.setProperty('--i', i++);
            wi.textContent = part;
            w.appendChild(wi);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          walk(n);
        }
      });
    };
    walk(el);
  }

  function applyLang(next, animate) {
    lang = next;
    storage.set('pw-lang', lang);
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = t('meta.title');
    $('meta[name="description"]').setAttribute('content', t('meta.desc'));

    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-html]').forEach(el => {
      el.innerHTML = t(el.dataset.i18nHtml);
      if (el.hasAttribute('data-split')) split(el);
    });
    $$('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':');
        el.setAttribute(attr.trim(), t(key.trim()));
      });
    });
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    updatePrices(false);

    if (animate) {
      document.body.classList.remove('lang-swap');
      void document.body.offsetWidth;
      document.body.classList.add('lang-swap');
    }
  }

  /* ---------- Tiles ---------- */
  function makeTile(w, idx, withMatch) {
    const tile = document.createElement('div');
    tile.className = 'tile' + (w.live ? ' live' : '');
    tile.dataset.pal = w.p;
    tile.dataset.idx = idx;
    const art = document.createElement('div');
    art.className = 'tile-art';
    art.style.background = ART[w.s](PALETTES[w.p], seeded(idx * 97 + 13));
    tile.appendChild(art);
    if (w.live) tile.insertAdjacentHTML('beforeend', '<span class="tile-badge">LIVE</span>');
    if (withMatch) tile.insertAdjacentHTML('beforeend', '<span class="tile-match"><b></b> <span data-i18n="pal.match"></span></span>');
    tile.insertAdjacentHTML('beforeend',
      `<div class="tile-cap"><span>${w.f}.${w.live ? 'mp4' : 'jpg'}</span><span data-i18n="aest.${w.a}"></span></div>`);
    return tile;
  }

  /* ---------- Faixa de estéticas ---------- */
  const track = $('.marquee-track');
  for (let g = 0; g < 2; g++) {
    const group = document.createElement('div');
    group.className = 'marquee-group';
    if (g) group.setAttribute('aria-hidden', 'true');
    AESTHETICS.forEach(a => group.insertAdjacentHTML('beforeend', `<span class="aest-item" data-i18n="aest.${a}"></span>`));
    track.appendChild(group);
  }

  /* ---------- A parede ---------- */
  const wall = $('.wall');
  const wallGrid = $('.wall-grid');
  const wallCore = $('.wall-core');
  LIBRARY.forEach((w, i) => wallGrid.appendChild(makeTile(w, i)));
  let wallTiles = [];
  let wallData = [];

  function measureWall() {
    const gw = wallGrid.offsetWidth / 2;
    const gh = wallGrid.offsetHeight / 2;
    const maxDist = Math.hypot(gw, gh) || 1;
    wallTiles = $$('.tile', wallGrid).filter(el => el.offsetParent !== null);
    wallData = wallTiles.map((el, i) => {
      const r = seeded(i + 7);
      const dx = gw - (el.offsetLeft + el.offsetWidth / 2);
      const dy = gh - (el.offsetTop + el.offsetHeight / 2);
      return { dx, dy, rot: (r() - .5) * 60, delay: Math.hypot(dx, dy) / maxDist * .32 + r() * .08 };
    });
  }

  function renderWall() {
    const rect = wall.getBoundingClientRect();
    if (rect.bottom < -50 || rect.top > innerHeight + 50) return;
    const total = Math.max(1, wall.offsetHeight - innerHeight);
    const p = clamp(-rect.top / (total * .8));
    wallTiles.forEach((el, i) => {
      const d = wallData[i];
      const e = easeOut(clamp((p - d.delay) / .6));
      const k = 1 - e;
      el.style.transform = `translate(${d.dx * k}px, ${d.dy * k}px) rotate(${d.rot * k}deg) scale(${.3 + .7 * e})`;
      el.style.opacity = clamp(e * 3);
    });
    wallGrid.style.setProperty('--tilt', (16 * (1 - p)).toFixed(2));
    wallCore.style.setProperty('--core', (1 - clamp(p * 1.4)).toFixed(3));
  }

  /* ---------- Paletas ---------- */
  const palGrid = $('.pal-grid');
  const palWrap = $('.palettes');
  const board = $('.pal-board');
  [0, 1, 2, 3, 4, 12, 6, 7, 9].forEach(i => palGrid.appendChild(makeTile(LIBRARY[i], i, true)));

  Object.entries(PALETTES).forEach(([key, c]) => {
    palWrap.insertAdjacentHTML('beforeend',
      `<button type="button" class="pal" role="radio" aria-checked="false" data-pal="${key}">
        <span class="pal-sw" aria-hidden="true">${c.slice(0, 3).map(x => `<i style="background:${x}"></i>`).join('')}</span>
        <span data-i18n="pal.${key}"></span>
      </button>`);
  });

  function selectPalette(key, animate) {
    const tiles = $$('.tile', palGrid);
    const first = new Map(tiles.map(el => [el, el.getBoundingClientRect()]));
    const sorted = [...tiles].sort((a, b) =>
      (b.dataset.pal === key) - (a.dataset.pal === key) || a.dataset.idx - b.dataset.idx);
    sorted.forEach(el => palGrid.appendChild(el));

    sorted.forEach(el => {
      const match = el.dataset.pal === key;
      el.classList.toggle('is-match', match);
      el.classList.toggle('is-dim', !match);
      if (match) el.querySelector('.tile-match b').textContent = `${88 + (el.dataset.idx * 7) % 11}%`;
      if (!animate) return;
      const f = first.get(el);
      const l = el.getBoundingClientRect();
      const dx = f.left - l.left;
      const dy = f.top - l.top;
      if (dx || dy) {
        el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
          { duration: 800, easing: 'cubic-bezier(.2,.8,.2,1)' });
      }
    });

    const c = PALETTES[key];
    board.style.setProperty('--glow', c[0]);
    board.style.setProperty('--tb-1', c[0]);
    $$('.tb-icon', board).forEach((el, i) => el.style.setProperty('--c', [c[0], c[1], c[2], c[1], c[0]][i]));
    $$('.pal', palWrap).forEach(b => {
      const on = b.dataset.pal === key;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
  }

  palWrap.addEventListener('click', e => {
    const b = e.target.closest('.pal');
    if (!b) return;
    stopPal();
    selectPalette(b.dataset.pal, true);
  });
  palWrap.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    stopPal();
    const btns = $$('.pal', palWrap);
    const cur = btns.findIndex(b => b.getAttribute('aria-checked') === 'true');
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    const next = btns[(cur + step + btns.length) % btns.length];
    selectPalette(next.dataset.pal, true);
    next.focus();
  });

  /* ---------- Monitores ---------- */
  const monWrap = $('.monitors');
  const monitors = $$('.monitor', monWrap);
  const screens = $$('.screen-inner', monWrap);
  const tpl = $('#pano-tpl');
  screens.forEach(s => s.appendChild(tpl.content.cloneNode(true)));
  let monN = 3;
  let protect = true;
  let layoutUntil = 0;

  // Com 1 tela aparece só a do meio; com 2, as duas primeiras.
  const visibleFor = n => (n === 1 ? [1] : n === 2 ? [0, 1] : [0, 1, 2]);

  function layoutPano() {
    const vis = visibleFor(monN);
    const fr = screens[vis[0]].getBoundingClientRect();
    const lr = screens[vis[vis.length - 1]].getBoundingClientRect();
    const width = Math.max(1, lr.right - fr.left);
    screens.forEach(s => {
      const r = s.getBoundingClientRect();
      const pano = s.firstElementChild;
      pano.style.width = `${width}px`;
      pano.style.left = `${fr.left - r.left}px`;
    });
    // Ponto principal: centro da tela 2 (sempre visível). Sem proteção: meio da imagem inteira.
    const tr = screens[1].getBoundingClientRect();
    const x = protect ? ((tr.left + tr.width / 2 - fr.left) / width) * 100 : 50;
    monWrap.style.setProperty('--sun-x', `${x}%`);
  }

  function layoutLoop() {
    layoutPano();
    if (performance.now() < layoutUntil) requestAnimationFrame(layoutLoop);
  }
  function relayout() {
    layoutUntil = performance.now() + 900;
    requestAnimationFrame(layoutLoop);
  }

  function setMonitors(n) {
    monN = n;
    const vis = visibleFor(n);
    monitors.forEach((m, i) => m.classList.toggle('is-off', !vis.includes(i)));
    $$('.seg [data-n]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.n === n)));
    $('[data-res]').textContent = `${n * 1920}×1080`;
    relayout();
  }

  $$('.seg [data-n]').forEach(b => b.addEventListener('click', () => { stopMon(); setMonitors(+b.dataset.n); }));
  // Garante a posição final mesmo se o navegador pular quadros durante a transição.
  monWrap.addEventListener('transitionend', e => { if (e.target.classList.contains('monitor')) layoutPano(); });
  const sw = $('.switch');
  function setProtect(on) {
    protect = on;
    sw.setAttribute('aria-checked', String(protect));
    monWrap.classList.toggle('no-protect', !protect);
    layoutPano();
  }
  sw.addEventListener('click', () => { stopMon(); setProtect(!protect); });

  /* ---------- Preços ---------- */
  let period = 'monthly';
  function updatePrices(animate) {
    const num = $('[data-price-num]');
    num.textContent = t(`price.pro.${period}`);
    $('[data-price-bill]').textContent = t(`price.pro.bill.${period}`);
    if (animate) {
      num.classList.remove('is-swap');
      void num.offsetWidth;
      num.classList.add('is-swap');
    }
  }
  $$('[data-period]').forEach(b => b.addEventListener('click', () => {
    period = b.dataset.period;
    $$('[data-period]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    updatePrices(true);
  }));

  $$('.plan').forEach(card => card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));

  const pricing = $('.pricing');
  const priceWord = $('.pricing-word');
  function renderPriceWord() {
    const r = pricing.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    priceWord.style.setProperty('--py', `${(r.top * -.12).toFixed(1)}px`);
  }

  /* ---------- Dúvidas ---------- */
  $$('.faq-q').forEach(btn => btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  }));

  /* ---------- Botões para o app ---------- */
  $$('[data-app]').forEach(a => a.setAttribute('href', APP_URL));
  $$('[data-buy]').forEach(a => a.setAttribute('href', CHECKOUT_URL));

  /* ---------- Imagem ilustrativa do pack ---------- */
  // Pastas por categoria com miniaturas de exemplo. Trocar por prints reais do pack.
  const PACK_FOLDERS = [
    ['anime', [10, 17, 5]], ['oldmoney', [11, 3, 6]], ['cyberpunk', [1, 13, 15]],
    ['minimal', [0, 14, 6]], ['academia', [3, 11, 12]], ['lofi', [8, 16, 2]]
  ];
  const packFolders = $('.pack-folders');
  PACK_FOLDERS.forEach(([key, ids]) => {
    const folder = document.createElement('div');
    folder.className = 'folder';
    const thumbs = ids.map(i => `<i style="background:${ART[LIBRARY[i].s](PALETTES[LIBRARY[i].p], seeded(i * 97 + 13))}"></i>`).join('');
    folder.innerHTML = `<div class="folder-thumbs">${thumbs}</div>
      <div class="folder-info"><b data-i18n="aest.${key}"></b><span class="mono" data-i18n="pack.files"></span></div>`;
    packFolders.appendChild(folder);
  });

  /* ---------- Exemplos automáticos ---------- */
  // Roda só enquanto o exemplo está na tela. Para de vez quando a pessoa usa o controle.
  function autoLoop(el, step, delay, immediate = true) {
    let timer = null;
    let i = 0;
    let stopped = false;
    const tick = () => { step(i++); timer = setTimeout(tick, delay); };
    const obs = new IntersectionObserver(([en]) => {
      if (stopped) return;
      if (en.isIntersecting) {
        if (timer) return;
        if (immediate) tick();
        else timer = setTimeout(tick, delay);
      } else {
        clearTimeout(timer);
        timer = null;
      }
    }, { threshold: .3 });
    obs.observe(el);
    return () => { stopped = true; clearTimeout(timer); timer = null; obs.disconnect(); };
  }
  const hideNote = scope => { const n = $(`${scope} .demo-note`); if (n) n.classList.add('is-off'); };
  const artFor = idx => ART[LIBRARY[idx].s](PALETTES[LIBRARY[idx].p], seeded(idx * 97 + 13));

  // Passo 1: o cursor escolhe uma estética e a grade troca de wallpapers.
  const pick = $('.demo-pick');
  const pickChips = $$('.dp-chips span', pick);
  const pickTiles = $$('.dp-grid i', pick);
  const pickCursor = $('.demo-cursor', pick);
  const PICK_SETS = [[0, 6, 14], [1, 13, 15], [10, 17, 5]];
  pickTiles.forEach((el, j) => { el.style.background = artFor(PICK_SETS[0][j]); });
  pickChips[0].classList.add('on');
  autoLoop(pick, i => {
    const k = (i + 1) % PICK_SETS.length;
    const pr = pick.getBoundingClientRect();
    const cr = pickChips[k].getBoundingClientRect();
    pickCursor.style.left = `${cr.left - pr.left + cr.width * .55}px`;
    pickCursor.style.top = `${cr.top - pr.top + cr.height * .5}px`;
    setTimeout(() => {
      pickCursor.classList.add('press');
      pickChips.forEach((c, j) => c.classList.toggle('on', j === k));
      pickTiles.forEach(el => el.classList.add('swap'));
      setTimeout(() => {
        pickCursor.classList.remove('press');
        pickTiles.forEach((el, j) => { el.style.background = artFor(PICK_SETS[k][j]); el.classList.remove('swap'); });
      }, 420);
    }, 650);
  }, 2600, false);

  // Passo 2: a área de trabalho troca de wallpaper e os ícones acompanham as cores.
  const deskDemo = $('.demo-desk');
  const ddWalls = $$('.dd-wall', deskDemo);
  const DESK_SET = [0, 2, 10, 13];
  let ddFront = 0;
  autoLoop(deskDemo, i => {
    const idx = DESK_SET[i % DESK_SET.length];
    const c = PALETTES[LIBRARY[idx].p];
    const next = ddWalls[1 - ddFront];
    next.style.background = artFor(idx);
    next.classList.add('on');
    ddWalls[ddFront].classList.remove('on');
    ddFront = 1 - ddFront;
    $$('.dd-icons i, .dd-bar i', deskDemo).forEach((el, j) => el.style.setProperty('--c', c[j % 3]));
    $('.dd-name', deskDemo).textContent = `${LIBRARY[idx].f}.jpg`;
  }, 2200);

  // Passo 3: baixa, aplica e mostra o resultado.
  const getDemo = $('.demo-get');
  const dgBar = $('.dg-bar i', getDemo);
  const dgStatus = $('.dg-status', getDemo);
  $('.dg-thumb', getDemo).style.background = artFor(0);
  $('.dg-wall', getDemo).style.background = artFor(0);
  autoLoop(getDemo, i => {
    const phase = i % 4;
    getDemo.dataset.phase = phase;
    if (phase === 0) {
      dgBar.style.transition = 'none';
      dgBar.style.width = '0%';
      void dgBar.offsetWidth;
      dgBar.style.transition = '';
      dgStatus.textContent = '';
    } else if (phase === 1) {
      dgBar.style.width = '100%';
      dgStatus.textContent = t('demo.downloading');
    } else if (phase === 2) {
      dgStatus.textContent = t('demo.applied');
    }
  }, 1500);

  // Estático × animado: alterna sozinho até a pessoa escolher.
  const desk = $('.desk');
  const deskVideo = $('video', desk);
  let deskVisible = false;
  let deskMode = 'static';
  function setDeskMode(mode) {
    deskMode = mode;
    desk.dataset.mode = mode;
    $$('#recursos .seg [data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    if (mode === 'live' && deskVisible) deskVideo.play().catch(() => {});
    else deskVideo.pause();
  }
  new IntersectionObserver(([en]) => { deskVisible = en.isIntersecting; setDeskMode(deskMode); }).observe(desk);
  const stopDesk = autoLoop(desk, i => setDeskMode(i % 2 ? 'static' : 'live'), 3600, false);
  $$('#recursos .seg [data-mode]').forEach(b => b.addEventListener('click', () => {
    stopDesk();
    hideNote('#recursos');
    setDeskMode(b.dataset.mode);
  }));

  // Paletas e monitores: demonstram sozinhos até o primeiro clique.
  const PAL_KEYS = Object.keys(PALETTES);
  const stopPalLoop = autoLoop(board, i => selectPalette(PAL_KEYS[(i + 1) % PAL_KEYS.length], true), 2800, false);
  function stopPal() { stopPalLoop(); hideNote('#paletas'); }

  const MON_STEPS = [() => setMonitors(2), () => setProtect(false), () => setProtect(true), () => setMonitors(1), () => setMonitors(3)];
  const stopMonLoop = autoLoop(monWrap, i => MON_STEPS[i % MON_STEPS.length](), 2600, false);
  function stopMon() { stopMonLoop(); hideNote('#monitores'); }

  /* ---------- Troca de idioma ---------- */
  $$('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang === lang) return;
    applyLang(b.dataset.lang, true);
    // Títulos já vistos continuam visíveis depois de trocar o texto.
    measureWall();
  }));

  /* ---------- Rolagem ---------- */
  const nav = $('.nav');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('is-scrolled', scrollY > 24);
      renderWall();
      renderPriceWord();
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measureWall(); renderWall(); layoutPano(); }, { passive: true });

  /* ---------- Revelar ao entrar na tela ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });

  /* ---------- Carrossel de vídeos do topo ---------- */
  // Vídeos dos wallpapers em setups, na ordem em que aparecem. Para adicionar um vídeo:
  // salve NOME.mp4, NOME.webm e NOME-poster.jpg em assets/video e coloque 'NOME' na lista.
  const HERO_CLIPS = ['setup-01', 'setup-02', 'setup-03', 'setup-04', 'setup-05', 'setup-06', 'setup-07'];
  const MIN_CARDS = 9;         // com poucos vídeos, a lista se repete até encher a curva
  const REEL_SPEED = 38;       // px por segundo
  const reel = $('.reel');
  const reelTrack = $('.reel-track', reel);
  const cards = [];
  const playV = v => v.play().catch(() => {});

  for (let i = 0; cards.length < Math.max(MIN_CARDS, HERO_CLIPS.length); i++) {
    const name = HERO_CLIPS[i % HERO_CLIPS.length];
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'reel-card';
    el.setAttribute('data-i18n-attr', 'aria-label:reel.play');
    el.innerHTML = `<video muted loop playsinline preload="auto" poster="assets/video/${name}-poster.jpg" aria-hidden="true">
        <source src="assets/video/${name}.webm" type="video/webm">
        <source src="assets/video/${name}.mp4" type="video/mp4">
      </video><span class="reel-name mono">${name}</span>`;
    const v = $('video', el);
    v.muted = true;
    // Quadros repetidos começam em pontos diferentes do vídeo para não ficarem iguais.
    const start = cards.length * 1.3;
    v.addEventListener('loadedmetadata', () => { if (v.duration) v.currentTime = start % v.duration; }, { once: true });
    reelTrack.appendChild(el);
    cards.push({ el, v, lift: 0 });
  }

  let reelOffset = 0;
  let reelLast = 0;
  let reelVisible = false;
  let focusCard = null;        // quadro tocando o vídeo inteiro (mouse, toque ou teclado)

  // Os quadros ficam na parte de dentro de um cilindro: o centro fica mais longe
  // e as bordas vêm para a frente, viradas para o meio (curva côncava).
  function layoutReel(dt) {
    const half = reel.clientWidth / 2;
    const cw = cards[0].el.offsetWidth;
    const P = parseFloat(getComputedStyle(reel).perspective) || 900;
    const gap = cw * 1.05;                        // distância entre quadros, medida na curva
    const R = Math.max(half * .8, cw * 1.9);      // raio do cilindro: menor = mais curvo
    const total = gap * cards.length;
    if (!focusCard) reelOffset = (reelOffset + REEL_SPEED * dt) % total;
    cards.forEach((c, i) => {
      let s = (((i * gap - reelOffset) % total) + total) % total;
      if (s > total / 2) s -= total;
      const th = s / R;                           // ângulo na curva, em radianos
      const on = c.el === focusCard;
      c.lift += ((on ? 1 : 0) - c.lift) * Math.min(1, dt * 10);
      const x = R * Math.sin(th);
      const zBase = R * (1 - Math.cos(th));
      const z = zBase + c.lift * 90;
      // Onde o quadro aparece na tela depois da perspectiva: 0 no centro, 1 na borda.
      // Quadros atrás da curva ou colados na câmera ficam de fora.
      const a = Math.abs(th) < 1.45 && zBase < P * .8 ? Math.abs(x * P / (P - zBase)) / half : 9;
      const rot = -th * (180 / Math.PI) * (1 - c.lift);
      c.el.style.transform = `translateX(${x.toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateY(${rot.toFixed(2)}deg) scale(${(1 + c.lift * .08).toFixed(3)})`;
      c.el.style.opacity = on ? 1 : clamp((1.4 - a) * 2.5);
      c.el.style.visibility = on || a < 1.4 ? '' : 'hidden';
      c.el.style.zIndex = on ? 50 : Math.round(10 + a * 10);
      c.el.classList.toggle('is-center', !focusCard && a < .2);
      // Só rodam os quadros perto do centro (ou o escolhido); o resto fica parado.
      const shouldPlay = reelVisible && (on || (!focusCard && a < .45));
      if (shouldPlay && c.v.paused) playV(c.v);
      else if (!shouldPlay && !c.v.paused) c.v.pause();
    });
  }

  function setFocus(el) {
    if (focusCard === el) return;
    focusCard = el;
    reel.classList.toggle('is-paused', !!el);
    cards.forEach(c => c.el.classList.toggle('is-focus', c.el === el));
    if (el) {
      const v = $('video', el);
      v.currentTime = 0;       // vídeo inteiro, do começo
      playV(v);
    }
    layoutReel(0);
  }

  cards.forEach(({ el }) => {
    el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') setFocus(el); });
    el.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && focusCard === el) setFocus(null); });
    el.addEventListener('click', e => {
      if (e.pointerType === 'mouse') return;
      setFocus(focusCard === el ? null : el);   // toque (ou Enter) liga e desliga
    });
    el.addEventListener('focus', () => { if (el.matches(':focus-visible')) setFocus(el); });
    el.addEventListener('blur', () => { if (focusCard === el) setFocus(null); });
  });
  // Tocar fora do carrossel volta a girar.
  addEventListener('pointerdown', e => { if (focusCard && !reel.contains(e.target)) setFocus(null); }, { passive: true });

  function reelTick(now) {
    const dt = reelLast ? Math.min((now - reelLast) / 1000, .05) : 0;
    reelLast = now;
    layoutReel(dt);
    if (reelVisible) requestAnimationFrame(reelTick);
    else reelLast = 0;
  }
  // Gira só enquanto está na tela, para não gastar processamento.
  new IntersectionObserver(([en]) => {
    const was = reelVisible;
    reelVisible = en.isIntersecting;
    if (reelVisible && !was) requestAnimationFrame(reelTick);
    if (!reelVisible) cards.forEach(c => c.v.pause());
  }).observe(reel);
  addEventListener('resize', () => layoutReel(0), { passive: true });
  // Se o navegador bloquear o autoplay, os vídeos começam no primeiro toque ou rolagem.
  ['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(ev =>
    addEventListener(ev, () => layoutReel(0), { once: true, passive: true }));

  /* ---------- Início ---------- */
  applyLang(lang, false);
  selectPalette('brasa', false);
  setMonitors(3);
  measureWall();
  renderWall();
  onScroll();
  $$('[data-split]:not(.hero-title), [data-reveal]').forEach(el => io.observe(el));

  const start = () => {
    document.body.classList.add('is-loaded');
    $('.hero-title').classList.add('is-in');
    measureWall();
    renderWall();
    layoutPano();
  };
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 1200))]).then(() => requestAnimationFrame(start));
})();
