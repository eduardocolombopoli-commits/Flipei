/* =========================================================================
   FLIPEI — Telas do ALUNO
   ========================================================================= */

// ---------- Logo ----------
function Logo(size){ return `<span class="logo-word" style="font-size:${size||28}px">flipei</span>`; }
function LogoBig(size){ return `<div class="logo-hero"><span class="logo-word" style="font-size:${size||64}px">flipei</span></div>`; }

// ---------- helpers de decks ----------
function unlockedDecks(){ return DECKS.filter(d=>d.unlocked); }
function dueToday(){ return unlockedDecks().reduce((a,d)=>a+d.due,0); }
function deckById(id){ return DECKS.find(d=>d.id===id); }

function unlockDeck(id){
  const d = deckById(id); if(!d) return;
  d.unlocked = true; d.due = Math.max(d.due, Math.round(d.total*0.5));
  toast(`Deck liberado: ${d.name} 🎉`,'success','🔓');
  confetti({ count:90, y: innerHeight*0.4 });
  render();
}

function startStudy(mode, payload){
  if(mode==='daily'){ App.s.studySource = { mode, label:'Revisão do dia' }; }
  else if(mode==='deck'){ const d=deckById(payload); App.s.studySource = { mode, label:d?d.name:'Deck', deckId:payload, s:d?d.s:null }; }
  else if(mode==='exam'){ const ex=EXAMS.find(e=>e.id===payload); App.s.studySource = { mode, label:'Simulado '+(ex?ex.name:''), exam:payload }; }
  App.s.deck = [];
  go('game');
}

// ---------- recompensas: helpers ----------
function listFor(type){ return type==='avatar'?AVATARS : type==='frame'?FRAMES : type==='color'?COLORS : type==='theme'?THEMES : type==='title'?TITLES : UTILITIES; }
function itemFor(type,id){ return listFor(type).find(x=>x.id===id); }
function isOwned(type,id){ return (App.s.owned[type]||[]).includes(id); }

// avatar do usuário (personagem + cor + moldura equipados)
function avatarHTML(size){
  const e = App.s.equipped;
  const av = AVATARS.find(a=>a.id===e.avatar) || AVATARS[0];
  const fr = FRAMES.find(f=>f.id===e.frame) || FRAMES[0];
  const ring = fr.color ? `box-shadow:0 0 0 3px #fff, 0 0 0 6px ${fr.color}${fr.glow?`, 0 0 14px ${fr.color}`:''};` : '';
  return `<span class="av" style="width:${size}px;height:${size}px;background:${e.color};font-size:${Math.round(size*0.55)}px;${ring}">${av.emoji}</span>`;
}
function equippedTitle(){ const t=TITLES.find(x=>x.id===App.s.equipped.title); return t&&t.id!=='none'?t.name:''; }

function buyItem(type,id){
  const it = itemFor(type,id); if(!it) return;
  if(it.cost===null||it.cost===undefined){ toast('Esse item é só por conquista 🏆','brand','🔒'); return; }
  if(type!=='util' && isOwned(type,id)){ equipItem(type,id); return; }
  if(App.s.gems < it.cost){ toast('Gems insuficientes — estude pra ganhar mais 💎','warn','💎'); return; }
  App.s.gems -= it.cost;
  if(type==='util'){ App.s.inventory[id] = (App.s.inventory[id]||0)+ (id==='dica'?5:1); toast('Comprado: '+it.name,'success','✅'); }
  else {
    (App.s.owned[type]=App.s.owned[type]||[]).push(id);
    App.s.equipped[type] = id;            // equipa automaticamente
    if(type==='theme') applyTheme();
    const rare = it.rarity==='epico'||it.rarity==='lendario';
    toast('Desbloqueado: '+(it.name||id)+(rare?' 🎉':''),'success','🎁');
    if(rare) confetti({count:120,y:innerHeight*0.4});
  }
  render();
}
function equipItem(type,id){
  if(!isOwned(type,id)){ toast('Você ainda não tem esse item','warn','🔒'); return; }
  App.s.equipped[type] = id;
  if(type==='theme') applyTheme();
  toast('Equipado!','success','✨');
  render();
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
        <div class="flip-illo"><div class="fi-card fi-back"></div><div class="fi-card fi-front"><span>?</span></div></div>
        ${LogoBig(58)}
        <div class="h2" style="margin-top:6px">Vira o card. Vira o jogo.</div>
        <p class="muted" style="max-width:300px;font-weight:700;">O app de flashcards pra quem vai passar no ENEM e no vestibular. Estudar com gamificação, IA e foco no que importa.</p>
      </div>
      <div style="display:flex;gap:22px;margin-top:8px;position:relative;z-index:2;">
        <div class="tcenter"><div class="h2">🔥</div><div class="tiny b muted">Streaks</div></div>
        <div class="tcenter"><div class="h2">🏆</div><div class="tiny b muted">Ligas</div></div>
        <div class="tcenter"><div class="h2">🗺️</div><div class="tiny b muted">Jornada</div></div>
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
// ONBOARDING
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
  { id:'50',  emoji:'☕', t:'50 cards / dia',  d:'Casual' },
  { id:'100', emoji:'🎯', t:'100 cards / dia', d:'Regular (recomendado)' },
  { id:'200', emoji:'🔥', t:'200 cards / dia', d:'Sério' },
  { id:'300', emoji:'🚀', t:'300 cards / dia', d:'Intenso' },
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
  App.s.goal = onbGoalLabel();
  if(App.s.onb_time) App.s.dailyGoalCards = parseInt(App.s.onb_time,10);
  if(App.s.onb_goalKind==='uni'){ const m=EXAMS.find(e=>String(App.s.onb_goalText).toLowerCase().includes(e.id)||String(App.s.onb_goalText).toUpperCase().includes(e.sigla)); if(m){ App.s.exam=m.id; App.s.examReviewSel=m.id; } }
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
    const k = s.onb_goalKind; let extra='';
    if(k==='uni' || k==='curso'){
      const list = k==='uni'?UNI_SUGGEST:CURSO_SUGGEST;
      const ph = k==='uni'?'Digite a universidade (ex.: UFSC)':'Digite o curso (ex.: Veterinária)';
      extra = `<div class="onb-input-wrap slide-in">
          <div class="tiny faint b">${k==='uni'?'Qual universidade?':'Qual curso?'}</div>
          <input class="onb-input" data-model="onb_goalText" value="${esc(s.onb_goalText)}" placeholder="${ph}" />
          <div class="row wrap gap8 mt8">${list.map(x=>`<button class="opt-chip ${s.onb_goalText===x?'on':''}" data-act="onb-suggest" data-val="${esc(x)}">${x}</button>`).join('')}</div>
        </div>`;
    }
    body = `<div class="col gap10">${GOAL_KINDS.map(o=>`
        <button class="choice ${k===o.id?'sel':''}" data-act="onb-pick" data-val="${o.id}">
          <div class="emoji">${o.emoji}</div><div class="col"><div class="b9" style="font-size:16px">${o.t}</div><div class="small muted">${o.d}</div></div>
          <div class="grow"></div><div style="font-size:20px;color:var(--roxo-500)">${k===o.id?'✓':''}</div></button>`).join('')}</div>${extra}`;
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
    <div style="padding:8px 22px 0;"><div class="eyebrow">Passo ${step+1} de 3</div><div class="h2 mt4">${title}</div><p class="muted b mt4">${sub}</p></div>
    <div class="scroll" style="flex:1;padding:18px 22px;">${body}</div>
    <div class="section"><button class="btn btn-roxo btn-block btn-lg" id="onb-next" data-act="onb-next" ${onbCanContinue()?'':'disabled'}>${step<2?'Continuar':'Criar meu perfil'}</button></div>
  </div>`;
}

// =========================================================================
// HOME — loop diário + missões + teaser da jornada
// =========================================================================
function Home(){
  const s = App.s;
  const due = dueToday();
  const pct = Math.min(100, Math.round(s.cardsToday / s.dailyGoalCards * 100));
  const tier = TIERS.find(t=>t.id===LEVEL.tier);
  const lvlPct = Math.round(LEVEL.xpInLevel/LEVEL.xpForNext*100);
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

    <!-- Meta diária -->
    <div class="section">
      <div class="card pad">
        <div class="row between">
          <div><div class="eyebrow">Meta de hoje</div><div class="h3">${s.cardsToday} / ${s.dailyGoalCards} cards</div></div>
          <div class="pill ${pct>=100?'green':''}">${pct>=100?'Concluída! 🎉':pct+'%'}</div>
        </div>
        <div class="bar mt12"><span style="width:${pct}%"></span></div>
        <div class="row between mt8">
          <span class="small muted b">Objetivo: <b style="color:var(--roxo-700)">${esc(s.goal)}</b></span>
          <span class="small b" style="color:var(--laranja-600)">🔥 ${s.streak} dias seguidos</span>
        </div>
      </div>
    </div>

    <!-- CTA principal: revisão do dia -->
    <div class="section">
      <div class="card pad" style="background:var(--grad-brand);border:none;color:#fff">
        <div class="row between">
          <div><div class="tiny b" style="opacity:.9;text-transform:uppercase;letter-spacing:.5px">Revisão do dia</div>
            <div class="h2" style="color:#fff">${due} cards te esperam</div>
            <div class="small" style="opacity:.92;font-weight:700">Mix inteligente dos seus decks liberados</div></div>
          <div style="font-size:40px">🎴</div>
        </div>
        <button class="btn btn-amarelo btn-block btn-lg mt12" data-act="start-daily">▶ Estudar agora</button>
      </div>
      <button class="btn btn-outline btn-block btn-sm mt12" data-act="go" data-route="decks">Escolher um deck específico</button>
    </div>

    <!-- Missões diárias -->
    <div class="section">
      <div class="row between"><div class="b9">Missões de hoje</div><span class="pill gray small">Renova em 8h</span></div>
      <div class="col gap8 mt8">
        ${DAILY_QUESTS.map(q=>{ const p=Math.min(100,Math.round(q.cur/q.goal*100)); const done=q.done||q.cur>=q.goal;
          return `<div class="card pad" style="padding:12px">
            <div class="row gap10">
              <div style="font-size:24px">${q.ic}</div>
              <div class="grow"><div class="row between"><span class="b small">${q.t}</span><span class="pill ${done?'green':'gray'} small">${q.reward}</span></div>
                <div class="bar thin mt4"><span style="width:${p}%"></span></div>
                <div class="tiny faint b mt4">${done?'Concluída ✅':q.cur+' / '+q.goal}</div></div>
            </div></div>`; }).join('')}
      </div>
    </div>

    <!-- Teaser da Jornada -->
    <div class="section">
      <div class="card pad" style="cursor:pointer" data-act="go" data-route="jornada">
        <div class="row gap12">
          <div class="tier-badge" style="background:${tier.color}1a;color:${tier.color}">${tier.icon}</div>
          <div class="grow"><div class="row between"><span class="b9">Nível ${LEVEL.current} · ${tier.name}</span><span class="link small">ver jornada →</span></div>
            <div class="bar roxo thin mt8"><span style="width:${lvlPct}%"></span></div>
            <div class="tiny faint b mt4">${LEVEL.xpForNext-LEVEL.xpInLevel} XP para o próximo nível 🎁</div></div>
        </div>
      </div>
    </div>

    <!-- Desafio social -->
    <div class="section">
      <div class="card pad">
        <div class="row gap12">
          <span class="accent-ic" style="background:var(--laranja-100);color:var(--laranja-600)">⚔️</span>
          <div class="grow"><div class="b9">Desafio de Ana</div><div class="small muted b">20 cards de Biologia · faltam 4h</div></div>
          <button class="btn btn-outline btn-sm" data-act="start-daily">Aceitar</button></div>
      </div>
    </div>
    <div class="empty-space"></div>
  </div>`;
}

// =========================================================================
// DECKS — catálogo + meus decks + revisão do dia (personalização nova)
// =========================================================================
function Decks(){
  const s = App.s;
  const mine = unlockedDecks();
  const due = dueToday();
  const goals = [50,100,200,300];
  // catálogo agrupado por matéria → submatéria
  const byMat = {};
  DECKS.forEach(d=>{ (byMat[d.s]=byMat[d.s]||{}); (byMat[d.s][d.sub]=byMat[d.s][d.sub]||[]).push(d); });

  return `
  <div>
    <div class="topbar"><div class="h3">Decks</div></div>
    <p class="hr-pad muted b small" style="margin-top:-4px">Libere os temas conforme estuda — eles entram na revisão diária.</p>

    <!-- meta diária -->
    <div class="section" style="padding-top:12px">
      <div class="card pad">
        <div class="row between"><span class="b9">Minha meta diária</span><span class="pill">${s.dailyGoalCards} cards/dia</span></div>
        <div class="row wrap gap8 mt8">
          ${goals.map(g=>`<button class="opt-chip ${s.dailyGoalCards===g?'on':''}" data-act="set-goal" data-goal="${g}">${g}</button>`).join('')}
        </div>
      </div>
    </div>

    <!-- revisão do dia -->
    <div class="section">
      <div class="card pad" style="background:var(--grad-brand);border:none;color:#fff">
        <div class="row between"><div><div class="tiny b" style="opacity:.9;text-transform:uppercase">Revisão do dia</div>
          <div class="h2" style="color:#fff">${due} cards</div></div><div style="font-size:36px">🎴</div></div>
        <button class="btn btn-amarelo btn-block mt12" data-act="start-daily">Estudar revisão do dia</button>
      </div>
    </div>

    <!-- sugestão IA -->
    <div class="section">
      <div class="ai-card"><div class="spark">✨</div>
        <div class="pill" style="background:rgba(255,255,255,.18);color:#fff">🤖 Sugestão da IA</div>
        <div class="b9 mt8" style="color:#fff;font-size:16px">Libere estes para o seu objetivo (${esc(s.goal)})</div>
        <div class="col gap8 mt12">
          ${DECK_SUGGESTIONS.map(id=>{ const d=deckById(id); if(!d||d.unlocked) return ''; const sj=SUBJECTS[d.s];
            return `<div class="row gap10" style="background:rgba(255,255,255,.12);border-radius:12px;padding:9px 11px">
              <span style="font-size:18px">${sj.emoji}</span>
              <div class="grow"><div class="b small" style="color:#fff">${d.name}</div><div class="tiny" style="opacity:.8;color:#fff">${sj.name} · ${d.total} cards</div></div>
              <button class="btn btn-amarelo btn-sm" data-act="unlock-deck" data-deck="${d.id}">Liberar</button></div>`; }).join('')||'<div class="small" style="opacity:.9;color:#fff">Tudo liberado! 🎉</div>'}
        </div>
      </div>
    </div>

    <!-- meus decks -->
    <div class="section">
      <div class="row between"><div class="b9">Meus decks (${mine.length})</div></div>
      <div class="col gap8 mt8">
        ${mine.length ? mine.map(d=>{ const sj=SUBJECTS[d.s]; const p=Math.round(d.mastered/d.total*100);
          return `<div class="card pad" style="padding:13px;cursor:pointer" data-act="study-deck" data-deck="${d.id}">
            <div class="row gap10">
              <div class="subj-ic" style="background:${sj.color}1a;color:${sj.color}">${sj.emoji}</div>
              <div class="grow"><div class="row between"><span class="b small">${d.name}</span>${d.due?`<span class="pill orange small">${d.due} p/ revisar</span>`:`<span class="pill green small">em dia</span>`}</div>
                <div class="tiny faint b">${sj.name} · ${d.sub}</div>
                <div class="bar thin mt4"><span style="width:${p}%"></span></div>
                <div class="tiny faint b mt4">${d.mastered}/${d.total} dominados</div></div>
            </div></div>`; }).join('') : `<div class="card pad tcenter muted b small">Você ainda não liberou decks. Explore o catálogo abaixo 👇</div>`}
      </div>
    </div>

    <!-- catálogo -->
    <div class="section">
      <div class="b9">Catálogo completo</div>
      <p class="tiny faint b">Banco com milhares de flashcards de todos os conteúdos.</p>
      ${Object.keys(byMat).map(sid=>{ const sj=SUBJECTS[sid];
        return `<div class="cat-mat mt12">
          <div class="row gap8" style="align-items:center"><div class="subj-ic" style="background:${sj.color}1a;color:${sj.color};width:32px;height:32px;font-size:17px">${sj.emoji}</div><span class="b9">${sj.name}</span></div>
          ${Object.keys(byMat[sid]).map(sub=>`
            <div class="cat-sub"><div class="tiny faint b" style="text-transform:uppercase;letter-spacing:.5px;margin:10px 0 4px">${sub}</div>
              ${byMat[sid][sub].map(d=>`
                <div class="deck-row">
                  <div class="grow"><div class="b small">${d.name}</div><div class="tiny faint b">${d.total} cards${d.unlocked?` · ${d.mastered} dominados`:''}</div></div>
                  ${d.unlocked ? `<span class="pill green small">✓ Liberado</span>` : `<button class="btn btn-ghost btn-sm" data-act="unlock-deck" data-deck="${d.id}">＋ Liberar</button>`}
                </div>`).join('')}
            </div>`).join('')}
        </div>`; }).join('')}
    </div>
    <div class="empty-space"></div>
  </div>`;
}

// =========================================================================
// JORNADA — mapa de níveis (Candy Crush / só gamificação)
// =========================================================================
function Jornada(){
  const tier = TIERS.find(t=>t.id===LEVEL.tier);
  const lvlPct = Math.round(LEVEL.xpInLevel/LEVEL.xpForNext*100);
  const curTierIdx = TIERS.findIndex(t=>t.id===LEVEL.tier);
  // ícone do nó por tipo
  const nodeIcon = (n)=> n.type==='chest'?'🎁': n.type==='badge'?'🏅': n.type==='tier'?'👑': n.lvl;
  return `
  <div>
    <!-- header de tier -->
    <div class="jornada-head" style="background:linear-gradient(135deg,${tier.color},#4C1D95)">
      <div style="font-size:50px">${tier.icon}</div>
      <div class="h2" style="color:#fff">Liga ${tier.name} · Nível ${LEVEL.current}</div>
      <div class="bar thin mt8" style="max-width:240px;margin:8px auto 0;background:rgba(255,255,255,.25)"><span style="width:${lvlPct}%;background:#fff"></span></div>
      <p class="small mt8" style="opacity:.92;font-weight:800">${LEVEL.xpInLevel}/${LEVEL.xpForNext} XP · faltam ${LEVEL.xpForNext-LEVEL.xpInLevel} para subir</p>
    </div>

    <!-- trilha de tiers -->
    <div class="section" style="padding-top:14px">
      <div class="tier-track">
        ${TIERS.map((t,i)=>`<div class="tier-step ${i<curTierIdx?'past':i===curTierIdx?'now':''}">
          <div class="tier-dot" style="${i<=curTierIdx?`background:${t.color};color:#fff`:''}">${t.icon}</div>
          <div class="tiny b ${i===curTierIdx?'':'faint'}">${t.name}</div></div>`).join('')}
      </div>
    </div>

    <!-- mapa de fases -->
    <div class="section">
      <div class="card pad" style="background:linear-gradient(180deg,#FBFAFE,#F5F3FF);overflow:hidden">
        <div class="b9 tcenter">Sua jornada</div>
        <p class="tiny faint b tcenter">Cada nível rende XP, baús e conquistas.</p>
        <div class="jpath">
          ${JOURNEY.slice().reverse().map((n,i)=>{ const off=[0,40,60,40,0,-40,-60,-40][i%8]||0;
            return `<div class="jnode ${n.type} ${n.state}" style="transform:translateX(${off}px)">
              ${n.state==='current'?`<div class="jflag">${avatarHTML(26)} VOCÊ</div>`:''}
              <div class="jbubble">${nodeIcon(n)}</div>
              <div class="jlabel">${n.label}</div>
            </div>`; }).join('')}
        </div>
      </div>
    </div>

    <!-- próximas recompensas -->
    <div class="section">
      <div class="b9">Próximas recompensas</div>
      <div class="col gap8 mt8">
        <div class="ach"><div class="medal" style="background:#FACC151a">🎁</div><div class="grow"><div class="b9">Baú surpresa (Nível 15)</div><div class="small muted">Pode vir gems, avatar ou freeze de streak</div></div><span class="pill small">próximo</span></div>
        <div class="ach"><div class="medal" style="background:#06B6D41a">💎</div><div class="grow"><div class="b9">Liga Diamante (Nível 17)</div><div class="small muted">Novo emblema + tema exclusivo</div></div></div>
        <div class="ach"><div class="medal" style="background:#A855F71a">🏆</div><div class="grow"><div class="b9">500 cards dominados</div><div class="small muted">Conquista "Cérebro de Aço"</div></div></div>
      </div>
    </div>
    <div class="empty-space"></div>
  </div>`;
}

// =========================================================================
// PRÊMIOS — Meu Avatar / Loja / Coleção
// =========================================================================
function prizeVisual(type,it){
  if(type==='avatar') return `<span class="av" style="width:46px;height:46px;background:#F1EFF6;font-size:26px">${it.emoji}</span>`;
  if(type==='util')   return `<span class="av" style="width:46px;height:46px;background:#F1EFF6;font-size:24px">${it.emoji}</span>`;
  if(type==='title')  return `<span class="av" style="width:46px;height:46px;background:#F1EFF6;font-size:22px">🏷️</span>`;
  if(type==='frame')  return `<span class="prize-ring" style="${it.color?`box-shadow:0 0 0 3px #fff,0 0 0 6px ${it.color}${it.glow?`,0 0 12px ${it.color}`:''}`:'border:2px dashed #CBD5E1'}"></span>`;
  if(type==='color')  return `<span class="prize-dot" style="background:${it.id}"></span>`;
  if(type==='theme'){ const g={default:'linear-gradient(135deg,#7C3AED,#DB2777)',ocean:'linear-gradient(135deg,#0EA5E9,#14B8A6)',sunset:'linear-gradient(135deg,#FB923C,#EC4899)',neon:'linear-gradient(135deg,#22D3EE,#A855F7)'}[it.id]||'#7C3AED'; return `<span class="prize-theme" style="background:${g}"></span>`; }
  return '';
}
function prizeCard(type,it){
  const owned = type!=='util' && isOwned(type,it.id);
  const eq = type!=='util' && App.s.equipped[type]===it.id;
  const rar = RARITY[it.rarity]||RARITY.comum;
  let btn;
  if(type==='util') btn=`<button class="btn btn-amarelo btn-sm" data-act="buy-item" data-type="util" data-id="${it.id}">${it.cost} 💎</button>`;
  else if(eq) btn=`<span class="pill green small">Equipado ✓</span>`;
  else if(owned) btn=`<button class="btn btn-outline btn-sm" data-act="equip-item" data-type="${type}" data-id="${it.id}">Equipar</button>`;
  else if(it.cost===null) btn=`<span class="pill outline small">🔒</span>`;
  else btn=`<button class="btn btn-amarelo btn-sm" data-act="buy-item" data-type="${type}" data-id="${it.id}">${it.cost} 💎</button>`;
  const sub = type==='util' ? it.desc : (rar.name + (!owned&&it.cost===null&&it.unlock ? ' · '+it.unlock : ''));
  return `<div class="prize">
    <div class="prize-vis">${prizeVisual(type,it)}</div>
    <div class="grow"><div class="b small">${it.name}</div><div class="tiny b" style="color:${type==='util'?'var(--ink-faint)':rar.color}">${sub}</div></div>
    ${btn}</div>`;
}

function Premios(){
  const s = App.s, tab = s.shopTab;
  const seg = `<div class="seg">
    <button class="${tab==='avatar'?'on':''}" data-act="shop-tab" data-tab="avatar">Meu Avatar</button>
    <button class="${tab==='loja'?'on':''}" data-act="shop-tab" data-tab="loja">Loja</button>
    <button class="${tab==='colecao'?'on':''}" data-act="shop-tab" data-tab="colecao">Coleção</button>
  </div>`;

  let body='';
  if(tab==='avatar'){
    const cat=(label,type,list)=>`<div class="mt16"><div class="eyebrow">${label}</div>
      <div class="col gap8 mt8">${list.filter(it=>isOwned(type,it.id)).map(it=>prizeCard(type,it)).join('')}
        <button class="btn btn-ghost btn-block btn-sm" data-act="shop-tab" data-tab="loja">＋ Desbloquear mais na Loja</button></div></div>`;
    body = `
      <div class="tcenter" style="padding:8px 0 4px">
        ${avatarHTML(104)}
        <div class="h3 mt8">${esc(STUDENT.name)}</div>
        ${equippedTitle()?`<div class="pill mt4" style="display:inline-flex">🏷️ ${equippedTitle()}</div>`:`<div class="tiny faint b mt4">sem título equipado</div>`}
      </div>
      ${cat('Personagem','avatar',AVATARS)}
      ${cat('Moldura','frame',FRAMES)}
      ${cat('Cor de fundo','color',COLORS)}
      ${cat('Título','title',TITLES)}
      ${cat('Tema do app','theme',THEMES)}`;
  }
  else if(tab==='loja'){
    const sec=(label,type,list)=>`<div class="mt16"><div class="eyebrow">${label}</div><div class="col gap8 mt8">${list.filter(it=>!(type!=='util'&&it.cost===0)).map(it=>prizeCard(type,it)).join('')}</div></div>`;
    body = `
      <div class="ai-card" style="background:linear-gradient(135deg,#312E81,#6D28D9)"><div class="spark">💎</div>
        <div class="b9" style="color:#fff;font-size:16px">Como ganhar gems?</div>
        <div class="small mt4" style="opacity:.92;color:#fff;font-weight:700">Batendo a meta diária, completando missões, abrindo baús da Jornada e subindo de liga. Tudo de graça — nada de pay-to-win. 💪</div>
      </div>
      ${sec('Personagens','avatar',AVATARS)}
      ${sec('Molduras','frame',FRAMES)}
      ${sec('Cores','color',COLORS)}
      ${sec('Temas do app','theme',THEMES)}
      ${sec('Títulos','title',TITLES)}
      ${sec('Utilidades','util',UTILITIES)}`;
  }
  else { // coleção
    const cats=[['Personagens','avatar',AVATARS],['Molduras','frame',FRAMES],['Cores','color',COLORS],['Temas','theme',THEMES],['Títulos','title',TITLES]];
    body = cats.map(([label,type,list])=>{
      const own=list.filter(it=>isOwned(type,it.id)).length;
      const grid=list.map(it=>{ const owned=isOwned(type,it.id); const rar=RARITY[it.rarity]||RARITY.comum;
        return `<div class="coll-item ${owned?'':'locked'}" title="${esc(it.name)}" style="border-color:${owned?rar.color:'var(--line)'}">
          ${prizeVisual(type,it)}<div class="tiny b" style="color:${owned?rar.color:'var(--ink-faint)'}">${owned?it.name.split(' ')[0]:'🔒'}</div></div>`; }).join('');
      return `<div class="mt16"><div class="row between"><div class="eyebrow">${label}</div><span class="pill gray small">${own}/${list.length}</span></div>
        <div class="coll-grid mt8">${grid}</div></div>`;
    }).join('');
  }

  return `
  <div>
    <div class="topbar"><div class="h3">Prêmios</div><span class="tag-stat tag-gem">💎 ${s.gems}</span></div>
    <p class="hr-pad muted b small" style="margin-top:-4px">Desbloqueie itens com gems. Tudo conquistável de graça.</p>
    <div class="section" style="padding-top:12px">${seg}</div>
    <div class="section" style="padding-top:0">${body}</div>
    <div class="empty-space"></div>
  </div>`;
}

// =========================================================================
// GAME
// =========================================================================
function startDeck(){
  const src = App.s.studySource || { mode:'daily' };
  let pool;
  if(src.mode==='deck' && src.s){ pool = CARDS.filter(c=>c.s===src.s); }
  else if(src.mode==='daily'){ const subs=[...new Set(unlockedDecks().map(d=>d.s))]; pool = CARDS.filter(c=>subs.includes(c.s)); }
  else { pool = CARDS.slice(); } // exam: banco inteiro (ponderado, conceitual)
  if(pool.length < 5) pool = CARDS.slice();
  pool = pool.slice().sort(()=>Math.random()-0.5).slice(0,8);
  App.s.deck = pool.map(c=>({ ...c }));
  App.s.deckIndex=0; App.s.revealed=false; App.s.combo=0;
  App.s.sessionCorrect=0; App.s.sessionTotal=0; App.s.sessionXp=0;
}

function Game(){
  if(!App.s.deck.length) startDeck();
  const idx = App.s.deckIndex, card = App.s.deck[idx], subj = SUBJECTS[card.s];
  const pct = Math.round(idx / App.s.deck.length * 100);
  const flipped = App.s.revealed;
  const srcLabel = (App.s.studySource && App.s.studySource.label) || 'Estudando';
  return `
  <div class="game">
    <div class="game-top">
      <button class="icon-btn" data-act="quit" style="background:#F1EFF6;color:var(--ink-soft)">✕</button>
      <div class="grow"><div class="tiny faint b" style="text-align:center;margin-bottom:3px">${srcLabel}</div><div class="bar"><span style="width:${pct}%"></span></div></div>
      <span class="pill small">${idx+1}/${App.s.deck.length}</span>
    </div>
    ${App.s.combo>=2?`<div class="combo show">🔥 Combo x${App.s.combo}</div>`:''}
    <div class="card-area">
      <div class="flashcard ${flipped?'flipped':''}" ${flipped?'':'data-act="reveal"'}>
        <div class="face front">
          <span class="subject-tag pill" style="background:${subj.color}1a;color:${subj.color}">${subj.emoji} ${subj.name} · ${card.sub}</span>
          <div class="q">${card.q}</div><div class="flip-hint">👆 Toque para ver a resposta</div>
        </div>
        <div class="face back">
          <span class="a-label">Resposta</span><div class="q" style="font-size:19px;font-weight:700">${card.a}</div>
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
  App.s.sessionTotal++; App.s.cardsToday++;
  if(correct){
    App.s.sessionCorrect++; App.s.combo++;
    const base = rating===3?12:10, bonus=Math.min(App.s.combo,5)*2, gain=base+bonus;
    App.s.sessionXp += gain; floatXp(gain, btn);
    if(App.s.combo>=3) toast(`Combo x${App.s.combo}! +${bonus} XP de bônus 🔥`,'warn','🔥');
  } else { App.s.combo=0; toast('Tranquilo — esse volta logo pra você revisar 💪','brand','📌'); }
  App.s.deckIndex++; App.s.revealed=false;
  if(App.s.deckIndex >= App.s.deck.length){ App.s.xp += App.s.sessionXp; go('complete'); }
  else render();
}

// =========================================================================
// COMPLETE
// =========================================================================
function Complete(){
  const acc = App.s.sessionTotal ? Math.round(App.s.sessionCorrect/App.s.sessionTotal*100) : 0;
  const perfect = acc===100;
  const pct = Math.min(100, Math.round(App.s.cardsToday/App.s.dailyGoalCards*100));
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
      <div class="row between"><span class="b">Meta diária</span><span class="b" style="color:var(--roxo-700)">${App.s.cardsToday}/${App.s.dailyGoalCards} cards</span></div>
      <div class="bar mt8"><span style="width:${pct}%"></span></div>
    </div>
    <div style="width:100%;margin-top:20px;display:flex;flex-direction:column;gap:10px">
      <button class="btn btn-verde btn-block btn-lg" data-act="start-daily">Continuar estudando</button>
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
        <button class="${tab==='geral'?'on':''}" data-act="rank-tab" data-tab="geral">Geral</button>
        <button class="${tab==='prova'?'on':''}" data-act="rank-tab" data-tab="prova">Por prova</button>
        <button class="${tab==='escola'?'on':''}" data-act="rank-tab" data-tab="escola">Escola</button>
      </div>
      <p class="tiny faint mt8 tcenter">${tab==='geral'?'Todos os estudantes da Flipei':tab==='prova'?'Quem está focado no ENEM como você':'Alunos do '+STUDENT.school}</p>
    </div>
    <div class="section" style="display:flex;flex-direction:column;gap:9px;">
      ${list.map((u,i)=>{ const pos=i+1, top=pos<=3?'top'+pos:'', medal=pos===1?'🥇':pos===2?'🥈':pos===3?'🥉':pos;
        const html=`<div class="rank-row ${u.me?'me':''} ${top}">
          <div class="rank-pos">${medal}</div>
          ${u.me ? avatarHTML(40) : `<div class="avatar" style="background:${u.av};width:40px;height:40px;font-size:15px">${u.name[0]}</div>`}
          <div class="grow"><div class="b9">${u.name}${u.me?' <span class="pill" style="padding:2px 8px;font-size:11px">você</span>':''}</div>
            <div class="tiny faint b">${u.me&&equippedTitle()?equippedTitle():'Nível '+(14-i>0?14-i:1)}</div></div>
          <div class="tag-stat tag-xp" style="font-size:14px">${u.xp.toLocaleString('pt-BR')}</div></div>`;
        return pos===promoteAt ? `${html}<div class="promo-line">Zona de promoção ⬆️</div>` : html;
      }).join('')}
    </div>
    <div class="empty-space"></div>
  </div>`;
}

// =========================================================================
// PROFILE — dashboard + revisão por prova + vínculo escola
// =========================================================================
function Profile(){
  const s = App.s;
  const subjData = STUDENT.bySubject.map(x=>({ l:SUBJECTS[x.s].name, v:x.acc, color:SUBJECTS[x.s].color }));
  const weekData = STUDENT.weeklyXp.map((v,i)=>({ l:['S','T','Q','Q','S','S','D'][i], v }));
  const linked = s.linkedSchool;
  const sel = s.examReviewSel;
  const weights = EXAM_WEIGHTS[sel] || [];
  return `
  <div>
    <div style="background:var(--grad-brand);padding:22px 18px 26px;color:#fff;border-radius:0 0 26px 26px;">
      <div class="row between">
        <div class="row gap12">${avatarHTML(56)}
          <div><div class="h3" style="color:#fff">${STUDENT.name}</div>
            ${equippedTitle()?`<div class="small" style="opacity:.95;font-weight:800">🏷️ ${equippedTitle()}</div>`:''}
            <div class="tiny" style="opacity:.85;font-weight:800">${STUDENT.handle}${linked?' · '+esc(linked):''}</div></div></div>
        <button class="icon-btn" style="background:rgba(255,255,255,.18);color:#fff" data-act="go" data-route="premios">🎁</button>
      </div>
      <div class="row gap8 mt16">
        <div class="grow tcenter" style="background:rgba(255,255,255,.14);border-radius:14px;padding:10px"><div class="h3" style="color:#fff">🔥 ${s.streak}</div><div class="tiny b" style="opacity:.9">dias</div></div>
        <div class="grow tcenter" style="background:rgba(255,255,255,.14);border-radius:14px;padding:10px"><div class="h3" style="color:#fff">${s.xp.toLocaleString('pt-BR')}</div><div class="tiny b" style="opacity:.9">XP total</div></div>
        <div class="grow tcenter" style="background:rgba(255,255,255,.14);border-radius:14px;padding:10px"><div class="h3" style="color:#fff">${STUDENT.leagueIcon}</div><div class="tiny b" style="opacity:.9">Liga ${STUDENT.league}</div></div>
      </div>
    </div>

    <!-- Revisão rápida por prova -->
    <div class="section" style="padding-top:16px">
      <div class="card pad">
        <div class="b9">Revisão rápida por prova</div>
        <p class="tiny faint b">Puxa do banco inteiro, ponderado pela incidência de cada prova (edital + provas anteriores).</p>
        <div class="row wrap gap8 mt8">
          ${EXAMS.filter(e=>EXAM_WEIGHTS[e.id]).map(e=>`<button class="opt-chip ${sel===e.id?'on':''}" data-act="exam-pick" data-exam="${e.id}">${e.name}</button>`).join('')}
        </div>
        <div class="mt12">${hBars(weights.map(w=>({l:w.l, v:w.pct, color:SUBJECTS[w.s].color})), { labelW:150 })}</div>
        <button class="btn btn-roxo btn-block mt8" data-act="start-exam">▶ Iniciar revisão ponderada</button>
      </div>
    </div>

    <!-- Vínculo escola -->
    <div class="section">
      ${linked ? `
        <div class="card pad" style="border-color:var(--verde-300);background:var(--verde-100)">
          <div class="row gap12"><div style="font-size:30px">🏫</div>
            <div class="grow"><div class="b9">Conectado a ${esc(linked)}</div><div class="small muted b">Sua escola acompanha seu progresso. Ela vê desempenho — nunca interfere no seu app.</div></div>
            <button class="btn btn-outline btn-sm" data-act="unlink">Desvincular</button></div>
        </div>` : `
        <div class="card pad" style="border:2px dashed var(--roxo-300);background:var(--roxo-50)">
          <div class="row gap12"><div style="font-size:30px">🏫</div>
            <div class="grow"><div class="b9">Sua escola é parceira Flipei?</div><div class="small muted b">Peça o <b>código do professor</b> e conecte sua conta. Você continua usando o app livremente.</div></div></div>
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
      <div class="row between"><div class="b9">Evolução de XP</div><span class="pill green small">↑ esta semana</span></div>
      ${barChart(weekData,{h:170,values:true})}
    </div></div>

    <div class="section"><div class="card pad">
      <div class="b9">Acerto por matéria</div><p class="tiny faint b">Onde você brilha e onde precisa de reforço.</p>
      <div class="mt8">${hBars(subjData,{})}</div>
      <div class="insight mt12" style="border-color:var(--laranja-500);background:var(--laranja-100)"><span class="small b" style="color:var(--laranja-600)">Física (59%) é seu ponto mais fraco. Que tal liberar o deck "Leis de Newton"?</span></div>
    </div></div>

    <div class="section"><div class="card pad">
      <div class="row between"><div class="b9">Constância</div><span class="small b muted">${s.streak} dias seguidos</span></div>
      <div class="cal mt12">${STUDENT.heat.map(l=>`<div class="d l${l}"></div>`).join('')}</div>
    </div></div>

    <div class="section">
      <div class="row between"><div class="b9">Conquistas</div><span class="link small">ver todas</span></div>
      <div class="col gap8 mt8">
        ${STUDENT.conquistas.map(c=>`<div class="ach ${c.got?'':'locked'}"><div class="medal" style="background:${c.color}1a">${c.ic}</div>
          <div class="grow"><div class="b9">${c.name}</div><div class="small muted">${c.desc}</div></div><div style="font-size:20px">${c.got?'✅':'🔒'}</div></div>`).join('')}
      </div>
    </div>
    <div class="empty-space"></div>
  </div>`;
}

// =========================================================================
// LINK SCHOOL
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
  App.s.linkedSchool = /horizonte/i.test(code) ? 'Colégio Horizonte' : ('Escola '+code.split(/[-\s]/)[0][0].toUpperCase()+code.split(/[-\s]/)[0].slice(1).toLowerCase());
  toast('Conectado a '+App.s.linkedSchool+'! 🎉','success','🏫');
  confetti({count:110, y:innerHeight*0.4});
  go('profile');
}
