/* =========================================================================
   FLIPEI — Telas do ALUNO
   ========================================================================= */

// ---------- Logo (wordmark gradiente, minúsculo — vibe do Instagram) ----------
function Logo(size){
  size = size || 28;
  return `<span class="logo-word" style="font-size:${size}px">flipei</span>`;
}
function LogoBig(size){
  size = size || 64;
  return `<div class="logo-hero">
    <span class="logo-word" style="font-size:${size}px">flipei</span>
  </div>`;
}

// =========================================================================
// SPLASH
// =========================================================================
function Splash(){
  return `
  <div class="onb">
    <div class="hero splash-hero">
      <div class="blob" style="width:200px;height:200px;background:var(--roxo-300);top:2%;left:-40px;"></div>
      <div class="blob" style="width:150px;height:150px;background:#F9A8D4;bottom:20%;right:-30px;"></div>
      <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:14px;">
        <div class="flip-illo">
          <div class="fi-card fi-back"></div>
          <div class="fi-card fi-front"><span>?</span></div>
        </div>
        ${LogoBig(58)}
        <div class="h2" style="margin-top:6px">Vira o card. Vira o jogo.</div>
        <p class="muted" style="max-width:300px;font-weight:700;">O app de flashcards pra quem vai passar no ENEM e no vestibular. Estudar com gamificação, IA e foco no que importa.</p>
      </div>
      <div style="display:flex;gap:22px;margin-top:8px;position:relative;z-index:2;">
        <div class="tcenter"><div class="h2">🔥</div><div class="tiny b muted">Streaks</div></div>
        <div class="tcenter"><div class="h2">🏆</div><div class="tiny b muted">Ligas</div></div>
        <div class="tcenter"><div class="h2">🎯</div><div class="tiny b muted">No seu foco</div></div>
      </div>
    </div>
    <div class="section">
      <button class="btn btn-roxo btn-block btn-lg" data-act="go" data-route="onboarding">Começar agora</button>
      <button class="btn btn-ghost btn-block mt8">Já tenho conta</button>
      <p class="tiny faint tcenter mt12">Grátis pra todo aluno • Em breve na App Store, Google Play e Windows</p>
    </div>
  </div>`;
}

// =========================================================================
// ONBOARDING — objetivo flexível (sem pressupor curso/universidade)
// =========================================================================
const GOAL_KINDS = [
  { id:'enem',     emoji:'📝', t:'Passar no ENEM', d:'Foco no Exame Nacional' },
  { id:'uni',      emoji:'🏛️', t:'Uma universidade específica', d:'Ex.: USP, UFRGS, UERJ...' },
  { id:'curso',    emoji:'🎓', t:'Entrar em um curso', d:'Ex.: Medicina, Direito, Engenharia...' },
  { id:'explorar', emoji:'🧭', t:'Ainda estou decidindo', d:'Quero explorar e criar o hábito' },
];
const UNI_SUGGEST = ['USP / FUVEST','UNICAMP','UFRGS','UERJ','UFMG','UFPR','UnB','Outra'];
const CURSO_SUGGEST = ['Medicina','Direito','Engenharia','Psicologia','Administração','Enfermagem','Outro'];
const LEVELS = [
  { id:'1', emoji:'🌱', t:'Começando do zero', d:'Quero criar o hábito' },
  { id:'2', emoji:'📚', t:'Já estudo às vezes', d:'Quero ser consistente' },
  { id:'3', emoji:'⚡', t:'Estudo sério', d:'Reta final, foco total' },
];
const TIMES = [
  { id:'5',  emoji:'☕', t:'5 min / dia',  d:'Casual' },
  { id:'15', emoji:'🎯', t:'15 min / dia', d:'Regular (recomendado)' },
  { id:'30', emoji:'🔥', t:'30 min / dia', d:'Sério' },
  { id:'60', emoji:'🚀', t:'60 min / dia', d:'Intenso' },
];

function onbCanContinue(){
  const s = App.s;
  if(s.onboardStep===0){
    if(!s.onb_goalKind) return false;
    if((s.onb_goalKind==='uni'||s.onb_goalKind==='curso') && !String(s.onb_goalText||'').trim()) return false;
    return true;
  }
  if(s.onboardStep===1) return !!s.onb_level;
  if(s.onboardStep===2) return !!s.onb_time;
  return false;
}
function onbGoalLabel(){
  const s=App.s, k=s.onb_goalKind, txt=String(s.onb_goalText||'').trim();
  if(k==='enem') return 'ENEM 2026';
  if(k==='uni') return txt || 'Universidade';
  if(k==='curso') return txt ? (txt+' 🎯') : 'Curso';
  return 'Explorando';
}
function onbNext(){
  if(!onbCanContinue()){ toast('Escolha uma opção pra continuar 🙂','warn','👆'); return; }
  if(App.s.onboardStep < 2){ App.s.onboardStep++; render(); return; }
  // finalizar
  App.s.goal = onbGoalLabel();
  if(App.s.onb_goalKind==='uni'){ const m=EXAMS.find(e=>String(App.s.onb_goalText).toLowerCase().includes(e.id)||String(App.s.onb_goalText).toUpperCase().includes(e.sigla)); if(m) App.s.exam=m.id; }
  App.s.onboardStep = 0;
  toast('Perfil criado! Bem-vindo à Flipei 🎉','success','✨');
  confetti({count:130, y:innerHeight*0.4});
  go('home');
}

function Onboarding(){
  const s = App.s, step = s.onboardStep;
  let title, sub, body;
  if(step===0){
    title='O que você quer conquistar?'; sub='Sem pressuposições — você escolhe (e pode digitar).';
    const k = s.onb_goalKind;
    let extra='';
    if(k==='uni' || k==='curso'){
      const list = k==='uni'?UNI_SUGGEST:CURSO_SUGGEST;
      const ph = k==='uni'?'Digite a universidade (ex.: UFSC)':'Digite o curso (ex.: Veterinária)';
      extra = `
        <div class="onb-input-wrap slide-in">
          <div class="tiny faint b">${k==='uni'?'Qual universidade?':'Qual curso?'}</div>
          <input class="onb-input" data-model="onb_goalText" value="${esc(s.onb_goalText)}" placeholder="${ph}" />
          <div class="row wrap gap8 mt8">
            ${list.map(x=>`<button class="opt-chip ${s.onb_goalText===x?'on':''}" data-act="onb-suggest" data-val="${esc(x)}">${x}</button>`).join('')}
          </div>
        </div>`;
    }
    body = `
      <div class="col gap10">
        ${GOAL_KINDS.map(o=>`
          <button class="choice ${k===o.id?'sel':''}" data-act="onb-pick" data-val="${o.id}">
            <div class="emoji">${o.emoji}</div>
            <div class="col"><div class="b9" style="font-size:16px">${o.t}</div><div class="small muted">${o.d}</div></div>
            <div class="grow"></div><div style="font-size:20px;color:var(--roxo-500)">${k===o.id?'✓':''}</div>
          </button>`).join('')}
      </div>${extra}`;
  } else if(step===1){
    title='Como está sua rotina hoje?'; sub='Sem julgamentos — só pra começar do jeito certo.';
    body = `<div class="col gap10">${LEVELS.map(o=>`
      <button class="choice ${s.onb_level===o.id?'sel':''}" data-act="onb-level" data-val="${o.id}">
        <div class="emoji">${o.emoji}</div><div class="col"><div class="b9" style="font-size:16px">${o.t}</div><div class="small muted">${o.d}</div></div>
        <div class="grow"></div><div style="font-size:20px;color:var(--roxo-500)">${s.onb_level===o.id?'✓':''}</div></button>`).join('')}</div>`;
  } else {
    title='Sua meta diária'; sub='Estudar pouco e todo dia vale mais que maratonar.';
    body = `<div class="col gap10">${TIMES.map(o=>`
      <button class="choice ${s.onb_time===o.id?'sel':''}" data-act="onb-time" data-val="${o.id}">
        <div class="emoji">${o.emoji}</div><div class="col"><div class="b9" style="font-size:16px">${o.t}</div><div class="small muted">${o.d}</div></div>
        <div class="grow"></div><div style="font-size:20px;color:var(--roxo-500)">${s.onb_time===o.id?'✓':''}</div></button>`).join('')}</div>`;
  }
  return `
  <div class="onb">
    <div class="topbar">
      <button class="icon-btn" data-act="onb-back">←</button>
      <div class="bar roxo thin grow" style="max-width:200px"><span style="width:${(step+1)/3*100}%"></span></div>
      <div style="width:42px"></div>
    </div>
    <div style="padding:8px 22px 0;">
      <div class="eyebrow">Passo ${step+1} de 3</div>
      <div class="h2 mt4">${title}</div>
      <p class="muted b mt4">${sub}</p>
    </div>
    <div class="scroll" style="flex:1;padding:18px 22px;">${body}</div>
    <div class="section">
      <button class="btn btn-roxo btn-block btn-lg" id="onb-next" data-act="onb-next" ${onbCanContinue()?'':'disabled'}>${step<2?'Continuar':'Criar meu perfil'}</button>
    </div>
  </div>`;
}

// =========================================================================
// HOME — trilha + status (sem vidas)
// =========================================================================
function Home(){
  const s = App.s;
  const pct = Math.min(100, Math.round(s.xpToday / STUDENT.dailyGoal * 100));
  return `
  <div>
    <div class="topbar">
      <div>${Logo(24)}</div>
      <div class="row gap8">
        <span class="tag-stat tag-streak">🔥 ${s.streak}</span>
        <span class="tag-stat tag-xp">⚡ ${s.xp.toLocaleString('pt-BR')}</span>
        <span class="tag-stat tag-gem">💎 ${s.gems}</span>
      </div>
    </div>

    <div class="section">
      <div class="card pad">
        <div class="row between">
          <div><div class="eyebrow">Meta de hoje</div><div class="h3">${s.xpToday} / ${STUDENT.dailyGoal} XP</div></div>
          <div class="pill ${pct>=100?'green':''}">${pct>=100?'Concluída! 🎉':pct+'%'}</div>
        </div>
        <div class="bar xp mt12"><span style="width:${pct}%"></span></div>
        <div class="row between mt8">
          <span class="small muted b">Objetivo: <b style="color:var(--roxo-700)">${esc(s.goal)}</b></span>
          <span class="small b" style="color:var(--laranja-600)">🔥 ${s.streak} dias seguidos</span>
        </div>
      </div>
    </div>

    <div class="section">
      <button class="btn btn-roxo btn-block btn-lg" data-act="go" data-route="game">▶  Estudar agora</button>
      <div class="row gap10 mt12">
        <button class="btn btn-outline grow btn-sm" data-act="go" data-route="game">⚡ Revisão rápida</button>
        <button class="btn btn-outline grow btn-sm" data-act="go" data-route="personalize">🎯 Mudar foco</button>
      </div>
    </div>

    <div class="section">
      <div class="unit-banner">
        <div class="col"><span class="tiny b" style="opacity:.85;text-transform:uppercase;letter-spacing:.5px">Sua trilha</span>
          <span class="h3" style="color:#fff">${PATH.unit}</span></div>
        <div style="font-size:34px">🧬</div>
      </div>
      <div class="path">
        ${PATH.nodes.map((n,i)=>{ const off=[0,38,-30,30,-22,0][i]||0;
          return `<div class="node ${n.state}" style="transform:translateX(${off}px)">
            ${n.state==='current'?`<div class="start-here">COMECE AQUI</div>`:''}
            ${n.state==='done'?`<div class="crown">👑</div>`:''}
            <button class="bubble" ${n.state!=='locked'?'data-act="go" data-route="game"':''}>${n.ic}</button>
            <div class="label">${n.label}</div></div>`; }).join('')}
      </div>
    </div>

    <div class="section">
      <div class="card pad" style="background:linear-gradient(135deg,#FFF7ED,#FFEDD5);border-color:#FED7AA">
        <div class="row gap12"><div style="font-size:34px">⚔️</div>
          <div class="grow"><div class="b9">Desafio relâmpago</div><div class="small muted b">Ana te desafiou: 20 cards de Biologia. Faltam <b>4h</b>!</div></div>
          <button class="btn btn-amarelo btn-sm" data-act="go" data-route="game">Aceitar</button></div>
      </div>
    </div>
    <div class="empty-space"></div>
  </div>`;
}

// =========================================================================
// GAME — flashcards (sem vidas; erro só agenda revisão)
// =========================================================================
function startDeck(){
  let pool = CARDS.filter(c=> App.s.selectedSubjects.includes(c.s));
  if(pool.length < 6) pool = CARDS.slice();
  pool = pool.slice().sort(()=>Math.random()-0.5).slice(0,8);
  App.s.deck = pool.map(c=>({ ...c }));
  App.s.deckIndex=0; App.s.revealed=false; App.s.combo=0;
  App.s.sessionCorrect=0; App.s.sessionTotal=0; App.s.sessionXp=0;
}

function Game(){
  if(!App.s.deck.length) startDeck();
  const idx = App.s.deckIndex;
  const card = App.s.deck[idx];
  const subj = SUBJECTS[card.s];
  const pct = Math.round(idx / App.s.deck.length * 100);
  const flipped = App.s.revealed;
  return `
  <div class="game">
    <div class="game-top">
      <button class="icon-btn" data-act="quit" style="background:#F1EFF6;color:var(--ink-soft)">✕</button>
      <div class="bar"><span style="width:${pct}%"></span></div>
      <span class="pill small">${idx+1}/${App.s.deck.length}</span>
    </div>
    ${App.s.combo>=2?`<div class="combo show">🔥 Combo x${App.s.combo}</div>`:''}

    <div class="card-area">
      <div class="flashcard ${flipped?'flipped':''}" ${flipped?'':'data-act="reveal"'}>
        <div class="face front">
          <span class="subject-tag pill" style="background:${subj.color}1a;color:${subj.color}">${subj.emoji} ${subj.name} · ${card.sub}</span>
          <div class="q">${card.q}</div>
          <div class="flip-hint">👆 Toque para ver a resposta</div>
        </div>
        <div class="face back">
          <span class="a-label">Resposta</span>
          <div class="q" style="font-size:19px;font-weight:700">${card.a}</div>
          <div class="hint">Você acertou? Seja honesto — isso treina a IA 🧠</div>
        </div>
      </div>
    </div>

    ${flipped ? `
      <div class="rate-grid slide-in">
        <button class="rate err"  data-act="rate" data-rate="0"><span class="ic">😵</span>Errei<span class="when">rever já</span></button>
        <button class="rate hard" data-act="rate" data-rate="1"><span class="ic">😬</span>Difícil<span class="when">1 dia</span></button>
        <button class="rate good" data-act="rate" data-rate="2"><span class="ic">🙂</span>Bom<span class="when">3 dias</span></button>
        <button class="rate easy" data-act="rate" data-rate="3"><span class="ic">😎</span>Fácil<span class="when">7 dias</span></button>
      </div>` : `
      <div class="reveal-hint"><button class="btn btn-roxo btn-block btn-lg" data-act="reveal">Mostrar resposta</button></div>`}
  </div>`;
}

function gameAnswer(rating, btn){
  const correct = rating >= 2;
  App.s.sessionTotal++;
  if(correct){
    App.s.sessionCorrect++; App.s.combo++;
    const base = rating===3?12:10, bonus=Math.min(App.s.combo,5)*2, gain=base+bonus;
    App.s.sessionXp += gain; floatXp(gain, btn);
    if(App.s.combo>=3) toast(`Combo x${App.s.combo}! +${bonus} XP de bônus 🔥`,'warn','🔥');
  } else {
    App.s.combo=0; toast('Tranquilo — esse volta logo pra você revisar 💪','brand','📌');
  }
  App.s.deckIndex++; App.s.revealed=false;
  if(App.s.deckIndex >= App.s.deck.length){
    App.s.xp += App.s.sessionXp; App.s.xpToday += App.s.sessionXp;
    go('complete');
  } else render();
}

// =========================================================================
// COMPLETE
// =========================================================================
function Complete(){
  const acc = App.s.sessionTotal ? Math.round(App.s.sessionCorrect/App.s.sessionTotal*100) : 0;
  const perfect = acc===100;
  return `
  <div class="complete fade-in">
    <div class="trophy">${perfect?'🏆':'🎉'}</div>
    <div class="h1">${perfect?'Sessão perfeita!':'Mandou bem!'}</div>
    <p class="muted b" style="max-width:300px">${perfect?'Você acertou tudo. A IA marcou esses cards como dominados.':'Cada sessão te deixa mais perto do seu objetivo.'}</p>
    <div class="stat-cards mt20">
      <div class="stat-tile" style="background:var(--grad-xp)"><div class="v" id="c-xp">0</div><div class="k">⚡ XP ganho</div></div>
      <div class="stat-tile" style="background:var(--grad-verde)"><div class="v">${acc}%</div><div class="k">🎯 Acerto</div></div>
      <div class="stat-tile" style="background:var(--grad-streak)"><div class="v">🔥 ${App.s.streak}</div><div class="k">Streak mantido</div></div>
      <div class="stat-tile" style="background:var(--grad-brand)"><div class="v">${App.s.sessionTotal}</div><div class="k">📇 Cards revisados</div></div>
    </div>
    <div class="card pad mt20" style="width:100%">
      <div class="row between"><span class="b">Meta diária</span><span class="b" style="color:var(--roxo-700)">${App.s.xpToday}/${STUDENT.dailyGoal} XP</span></div>
      <div class="bar xp mt8"><span style="width:${Math.min(100,App.s.xpToday/STUDENT.dailyGoal*100)}%"></span></div>
    </div>
    <div style="width:100%;margin-top:20px;display:flex;flex-direction:column;gap:10px">
      <button class="btn btn-verde btn-block btn-lg" data-act="go" data-route="game">Continuar estudando</button>
      <button class="btn btn-ghost btn-block" data-act="go" data-route="home">Voltar ao início</button>
    </div>
  </div>`;
}

// =========================================================================
// RANKING
// =========================================================================
function Ranking(){
  const tab = App.s.rankTab, list = RANK[tab], promoteAt = 3;
  return `
  <div>
    <div class="league-head">
      <div style="font-size:46px">${STUDENT.leagueIcon}</div>
      <div class="h2" style="color:#fff">Liga ${STUDENT.league}</div>
      <p style="opacity:.9;font-weight:800" class="small">Termina em 3 dias • Top 3 sobem para a Liga Diamante 💎</p>
    </div>
    <div class="section" style="padding-top:14px">
      <div class="seg">
        <button class="${tab==='geral'?'on':''}" data-act="rank-tab" data-tab="geral">🌐 Geral</button>
        <button class="${tab==='prova'?'on':''}" data-act="rank-tab" data-tab="prova">📝 Por prova</button>
        <button class="${tab==='escola'?'on':''}" data-act="rank-tab" data-tab="escola">🏫 Escola</button>
      </div>
      <p class="tiny faint mt8 tcenter">${tab==='geral'?'Todos os estudantes da Flipei':tab==='prova'?'Quem está focado no ENEM como você':'Alunos do '+STUDENT.school}</p>
    </div>
    <div class="section" style="display:flex;flex-direction:column;gap:9px;">
      ${list.map((u,i)=>{ const pos=i+1, top=pos<=3?'top'+pos:'', medal=pos===1?'🥇':pos===2?'🥈':pos===3?'🥉':pos;
        const html=`<div class="rank-row ${u.me?'me':''} ${top}">
          <div class="rank-pos">${medal}</div>
          <div class="avatar" style="background:${u.av};width:40px;height:40px;font-size:15px">${u.name[0]}</div>
          <div class="grow"><div class="b9">${u.name}${u.me?' <span class="pill" style="padding:2px 8px;font-size:11px">você</span>':''}</div>
            <div class="tiny faint b">Nível ${14-i>0?14-i:1}</div></div>
          <div class="tag-stat tag-xp" style="font-size:14px">${u.xp.toLocaleString('pt-BR')}</div></div>`;
        return pos===promoteAt ? `${html}<div class="promo-line">Zona de promoção ⬆️</div>` : html;
      }).join('')}
    </div>
    <div class="empty-space"></div>
  </div>`;
}

// =========================================================================
// PERSONALIZE
// =========================================================================
function Personalize(){
  const s = App.s;
  return `
  <div>
    <div class="topbar"><div class="h3">🎯 Personalizar estudos</div></div>
    <p class="hr-pad muted b small" style="margin-top:-4px">Você no controle: a Flipei entrega flashcards do que importa pra você.</p>
    <div class="section" style="padding-top:14px">
      <div class="ai-card"><div class="spark">✨</div>
        <div class="pill" style="background:rgba(255,255,255,.18);color:#fff">🤖 Sugestão da IA</div>
        <div class="h3 mt8" style="color:#fff">Foque em Física e Matemática</div>
        <p class="small" style="opacity:.92;font-weight:700;margin-top:4px">Analisamos as últimas provas + seu desempenho. Esses temas caem muito e são onde você mais erra.</p>
        <button class="btn btn-amarelo btn-sm mt12" data-act="go" data-route="game">Treinar pontos fracos</button>
      </div>
    </div>
    <div class="section">
      <div class="eyebrow">Sua prova / universidade</div>
      <div class="col gap10 mt8">
        ${EXAMS.map(e=>`<div class="uni-card ${s.exam===e.id?'on':''}" data-act="set-exam" data-exam="${e.id}">
          <div class="uni-logo" style="background:${e.color}">${e.sigla}</div>
          <div class="grow"><div class="b9">${e.name}</div><div class="small muted">${e.sub}</div></div>
          <div style="font-size:20px;color:var(--roxo-500)">${s.exam===e.id?'✓':'○'}</div></div>`).join('')}
      </div>
    </div>
    <div class="section">
      <div class="eyebrow">Matérias no seu foco</div>
      <p class="tiny faint b">Toque para ativar/desativar. Você recebe mais cards do que escolher.</p>
      <div class="row wrap gap8 mt8">
        ${Object.values(SUBJECTS).map(sub=>`<button class="opt-chip ${s.selectedSubjects.includes(sub.id)?'on':''}" data-act="toggle-subj" data-subj="${sub.id}">${sub.emoji} ${sub.name}</button>`).join('')}
      </div>
    </div>
    <div class="section">
      <div class="eyebrow">Aprofundar em um tema</div>
      <div class="card pad mt8">
        <div class="row between"><span class="b">Biologia</span><span class="link">trocar</span></div>
        <div class="row wrap gap8 mt8">
          <span class="pill">Citologia</span><span class="pill outline">Genética</span><span class="pill outline">Ecologia</span><span class="pill outline">Evolução</span><span class="pill outline">+ temas</span>
        </div>
        <button class="btn btn-outline btn-block btn-sm mt12" data-act="go" data-route="game">Estudar só "Citologia"</button>
      </div>
    </div>
    <div class="empty-space"></div>
  </div>`;
}

// =========================================================================
// PROFILE — dashboard + vínculo com escola
// =========================================================================
function Profile(){
  const s = App.s;
  const subjData = STUDENT.bySubject.map(x=>({ l:SUBJECTS[x.s].name, v:x.acc, color:SUBJECTS[x.s].color }));
  const weekData = STUDENT.weeklyXp.map((v,i)=>({ l:['S','T','Q','Q','S','S','D'][i], v }));
  const linked = s.linkedSchool;
  return `
  <div>
    <div style="background:var(--grad-brand);padding:22px 18px 26px;color:#fff;border-radius:0 0 26px 26px;">
      <div class="row between">
        <div class="row gap12">
          <div class="avatar" style="background:#fff;color:var(--roxo-700);width:56px;height:56px;font-size:24px">${STUDENT.name[0]}</div>
          <div><div class="h3" style="color:#fff">${STUDENT.name}</div>
            <div class="small" style="opacity:.9;font-weight:800">${STUDENT.handle}${linked?' · '+esc(linked):''}</div></div>
        </div>
        <button class="icon-btn" style="background:rgba(255,255,255,.18);color:#fff">⚙️</button>
      </div>
      <div class="row gap8 mt16">
        <div class="grow tcenter" style="background:rgba(255,255,255,.14);border-radius:14px;padding:10px"><div class="h3" style="color:#fff">🔥 ${s.streak}</div><div class="tiny b" style="opacity:.9">dias</div></div>
        <div class="grow tcenter" style="background:rgba(255,255,255,.14);border-radius:14px;padding:10px"><div class="h3" style="color:#fff">${s.xp.toLocaleString('pt-BR')}</div><div class="tiny b" style="opacity:.9">XP total</div></div>
        <div class="grow tcenter" style="background:rgba(255,255,255,.14);border-radius:14px;padding:10px"><div class="h3" style="color:#fff">${STUDENT.leagueIcon}</div><div class="tiny b" style="opacity:.9">Liga ${STUDENT.league}</div></div>
      </div>
    </div>

    <!-- Vínculo com a escola -->
    <div class="section" style="padding-top:16px">
      ${linked ? `
        <div class="card pad" style="border-color:var(--verde-300);background:var(--verde-100)">
          <div class="row gap12">
            <div style="font-size:30px">🏫</div>
            <div class="grow"><div class="b9">Conectado a ${esc(linked)}</div>
              <div class="small muted b">Sua escola acompanha seu progresso. Ela vê desempenho — nunca interfere no seu app.</div></div>
            <button class="btn btn-outline btn-sm" data-act="unlink">Desvincular</button>
          </div>
        </div>` : `
        <div class="card pad" style="border:2px dashed var(--roxo-300);background:var(--roxo-50)">
          <div class="row gap12">
            <div style="font-size:30px">🏫</div>
            <div class="grow"><div class="b9">Sua escola é parceira Flipei?</div>
              <div class="small muted b">Peça o <b>código do professor</b> e conecte sua conta. Você continua usando o app livremente.</div></div>
          </div>
          <button class="btn btn-roxo btn-block btn-sm mt12" data-act="link-open">🔗 Conectar à minha escola</button>
        </div>`}
    </div>

    <div class="section">
      <div class="eyebrow">Visão geral</div>
      <div class="row gap10 mt8">
        <div class="kpi grow tcenter"><div class="v" style="color:var(--verde-600)">${STUDENT.accuracy}%</div><div class="k">Acerto geral</div></div>
        <div class="kpi grow tcenter"><div class="v" style="color:var(--roxo-600)">${STUDENT.cardsTotal.toLocaleString('pt-BR')}</div><div class="k">Cards revisados</div></div>
        <div class="kpi grow tcenter"><div class="v" style="color:var(--laranja-600)">${Math.round(STUDENT.minutesWeek/60)}h</div><div class="k">Na semana</div></div>
      </div>
    </div>

    <div class="section"><div class="card pad">
      <div class="row between"><div class="b9">📈 Evolução de XP</div><span class="pill green">↑ esta semana</span></div>
      ${barChart(weekData,{h:170,values:true})}
    </div></div>

    <div class="section"><div class="card pad">
      <div class="b9">🎯 Acerto por matéria</div><p class="tiny faint b">Onde você brilha e onde precisa de reforço.</p>
      <div class="mt8">${hBars(subjData,{})}</div>
      <div class="insight mt8" style="border-color:var(--laranja-500);background:var(--laranja-100)">
        <span class="small b" style="color:var(--laranja-600)">💡 Física (59%) é seu ponto mais fraco. Que tal 10 cards agora?</span></div>
    </div></div>

    <div class="section"><div class="card pad">
      <div class="row between"><div class="b9">🗓️ Constância</div><span class="small b muted">${s.streak} dias seguidos 🔥</span></div>
      <div class="cal mt12">${STUDENT.heat.map(l=>`<div class="d l${l}"></div>`).join('')}</div>
    </div></div>

    <div class="section">
      <div class="row between"><div class="b9">🏅 Conquistas</div><span class="link">ver todas</span></div>
      <div class="col gap8 mt8">
        ${STUDENT.conquistas.map(c=>`<div class="ach ${c.got?'':'locked'}">
          <div class="medal" style="background:${c.color}1a">${c.ic}</div>
          <div class="grow"><div class="b9">${c.name}</div><div class="small muted">${c.desc}</div></div>
          <div style="font-size:20px">${c.got?'✅':'🔒'}</div></div>`).join('')}
      </div>
    </div>
    <div class="empty-space"></div>
  </div>`;
}

// =========================================================================
// LINK SCHOOL — aluno conecta à escola via código do professor
// =========================================================================
function LinkSchool(){
  return `
  <div>
    <div class="topbar"><button class="icon-btn" data-act="link-cancel">←</button><div class="h3">Conectar à escola</div><div style="width:42px"></div></div>
    <div class="section" style="padding-top:10px">
      <div class="tcenter" style="padding:10px 0"><div style="font-size:60px">🏫</div></div>
      <p class="muted b tcenter" style="max-width:320px;margin:0 auto">Sua escola parceira recebe um <b>código de turma</b> (ou login do professor). Digite abaixo para conectar.</p>

      <div class="card pad mt16">
        <div class="tiny faint b">Código da escola / turma</div>
        <input class="onb-input" id="school-code" data-model="schoolCode" placeholder="Ex.: HORIZONTE-3A" style="text-transform:uppercase" />
        <button class="btn btn-roxo btn-block mt12" data-act="link-submit">Conectar</button>
        <p class="tiny faint b mt8">💡 No protótipo, experimente <b>HORIZONTE</b> (ou qualquer código).</p>
      </div>

      <div class="card pad mt12" style="background:var(--surface-2)">
        <div class="b9 small">🔒 O que a escola vê — e o que não vê</div>
        <div class="col gap6 mt8 small b">
          <div class="row gap8"><span style="color:var(--verde-600)">✓</span> Seu desempenho, acertos e constância</div>
          <div class="row gap8"><span style="color:var(--verde-600)">✓</span> Em quais temas você tem dificuldade</div>
          <div class="row gap8"><span style="color:var(--vermelho-500)">✕</span> Não controla nem limita seu uso do app</div>
          <div class="row gap8"><span style="color:var(--vermelho-500)">✕</span> Não vê conteúdo privado seu</div>
        </div>
      </div>
    </div>
  </div>`;
}

function submitLink(){
  const code = (App.s.schoolCode || ($('#school-code') && $('#school-code').value) || '').trim();
  if(!code){ toast('Digite o código da escola','warn','⚠️'); return; }
  App.s.linkedSchool = /horizonte/i.test(code) ? 'Colégio Horizonte' : (code.split(/[-\s]/)[0][0].toUpperCase()+code.split(/[-\s]/)[0].slice(1).toLowerCase());
  if(!/horizonte/i.test(code)) App.s.linkedSchool = 'Escola '+App.s.linkedSchool;
  toast('Conectado a '+App.s.linkedSchool+'! 🎉','success','🏫');
  confetti({count:110, y:innerHeight*0.4});
  go('profile');
}
