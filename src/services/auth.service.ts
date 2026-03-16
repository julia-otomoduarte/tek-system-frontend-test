import api from '@/plugins/axios'
import type { LoginPayload, RegisterPayload, AuthResponse } from '@/types/auth.types'

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  localStorage.setItem('accessToken', data.accessToken)
  return data
}

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', payload)
  localStorage.setItem('accessToken', data.accessToken)
  return data
}

