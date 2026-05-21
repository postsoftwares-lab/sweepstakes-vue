<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const loading = ref(false)
const error = ref('')

const validateEmail = (email: string): boolean => {
  return email.includes('@') && email.trim().length > 0
}

const handleSubmit = async () => {
  error.value = ''
  
  if (!validateEmail(email.value)) {
    error.value = 'Por favor, insira um email válido'
    return
  }

  loading.value = true

  try {
    const response = await authApi.createParticipant(email.value.trim().toLowerCase())
    
    if (response.success && response.data) {
      authStore.setParticipant(response.data)
      router.push({ name: 'palpites' })
    } else {
      error.value = 'Erro ao entrar no bolão. Tente novamente.'
    }
  } catch (err: any) {
    console.error('Login error:', err)
    error.value = err.response?.data?.message || 'Erro ao conectar com o servidor'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo e Título -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <svg 
            class="w-10 h-10 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Bolão Copa 2026</h1>
        <p class="text-gray-600">
          Faça seus palpites e dispute com<br>seus amigos pelo primeiro lugar
        </p>
      </div>

      <!-- Card do Formulário -->
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <form @submit.prevent="handleSubmit">
          <!-- Input de Email -->
          <div class="mb-6">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Seu email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  class="h-5 w-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                required
                class="block w-full pl-10 pr-3 py-3 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                :class="{ 'border-red-500': error }"
                :disabled="loading"
              />
            </div>
            <p v-if="error" class="mt-2 text-sm text-red-600">
              {{ error }}
            </p>
          </div>

          <!-- Botão de Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Entrar no Bolão</span>
            <span v-else>Entrando...</span>
            <svg 
              v-if="!loading"
              class="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <svg 
              v-else
              class="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle 
                class="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                stroke-width="4"
              />
              <path 
                class="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </button>
        </form>

        <!-- Features -->
        <div class="mt-6 flex items-center justify-center gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-1">
            <span class="w-2 h-2 bg-green-600 rounded-full"></span>
            <span>Gratuito</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span>Sem cadastro</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-2 h-2 bg-green-600 rounded-full"></span>
            <span>Ranking em tempo real</span>
          </div>
        </div>
      </div>

      <!-- Termos -->
      <p class="text-center text-sm text-gray-500 mt-6">
        Ao entrar, você concorda com as regras do bolão
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Animação customizada pode ser adicionada aqui se necessário */
</style>
