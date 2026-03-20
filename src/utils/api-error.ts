import type { AxiosError } from 'axios'

export function getApiError(error: unknown, fallback = 'Ocorreu um erro inesperado.'): string {
  const axiosError = error as AxiosError<{ message: string | string[] }>
  const msg = axiosError?.response?.data?.message

  if (Array.isArray(msg)) return msg[0] ?? fallback
  if (typeof msg === 'string') return msg
  return fallback
}
