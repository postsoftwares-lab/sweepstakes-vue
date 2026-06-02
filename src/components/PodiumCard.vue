<script setup lang="ts">
import type { LeaderboardEntry } from '@/stores/leaderboard'

const props = defineProps<{
  entry: LeaderboardEntry
  position: 1 | 2 | 3
  isCurrentUser?: boolean
}>()

const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }

const truncate = (name: string) => name.length > 10 ? name.slice(0, 10) + '…' : name
</script>

<template>
  <div :class="['podium-card', `pos-${position}`]">
    <span class="medal">{{ medals[position] }}</span>
    <span class="pos-label">{{ position }}°</span>
    <span class="username">{{ truncate(entry.username) }}</span>
    <span class="score">{{ entry.score }}</span>
    <span class="pts-label">pts</span>
  </div>
</template>

<style scoped>
.podium-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px 14px;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  text-align: center;
  transition: box-shadow 0.15s;
}
.podium-card.pos-1 {
  border-color: #fbbf24;
  background: #fffbeb;
  padding-top: 16px;
  padding-bottom: 18px;
}
.podium-card.pos-2 { background: #f9fafb; }
.podium-card.pos-3 { background: #f9fafb; }

.medal       { font-size: 22px; line-height: 1; }
.pos-label   { font-size: 11px; font-weight: 700; color: #9ca3af; letter-spacing: 0.04em; }
.username    { font-size: 12px; font-weight: 600; color: #111827; word-break: break-all; line-height: 1.3; }
.score       { font-size: 20px; font-weight: 800; color: #16a34a; line-height: 1; margin-top: 2px; }
.pts-label   { font-size: 10px; color: #9ca3af; }
</style>
