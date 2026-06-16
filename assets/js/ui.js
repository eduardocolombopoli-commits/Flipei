/* =========================================================================
   FLIPEI — UI helpers: render engine, toasts, FX, charts
   ========================================================================= */

const App = {
  root: null,
  route: 'splash',
  params: {},
  role: 'aluno',          // 'aluno' | 'escola'
  // mutable session state
  s: {
    streak: STUDENT.streak,
    xp: STUDENT.xp,
    xpToday: 0,
    gems: STUDENT.gems,
    lives: STUDENT.lives,
    goal: STUDENT.goal,
    exam: 'enem',
    selectedSubjects: ['bio','mat','qui'],
    // game
    deck: [],
    deckIndex: 0,
    combo: 0,
    sessionCorrect: 0,
    sessionTotal: 0,
    sessionXp: 0,
    onboardStep: 0,
    onboardGoal: null,
    rankTab: 'geral',
    schoolPage: 'dashboard',
    detailStudent: null,
  },
};

// ---- tiny DOM helper ----
function el(html){ const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function $(sel, ctx){ return (ctx||document).querySelector(sel); }
function $$(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }

// ---- navigation ----
function go(route, params){
  App.route = route;
  App.params = params || {};
  render();
}
function setRole(role){
  App.role = role;
  if(role === 'escola'){ App.route = 'school'; App.s.schoolPage = 'dashboard'; }
  else { App.route = (App.route && App.route.indexOf('school')===0) ? 'home' : App.route; if(App.route==='school') App.route='home'; }
  render();
}

// ---- master render ----
function render(){
  App.root = App.root || document.getElementById('app');
  let view = '';
  if(App.role === 'escola'){
    view = SchoolPortal();
  } else {
    switch(App.route){
      case 'splash':       view = Splash(); break;
      case 'onboarding':   view = Onboarding(); break;
      case 'home':         view = PhoneShell(Home(), 'home'); break;
      case 'game':         view = PhoneShell(Game(), null); break;
      case 'complete':     view = PhoneShell(Complete(), null); break;
      case 'ranking':      view = PhoneShell(Ranking(), 'ranking'); break;
      case 'personalize':  view = PhoneShell(Personalize(), 'personalize'); break;
      case 'profile':      view = PhoneShell(Profile(), 'profile'); break;
      default:             view = Splash();
    }
  }
  App.root.innerHTML = view;
  bindAfterRender();
  renderRoleSwitch();
}

function renderRoleSwitch(){
  let rs = document.getElementById('role-switch');
  if(!rs){
    rs = el(`<div class="role-switch" id="role-switch">
      <button data-role="aluno">👤 Aluno</button>
      <button data-role="escola">🏫 Escola</button>
    </div>`);
    document.body.appendChild(rs);
    rs.addEventListener('click', e=>{ const b=e.target.closest('button'); if(b) setRole(b.dataset.role); });
  }
  $$('#role-switch button').forEach(b=> b.classList.toggle('on', b.dataset.role===App.role));
  // hide switch on the very first splash to keep it clean? keep visible for demo.
}

// Hook up generic [data-go] navigation + screen-specific binds
function bindAfterRender(){
  $$('[data-go]').forEach(node=>{
    node.addEventListener('click', ()=> go(node.dataset.go, node.dataset.param ? JSON.parse(node.dataset.param) : {}));
  });
  if(typeof bindHome==='function' && App.route==='home') bindHome();
  if(typeof bindGame==='function' && App.route==='game') bindGame();
  if(typeof bindOnboarding==='function' && App.route==='onboarding') bindOnboarding();
  if(typeof bindRanking==='function' && App.route==='ranking') bindRanking();
  if(typeof bindPersonalize==='function' && App.route==='personalize') bindPersonalize();
  if(typeof bindComplete==='function' && App.route==='complete') bindComplete();
  if(App.role==='escola' && typeof bindSchool==='function') bindSchool();
}

// =========================================================================
// Phone shell with tab bar
// =========================================================================
function PhoneShell(inner, activeTab){
  const tabs = [
    { id:'home', route:'home', ic:'🏠', label:'Início' },
    { id:'ranking', route:'ranking', ic:'🏆', label:'Ranking' },
    { id:'personalize', route:'personalize', ic:'🎯', label:'Personalizar' },
    { id:'profile', route:'profile', ic:'📊', label:'Perfil' },
  ];
  const tabbar = activeTab ? `
    <div class="tabbar">
      ${tabs.map(t=>`
        <div class="tab ${t.id===activeTab?'active':''}" data-go="${t.route}">
          <div class="ic">${t.ic}</div><div>${t.label}</div>
        </div>`).join('')}
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

// =========================================================================
// Toasts + FX
// =========================================================================
function toast(msg, type, icon){
  const layer = document.getElementById('toast-layer');
  const t = el(`<div class="toast ${type||''}">${icon?`<span>${icon}</span>`:''}<span>${msg}</span></div>`);
  layer.appendChild(t);
  setTimeout(()=>{ t.style.transition='.3s'; t.style.opacity='0'; t.style.transform='translateY(-10px)'; setTimeout(()=>t.remove(),300); }, 1900);
}

// Confetti burst
function confetti(opts){
  const c = document.getElementById('fx-canvas');
  const ctx = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const colors = ['#7C3AED','#22C55E','#FB923C','#FACC15','#EC4899','#3B82F6'];
  const N = (opts&&opts.count)||140;
  const parts = [];
  const cx = (opts&&opts.x) || innerWidth/2;
  const cy = (opts&&opts.y) || innerHeight/2;
  for(let i=0;i<N;i++){
    parts.push({
      x:cx, y:cy,
      vx:(Math.random()-.5)*14, vy:(Math.random()*-15)-4,
      g:0.4+Math.random()*0.3, r:5+Math.random()*7,
      rot:Math.random()*6, vr:(Math.random()-.5)*.4,
      c:colors[(Math.random()*colors.length)|0], life:0, max:80+Math.random()*40,
      shape: Math.random()>.5?'rect':'circ',
    });
  }
  let frame=0;
  function step(){
    ctx.clearRect(0,0,c.width,c.height);
    let alive=false;
    parts.forEach(p=>{
      if(p.life>p.max) return;
      alive=true; p.life++;
      p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1-(p.life/p.max));
      ctx.fillStyle=p.c;
      if(p.shape==='rect') ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.4);
      else { ctx.beginPath(); ctx.arc(0,0,p.r/1.6,0,7); ctx.fill(); }
      ctx.restore();
    });
    frame++;
    if(alive && frame<160) requestAnimationFrame(step);
    else ctx.clearRect(0,0,c.width,c.height);
  }
  step();
}

// floating +XP near an element
function floatXp(amount, target){
  const r = target.getBoundingClientRect();
  const f = el(`<div class="xp-float">+${amount} XP</div>`);
  f.style.left = (r.left + r.width/2 - 20)+'px';
  f.style.top = (r.top + 20)+'px';
  f.style.position='fixed'; f.style.zIndex=9200;
  document.body.appendChild(f);
  setTimeout(()=>f.remove(), 1000);
}

// =========================================================================
// SVG chart helpers
// =========================================================================

// Animated bar chart (vertical)
function barChart(data, opts){
  opts = opts || {};
  const W = opts.w||520, H = opts.h||180, pad=24;
  const max = Math.max.apply(null, data.map(d=>d.v)) * 1.15 || 1;
  const bw = (W - pad*2) / data.length;
  const bars = data.map((d,i)=>{
    const h = (d.v/max)*(H-pad-24);
    const x = pad + i*bw + bw*0.18;
    const w = bw*0.64;
    const y = H-24-h;
    const color = d.color || '#7C3AED';
    return `
      <rect x="${x}" y="${H-24}" width="${w}" height="0" rx="6" fill="${color}">
        <animate attributeName="height" from="0" to="${h}" dur="0.7s" fill="freeze" begin="${i*0.05}s" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1"/>
        <animate attributeName="y" from="${H-24}" to="${y}" dur="0.7s" fill="freeze" begin="${i*0.05}s" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1"/>
      </rect>
      ${opts.values?`<text x="${x+w/2}" y="${y-6}" text-anchor="middle" font-size="11" font-weight="800" fill="#5B5470">${d.v}</text>`:''}
      <text x="${x+w/2}" y="${H-8}" text-anchor="middle" font-size="11" font-weight="700" fill="#9690A8">${d.l}</text>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${bars}</svg>`;
}

// Horizontal bars (for accuracy by subject)
function hBars(data, opts){
  opts = opts || {};
  const W = opts.w||520, rowH=34, pad=8;
  const H = data.length*rowH + pad*2;
  const labelW = opts.labelW||96;
  const max = 100;
  const rows = data.map((d,i)=>{
    const y = pad + i*rowH;
    const full = W - labelW - 50;
    const w = (d.v/max)*full;
    const color = d.color||'#7C3AED';
    return `
      <text x="0" y="${y+rowH/2+4}" font-size="12.5" font-weight="800" fill="#1F1235">${d.l}</text>
      <rect x="${labelW}" y="${y+8}" width="${full}" height="${rowH-16}" rx="9" fill="#EEEBF5"/>
      <rect x="${labelW}" y="${y+8}" width="0" height="${rowH-16}" rx="9" fill="${color}">
        <animate attributeName="width" from="0" to="${w}" dur="0.8s" fill="freeze" begin="${i*0.06}s" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1"/>
      </rect>
      <text x="${W-2}" y="${y+rowH/2+4}" text-anchor="end" font-size="12.5" font-weight="900" fill="${color}">${d.v}%</text>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${rows}</svg>`;
}

// Line/area chart
function lineChart(values, opts){
  opts = opts || {};
  const W = opts.w||520, H = opts.h||180, pad=18, padB=22;
  const max = Math.max.apply(null, values)*1.2 || 1;
  const stepX = (W-pad*2)/(values.length-1);
  const pts = values.map((v,i)=>[pad+i*stepX, H-padB-(v/max)*(H-pad-padB)]);
  const line = pts.map((p,i)=> (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area = line + ` L ${pts[pts.length-1][0]} ${H-padB} L ${pts[0][0]} ${H-padB} Z`;
  const dots = pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#7C3AED" stroke="#fff" stroke-width="2"/>`).join('');
  const color = opts.color||'#7C3AED';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${opts.cssH||180}px">
    <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${color}" stop-opacity="0.28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="${area}" fill="url(#lg)"/>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"
      stroke-dasharray="1400" stroke-dashoffset="1400"><animate attributeName="stroke-dashoffset" to="0" dur="1s" fill="freeze"/></path>
    ${dots}
  </svg>`;
}

// Donut / progress ring
function ring(pct, opts){
  opts = opts || {};
  const size = opts.size||120, sw=opts.stroke||14, r=(size-sw)/2, c=2*Math.PI*r;
  const color = opts.color||'#7C3AED';
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#EEEBF5" stroke-width="${sw}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${c}" transform="rotate(-90 ${size/2} ${size/2})">
      <animate attributeName="stroke-dashoffset" from="${c}" to="${c*(1-pct/100)}" dur="1s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1"/>
    </circle>
    <text x="50%" y="50%" text-anchor="middle" dy="0.1em" font-family="'Baloo 2'" font-weight="800" font-size="${size*0.26}" fill="${color}">${opts.label!==undefined?opts.label:pct+'%'}</text>
    ${opts.sub?`<text x="50%" y="50%" dy="${size*0.22}" text-anchor="middle" font-size="11" font-weight="800" fill="#9690A8">${opts.sub}</text>`:''}
  </svg>`;
}

// Count-up animation on a number element
function countUp(node, to, dur){
  dur = dur||900; const start=performance.now(); const from=0;
  function tick(now){
    const t = Math.min(1,(now-start)/dur);
    const e = 1-Math.pow(1-t,3);
    node.textContent = Math.round(from+(to-from)*e).toLocaleString('pt-BR');
    if(t<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
