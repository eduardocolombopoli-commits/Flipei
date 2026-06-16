/* =========================================================================
   FLIPEI — Telas do ALUNO (experiência divertida / gamificada)
   ========================================================================= */

// ---------- Logo ----------
function Logo(size){
  return `<div class="logo">
    <div class="mark">F</div>
    <div class="word" ${size?`style="font-size:${size}px"`:''}>Flip<b>ei</b></div>
  </div>`;
}

// =========================================================================
// SPLASH / Boas-vindas
// =========================================================================
function Splash(){
  return `
  <div class="stage">
    <div class="phone">
      <div class="phone-notch"></div>
      <div class="onb fade-in" style="background:radial-gradient(120% 80% at 50% 0%, #F5F3FF, #fff);">
        <div class="hero">
          <div class="blob" style="width:160px;height:160px;background:var(--roxo-300);top:6%;left:-30px;"></div>
          <div class="blob" style="width:120px;height:120px;background:var(--verde-300);bottom:18%;right:-20px;"></div>
          <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:6px;">
            <div style="font-size:78px;transform:rotate(-8deg);filter:drop-shadow(0 14px 20px rgba(124,58,237,.35))">🃏</div>
            ${Logo(40)}
            <div class="h2" style="margin-top:18px;max-width:300px;">Estudar virou jogo.</div>
            <p class="muted" style="max-width:280px;font-weight:700;">Flashcards + gamificação + IA para você passar no ENEM e no vestibular dos seus sonhos.</p>
          </div>
          <div style="display:flex;gap:18px;margin-top:10px;position:relative;z-index:2;">
            <div class="tcenter"><div class="h2" style="color:var(--roxo-600)">🔥</div><div class="tiny b muted">Streaks</div></div>
            <div class="tcenter"><div class="h2" style="color:var(--roxo-600)">🏆</div><div class="tiny b muted">Ligas</div></div>
            <div class="tcenter"><div class="h2" style="color:var(--roxo-600)">🎯</div><div class="tiny b muted">No seu foco</div></div>
          </div>
        </div>
        <div class="section">
          <button class="btn btn-roxo btn-block btn-lg" data-go="onboarding">Começar agora</button>
          <button class="btn btn-ghost btn-block mt8">Já tenho conta</button>
          <p class="tiny faint tcenter mt12">Grátis para todo aluno • Disponível em breve na App Store, Google Play e Windows</p>
        </div>
      </div>
    </div>
  </div>`;
}

// =========================================================================
// ONBOARDING — escolha de objetivo (multi-step)
// =========================================================================
const ONB_GOALS = [
  { id:'enem', emoji:'📝', t:'Passar no ENEM', d:'Foco no Exame Nacional' },
  { id:'medicina', emoji:'🩺', t:'Cursar Medicina', d:'As provas mais concorridas' },
  { id:'fuvest', emoji:'🎓', t:'USP / FUVEST', d:'Vestibular específico' },
  { id:'explorar', emoji:'🧭', t:'Ainda estou decidindo', d:'Quero explorar' },
];
const ONB_LEVELS = [
  { id:'1', emoji:'🌱', t:'Começando do zero', d:'Quero criar o hábito' },
  { id:'2', emoji:'📚', t:'Já estudo às vezes', d:'Quero ser consistente' },
  { id:'3', emoji:'⚡', t:'Estudo sério', d:'Reta final, foco total' },
];
const ONB_TIME = [
  { id:'5', emoji:'☕', t:'5 min / dia', d:'Casual' },
  { id:'15', emoji:'🎯', t:'15 min / dia', d:'Regular (recomendado)' },
  { id:'30', emoji:'🔥', t:'30 min / dia', d:'Sério' },
  { id:'60', emoji:'🚀', t:'60 min / dia', d:'Intenso' },
];

function Onboarding(){
  const step = App.s.onboardStep;
  const steps = [
    { eyebrow:'Passo 1 de 3', title:'Qual é o seu objetivo?', sub:'Vamos personalizar seus flashcards para isso.', opts:ONB_GOALS, key:'goal' },
    { eyebrow:'Passo 2 de 3', title:'Como está sua rotina hoje?', sub:'Sem julgamentos — só pra começar do jeito certo.', opts:ONB_LEVELS, key:'level' },
    { eyebrow:'Passo 3 de 3', title:'Sua meta diária', sub:'Estudar pouco e todo dia vale mais que maratonar.', opts:ONB_TIME, key:'time' },
  ][step];
  const chosen = App.s['onb_'+steps.key];
  return `
  <div class="stage">
    <div class="phone">
      <div class="phone-notch"></div>
      <div class="onb fade-in">
        <div class="topbar">
          <button class="icon-btn" id="onb-back">←</button>
          <div class="bar roxo thin grow" style="max-width:200px"><span style="width:${(step+1)/3*100}%"></span></div>
          <div style="width:42px"></div>
        </div>
        <div style="padding:8px 22px 0;">
          <div class="eyebrow">${steps.eyebrow}</div>
          <div class="h2 mt4">${steps.title}</div>
          <p class="muted b mt4">${steps.sub}</p>
        </div>
        <div class="scroll" style="flex:1;padding:18px 22px;display:flex;flex-direction:column;gap:12px;">
          ${steps.opts.map(o=>`
            <button class="choice ${chosen===o.id?'sel':''}" data-opt="${o.id}">
              <div class="emoji">${o.emoji}</div>
              <div class="col"><div class="b9" style="font-size:16px">${o.t}</div><div class="small muted">${o.d}</div></div>
              <div class="grow"></div>
              <div style="font-size:20px;color:var(--roxo-500)">${chosen===o.id?'✓':''}</div>
            </button>`).join('')}
        </div>
        <div class="section">
          <button class="btn btn-roxo btn-block btn-lg" id="onb-next" ${chosen?'':'disabled'}>${step<2?'Continuar':'Criar meu perfil'}</button>
        </div>
      </div>
    </div>
  </div>`;
}

function bindOnboarding(){
  const step = App.s.onboardStep;
  const key = ['goal','level','time'][step];
  $$('.choice[data-opt]').forEach(c=> c.addEventListener('click', ()=>{
    App.s['onb_'+key] = c.dataset.opt;
    render();
  }));
  $('#onb-back').addEventListener('click', ()=>{
    if(step===0){ App.s.onboardStep=0; go('splash'); }
    else { App.s.onboardStep--; render(); }
  });
  $('#onb-next').addEventListener('click', ()=>{
    if(step<2){ App.s.onboardStep++; render(); }
    else {
      App.s.onboardStep=0;
      toast('Perfil criado! Bem-vindo à Flipei 🎉','success','✨');
      confetti({count:120, y: innerHeight*0.4});
      go('home');
    }
  });
}

// =========================================================================
// HOME — Trilha de estudos + status do dia
// =========================================================================
function Home(){
  const s = App.s;
  const pct = Math.min(100, Math.round(s.xpToday / STUDENT.dailyGoal * 100));
  return `
  <div>
    <div class="topbar">
      <div class="brand-mini">${Logo(20)}</div>
      <div class="row gap8">
        <span class="tag-stat tag-streak">🔥 ${s.streak}</span>
        <span class="tag-stat tag-gem">💎 ${s.gems}</span>
        <span class="tag-stat tag-life">❤️ ${s.lives}</span>
      </div>
    </div>

    <!-- Meta diária -->
    <div class="section">
      <div class="card pad">
        <div class="row between">
          <div>
            <div class="eyebrow">Meta de hoje</div>
            <div class="h3">${s.xpToday} / ${STUDENT.dailyGoal} XP</div>
          </div>
          <div class="pill ${pct>=100?'green':''}">${pct>=100?'Concluída! 🎉':pct+'%'}</div>
        </div>
        <div class="bar xp mt12"><span style="width:${pct}%"></span></div>
        <div class="row between mt8">
          <span class="small muted b">Objetivo: <b style="color:var(--roxo-700)">${s.goal}</b></span>
          <span class="small b" style="color:var(--laranja-600)">🔥 ${s.streak} dias seguidos</span>
        </div>
      </div>
    </div>

    <!-- CTA principal -->
    <div class="section">
      <button class="btn btn-roxo btn-block btn-lg" data-go="game">▶  Estudar agora</button>
      <div class="row gap10 mt12">
        <button class="btn btn-outline grow btn-sm" data-go="game">⚡ Revisão rápida</button>
        <button class="btn btn-outline grow btn-sm" data-go="personalize">🎯 Mudar foco</button>
      </div>
    </div>

    <!-- Trilha -->
    <div class="section">
      <div class="unit-banner">
        <div class="col">
          <span class="tiny b" style="opacity:.85;text-transform:uppercase;letter-spacing:.5px">Sua trilha</span>
          <span class="h3" style="color:#fff">${PATH.unit}</span>
        </div>
        <div style="font-size:34px">🧬</div>
      </div>

      <div class="path">
        ${PATH.nodes.map((n,i)=>{
          const off = [0,38,-30,30,-22,0][i] || 0;
          return `<div class="node ${n.state}" style="transform:translateX(${off}px)">
            ${n.state==='current'?`<div class="start-here">COMECE AQUI</div>`:''}
            ${n.state==='done'?`<div class="crown">👑</div>`:''}
            <button class="bubble" ${n.state!=='locked'?'data-go="game"':''}>${n.ic}</button>
            <div class="label">${n.label}</div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Desafio social -->
    <div class="section">
      <div class="card pad" style="background:linear-gradient(135deg,#FFF7ED,#FFEDD5);border-color:#FED7AA">
        <div class="row gap12">
          <div style="font-size:34px">⚔️</div>
          <div class="grow">
            <div class="b9">Desafio relâmpago</div>
            <div class="small muted b">Ana te desafiou: 20 cards de Biologia. Faltam <b>4h</b>!</div>
          </div>
          <button class="btn btn-amarelo btn-sm" data-go="game">Aceitar</button>
        </div>
      </div>
    </div>
    <div class="empty-space"></div>
  </div>`;
}

function bindHome(){
  // count up nothing special; CTA handled by data-go
}

// =========================================================================
// GAME — sessão de flashcards
// =========================================================================
function startDeck(){
  // build deck from selected subjects, fallback to all
  let pool = CARDS.filter(c=> App.s.selectedSubjects.includes(c.s));
  if(pool.length < 6) pool = CARDS.slice();
  // shuffle
  pool = pool.slice().sort(()=>Math.random()-0.5).slice(0, 8);
  App.s.deck = pool.map(c=>({ ...c, flipped:false, rated:false }));
  App.s.deckIndex = 0;
  App.s.combo = 0;
  App.s.sessionCorrect = 0;
  App.s.sessionTotal = 0;
  App.s.sessionXp = 0;
}

function Game(){
  if(!App.s.deck.length || App.s.deckIndex===0 && App.params.fresh!==false){
    if(!App.s.deck.length) startDeck();
  }
  const idx = App.s.deckIndex;
  const card = App.s.deck[idx];
  const subj = SUBJECTS[card.s];
  const pct = Math.round(idx / App.s.deck.length * 100);
  return `
  <div class="game">
    <div class="game-top">
      <button class="icon-btn" id="game-quit" style="background:#F1EFF6;color:var(--ink-soft)">✕</button>
      <div class="bar"><span style="width:${pct}%"></span></div>
      <span class="tag-stat tag-life" style="font-size:13px">❤️ ${App.s.lives}</span>
    </div>
    <div class="combo ${App.s.combo>=2?'show':''}" id="combo">🔥 Combo x${App.s.combo}</div>

    <div class="card-area">
      <div class="flashcard" id="flashcard">
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

    <div id="game-actions">
      <div class="reveal-hint" id="reveal-hint">
        <button class="btn btn-roxo btn-block btn-lg" id="reveal-btn">Mostrar resposta</button>
      </div>
    </div>
  </div>`;
}

function rateButtons(){
  return `
  <div class="rate-grid slide-in">
    <button class="rate err" data-rate="0"><span class="ic">😵</span>Errei<span class="when">&lt; 10min</span></button>
    <button class="rate hard" data-rate="1"><span class="ic">😬</span>Difícil<span class="when">1 dia</span></button>
    <button class="rate good" data-rate="2"><span class="ic">🙂</span>Bom<span class="when">3 dias</span></button>
    <button class="rate easy" data-rate="3"><span class="ic">😎</span>Fácil<span class="when">7 dias</span></button>
  </div>`;
}

function bindGame(){
  const fc = $('#flashcard');
  const flip = ()=>{
    fc.classList.add('flipped');
    const actions = $('#game-actions');
    actions.innerHTML = rateButtons();
    bindRates();
  };
  $('#reveal-btn') && $('#reveal-btn').addEventListener('click', flip);
  fc.addEventListener('click', ()=>{ if(!fc.classList.contains('flipped')) flip(); });
  $('#game-quit').addEventListener('click', ()=>{
    if(confirm('Sair da sessão? Seu progresso desta sessão será perdido.')){ App.s.deck=[]; go('home'); }
  });

  function bindRates(){
    $$('.rate[data-rate]').forEach(b=> b.addEventListener('click', ()=> answer(parseInt(b.dataset.rate), b)));
  }

  function answer(rating, btn){
    const correct = rating >= 2;       // Bom/Fácil = acerto
    App.s.sessionTotal++;
    if(correct){
      App.s.sessionCorrect++;
      App.s.combo++;
      const base = rating===3 ? 12 : 10;
      const bonus = Math.min(App.s.combo, 5) * 2;     // combo bonus
      const gain = base + bonus;
      App.s.sessionXp += gain;
      floatXp(gain, btn);
      if(App.s.combo>=3) toast(`Combo x${App.s.combo}! +${bonus} XP de bônus 🔥`,'warn','🔥');
    } else {
      App.s.combo = 0;
      App.s.lives = Math.max(0, App.s.lives-1);
      toast('Sem problema — vamos revisar em breve 💪','brand','📌');
    }
    // advance
    App.s.deckIndex++;
    if(App.s.deckIndex >= App.s.deck.length || App.s.lives<=0){
      finishSession();
    } else {
      render();
    }
  }

  function finishSession(){
    App.s.xp += App.s.sessionXp;
    App.s.xpToday += App.s.sessionXp;
    if(App.s.sessionCorrect>0 && App.s.combo>=0){ /* keep streak */ }
    go('complete');
  }
}

// =========================================================================
// COMPLETE — resumo gamificado da sessão
// =========================================================================
function Complete(){
  const acc = App.s.sessionTotal ? Math.round(App.s.sessionCorrect/App.s.sessionTotal*100) : 0;
  const perfect = acc===100;
  return `
  <div class="complete fade-in">
    <div class="trophy">${perfect?'🏆':'🎉'}</div>
    <div class="h1">${perfect?'Sessão perfeita!':'Mandou bem!'}</div>
    <p class="muted b" style="max-width:300px">${perfect?'Você acertou tudo. A IA já marcou esses cards como dominados.':'Cada sessão te deixa mais perto do seu objetivo.'}</p>

    <div class="stat-cards mt20">
      <div class="stat-tile" style="background:var(--grad-xp)">
        <div class="v" id="c-xp">0</div><div class="k">⚡ XP ganho</div>
      </div>
      <div class="stat-tile" style="background:var(--grad-verde)">
        <div class="v">${acc}%</div><div class="k">🎯 Acerto</div>
      </div>
      <div class="stat-tile" style="background:var(--grad-streak)">
        <div class="v">🔥 ${App.s.streak}</div><div class="k">Streak mantido</div>
      </div>
      <div class="stat-tile" style="background:var(--grad-roxo)">
        <div class="v">${App.s.sessionTotal}</div><div class="k">📇 Cards revisados</div>
      </div>
    </div>

    <div class="card pad mt20" style="width:100%">
      <div class="row between">
        <span class="b">Meta diária</span>
        <span class="b" style="color:var(--roxo-700)">${App.s.xpToday}/${STUDENT.dailyGoal} XP</span>
      </div>
      <div class="bar xp mt8"><span style="width:${Math.min(100,App.s.xpToday/STUDENT.dailyGoal*100)}%"></span></div>
    </div>

    <div style="width:100%;margin-top:20px;display:flex;flex-direction:column;gap:10px">
      <button class="btn btn-verde btn-block btn-lg" data-go="game">Continuar estudando</button>
      <button class="btn btn-ghost btn-block" data-go="home">Voltar ao início</button>
    </div>
  </div>`;
}

function bindComplete(){
  confetti({count:160, y: innerHeight*0.32});
  const xpNode = $('#c-xp');
  if(xpNode) countUp(xpNode, App.s.sessionXp, 1000);
  // reset deck for next session
  App.s.deck = [];
}

// =========================================================================
// RANKING — Ligas (geral / prova / escola)
// =========================================================================
function Ranking(){
  const tab = App.s.rankTab;
  const list = RANK[tab];
  const promoteAt = 3; // top 3 sobem de liga
  return `
  <div>
    <div class="league-head">
      <div style="font-size:46px">${STUDENT.leagueIcon}</div>
      <div class="h2" style="color:#fff">Liga ${STUDENT.league}</div>
      <p style="opacity:.9;font-weight:800" class="small">Termina em 3 dias • Top 3 sobem para a Liga Diamante 💎</p>
    </div>
    <div class="section" style="padding-top:14px">
      <div class="seg">
        <button class="${tab==='geral'?'on':''}" data-rank="geral">🌐 Geral</button>
        <button class="${tab==='prova'?'on':''}" data-rank="prova">📝 Por prova</button>
        <button class="${tab==='escola'?'on':''}" data-rank="escola">🏫 Escola</button>
      </div>
      <p class="tiny faint mt8 tcenter">${tab==='geral'?'Todos os estudantes da Flipei':tab==='prova'?'Quem está focado no ENEM como você':'Alunos do '+STUDENT.school}</p>
    </div>

    <div class="section" style="display:flex;flex-direction:column;gap:9px;">
      ${list.map((u,i)=>{
        const pos = i+1;
        const top = pos<=3 ? 'top'+pos : '';
        const medal = pos===1?'🥇':pos===2?'🥈':pos===3?'🥉':pos;
        const html = `<div class="rank-row ${u.me?'me':''} ${top}">
          <div class="rank-pos">${medal}</div>
          <div class="avatar" style="background:${u.av};width:40px;height:40px;font-size:15px">${u.name[0]}</div>
          <div class="grow"><div class="b9">${u.name}${u.me?' <span class="pill" style="padding:2px 8px;font-size:11px">você</span>':''}</div>
            <div class="tiny faint b">Nível ${14-i>0?14-i:1}</div></div>
          <div class="tag-stat tag-xp" style="font-size:14px">${u.xp.toLocaleString('pt-BR')}</div>
        </div>`;
        const sep = (pos===promoteAt) ? `${html}<div class="promo-line">Zona de promoção ⬆️</div>` : html;
        return sep;
      }).join('')}
    </div>
    <div class="empty-space"></div>
  </div>`;
}

function bindRanking(){
  $$('[data-rank]').forEach(b=> b.addEventListener('click', ()=>{ App.s.rankTab=b.dataset.rank; render(); }));
}

// =========================================================================
// PERSONALIZE — prova, universidade, matéria, submatéria + IA
// =========================================================================
function Personalize(){
  const s = App.s;
  return `
  <div>
    <div class="topbar"><div class="h3">🎯 Personalizar estudos</div></div>
    <p class="hr-pad muted b small" style="margin-top:-4px">Você no controle: a Flipei entrega flashcards do que importa pra você.</p>

    <!-- IA highlight -->
    <div class="section" style="padding-top:14px">
      <div class="ai-card">
        <div class="spark">✨</div>
        <div class="pill" style="background:rgba(255,255,255,.18);color:#fff">🤖 Sugestão da IA</div>
        <div class="h3 mt8" style="color:#fff">Foque em Física e Matemática</div>
        <p class="small" style="opacity:.92;font-weight:700;margin-top:4px">Analisamos as últimas provas do ENEM + seu desempenho. Esses temas caem muito e são onde você mais erra.</p>
        <button class="btn btn-amarelo btn-sm mt12" data-go="game">Treinar pontos fracos</button>
      </div>
    </div>

    <!-- Prova / universidade -->
    <div class="section">
      <div class="eyebrow">Sua prova / universidade</div>
      <div class="col gap10 mt8">
        ${EXAMS.map(e=>`
          <div class="uni-card ${s.exam===e.id?'on':''}" data-exam="${e.id}">
            <div class="uni-logo" style="background:${e.color}">${e.sigla}</div>
            <div class="grow"><div class="b9">${e.name}</div><div class="small muted">${e.sub}</div></div>
            <div style="font-size:20px;color:var(--roxo-500)">${s.exam===e.id?'✓':'○'}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Matérias -->
    <div class="section">
      <div class="eyebrow">Matérias no seu foco</div>
      <p class="tiny faint b">Toque para ativar/desativar. Você recebe mais cards do que escolher.</p>
      <div class="row wrap gap8 mt8">
        ${Object.values(SUBJECTS).map(sub=>`
          <button class="opt-chip ${s.selectedSubjects.includes(sub.id)?'on':''}" data-subj="${sub.id}">${sub.emoji} ${sub.name}</button>`).join('')}
      </div>
    </div>

    <!-- Submatéria / tema -->
    <div class="section">
      <div class="eyebrow">Aprofundar em um tema</div>
      <div class="card pad mt8">
        <div class="row between"><span class="b">Biologia</span><span class="link">trocar</span></div>
        <div class="row wrap gap8 mt8">
          <span class="pill">Citologia</span>
          <span class="pill outline">Genética</span>
          <span class="pill outline">Ecologia</span>
          <span class="pill outline">Evolução</span>
          <span class="pill outline">+ temas</span>
        </div>
        <button class="btn btn-outline btn-block btn-sm mt12" data-go="game">Estudar só "Citologia"</button>
      </div>
    </div>
    <div class="empty-space"></div>
  </div>`;
}

function bindPersonalize(){
  $$('[data-exam]').forEach(c=> c.addEventListener('click', ()=>{ App.s.exam=c.dataset.exam; const e=EXAMS.find(x=>x.id===c.dataset.exam); App.s.goal=e.name; toast('Foco atualizado: '+e.name,'success','🎯'); render(); }));
  $$('[data-subj]').forEach(c=> c.addEventListener('click', ()=>{
    const id=c.dataset.subj; const arr=App.s.selectedSubjects;
    if(arr.includes(id)){ if(arr.length>1) App.s.selectedSubjects=arr.filter(x=>x!==id); else toast('Escolha ao menos 1 matéria','warn','⚠️'); }
    else App.s.selectedSubjects=[...arr,id];
    render();
  }));
}

// =========================================================================
// PROFILE — dashboard do aluno (evolução, acertos, conquistas)
// =========================================================================
function Profile(){
  const s = App.s;
  const subjData = STUDENT.bySubject.map(x=>({ l:SUBJECTS[x.s].name, v:x.acc, color:SUBJECTS[x.s].color }));
  const weekData = STUDENT.weeklyXp.map((v,i)=>({ l:['S','T','Q','Q','S','S','D'][i], v }));
  const dias = STUDENT.heat;
  return `
  <div>
    <!-- header -->
    <div style="background:var(--grad-roxo);padding:22px 18px 26px;color:#fff;border-radius:0 0 26px 26px;">
      <div class="row between">
        <div class="row gap12">
          <div class="avatar" style="background:#fff;color:var(--roxo-700);width:56px;height:56px;font-size:24px">${STUDENT.name[0]}</div>
          <div><div class="h3" style="color:#fff">${STUDENT.name}</div>
            <div class="small" style="opacity:.9;font-weight:800">${STUDENT.handle} · ${STUDENT.school}</div></div>
        </div>
        <button class="icon-btn" style="background:rgba(255,255,255,.18);color:#fff">⚙️</button>
      </div>
      <div class="row gap8 mt16">
        <div class="grow tcenter" style="background:rgba(255,255,255,.14);border-radius:14px;padding:10px"><div class="h3" style="color:#fff">🔥 ${s.streak}</div><div class="tiny b" style="opacity:.9">dias</div></div>
        <div class="grow tcenter" style="background:rgba(255,255,255,.14);border-radius:14px;padding:10px"><div class="h3" style="color:#fff">${(s.xp).toLocaleString('pt-BR')}</div><div class="tiny b" style="opacity:.9">XP total</div></div>
        <div class="grow tcenter" style="background:rgba(255,255,255,.14);border-radius:14px;padding:10px"><div class="h3" style="color:#fff">${STUDENT.leagueIcon}</div><div class="tiny b" style="opacity:.9">Liga ${STUDENT.league}</div></div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="section" style="padding-top:16px">
      <div class="eyebrow">Visão geral</div>
      <div class="row gap10 mt8">
        <div class="kpi grow tcenter"><div class="v" style="color:var(--verde-600)">${STUDENT.accuracy}%</div><div class="k">Acerto geral</div></div>
        <div class="kpi grow tcenter"><div class="v" style="color:var(--roxo-600)">${STUDENT.cardsTotal.toLocaleString('pt-BR')}</div><div class="k">Cards revisados</div></div>
        <div class="kpi grow tcenter"><div class="v" style="color:var(--laranja-600)">${Math.round(STUDENT.minutesWeek/60)}h</div><div class="k">Na semana</div></div>
      </div>
    </div>

    <!-- Evolução semanal -->
    <div class="section">
      <div class="card pad">
        <div class="row between"><div class="b9">📈 Evolução de XP</div><span class="pill green">↑ esta semana</span></div>
        ${barChart(weekData, { h:170, values:true })}
      </div>
    </div>

    <!-- Desempenho por matéria -->
    <div class="section">
      <div class="card pad">
        <div class="b9">🎯 Acerto por matéria</div>
        <p class="tiny faint b">Onde você brilha e onde precisa de reforço.</p>
        <div class="mt8">${hBars(subjData, {})}</div>
        <div class="insight mt8" style="border-color:var(--laranja-500);background:var(--laranja-100)">
          <span class="small b" style="color:var(--laranja-600)">💡 Física (59%) é seu ponto mais fraco. Que tal 10 cards agora?</span>
        </div>
      </div>
    </div>

    <!-- Calendário de constância -->
    <div class="section">
      <div class="card pad">
        <div class="row between"><div class="b9">🗓️ Constância</div><span class="small b muted">${STUDENT.streak} dias seguidos 🔥</span></div>
        <div class="cal mt12">
          ${dias.map(l=>`<div class="d l${l}"></div>`).join('')}
        </div>
        <div class="row gap8 mt8" style="justify-content:flex-end"><span class="tiny faint b">menos</span>
          <div class="cal" style="grid-template-columns:repeat(5,12px);gap:3px;width:auto">
          <div class="d"></div><div class="d l1"></div><div class="d l2"></div><div class="d l3"></div><div class="d l4"></div></div>
          <span class="tiny faint b">mais</span></div>
      </div>
    </div>

    <!-- Conquistas -->
    <div class="section">
      <div class="row between"><div class="b9">🏅 Conquistas</div><span class="link">ver todas</span></div>
      <div class="col gap8 mt8">
        ${STUDENT.conquistas.map(c=>`
          <div class="ach ${c.got?'':'locked'}">
            <div class="medal" style="background:${c.color}1a">${c.ic}</div>
            <div class="grow"><div class="b9">${c.name}</div><div class="small muted">${c.desc}</div></div>
            <div style="font-size:20px">${c.got?'✅':'🔒'}</div>
          </div>`).join('')}
      </div>
    </div>
    <div class="empty-space"></div>
  </div>`;
}
