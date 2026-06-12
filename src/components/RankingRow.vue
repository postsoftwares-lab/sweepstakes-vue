<script setup lang="ts">
import type { LeaderboardEntry } from '@/stores/leaderboard'
import { useLeaderboardStore } from '@/stores/leaderboard'

const props = defineProps<{
  entry: LeaderboardEntry
  isCurrentUser?: boolean
}>()

const leaderboardStore = useLeaderboardStore()
const movement = leaderboardStore.getRankMovement(props.entry)
const displayName = props.entry.name || props.entry.username
</script>

<template>
  <div :class="['ranking-row', isCurrentUser && 'ranking-row--me']">
    <!-- Posição -->
    <div class="rank-pos">{{ entry.current_rank }}</div>

    <!-- Nome + movimento -->
    <div class="rank-name-wrap">
      <span :class="['rank-arrow', `arrow--${movement}`]">
        {{ movement === 'up' ? '↑' : movement === 'down' ? '↓' : '—' }}
      </span>
      <span class="rank-name">{{ displayName }}</span>
      <span v-if="isCurrentUser" class="rank-you">você</span>
    </div>

    <!-- Stats compactos + pontos -->
    <div class="rank-right">
      <div class="rank-stats">
        <span class="stat" title="Placares exatos">🎯 {{ entry.correct_count }}</span>
        <span class="stat" title="Resultados corretos">✓ {{ entry.correct_results }}</span>
      </div>
      <div class="rank-score">{{ entry.score }}</div>
    </div>
  </div>
</template>

<style scoped>
.ranking-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.1s;
}
.ranking-row:last-child { border-bottom: none; }
.ranking-row:hover      { background: #f9fafb; }
.ranking-row--me        { background: #f0fdf4; }
.ranking-row--me:hover  { background: #dcfce7; }

.rank-pos {
  width: 24px;
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  flex-shrink: 0;
  text-align: center;
}

.rank-name-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
}
.rank-arrow {
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}
.arrow--up   { color: #16a34a; }
.arrow--down { color: #ef4444; }
.arrow--same { color: #d1d5db; }

.rank-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.rank-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}
.rank-stats {
  display: flex;
  gap: 8px;
}
.stat {
  font-size: 11px;
  color: #9ca3af;
}
.rank-score {
  font-size: 18px;
  font-weight: 800;
  color: #16a34a;
  line-height: 1;
}
</style>
