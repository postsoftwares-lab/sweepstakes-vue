import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://smeacdkzzmxpayycqiuo.supabase.co/functions/v1',
  headers: {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
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
    nickname: string | null
    favorite_team: string | null
    profile_completed: boolean
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
    nickname: string | null
    favorite_team: string | null
    profile_completed: boolean
    email: string
    created_at: string
    updated_at: string
  }
}

export interface CompleteParticipantProfileRequest {
  participant_id: string
  name: string
  nickname: string
  favorite_team: string
}

export interface CompleteParticipantProfileResponse {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    nickname: string | null
    favorite_team: string | null
    profile_completed: boolean
    email: string
    created_at: string
    updated_at: string
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
  },

  async completeParticipantProfile(
    payload: CompleteParticipantProfileRequest
  ): Promise<CompleteParticipantProfileResponse> {
    const response = await api.post<CompleteParticipantProfileResponse>(
      '/complete-participant-profile',
      payload
    )
    return response.data
  }
}

export default api
