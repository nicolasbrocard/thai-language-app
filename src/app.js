/* Phûut Thai — app engine. Vanilla JS, no dependencies. */
(() => {
'use strict';

/* ---------- tiny helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const h = (tag, attrs, ...kids) => {
  const e = document.createElement(tag);
  for (const k in attrs || {}) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
};
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
const today = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return today(d); };
const I = {
  speaker: '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  slow: '<path d="M3 15a6 6 0 0 1 12 0v1H3v-1z" fill="currentColor"/><path d="M15 15h3.5a2.5 2.5 0 0 0 0-5H17M6 16v3M12 16v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  x: '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  gear: '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  flame: '<path d="M12 2c1 4 5 5.5 5 10.5A5 5 0 0 1 7 12.500c0-2 1-3 1.500-4.500C10 9.500 12 7 12 2z" fill="currentColor"/>',
  chev: '<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  path: '<path d="M5 20c0-6 14-4 14-10a4 4 0 0 0-8 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="5" cy="20" r="2" fill="currentColor"/>',
  loop: '<path d="M4 12a8 8 0 0 1 14-5.300M20 12a8 8 0 0 1-14 5.300" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  book: '<path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 9h5M9 13h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
  pause: '<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>',
  next: '<path d="M6 5v14l9-7zM17 5v14" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
};
const icon = n => h('span', { html: `<svg viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>` }).firstChild;

/* ---------- state ---------- */
const KEY = 'phuut.v1';
const def = () => ({ gender: null, rate: 0.9, voice: '', showThai: true, xp: 0, streak: 0, lastDay: '', day: '', dayXp: 0, goal: 40, done: {}, srs: {}, hist: {}, onboarded: false });
let S = def();
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
if (S.day !== today()) { S.day = today(); S.dayXp = 0; }
try { navigator.storage && navigator.storage.persist && navigator.storage.persist().catch(() => {}); } catch (e) {}

/* ---------- content model ---------- */
const LEXMAP = {};
LEX.trim().split('\n').forEach(l => { const [th, rom, gl, em] = l.split('|'); LEXMAP[th] = { th, rom, gl, em }; });
const QWORDS = new Set(['ไหม', 'อะไร', 'ไหน', 'ที่ไหน', 'เท่าไหร่', 'กี่', 'เมื่อไหร่', 'ทำไม', 'หรือ', 'ล่ะ']);
// Female speakers: ผม → ฉัน, ครับ → ค่ะ (statement) / คะ (question or after นะ)
function gendered(base) {
  if (S.gender !== 'f') return base;
  let q = false;
  return base.map((t, i) => {
    if (t === 'ผม') return 'ฉัน';
    if (QWORDS.has(t)) q = true;
    if (t === 'ครับ') { const r = (q || base[i - 1] === 'นะ') ? 'คะ' : 'ค่ะ'; q = false; return r; }
    return t;
  });
}
const PARTICLES = new Set(['ครับ', 'ค่ะ', 'คะ']);
const mk = (th, en, em) => { const base = th.split(' '); return { key: th, base, en, em: em || (base.length === 1 ? LEXMAP[base[0]].em : null), multi: base.length > 1 }; };
const toks = it => gendered(it.base);
const romOf = it => toks(it).map(t => LEXMAP[t].rom).join(' ');
const thaiOf = it => toks(it).join('');
const sayText = it => toks(it).map((t, i, a) => PARTICLES.has(t) && i < a.length - 1 ? t + ' ' : t).join('');

const LESSONS = [];
const REG = {};
COURSE.forEach((u, ui) => u.lessons.forEach((L, li) => {
  const lesson = { id: u.id + '.' + (li + 1), unit: u, ui, li, title: L.title, tip: L.tip, idx: LESSONS.length,
    items: L.items.map(a => mk(...a)), mix: (L.mix || []).map(a => mk(...a)),
    dialogue: L.dialogue && { title: L.dialogue.title, lines: L.dialogue.lines.map(([who, th, en]) => ({ who, it: mk(th, en) })) } };
  [...lesson.items, ...lesson.mix].forEach(it => { if (!REG[it.key]) { it.lesson = lesson.idx; REG[it.key] = it; } });
  lesson.items = lesson.items.map(it => REG[it.key]); lesson.mix = lesson.mix.map(it => REG[it.key]);
  LESSONS.push(lesson);
}));
const nextLesson = () => LESSONS.find(l => !S.done[l.id]) || LESSONS[LESSONS.length - 1];
const poolUpTo = idx => Object.values(REG).filter(it => it.lesson <= idx);
const learned = () => Object.keys(S.srs).map(k => REG[k]).filter(Boolean);
const dueItems = () => learned().filter(it => S.srs[it.key].due <= today());

/* ---------- romanization with tone colours ---------- */
function toneOf(syl) {
  if (/[àèìòù]/.test(syl)) return 'low';
  if (/[âêîôû]/.test(syl)) return 'fall';
  if (/[áéíóú]/.test(syl)) return 'high';
  if (/[ǎěǐǒǔ]/.test(syl)) return 'rise';
  return 'mid';
}
function romEl(text, cls) {
  const e = h('span', { class: 'rom ' + (cls || '') });
  text.split(' ').forEach((w, i) => {
    if (i) e.append(' ');
    w.split('-').forEach((s, j) => { if (j) e.append(h('span', { class: 'hy' }, '·')); e.append(h('span', { class: toneOf(s) }, s)); });
  });
  return e;
}

/* ---------- speech out ---------- */
const TTS = {
  ok: 'speechSynthesis' in window, voices: [], unlocked: false,
  init() {
    if (!this.ok) return;
    const load = () => { this.voices = speechSynthesis.getVoices() || []; };
    load(); try { speechSynthesis.addEventListener('voiceschanged', load); } catch (e) {}
  },
  thaiVoices() { return this.voices.filter(v => /^th([-_]|$)/i.test(v.lang)); },
  status() { return !this.ok ? 'none' : (this.voices.length && !this.thaiVoices().length ? 'novoice' : 'ok'); },
  voiceFor(lang) {
    if (lang === 'th-TH') {
      const th = this.thaiVoices();
      return th.find(v => v.voiceURI === S.voice) || th.find(v => /premium|enhanced|natural|google/i.test(v.name)) || th[0] || null;
    }
    const en = this.voices.filter(v => /^en/i.test(v.lang));
    return en.find(v => /en[-_]US/i.test(v.lang) && v.localService) || en[0] || null;
  },
  unlock() { if (this.ok && !this.unlocked) { this.unlocked = true; try { speechSynthesis.speak(new SpeechSynthesisUtterance('')); } catch (e) {} } },
  stop() { this.token = {}; if (this.ok) try { speechSynthesis.cancel(); } catch (e) {} },
  speak(text, { lang = 'th-TH', rate = 1 } = {}) {
    return new Promise(res => {
      if (!this.ok) return res(false);
      const token = this.token = {};
      try { speechSynthesis.cancel(); } catch (e) {}
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang; const v = this.voiceFor(lang); if (v) try { u.voice = v; } catch (e) {}
      u.rate = Math.max(0.4, Math.min(1.3, rate * (lang === 'th-TH' ? S.rate : 1)));
      let fin = false;
      const done = ok => { if (fin) return; fin = true; clearTimeout(t); res(ok && this.token === token); };
      u.onend = () => done(true); u.onerror = () => done(false);
      const t = setTimeout(() => done(false), 3000 + text.length * 450);
      this._u = u; // keep a reference: some browsers drop the end event otherwise
      setTimeout(() => { if (this.token === token) try { speechSynthesis.speak(u); } catch (e) { done(false); } else done(false); }, 70);
    });
  },
};
TTS.init();
const say = (it, slow) => TTS.speak(sayText(it), { rate: slow ? 0.6 : 1 });
const sayWord = t => TTS.speak(t, { rate: 0.9 });

/* ---------- speech in ---------- */
const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition;
let micBlocked = false, activeRec = null;
function hear() {
  return new Promise(res => {
    let got = false; const out = v => { if (!got) { got = true; activeRec = null; res(v); } };
    try {
      const r = activeRec = new SRClass();
      r.lang = 'th-TH'; r.maxAlternatives = 5; r.interimResults = false;
      r.onresult = e => out({ alts: Array.from(e.results[0]).map(a => a.transcript) });
      r.onerror = e => { if (/not-allowed|service-not-allowed|audio-capture/.test(e.error)) micBlocked = true; out({ error: e.error }); };
      r.onend = () => out({ error: 'no-speech' });
      r.start();
      setTimeout(() => { try { r.stop(); } catch (e) {} }, 9000);
    } catch (e) { micBlocked = true; out({ error: 'unavailable' }); }
  });
}
const norm = s => s.replace(/[^฀-๿]/g, '').replace(/ครับ|ค่ะ|คะ|ค่า|คับ|ค้าบ/g, '');
function lev(a, b) {
  const m = a.length, n = b.length; if (!m || !n) return Math.max(m, n);
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
  return prev[n];
}
function matches(it, alts) {
  const target = norm(thaiOf(it)) || thaiOf(it);
  return alts.some(a => { const x = norm(a) || a.replace(/\s/g, ''); return x && (1 - lev(x, target) / Math.max(x.length, target.length)) >= 0.7; });
}

/* ---------- sound effects ---------- */
let AC;
function blip(ok) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime;
    (ok ? [660, 880] : [220, 180]).forEach((f, i) => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = ok ? 'sine' : 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * 0.09); g.gain.exponentialRampToValueAtTime(0.12, t + i * 0.09 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.16);
      o.connect(g).connect(AC.destination); o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.18);
    });
  } catch (e) {}
}

/* ---------- progress & spaced repetition ---------- */
const GAPS = [0, 1, 2, 4, 8, 16, 32, 64];
function grade(it, ok) {
  const r = S.srs[it.key] || (S.srs[it.key] = { box: 0, due: today() });
  r.box = ok ? Math.min(GAPS.length - 1, r.box + 1) : Math.max(0, r.box - 2);
  r.due = addDays(GAPS[r.box]);
}
function addXp(n) {
  if (S.day !== today()) { S.day = today(); S.dayXp = 0; }
  S.xp += n; S.dayXp += n;
  S.hist[today()] = S.dayXp; Object.keys(S.hist).sort().slice(0, -90).forEach(k => delete S.hist[k]);
  if (S.lastDay !== today()) { S.streak = S.lastDay === addDays(-1) ? S.streak + 1 : 1; S.lastDay = today(); }
}
const liveStreak = () => (S.lastDay === today() || S.lastDay === addDays(-1)) ? S.streak : 0;

/* ---------- shell ---------- */
const app = $('#app');
let tab = 'learn', sess = null, player = null;
function mount(...nodes) { TTS.stop(); app.className = S.showThai ? '' : 'no-thai'; app.replaceChildren(...nodes.flat().filter(Boolean)); }
document.addEventListener('pointerdown', () => TTS.unlock(), { once: true });

function playBtns(it, { small } = {}) {
  const b = h('button', { class: 'pbtn' + (small ? ' sm' : ''), 'aria-label': 'Play', onclick: async () => { b.classList.add('speaking'); await say(it); b.classList.remove('speaking'); } }, icon('speaker'));
  const s = h('button', { class: 'pbtn sm', 'aria-label': 'Play slowly', onclick: () => say(it, true) }, icon('slow'));
  return h('div', { class: 'play' }, b, s);
}
function wordChips(it) {
  return h('div', { class: 'words' }, toks(it).map(t => h('button', { class: 'word', onclick: () => sayWord(t) }, romEl(LEXMAP[t].rom), h('small', {}, LEXMAP[t].gl))));
}

/* ---------- home ---------- */
function topBar() {
  return h('div', { class: 'top' },
    h('div', { class: 'logo', html: 'Ph<i>û</i>ut Thai' }),
    h('div', { class: 'chip', title: 'Day streak' }, icon('flame'), String(liveStreak())),
    h('button', { class: 'iconbtn', 'aria-label': 'Settings', onclick: openSettings }, icon('gear')));
}
function navBar() {
  const b = (id, label, ic) => h('button', { 'aria-current': tab === id ? 'page' : null, onclick: () => { tab = id; home(); } }, icon(ic), label);
  return h('nav', { class: 'nav' }, b('learn', 'Learn', 'path'), b('practice', 'Practice', 'loop'), b('words', 'Words', 'book'));
}
function voiceNote() {
  const st = TTS.status();
  if (st === 'ok') return null;
  return h('div', { class: 'note' }, h('b', {}, st === 'none' ? 'This browser cannot speak' : 'No Thai voice on this device'),
    h('span', {}, st === 'none' ? 'Open the app in Safari (iPhone) or Chrome (Android) to hear Thai.' :
      'iPhone: Settings → Accessibility → Spoken Content → Voices → Thai. Android: Settings → Text-to-speech → install Thai voice data. Then reload.'));
}
function home() {
  const scroll = h('div', { class: 'scroll' });
  if (tab === 'learn') renderLearn(scroll); else if (tab === 'practice') renderPractice(scroll); else renderWords(scroll);
  mount(topBar(), scroll, navBar());
}
function renderLearn(root) {
  const nx = nextLesson(), due = dueItems().length, allDone = LESSONS.every(l => S.done[l.id]);
  const warm = Math.min(due, 6), goalMet = S.dayXp >= S.goal;
  root.append(voiceNote() || '');
  root.append(h('div', { class: 'hero' },
    h('div', { class: 'eyebrow' }, allDone ? 'Course complete' : (goalMet ? 'Goal reached today' : 'Today\'s session')),
    h('h2', {}, allDone ? 'Keep it alive with reviews' : nx.title),
    h('p', {}, allDone ? 'Every word comes back just before you would forget it.' : (warm ? `${warm} quick ${warm === 1 ? 'review' : 'reviews'}, then ` : '') + `Unit ${nx.ui + 1} · Lesson ${nx.li + 1}. About ${warm ? 8 : 6} minutes.`),
    h('button', { class: 'btn', onclick: () => allDone ? startReview() : startToday(nx) }, allDone ? 'Review now' : (nx.idx === 0 && !S.xp ? 'Start first lesson' : (goalMet ? 'Do one more' : 'Start')))));
  const week = h('div', { class: 'week' });
  for (let d = 6; d >= 0; d--) { const k = addDays(-d), dt = new Date(); dt.setDate(dt.getDate() - d); const xp = S.hist[k] || 0;
    week.append(h('div', { class: 'day' + (xp >= S.goal ? ' full' : xp ? ' some' : '') + (d ? '' : ' now') }, h('i', {}, xp >= S.goal ? icon('check') : ''), h('span', {}, 'SMTWTFS'[dt.getDay()]))); }
  root.append(h('div', { class: 'goal' },
    h('div', { class: 'line' }, h('span', {}, 'Today'), h('span', {}, `${Math.min(S.dayXp, S.goal)} / ${S.goal} XP`)),
    h('div', { class: 'bar' }, h('i', { style: `width:${Math.min(100, S.dayXp / S.goal * 100)}%` })), week));
  if (due > warm && !allDone) root.append(h('button', { class: 'btn ghost', onclick: startReview }, icon('loop'), `Review all ${due} due items`));
  COURSE.forEach((u, ui) => {
    const box = h('section', { class: 'unit' }, h('div', { class: 'unit-h' }, h('span', { class: 'n' }, 'Unit ' + (ui + 1)), h('h3', {}, u.title)), h('p', {}, u.sub));
    LESSONS.filter(l => l.ui === ui).forEach(l => {
      const st = S.done[l.id] ? 'is-done' : (l === nx ? 'next' : '');
      box.append(h('button', { class: 'lesson ' + st, onclick: () => startLesson(l) },
        h('span', { class: 'dot' }, st === 'is-done' ? icon('check') : String(l.li + 1)),
        h('span', { class: 't' }, h('b', {}, l.title), h('span', {}, l.items.slice(0, 4).map(i => i.en).join(', '))),
        icon('chev')));
    });
    root.append(box);
  });
}
function renderPractice(root) {
  const L = learned(), due = dueItems().length;
  if (!L.length) { root.append(h('div', { class: 'card' }, h('h3', {}, 'Nothing to practise yet'), h('p', {}, 'Finish your first lesson and everything you learn shows up here for review, hands-free listening and speaking drills.'), h('button', { class: 'btn', onclick: () => startLesson(nextLesson()) }, 'Start first lesson'))); return; }
  root.append(h('div', { class: 'card' }, h('div', { class: 'eyebrow' }, 'Spaced repetition'), h('h3', {}, due ? `${due} ${due === 1 ? 'item is' : 'items are'} ready for review` : 'All caught up'),
    h('p', {}, 'Each word returns after 1, 2, 4, 8, 16… days, right before you would forget it. Miss it and it comes back sooner.'),
    h('button', { class: 'btn', onclick: startReview }, due ? 'Review now' : 'Practise anyway')));
  root.append(h('div', { class: 'card' }, h('div', { class: 'eyebrow' }, 'Hands-free'), h('h3', {}, 'Listen and repeat'),
    h('p', {}, 'English prompt, a pause for you to answer out loud, then the Thai twice. For walks, rides and washing up.'),
    h('button', { class: 'btn ghost', onclick: () => startPlayer(L) }, icon('play'), 'Start listening')));
  root.append(h('div', { class: 'card' }, h('div', { class: 'eyebrow' }, 'Speaking'), h('h3', {}, 'Say it drill'),
    h('p', {}, 'Ten prompts, speaking only. Recall is what makes words stick.'),
    h('button', { class: 'btn ghost', onclick: () => startSession(pick(L, 10).map(it => ({ t: 'speak', it })), { title: 'Speaking drill' }) }, icon('mic'), 'Start drill')));
  const dl = LESSONS.filter(l => l.dialogue && S.done[l.id]);
  if (dl.length) root.append(h('div', { class: 'card' }, h('div', { class: 'eyebrow' }, 'Conversations'), h('h3', {}, 'Replay a dialogue'),
    dl.map(l => h('button', { class: 'btn ghost', onclick: () => startSession([{ t: 'dialogue', d: l.dialogue }], { title: l.dialogue.title }) }, l.dialogue.title))));
}
function renderWords(root) {
  const L = learned().sort((a, b) => a.lesson - b.lesson);
  if (!L.length) { root.append(h('div', { class: 'card' }, h('h3', {}, 'Your phrasebook is empty'), h('p', {}, 'Words and phrases you learn are collected here. Tap any of them to hear it again.'))); return; }
  const list = h('div', { style: 'display:flex;flex-direction:column;gap:8px' });
  const draw = q => {
    q = q.trim().toLowerCase();
    const plain = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    list.replaceChildren(...L.filter(it => !q || it.en.toLowerCase().includes(q) || plain(romOf(it)).includes(plain(q))).map(it => {
      const box = S.srs[it.key].box;
      return h('button', { class: 'wrow', onclick: () => say(it) }, icon('speaker'),
        h('span', { class: 't' }, romEl(romOf(it)), h('small', {}, it.en), h('small', { class: 'thai' }, thaiOf(it))),
        h('span', { class: 'lvl', title: 'Memory strength' }, [1, 3, 5].map(n => h('i', { class: box >= n ? 'on' : '' }))));
    }));
  };
  root.append(h('input', { class: 'search', id: 'word-search', type: 'search', placeholder: `Search ${L.length} words and phrases`, 'aria-label': 'Search', oninput: e => draw(e.target.value) }), list);
  draw('');
}

/* ---------- settings ---------- */
function sheet(...kids) {
  const bg = h('div', { class: 'sheet-bg', onclick: e => { if (e.target === bg) bg.remove(); } }, h('div', { class: 'sheet' }, kids));
  document.body.append(bg); return bg;
}
function seg(opts, cur, on) {
  const el = h('div', { class: 'seg' });
  opts.forEach(([v, label]) => el.append(h('button', { 'aria-pressed': String(v === cur), onclick: () => { [...el.children].forEach(c => c.setAttribute('aria-pressed', 'false')); el.children[opts.findIndex(o => o[0] === v)].setAttribute('aria-pressed', 'true'); on(v); } }, label)));
  return el;
}
function openSettings() {
  const th = TTS.thaiVoices();
  let armed = false;
  const reset = h('button', { class: 'btn bad', onclick: () => { if (!armed) { armed = true; reset.textContent = 'Tap again to erase all progress'; return; } S = def(); save(); bg.remove(); start(); } }, 'Reset progress');
  const code = h('textarea', { id: 'backup-code', class: 'code', rows: '3', spellcheck: 'false', 'aria-label': 'Backup code' });
  const pack = () => btoa(unescape(encodeURIComponent(JSON.stringify(S))));
  code.value = pack();
  const copy = h('button', { class: 'btn ghost', onclick: async () => { code.value = pack(); code.select(); let ok = false; try { await navigator.clipboard.writeText(code.value); ok = true; } catch (e) { try { ok = document.execCommand('copy'); } catch (e2) {} } copy.textContent = ok ? 'Copied' : 'Select and copy'; } }, 'Copy code');
  const restore = h('button', { class: 'btn ghost', onclick: () => { try { const o = JSON.parse(decodeURIComponent(escape(atob(code.value.trim())))); if (!o || typeof o.srs !== 'object' || typeof o.xp !== 'number') throw 0; S = Object.assign(def(), o); save(); bg.remove(); start(); } catch (e) { restore.textContent = 'Not a valid code'; } } }, 'Restore');
  const bg = sheet(
    h('h2', {}, 'Settings'),
    h('div', { class: 'field' }, 'I speak as a', seg([['m', 'Man (khráp)'], ['f', 'Woman (khâ)']], S.gender, v => { S.gender = v; save(); })),
    h('label', { class: 'field', for: 'set-rate' }, 'Thai speech speed', h('input', { id: 'set-rate', type: 'range', min: '0.6', max: '1.1', step: '0.05', value: String(S.rate), onchange: e => { S.rate = +e.target.value; save(); TTS.speak('สวัสดี สบายดีไหม'); } })),
    th.length > 1 ? h('label', { class: 'field', for: 'set-voice' }, 'Thai voice', h('select', { id: 'set-voice', onchange: e => { S.voice = e.target.value; save(); TTS.speak('สวัสดี สบายดีไหม'); } }, th.map(v => h('option', { value: v.voiceURI, selected: v.voiceURI === (TTS.voiceFor('th-TH') || {}).voiceURI }, v.name)))) : null,
    h('div', { class: 'field' }, 'Thai script under the romanization', seg([[true, 'Show'], [false, 'Hide']], S.showThai, v => { S.showThai = v; save(); app.className = v ? '' : 'no-thai'; })),
    h('div', { class: 'field' }, 'Daily goal', seg([[20, 'Light'], [40, 'Regular'], [80, 'Serious']], S.goal, v => { S.goal = v; save(); })),
    h('button', { class: 'btn ghost', onclick: () => { bg.remove(); startSession([{ t: 'tones' }], { title: 'Tones', free: true }); } }, 'How tones work'),
    h('label', { class: 'field', for: 'backup-code' }, 'Backup code. Copy it somewhere safe, or paste one here to restore.', code),
    h('div', { class: 'row' }, copy, restore),
    reset,
    h('button', { class: 'btn', onclick: () => { bg.remove(); if (!sess && !player) home(); } }, 'Done'));
}

/* ---------- onboarding ---------- */
function onboard() {
  const stage = h('div', { class: 'stage' }), foot = h('div', { class: 'foot' });
  mount(h('div', { class: 'top' }, h('div', { class: 'logo', html: 'Ph<i>û</i>ut Thai' })), stage, foot);
  const s1 = () => {
    stage.replaceChildren(h('h2', { class: 'enter' }, h('small', {}, 'Welcome'), 'Speak and understand Thai. No alphabet needed.'),
      h('div', { class: 'card' }, h('p', { html: '<b>Listen first.</b> You hear every word before you read it, so your ear learns the tones.' }),
        h('p', { html: '<b>Say it out loud.</b> Recalling and speaking is what moves words into long-term memory.' }),
        h('p', { html: '<b>Build, don\'t memorise.</b> Thai grammar is a handful of patterns. You snap known words together into new sentences.' }),
        h('p', { html: '<b>Come back tomorrow.</b> Ten minutes a day, and reviews timed just before you forget.' })));
    foot.replaceChildren(h('button', { class: 'btn', onclick: s2 }, 'Continue'));
  };
  const s2 = () => {
    const go = h('button', { class: 'btn', disabled: !S.gender, onclick: s3 }, 'Continue');
    stage.replaceChildren(h('h2', { class: 'enter' }, h('small', {}, 'One question'), 'How should you speak?'),
      h('p', { class: 'center', style: 'text-align:left' }, 'Thai polite words and the word for "I" depend on the speaker. The lessons will teach you your own forms.'),
      h('div', { class: 'opts two' }, [['m', 'As a man', 'phǒm · khráp'], ['f', 'As a woman', 'chǎn · khâ']].map(([v, a, b]) => {
        const o = h('button', { class: 'opt' + (S.gender === v ? ' sel' : ''), onclick: () => { S.gender = v; save(); [...o.parentNode.children].forEach(c => c.classList.remove('sel')); o.classList.add('sel'); go.disabled = false; } }, h('span', {}, a), romEl(b));
        return o;
      })));
    foot.replaceChildren(go);
  };
  const s3 = () => {
    const hello = mk('สวัสดี ครับ', 'Hello');
    stage.replaceChildren(h('h2', { class: 'enter' }, h('small', {}, 'Sound check'), 'Tap to hear your first Thai word'),
      h('div', { class: 'learn' }, playBtns(hello), romEl(romOf(hello)), h('div', { class: 'en' }, 'Hello'), h('div', { class: 'hint' }, 'The turtle plays it slowly.')),
      voiceNote() || h('p', { class: 'center' }, 'No sound? Turn off silent mode and raise the volume. Thai voice setup help appears on the home screen if your device has no Thai voice.'));
    foot.replaceChildren(h('button', { class: 'btn', onclick: () => { S.onboarded = true; save(); startLesson(LESSONS[0]); } }, 'Start lesson 1'),
      h('button', { class: 'link', onclick: () => { S.onboarded = true; save(); home(); } }, 'Look around first'));
  };
  s1();
}

/* ---------- session building ---------- */
function buildLesson(L) {
  const steps = [];
  if (L.idx === 0 && !S.done[L.id]) steps.push({ t: 'tones' });
  if (L.tip) steps.push({ t: 'tip', tip: L.tip });
  for (let g = 0; g < L.items.length; g += 3) {
    const grp = L.items.slice(g, g + 3);
    grp.forEach((it, k) => { steps.push({ t: 'learn', it }); if (k) steps.push({ t: 'listen', it: grp[k - 1] }); });
    steps.push({ t: 'listen', it: grp[grp.length - 1] });
    shuffle(grp).forEach(it => steps.push({ t: it.multi ? 'build' : 'pick', it }));
    steps.push({ t: 'speak', it: grp[Math.floor(Math.random() * grp.length)] });
  }
  const cyc = ['build', 'speak', 'listen', 'dictate'];
  L.mix.forEach((it, i) => steps.push({ t: cyc[i % cyc.length], it, fresh: true }));
  pick(L.items.filter(i => i.multi), 2).forEach(it => steps.push({ t: 'speak', it }));
  if (L.dialogue) steps.push({ t: 'dialogue', d: L.dialogue });
  return steps;
}
function startToday(L) {
  const warm = shuffle(dueItems()).slice(0, 6).map(it => ({ t: pick(it.multi ? ['listen', 'build', 'speak', 'dictate'] : ['listen', 'pick', 'speak'], 1)[0], it }));
  startSession([...warm, ...buildLesson(L)], { lesson: L, title: L.title, pool: poolUpTo(L.idx) });
}
function startLesson(L) { startSession(buildLesson(L), { lesson: L, title: L.title, pool: poolUpTo(L.idx) }); }
function startReview() {
  const due = shuffle(dueItems()).slice(0, 12);
  const items = due.length >= 4 ? due : due.concat(pick(learned().filter(i => !due.includes(i)), 8 - due.length));
  if (!items.length) return home();
  startSession(shuffle(items).map(it => ({ t: pick(it.multi ? ['listen', 'build', 'speak', 'dictate'] : ['listen', 'pick', 'speak'], 1)[0], it })), { title: 'Review', review: true });
}
function distractors(it, n, pool) {
  const same = pool.filter(o => o !== it && o.en !== it.en && romOf(o) !== romOf(it));
  const close = same.filter(o => o.multi === it.multi), near = close.filter(o => Math.abs(o.lesson - it.lesson) <= 2);
  const out = pick(near, n); for (const src of [close, same]) for (const o of shuffle(src)) { if (out.length >= n) break; if (!out.includes(o)) out.push(o); }
  return out.slice(0, n);
}

/* ---------- session runner ---------- */
function startSession(steps, meta) {
  sess = { steps, i: 0, right: 0, wrong: 0, meta, pool: meta.pool || learned().concat(LESSONS[0].items), missed: new Set(), seen: new Set() };
  const bar = h('i', { style: 'width:0%' });
  sess.bar = bar; sess.stage = h('div', { class: 'stage' }); sess.foot = h('div', { class: 'foot' });
  let armed = false;
  const quit = h('button', { class: 'iconbtn', 'aria-label': 'Quit', onclick: () => { if (sess.i === 0 || armed) return endSession(false); armed = true; sess.foot.prepend(h('div', { class: 'fb no' }, h('div', { class: 'tx' }, h('b', {}, 'Quit this session?'), h('small', {}, 'Tap ✕ again to leave. Progress in this session is lost.')))); } }, icon('x'));
  mount(h('div', { class: 'sess-top' }, quit, h('div', { class: 'bar' }, bar)), sess.stage, sess.foot);
  renderStep();
}
function endSession(finished) {
  if (activeRec) try { activeRec.abort(); } catch (e) {}
  const s = sess; sess = null; TTS.stop();
  if (!finished) return home();
  const graded = s.right + s.wrong, acc = graded ? Math.round(s.right / graded * 100) : 100;
  const xp = s.meta.free ? 0 : 10 + s.right;
  if (!s.meta.free) {
    s.seen.forEach(it => grade(it, !s.missed.has(it)));
    if (s.meta.lesson) S.done[s.meta.lesson.id] = (S.done[s.meta.lesson.id] || 0) + 1;
    addXp(xp); save();
  }
  if (s.meta.free) return home();
  blip(true);
  const nx = nextLesson(), more = s.meta.lesson && !S.done[nx.id];
  mount(h('div', { class: 'stage' }, h('div', { class: 'done enter' },
    h('div', { class: 'big' }, acc >= 90 ? '🎉' : acc >= 70 ? '👏' : '💪'),
    h('h2', {}, s.meta.lesson ? 'Lesson complete' : 'Session complete'),
    h('div', { class: 'stats' }, h('div', { class: 'stat' }, h('b', {}, '+' + xp), h('span', {}, 'XP')), h('div', { class: 'stat' }, h('b', {}, acc + '%'), h('span', {}, 'accuracy')), h('div', { class: 'stat' }, h('b', {}, String(liveStreak())), h('span', {}, 'day streak'))),
    h('p', { class: 'center' }, s.missed.size ? `${s.missed.size} ${s.missed.size === 1 ? 'item' : 'items'} will come back sooner for extra practice.` : 'Clean run. These items return in a day, then at growing intervals.'))),
    h('div', { class: 'foot' }, more ? h('button', { class: 'btn', onclick: () => startLesson(nx) }, 'Next lesson') : null, h('button', { class: 'btn' + (more ? ' ghost' : ''), onclick: () => { tab = 'learn'; home(); } }, 'Back to home')));
}
function nextStep() { sess.i++; if (sess.i >= sess.steps.length) return endSession(true); renderStep(); }
function setFoot(...kids) { sess.foot.replaceChildren(...kids.flat().filter(Boolean)); }
function result(step, ok) {
  const it = step.it;
  sess.seen.add(it);
  if (ok) sess.right++; else { sess.wrong++; sess.missed.add(it); if (!step.retry) sess.steps.push({ ...step, retry: true }); }
  blip(ok);
  const replay = h('button', { class: 'pbtn sm', 'aria-label': 'Play answer', onclick: () => say(it) }, icon('speaker'));
  setFoot(h('div', { class: 'fb enter ' + (ok ? 'ok' : 'no') },
      h('div', { class: 'tx' }, h('b', {}, ok ? pick(['Correct', 'Nice', 'Exactly', 'Good ear'], 1)[0] : 'Correct answer'), romEl(romOf(it)), h('small', {}, it.en), h('small', { class: 'thai' }, thaiOf(it))), replay),
    h('button', { class: 'btn' + (ok ? '' : ' gold'), onclick: nextStep }, 'Continue'));
  if (step.t !== 'speak') say(it);
}
function renderStep() {
  const step = sess.steps[sess.i];
  sess.bar.style.width = (sess.i / sess.steps.length * 100) + '%';
  sess.stage.replaceChildren(); sess.stage.className = 'stage enter'; sess.stage.scrollTop = 0;
  void sess.stage.offsetWidth;
  STEP[step.t](step, sess.stage);
}
const title = (small, big) => h('h2', {}, h('small', {}, small), big);

const TONES = [['mid', 'maa', 'flat and steady', 'M2 14 H42'], ['low', 'màa', 'low and flat', 'M2 20 H42'], ['fall', 'mâa', 'starts high, drops', 'M2 8 C16 2 30 8 42 24'], ['high', 'máa', 'high, lifts at the end', 'M2 12 C20 10 32 8 42 3'], ['rise', 'mǎa', 'dips, then climbs', 'M2 12 C14 26 28 24 42 3']];
const STEP = {
  tones(step, root) {
    root.append(h('div', { class: 'tip' }, h('div', { class: 'eyebrow' }, 'Before you start'), h('h2', {}, 'Thai has five tones'),
      h('p', {}, 'The melody of a syllable is part of the word. You do not need to study this. Just notice the colours and copy what you hear, the way you would copy a tune.'),
      h('div', { class: 'tones' }, TONES.map(([c, r, d, p]) => h('div', {}, h('span', { html: `<svg viewBox="0 0 44 26"><path d="${p}" fill="none" stroke="var(--t-${c})" stroke-width="3.5" stroke-linecap="round"/></svg>` }).firstChild, romEl(r), h('small', {}, d))))));
    setFoot(h('button', { class: 'btn', onclick: nextStep }, 'Got it'));
  },
  tip(step, root) {
    root.append(h('div', { class: 'tip' }, h('div', { class: 'eyebrow' }, 'The logic'), h('h2', {}, step.tip[0]), h('p', { html: step.tip[1] })));
    setFoot(h('button', { class: 'btn', onclick: nextStep }, 'Got it'));
  },
  learn(step, root) {
    const it = step.it; sess.seen.add(it);
    root.append(h('div', { class: 'learn' },
      h('div', { class: 'eyebrow' }, it.multi ? 'New phrase' : 'New word'),
      it.em ? h('div', { class: 'pic' }, it.em) : null,
      playBtns(it), romEl(romOf(it)), h('div', { class: 'en' }, it.en), h('div', { class: 'thai' }, thaiOf(it)),
      it.multi ? wordChips(it) : null,
      h('div', { class: 'hint' }, it.multi ? 'Tap a word to hear it alone. Then say the whole phrase out loud.' : 'Listen, then say it out loud twice.')));
    setFoot(h('button', { class: 'btn', onclick: nextStep }, 'I said it'));
    say(it);
  },
  listen(step, root) {
    const it = step.it, opts = shuffle([it, ...distractors(it, 3, sess.pool)]);
    const two = opts.every(o => !o.multi && o.en.length < 22);
    const box = h('div', { class: 'opts' + (two ? ' two' : '') });
    opts.forEach(o => box.append(h('button', { class: 'opt', onclick: e => {
      box.classList.add('locked'); const ok = o === it;
      e.currentTarget.classList.add(ok ? 'ok' : 'no'); if (!ok) [...box.children][opts.indexOf(it)].classList.add('ok');
      result(step, ok);
    } }, two && o.em ? h('span', { class: 'em' }, o.em) : null, h('span', {}, o.en))));
    root.append(title('Listen', 'What does it mean?'), playBtns(it), box);
    setFoot(); say(it);
  },
  pick(step, root) {
    const it = step.it, opts = shuffle([it, ...distractors(it, 2, sess.pool)]);
    let sel = null;
    const check = h('button', { class: 'btn', disabled: true, onclick: () => {
      box.classList.add('locked'); const ok = sel === it;
      [...box.children].forEach((c, i) => { c.classList.remove('sel'); if (opts[i] === it) c.classList.add('ok'); else if (opts[i] === sel) c.classList.add('no'); c.querySelector('.lab').replaceChildren(romEl(romOf(opts[i])), h('span', { class: 'after' }, opts[i].en)); });
      result(step, ok);
    } }, 'Check');
    const box = h('div', { class: 'opts' });
    opts.forEach((o, i) => box.append(h('button', { class: 'opt', onclick: e => { sel = o; [...box.children].forEach(c => c.classList.remove('sel')); e.currentTarget.classList.add('sel'); check.disabled = false; say(o); } },
      h('span', { class: 'num' }, icon('speaker')), h('span', { class: 'lab' }, 'Sound ' + (i + 1)))));
    root.append(title('Choose the sound', 'Which one means…'), h('div', { class: 'prompt' }, it.em ? h('span', { class: 'em' }, it.em) : null, h('span', {}, it.en)), box);
    setFoot(check);
  },
  build(step, root) { buildUI(step, root, false); },
  dictate(step, root) { buildUI(step, root, true); },
  speak(step, root) {
    const it = step.it, canMic = !!SRClass && !micBlocked;
    const area = h('div', { style: 'display:flex;flex-direction:column;gap:12px' });
    let revealed = false;
    const reveal = () => {
      if (revealed) return; revealed = true;
      area.replaceChildren(h('div', { class: 'answer enter' }, playBtns(it, { small: true }), romEl(romOf(it)), h('div', { class: 'thai' }, thaiOf(it)), it.multi ? wordChips(it) : null),
        h('p', { class: 'center' }, 'Compare with what you said. Be honest, it decides when this comes back.'));
      say(it);
      setFoot(h('div', { class: 'row' }, h('button', { class: 'btn ghost', onclick: () => result(step, false) }, 'Not yet'), h('button', { class: 'btn', onclick: () => result(step, true) }, 'I said it right')));
    };
    const idle = msg => {
      area.replaceChildren(...(canMic && !micBlocked ? [mic] : []),
        h('p', { class: 'center' }, msg || (canMic && !micBlocked ? 'Tap the microphone and say it in Thai.' : 'Say it out loud, then check yourself.')));
      setFoot(h('button', { class: 'btn' + (canMic && !micBlocked ? ' ghost' : ''), onclick: reveal }, canMic && !micBlocked ? 'Show answer instead' : 'I said it. Show answer'),
        h('button', { class: 'link', onclick: nextStep }, 'Can\'t speak right now'));
    };
    const mic = h('button', { class: 'mic', 'aria-label': 'Speak', onclick: async () => {
      if (mic.classList.contains('on')) { try { activeRec && activeRec.stop(); } catch (e) {} return; }
      TTS.stop(); mic.classList.add('on');
      const r = await hear(); mic.classList.remove('on');
      if (!sess || sess.steps[sess.i] !== step || revealed) return;
      if (r.alts && matches(it, r.alts)) { area.replaceChildren(h('div', { class: 'heard' }, 'I heard: ' + r.alts[0])); return result(step, true); }
      if (r.alts) { idle(); area.prepend(h('div', { class: 'heard' }, 'I heard: ' + r.alts[0] + '. Try once more, or check the answer.')); return; }
      idle(micBlocked ? 'Microphone is not available here. Say it out loud, then check yourself.' : 'I did not catch that. Tap and try again.');
    } }, icon('mic'));
    root.append(title('Speak', 'Say it in Thai'), h('div', { class: 'prompt' }, it.em ? h('span', { class: 'em' }, it.em) : null, h('span', {}, it.en)), area);
    idle();
  },
  dialogue(step, root) {
    const d = step.d, chat = h('div', { class: 'chat' });
    root.append(title('Conversation', d.title), chat);
    let i = 0, phase = 1;
    const bubble = (ln, hidden) => h('button', { class: 'bub enter' + (ln.who === 'B' ? ' me' : '') + (hidden ? ' todo' : ''), onclick: () => say(ln.it) },
      hidden ? h('small', {}, 'Your turn: ' + ln.it.en) : [romEl(romOf(ln.it)), h('small', {}, ln.it.en), h('small', { class: 'thai' }, thaiOf(ln.it))]);
    const scroll = () => { root.scrollTop = root.scrollHeight; };
    const advance = () => {
      if (i >= d.lines.length) {
        if (phase === 1) { phase = 2; i = 0; chat.replaceChildren(); root.querySelector('h2').lastChild.textContent = 'Now you play the highlighted part'; return advance(); }
        return nextStep();
      }
      const ln = d.lines[i++], mine = phase === 2 && ln.who === 'B';
      if (mine) {
        const b = bubble(ln, true); chat.append(b); scroll();
        setFoot(h('button', { class: 'btn gold', onclick: () => { b.replaceWith(bubble(ln)); say(ln.it); scroll(); setFoot(h('button', { class: 'btn', onclick: advance }, i >= d.lines.length ? 'Finish' : 'Next line')); } }, 'I said it. Check'));
      } else {
        chat.append(bubble(ln)); scroll(); say(ln.it);
        setFoot(h('button', { class: 'btn', onclick: advance }, i >= d.lines.length ? (phase === 1 ? 'Now your turn' : 'Finish') : 'Next line'));
      }
    };
    advance();
  },
};
function buildUI(step, root, dictate) {
  const it = step.it, want = toks(it);
  const known = new Set(sess.pool.flatMap(o => toks(o)));
  const extra = pick([...known].filter(t => !want.includes(t) && !PARTICLES.has(t) && LEXMAP[t]), Math.min(3, Math.max(2, 6 - want.length)));
  const tiles = shuffle([...want, ...extra]);
  const slots = h('div', { class: 'slots' }), bank = h('div', { class: 'bank' });
  const chosen = [];
  const check = h('button', { class: 'btn', disabled: true, onclick: () => {
    slots.classList.add('locked'); bank.classList.add('locked');
    result(step, chosen.map(c => LEXMAP[c.t].rom).join(' ') === want.map(t => LEXMAP[t].rom).join(' '));
  } }, 'Check');
  tiles.forEach(t => {
    const b = h('button', { class: 'tile', onclick: () => {
      b.classList.add('used');
      const c = { t, el: h('button', { class: 'tile', onclick: () => { chosen.splice(chosen.indexOf(c), 1); c.el.remove(); b.classList.remove('used'); check.disabled = !chosen.length; } }, romEl(LEXMAP[t].rom)) };
      chosen.push(c); slots.append(c.el); check.disabled = false;
      if (!dictate) sayWord(t);
    } }, romEl(LEXMAP[t].rom));
    bank.append(b);
  });
  if (dictate) { root.append(title('Listen', 'Build what you hear'), playBtns(it)); say(it); }
  else root.append(title(step.fresh ? 'New combination' : 'Build it', 'Say this in Thai'), h('div', { class: 'prompt' }, it.em ? h('span', { class: 'em' }, it.em) : null, h('span', {}, it.en)));
  root.append(slots, bank);
  setFoot(check);
}

/* ---------- hands-free player ---------- */
function startPlayer(items) {
  const list = shuffle(items); let i = 0, playing = true, wake = null;
  const en = h('div', { class: 'en' }), rom = h('div', {}), phase = h('div', { class: 'phase' }), count = h('p', { class: 'center' });
  const pb = h('button', { class: 'pbtn', 'aria-label': 'Play or pause', onclick: () => { playing = !playing; pb.replaceChildren(icon(playing ? 'pause' : 'play')); if (playing) run(); else TTS.stop(); } }, icon('pause'));
  const skip = h('button', { class: 'pbtn sm', 'aria-label': 'Skip', onclick: () => { i++; if (playing) run(); else show(); } }, icon('next'));
  player = { id: 0 };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const show = () => { const it = list[i % list.length]; en.textContent = it.en; rom.replaceChildren(); phase.textContent = 'Paused'; count.textContent = `${i % list.length + 1} of ${list.length}`; };
  async function run() {
    const id = ++player.id, live = () => player && player.id === id && playing;
    TTS.stop();
    while (live()) {
      const it = list[i % list.length];
      en.textContent = it.en; rom.replaceChildren(); count.textContent = `${i % list.length + 1} of ${list.length}`;
      phase.textContent = 'How do you say…'; await TTS.speak(it.en, { lang: 'en-US' }); if (!live()) return;
      phase.textContent = 'Your turn. Say it out loud'; await wait(1800 + toks(it).length * 700); if (!live()) return;
      phase.textContent = 'Listen'; rom.replaceChildren(romEl(romOf(it))); await say(it); if (!live()) return;
      await wait(900); if (!live()) return;
      phase.textContent = 'Repeat after me'; await say(it, true); if (!live()) return;
      await wait(1400 + toks(it).length * 500); if (!live()) return;
      i++;
    }
  }
  const close = () => { player = null; TTS.stop(); try { wake && wake.release(); } catch (e) {} home(); };
  mount(h('div', { class: 'sess-top' }, h('button', { class: 'iconbtn', 'aria-label': 'Close', onclick: close }, icon('x')), h('div', { class: 'eyebrow' }, 'Listen and repeat')),
    h('div', { class: 'stage' }, h('div', { class: 'player' }, phase, en, rom, h('div', { class: 'play' }, pb, skip), count)),
    h('div', { class: 'foot' }, h('p', { class: 'center' }, 'Keep the screen on. Answer in the pause before you hear the Thai.')));
  try { navigator.wakeLock && navigator.wakeLock.request('screen').then(w => { wake = w; }).catch(() => {}); } catch (e) {}
  run();
}

/* ---------- boot ---------- */
function start() { if (!S.onboarded || !S.gender) onboard(); else home(); }
start();
})();
