import api from '@/plugins/axios'
import type { DashboardResponse } from '@/types/dashboard.types'

const emptyStats: DashboardResponse = {
  totalRevenue: 0,
  ordersByStatus: [],
  topProducts: [],
}

export const dashboardService = {
  async getStats(): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponse>('/dashboard')
    return response.status === 204 ? emptyStats : response.data
  },
}
