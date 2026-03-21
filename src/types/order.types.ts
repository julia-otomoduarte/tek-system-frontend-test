export type OrderStatus = 'DRAFT' | 'PENDING' | 'COMPLETED' | 'CANCELED'

export interface OrderItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
}

export interface OrderCustomer {
  id: string
  name: string
  email: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer: OrderCustomer
  status: OrderStatus
  total: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItemPayload {
  productId: string
  quantity: number
}

export interface OrderPayload {
  customerId: string
  items: OrderItemPayload[]
}

export interface OrderFilters {
  orderNumber?: string
  customerId?: string
  status?: OrderStatus
  totalGte?: number
  totalLte?: number
  page?: number
  limit?: number
}
