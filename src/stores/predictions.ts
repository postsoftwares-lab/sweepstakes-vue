import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'
import { useMatchesStore } from './matches'

interface CreatePredictionRequest {
  participant_id: string
  match_id: string
  predicted_home_score: number
  predicted_away_score: number
}

interface CreatePredictionResponse {
  success: boolean
  data: {
    id: string
    participant_id: string
    match_id: string
    predicted_home_score: number
    predicted_away_score: number
    created_at: string
  }
  message: string
}

export const usePredictionsStore = defineStore('predictions', () => {
  const saving = ref(false)
  const error = ref<string | null>(null)

  async function createOrUpdatePrediction(
    participantId: string,
    matchId: string,
    homeScore: number,
    awayScore: number
  ): Promise<boolean> {
    saving.value = true
    error.value = null

    try {
      const payload: CreatePredictionRequest = {
        participant_id: participantId,
        match_id: matchId,
        predicted_home_score: homeScore,
        predicted_away_score: awayScore
      }

      const response = await api.post<CreatePredictionResponse>('/create-prediction', payload)

      if (response.data.success) {
        // Atualiza a store de matches localmente
        const matchesStore = useMatchesStore()
        matchesStore.updateMatchPrediction(matchId, homeScore, awayScore)
        return true
      } else {
        error.value = response.data.message || 'Erro ao salvar palpite'
        return false
      }
    } catch (err: any) {
      console.error('Error creating prediction:', err)
      error.value = err.response?.data?.message || 'Erro ao salvar palpite'
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    saving,
    error,
    createOrUpdatePrediction
  }
})
