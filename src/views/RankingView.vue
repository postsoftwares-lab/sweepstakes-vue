<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import PodiumCard from '@/components/PodiumCard.vue'
import RankingRow from '@/components/RankingRow.vue'
import { useAuthStore } from '@/stores/auth'
import { useLeaderboardStore } from '@/stores/leaderboard'
import { computed, onMounted } from 'vue'

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

    <main class="page-main">
      <!-- Loading -->
      <div v-if="leaderboardStore.loading" class="state-center">
        <svg class="spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="state-text">Carregando ranking...</p>
      </div>

      <!-- Error -->
      <div v-else-if="leaderboardStore.error" class="error-box">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>{{ leaderboardStore.error }}</span>
      </div>

      <!-- Content -->
      <div v-else class="content">

        <!-- Pódio top 3 -->
        <div v-if="leaderboardStore.top3.length > 0" class="podium-wrap">
          <!-- Ordem: 2º | 1º | 3º para visual de pódio -->
          <PodiumCard
            v-if="leaderboardStore.top3[1]"
            :entry="leaderboardStore.top3[1]"
            :position="2"
            :is-current-user="isCurrentUser(leaderboardStore.top3[1].user_id)"
          />
          <PodiumCard
            v-if="leaderboardStore.top3[0]"
            :entry="leaderboardStore.top3[0]"
            :position="1"
            :is-current-user="isCurrentUser(leaderboardStore.top3[0].user_id)"
          />
          <PodiumCard
            v-if="leaderboardStore.top3[2]"
            :entry="leaderboardStore.top3[2]"
            :position="3"
            :is-current-user="isCurrentUser(leaderboardStore.top3[2].user_id)"
          />
        </div>

        <!-- Tabela geral -->
        <div class="ranking-card">
          <div class="ranking-header">
            <span class="ranking-title">Classificação Geral</span>
            <span class="ranking-count">{{ leaderboardStore.rankings.length }} participantes</span>
          </div>

          <div v-if="leaderboardStore.sortedRankings.length > 0">
            <RankingRow
              v-for="entry in leaderboardStore.sortedRankings"
              :key="entry.id"
              :entry="entry"
              :is-current-user="isCurrentUser(entry.user_id)"
            />
          </div>

          <div v-else class="empty-state">
            <p class="empty-title">Nenhum participante ainda</p>
            <p class="empty-sub">Seja o primeiro a fazer seus palpites!</p>
          </div>
        </div>

        <!-- Minha posição (se fora do top 10) -->
        <div v-if="currentUserRank && currentUserRank.current_rank > 10" class="my-pos">
          <div>
            <p class="my-pos-label">Sua posição</p>
            <p class="my-pos-rank">{{ currentUserRank.current_rank }}°</p>
          </div>
          <div class="text-right">
            <p class="my-pos-label">Pontos</p>
            <p class="my-pos-score">{{ currentUserRank.score }}</p>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.page-main {
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
  padding: 16px 12px 32px;
}

/* Loading / Error */
.state-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 48px 0;
}
.spin {
  width: 36px;
  height: 36px;
  color: #16a34a;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.state-text { font-size: 13px; color: #6b7280; }

.error-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 13px;
  color: #b91c1c;
}

/* Content */
.content { display: flex; flex-direction: column; gap: 12px; }

/* Pódio horizontal */
.podium-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: end;
  gap: 8px;
}

/* Tabela */
.ranking-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}
.ranking-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}
.ranking-title {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}
.ranking-count {
  font-size: 12px;
  color: #9ca3af;
}

/* Empty */
.empty-state {
  padding: 40px 20px;
  text-align: center;
}
.empty-title { font-size: 14px; font-weight: 600; color: #374151; }
.empty-sub   { font-size: 13px; color: #9ca3af; margin-top: 4px; }

/* Minha posição */
.my-pos {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 12px;
  padding: 14px 16px;
}
.my-pos-label { font-size: 11px; color: #6b7280; }
.my-pos-rank  { font-size: 22px; font-weight: 800; color: #16a34a; }
.my-pos-score { font-size: 22px; font-weight: 800; color: #111827; }
</style>
