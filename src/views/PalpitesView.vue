<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMatchesStore } from '@/stores/matches'
import { usePredictionsStore } from '@/stores/predictions'
import AppHeader from '@/components/AppHeader.vue'
import MatchCard from '@/components/MatchCard.vue'

const authStore = useAuthStore()
const matchesStore = useMatchesStore()
const predictionsStore = usePredictionsStore()

const expandedGroups = ref<Record<string, boolean>>({})

onMounted(async () => {
  if (authStore.participant?.id) {
    await matchesStore.fetchMatches(authStore.participant.id)
    // Expande o primeiro grupo por padrão
    if (matchesStore.groupNames.length > 0) {
      expandedGroups.value[matchesStore.groupNames[0]] = true
    }
  }
})

const toggleGroup = (groupName: string) => {
  expandedGroups.value[groupName] = !expandedGroups.value[groupName]
}

const isGroupExpanded = (groupName: string) => {
  return expandedGroups.value[groupName] || false
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

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header da Rodada -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Rodada Atual</h1>
            <p class="text-gray-600 mt-1">Fase de Grupos</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-green-600">
              {{ matchesStore.predictedCount }}/{{ matchesStore.totalMatches }}
            </div>
            <p class="text-sm text-gray-600">palpites feitos</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="matchesStore.loading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-4">
          <svg class="animate-spin h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <p class="text-gray-600">Carregando partidas...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="matchesStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-red-900">Erro ao carregar partidas</h3>
            <p class="text-sm text-red-700">{{ matchesStore.error }}</p>
          </div>
        </div>
      </div>

      <!-- Groups -->
      <div v-else class="space-y-6">
        <div
          v-for="groupName in matchesStore.groupNames"
          :key="groupName"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <!-- Group Header -->
          <button
            @click="toggleGroup(groupName)"
            class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-bold text-gray-900">Grupo {{ groupName }}</h2>
              <span class="text-sm text-gray-500">
                {{ matchesStore.matchesByGroup(groupName).length }} partidas
              </span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-600">
                {{ matchesStore.predictedCountByGroup(groupName) }}/{{ matchesStore.matchesByGroup(groupName).length }} palpites
              </span>
              <svg
                :class="['w-5 h-5 text-gray-400 transition-transform', isGroupExpanded(groupName) ? 'rotate-180' : '']"
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
            class="p-4 space-y-4 bg-gray-50"
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
      <div v-if="!matchesStore.loading && matchesStore.groupNames.length === 0" class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhuma partida disponível</h3>
        <p class="mt-2 text-gray-600">Não há partidas para a rodada atual.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Remove setas do input number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
