<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePredictionsHistoryStore } from '@/stores/predictions-history'
import AppHeader from '@/components/AppHeader.vue'

const authStore = useAuthStore()
const predictionsHistoryStore = usePredictionsHistoryStore()

const expandedRound = ref<number | null>(null)

const toggleRound = (roundNumber: number) => {
  expandedRound.value = expandedRound.value === roundNumber ? null : roundNumber
}

const isRoundExpanded = (roundNumber: number) => {
  return expandedRound.value === roundNumber
}

const getStatusClass = (prediction: any) => {
  const match = prediction.matches
  if (match.home_score === null || match.away_score === null) return 'pending'

  const isExact =
    match.home_score === prediction.predicted_home_score &&
    match.away_score === prediction.predicted_away_score

  const isCorrect =
    (match.home_score > match.away_score && prediction.predicted_home_score > prediction.predicted_away_score) ||
    (match.home_score < match.away_score && prediction.predicted_home_score < prediction.predicted_away_score) ||
    (match.home_score === match.away_score && prediction.predicted_home_score === prediction.predicted_away_score)

  if (isExact) return 'exact'
  if (isCorrect) return 'correct'
  return 'wrong'
}

onMounted(async () => {
  if (authStore.participant?.id) {
    await predictionsHistoryStore.fetchPredictionsHistory(authStore.participant.id)
    if (predictionsHistoryStore.roundNumbers.length > 0) {
      expandedRound.value = predictionsHistoryStore.roundNumbers[0]
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <main class="w-full max-w-2xl mx-auto px-4 py-5">

      <!-- Page header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Meus Palpites</h1>
          <p class="page-sub">Histórico de previsões</p>
        </div>
        <div class="total-pts">
          <span class="total-num">{{ predictionsHistoryStore.totalPoints }}</span>
          <span class="total-label">pontos totais</span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="predictionsHistoryStore.loading" class="loading">
        <svg class="spinner" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <span>Carregando palpites...</span>
      </div>

      <!-- Error -->
      <div v-else-if="predictionsHistoryStore.error" class="error-box">
        {{ predictionsHistoryStore.error }}
      </div>

      <!-- Rounds -->
      <div v-else class="rounds">
        <div
          v-for="roundNumber in predictionsHistoryStore.roundNumbers"
          :key="roundNumber"
          class="round-block"
        >
          <!-- Round toggle -->
          <button class="round-toggle" @click="toggleRound(roundNumber)">
            <div class="round-left">
              <span class="round-name">Rodada {{ roundNumber }}</span>
              <span class="round-count">{{ predictionsHistoryStore.getPredictionsByRound(roundNumber).length }}</span>
            </div>
            <div class="round-right">
              <span class="round-pts">{{ predictionsHistoryStore.getRoundPoints(roundNumber) }} pts</span>
              <svg
                :class="['chevron', isRoundExpanded(roundNumber) && 'chevron-open']"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
          </button>

          <!-- Prediction rows -->
          <div v-show="isRoundExpanded(roundNumber)" class="pred-list">
            <div
              v-for="prediction in predictionsHistoryStore.getPredictionsByRound(roundNumber)"
              :key="prediction.id"
              :class="['pred-row', `row-${getStatusClass(prediction)}`]"
            >
              <span class="team t-home">{{ prediction.matches.home_team }}</span>
              <div class="score-block">
                <span class="score">{{ prediction.predicted_home_score }}</span>
                <span class="score-x">×</span>
                <span class="score">{{ prediction.predicted_away_score }}</span>
              </div>
              <span class="team t-away">{{ prediction.matches.away_team }}</span>
              <span :class="['pts-chip', `chip-${getStatusClass(prediction)}`]">
                {{ prediction.matches.home_score !== null ? prediction.points + 'pts' : '—' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-if="!predictionsHistoryStore.loading && predictionsHistoryStore.roundNumbers.length === 0"
        class="empty"
      >
        <p>Nenhum palpite encontrado</p>
      </div>

    </main>
  </div>
</template>

<style scoped>
/* ── Page header ─────────────────────────────────── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}
.page-title {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}
.page-sub {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}
.total-pts {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.total-num {
  font-size: 28px;
  font-weight: 800;
  color: #16a34a;
  line-height: 1;
}
.total-label {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 3px;
}

/* ── Loading / Error ─────────────────────────────── */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 56px 0;
  color: #6b7280;
  font-size: 14px;
}
.spinner {
  width: 28px;
  height: 28px;
  color: #16a34a;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-box {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 13px;
  color: #b91c1c;
}

/* ── Rounds ──────────────────────────────────────── */
.rounds {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.round-block {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.round-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.12s;
}
.round-toggle:hover { background: #f9fafb; }

.round-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.round-name {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}
.round-count {
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 1px 7px;
  border-radius: 99px;
}

.round-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.round-pts {
  font-size: 13px;
  font-weight: 700;
  color: #16a34a;
}
.chevron {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  transition: transform 0.2s;
  flex-shrink: 0;
}
.chevron-open { transform: rotate(180deg); }

/* ── Prediction rows ─────────────────────────────── */
.pred-list {
  border-top: 1px solid #f3f4f6;
  padding: 6px 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pred-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 10px 10px 12px;
  border-radius: 8px;
  border-left: 3px solid #e5e7eb;
}

.row-exact   { border-left-color: #16a34a; background: #f0fdf4; }
.row-correct { border-left-color: #f59e0b; background: #fffbeb; }
.row-wrong   { border-left-color: #ef4444; background: #fef2f2; }
.row-pending { border-left-color: #d1d5db; background: #f9fafb; }

.team {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  flex: 1;
  line-height: 1.3;
}
.t-home { text-align: right; }
.t-away { text-align: left; }

.score-block {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.score {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  width: 20px;
  text-align: center;
  line-height: 1;
}
.score-x {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 700;
}

.pts-chip {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 6px;
  flex-shrink: 0;
  min-width: 32px;
  text-align: center;
}
.chip-exact   { background: #dcfce7; color: #15803d; }
.chip-correct { background: #fef3c7; color: #92400e; }
.chip-wrong   { background: #fef2f2; color: #9ca3af; }
.chip-pending { background: #f3f4f6; color: #9ca3af; }

/* ── Empty ───────────────────────────────────────── */
.empty {
  text-align: center;
  padding: 56px 0;
  color: #9ca3af;
  font-size: 14px;
}
</style>
