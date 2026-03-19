import api from '@/plugins/axios'
import type {
  Customer,
  CustomerPayload,
  CustomerFilters,
  PaginatedResponse,
} from '@/types/customer.types'

export const customersService = {
  listCustomers(filters: CustomerFilters = {}) {
    return api.get<PaginatedResponse<Customer>>('/customers', { params: filters })
  },

  getCustomerById(id: string) {
    return api.get<Customer>(`/customers/${id}`)
  },

  createCustomer(payload: CustomerPayload) {
    return api.post<Customer>('/customers', payload)
  },

  updateCustomer(id: string, payload: Partial<CustomerPayload>) {
    return api.patch<Customer>(`/customers/${id}`, payload)
  },

  removeCustomer(id: string) {
    return api.delete<Customer>(`/customers/${id}`)
  },
}
