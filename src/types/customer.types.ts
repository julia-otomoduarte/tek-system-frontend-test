export interface Address {
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  document: string
  address: Address
  createdAt: string
  updatedAt: string
}

export interface CustomerPayload {
  name: string
  email: string
  phone: string
  document: string
  address: Address
}

export interface CustomerFilters {
  name?: string
  email?: string
  phone?: string
  document?: string
  city?: string
  state?: string
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
