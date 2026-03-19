import api from '@/plugins/axios'
import type { StateType, CityType } from '@/types/locations.types'

export const locationsService = {
  getStates() {
    return api.get<StateType[]>('/locations/states')
  },
  getCitiesByState(uf: string) {
    return api.get<CityType[]>(`/locations/states/${uf}/cities`)
  },
}
