<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { useLeaderboardStore } from '@/stores/leaderboard'
import { useMatchesStore } from '@/stores/matches'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const leaderboardStore = useLeaderboardStore()
const matchesStore = useMatchesStore()

onMounted(async () => {
  await Promise.all([
    leaderboardStore.fetchLeaderboard(),
    authStore.participant?.id
      ? matchesStore.fetchMatches(authStore.participant.id)
      : Promise.resolve()
  ])
})

const prize = computed(() => leaderboardStore.rankings.length * 10 - 10)

const preview = computed(() => leaderboardStore.rankings.slice(0, 5))

const isMe = (userId: string) => userId === authStore.participant?.id

const movement = (entry: any) => leaderboardStore.getRankMovement(entry)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="page">

      <!-- Premiação -->
      <div class="prize-card">
        <div class="prize-label">💰 Total Arrecadado</div>
        <div class="prize-amount">R$ {{ prize.toFixed(2).replace('.', ',') }}</div>
        <div class="prize-sub">{{ leaderboardStore.rankings.length }} participantes × R$ 10,00</div>
      </div>

      <!-- Ranking preview -->
      <div class="section-card">
        <div class="section-head">
          <span class="section-title">🏆 Ranking</span>
          <button class="btn-link" @click="router.push({ name: 'ranking' })">
            Ver completo →
          </button>
        </div>

        <div v-if="leaderboardStore.loading" class="loading-row">
          <svg class="spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>

        <div v-else-if="preview.length === 0" class="empty-row">Nenhum participante ainda</div>

        <div v-else>
          <div
            v-for="entry in preview"
            :key="entry.id"
            :class="['rank-row', isMe(entry.user_id) && 'rank-row--me']"
          >
            <span class="rank-pos">{{ entry.current_rank }}</span>
            <span :class="['rank-arrow', `arrow--${movement(entry)}`]">
              {{ movement(entry) === 'up' ? '↑' : movement(entry) === 'down' ? '↓' : '—' }}
            </span>
            <span class="rank-name">
              {{ entry.username }}
              <span v-if="isMe(entry.user_id)" class="rank-you">você</span>
            </span>
            <span class="rank-score">{{ entry.score }} <small>pts</small></span>
          </div>
        </div>

      </div>

      <!-- Meus palpites desta rodada -->
      <div class="section-card">
        <div class="section-head">
          <span class="section-title">📋 Meus Palpites</span>
          <button class="btn-link" @click="router.push({ name: 'palpites' })">
            Fazer palpites →
          </button>
        </div>

        <div v-if="matchesStore.loading" class="loading-row">
          <svg class="spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>

        <div v-else class="predictions-info">
          <div class="pred-round">
            <span class="pred-round-label">Rodada {{ matchesStore.currentRound }}</span>
            <span class="pred-stage">Fase de Grupos</span>
          </div>

          <div class="pred-progress-wrap">
            <div class="pred-counts">
              <span class="pred-done">{{ matchesStore.predictedCount }}</span>
              <span class="pred-sep">/</span>
              <span class="pred-total">{{ matchesStore.totalMatches }}</span>
            </div>
            <div class="pred-bar-bg">
              <div
                class="pred-bar-fill"
                :style="{
                  width: matchesStore.totalMatches > 0
                    ? `${(matchesStore.predictedCount / matchesStore.totalMatches) * 100}%`
                    : '0%'
                }"
              />
            </div>
            <span class="pred-label">palpites feitos</span>
          </div>

          <div v-if="matchesStore.predictedCount === matchesStore.totalMatches && matchesStore.totalMatches > 0"
               class="pred-complete">
            ✅ Todos os palpites feitos!
          </div>
          <div v-else class="pred-pending">
            {{ matchesStore.totalMatches - matchesStore.predictedCount }} palpites pendentes
          </div>
        </div>
      </div>

      <!-- Sistema de pontuação -->
      <div class="section-card">
        <div class="section-head">
          <span class="section-title">📌 Sistema de Pontuação</span>
        </div>
        <div class="scoring-body">
          <div class="scoring-example">
            México × Coreia do Sul — resultado real: <strong>2-1</strong>
          </div>
          <div class="scoring-rules">
            <div class="scoring-rule">
              <span class="s-pts s-3">3 pts</span>
              <div class="s-desc">
                Placar exato
                <span class="s-ex">Palpite 2-1 → acertou tudo!</span>
              </div>
            </div>
            <div class="scoring-rule">
              <span class="s-pts s-1">1 pt</span>
              <div class="s-desc">
                Resultado correto
                <span class="s-ex">Palpite 1-0 → México ganhou, mas placar errado</span>
              </div>
            </div>
            <div class="scoring-rule">
              <span class="s-pts s-0">0 pts</span>
              <div class="s-desc">
                Resultado errado
                <span class="s-ex">Palpite 0-1 → errou quem ganhou</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Regra de premiação -->
      <div class="section-card">
        <div class="section-head">
          <span class="section-title">🏅 Distribuição dos Prêmios</span>
        </div>
        <div class="prize-dist-body">
          <div class="dist-row dist-1">
            <span class="dist-medal">🥇</span>
            <div class="dist-info">
              <span class="dist-place">1º lugar</span>
              <span class="dist-pct">60% do total arrecadado</span>
            </div>
            <span class="dist-value">60%</span>
          </div>
          <div class="dist-row dist-2">
            <span class="dist-medal">🥈</span>
            <div class="dist-info">
              <span class="dist-place">2º lugar</span>
              <span class="dist-pct">30% do total arrecadado</span>
            </div>
            <span class="dist-value">30%</span>
          </div>
          <div class="dist-row dist-3">
            <span class="dist-medal">🥉</span>
            <div class="dist-info">
              <span class="dist-place">3º lugar</span>
              <span class="dist-pct">10% do total arrecadado</span>
            </div>
            <span class="dist-value">10%</span>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
  padding: 14px 12px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Premiação */
.prize-card {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  border-radius: 14px;
  padding: 20px 20px 18px;
  text-align: center;
  color: #fff;
}
.prize-label  { font-size: 13px; font-weight: 500; opacity: 0.85; margin-bottom: 6px; }
.prize-amount { font-size: 36px; font-weight: 900; letter-spacing: -1px; line-height: 1; }
.prize-sub    { font-size: 12px; opacity: 0.7; margin-top: 6px; }

/* Cards de seção */
.section-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}
.section-title { font-size: 14px; font-weight: 700; color: #111827; }
.btn-link {
  font-size: 12px;
  font-weight: 600;
  color: #16a34a;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.btn-link:hover { text-decoration: underline; }

/* Loading */
.loading-row {
  display: flex;
  justify-content: center;
  padding: 20px;
}
.spin {
  width: 24px; height: 24px;
  color: #16a34a;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.empty-row { font-size: 13px; color: #9ca3af; text-align: center; padding: 20px; }

/* Ranking rows */
.rank-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-bottom: 1px solid #f9fafb;
  transition: background 0.1s;
}
.rank-row:last-child  { border-bottom: none; }
.rank-row--me         { background: #f0fdf4; }
.rank-pos {
  width: 20px;
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  flex-shrink: 0;
  text-align: center;
}
.rank-arrow { font-size: 11px; font-weight: 700; flex-shrink: 0; }
.arrow--up   { color: #16a34a; }
.arrow--down { color: #ef4444; }
.arrow--same { color: #d1d5db; }
.rank-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
}
.rank-you {
  font-size: 10px;
  font-weight: 600;
  color: #16a34a;
  background: #dcfce7;
  padding: 1px 5px;
  border-radius: 4px;
  flex-shrink: 0;
}
.rank-score {
  font-size: 15px;
  font-weight: 800;
  color: #16a34a;
  flex-shrink: 0;
}
.rank-score small { font-size: 10px; color: #9ca3af; font-weight: 400; }
.rank-separator {
  text-align: center;
  font-size: 14px;
  color: #d1d5db;
  padding: 4px 0;
  letter-spacing: 3px;
}

/* Predictions info */
.predictions-info { padding: 16px; }
.pred-round { margin-bottom: 14px; }
.pred-round-label { font-size: 15px; font-weight: 700; color: #111827; display: block; }
.pred-stage       { font-size: 12px; color: #6b7280; }
.pred-progress-wrap { margin-bottom: 10px; }
.pred-counts {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-bottom: 6px;
}
.pred-done  { font-size: 28px; font-weight: 900; color: #16a34a; line-height: 1; }
.pred-sep   { font-size: 18px; color: #9ca3af; }
.pred-total { font-size: 18px; font-weight: 700; color: #6b7280; }
.pred-label { font-size: 11px; color: #9ca3af; display: block; margin-top: 2px; }
.pred-bar-bg {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 8px;
}
.pred-bar-fill {
  height: 100%;
  background: #16a34a;
  border-radius: 3px;
  transition: width 0.4s ease;
}
.pred-complete { font-size: 13px; font-weight: 600; color: #16a34a; margin-top: 8px; }
.pred-pending  { font-size: 12px; color: #9ca3af; margin-top: 6px; }

/* Pontuação */
.scoring-body    { padding: 12px 16px 16px; }
.scoring-example {
  font-size: 12px;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 12px;
}
.scoring-rules { display: flex; flex-direction: column; gap: 10px; }
.scoring-rule  { display: flex; align-items: flex-start; gap: 10px; }
.s-pts {
  flex-shrink: 0;
  width: 44px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 0;
  border-radius: 6px;
  margin-top: 1px;
}
.s-3 { background: #dcfce7; color: #15803d; }
.s-1 { background: #fef9c3; color: #854d0e; }
.s-0 { background: #f3f4f6; color: #6b7280; }
.s-desc {
  font-size: 13px;
  color: #374151;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.s-ex { font-size: 11px; color: #9ca3af; line-height: 1.4; }

/* Distribuição de prêmios */
.prize-dist-body { padding: 8px 12px 12px; display: flex; flex-direction: column; gap: 4px; }
.dist-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border-radius: 10px;
}
.dist-1 { background: #fffbeb; }
.dist-2 { background: #f9fafb; }
.dist-3 { background: #fff7ed; }
.dist-medal { font-size: 20px; flex-shrink: 0; }
.dist-info { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.dist-place { font-size: 13px; font-weight: 700; color: #111827; }
.dist-pct   { font-size: 11px; color: #9ca3af; }
.dist-value { font-size: 15px; font-weight: 800; color: #16a34a; flex-shrink: 0; }
</style>
