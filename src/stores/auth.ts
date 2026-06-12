import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export interface Participant {
  id: string
  name: string
  email: string
  nickname?: string | null
  favorite_team?: string | null
  profile_completed?: boolean
  created_at?: string
  updated_at?: string
}

export const useAuthStore = defineStore('auth', () => {
  const participant = ref<Participant | null>(null)
  const isAuthenticated = ref(false)
  const needsProfileCompletion = computed(() => {
    return Boolean(participant.value && !participant.value.profile_completed)
  })

  // Carrega participante do localStorage ao iniciar
  function loadFromStorage() {
    const stored = localStorage.getItem('participant')
    if (stored) {
      try {
        participant.value = JSON.parse(stored)
        isAuthenticated.value = true
      } catch (e) {
        console.error('Error loading participant from storage:', e)
        clearAuth()
      }
    }
  }

  function setParticipant(data: Participant) {
    participant.value = data
    isAuthenticated.value = true
    localStorage.setItem('participant', JSON.stringify(participant.value))
  }

  function completeProfile(data: Participant) {
    setParticipant(data)
  }

  function clearAuth() {
    participant.value = null
    isAuthenticated.value = false
    localStorage.removeItem('participant')
  }

  // Carrega dados ao iniciar a store
  loadFromStorage()

  return {
    participant,
    isAuthenticated,
    needsProfileCompletion,
    setParticipant,
    completeProfile,
    clearAuth
  }
})
