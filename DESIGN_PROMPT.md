# Prompt de Design Visual - Sweepstakes/Bolão Copa do Mundo

## 📋 Contexto do Sistema

Sistema de bolão/palpites para Copa do Mundo onde participantes fazem previsões de placares e competem em um ranking. Frontend Vue.js consumindo API Supabase Edge Functions.

---

## 🎯 Telas Necessárias

### 1. TELA DE LOGIN/CADASTRO (Entry Point)
**Objetivo**: Capturar email do participante para entrar no bolão

**Elementos Visuais**:
- Logo/título do bolão centralizado
- Input de email com validação visual
- Botão "Entrar no Bolão" / "Começar a jogar"
- Mensagem de boas-vindas explicando rapidamente o sistema
- Fundo temático de futebol/copa (sutil, não poluído)

**UX Considerations**:
- Se email existe → entra direto
- Se não existe → cria automaticamente e entra
- Feedback visual de loading durante requisição
- Validação inline (email precisa ter @)

**Dados Salvos**:
- Após login bem-sucedido, armazenar participant_id e email localmente (localStorage/sessionStorage)

---

### 2. TELA PRINCIPAL - PALPITES (Core Feature)
**Objetivo**: Mostrar partidas da rodada atual e permitir fazer/editar palpites

**Layout Sugerido**:

#### Header/Navigation Bar
- Logo do bolão
- Nome/email do usuário logado
- Botão "Ver Ranking"
- Indicador de rodada atual (ex: "Rodada 1 - Grupo A")
- Data/hora atual do servidor

#### Seção de Filtros/Info
- Badge com grupo atual destacado
- Total de partidas na rodada
- Contador de palpites feitos (ex: "8 de 12 palpites")

#### Cards de Partidas (Loop de Matches)
Cada card deve conter:
- **Data e horário** da partida (formatado: "11/06 às 16h")
- **Cidade** onde será jogada
- **Status** visual (Scheduled/Live/Finished)
- **Bandeiras/escudos** dos times (home e away)
- **Nomes dos times** (home vs away)
- **Inputs de placar**:
  - Input numérico para home_score (0-99)
  - Separador visual (ex: " X " ou " - ")
  - Input numérico para away_score (0-99)
- **Botão de salvar/atualizar** palpite
- **Indicador visual** se palpite já foi feito (ex: ícone de check verde)
- Se partida já aconteceu:
  - Mostrar placar real
  - Mostrar o palpite que foi feito
  - Indicador se acertou (verde) ou errou (vermelho)

**Agrupamento**:
- Partidas agrupadas por grupo (A, B, C, etc.)
- Headers separadores entre grupos
- Possibilidade de collapse/expand grupos

**Estados dos Cards**:
- **Agendada (Scheduled)**: Inputs habilitados, pode editar
- **Ao Vivo (Live)**: Inputs desabilitados, mostra placar parcial
- **Finalizada (Finished)**: Inputs desabilitados, mostra resultado + comparação com palpite

**Interações**:
- Ao digitar placares, validação de 0-99
- Ao clicar em salvar → requisição à API → feedback de sucesso/erro
- Auto-save opcional (salvar ao sair do input)
- Animação de carregamento durante save

---

### 3. TELA DE RANKING/LEADERBOARD
**Objetivo**: Mostrar classificação dos participantes

**Layout Sugerido**:

#### Header
- Título "Classificação" / "Ranking"
- Botão para voltar aos palpites
- Data da última atualização

#### Tabela/Lista de Ranking
Cada linha deve mostrar:
- **Posição atual** (current_rank) - destaque visual para top 3 (ouro, prata, bronze)
- **Seta de movimento**: 
  - ↑ verde se subiu (current_rank < previous_rank)
  - ↓ vermelha se caiu (current_rank > previous_rank)
  - → cinza se manteve
- **Nome do participante** (username)
- **Pontuação total** (score) - destaque em bold
- **Placares exatos** acertados (correct_count)
- **Resultados corretos** (correct_results) - acertou vitória/empate/derrota

**Funcionalidades**:
- Destacar visualmente a linha do usuário logado (fundo diferente)
- Scroll smooth para a posição do usuário
- Podium visual para top 3 (opcional)
- Atualização em tempo real ou botão de refresh

**Design**:
- Usar cores e badges para as posições
- Animações sutis ao renderizar
- Responsivo (mobile-first)

---

### 4. TELA DE PERFIL/ESTATÍSTICAS (Opcional/Futura)
**Objetivo**: Mostrar histórico e estatísticas do participante

**Elementos**:
- Avatar/inicial do nome
- Email
- Total de palpites feitos
- Taxa de acerto
- Melhor rodada
- Gráfico de evolução no ranking
- Histórico de palpites por rodada

---

## 🎨 Guia de Estilo Visual

### Paleta de Cores Sugerida
- **Primária**: Verde bandeira (#009B3A) ou azul vibrante (#0066CC)
- **Secundária**: Amarelo (#FFD700) para destaques/badges
- **Sucesso**: Verde (#10B981)
- **Erro**: Vermelho (#EF4444)
- **Neutros**: Cinzas (#F3F4F6, #6B7280, #1F2937)
- **Fundo**: Branco (#FFFFFF) ou cinza muito claro (#F9FAFB)

### Tipografia
- **Títulos**: Font bold, tamanho grande (24-32px)
- **Subtítulos**: Font semibold (18-20px)
- **Corpo**: Font regular (14-16px)
- **Labels pequenos**: 12-14px
- Fontes sugeridas: Inter, Roboto, Poppins

### Componentes Visuais
- **Cards**: Bordas arredondadas (8-12px), sombra sutil
- **Botões**: Arredondados, estados hover/active/disabled claros
- **Inputs**: Bordas visíveis, focus state destacado
- **Badges**: Pequenos, arredondados, cores contrastantes
- **Ícones**: Consistentes, tamanho proporcional (Heroicons, Lucide, FontAwesome)

### Layout
- **Container máximo**: 1200px centrado
- **Padding**: 16-24px nas laterais (mobile), 32-48px (desktop)
- **Espaçamento entre elementos**: 16px (pequeno), 24px (médio), 32px (grande)
- **Grid de cards**: 1 coluna (mobile), 2 colunas (tablet), 3 colunas (desktop)

---

## 🔄 Fluxo de Usuário

```
1. Usuário acessa o site
   ↓
2. Tela de Login → Digita email → Clica em "Entrar"
   ↓
3. Sistema cria/busca participante → Salva ID localmente
   ↓
4. Redireciona para Tela Principal de Palpites
   ↓
5. Usuário vê partidas da rodada atual agrupadas
   ↓
6. Para cada partida:
   - Preenche placar casa (0-99)
   - Preenche placar fora (0-99)
   - Clica em "Salvar Palpite"
   - Recebe feedback visual de sucesso
   ↓
7. Usuário pode editar palpites já feitos (se partida não começou)
   ↓
8. Usuário clica em "Ver Ranking" no header
   ↓
9. Tela de Ranking mostra classificação
   - Vê sua posição destacada
   - Vê movimento (subiu/caiu/manteve)
   ↓
10. Usuário volta aos palpites
```

---

## 📱 Responsividade

### Mobile (< 768px)
- Menu hamburguer para navegação
- Cards em coluna única
- Inputs de placar maiores (touch-friendly)
- Tabela de ranking adaptada (colunas essenciais)
- Esconder colunas secundárias no ranking

### Tablet (768px - 1024px)
- 2 colunas de cards
- Menu expandido
- Tabela completa

### Desktop (> 1024px)
- 3 colunas de cards (ou 2 se cards maiores)
- Todas as informações visíveis
- Hover states mais ricos
- Sidebar fixa (opcional)

---

## ⚡ Animações e Feedback

### Micro-interações
- **Loading**: Spinner ou skeleton screens ao carregar dados
- **Success**: Check animado verde + toast notification
- **Error**: Shake animation + toast vermelho com mensagem
- **Save**: Botão muda para "Salvando..." → "Salvo!" com check
- **Rank change**: Animação da seta de subida/descida
- **Card hover**: Elevação sutil (shadow aumenta)

### Transições
- Navegação entre telas: Fade ou slide suave (200-300ms)
- Cards entrando: Stagger animation (aparecem em sequência)
- Modals: Fade + scale from center

---

## 🧩 Componentes Reutilizáveis

### Componentização Sugerida

1. **MatchCard.vue**
   - Props: match data, participantId, predictions
   - Emits: onSavePrediction
   - Slots: actions (opcional)

2. **PredictionInput.vue**
   - Props: value, disabled, max
   - Emits: update:modelValue
   - Validação inline

3. **RankingRow.vue**
   - Props: participant, isCurrentUser, showMovement
   - Classes condicionais para destaque

4. **GroupHeader.vue**
   - Props: groupName, matchCount
   - Design destacado

5. **LoadingSpinner.vue**
   - Props: size, color
   - Overlay opcional

6. **Toast/Notification.vue**
   - Props: type (success/error/info), message, duration
   - Auto-dismiss

7. **UserAvatar.vue**
   - Props: name, email
   - Gera iniciais automaticamente

8. **StatusBadge.vue**
   - Props: status (scheduled/live/finished)
   - Cores condicionais

---

## 📊 Estados e Dados

### LocalStorage/SessionStorage
```javascript
{
  "participant": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "user"
  },
  "lastSync": "2026-05-21T10:30:00Z"
}
```

### Pinia Stores Sugeridas

**authStore.js**
- participant (id, email, name)
- isAuthenticated
- login(email)
- logout()

**matchesStore.js**
- matches (array)
- currentRound
- currentGroup
- loading
- fetchMatches(participantId)
- groupedMatches (getter)

**predictionsStore.js**
- predictions (map: matchId -> prediction)
- createOrUpdatePrediction(data)
- getPredictionByMatch(matchId)

**leaderboardStore.js**
- rankings (array)
- loading
- fetchLeaderboard()
- currentUserRank (getter)

---

## 🎯 Priorização de Features

### MVP (Minimum Viable Product)
✅ Tela de Login (email apenas)
✅ Tela Principal de Palpites
✅ Card de Partida com inputs
✅ Salvar/Editar palpite
✅ Tela de Ranking básica
✅ Navegação entre telas

### V2 (Melhorias)
- Sistema de notificações
- Auto-save de palpites
- Filtros por grupo
- Busca no ranking
- Compartilhar ranking

### V3 (Avançado)
- Tela de estatísticas pessoais
- Gráficos de evolução
- Comparação com outros participantes
- Modo escuro
- PWA (Progressive Web App)
- Notificações push

---

## 🛠️ Tecnologias Frontend

**Core**
- Vue 3 (Composition API)
- Vue Router (navegação)
- Pinia (state management)
- Vite (build tool)

**HTTP Client**
- Axios ou Fetch API

**UI/Styling**
- Tailwind CSS (framework utility-first) **RECOMENDADO**
- ou Vuetify (component library)
- ou PrimeVue
- ou Bootstrap Vue

**Utilities**
- date-fns ou dayjs (formatação de datas)
- vueuse (composables utilitários)
- vue-toastification (notificações)

**Ícones**
- @heroicons/vue ou lucide-vue-next

---

## 🎬 Exemplo de Mockup (Texto)

```
┌─────────────────────────────────────────────────┐
│  ⚽ BOLÃO COPA 2026        👤 joao@example.com │
│                              🏆 Ver Ranking     │
├─────────────────────────────────────────────────┤
│  📅 Rodada 1 - Grupo A              4 partidas │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 11/06 às 16h • Brasília       📍         │ │
│  │                                           │ │
│  │  🇧🇷 Brasil    [2] x [1]  Sérvia 🇷🇸     │ │
│  │                                           │ │
│  │  [Salvar Palpite] ✅ Palpite salvo       │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 12/06 às 19h • São Paulo                 │ │
│  │                                           │ │
│  │  🇦🇷 Argentina  [__] x [__]  México 🇲🇽  │ │
│  │                                           │ │
│  │  [Fazer Palpite]                         │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  🏆 RANKING GERAL                               │
│  Última atualização: há 5 minutos               │
├─────────────────────────────────────────────────┤
│                                                 │
│  🥇 1  maria      👆  45 pts  (3📍 2✓)          │
│  🥈 2  joao       👇  40 pts  (2📍 3✓) ← VOCÊ  │
│  🥉 3  pedro      →   38 pts  (2📍 2✓)          │
│     4  ana        👆  35 pts  (1📍 4✓)          │
│     5  carlos     👇  30 pts  (1📍 3✓)          │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Implementação Visual

### Design System
- [ ] Definir paleta de cores final
- [ ] Escolher fonte tipográfica
- [ ] Definir tamanhos de espaçamento (design tokens)
- [ ] Criar guia de componentes (botões, inputs, cards)

### Assets
- [ ] Logo do bolão
- [ ] Bandeiras/escudos dos times (32 seleções)
- [ ] Ícones (ranking, palpites, perfil, etc)
- [ ] Imagem de fundo/hero (opcional)

### Protótipo
- [ ] Wireframe low-fidelity (papel/Figma)
- [ ] Protótipo high-fidelity (Figma/Adobe XD)
- [ ] Protótipo interativo para validação
- [ ] Testes de usabilidade com 3-5 usuários

### Acessibilidade
- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Labels em inputs
- [ ] Estados de foco visíveis
- [ ] Textos alternativos em imagens
- [ ] Navegação por teclado funcional

---

## 🎨 Referências de Design

**Inspirações de UI**
- Plataformas de apostas: Betano, Betfair (layout de odds)
- Apps de esportes: OneFootball, ESPN (cards de partidas)
- Jogos fantasy: Cartola FC (ranking e pontuação)
- Design systems: Material Design, Tailwind UI

**Estilo Recomendado**
- **Clean e moderno**: Espaços em branco, hierarquia clara
- **Esportivo mas profissional**: Verde/azul, não over-the-top
- **Mobile-first**: Maioria dos usuários em celular
- **Gamificado sutil**: Badges, progressão, mas não infantil

---

## 📌 Observações Finais

1. **Performance**: Lazy loading de imagens de bandeiras
2. **SEO**: Meta tags apropriadas (caso não seja SPA puro)
3. **PWA**: Considerar service worker para offline
4. **Analytics**: Integrar Google Analytics ou Plausible
5. **Testes**: E2E com Cypress, unit com Vitest
6. **Deploy**: Netlify, Vercel ou Cloudflare Pages

---

**Este prompt deve ser usado por designers (Figma/XD) ou para gerar mockups com IA (v0.dev, Galileo AI, etc.)**
