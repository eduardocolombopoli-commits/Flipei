# 🃏 Flipei — Protótipo de Experiência (Frontend)

> **Estudar virou jogo.** Flashcards + gamificação + IA para ENEM e vestibulares.

Este repositório é um **protótipo visual clicável** (não é o app final) para validar a
**experiência do usuário** antes de codar o produto de verdade. Tudo aqui é frontend:
HTML/CSS/JS puro, **sem build, sem dependências** — é só abrir no navegador.

---

## ▶️ Como abrir

1. Abra o arquivo **`index.html`** em qualquer navegador (Chrome, Edge, Safari…).
2. No canto da tela há um botão flutuante para alternar entre:
   - **👤 Aluno** — a experiência divertida/gamificada (90% dos usuários).
   - **🏫 Escola** — o portal profissional B2B com dashboards e métricas.

> Dica: no Chrome/Edge, ative o modo dispositivo (F12 → ícone de celular) para ver
> a versão mobile do app do aluno. O portal da escola foi pensado para tela grande (desktop).

```
# alternativa: servir localmente (recomendado p/ fontes)
python3 -m http.server 8000   # depois abra http://localhost:8000
```

---

## 🎯 Os 2 diferenciais (no centro do protótipo)

### 1. Gamificação que vicia (do bom jeito)
Inspirado no que o Duolingo fez para idiomas, adaptado para vestibular:
- **🔥 Streak** (dias seguidos) com pressão emocional saudável.
- **⚡ XP + meta diária** — "estudar pouco e todo dia vale mais que maratonar".
- **🏆 Ligas / Ranking** — geral, por prova e por escola, com **zona de promoção**.
- **Combo** durante a sessão (acertos seguidos dão bônus de XP).
- **Confete, animações e feedback** a cada acerto e ao fim da sessão.
- **🏅 Conquistas**, **💎 gems**, **❤️ vidas** e **desafios sociais** (um amigo te desafia).
- **Trilha de estudos** (learning path) estilo "mapa de fases".

### 2. Personalização por objetivo + IA
- Escolha de **prova/universidade** (ENEM, FUVEST/USP, UNICAMP, UFRGS…).
- Filtro por **matéria → submatéria → tema** (ex.: Biologia → Citologia).
- **Sugestão da IA**: cruza provas anteriores + seu desempenho para indicar
  onde focar ("Foque em Física e Matemática: caem muito e você erra mais").
- **Repetição espaçada** (Errei / Difícil / Bom / Fácil), a base de Anki/SuperMemo,
  embrulhada numa interface divertida.

---

## 🗺️ Telas incluídas

### App do Aluno (mobile-first, divertido)
| Tela | O que demonstra |
|------|-----------------|
| **Splash** | Posicionamento da marca + promessa "estudar virou jogo". |
| **Onboarding** | 3 passos: objetivo → rotina atual → meta diária (cria hábito desde o 1º clique). |
| **Início / Trilha** | Meta do dia, streak, vidas, gems, CTA "Estudar agora", trilha de fases, desafio social. |
| **Sessão (o jogo)** | Flashcard com **flip 3D**, combo, +XP flutuante, repetição espaçada. |
| **Conclusão** | Resumo com confete, XP contado em animação, acerto, streak. |
| **Ranking** | Ligas com abas **Geral / Por prova / Por escola** + zona de promoção. |
| **Personalizar** | Prova/universidade, matérias, submatéria/tema, card de sugestão da IA. |
| **Perfil (Dashboard do aluno)** | Evolução de XP, acerto por matéria, calendário de constância, conquistas. |

> **Importante:** o aluno também tem dashboard/métricas — ele quer ver como está
> evoluindo. A diferença é de escopo (ver tabela abaixo).

### Portal da Escola (desktop, profissional B2B)
| Tela | O que demonstra |
|------|-----------------|
| **Visão Geral** | KPIs (alunos ativos, engajamento, acurácia, cards), engajamento diário, constância, acurácia por matéria, alunos que precisam de atenção. |
| **Turmas** | Cards por turma + comparativo de acurácia. |
| **Alunos** | Tabela com acurácia, streak, tempo, foco fraco e status (em dia/atenção/risco). |
| **Aluno (detalhe)** | Desempenho individual completo do aluno. |
| **Dificuldades** | Temas com pior desempenho na escola + leitura da IA (incidência na prova). |
| **Atividades** | A escola **propõe** atividades (que chegam como desafio gamificado ao aluno) e acompanha a adesão. |

> 🔒 **A escola não controla nem interfere** no app do aluno — apenas **visualiza
> performance e constância**. Isso está sinalizado no topo do portal.

### Aluno vs. Escola — quem vê o quê
| | Aluno | Escola |
|---|---|---|
| Métricas próprias | ✅ as suas | — |
| Métricas de todos os alunos vinculados | — | ✅ (agregado + individual) |
| Controle sobre a experiência do app | ✅ total | ❌ nenhum |
| Propor atividades | — | ✅ (vira desafio no app) |

---

## 🎨 Identidade visual

- **Cores:** Roxo `#7C3AED` (principal) · Verde-limão `#22C55E` (acerto) ·
  Laranja `#FB923C` (streak) · Amarelo `#FACC15` (XP).
- **Tipografia:** *Baloo 2* (display divertida) + *Nunito* (texto).
- **Vibe:** cantos arredondados, botões 3D (estilo "apertável"), sombras suaves,
  micro-animações. Sem mascote por enquanto (decisão atual — fácil de adicionar depois).

Tokens centralizados em `assets/css/styles.css` (`:root`) — trocar a marca inteira
é mudar algumas variáveis.

---

## 🧠 Pesquisa que embasou as decisões

- **Duolingo** (referência de gamificação): XP como moeda única que alimenta streak,
  liga e conquistas ao mesmo tempo; *streak freeze*; ligas semanais com promoção/rebaixamento;
  recompensas com hora marcada ("appointment mechanics"); cor com significado
  (verde=acerto, laranja=streak, amarelo=XP). Streaks aumentam retenção ~60%.
- **Repetição espaçada (Anki / SM-2 / FSRS):** mostrar o card "pouco antes de esquecer".
  Os 4 botões (Errei/Difícil/Bom/Fácil) e os intervalos (10min/1d/3d/7d) seguem esse modelo.
- **Penseira e apps de flashcards BR:** fortes em revisão, fracos em engajamento/diversão.
  É exatamente a brecha que a Flipei ocupa — flashcard **+ jogo + personalização por prova**.

---

## 📁 Estrutura

```
index.html              # entrada — carrega tudo
assets/
  css/styles.css        # design system + todos os componentes
  js/
    data.js             # dados mock (matérias, cards, aluno, escola, ranking)
    ui.js               # router, render, toasts, confete, gráficos SVG
    student.js          # telas do aluno
    school.js           # portal da escola
    app.js              # bootstrap
```

Arquitetura simples (SPA com router por estado, sem framework) **de propósito**:
o objetivo é iterar rápido na experiência. Quando o fluxo estiver aprovado, isso
vira a base/spec para o app real (sugestão: React/React Native + Capacitor/Electron
para App Store, Google Play e Windows).

---

## 🚧 Próximos passos sugeridos

1. Validar fluxos e telas (clicar em tudo, anotar o que muda).
2. Definir mascote (ou não) e refinar microcopy.
3. Especificar backend: contas (aluno/escola), licenças, banco de cards, motor de
   repetição espaçada, IA de recomendação.
4. Migrar para stack de produção multiplataforma.

---

*Protótipo — todos os dados são fictícios e ilustrativos.*
