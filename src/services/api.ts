import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://smeacdkzzmxpayycqiuo.supabase.co/functions/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
  }
})

export interface CreateParticipantRequest {
  email: string
}

export interface CreateParticipantResponse {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    email: string
    created_at: string
    updated_at: string
  }
}

export interface GetParticipantResponse {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    email: string
    created_at: string
  }
}

export const authApi = {
  async createParticipant(email: string): Promise<CreateParticipantResponse> {
    const response = await api.post<CreateParticipantResponse>('/create-participant', { email })
    return response.data
  },

  async getParticipant(email: string): Promise<GetParticipantResponse> {
    const response = await api.get<GetParticipantResponse>('/participant', {
      params: { email }
    })
    return response.data
  }
}

export default api
