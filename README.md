# 🏆 Sweepstakes Vue - Bolão Copa 2026

Sistema completo de bolão para Copa do Mundo 2026. Faça seus palpites de placares, compete com amigos e dispute o primeiro lugar no ranking!

Frontend desenvolvido em Vue 3 + TypeScript + Tailwind CSS, integrado com backend serverless Supabase Edge Functions.

## 🚀 Tecnologias

- **Vue 3** - Framework JavaScript progressivo
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Vue Router** - Roteamento SPA
- **Pinia** - State management
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP

## 📁 Estrutura do Projeto

```
sweepstakes-vue/
├── src/
│   ├── assets/          # CSS e recursos estáticos
│   ├── components/      # Componentes reutilizáveis
│   ├── router/          # Configuração de rotas
│   ├── services/        # APIs e serviços externos
│   ├── stores/          # Pinia stores (state management)
│   ├── views/           # Páginas/Views principais
│   ├── App.vue          # Componente raiz
│   └── main.ts          # Entry point
├── public/              # Arquivos públicos estáticos
├── .env                 # Variáveis de ambiente
└── index.html           # HTML template
```

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Setup

```bash
# Instalar dependências
npm install

# Configurar variável de ambiente
# Edite o arquivo .env se necessário
# VITE_API_URL=http://127.0.0.1:54321/functions/v1

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

O app estará disponível em `http://localhost:5173`

## ⚽ Funcionalidades

### ✅ Sistema de Login (100% Completo)
- **Entrada rápida com email** - Sem necessidade de senha
- **Criação automática de conta** - Primeiro acesso cria participante automaticamente
- **Nome extraído do email** - Sistema inteligente que usa a parte antes do @
- **Persistência de sessão** - Mantém login entre sessões
- **Validação em tempo real** - Feedback instantâneo de erros
- **Design responsivo** - Mobile-first com Tailwind CSS

### ✅ Fazer Palpites (100% Completo)
- **Visualizar partidas** da rodada atual
- **Agrupamento inteligente** por grupos (A, B, C, etc.) com accordion
- **Placares de 0-99** para cada time com validação
- **Editar palpites** antes do início da partida
- **Status das partidas** (Agendada / Ao Vivo / Finalizada)
- **Ver resultado real** após término da partida
- **Contador de palpites** feitos (X/Y por grupo e total)
- **Indicador visual** de palpite salvo (✓ verde)
- **Dados mockados** para testar sem backend

### ✅ Sistema de Ranking (100% Completo)
- **Pódio especial** para top 3 (ouro, prata, bronze)
- **Leaderboard em tempo real** - Classificação completa
- **Indicadores visuais** de movimento (↑ subiu / ↓ caiu / → manteve)
- **Estatísticas detalhadas**:
  - 🎯 Placares exatos acertados
  - ✓ Resultados corretos (vitória/empate)
- **Destaque do usuário** na tabela (background verde)
- **Card de posição** para quem está fora do top 10
- **Design responsivo** com grid adaptável
- **Dados mockados** para desenvolvimento

### 📊 Regras de Pontuação
- **Placar Exato**: +10 pontos (acertou ambos os placares)
- **Resultado Correto**: +5 pontos (acertou vencedor ou empate)
- **Palpite Errado**: 0 pontos

### 🗓️ Sistema de Rodadas
- **Rodada 1**: Fase de Grupos - até 18/06/2026
- **Rodada 2**: Fase de Grupos - até 24/06/2026
- **Rodada 3**: Fase de Grupos - até 28/06/2026
- Sistema detecta rodada automaticamente baseado na data

## 🌐 Integração com Backend

O frontend consome **6 Edge Functions** do Supabase (Deno runtime):

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/create-participant` | POST | Criar novo participante ou retornar existente |
| `/participant` | GET | Buscar participante por email |
| `/get-matches` | GET | Listar partidas da rodada atual (com previsões opcionais) |
| `/create-prediction` | POST | Criar ou atualizar palpite de placar |
| `/leaderboard` | GET | Obter ranking completo ordenado |
| `/update-leaderboard` | POST | Recalcular pontuação (admin) |

**URL Base**: Configurável via `VITE_API_URL` no `.env`
- **Local**: `http://127.0.0.1:54321/functions/v1`
- **Produção**: `https://seu-projeto.supabase.co/functions/v1`

## 🔐 Autenticação

Sistema simples baseado em email:
- Participante é criado automaticamente ao fazer login
- Dados salvos no `localStorage`
- Guards de rota protegem páginas autenticadas
- Store Pinia (`authStore`) gerencia estado de autenticação

## 📱 Responsividade

- **MoRoadmap de Desenvolvimento

### Sprint 1 - Tela de Palpites 🚧
- [ ] Componente `MatchCard.vue` para exibir partidas
- [ ] Componente `PredictionInput.vue` para inputs de placar
- [ ] Buscar matches via API `/get-matches`
- [ ] Agrupamento por grupos (A, B, C...)
- [ ] Salvar/atualizar palpites via API
- [ ] Loading e error states
- [ ] Indicador visual de palpites salvos

### Sprint 2 - Tela de Ranking 🚧
- [ ] Componente `RankingRow.vue` para linhas da tabela
- [ ] Buscar leaderboard via API
- [ ] Tabela responsiva ordenada por pontos
- [ ] Setas de movimento (↑↓→)
- [ ] Destaque visual do usuário logado
- [ ] Badges especiais para top 3
- [ ] Auto-refresh opcional

##**[DESIGN_PROMPT.md](./DESIGN_PROMPT.md)** - Guia completo de design e especificações visuais
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Documentação do setup e estrutura do projeto
- **Edge Functions Docs** - Documentação completa das 6 APIs do backend

## 🧪 Testes Locais
Contribuições são bem-vindas! Siga os passos:

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/sweepstakes-vue.git`
3. **Crie uma branch** feature: `git checkout -b feature/minha-feature`
4. **Commit** suas mudanças: `git commit -m 'feat: adiciona nova feature'`
5. **Push** para a branch: `git push origin feature/minha-feature`
6. Abra um **Pull Request**

### Convenções de Commit
Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Alterações em documentação
- `style:` - Formatação, ponto e vírgula, etc
- `refactor:` - Refatoração de código
- `test:` - Adicionar testes
- `chore:` - Tarefas de build, configs, etc

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE.md](LICENSE.md) para detalhes completos.

Você é livre para usar, copiar, modificar e distribuir este software, desde que mantenha o aviso de copyright.

---

## 👥 Autores e Reconhecimentos

Desenvolvido para a **Copa do Mundo 2026** 🇺🇸🇨🇦🇲🇽

### Stack
- Frontend: Vue 3 + TypeScript + Tailwind CSS
- Backend: Supabase Edge Functions (Deno)
- Banco de Dados: PostgreSQL (Supabase)
- Deploy: Netlify / Vercel + Supabase Cloud

---

<div align="center">

**⚽ Desenvolvido com paixão pelo futebol e tecnologia ⚽**

[Reportar Bug](https://github.com/seu-usuario/sweepstakes-vue/issues) • 
[Solicitar Feature](https://github.com/seu-usuario/sweepstakes-vue/issues) • 
[Documentação](./DESIGN_PROMPT.md)

</div>ctions/v1/create-participant \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@example.com"}'

# 2. Ver matches da rodada
curl http://127.0.0.1:54321/functions/v1/get-matches

# 3. Fazer palpite
curl -X POST http://127.0.0.1:54321/functions/v1/create-prediction \
  -H "Content-Type: application/json" \
  -d '{
    "participant_id": "UUID_DO_PARTICIPANTE",
    "match_id": "UUID_DO_MATCH",
    "predicted_home_score": 2,
    "predicted_away_score": 1
  }'

# 4. Ver ranking
curl http://127.0.0.1:54321/functions/v1/leaderboard
```

## 🛠️ Tecnologias e Dependências

### Core
- **Vue 3.4+** - Composition API
- **TypeScript 5.4** - Type safety
- **Vite 5.2** - Build tool ultra-rápido

### Roteamento e Estado
- **Vue Router 4.3** - Roteamento SPA com guards
- **Pinia 2.1** - State management oficial Vue

### UI e Estilo
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Compatibilidade cross-browser

### HTTP e API
- **Axios 1.6** - Cliente HTTP com interceptors

### Dev Tools
- **Vue DevTools** - Debug e inspeção
- **TypeScript Language Server** - IntelliSense
- [ ] Skeleton loaders para carregamento
- [ ] Animações de transição entre telas
- [ ] Feedback visual em ações assíncronas
- [ ] Tratamento global de erros
- [ ] Retry automático em falhas de rede

### Sprint 4 - Features Avançadas 🚀
- [ ] Tela de estatísticas pessoais
- [ ] Gráfico de evolução no ranking
- [ ] Histórico de palpites por rodada
- [ ] Comparação com outros participantes
- [ ] Sistema de notificações
- [ ] PWA com service worker
- [ ] Modo escuro/claro
3. Melhorias UX:
   - Toast notifications
   - Skeleton loaders
   - Animações de transição
   - PWA capabilities

## 📚 Documentação Adicional

- [DESIGN_PROMPT.md](./DESIGN_PROMPT.md) - Guia completo de design e especificações visuais
- [Edge Functions Documentation](./docs/edge-functions.md) - Documentação da API backend

## 🤝 Como Contribuir

1. Clone o repositório
2. Crie uma branch feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.

---

**Desenvolvido com ⚽ para a Copa 2026**
