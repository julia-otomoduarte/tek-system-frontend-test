import api from '@/plugins/axios'
import type { DashboardResponse } from '@/types/dashboard.types'

const emptyStats: DashboardResponse = {
  totalRevenue: 0,
  ordersQuantityByStatus: { DRAFT: 0, PENDING: 0, COMPLETED: 0, CANCELLED: 0 },
  topSellingProducts: [],
}

export const dashboardService = {
  async getStats(): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponse>('/dashboard')
    return response.status === 204 ? emptyStats : response.data
  },
}
