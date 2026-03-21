import api from '@/plugins/axios'
import type {
  Product,
  ProductPayload,
  ProductFilters,
  PaginatedResponse,
} from '@/types/product.types'

export const productsService = {
  listProducts(filters: ProductFilters = {}) {
    return api.get<PaginatedResponse<Product>>('/products', { params: filters })
  },

  getProductById(id: string) {
    return api.get<Product>(`/products/${id}`)
  },

  createProduct(payload: ProductPayload) {
    return api.post<Product>('/products', payload)
  },

  updateProduct(id: string, payload: Partial<ProductPayload>) {
    return api.patch<Product>(`/products/${id}`, payload)
  },

  removeProduct(id: string) {
    return api.delete<Product>(`/products/${id}`)
  },
}
