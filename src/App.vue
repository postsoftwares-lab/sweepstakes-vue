<script setup lang="ts">
import CompleteProfileModal from '@/components/CompleteProfileModal.vue'
import { authApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()
const profileSubmitting = ref(false)
const profileError = ref('')

const handleProfileSubmit = async (payload: {
  name: string
  nickname: string
  favoriteTeam: string
}) => {
  if (!authStore.participant?.id) {
    return
  }

  profileSubmitting.value = true
  profileError.value = ''

  try {
    const response = await authApi.completeParticipantProfile({
      participant_id: authStore.participant.id,
      name: payload.name,
      nickname: payload.nickname,
      favorite_team: payload.favoriteTeam
    })

    if (response.success && response.data) {
      authStore.completeProfile(response.data)
      return
    }

    profileError.value = response.message || 'Não foi possível completar o cadastro.'
  } catch (err: any) {
    profileError.value = err.response?.data?.message || 'Não foi possível completar o cadastro.'
  } finally {
    profileSubmitting.value = false
  }
}
</script>

<template>
  <RouterView />
  <CompleteProfileModal
    v-if="route.meta.requiresAuth && authStore.isAuthenticated && authStore.needsProfileCompletion"
    :initial-name="authStore.participant?.name"
    :submitting="profileSubmitting"
    :error-message="profileError"
    @submit="handleProfileSubmit"
  />
</template>

<style scoped>
</style>
