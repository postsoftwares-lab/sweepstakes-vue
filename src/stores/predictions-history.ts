import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export interface MatchInfo {
  id: string
  city: string
  stage: string
  status: 'scheduled' | 'live' | 'finished'
  away_team: string
  home_team: string
  away_score: number | null
  group_name: string
  home_score: number | null
  match_date: string
  round_number: number
}

export interface Prediction {
  id: string
  participant_id: string
  match_id: string
  predicted_home_score: number
  predicted_away_score: number
  points: number
  matches: MatchInfo
}

export interface RoundData {
  round_number: number
  predictions: Prediction[]
  round_points: number
  round_correct: number
}

interface GetPredictionsResponse {
  success: boolean
  data: {
    participant_id: string
    total_predictions: number
    total_points: number
    rounds: Record<string, RoundData>
  }
  message: string
}

export const usePredictionsHistoryStore = defineStore('predictions-history', () => {
  const rounds = ref<Record<string, RoundData>>({})
  const totalPredictions = ref<number>(0)
  const totalPoints = ref<number>(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const roundNumbers = computed(() => {
    return Object.keys(rounds.value)
      .map(key => parseInt(key))
      .sort((a, b) => a - b)
  })

  const getPredictionsByRound = (roundNumber: number) => {
    return rounds.value[roundNumber.toString()]?.predictions || []
  }

  const getRoundPoints = (roundNumber: number) => {
    return rounds.value[roundNumber.toString()]?.round_points || 0
  }

  const getRoundCorrect = (roundNumber: number) => {
    return rounds.value[roundNumber.toString()]?.round_correct || 0
  }

  async function fetchPredictionsHistory(participantId: string) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<GetPredictionsResponse>('/predictions', {
        params: { participant_id: participantId }
      })

      if (response.data.success && response.data.data) {
        rounds.value = response.data.data.rounds
        totalPredictions.value = response.data.data.total_predictions
        totalPoints.value = response.data.data.total_points
      } else {
        error.value = response.data.message || 'Erro ao buscar histórico de palpites'
      }
    } catch (err: any) {
      console.error('Error fetching predictions history:', err)
      error.value = err.response?.data?.message || 'Erro ao conectar com o servidor'
    } finally {
      loading.value = false
    }
  }

  return {
    rounds,
    totalPredictions,
    totalPoints,
    loading,
    error,
    roundNumbers,
    getPredictionsByRound,
    getRoundPoints,
    getRoundCorrect,
    fetchPredictionsHistory
  }
})
