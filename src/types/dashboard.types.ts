export interface TopSellingProduct {
  productId: string
  productName: string
  sku: string
  totalQuantity: number
  totalValue: number
}

export interface DashboardResponse {
  totalRevenue: number
  ordersQuantityByStatus: {
    DRAFT: number
    PENDING: number
    COMPLETED: number
    CANCELLED: number
  }
  topSellingProducts: TopSellingProduct[]
}
