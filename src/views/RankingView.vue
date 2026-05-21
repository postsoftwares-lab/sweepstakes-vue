<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLeaderboardStore } from '@/stores/leaderboard'
import AppHeader from '@/components/AppHeader.vue'
import PodiumCard from '@/components/PodiumCard.vue'
import RankingRow from '@/components/RankingRow.vue'

const authStore = useAuthStore()
const leaderboardStore = useLeaderboardStore()

onMounted(async () => {
  await leaderboardStore.fetchLeaderboard()
})

const currentUserRank = computed(() => {
  if (!authStore.participant?.id) return null
  return leaderboardStore.getUserRank(authStore.participant.id)
})

const isCurrentUser = (userId: string) => {
  return userId === authStore.participant?.id
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="leaderboardStore.loading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-4">
          <svg class="animate-spin h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <p class="text-gray-600">Carregando ranking...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="leaderboardStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-red-900">Erro ao carregar ranking</h3>
            <p class="text-sm text-red-700">{{ leaderboardStore.error }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Podium (Top 3) -->
        <div v-if="leaderboardStore.top3.length > 0" class="mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <!-- 2nd Place -->
            <div v-if="leaderboardStore.top3[1]" class="order-1 md:order-1">
              <PodiumCard :entry="leaderboardStore.top3[1]" :position="2" />
            </div>

            <!-- 1st Place -->
            <div v-if="leaderboardStore.top3[0]" class="order-first md:order-2">
              <PodiumCard :entry="leaderboardStore.top3[0]" :position="1" />
            </div>

            <!-- 3rd Place -->
            <div v-if="leaderboardStore.top3[2]" class="order-2 md:order-3">
              <PodiumCard :entry="leaderboardStore.top3[2]" :position="3" />
            </div>
          </div>
        </div>

        <!-- Full Ranking Table -->
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 class="text-xl font-bold text-gray-900">Classificação Geral</h2>
          </div>

          <!-- Table Content -->
          <div v-if="leaderboardStore.rankings.length > 0">
            <RankingRow
              v-for="entry in leaderboardStore.rankings"
              :key="entry.id"
              :entry="entry"
              :is-current-user="isCurrentUser(entry.user_id)"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhum participante ainda</h3>
            <p class="mt-2 text-gray-600">Seja o primeiro a fazer seus palpites!</p>
          </div>
        </div>

        <!-- User Position Info (if not in top 10) -->
        <div
          v-if="currentUserRank && currentUserRank.current_rank > 10"
          class="mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Sua posição atual</p>
              <p class="text-2xl font-bold text-green-600">{{ currentUserRank.current_rank }}º lugar</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Pontos</p>
              <p class="text-2xl font-bold text-gray-900">{{ currentUserRank.score }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
