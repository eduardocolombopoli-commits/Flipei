/* =========================================================================
   FLIPEI — Portal da ESCOLA (B2B profissional). Indicadores reais + insights.
   A escola monitora desempenho — sem controle sobre o uso do aluno.
   ========================================================================= */

function SchoolPortal(){
  const page = App.s.schoolPage;
  const nav = [
    { id:'dashboard',  ic:'grid', t:'Visão Geral' },
    { id:'engajamento',ic:'trending', t:'Engajamento' },
    { id:'desempenho', ic:'target', t:'Desempenho' },
    { id:'turmas',     ic:'users', t:'Turmas' },
    { id:'alunos',     ic:'cap', t:'Alunos' },
    { id:'conteudo',   ic:'puzzle', t:'Conteúdo' },
    { id:'atividades', ic:'clipboard', t:'Atividades' },
    { id:'insights',   ic:'bulb', t:'Insights' },
  ];
  let body='';
  if(page==='dashboard') body=SchoolDashboard();
  else if(page==='engajamento') body=SchoolEngajamento();
  else if(page==='desempenho') body=SchoolDesempenho();
  else if(page==='turmas') body=SchoolTurmas();
  else if(page==='alunos') body=App.s.detailStudent?SchoolStudentDetail():SchoolAlunos();
  else if(page==='conteudo') body=SchoolConteudo();
  else if(page==='atividades') body=SchoolAtividades();
  else if(page==='insights') body=SchoolInsights();

  const cur = nav.find(n=>n.id===page);
  return `
  <div class="portal">
    <aside class="side">
      <div style="padding:0 6px 4px">${LogoLight(22)}</div>
      <div class="side-sub">Portal da Escola</div>
      <nav class="nav">
        ${nav.map(n=>`<a class="${page===n.id?'on':''}" data-act="school-page" data-page="${n.id}"><span class="ic">${icon(n.ic,19)}</span><span class="t">${n.t}</span></a>`).join('')}
      </nav>
      <div class="school-chip">
        <div class="sc-logo">CH</div>
        <div class="col"><span class="b9 small" style="color:#fff">${SCHOOL.name}</span><span class="tiny" style="color:#9D94C0">${SCHOOL.plan}</span></div>
      </div>
    </aside>
    <main class="portal-main">
      <header class="portal-top">
        <div class="col" style="gap:1px"><span class="ptop-title">${cur.t}</span><span class="ptop-sub">${SCHOOL.name} · atualizado hoje, 14:20</span></div>
        <div class="row gap12">
          ${portalFilters()}
          <div class="ptop-user"><div class="sc-logo" style="width:34px;height:34px;font-size:12px">H</div><div class="col" style="gap:0"><span class="b small">${SCHOOL.admin}</span><span class="tiny faint">Coordenação</span></div></div>
        </div>
      </header>
      <div class="portal-body scroll"><div class="maxw fade-in">${body}</div></div>
    </main>
  </div>`;
}

function LogoLight(size){ return `<span class="logo-word light" style="font-size:${size||22}px">flipei</span>`; }

function portalFilters(){
  const P=App.s.schoolPeriod;
  return `<div class="filterbar">
    <div class="seg seg-pro">${[['7d','7 dias'],['30d','30 dias'],['90d','90 dias']].map(([p,l])=>`<button class="${P===p?'on':''}" data-act="school-period" data-period="${p}">${l}</button>`).join('')}</div>
    <select class="pro-select"><option>Todas as turmas</option>${SCHOOL.turmas.map(t=>`<option>${t.name}</option>`).join('')}</select>
    <button class="btn-pro" title="Exportar relatório">⭳ Exportar</button>
  </div>`;
}

// ---- helpers ----
function heatColor(acc){ if(acc>=80) return '#16A34A'; if(acc>=70) return '#65A30D'; if(acc>=60) return '#CA8A04'; if(acc>=50) return '#EA580C'; return '#DC2626'; }
function statusDot(s){ return `<span class="dot ${s}"></span>`; }
function kpiPro(label,val,delta,up,spark,color,sub){
  return `<div class="pcard kpi-pro">
    <div class="kpi-label">${label}</div>
    <div class="row between" style="align-items:flex-end;margin-top:2px">
      <div class="kpi-val" style="${color?`color:${color}`:''}">${val}</div>
      ${delta?`<span class="delta ${up?'up':'down'}">${up?'▲':'▼'} ${delta}</span>`:''}
    </div>
    ${sub?`<div class="kpi-sub">${sub}</div>`:''}
    ${spark?`<div class="kpi-spark">${spark}</div>`:''}
  </div>`;
}
function sectionTitle(t,sub){ return `<div class="psec"><div class="psec-t">${t}</div>${sub?`<div class="psec-s">${sub}</div>`:''}</div>`; }

// =========================================================================
// VISÃO GERAL (executivo)
// =========================================================================
function SchoolDashboard(){
  const o=SCH_OVERVIEW, k=SCHOOL.kpis;
  return `
    <div class="grid-kpi">
      ${kpiPro('Alunos ativos (semana)', o.wau+'<span class="kpi-of">/${o.totalAlunos}</span>', '+12%', true, sparkline(SCHOOL.engajamento14,'#7C3AED'), '#4C1D95')}
      ${kpiPro('Taxa de engajamento', k.engajamento.v, k.engajamento.delta, true, sparkline([72,75,74,78,80,82],'#16A34A'), '#16A34A')}
      ${kpiPro('Acurácia média', k.acuracia.v, k.acuracia.delta, false, sparkline([77,76,75,74,74,74],'#CA8A04'), '#CA8A04')}
      ${kpiPro('Nota média em simulado', o.simulado.atual, o.simulado.delta, true, sparkline(o.simulado.serie,'#2563EB'), '#2563EB','de 1000 pts · ↑ desde jan')}
      ${kpiPro('Cobertura do edital', o.editalCobertura+'%', '+6 p.p.', true, sparkline([30,35,39,42,45,47],'#7C3AED'), '#7C3AED')}
    </div>

    <div class="grid-2" style="margin-top:18px">
      <div class="pcard">
        ${sectionTitle('Engajamento diário','Alunos com ≥1 sessão por dia · últimos 14 dias')}
        ${lineChart(SCHOOL.engajamento14,{color:'#7C3AED',cssH:210})}
      </div>
      <div class="pcard pcard-accent">
        ${sectionTitle('Evolução da nota em simulados','A métrica de eficácia — desempenho do aluno ao longo do tempo')}
        ${lineChart(o.simulado.serie,{color:'#2563EB',cssH:175})}
        <div class="row between mt8"><span class="tiny faint b">${o.simulado.labels[0]}</span><span class="pill green small">${o.simulado.delta} no período (${o.simulado.deltaPct})</span><span class="tiny faint b">${o.simulado.labels[o.simulado.labels.length-1]}</span></div>
      </div>
    </div>

    <div class="grid-2" style="margin-top:16px">
      <div class="pcard">
        <div class="row between">${sectionTitle('Principais insights','Gerados automaticamente pela plataforma')}<a class="link small" data-act="school-page" data-page="insights">ver todos</a></div>
        <div class="col gap8 mt4">${SCHOOL_INSIGHTS.slice(0,3).map(insightCard).join('')}</div>
      </div>
      <div class="pcard">
        <div class="row between">${sectionTitle('Alunos em risco','Inativos ou com queda de desempenho')}<a class="link small" data-act="school-page" data-page="alunos">ver alunos</a></div>
        <div class="col gap8 mt4">
          ${SCHOOL.alunos.filter(a=>a.status!=='g').slice(0,5).map(a=>`
            <div class="riskrow" data-act="open-student" data-student="${a.name}">
              <div class="sc-logo" style="width:32px;height:32px;font-size:12px;background:${a.status==='r'?'#DC2626':'#CA8A04'}">${a.name[0]}</div>
              <div class="grow"><div class="b small">${a.name}</div><div class="tiny faint b">${a.turma} · streak ${a.streak}d · ${Math.round(a.min/60*10)/10}h/sem</div></div>
              <span class="heat" style="background:${heatColor(a.acc)}15;color:${heatColor(a.acc)}">${a.acc}%</span></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="pcard" style="margin-top:16px">
      ${sectionTitle('Funil de adoção','Da matrícula ao hábito de estudo')}
      ${funnelHTML(ADOPTION_FUNNEL)}
    </div>`;
}

// =========================================================================
// ENGAJAMENTO
// =========================================================================
function SchoolEngajamento(){
  const o=SCH_OVERVIEW;
  return `
    <div class="grid-kpi">
      ${kpiPro('Ativos por dia (DAU)', o.dau, '+8%', true, '', '#4C1D95')}
      ${kpiPro('Ativos por semana (WAU)', o.wau, '+12%', true, '', '#4C1D95')}
      ${kpiPro('Ativos por mês (MAU)', o.mau, '+15%', true, '', '#4C1D95')}
      ${kpiPro('Taxa de ativação', o.ativacao+'%', '+4 p.p.', true, '', '#16A34A','cadastrados que ativaram')}
      ${kpiPro('Streak médio', o.streakMedio+' dias', '+3', true, '', '#EA580C')}
      ${kpiPro('Tempo médio/dia', o.tempoMedioDia+' min', '+2', true, '', '#2563EB')}
    </div>
    <div class="pcard" style="margin-top:18px">
      ${sectionTitle('Alunos ativos por dia','Últimos 14 dias')}
      ${lineChart(SCHOOL.engajamento14,{color:'#7C3AED',cssH:220})}
    </div>
    <div class="grid-2" style="margin-top:16px">
      <div class="pcard">
        ${sectionTitle('Retenção por coorte','% dos alunos que continuam ativos após o cadastro')}
        ${barChart(RETENTION_COHORT.values.map((v,i)=>({l:RETENTION_COHORT.labels[i],v,color:v>=70?'#16A34A':v>=60?'#CA8A04':'#EA580C'})),{h:210,values:true})}
        <div class="insight warning mt8"><span class="small b">Retenção D30 em ${o.retencao30}%. Acima da média de edtech (~20-40%), mas a queda inicial pede um onboarding mais forte.</span></div>
      </div>
      <div class="pcard">
        ${sectionTitle('Distribuição de constância','% de alunos por faixa de streak')}
        <div class="row center mt8">${ring(72,{size:150,color:'#7C3AED',label:'72%',sub:'com streak ativo'})}</div>
        <div class="col gap6 mt8">
          <div class="row between small b"><span>🔥 7+ dias (hábito)</span><span>38%</span></div>
          <div class="row between small b"><span>📚 1–6 dias</span><span>34%</span></div>
          <div class="row between small b muted"><span>○ Inativos</span><span>28%</span></div>
        </div>
      </div>
    </div>
    <div class="pcard" style="margin-top:16px">
      ${sectionTitle('Funil de adoção','Da matrícula ao hábito')}
      ${funnelHTML(ADOPTION_FUNNEL)}
    </div>`;
}

// =========================================================================
// DESEMPENHO & EFICÁCIA
// =========================================================================
function SchoolDesempenho(){
  const o=SCH_OVERVIEW, av=ACTIVE_VS_INACTIVE;
  const matData=SCHOOL.acuraciaMateria.map(m=>({l:SUBJECTS[m.s].name,v:m.acc,color:heatColor(m.acc)}));
  return `
    <div class="pcard pcard-accent">
      ${sectionTitle('Impacto da Flipei no desempenho','Comparativo entre alunos ativos e pouco ativos — o argumento de eficácia')}
      <div class="impact-grid">
        <div class="impact"><div class="impact-delta up">+23 p.p.</div><div class="impact-lbl">Acurácia</div><div class="impact-sub">${av.acc.ativos}% ativos vs ${av.acc.inativos}% pouco ativos</div></div>
        <div class="impact"><div class="impact-delta up">+84 pts</div><div class="impact-lbl">Nota de simulado</div><div class="impact-sub">${av.simulado.ativos} vs ${av.simulado.inativos} (de 1000)</div></div>
        <div class="impact"><div class="impact-delta up">4×</div><div class="impact-lbl">Tempo de estudo</div><div class="impact-sub">${av.tempo.ativos} min vs ${av.tempo.inativos} min/dia</div></div>
      </div>
      <div class="tiny faint b mt8">Correlação observada na base — não prova causal isolada, mas é o indicador que sustenta o valor pedagógico.</div>
    </div>

    <div class="grid-2" style="margin-top:16px">
      <div class="pcard">
        ${sectionTitle('Evolução da nota em simulados','Média da escola ao longo dos meses')}
        ${lineChart(o.simulado.serie,{color:'#2563EB',cssH:200})}
        <div class="row between mt8"><span class="tiny faint b">${o.simulado.labels[0]}: ${o.simulado.serie[0]}</span><span class="pill green small">${o.simulado.delta}</span><span class="tiny faint b">${o.simulado.labels.slice(-1)}: ${o.simulado.atual}</span></div>
      </div>
      <div class="pcard">
        ${sectionTitle('Acurácia por matéria','Onde a escola vai bem — e onde precisa de reforço')}
        <div class="mt8">${hBars(matData,{})}</div>
      </div>
    </div>

    <div class="pcard" style="margin-top:16px">
      ${sectionTitle('Cobertura do edital','% do edital de cada matéria já estudado pela base — cruzado com a incidência na prova')}
      <div class="col gap10 mt8">
        ${EDITAL_COVERAGE.map(c=>{ const sj=SUBJECTS[c.s]; const p=Math.round(c.done/c.target*100); const col=p<50?'#DC2626':p<75?'#CA8A04':'#16A34A';
          return `<div><div class="row between"><span class="b small">${sj.name}</span><span class="tiny b" style="color:${col}">${c.done}% de ${c.target}% do edital · ${p}% coberto</span></div>
            <div class="bar thin mt4"><span style="width:${p}%;background:${col}"></span></div></div>`; }).join('')}
      </div>
      <div class="insight warning mt12"><span class="small b">Física e Química combinam <b>alta incidência</b> na prova e <b>baixa cobertura</b> — prioridade pedagógica do trimestre.</span></div>
    </div>`;
}

// =========================================================================
// TURMAS
// =========================================================================
function SchoolTurmas(){
  return `
    <div class="grid-kpi">
      ${SCHOOL.turmas.map(t=>`<div class="pcard turma-card" data-act="school-page" data-page="alunos">
        <div class="row between"><div class="b9" style="font-size:16px">${t.name}</div><span class="dot ${t.eng>=85?'g':t.eng>=70?'y':'r'}"></span></div>
        <div class="row between mt8"><span class="kpi-label">Ativos</span><span class="b">${t.ativos}/${t.alunos}</span></div>
        <div class="bar thin mt4"><span style="width:${t.ativos/t.alunos*100}%"></span></div>
        <div class="row gap16 mt12">
          <div><div class="tiny faint b">Acurácia</div><div class="b9" style="color:${heatColor(t.acc)}">${t.acc}%</div></div>
          <div><div class="tiny faint b">Engajamento</div><div class="b9" style="color:#4C1D95">${t.eng}%</div></div></div></div>`).join('')}
    </div>
    <div class="pcard" style="margin-top:16px">
      ${sectionTitle('Comparativo entre turmas','Acurácia média')}
      ${barChart(SCHOOL.turmas.map(t=>({l:t.name.replace('º Ano',''),v:t.acc,color:heatColor(t.acc)})),{h:210,values:true})}
    </div>`;
}

// =========================================================================
// ALUNOS
// =========================================================================
function SchoolAlunos(){
  return `
    <div class="pcard">
      <div class="row between">
        <div class="row gap10">
          <input class="pro-input" placeholder="Buscar aluno..." style="width:240px"/>
          <span class="pill gray small">${SCHOOL.alunos.length} alunos</span>
        </div>
        <div class="legend"><span><i style="background:#16A34A"></i>Em dia</span><span><i style="background:#CA8A04"></i>Atenção</span><span><i style="background:#DC2626"></i>Em risco</span></div>
      </div>
      <table class="tbl mt12">
        <thead><tr><th>Aluno</th><th>Turma</th><th>Acurácia</th><th>Streak</th><th>Tempo/sem</th><th>Foco fraco</th><th>Status</th></tr></thead>
        <tbody>
          ${SCHOOL.alunos.map(a=>`<tr data-act="open-student" data-student="${a.name}">
            <td><div class="row gap10"><div class="sc-logo" style="width:30px;height:30px;font-size:11px;background:${a.status==='g'?'#6D28D9':a.status==='y'?'#CA8A04':'#DC2626'}">${a.name[0]}</div><span class="b">${a.name}</span></div></td>
            <td class="muted b">${a.turma}</td>
            <td><span class="heat" style="background:${heatColor(a.acc)}15;color:${heatColor(a.acc)}">${a.acc}%</span></td>
            <td class="b">${a.streak}d</td>
            <td class="muted b">${Math.round(a.min/60*10)/10}h</td>
            <td class="muted b">${a.foco}</td>
            <td>${statusDot(a.status)} <span class="small b muted">${a.status==='g'?'Em dia':a.status==='y'?'Atenção':'Em risco'}</span></td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="tiny faint b mt12">A escola visualiza desempenho e constância. Não vê conteúdo privado nem interfere na experiência do aluno (LGPD).</p>`;
}

function SchoolStudentDetail(){
  const a=SCHOOL.alunos.find(x=>x.name===App.s.detailStudent)||SCHOOL.alunos[0];
  const subj=STUDENT.bySubject.map(x=>({l:SUBJECTS[x.s].name,v:x.acc,color:SUBJECTS[x.s].color}));
  const week=STUDENT.weeklyXp.map((v,i)=>({l:['S','T','Q','Q','S','S','D'][i],v}));
  return `
    <button class="btn-pro" data-act="back-students">← Voltar para alunos</button>
    <div class="pcard" style="margin-top:14px">
      <div class="row between">
        <div class="row gap12"><div class="sc-logo" style="width:52px;height:52px;font-size:20px;background:#6D28D9">${a.name[0]}</div>
          <div><div class="ptop-title">${a.name}</div><div class="muted b small">${a.turma} · ${SCHOOL.name}</div></div></div>
        <div class="row gap10"><span class="pill gray small">Streak ${a.streak} dias</span><span class="heat" style="background:${heatColor(a.acc)}15;color:${heatColor(a.acc)};font-size:14px;padding:8px 12px">${a.acc}% acerto</span></div>
      </div>
    </div>
    <div class="grid-kpi" style="margin-top:16px">
      ${kpiPro('Tempo na semana', Math.round(a.min/60*10)/10+'h','',true,'','#4C1D95')}
      ${kpiPro('Cards na semana', (a.min*3),'',true,'','#2563EB')}
      ${kpiPro('Nota simulado', 540+a.acc*1,'+'+(a.streak)+' pts',true,'','#16A34A')}
      ${kpiPro('Maior dificuldade', a.foco,'',true,'','#DC2626')}
    </div>
    <div class="grid-2" style="margin-top:16px">
      <div class="pcard">${sectionTitle('Atividade semanal','XP por dia')}${barChart(week,{h:200,values:true})}</div>
      <div class="pcard">${sectionTitle('Acurácia por matéria','')}<div class="mt8">${hBars(subj,{})}</div></div>
    </div>
    <div class="pcard" style="margin-top:16px"><div class="insight"><span class="small b">${a.name} tem boa constância${a.foco!=='—'?`, mas <b>${a.foco}</b> está abaixo da média da turma`:''}. Sugestão: indicar um bloco de revisão focado.</span></div></div>`;
}

// =========================================================================
// CONTEÚDO (dificuldades + criação de decks)
// =========================================================================
function SchoolConteudo(){
  const d=App.s.deckDraft;
  return `
    ${sectionTitle('Temas mais críticos','Pior desempenho da escola, cruzado com incidência na prova')}
    <div class="grid-2b">
      ${SCHOOL.dificuldades.map(x=>`<div class="pcard">
        <div class="row between"><div><span class="pill gray small">${x.mat}</span><div class="ptop-title" style="font-size:18px;margin-top:6px">${x.tema}</div></div>
          <div class="tcenter">${ring(x.acc,{size:88,stroke:10,color:heatColor(x.acc),label:x.acc+'%'})}</div></div>
        <div class="row between mt12"><span class="small muted b">${x.alunos} alunos com dificuldade</span>
          <button class="btn-pro" data-act="school-page" data-page="atividades">Criar atividade</button></div></div>`).join('')}
    </div>
    <div class="insight warning mt16"><span class="small b">A IA cruza o desempenho da turma com a incidência dos temas nas provas. <b>Funções exponenciais</b> caem muito no ENEM e têm só 48% de acerto — prioridade máxima.</span></div>

    <div class="pcard" style="margin-top:24px">
      ${sectionTitle('Flashcards da escola','A escola cria seus próprios decks, que entram na experiência gamificada do aluno')}
      <div class="grid-2 mt8">
        <div>
          <div class="col gap10">
            <div><div class="tiny faint b">Título do deck</div><input class="pro-input" data-model="deckTitle" value="${esc(d.title)}" placeholder="Ex.: Revisão de Citologia — Profa. Helena" style="width:100%"/></div>
            <div class="row gap10">
              <div class="grow"><div class="tiny faint b">Matéria</div><select class="pro-input" data-model="deckSubj" style="width:100%">${Object.values(SUBJECTS).map(s=>`<option value="${s.id}" ${d.subj===s.id?'selected':''}>${s.name}</option>`).join('')}</select></div>
              <div class="grow"><div class="tiny faint b">Turmas</div><input class="pro-input" value="3º Ano A, B" style="width:100%"/></div>
            </div>
            <div class="divider mt4"></div>
            <div class="b9 small">Adicionar card</div>
            <div><div class="tiny faint b">Frente</div><input class="pro-input" id="card-front" placeholder="Pergunta" style="width:100%"/></div>
            <div><div class="tiny faint b">Verso</div><input class="pro-input" id="card-back" placeholder="Resposta" style="width:100%"/></div>
            <button class="btn-pro" data-act="deck-add-card">＋ Adicionar card</button>
            <button class="btn btn-roxo btn-block" data-act="deck-publish">Publicar deck para os alunos</button>
          </div>
        </div>
        <div>
          <div class="row between"><span class="b9 small">Cards no deck (${d.cards.length})</span></div>
          <div class="col gap8 mt8">
            ${d.cards.length?d.cards.map(c=>`<div style="border:1px solid #E7E9F2;border-radius:10px;padding:10px"><div class="tiny faint b">Frente</div><div class="b small">${esc(c.q)}</div><div class="tiny faint b mt4">Verso</div><div class="small muted">${esc(c.a)}</div></div>`).join('')
              :`<div class="tcenter muted b small" style="padding:24px">Nenhum card ainda — adicione ao lado.</div>`}
          </div>
        </div>
      </div>
    </div>`;
}

// =========================================================================
// ATIVIDADES
// =========================================================================
function SchoolAtividades(){
  return `
    ${sectionTitle('Atividades','A escola propõe desafios na Flipei e acompanha a adesão')}
    <div class="grid-2">
      <div class="pcard">
        <div class="b9">Nova atividade</div>
        <div class="col gap10 mt12">
          <div><div class="tiny faint b">Título</div><input class="pro-input" value="Revisão: Funções exponenciais" style="width:100%"/></div>
          <div class="row gap10"><div class="grow"><div class="tiny faint b">Turma</div><input class="pro-input" value="3º Ano A, B e C" style="width:100%"/></div><div class="grow"><div class="tiny faint b">Prazo</div><input class="pro-input" value="20 jun" style="width:100%"/></div></div>
          <div><div class="tiny faint b">Meta</div><div class="row gap8 mt4"><span class="pill">30 flashcards</span><span class="pill outline">15 min</span></div></div>
          <button class="btn btn-roxo btn-block">Publicar atividade</button>
          <p class="tiny faint b">Chega ao aluno como desafio gamificado — sem perder a experiência divertida.</p>
        </div>
      </div>
      <div class="pcard">
        <div class="b9">Em andamento</div>
        <div class="col gap10 mt12">
          ${[{t:'Revisão: Estequiometria',turma:'3º Ano B',ad:78,prazo:'em 2 dias'},{t:'Maratona de Biologia',turma:'2º Ano A',ad:92,prazo:'hoje'},{t:'Simulado ENEM — Humanas',turma:'Todas',ad:54,prazo:'em 5 dias'}].map(x=>`
            <div style="border:1px solid #E7E9F2;border-radius:12px;padding:12px">
              <div class="row between"><span class="b">${x.t}</span><span class="pill gray small">${x.prazo}</span></div>
              <div class="tiny faint b">${x.turma}</div>
              <div class="row between mt8"><span class="tiny b muted">Adesão</span><span class="tiny b" style="color:#16A34A">${x.ad}%</span></div>
              <div class="bar thin mt4"><span style="width:${x.ad}%"></span></div></div>`).join('')}
        </div>
      </div>
    </div>`;
}

// =========================================================================
// INSIGHTS
// =========================================================================
function insightCard(ins){
  const map={ positive:{ic:'▲',cls:'positive'}, warning:{ic:'!',cls:'warning'}, critical:{ic:'✕',cls:'critical'} };
  const m=map[ins.type]||map.warning;
  return `<div class="insight ${m.cls}">
    <div class="row gap10" style="align-items:flex-start">
      <span class="ins-ic ${m.cls}">${m.ic}</span>
      <div class="grow"><div class="b small">${ins.t}</div><div class="small muted b" style="margin-top:2px">${ins.d}</div>
        ${ins.acao?`<div class="ins-acao">↳ ${ins.acao}</div>`:''}</div>
    </div></div>`;
}
function SchoolInsights(){
  return `
    ${sectionTitle('Insights da plataforma','Leituras automáticas dos dados, com ações sugeridas — atualizadas diariamente')}
    <div class="col gap10">
      ${SCHOOL_INSIGHTS.map(ins=>`<div class="pcard" style="padding:0;overflow:hidden">${insightCard(ins)}<div class="ins-foot"><button class="btn-pro" data-act="school-page" data-page="atividades">Criar atividade</button><button class="btn-pro ghost">Marcar como visto</button></div></div>`).join('')}
    </div>`;
}

// funil
function funnelHTML(data){
  const max=data[0].v;
  return `<div class="funnel mt8">${data.map((f,i)=>{ const p=Math.round(f.v/max*100); const colors=['#6D28D9','#7C3AED','#8B5CF6','#A78BFA'];
    return `<div class="funnel-row"><div class="funnel-lbl"><span class="b small">${f.l}</span></div>
      <div class="funnel-track"><div class="funnel-bar" style="width:${p}%;background:${colors[i]||'#A78BFA'}">${f.v}</div></div>
      <div class="funnel-pct tiny b">${p}%</div></div>`; }).join('')}</div>`;
}

// handlers de deck (conteúdo)
function schoolAddCard(){
  const f=$('#card-front'), b=$('#card-back'); const q=f&&f.value.trim(), a=b&&b.value.trim();
  if(!q||!a){ toast('Preencha frente e verso do card','warn','⚠️'); return; }
  App.s.deckDraft.cards.push({q,a}); toast('Card adicionado ao deck','success','＋'); render();
}
function schoolPublishDeck(){
  const d=App.s.deckDraft; d.title=App.s.deckTitle||d.title; d.subj=App.s.deckSubj||d.subj;
  if(!d.cards.length){ toast('Adicione ao menos 1 card antes de publicar','warn','⚠️'); return; }
  toast(`Deck "${d.title||'Sem título'}" publicado para os alunos!`,'success','📇');
  confetti({count:90,y:innerHeight*0.3});
  App.s.deckDraft={title:'',subj:'bio',cards:[]}; App.s.deckTitle=''; App.s.deckSubj='bio'; render();
}
