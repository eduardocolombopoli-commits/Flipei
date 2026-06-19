/* =========================================================================
   FLIPEI — Mock data (protótipo)
   Tudo aqui é fictício/demonstrativo para validar a experiência.
   ========================================================================= */

const SUBJECTS = {
  mat:  { id:'mat',  name:'Matemática',   emoji:'📐', color:'#3B82F6' },
  bio:  { id:'bio',  name:'Biologia',     emoji:'🧬', color:'#22C55E' },
  qui:  { id:'qui',  name:'Química',      emoji:'⚗️', color:'#14B8A6' },
  fis:  { id:'fis',  name:'Física',       emoji:'🔭', color:'#6366F1' },
  his:  { id:'his',  name:'História',     emoji:'🏛️', color:'#F59E0B' },
  geo:  { id:'geo',  name:'Geografia',    emoji:'🌎', color:'#0EA5E9' },
  por:  { id:'por',  name:'Português',    emoji:'📖', color:'#EC4899' },
  red:  { id:'red',  name:'Redação',      emoji:'✍️', color:'#A855F7' },
  fil:  { id:'fil',  name:'Filosofia',    emoji:'🦉', color:'#8B5CF6' },
};

// Universidades / provas (personalização)
const EXAMS = [
  { id:'enem',  name:'ENEM',           sigla:'EN', color:'#7C3AED', sub:'Exame Nacional' },
  { id:'fuvest',name:'FUVEST · USP',   sigla:'USP',color:'#1E3A8A', sub:'São Paulo' },
  { id:'unicamp',name:'UNICAMP',       sigla:'UNI',color:'#B91C1C', sub:'Campinas' },
  { id:'ufrgs', name:'UFRGS',          sigla:'RS', color:'#0F766E', sub:'Rio Grande do Sul' },
  { id:'uerj',  name:'UERJ',           sigla:'RJ', color:'#9333EA', sub:'Rio de Janeiro' },
  { id:'ufpr',  name:'UFPR',           sigla:'PR', color:'#15803D', sub:'Paraná' },
];

// Flashcards de exemplo (estilo ENEM/vestibular)
const CARDS = [
  { s:'bio', q:'Qual organela é responsável pela produção de ATP por respiração celular?', a:'A mitocôndria — realiza a respiração celular aeróbica, gerando ATP.', sub:'Citologia' },
  { s:'bio', q:'O que diferencia uma célula procarionte de uma eucarionte?', a:'A procarionte não possui núcleo organizado nem organelas membranosas; o material genético fica disperso no citoplasma.', sub:'Citologia' },
  { s:'qui', q:'O que é uma ligação iônica?', a:'É a transferência de elétrons entre um metal e um ametal, formando íons de cargas opostas que se atraem.', sub:'Ligações Químicas' },
  { s:'qui', q:'Qual o pH de uma solução neutra a 25 °C?', a:'pH = 7. Concentrações de H⁺ e OH⁻ iguais a 10⁻⁷ mol/L.', sub:'Ácidos e Bases' },
  { s:'mat', q:'Qual a fórmula da área de um círculo de raio r?', a:'A = π·r²', sub:'Geometria' },
  { s:'mat', q:'Em uma PA, a₁ = 3 e razão = 4. Qual o 5º termo?', a:'a₅ = a₁ + 4·r = 3 + 16 = 19', sub:'Progressões' },
  { s:'fis', q:'Enuncie a 2ª Lei de Newton.', a:'A força resultante é igual ao produto da massa pela aceleração: F = m·a.', sub:'Dinâmica' },
  { s:'his', q:'O que foi a Revolução Industrial?', a:'Transição (séc. XVIII, Inglaterra) da produção artesanal para a mecanizada, com máquinas a vapor e fábricas.', sub:'Idade Contemporânea' },
  { s:'his', q:'Qual evento marca o início da Era Vargas?', a:'A Revolução de 1930, que levou Getúlio Vargas ao poder.', sub:'Brasil República' },
  { s:'geo', q:'O que é o efeito orográfico das chuvas?', a:'Chuvas formadas quando o ar úmido sobe uma encosta, resfria e condensa (chuvas de relevo).', sub:'Climatologia' },
  { s:'por', q:'O que caracteriza a figura de linguagem "metonímia"?', a:'Substituição de um termo por outro com relação de proximidade (ex.: "ler Machado" = ler a obra de Machado).', sub:'Figuras de Linguagem' },
  { s:'fil', q:'Para Sócrates, qual o caminho para a virtude?', a:'O conhecimento. "Conhece-te a ti mesmo" — a virtude está ligada ao saber.', sub:'Filosofia Antiga' },
];

// Estado do aluno (usuário logado no protótipo)
const STUDENT = {
  name:'Eduardo',
  handle:'@edu',
  avatarColor:'#7C3AED',
  goal:'ENEM 2026',
  streak:12,
  xp:2450,
  xpToday:0,
  dailyGoal:50,
  league:'Ouro',
  leagueIcon:'🥇',
  gems:340,
  lives:5,
  maxLives:5,
  rankPos:3,
  level:14,
  cardsTotal:1840,
  accuracy:78,
  minutesWeek:214,
  school:'Colégio Horizonte',
  // acertos por matéria
  bySubject:[
    { s:'bio', acc:88, cards:320 },
    { s:'mat', acc:64, cards:410 },
    { s:'qui', acc:71, cards:240 },
    { s:'fis', acc:59, cards:180 },
    { s:'his', acc:82, cards:260 },
    { s:'por', acc:90, cards:230 },
  ],
  // evolução de XP por dia (últimos 7)
  weeklyXp:[120,80,210,160,90,240,180],
  // mapa de calor de estudo (7x ~5 semanas) níveis 0..4
  heat:[
    0,2,1,3,2,4,1, 2,3,0,1,2,3,2, 1,4,2,3,1,0,2, 3,2,4,3,2,1,3, 2,3,3,4,2,3,4,
  ],
  conquistas:[
    { ic:'🔥', name:'Pegou Fogo', desc:'Streak de 7 dias', got:true, color:'#FB923C' },
    { ic:'🧠', name:'Cérebro Afiado', desc:'500 cards revisados', got:true, color:'#8B5CF6' },
    { ic:'🌅', name:'Madrugador', desc:'Estudou antes das 8h', got:true, color:'#FACC15' },
    { ic:'🏆', name:'Liga Ouro', desc:'Alcance a Liga Ouro', got:true, color:'#EAB308' },
    { ic:'💯', name:'Sessão Perfeita', desc:'Acerte 100% de uma sessão', got:false, color:'#22C55E' },
    { ic:'🚀', name:'Imparável', desc:'Streak de 30 dias', got:false, color:'#EC4899' },
  ],
};

// Trilha de estudos (unidade atual)
const PATH = {
  unit:'Unidade 3 · Biologia Celular',
  nodes:[
    { id:1, label:'Membranas', state:'done', ic:'⭐' },
    { id:2, label:'Citoplasma', state:'done', ic:'⭐' },
    { id:3, label:'Organelas',  state:'current', ic:'📘' },
    { id:4, label:'Núcleo',     state:'locked', ic:'🔒' },
    { id:5, label:'Divisão Celular', state:'locked', ic:'🔒' },
    { id:6, label:'Revisão Geral', state:'locked', ic:'🎁' },
  ],
};

// Ranking / Liga
const RANK = {
  geral:[
    { name:'Ana Beatriz', xp:3120, av:'#EC4899' },
    { name:'Lucas Mendes', xp:2980, av:'#3B82F6' },
    { name:'Eduardo', xp:2450, av:'#7C3AED', me:true },
    { name:'Marina Souza', xp:2310, av:'#F59E0B' },
    { name:'Pedro Alves', xp:2150, av:'#14B8A6' },
    { name:'Júlia Castro', xp:1990, av:'#22C55E' },
    { name:'Rafael Lima', xp:1870, av:'#EF4444' },
    { name:'Carla Dias', xp:1640, av:'#8B5CF6' },
  ],
  prova:[
    { name:'Lucas Mendes', xp:2980, av:'#3B82F6' },
    { name:'Eduardo', xp:2450, av:'#7C3AED', me:true },
    { name:'Pedro Alves', xp:2150, av:'#14B8A6' },
    { name:'Rafael Lima', xp:1870, av:'#EF4444' },
    { name:'Bruno Rocha', xp:1520, av:'#0EA5E9' },
  ],
  escola:[
    { name:'Marina Souza', xp:2310, av:'#F59E0B' },
    { name:'Eduardo', xp:2450, av:'#7C3AED', me:true },
    { name:'Carla Dias', xp:1640, av:'#8B5CF6' },
    { name:'Tiago Nunes', xp:1320, av:'#16A34A' },
  ],
};

/* =========================================================================
   ESCOLA — dados do portal
   ========================================================================= */
const SCHOOL = {
  name:'Colégio Horizonte',
  plan:'Licença Pro · 240 alunos',
  admin:'Profa. Helena',
  kpis:{
    ativos:{ v:198, total:240, delta:'+12%', up:true },
    engajamento:{ v:'82%', delta:'+5%', up:true },        // alunos ativos na semana
    acuracia:{ v:'74%', delta:'-3%', up:false },
    cards:{ v:'18.4k', delta:'+21%', up:true },           // cards revisados na semana
    minutos:{ v:'1.240h', delta:'+9%', up:true },
  },
  // engajamento diário (alunos ativos) últimos 14 dias
  engajamento14:[120,134,128,150,162,90,70,140,158,166,172,180,96,88],
  // acurácia média por matéria (turma)
  acuraciaMateria:[
    { s:'por', acc:84 }, { s:'his', acc:80 }, { s:'bio', acc:76 },
    { s:'geo', acc:73 }, { s:'qui', acc:66 }, { s:'mat', acc:61 }, { s:'fis', acc:55 },
  ],
  turmas:[
    { name:'3º Ano A', alunos:32, ativos:29, acc:78, eng:91 },
    { name:'3º Ano B', alunos:30, ativos:24, acc:71, eng:80 },
    { name:'3º Ano C', alunos:28, ativos:19, acc:62, eng:68 },
    { name:'2º Ano A', alunos:34, ativos:31, acc:75, eng:88 },
  ],
  alunos:[
    { name:'Ana Beatriz',  turma:'3º A', acc:91, streak:21, min:320, status:'g', foco:'—' },
    { name:'Lucas Mendes', turma:'3º A', acc:85, streak:14, min:290, status:'g', foco:'Física' },
    { name:'Eduardo',      turma:'3º A', acc:78, streak:12, min:214, status:'g', foco:'Física' },
    { name:'Marina Souza', turma:'3º B', acc:74, streak:8,  min:180, status:'y', foco:'Matemática' },
    { name:'Pedro Alves',  turma:'3º B', acc:69, streak:5,  min:120, status:'y', foco:'Química' },
    { name:'Carla Dias',   turma:'3º C', acc:58, streak:2,  min:60,  status:'r', foco:'Matemática' },
    { name:'Tiago Nunes',  turma:'3º C', acc:52, streak:0,  min:35,  status:'r', foco:'Física' },
    { name:'Júlia Castro', turma:'2º A', acc:81, streak:17, min:260, status:'g', foco:'—' },
  ],
  // dificuldades agregadas (temas com pior desempenho na escola)
  dificuldades:[
    { tema:'Funções exponenciais', mat:'Matemática', acc:48, alunos:142 },
    { tema:'Termodinâmica',        mat:'Física',     acc:51, alunos:120 },
    { tema:'Estequiometria',       mat:'Química',    acc:57, alunos:98 },
    { tema:'Genética / Mendel',    mat:'Biologia',   acc:61, alunos:88 },
  ],
};

/* =========================================================================
   DECKS — catálogo (Matéria → Submatéria → Deck). Personalização nova.
   A aluna LIBERA decks; os liberados entram na revisão diária (espaçada).
   ========================================================================= */
const DECKS = [
  // História
  { id:'his-ri1', s:'his', sub:'Idade Contemporânea', name:'1ª Revolução Industrial', total:24, mastered:14, due:6,  unlocked:true },
  { id:'his-gm2', s:'his', sub:'Idade Contemporânea', name:'2ª Guerra Mundial',        total:30, mastered:0,  due:0,  unlocked:false },
  { id:'his-var', s:'his', sub:'Brasil República',    name:'Era Vargas',               total:20, mastered:8,  due:5,  unlocked:true },
  { id:'his-dit', s:'his', sub:'Brasil República',    name:'Ditadura Militar',         total:22, mastered:0,  due:0,  unlocked:false },
  // Biologia
  { id:'bio-org', s:'bio', sub:'Citologia',           name:'Organelas Celulares',      total:28, mastered:20, due:4,  unlocked:true },
  { id:'bio-mem', s:'bio', sub:'Citologia',           name:'Membrana Plasmática',      total:18, mastered:12, due:3,  unlocked:true },
  { id:'bio-men', s:'bio', sub:'Genética',            name:'Leis de Mendel',           total:24, mastered:0,  due:0,  unlocked:false },
  { id:'bio-dna', s:'bio', sub:'Genética',            name:'DNA e RNA',                total:20, mastered:0,  due:0,  unlocked:false },
  // Matemática
  { id:'mat-f1',  s:'mat', sub:'Funções',             name:'Função do 1º grau',        total:22, mastered:10, due:7,  unlocked:true },
  { id:'mat-bha', s:'mat', sub:'Funções',             name:'Bhaskara / 2º grau',       total:26, mastered:0,  due:0,  unlocked:false },
  { id:'mat-geo', s:'mat', sub:'Geometria',           name:'Áreas e Perímetros',       total:20, mastered:0,  due:0,  unlocked:false },
  // Química
  { id:'qui-est', s:'qui', sub:'Físico-Química',      name:'Estequiometria',           total:24, mastered:0,  due:0,  unlocked:false },
  { id:'qui-org', s:'qui', sub:'Química Orgânica',    name:'Funções Orgânicas',        total:28, mastered:0,  due:0,  unlocked:false },
  // Física
  { id:'fis-new', s:'fis', sub:'Mecânica',            name:'Leis de Newton',           total:20, mastered:6,  due:8,  unlocked:true },
  { id:'fis-ele', s:'fis', sub:'Eletricidade',        name:'Circuitos Elétricos',      total:22, mastered:0,  due:0,  unlocked:false },
];

// IA sugere decks para liberar (com base no objetivo + provas)
const DECK_SUGGESTIONS = ['bio-men','mat-bha','qui-org'];

/* =========================================================================
   PESOS POR PROVA — incidência (edital + provas anteriores).
   "Revisão rápida por prova" puxa do banco INTEIRO, ponderado por isso.
   ========================================================================= */
const EXAM_WEIGHTS = {
  enem:    [
    { l:'Interpretação de texto', s:'por', pct:12 },
    { l:'Funções',                s:'mat', pct:10 },
    { l:'Ecologia',               s:'bio', pct:9  },
    { l:'Brasil República',       s:'his', pct:8  },
    { l:'Físico-Química',         s:'qui', pct:7  },
    { l:'Mecânica',               s:'fis', pct:7  },
    { l:'Geografia Agrária',      s:'geo', pct:6  },
  ],
  ufrgs:   [
    { l:'Interpretação de texto', s:'por', pct:12 },
    { l:'Bhaskara / 2º grau',     s:'mat', pct:10 },
    { l:'Mecânica',               s:'fis', pct:8  },
    { l:'Química Orgânica',       s:'qui', pct:7  },
    { l:'Genética',               s:'bio', pct:5  },
    { l:'Egito Antigo',           s:'his', pct:5  },
    { l:'Climatologia',           s:'geo', pct:5  },
  ],
  fuvest:  [
    { l:'Interpretação / Literatura', s:'por', pct:14 },
    { l:'Funções e Logaritmos',   s:'mat', pct:11 },
    { l:'Eletromagnetismo',       s:'fis', pct:9  },
    { l:'Estequiometria',         s:'qui', pct:8  },
    { l:'Citologia',              s:'bio', pct:6  },
    { l:'Brasil Colônia',         s:'his', pct:6  },
  ],
  unicamp: [
    { l:'Interpretação de texto', s:'por', pct:13 },
    { l:'Geometria',              s:'mat', pct:10 },
    { l:'Termodinâmica',          s:'fis', pct:8  },
    { l:'Físico-Química',         s:'qui', pct:7  },
    { l:'Evolução',               s:'bio', pct:6  },
    { l:'Geopolítica',            s:'geo', pct:6  },
  ],
};

/* =========================================================================
   JORNADA — progressão estilo "mapa de fases" (gamificação pura).
   NÃO bloqueia conteúdo. Tiers + níveis + baús + conquistas.
   ========================================================================= */
const TIERS = [
  { id:'bronze',   name:'Bronze',   icon:'🥉', color:'#B45309' },
  { id:'prata',    name:'Prata',    icon:'🥈', color:'#64748B' },
  { id:'ouro',     name:'Ouro',     icon:'🥇', color:'#EAB308' },
  { id:'diamante', name:'Diamante', icon:'💎', color:'#06B6D4' },
  { id:'lenda',    name:'Lenda',    icon:'👑', color:'#A855F7' },
];

// Estado de nível do aluno
const LEVEL = { current:14, tier:'ouro', xpInLevel:250, xpForNext:400 };

// Nós do mapa (do passado recente ao futuro). type: level|chest|badge|tier
const JOURNEY = [
  { lvl:10, type:'level', label:'Nível 10', state:'done' },
  { lvl:11, type:'chest', label:'Baú: +50 💎', state:'done' },
  { lvl:12, type:'level', label:'Nível 12', state:'done' },
  { lvl:13, type:'badge', label:'🏅 Maratonista', state:'done' },
  { lvl:14, type:'level', label:'Você está aqui', state:'current' },
  { lvl:15, type:'chest', label:'Baú surpresa', state:'next' },
  { lvl:16, type:'level', label:'Nível 16', state:'future' },
  { lvl:17, type:'tier',  label:'Liga Diamante 💎', state:'future' },
  { lvl:18, type:'level', label:'Nível 18', state:'future' },
  { lvl:19, type:'chest', label:'Baú raro', state:'future' },
  { lvl:20, type:'badge', label:'🏆 500 dominados', state:'future' },
  { lvl:21, type:'level', label:'Nível 21', state:'future' },
  { lvl:22, type:'tier',  label:'Rumo a Lenda 👑', state:'future' },
];

// Missões diárias (gamificação da Home)
const DAILY_QUESTS = [
  { ic:'🎯', t:'Estude 50 cards hoje',       cur:30, goal:50, reward:'+20 XP' },
  { ic:'🔥', t:'Mantenha seu streak',        cur:1,  goal:1,  reward:'+10 XP', done:true },
  { ic:'🎓', t:'Acerte 10 cards seguidos',   cur:6,  goal:10, reward:'+30 XP · 💎' },
];
