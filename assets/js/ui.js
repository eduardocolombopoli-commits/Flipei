/* =========================================================================
   FLIPEI — UI engine: router, event delegation, toasts, FX, charts
   ========================================================================= */

const App = {
  root: null,
  route: 'splash',
  params: {},
  role: 'aluno',          // 'aluno' | 'escola'
  device: 'mobile',       // 'mobile' | 'desktop'  (apenas aluno)
  _wired: false,
  s: {
    streak: STUDENT.streak,
    xp: STUDENT.xp,
    xpToday: 0,
    gems: STUDENT.gems,
    goal: STUDENT.goal,
    exam: 'enem',
    selectedSubjects: ['bio','mat','qui'],
    linkedSchool: null,          // escola vinculada pelo aluno
    // decks / personalização nova
    dailyGoalCards: 100,         // meta diária em cards
    cardsToday: 0,
    studySource: null,           // { mode:'daily'|'deck'|'exam', label, deckId? }
    examReviewSel: 'enem',       // prova selecionada na revisão rápida (Perfil)
    // recompensas / prêmios
    owned: { avatar:['coruja'], frame:['none'], color:['#7C3AED'], theme:['default'], title:['none','maratona'] },
    equipped: { avatar:'coruja', frame:'none', color:'#7C3AED', theme:'default', title:'maratona' },
    inventory: { freeze:1, turbo:0, dica:2 },
    shopTab: 'avatar',           // 'avatar' | 'loja' | 'colecao'
    // game
    deck: [],
    deckIndex: 0,
    revealed: false,
    combo: 0,
    sessionCorrect: 0,
    sessionTotal: 0,
    sessionXp: 0,
    // onboarding
    onboardStep: 0,
    onb_goalKind: null,          // 'enem' | 'uni' | 'curso' | 'explorar'
    onb_goalText: '',
    onb_level: null,
    onb_time: null,
    // ui
    rankTab: 'geral',
    schoolPage: 'dashboard',
    schoolPeriod: '30d',
    detailStudent: null,
    // school deck builder
    deckDraft: { title:'', subj:'bio', cards:[] },
  },
};

// ---- tiny DOM helpers ----
function el(html){ const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function $(sel, ctx){ return (ctx||document).querySelector(sel); }
function $$(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

// ---- sistema de ícones (linha, currentColor) ----
const ICONS = {
  home:'M3 10.5 12 3l9 7.5M5 9.5V20h5v-6h4v6h5V9.5',
  layers:'M12 3 21 8l-9 5-9-5 9-5ZM3 13l9 5 9-5',
  map:'M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2ZM9 4v14M15 6v14',
  trophy:'M7 4h10v3a5 5 0 0 1-10 0V4ZM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 19h6M12 12v3',
  gift:'M20 12v8H4v-8M2 8h20v4H2zM12 8v12M12 8S10.5 4 8.5 4.5 9 8 12 8ZM12 8s1.5-4 3.5-3.5S15 8 12 8Z',
  chart:'M4 20V11M10 20V4M16 20v-6M4 20h16',
  play:'M7 5l12 7-12 7z',
  search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-3.6-3.6',
  plus:'M12 5v14M5 12h14',
  chevron:'M9 6l6 6-6 6',
  sliders:'M4 21v-6M4 11V3M12 21v-9M12 7V3M20 21v-5M20 13V3M1 15h6M9 9h6M17 17h6',
  lock:'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  check:'M5 12l5 5L20 7',
  x:'M6 6l12 12M18 6 6 18',
  bell:'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M10.5 21a2 2 0 0 0 3 0',
  grid:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  trending:'M3 17l6-6 4 4 8-8M16 7h5v5',
  target:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 12h.01',
  users:'M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6',
  cap:'M22 10 12 5 2 10l10 5 10-5ZM6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5',
  puzzle:'M10 4a2 2 0 0 1 4 0v1h4v4a2 2 0 0 0 0 4v4h-4a2 2 0 0 1-4 0H6v-4a2 2 0 0 0 0-4V5h4z',
  clipboard:'M9 4h6v3H9zM7 5H5v15h14V5h-2M8 12h8M8 16h6',
  bulb:'M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.2 1 2.1h5c.1-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z',
};
function icon(name, size){
  const p = ICONS[name]; if(!p) return '';
  const s = size||24;
  return `<svg class="ic-svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p.split('M').filter(Boolean).map(d=>`<path d="M${d}"/>`).join('')}</svg>`;
}

// ---- navigation ----
function go(route, params){ App.route = route; App.params = params || {}; render(); }
function setRole(role){
  App.role = role;
  if(role === 'escola'){ App.s.schoolPage = 'dashboard'; App.s.detailStudent = null; }
  else if(App.route && App.route.indexOf('school')===0){ App.route = 'home'; }
  render();
}
function setDevice(d){ App.device = d; render(); }

// ---- master render ----
function render(){
  App.root = App.root || document.getElementById('app');
  let view = '';
  if(App.role === 'escola'){
    view = SchoolPortal();
  } else if(App.route === 'splash'){
    view = DeviceWrap(Splash(), { bare:true });
  } else if(App.route === 'onboarding'){
    view = DeviceWrap(Onboarding(), { bare:true });
  } else {
    const tab = ['home','decks','jornada','ranking','premios','profile'].includes(App.route) ? App.route : null;
    const inner = ScreenFor(App.route);
    view = DeviceWrap(inner, { tab });
  }
  App.root.innerHTML = view;
  applyTheme();
  renderControls();
  wireOnce();
  runPostRender();
}

function ScreenFor(route){
  switch(route){
    case 'home':         return Home();
    case 'decks':        return Decks();
    case 'jornada':      return Jornada();
    case 'game':         return Game();
    case 'complete':     return Complete();
    case 'ranking':      return Ranking();
    case 'premios':      return Premios();
    case 'profile':      return Profile();
    case 'linkSchool':   return LinkSchool();
    default:             return Home();
  }
}

// post-render side effects (charts already animate via SVG; confetti etc.)
function runPostRender(){
  if(App.role==='aluno' && App.route==='complete'){
    confetti({count:160, y: innerHeight*0.30});
    const xpNode = $('#c-xp'); if(xpNode) countUp(xpNode, App.s.sessionXp, 1000);
    App.s.deck = [];
  }
}

// =========================================================================
// Device wrappers — celular (moldura) ou computador (layout web)
// =========================================================================
function DeviceWrap(inner, opts){
  opts = opts || {};
  if(App.device === 'desktop') return DesktopShell(inner, opts);
  return PhoneShell(inner, opts);
}

const NAV = [
  { id:'home', ic:'home', label:'Início' },
  { id:'decks', ic:'layers', label:'Decks' },
  { id:'jornada', ic:'map', label:'Jornada' },
  { id:'ranking', ic:'trophy', label:'Ranking' },
  { id:'premios', ic:'gift', label:'Prêmios' },
  { id:'profile', ic:'chart', label:'Perfil' },
];

function PhoneShell(inner, opts){
  const tabbar = opts.tab ? `
    <div class="tabbar">
      ${NAV.map(t=>`<button class="tab ${t.id===opts.tab?'active':''}" data-act="go" data-route="${t.id}">
        <span class="ic">${icon(t.ic,24)}</span><span>${t.label}</span></button>`).join('')}
    </div>` : '';
  return `
  <div class="stage">
    <div class="phone">
      <div class="phone-notch"></div>
      <div class="screen">
        <div class="screen-body scroll fade-in">${inner}</div>
        ${tabbar}
      </div>
    </div>
  </div>`;
}

function DesktopShell(inner, opts){
  // splash/onboarding: centralizado sem sidebar
  if(opts.bare){
    return `<div class="stage"><div class="webcard fade-in">${inner}</div></div>`;
  }
  const nav = `${NAV.map(t=>`<button class="webnav ${t.id===opts.tab?'on':''}" data-act="go" data-route="${t.id}">
      <span class="ic">${icon(t.ic,22)}</span><span>${t.label}</span></button>`).join('')}`;
  return `
  <div class="webwrap">
    <aside class="webside">
      <div style="padding:6px 10px 14px">${Logo(26)}</div>
      <nav class="webnavlist">${nav}</nav>
      <button class="btn btn-roxo btn-block mt12" data-act="start-daily" style="margin:0 8px">▶ Estudar</button>
      <div class="webuser">
        <div class="avatar" style="width:38px;height:38px;font-size:15px;background:var(--roxo-600)">${STUDENT.name[0]}</div>
        <div class="col"><span class="b9 small">${esc(STUDENT.name)}</span><span class="tiny faint">🔥 ${App.s.streak} · ${App.s.xp.toLocaleString('pt-BR')} XP</span></div>
      </div>
    </aside>
    <main class="webmain scroll">
      <div class="webcol fade-in">${inner}</div>
    </main>
  </div>`;
}

// =========================================================================
// Floating controls: alternar Aluno/Escola e Celular/Computador
// =========================================================================
function renderControls(){
  let rs = document.getElementById('view-controls');
  if(!rs){ rs = el(`<div class="view-controls" id="view-controls"></div>`); document.body.appendChild(rs); }
  const deviceCtrl = App.role==='aluno' ? `
    <div class="vc-group">
      <span class="vc-lbl">Ver em</span>
      <button class="${App.device==='mobile'?'on':''}" data-act="device" data-d="mobile">📱 Celular</button>
      <button class="${App.device==='desktop'?'on':''}" data-act="device" data-d="desktop">🖥️ Computador</button>
    </div>` : '';
  rs.innerHTML = `
    <div class="vc-group">
      <span class="vc-lbl">Modo</span>
      <button class="${App.role==='aluno'?'on':''}" data-act="role" data-r="aluno">👤 Aluno</button>
      <button class="${App.role==='escola'?'on':''}" data-act="role" data-r="escola">🏫 Escola</button>
    </div>
    ${deviceCtrl}`;
}

// =========================================================================
// EVENT DELEGATION — uma única escuta global (robusto, sem rebind)
// =========================================================================
function wireOnce(){
  if(App._wired) return;
  App._wired = true;

  document.addEventListener('click', (e)=>{
    const t = e.target.closest('[data-act]');
    if(!t) return;
    handleAct(t.dataset.act, t, e);
  });
  // live model binding p/ inputs de texto (sem re-render, preserva foco)
  document.addEventListener('input', (e)=>{
    const t = e.target.closest('[data-model]');
    if(t){ App.s[t.dataset.model] = t.value; refreshOnbButton(); }
  });
  window.addEventListener('resize', ()=>{ const c=document.getElementById('fx-canvas'); if(c){c.width=innerWidth;c.height=innerHeight;} });
}

function refreshOnbButton(){
  if(App.route!=='onboarding') return;
  const btn = $('#onb-next'); if(!btn) return;
  btn.disabled = !onbCanContinue();
}

function handleAct(act, t, e){
  const d = t.dataset;
  switch(act){
    // global
    case 'go':        go(d.route); break;
    case 'role':      setRole(d.r); break;
    case 'device':    setDevice(d.d); break;

    // onboarding
    case 'onb-pick':  App.s.onb_goalKind = d.val; render(); break;
    case 'onb-suggest': App.s.onb_goalText = d.val; render(); break;
    case 'onb-level': App.s.onb_level = d.val; render(); break;
    case 'onb-time':  App.s.onb_time = d.val; render(); break;
    case 'onb-back':  if(App.s.onboardStep===0){ go('splash'); } else { App.s.onboardStep--; render(); } break;
    case 'onb-next':  onbNext(); break;

    // game
    case 'reveal':    App.s.revealed = true; render(); break;
    case 'rate':      gameAnswer(parseInt(d.rate,10), t); break;
    case 'quit':      if(confirm('Sair da sessão? O progresso desta sessão será perdido.')){ App.s.deck=[]; App.s.revealed=false; go('home'); } break;

    // ranking
    case 'rank-tab':  App.s.rankTab = d.tab; render(); break;

    // decks / personalização
    case 'unlock-deck': unlockDeck(d.deck); break;
    case 'study-deck':  startStudy('deck', d.deck); break;
    case 'start-daily': startStudy('daily'); break;
    case 'set-goal':    App.s.dailyGoalCards = parseInt(d.goal,10); toast('Meta diária: '+d.goal+' cards','success','🎯'); render(); break;

    // revisão por prova (Perfil)
    case 'exam-pick':   App.s.examReviewSel = d.exam; render(); break;
    case 'start-exam':  startStudy('exam', App.s.examReviewSel); break;

    // prêmios / recompensas
    case 'shop-tab':    App.s.shopTab = d.tab; render(); break;
    case 'buy-item':    buyItem(d.type, d.id); break;
    case 'equip-item':  equipItem(d.type, d.id); break;

    // vincular escola
    case 'link-open':  go('linkSchool'); break;
    case 'link-submit': submitLink(); break;
    case 'link-cancel': go('profile'); break;
    case 'unlink':     if(confirm('Desvincular da escola? Ela deixará de ver seu progresso.')){ App.s.linkedSchool=null; toast('Escola desvinculada','brand','🔌'); go('profile'); } break;

    // school portal
    case 'school-page': App.s.schoolPage=d.page; App.s.detailStudent=null; render(); break;
    case 'school-period': App.s.schoolPeriod=d.period; render(); break;
    case 'open-student': App.s.detailStudent=d.student; App.s.schoolPage='alunos'; render(); break;
    case 'back-students': App.s.detailStudent=null; render(); break;
    case 'deck-add-card': schoolAddCard(); break;
    case 'deck-publish': schoolPublishDeck(); break;
  }
}

// =========================================================================
// Toasts + FX
// =========================================================================
function toast(msg, type, icon){
  const layer = document.getElementById('toast-layer');
  const t = el(`<div class="toast ${type||''}">${icon?`<span>${icon}</span>`:''}<span>${msg}</span></div>`);
  layer.appendChild(t);
  setTimeout(()=>{ t.style.transition='.3s'; t.style.opacity='0'; t.style.transform='translateY(-10px)'; setTimeout(()=>t.remove(),300); }, 1900);
}

function confetti(opts){
  const c = document.getElementById('fx-canvas'); if(!c) return;
  const ctx = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const colors = ['#7C3AED','#DB2777','#22C55E','#FB923C','#FACC15','#3B82F6'];
  const N = (opts&&opts.count)||140, parts=[];
  const cx=(opts&&opts.x)||innerWidth/2, cy=(opts&&opts.y)||innerHeight/2;
  for(let i=0;i<N;i++) parts.push({ x:cx,y:cy, vx:(Math.random()-.5)*14, vy:(Math.random()*-15)-4, g:.4+Math.random()*.3, r:5+Math.random()*7, rot:Math.random()*6, vr:(Math.random()-.5)*.4, c:colors[(Math.random()*colors.length)|0], life:0, max:80+Math.random()*40, shape:Math.random()>.5?'rect':'circ' });
  let frame=0;
  (function step(){
    ctx.clearRect(0,0,c.width,c.height); let alive=false;
    parts.forEach(p=>{ if(p.life>p.max) return; alive=true; p.life++; p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.globalAlpha=Math.max(0,1-p.life/p.max); ctx.fillStyle=p.c;
      if(p.shape==='rect') ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.4); else { ctx.beginPath(); ctx.arc(0,0,p.r/1.6,0,7); ctx.fill(); }
      ctx.restore(); });
    frame++; if(alive&&frame<160) requestAnimationFrame(step); else ctx.clearRect(0,0,c.width,c.height);
  })();
}

function floatXp(amount, target){
  if(!target||!target.getBoundingClientRect) return;
  const r = target.getBoundingClientRect();
  const f = el(`<div class="xp-float">+${amount} XP</div>`);
  f.style.cssText = `left:${r.left+r.width/2-20}px;top:${r.top+10}px;position:fixed;z-index:9200;`;
  document.body.appendChild(f); setTimeout(()=>f.remove(),1000);
}

// =========================================================================
// SVG charts
// =========================================================================
function barChart(data, opts){
  opts=opts||{}; const W=opts.w||520,H=opts.h||180,pad=24;
  const max=Math.max.apply(null,data.map(d=>d.v))*1.15||1, bw=(W-pad*2)/data.length;
  const bars=data.map((d,i)=>{ const h=(d.v/max)*(H-pad-24), x=pad+i*bw+bw*0.18, w=bw*0.64, y=H-24-h, color=d.color||'#7C3AED';
    return `<rect x="${x}" y="${H-24}" width="${w}" height="0" rx="6" fill="${color}">
      <animate attributeName="height" from="0" to="${h}" dur="0.7s" fill="freeze" begin="${i*0.05}s" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1"/>
      <animate attributeName="y" from="${H-24}" to="${y}" dur="0.7s" fill="freeze" begin="${i*0.05}s" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1"/></rect>
      ${opts.values?`<text x="${x+w/2}" y="${y-6}" text-anchor="middle" font-size="11" font-weight="800" fill="#5B5470">${d.v}</text>`:''}
      <text x="${x+w/2}" y="${H-8}" text-anchor="middle" font-size="11" font-weight="700" fill="#9690A8">${d.l}</text>`; }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${bars}</svg>`;
}
function hBars(data, opts){
  opts=opts||{}; const W=opts.w||520,rowH=34,pad=8,H=data.length*rowH+pad*2,labelW=opts.labelW||96,max=100;
  const rows=data.map((d,i)=>{ const y=pad+i*rowH,full=W-labelW-50,w=(d.v/max)*full,color=d.color||'#7C3AED';
    return `<text x="0" y="${y+rowH/2+4}" font-size="12.5" font-weight="800" fill="#1F1235">${d.l}</text>
      <rect x="${labelW}" y="${y+8}" width="${full}" height="${rowH-16}" rx="9" fill="#EEEBF5"/>
      <rect x="${labelW}" y="${y+8}" width="0" height="${rowH-16}" rx="9" fill="${color}">
        <animate attributeName="width" from="0" to="${w}" dur="0.8s" fill="freeze" begin="${i*0.06}s" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1"/></rect>
      <text x="${W-2}" y="${y+rowH/2+4}" text-anchor="end" font-size="12.5" font-weight="900" fill="${color}">${d.v}%</text>`; }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${rows}</svg>`;
}
function lineChart(values, opts){
  opts=opts||{}; const W=opts.w||520,H=opts.h||180,pad=18,padB=22;
  const max=Math.max.apply(null,values)*1.2||1, stepX=(W-pad*2)/(values.length-1);
  const pts=values.map((v,i)=>[pad+i*stepX, H-padB-(v/max)*(H-pad-padB)]);
  const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=line+` L ${pts[pts.length-1][0]} ${H-padB} L ${pts[0][0]} ${H-padB} Z`;
  const dots=pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#7C3AED" stroke="#fff" stroke-width="2"/>`).join('');
  const color=opts.color||'#7C3AED';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${opts.cssH||180}px">
    <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="0.28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    <path d="${area}" fill="url(#lg)"/>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1400" stroke-dashoffset="1400"><animate attributeName="stroke-dashoffset" to="0" dur="1s" fill="freeze"/></path>
    ${dots}</svg>`;
}
function ring(pct, opts){
  opts=opts||{}; const size=opts.size||120,sw=opts.stroke||14,r=(size-sw)/2,c=2*Math.PI*r,color=opts.color||'#7C3AED';
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#EEEBF5" stroke-width="${sw}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}" transform="rotate(-90 ${size/2} ${size/2})">
      <animate attributeName="stroke-dashoffset" from="${c}" to="${c*(1-pct/100)}" dur="1s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1"/></circle>
    <text x="50%" y="50%" text-anchor="middle" dy="0.1em" font-family="'Baloo 2'" font-weight="800" font-size="${size*0.26}" fill="${color}">${opts.label!==undefined?opts.label:pct+'%'}</text>
    ${opts.sub?`<text x="50%" y="50%" dy="${size*0.22}" text-anchor="middle" font-size="11" font-weight="800" fill="#9690A8">${opts.sub}</text>`:''}</svg>`;
}
function countUp(node, to, dur){
  dur=dur||900; const start=performance.now();
  (function tick(now){ const t=Math.min(1,(now-start)/dur), e=1-Math.pow(1-t,3); node.textContent=Math.round(to*e).toLocaleString('pt-BR'); if(t<1) requestAnimationFrame(tick); })(performance.now());
}

// sparkline minimalista (para KPIs do portal)
function sparkline(values, color){
  const W=130,H=36,max=Math.max.apply(null,values),min=Math.min.apply(null,values),rng=(max-min)||1,sx=W/(values.length-1);
  const pts=values.map((v,i)=>[i*sx, H-4-((v-min)/rng)*(H-9)]);
  const d=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=d+` L ${W} ${H} L 0 ${H} Z`;
  color=color||'#7C3AED';
  return `<svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <defs><linearGradient id="sp${Math.random().toString(36).slice(2,7)}" x1="0" y1="0" x2="0" y2="1"></linearGradient></defs>
    <path d="${area}" fill="${color}" opacity="0.08"/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

// aplica o tema cosmético equipado (muda o acento da interface)
function applyTheme(){
  if(!document.body) return;
  const t = (App.role==='aluno' && App.s.equipped) ? App.s.equipped.theme : 'default';
  document.body.setAttribute('data-theme', t || 'default');
}
