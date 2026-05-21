import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export interface LeaderboardEntry {
  id: string
  user_id: string
  username: string
  score: number
  correct_count: number
  correct_results: number
  current_rank: number
  previous_rank: number
  created_at: string
  updated_at: string
}

interface LeaderboardResponse {
  success: boolean
  data: LeaderboardEntry[]
  message: string
}

export const useLeaderboardStore = defineStore('leaderboard', () => {
  const rankings = ref<LeaderboardEntry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const top3 = computed(() => {
    return rankings.value.slice(0, 3)
  })

  const restOfRankings = computed(() => {
    return rankings.value.slice(3)
  })

  const getUserRank = (userId: string) => {
    return rankings.value.find(entry => entry.user_id === userId)
  }

  const getRankMovement = (entry: LeaderboardEntry): 'up' | 'down' | 'same' => {
    if (entry.previous_rank === 0) return 'same' // Novo participante
    if (entry.current_rank < entry.previous_rank) return 'up'
    if (entry.current_rank > entry.previous_rank) return 'down'
    return 'same'
  }

  async function fetchLeaderboard() {
    loading.value = true
    error.value = null

    try {
      const response = await api.get<LeaderboardResponse>('/leaderboard')

      if (response.data.success && response.data.data) {
        rankings.value = response.data.data
      } else {
        error.value = response.data.message || 'Erro ao buscar ranking'
      }
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err)
      error.value = err.response?.data?.message || 'Erro ao conectar com o servidor'
      
      // Fallback para dados mockados em caso de erro (para desenvolvimento)
      console.log('Usando dados mockados para desenvolvimento')
      loadMockData()
    } finally {
      loading.value = false
    }
  }

  function loadMockData() {
    rankings.value = [
      {
        id: '1',
        user_id: 'user-1',
        username: 'Maria',
        score: 45,
        correct_count: 3,
        correct_results: 2,
        current_rank: 1,
        previous_rank: 2,
        created_at: '2026-05-15T10:30:00Z',
        updated_at: '2026-05-21T14:20:00Z'
      },
      {
        id: '2',
        user_id: 'user-2',
        username: 'João Silva',
        score: 40,
        correct_count: 2,
        correct_results: 4,
        current_rank: 2,
        previous_rank: 1,
        created_at: '2026-05-15T10:30:00Z',
        updated_at: '2026-05-21T14:20:00Z'
      },
      {
        id: '3',
        user_id: 'user-3',
        username: 'Pedro Santos',
        score: 38,
        correct_count: 2,
        correct_results: 3,
        current_rank: 3,
        previous_rank: 4,
        created_at: '2026-05-15T10:30:00Z',
        updated_at: '2026-05-21T14:20:00Z'
      },
      {
        id: '4',
        user_id: 'user-4',
        username: 'Ana Oliveira',
        score: 35,
        correct_count: 1,
        correct_results: 4,
        current_rank: 4,
        previous_rank: 3,
        created_at: '2026-05-16T11:00:00Z',
        updated_at: '2026-05-21T14:20:00Z'
      },
      {
        id: '5',
        user_id: 'user-5',
        username: 'Carlos Mendes',
        score: 30,
        correct_count: 1,
        correct_results: 3,
        current_rank: 5,
        previous_rank: 6,
        created_at: '2026-05-16T12:00:00Z',
        updated_at: '2026-05-21T14:20:00Z'
      },
      {
        id: '6',
        user_id: 'user-6',
        username: 'Fernanda Lima',
        score: 28,
        correct_count: 1,
        correct_results: 2,
        current_rank: 6,
        previous_rank: 5,
        created_at: '2026-05-16T13:00:00Z',
        updated_at: '2026-05-21T14:20:00Z'
      },
      {
        id: '7',
        user_id: 'user-7',
        username: 'Lucas Ferreira',
        score: 25,
        correct_count: 0,
        correct_results: 3,
        current_rank: 7,
        previous_rank: 8,
        created_at: '2026-05-17T09:00:00Z',
        updated_at: '2026-05-21T14:20:00Z'
      },
      {
        id: '8',
        user_id: 'user-8',
        username: 'Beatriz Souza',
        score: 22,
        correct_count: 0,
        correct_results: 2,
        current_rank: 8,
        previous_rank: 7,
        created_at: '2026-05-17T10:00:00Z',
        updated_at: '2026-05-21T14:20:00Z'
      },
      {
        id: '9',
        user_id: 'user-9',
        username: 'Rafael Costa',
        score: 20,
        correct_count: 0,
        correct_results: 2,
        current_rank: 9,
        previous_rank: 9,
        created_at: '2026-05-17T11:00:00Z',
        updated_at: '2026-05-21T14:20:00Z'
      },
      {
        id: '10',
        user_id: 'user-10',
        username: 'Julia Almeida',
        score: 18,
        correct_count: 0,
        correct_results: 1,
        current_rank: 10,
        previous_rank: 10,
        created_at: '2026-05-17T12:00:00Z',
        updated_at: '2026-05-21T14:20:00Z'
      }
    ]
    error.value = null
  }

  return {
    rankings,
    loading,
    error,
    top3,
    restOfRankings,
    getUserRank,
    getRankMovement,
    fetchLeaderboard,
    loadMockData
  }
})
