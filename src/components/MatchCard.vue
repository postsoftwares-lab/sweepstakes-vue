<script setup lang="ts">
import { ref, computed } from 'vue'

interface Match {
  id: string
  stage: string
  group_name: string
  round_number: number
  match_date: string
  home_team: string
  away_team: string
  city: string
  status: 'scheduled' | 'live' | 'finished'
  home_score: number | null
  away_score: number | null
  predicted_home_score: number | null
  predicted_away_score: number | null
}

const props = defineProps<{
  match: Match
}>()

const emit = defineEmits<{
  savePrediction: [matchId: string, homeScore: number, awayScore: number]
}>()

const homeScore = ref<number | null>(props.match.predicted_home_score)
const awayScore = ref<number | null>(props.match.predicted_away_score)
const isSaving = ref(false)

const hasPrediction = computed(() => {
  return props.match.predicted_home_score !== null && props.match.predicted_away_score !== null
})

const isEditable = computed(() => {
  return props.match.status === 'scheduled'
})

const statusBadge = computed(() => {
  const badges = {
    scheduled: { text: 'Agendado', class: 'bg-yellow-100 text-yellow-800' },
    live: { text: 'Ao Vivo', class: 'bg-red-100 text-red-800' },
    finished: { text: 'Concluído', class: 'bg-gray-100 text-gray-800' }
  }
  return badges[props.match.status]
})

const formattedDate = computed(() => {
  const date = new Date(props.match.match_date)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}/${month} às ${hours}h${minutes !== '00' ? minutes : ''}`
})

const handleSave = () => {
  if (homeScore.value !== null && awayScore.value !== null) {
    isSaving.value = true
    emit('savePrediction', props.match.id, homeScore.value, awayScore.value)
    setTimeout(() => {
      isSaving.value = false
    }, 500)
  }
}

const validateInput = (event: Event, type: 'home' | 'away') => {
  const input = event.target as HTMLInputElement
  let value = parseInt(input.value)
  
  if (isNaN(value) || value < 0) value = 0
  if (value > 99) value = 99
  
  if (type === 'home') {
    homeScore.value = value
  } else {
    awayScore.value = value
  }
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="text-sm text-gray-600">
        <span class="font-medium">{{ formattedDate }}</span>
        <span class="mx-2">•</span>
        <span>{{ match.city }}</span>
      </div>
      <span :class="['px-2 py-1 rounded-full text-xs font-medium', statusBadge.class]">
        {{ statusBadge.text }}
      </span>
    </div>

    <!-- Teams and Scores -->
    <div class="flex items-center justify-between gap-4 mb-4">
      <!-- Home Team -->
      <div class="flex-1 flex items-center justify-end gap-3">
        <div class="text-right">
          <div class="font-semibold text-gray-900 text-lg">{{ match.home_team }}</div>
          <div class="text-sm text-gray-500">{{ match.home_team.substring(0, 2).toUpperCase() }}</div>
        </div>
        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <span class="text-xl">🏴</span>
        </div>
      </div>

      <!-- Scores -->
      <div class="flex items-center gap-3">
        <input
          v-if="isEditable"
          type="number"
          v-model="homeScore"
          @input="(e) => validateInput(e, 'home')"
          min="0"
          max="99"
          placeholder="-"
          class="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <div v-else class="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-900">
          {{ match.home_score ?? (match.predicted_home_score ?? '-') }}
        </div>

        <span class="text-2xl font-bold text-gray-400">×</span>

        <input
          v-if="isEditable"
          type="number"
          v-model="awayScore"
          @input="(e) => validateInput(e, 'away')"
          min="0"
          max="99"
          placeholder="-"
          class="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <div v-else class="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-900">
          {{ match.away_score ?? (match.predicted_away_score ?? '-') }}
        </div>
      </div>

      <!-- Away Team -->
      <div class="flex-1 flex items-center gap-3">
        <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <span class="text-xl">🏴</span>
        </div>
        <div class="text-left">
          <div class="font-semibold text-gray-900 text-lg">{{ match.away_team }}</div>
          <div class="text-sm text-gray-500">{{ match.away_team.substring(0, 2).toUpperCase() }}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <div class="text-sm text-gray-500">
        <span v-if="!hasPrediction && isEditable">Sem palpite registrado</span>
        <span v-else-if="hasPrediction && isEditable" class="flex items-center gap-1 text-green-600">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Palpite registrado
        </span>
        <span v-else-if="match.status === 'finished'" class="text-gray-600">
          Partida encerrada
        </span>
      </div>

      <button
        v-if="isEditable"
        @click="handleSave"
        :disabled="isSaving || homeScore === null || awayScore === null"
        class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="!isSaving">Salvar Palpite</span>
        <span v-else>Salvando...</span>
      </button>
    </div>
  </div>
</template>
