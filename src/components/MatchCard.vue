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
    scheduled: { text: 'Agendado', class: 'badge-scheduled' },
    live: { text: 'Ao Vivo', class: 'badge-live' },
    finished: { text: 'Concluído', class: 'badge-finished' }
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
  if (type === 'home') homeScore.value = value
  else awayScore.value = value
}
</script>

<template>
  <div class="match-card">
    <!-- Info da partida -->
    <div class="match-meta">
      <div class="match-meta-info">
        <span class="match-date">{{ formattedDate }}</span>
        <span class="meta-dot">•</span>
        <span class="match-city">{{ match.city }}</span>
      </div>
      <span :class="['match-badge', statusBadge.class]">
        {{ statusBadge.text }}
      </span>
    </div>

    <!-- Times e Placar -->
    <div class="match-body">
      <!-- Time da casa -->
      <div class="team team-home">
        <div class="team-flag">🏴</div>
        <div class="team-name">{{ match.home_team }}</div>
        <div class="team-code">{{ match.home_team.substring(0, 3).toUpperCase() }}</div>
      </div>

      <!-- Placar -->
      <div class="score-section">
        <template v-if="isEditable">
          <input
            type="number"
            v-model="homeScore"
            @input="(e) => validateInput(e, 'home')"
            min="0" max="99"
            placeholder="-"
            class="score-input"
          />
          <span class="score-vs">×</span>
          <input
            type="number"
            v-model="awayScore"
            @input="(e) => validateInput(e, 'away')"
            min="0" max="99"
            placeholder="-"
            class="score-input"
          />
        </template>
        <template v-else>
          <div class="score-display">
            {{ match.home_score ?? (match.predicted_home_score ?? '-') }}
          </div>
          <span class="score-vs">×</span>
          <div class="score-display">
            {{ match.away_score ?? (match.predicted_away_score ?? '-') }}
          </div>
        </template>
      </div>

      <!-- Time visitante -->
      <div class="team team-away">
        <div class="team-flag">🏴</div>
        <div class="team-name">{{ match.away_team }}</div>
        <div class="team-code">{{ match.away_team.substring(0, 3).toUpperCase() }}</div>
      </div>
    </div>

    <!-- Rodapé -->
    <div v-if="isEditable" class="match-footer">
      <div class="prediction-status">
        <template v-if="hasPrediction">
          <svg class="status-icon icon-success" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="text-success">Palpite salvo</span>
        </template>
        <template v-else>
          <span class="text-muted">Sem palpite</span>
        </template>
      </div>
      <button
        @click="handleSave"
        :disabled="isSaving || homeScore === null || awayScore === null"
        class="btn-save"
      >
        <span v-if="!isSaving">Salvar Palpite</span>
        <span v-else class="btn-saving">
          <svg class="spin-icon" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Salvando...
        </span>
      </button>
    </div>

    <div v-else class="match-footer-readonly">
      <span v-if="match.status === 'finished'" class="text-muted">Partida encerrada</span>
      <span v-else-if="hasPrediction" class="text-success flex items-center gap-1">
        <svg class="status-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        Palpite registrado
      </span>
    </div>
  </div>
</template>

<style scoped>
.match-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 14px;
  transition: box-shadow 0.2s;
}
.match-card:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

/* Meta linha */
.match-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 8px;
}
.match-meta-info {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  min-width: 0;
}
.match-date {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}
.meta-dot {
  font-size: 12px;
  color: #9ca3af;
}
.match-city {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.match-badge {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
}
.badge-scheduled { background: #fef9c3; color: #854d0e; }
.badge-live       { background: #fee2e2; color: #991b1b; }
.badge-finished   { background: #f3f4f6; color: #4b5563; }

/* Layout times + placar: 3 colunas iguais */
.match-body {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

/* Time */
.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.team-flag {
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.team-name {
  font-size: 12px;
  font-weight: 700;
  color: #111827;
  text-align: center;
  line-height: 1.2;
  word-break: break-word;
  max-width: 80px;
}
.team-code {
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
  letter-spacing: 0.05em;
}

/* Placar */
.score-section {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.score-input {
  width: 44px;
  height: 44px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  color: #111827;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  -moz-appearance: textfield;
}
.score-input::-webkit-inner-spin-button,
.score-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.score-input:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.15);
}
.score-display {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
}
.score-vs {
  font-size: 16px;
  font-weight: 700;
  color: #d1d5db;
}

/* Rodapé */
.match-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid #f3f4f6;
}
.match-footer-readonly {
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}
.prediction-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}
.status-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
.icon-success { color: #16a34a; }
.text-success { color: #16a34a; font-weight: 500; }
.text-muted   { color: #9ca3af; }

.btn-save {
  flex-shrink: 0;
  padding: 8px 16px;
  background: #16a34a;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  white-space: nowrap;
}
.btn-save:hover:not(:disabled) { background: #15803d; }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-saving {
  display: flex;
  align-items: center;
  gap: 6px;
}
.spin-icon {
  width: 14px;
  height: 14px;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
