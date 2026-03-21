import api from '@/plugins/axios'
import type { Order, OrderPayload, OrderFilters, OrderStatus } from '@/types/order.types'
import type { PaginatedResponse } from '@/types/product.types'

export const ordersService = {
  listOrders(filters: OrderFilters = {}) {
    return api.get<PaginatedResponse<Order>>('/orders', { params: filters })
  },

  getOrderById(id: string) {
    return api.get<Order>(`/orders/${id}`)
  },

  createOrder(payload: OrderPayload) {
    return api.post<Order>('/orders', payload)
  },

  updateOrder(id: string, payload: Partial<OrderPayload>) {
    return api.patch<Order>(`/orders/${id}`, payload)
  },

  updateStatus(id: string, status: OrderStatus) {
    return api.patch<Order>(`/orders/${id}/status`, { status })
  },

  removeOrder(id: string) {
    return api.delete<Order>(`/orders/${id}`)
  },
}
