import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export interface Match {
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

interface GetMatchesResponse {
  success: boolean
  data: {
    current_round: number
    current_date: string
    total_matches: number
    current_group: string
    groups: Record<string, Match[]>
    matches: Match[]
  }
  message: string
}

export const useMatchesStore = defineStore('matches', () => {
  const matches = ref<Match[]>([])
  const groups = ref<Record<string, Match[]>>({})
  const currentRound = ref<number>(1)
  const currentGroup = ref<string>('A')
  const totalMatches = ref<number>(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const groupedMatches = computed(() => groups.value)
  
  const groupNames = computed(() => Object.keys(groups.value).sort())

  const matchesByGroup = (groupName: string) => {
    return groups.value[groupName] || []
  }

  const predictedCount = computed(() => {
    const allMatches = Object.values(groups.value).flat()
    return allMatches.filter(m =>
      m.predicted_home_score != null && m.predicted_away_score != null
    ).length
  })

  const predictedCountByGroup = (groupName: string) => {
    const groupMatches = groups.value[groupName] || []
    return groupMatches.filter(m =>
      m.predicted_home_score != null && m.predicted_away_score != null
    ).length
  }

  async function fetchMatches(participantId?: string) {
    loading.value = true
    error.value = null

    try {
      const params = participantId ? { participant_id: participantId } : {}
      const response = await api.get<GetMatchesResponse>('/get-matches', { params })

      if (response.data.success && response.data.data) {
        matches.value = response.data.data.matches
        groups.value = response.data.data.groups
        currentRound.value = response.data.data.current_round
        currentGroup.value = response.data.data.current_group
        totalMatches.value = response.data.data.total_matches
      } else {
        error.value = response.data.message || 'Erro ao buscar partidas'
      }
    } catch (err: any) {
      console.error('Error fetching matches:', err)
      error.value = err.response?.data?.message || 'Erro ao conectar com o servidor'
      
      // Fallback para dados mockados em caso de erro (para desenvolvimento)
      console.log('Usando dados mockados para desenvolvimento')
      loadMockData()
    } finally {
      loading.value = false
    }
  }

  function loadMockData() {
    const mockMatches: Match[] = [
      // Grupo A
      {
        id: 'match-1',
        stage: 'group',
        group_name: 'A',
        round_number: 1,
        match_date: '2026-06-11T16:00:00Z',
        home_team: 'Brasil',
        away_team: 'Sérvia',
        city: 'Brasília',
        status: 'scheduled',
        home_score: null,
        away_score: null,
        predicted_home_score: 2,
        predicted_away_score: 1
      },
      {
        id: 'match-2',
        stage: 'group',
        group_name: 'A',
        round_number: 1,
        match_date: '2026-06-11T19:00:00Z',
        home_team: 'Alemanha',
        away_team: 'México',
        city: 'São Paulo',
        status: 'scheduled',
        home_score: null,
        away_score: null,
        predicted_home_score: null,
        predicted_away_score: null
      },
      {
        id: 'match-3',
        stage: 'group',
        group_name: 'A',
        round_number: 1,
        match_date: '2026-06-15T16:00:00Z',
        home_team: 'Brasil',
        away_team: 'México',
        city: 'Rio de Janeiro',
        status: 'scheduled',
        home_score: null,
        away_score: null,
        predicted_home_score: null,
        predicted_away_score: null
      },
      {
        id: 'match-4',
        stage: 'group',
        group_name: 'A',
        round_number: 1,
        match_date: '2026-06-16T19:00:00Z',
        home_team: 'Alemanha',
        away_team: 'Japão',
        city: 'Belo Horizonte',
        status: 'scheduled',
        home_score: null,
        away_score: null,
        predicted_home_score: null,
        predicted_away_score: null
      },
      // Grupo B
      {
        id: 'match-5',
        stage: 'group',
        group_name: 'B',
        round_number: 1,
        match_date: '2026-06-12T16:00:00Z',
        home_team: 'Argentina',
        away_team: 'Espanha',
        city: 'Buenos Aires',
        status: 'finished',
        home_score: 3,
        away_score: 2,
        predicted_home_score: 2,
        predicted_away_score: 1
      },
      {
        id: 'match-6',
        stage: 'group',
        group_name: 'B',
        round_number: 1,
        match_date: '2026-06-12T19:00:00Z',
        home_team: 'França',
        away_team: 'EUA',
        city: 'Paris',
        status: 'scheduled',
        home_score: null,
        away_score: null,
        predicted_home_score: null,
        predicted_away_score: null
      },
      {
        id: 'match-7',
        stage: 'group',
        group_name: 'B',
        round_number: 1,
        match_date: '2026-06-16T16:00:00Z',
        home_team: 'Argentina',
        away_team: 'França',
        city: 'Rosário',
        status: 'scheduled',
        home_score: null,
        away_score: null,
        predicted_home_score: null,
        predicted_away_score: null
      },
      {
        id: 'match-8',
        stage: 'group',
        group_name: 'B',
        round_number: 1,
        match_date: '2026-06-17T19:00:00Z',
        home_team: 'Espanha',
        away_team: 'EUA',
        city: 'Madrid',
        status: 'scheduled',
        home_score: null,
        away_score: null,
        predicted_home_score: null,
        predicted_away_score: null
      },
      // Grupo C
      {
        id: 'match-9',
        stage: 'group',
        group_name: 'C',
        round_number: 1,
        match_date: '2026-06-13T16:00:00Z',
        home_team: 'Inglaterra',
        away_team: 'Itália',
        city: 'Londres',
        status: 'scheduled',
        home_score: null,
        away_score: null,
        predicted_home_score: null,
        predicted_away_score: null
      },
      {
        id: 'match-10',
        stage: 'group',
        group_name: 'C',
        round_number: 1,
        match_date: '2026-06-13T19:00:00Z',
        home_team: 'Portugal',
        away_team: 'Holanda',
        city: 'Lisboa',
        status: 'scheduled',
        home_score: null,
        away_score: null,
        predicted_home_score: null,
        predicted_away_score: null
      }
    ]

    matches.value = mockMatches
    
    // Agrupar por grupos
    groups.value = mockMatches.reduce((acc, match) => {
      if (!acc[match.group_name]) {
        acc[match.group_name] = []
      }
      acc[match.group_name].push(match)
      return acc
    }, {} as Record<string, Match[]>)

    currentRound.value = 1
    currentGroup.value = 'A'
    totalMatches.value = mockMatches.length
    error.value = null
  }

  function updateMatchPrediction(matchId: string, homeScore: number, awayScore: number) {
    // Atualiza localmente
    const matchIndex = matches.value.findIndex(m => m.id === matchId)
    if (matchIndex !== -1) {
      matches.value[matchIndex].predicted_home_score = homeScore
      matches.value[matchIndex].predicted_away_score = awayScore
    }

    // Atualiza nos grupos
    for (const groupName in groups.value) {
      const groupMatchIndex = groups.value[groupName].findIndex(m => m.id === matchId)
      if (groupMatchIndex !== -1) {
        groups.value[groupName][groupMatchIndex].predicted_home_score = homeScore
        groups.value[groupName][groupMatchIndex].predicted_away_score = awayScore
        break
      }
    }
  }

  return {
    matches,
    groups,
    currentRound,
    currentGroup,
    totalMatches,
    loading,
    error,
    groupedMatches,
    groupNames,
    predictedCount,
    matchesByGroup,
    predictedCountByGroup,
    fetchMatches,
    updateMatchPrediction,
    loadMockData
  }
})
