import api from '@/plugins/axios'
import type { StateType, CityType } from '@/types/locations.types'

export interface CepResult {
  cep: string
  street: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export const locationsService = {
  getStates() {
    return api.get<StateType[]>('/locations/states')
  },
  getCitiesByState(uf: string) {
    return api.get<CityType[]>(`/locations/states/${uf}/cities`)
  },
  getCep(cep: string) {
    return api.get<CepResult>(`/locations/cep/${cep}`)
  },
}
