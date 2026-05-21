<script setup lang="ts">
import type { LeaderboardEntry } from '@/stores/leaderboard'
import { useLeaderboardStore } from '@/stores/leaderboard'

const props = defineProps<{
  entry: LeaderboardEntry
  isCurrentUser?: boolean
}>()

const leaderboardStore = useLeaderboardStore()

const movement = leaderboardStore.getRankMovement(props.entry)

const movementConfig = {
  up: {
    icon: '↑',
    color: 'text-green-600'
  },
  down: {
    icon: '↓',
    color: 'text-red-600'
  },
  same: {
    icon: '→',
    color: 'text-gray-400'
  }
}

const config = movementConfig[movement]
</script>

<template>
  <div
    :class="[
      'flex items-center justify-between py-4 px-6 border-b border-gray-200 hover:bg-gray-50 transition-colors',
      isCurrentUser ? 'bg-green-50 font-semibold' : ''
    ]"
  >
    <!-- Left: Position + Movement + Name -->
    <div class="flex items-center gap-4 flex-1">
      <!-- Position -->
      <div class="text-xl font-semibold text-gray-700 w-8">
        {{ entry.current_rank }}
      </div>

      <!-- Movement Arrow -->
      <div :class="['text-xl font-bold', config.color]">
        {{ config.icon }}
      </div>

      <!-- Name -->
      <div class="text-lg text-gray-900">
        {{ entry.username }}
      </div>
    </div>

    <!-- Right: Stats + Score -->
    <div class="flex items-center gap-6">
      <!-- Correct Count (Placares Exatos) -->
      <div class="flex items-center gap-1 text-gray-600">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 9.586V7z" />
        </svg>
        <span class="text-sm">{{ entry.correct_count }}</span>
      </div>

      <!-- Correct Results (Resultados Corretos) -->
      <div class="flex items-center gap-1 text-gray-600">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm">{{ entry.correct_results }}</span>
      </div>

      <!-- Score -->
      <div class="text-right min-w-[60px]">
        <div class="text-2xl font-bold text-green-600">
          {{ entry.score }}
        </div>
        <div class="text-xs text-gray-500">pts</div>
      </div>
    </div>
  </div>
</template>
