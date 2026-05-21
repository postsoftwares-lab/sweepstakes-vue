<script setup lang="ts">
import type { LeaderboardEntry } from '@/stores/leaderboard'

const props = defineProps<{
  entry: LeaderboardEntry
  position: 1 | 2 | 3
}>()

const podiumConfig = {
  1: {
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-900',
    icon: '🏆',
    label: '1º'
  },
  2: {
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-900',
    icon: '🥈',
    label: '2º'
  },
  3: {
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-900',
    icon: '🥉',
    label: '3º'
  }
}

const config = podiumConfig[props.position]
</script>

<template>
  <div
    :class="[
      'rounded-2xl border-2 p-6 text-center transition-all',
      config.bgColor,
      config.borderColor,
      position === 1 ? 'transform scale-105' : ''
    ]"
  >
    <!-- Icon -->
    <div class="text-4xl mb-2">{{ config.icon }}</div>
    
    <!-- Position -->
    <div :class="['text-2xl font-bold mb-2', config.textColor]">
      {{ config.label }}
    </div>
    
    <!-- Username -->
    <div class="text-lg font-semibold text-gray-900 mb-2">
      {{ entry.username }}
    </div>
    
    <!-- Score -->
    <div class="text-3xl font-bold text-green-600">
      {{ entry.score }}
    </div>
    <div class="text-sm text-gray-600">pontos</div>
  </div>
</template>
