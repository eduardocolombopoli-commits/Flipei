/* =========================================================================
   FLIPEI — Portal da ESCOLA (B2B, profissional)
   A escola monitora performance — sem controle sobre o uso do aluno.
   ========================================================================= */

function SchoolPortal(){
  const page = App.s.schoolPage;
  const nav = [
    { id:'dashboard', ic:'📊', t:'Visão Geral' },
    { id:'turmas',    ic:'👥', t:'Turmas' },
    { id:'alunos',    ic:'🎓', t:'Alunos' },
    { id:'dificuldades', ic:'🧩', t:'Dificuldades' },
    { id:'atividades', ic:'📌', t:'Atividades' },
  ];
  let body = '';
  if(page==='dashboard') body = SchoolDashboard();
  else if(page==='turmas') body = SchoolTurmas();
  else if(page==='alunos') body = App.s.detailStudent ? SchoolStudentDetail() : SchoolAlunos();
  else if(page==='dificuldades') body = SchoolDificuldades();
  else if(page==='atividades') body = SchoolAtividades();

  return `
  <div class="portal">
    <aside class="side">
      ${Logo(22)}
      <nav class="nav">
        ${nav.map(n=>`<a class="${page===n.id?'on':''}" data-page="${n.id}"><span class="ic">${n.ic}</span><span class="t">${n.t}</span></a>`).join('')}
      </nav>
      <div class="school-chip">
        <div class="avatar" style="background:var(--roxo-500);width:38px;height:38px;font-size:15px">H</div>
        <div class="col"><span class="b9 small" style="color:#fff">${SCHOOL.name}</span><span class="tiny" style="color:#B8AFD6">${SCHOOL.plan}</span></div>
      </div>
    </aside>

    <main class="portal-main">
      <header class="portal-top">
        <div class="row gap10">
          <span class="h3">${nav.find(n=>n.id===page).t}</span>
          <span class="pill gray small">Semana de 09–15 jun</span>
        </div>
        <div class="row gap12">
          <span class="pill outline small">🔒 Somente leitura — a escola não interfere no app do aluno</span>
          <div class="avatar" style="width:36px;height:36px;font-size:14px;background:var(--roxo-600)">${SCHOOL.admin[6]||'H'}</div>
        </div>
      </header>
      <div class="portal-body scroll"><div class="maxw fade-in">${body}</div></div>
    </main>
  </div>`;
}

function bindSchool(){
  $$('[data-page]').forEach(a=> a.addEventListener('click', ()=>{ App.s.schoolPage=a.dataset.page; App.s.detailStudent=null; render(); }));
  $$('[data-student]').forEach(r=> r.addEventListener('click', ()=>{ App.s.detailStudent=r.dataset.student; App.s.schoolPage='alunos'; render(); }));
  $$('[data-back-alunos]').forEach(b=> b.addEventListener('click', ()=>{ App.s.detailStudent=null; render(); }));
}

// ---- helpers ----
function kpiCard(label, val, delta, up, color){
  return `<div class="pcard">
    <div class="row between"><div class="k">${label}</div>${delta?`<span class="delta ${up?'up':'down'}">${up?'▲':'▼'} ${delta}</span>`:''}</div>
    <div class="v" style="${color?`color:${color}`:''}">${val}</div>
  </div>`;
}
function heatColor(acc){
  if(acc>=80) return '#22C55E'; if(acc>=70) return '#84CC16'; if(acc>=60) return '#FACC15'; if(acc>=50) return '#FB923C'; return '#EF4444';
}
function statusDot(s){ return `<span class="dot ${s}"></span>`; }

// =========================================================================
// DASHBOARD
// =========================================================================
function SchoolDashboard(){
  const k = SCHOOL.kpis;
  const eng = SCHOOL.engajamento14.map((v,i)=>v);
  const matData = SCHOOL.acuraciaMateria.map(m=>({ l:SUBJECTS[m.s].name, v:m.acc, color:heatColor(m.acc) }));
  return `
    <div class="grid-kpi">
      ${kpiCard('Alunos ativos (semana)', k.ativos.v+' <span style="font-size:15px;color:#9690A8">/ '+k.ativos.total+'</span>', k.ativos.delta, k.ativos.up, 'var(--roxo-700)')}
      ${kpiCard('Engajamento', k.engajamento.v, k.engajamento.delta, k.engajamento.up, 'var(--verde-600)')}
      ${kpiCard('Acurácia média', k.acuracia.v, k.acuracia.delta, k.acuracia.up, 'var(--laranja-600)')}
      ${kpiCard('Cards revisados', k.cards.v, k.cards.delta, k.cards.up, 'var(--azul-500)')}
    </div>

    <div class="grid-2" style="margin-top:16px">
      <div class="pcard">
        <div class="row between"><div class="b9">Engajamento diário (14 dias)</div><span class="pill green small">↑ +12% vs. período anterior</span></div>
        <p class="tiny faint b">Alunos que estudaram pelo menos 1 sessão por dia.</p>
        <div class="mt8">${lineChart(eng, { color:'#7C3AED', cssH:200 })}</div>
      </div>
      <div class="pcard">
        <div class="b9">Distribuição de constância</div>
        <p class="tiny faint b">% dos alunos por faixa de streak.</p>
        <div class="row center mt8">${ring(72, { size:150, color:'#7C3AED', label:'72%', sub:'com streak ativo' })}</div>
        <div class="col gap6 mt8">
          <div class="row between small b"><span>🔥 7+ dias</span><span>38%</span></div>
          <div class="row between small b"><span>📚 1–6 dias</span><span>34%</span></div>
          <div class="row between small b muted"><span>😴 Inativos</span><span>28%</span></div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="margin-top:16px">
      <div class="pcard">
        <div class="b9">Acurácia média por matéria</div>
        <p class="tiny faint b">Onde a escola vai bem — e onde precisa de reforço.</p>
        <div class="mt8">${hBars(matData, {})}</div>
      </div>
      <div class="pcard">
        <div class="row between"><div class="b9">⚠️ Precisa de atenção</div><a class="link small" data-page="alunos">ver alunos</a></div>
        <p class="tiny faint b">Queda de engajamento ou desempenho.</p>
        <div class="col gap8 mt8">
          ${SCHOOL.alunos.filter(a=>a.status!=='g').slice(0,4).map(a=>`
            <div class="row gap10" style="padding:9px;border:1px solid #F1F3F9;border-radius:12px;cursor:pointer" data-student="${a.name}">
              <div class="avatar" style="width:34px;height:34px;font-size:13px;background:#94A3B8">${a.name[0]}</div>
              <div class="grow"><div class="b small">${a.name}</div><div class="tiny faint b">${a.turma} · streak ${a.streak} dias</div></div>
              <span class="heat" style="background:${heatColor(a.acc)}1a;color:${heatColor(a.acc)}">${a.acc}%</span>
            </div>`).join('')}
        </div>
        <div class="insight mt12"><span class="small b">💡 7 alunos não estudam há 3+ dias. Considere uma atividade em sala usando a Flipei.</span></div>
      </div>
    </div>
  `;
}

// =========================================================================
// TURMAS
// =========================================================================
function SchoolTurmas(){
  return `
    <div class="grid-kpi">
      ${SCHOOL.turmas.map(t=>`
        <div class="pcard" style="cursor:pointer" data-page="alunos">
          <div class="b9" style="font-size:17px">${t.name}</div>
          <div class="row between mt8"><span class="k">Ativos</span><span class="b">${t.ativos}/${t.alunos}</span></div>
          <div class="bar thin mt4"><span style="width:${t.ativos/t.alunos*100}%"></span></div>
          <div class="row gap16 mt12">
            <div><div class="tiny faint b">Acurácia</div><div class="b9" style="color:${heatColor(t.acc)}">${t.acc}%</div></div>
            <div><div class="tiny faint b">Engajamento</div><div class="b9" style="color:var(--roxo-600)">${t.eng}%</div></div>
          </div>
        </div>`).join('')}
    </div>

    <div class="pcard" style="margin-top:16px">
      <div class="b9">Comparativo entre turmas</div>
      <p class="tiny faint b">Acurácia média por turma.</p>
      <div class="mt8">${barChart(SCHOOL.turmas.map(t=>({l:t.name.replace('º Ano',''),v:t.acc,color:heatColor(t.acc)})),{h:200,values:true})}</div>
    </div>
  `;
}

// =========================================================================
// ALUNOS (lista) + detalhe
// =========================================================================
function SchoolAlunos(){
  return `
    <div class="pcard">
      <div class="row between">
        <div class="row gap10">
          <input placeholder="🔎 Buscar aluno..." style="border:1px solid #E7E9F2;border-radius:12px;padding:9px 14px;font-family:inherit;font-weight:700;font-size:14px;width:240px"/>
          <span class="pill gray small">${SCHOOL.alunos.length} alunos</span>
        </div>
        <div class="legend">
          <span><i style="background:var(--verde-500)"></i>Em dia</span>
          <span><i style="background:var(--amarelo-400)"></i>Atenção</span>
          <span><i style="background:var(--vermelho-500)"></i>Em risco</span>
        </div>
      </div>
      <table class="tbl mt12">
        <thead><tr><th>Aluno</th><th>Turma</th><th>Acurácia</th><th>Streak</th><th>Tempo/sem</th><th>Foco fraco</th><th>Status</th></tr></thead>
        <tbody>
          ${SCHOOL.alunos.map(a=>`
            <tr data-student="${a.name}">
              <td><div class="row gap10"><div class="avatar" style="width:32px;height:32px;font-size:13px;background:${a.status==='g'?'var(--roxo-500)':a.status==='y'?'var(--laranja-500)':'#94A3B8'}">${a.name[0]}</div><span class="b">${a.name}</span></div></td>
              <td class="muted b">${a.turma}</td>
              <td><span class="heat" style="background:${heatColor(a.acc)}1a;color:${heatColor(a.acc)}">${a.acc}%</span></td>
              <td class="b">🔥 ${a.streak}</td>
              <td class="muted b">${Math.round(a.min/60*10)/10}h</td>
              <td class="muted b">${a.foco}</td>
              <td>${statusDot(a.status)} <span class="small b muted">${a.status==='g'?'Em dia':a.status==='y'?'Atenção':'Em risco'}</span></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="tiny faint b mt12">🔒 A escola visualiza desempenho e constância. Não vê conteúdo privado nem interfere na experiência do aluno.</p>
  `;
}

function SchoolStudentDetail(){
  const a = SCHOOL.alunos.find(x=>x.name===App.s.detailStudent) || SCHOOL.alunos[0];
  const subj = STUDENT.bySubject.map(x=>({ l:SUBJECTS[x.s].name, v:x.acc, color:SUBJECTS[x.s].color }));
  const week = STUDENT.weeklyXp.map((v,i)=>({ l:['S','T','Q','Q','S','S','D'][i], v }));
  return `
    <button class="btn btn-outline btn-sm" data-back-alunos>← Voltar para alunos</button>
    <div class="pcard" style="margin-top:14px">
      <div class="row between">
        <div class="row gap12">
          <div class="avatar" style="width:54px;height:54px;font-size:22px;background:var(--roxo-600)">${a.name[0]}</div>
          <div><div class="h3">${a.name}</div><div class="muted b small">${a.turma} · ${SCHOOL.name}</div></div>
        </div>
        <div class="row gap10">
          <span class="tag-stat tag-streak">🔥 ${a.streak} dias</span>
          <span class="heat" style="background:${heatColor(a.acc)}1a;color:${heatColor(a.acc)};font-size:14px;padding:8px 12px">${a.acc}% acerto</span>
        </div>
      </div>
    </div>

    <div class="grid-kpi" style="margin-top:16px">
      ${kpiCard('Tempo na semana', Math.round(a.min/60*10)/10+'h', null, true, 'var(--roxo-700)')}
      ${kpiCard('Cards na semana', (a.min*3), null, true, 'var(--azul-500)')}
      ${kpiCard('Maior dificuldade', a.foco, null, true, 'var(--vermelho-500)')}
      ${kpiCard('Status', a.status==='g'?'Em dia':a.status==='y'?'Atenção':'Em risco', null, true, heatColor(a.acc))}
    </div>

    <div class="grid-2" style="margin-top:16px">
      <div class="pcard">
        <div class="b9">Atividade de XP (semana)</div>
        ${barChart(week,{h:200,values:true})}
      </div>
      <div class="pcard">
        <div class="b9">Acerto por matéria</div>
        <div class="mt8">${hBars(subj,{})}</div>
      </div>
    </div>

    <div class="pcard" style="margin-top:16px">
      <div class="insight"><span class="small b">💡 ${a.name} tem ótima constância, mas ${a.foco!=='—'?a.foco+' está abaixo da média da turma':'desempenho equilibrado'}. Sugestão: indicar um bloco de revisão focado.</span></div>
    </div>
  `;
}

// =========================================================================
// DIFICULDADES (agregado da escola)
// =========================================================================
function SchoolDificuldades(){
  return `
    <p class="muted b">Temas em que a escola mais erra — base para planejar aulas e atividades.</p>
    <div class="grid-2b" style="margin-top:14px">
      ${SCHOOL.dificuldades.map(d=>`
        <div class="pcard">
          <div class="row between">
            <div><span class="pill gray small">${d.mat}</span><div class="h3 mt8">${d.tema}</div></div>
            <div class="tcenter">${ring(d.acc,{size:96,stroke:11,color:heatColor(d.acc),label:d.acc+'%'})}</div>
          </div>
          <div class="row between mt12">
            <span class="small muted b">${d.alunos} alunos com dificuldade</span>
            <button class="btn btn-ghost btn-sm" data-page="atividades">Criar atividade</button>
          </div>
        </div>`).join('')}
    </div>

    <div class="pcard" style="margin-top:16px">
      <div class="insight"><span class="small b">💡 A IA da Flipei cruza o desempenho da turma com a incidência desses temas nas provas. <b>Funções exponenciais</b> caem muito no ENEM e tem só 48% de acerto — prioridade máxima.</span></div>
    </div>
  `;
}

// =========================================================================
// ATIVIDADES (escola propõe usando o app)
// =========================================================================
function SchoolAtividades(){
  return `
    <p class="muted b">A escola pode propor atividades usando a Flipei — e acompanhar a adesão dos alunos.</p>

    <div class="grid-2" style="margin-top:14px">
      <div class="pcard">
        <div class="b9">Nova atividade</div>
        <div class="col gap10 mt12">
          <div><div class="tiny faint b">Título</div><input value="Revisão: Funções exponenciais" style="border:1px solid #E7E9F2;border-radius:12px;padding:10px 14px;font-family:inherit;font-weight:700;width:100%;margin-top:4px"/></div>
          <div class="row gap10">
            <div class="grow"><div class="tiny faint b">Turma</div><input value="3º Ano A, B e C" style="border:1px solid #E7E9F2;border-radius:12px;padding:10px 14px;font-family:inherit;font-weight:700;width:100%;margin-top:4px"/></div>
            <div class="grow"><div class="tiny faint b">Prazo</div><input value="20 jun" style="border:1px solid #E7E9F2;border-radius:12px;padding:10px 14px;font-family:inherit;font-weight:700;width:100%;margin-top:4px"/></div>
          </div>
          <div><div class="tiny faint b">Meta</div>
            <div class="row gap8 mt4"><span class="pill">30 flashcards</span><span class="pill outline">15 min</span><span class="pill outline">+ personalizar</span></div>
          </div>
          <button class="btn btn-roxo btn-block" id="create-act">📌 Publicar atividade para os alunos</button>
          <p class="tiny faint b">Os alunos recebem como um desafio gamificado no app — sem perder a experiência divertida.</p>
        </div>
      </div>

      <div class="pcard">
        <div class="b9">Atividades em andamento</div>
        <div class="col gap10 mt12">
          ${[
            { t:'Revisão: Estequiometria', turma:'3º Ano B', ad:78, prazo:'em 2 dias' },
            { t:'Maratona de Biologia', turma:'2º Ano A', ad:92, prazo:'hoje' },
            { t:'Simulado ENEM — Humanas', turma:'Todas', ad:54, prazo:'em 5 dias' },
          ].map(x=>`
            <div style="border:1px solid #F1F3F9;border-radius:14px;padding:12px">
              <div class="row between"><span class="b">${x.t}</span><span class="pill gray small">${x.prazo}</span></div>
              <div class="tiny faint b">${x.turma}</div>
              <div class="row between mt8"><span class="tiny b muted">Adesão</span><span class="tiny b" style="color:var(--verde-600)">${x.ad}%</span></div>
              <div class="bar thin mt4"><span style="width:${x.ad}%"></span></div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  `;
}
