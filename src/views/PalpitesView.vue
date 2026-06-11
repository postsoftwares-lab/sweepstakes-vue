<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import MatchCard from '@/components/MatchCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useMatchesStore } from '@/stores/matches'
import { usePredictionsStore } from '@/stores/predictions'
import { onMounted, ref } from 'vue'

const authStore = useAuthStore()
const matchesStore = useMatchesStore()
const predictionsStore = usePredictionsStore()

const expandedGroup = ref<string | null>(null)
const showScoringModal = ref(!localStorage.getItem('scoring_explained'))

const dismissModal = () => {
  localStorage.setItem('scoring_explained', '1')
  showScoringModal.value = false
}

onMounted(async () => {
  if (authStore.participant?.id) {
    await matchesStore.fetchMatches(authStore.participant.id)
    if (matchesStore.groupNames.length > 0) {
      expandedGroup.value = matchesStore.groupNames[0]
    }
  }
})

const toggleGroup = (groupName: string) => {
  expandedGroup.value = expandedGroup.value === groupName ? null : groupName
}

const isGroupExpanded = (groupName: string) => {
  return expandedGroup.value === groupName
}

const handleSavePrediction = async (matchId: string, homeScore: number, awayScore: number) => {
  if (!authStore.participant?.id) return

  const success = await predictionsStore.createOrUpdatePrediction(
    authStore.participant.id,
    matchId,
    homeScore,
    awayScore
  )

  if (success) {
    console.log('Palpite salvo com sucesso!')
  } else {
    console.error('Erro ao salvar palpite:', predictionsStore.error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />

    <!-- Modal de pontuação -->
    <Transition name="modal">
      <div v-if="showScoringModal" class="modal-overlay" @click.self="dismissModal">
        <div class="modal-box">
          <p class="modal-title">Sistema de Pontuação</p>

          <div class="modal-example">
            <span class="example-match">México × Coreia do Sul — resultado real: <strong>2-1</strong></span>
          </div>

          <div class="modal-rules">
            <div class="modal-rule">
              <span class="rule-pts pts-3">3 pts</span>
              <div class="rule-desc">
                Placar exato
                <span class="rule-ex">Seu palpite foi 2-1 → acertou tudo!</span>
              </div>
            </div>
            <div class="modal-rule">
              <span class="rule-pts pts-1">1 pt</span>
              <div class="rule-desc">
                Resultado correto
                <span class="rule-ex">Seu palpite foi 1-0 → México ganhou, mas placar errado</span>
              </div>
            </div>
            <div class="modal-rule">
              <span class="rule-pts pts-0">0 pts</span>
              <div class="rule-desc">
                Resultado errado
                <span class="rule-ex">Seu palpite foi 0-1 → México perdeu no seu palpite, mas ganhou</span>
              </div>
            </div>
          </div>
          <button class="modal-ok" @click="dismissModal">Entendido</button>
        </div>
      </div>
    </Transition>

    <main class="w-full max-w-2xl mx-auto px-3 sm:px-5 py-5">
      <!-- Header da Rodada -->
      <div class="flex items-center justify-between mb-5">
        <div>
          <h1 class="text-xl font-bold text-gray-900 leading-tight">Rodada {{ matchesStore.currentRound }}</h1>
          <p class="text-sm text-gray-500 mt-0.5">Fase de Grupos</p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-green-600 leading-none">
            {{ matchesStore.predictedCount }}/{{ matchesStore.totalMatches }}
          </div>
          <p class="text-xs text-gray-500 mt-1">palpites feitos</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="matchesStore.loading" class="flex flex-col items-center justify-center py-16 gap-3">
        <svg class="animate-spin h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <p class="text-sm text-gray-500">Carregando partidas...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="matchesStore.error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="text-sm font-semibold text-red-900">Erro ao carregar partidas</h3>
            <p class="text-xs text-red-700 mt-0.5">{{ matchesStore.error }}</p>
          </div>
        </div>
      </div>

      <!-- Groups -->
      <div v-else class="space-y-3">
        <div
          v-for="groupName in matchesStore.groupNames"
          :key="groupName"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <!-- Group Header -->
          <button
            @click="toggleGroup(groupName)"
            class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div class="flex items-center gap-2">
              <h2 class="text-base font-bold text-gray-900">Grupo {{ groupName }}</h2>
              <span class="text-xs text-gray-400">
                {{ matchesStore.matchesByGroup(groupName).length }} partidas
              </span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs font-medium text-gray-500">
                {{ matchesStore.predictedCountByGroup(groupName) }}/{{ matchesStore.matchesByGroup(groupName).length }}
              </span>
              <svg
                :class="['w-4 h-4 text-gray-400 transition-transform duration-200', isGroupExpanded(groupName) ? 'rotate-180' : '']"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          <!-- Group Matches -->
          <div
            v-show="isGroupExpanded(groupName)"
            class="px-3 pb-3 pt-1 space-y-3 bg-gray-50"
          >
            <MatchCard
              v-for="match in matchesStore.matchesByGroup(groupName)"
              :key="match.id"
              :match="match"
              @save-prediction="handleSavePrediction"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!matchesStore.loading && matchesStore.groupNames.length === 0" class="text-center py-16">
        <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-base font-semibold text-gray-700">Nenhuma partida disponível</h3>
        <p class="mt-1 text-sm text-gray-400">Não há partidas para a rodada atual.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-box {
  background: #fff;
  border-radius: 16px;
  padding: 24px 20px 20px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
}
.modal-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  text-align: center;
}
.modal-rules { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.modal-rule  { display: flex; align-items: center; gap: 10px; }
.rule-pts {
  flex-shrink: 0;
  width: 44px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 0;
  border-radius: 6px;
}
.pts-3 { background: #dcfce7; color: #15803d; }
.pts-1 { background: #fef9c3; color: #854d0e; }
.pts-0 { background: #f3f4f6; color: #6b7280; }
.rule-desc {
  font-size: 13px;
  color: #374151;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.rule-ex { font-size: 11px; color: #9ca3af; line-height: 1.4; }

.modal-example {
  background: #f9fafb;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 14px;
}
.example-match { font-size: 12px; color: #6b7280; }
.modal-ok {
  width: 100%;
  padding: 11px;
  background: #16a34a;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
}
.modal-ok:hover { background: #15803d; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to       { opacity: 0; }
</style>
