<script setup lang="ts">
import { reactive, watch } from 'vue'

interface TeamGroup {
  state: string
  teams: string[]
}

const props = defineProps<{
  initialName?: string
  submitting?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  submit: [payload: { name: string; nickname: string; favoriteTeam: string }]
}>()

const form = reactive({
  name: props.initialName ?? '',
  nickname: '',
  favoriteTeam: ''
})

const teamGroups: TeamGroup[] = [
  { state: 'Acre (AC)', teams: ['Rio Branco Football Club', 'Atlético Acreano'] },
  { state: 'Alagoas (AL)', teams: ['CRB', 'CSA'] },
  { state: 'Amapá (AP)', teams: ['Ypiranga Clube', 'Trem Desportivo Clube'] },
  { state: 'Amazonas (AM)', teams: ['Nacional Futebol Clube', 'Amazonas FC'] },
  { state: 'Bahia (BA)', teams: ['Esporte Clube Bahia', 'Esporte Clube Vitória'] },
  { state: 'Ceará (CE)', teams: ['Ceará Sporting Club', 'Fortaleza Esporte Clube'] },
  { state: 'Distrito Federal (DF)', teams: ['Brasiliense FC', 'Gama'] },
  { state: 'Espírito Santo (ES)', teams: ['Rio Branco Atlético Clube', 'Desportiva Ferroviária'] },
  { state: 'Goiás (GO)', teams: ['Goiás Esporte Clube', 'Vila Nova Futebol Clube', 'Atlético Goianiense'] },
  { state: 'Maranhão (MA)', teams: ['Sampaio Corrêa Futebol Clube', 'Moto Club'] },
  { state: 'Mato Grosso (MT)', teams: ['Cuiabá Esporte Clube', 'Mixto Esporte Clube'] },
  { state: 'Mato Grosso do Sul (MS)', teams: ['Operário Futebol Clube', 'Comercial Futebol Clube'] },
  { state: 'Minas Gerais (MG)', teams: ['Atlético Mineiro', 'Cruzeiro Esporte Clube', 'América Mineiro'] },
  { state: 'Pará (PA)', teams: ['Clube do Remo', 'Paysandu Sport Club'] },
  { state: 'Paraíba (PB)', teams: ['Botafogo Futebol Clube', 'Campinense Clube', 'Treze Futebol Clube'] },
  { state: 'Paraná (PR)', teams: ['Athletico Paranaense', 'Coritiba Foot Ball Club', 'Paraná Clube'] },
  { state: 'Pernambuco (PE)', teams: ['Sport Club do Recife', 'Santa Cruz Futebol Clube', 'Clube Náutico Capibaribe'] },
  { state: 'Piauí (PI)', teams: ['River Atlético Clube', 'Esporte Clube Flamengo', 'Altos'] },
  { state: 'Rio de Janeiro (RJ)', teams: ['Flamengo', 'Vasco da Gama', 'Fluminense', 'Botafogo'] },
  { state: 'Rio Grande do Norte (RN)', teams: ['ABC Futebol Clube', 'América Futebol Clube'] },
  { state: 'Rio Grande do Sul (RS)', teams: ['Grêmio', 'Internacional', 'Juventude'] },
  { state: 'Rondônia (RO)', teams: ['Ji-Paraná Futebol Clube', 'Genus'] },
  { state: 'Roraima (RR)', teams: ['São Raimundo', 'Náutico Futebol Clube'] },
  { state: 'Santa Catarina (SC)', teams: ['Avaí Futebol Clube', 'Figueirense', 'Chapecoense', 'Criciúma'] },
  { state: 'São Paulo (SP)', teams: ['São Paulo FC', 'Corinthians', 'Palmeiras', 'Santos FC'] },
  { state: 'Sergipe (SE)', teams: ['Confiança', 'Sergipe'] },
  { state: 'Tocantins (TO)', teams: ['Palmas Futebol e Regatas', 'Tocantinópolis'] }
]

watch(
  () => props.initialName,
  (value) => {
    if (value && !form.name.trim()) {
      form.name = value
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  emit('submit', {
    name: form.name.trim(),
    nickname: form.nickname.trim(),
    favoriteTeam: form.favoriteTeam.trim()
  })
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <p class="eyebrow">Complete seu cadastro</p>
        <h2 class="title">Falta pouco para entrar no bolão</h2>
        <p class="subtitle">Preencha seus dados uma única vez para liberar a navegação.</p>
      </div>

      <form class="form" @submit.prevent="handleSubmit">
        <label class="field">
          <span class="label">Nome</span>
          <input
            v-model="form.name"
            type="text"
            maxlength="80"
            required
            autocomplete="name"
            placeholder="Seu nome completo"
            class="input"
          />
        </label>

        <label class="field">
          <span class="label">Nickname</span>
          <input
            v-model="form.nickname"
            type="text"
            maxlength="40"
            required
            autocomplete="nickname"
            placeholder="Como você quer aparecer"
            class="input"
          />
        </label>

        <label class="field">
          <span class="label">Time do coração</span>
          <select
            v-model="form.favoriteTeam"
            required
            class="input"
          >
            <option disabled value="">Selecione seu time</option>
            <optgroup
              v-for="group in teamGroups"
              :key="group.state"
              :label="group.state"
            >
              <option v-for="team in group.teams" :key="team" :value="team">
                {{ team }}
              </option>
            </optgroup>
          </select>
        </label>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button
          type="submit"
          class="submit-button"
          :disabled="submitting || !form.name.trim() || !form.nickname.trim() || !form.favoriteTeam.trim()"
        >
          {{ submitting ? 'Salvando...' : 'Salvar cadastro' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background:
    radial-gradient(circle at top, rgba(22, 163, 74, 0.18), transparent 30%),
    rgba(17, 24, 39, 0.55);
  backdrop-filter: blur(8px);
}

.modal-card {
  width: 100%;
  max-width: 460px;
  border-radius: 24px;
  padding: 28px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
}

.modal-header {
  margin-bottom: 22px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #16a34a;
}

.title {
  margin: 0;
  font-size: 28px;
  line-height: 1.05;
  font-weight: 800;
  color: #111827;
}

.subtitle {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: #4b5563;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
}

.input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 15px;
  color: #111827;
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
}

select.input {
  appearance: none;
}

.input:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.12);
}

.submit-button {
  margin-top: 6px;
  border: none;
  border-radius: 14px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin: -2px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: #b91c1c;
}

@media (max-width: 640px) {
  .modal-card {
    padding: 24px 18px;
    border-radius: 20px;
  }

  .title {
    font-size: 24px;
  }
}
</style>