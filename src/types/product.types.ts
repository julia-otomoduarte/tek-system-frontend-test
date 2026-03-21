export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  sku: string
  createdAt: string
  updatedAt: string
}

export interface ProductPayload {
  name: string
  description: string
  price: number
  stock: number
  sku: string
}

export interface ProductFilters {
  name?: string
  sku?: string
  priceGte?: number
  priceLte?: number
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
