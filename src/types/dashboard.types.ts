export interface DashboardResponse {
  totalRevenue: number
  ordersByStatus: {
    status: string
    count: number
  }[]
  topProducts: {
    productName: string
    totalQuantity: number
  }[]
}