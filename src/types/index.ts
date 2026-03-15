// ─── Autenticação ─────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

// ─── Usuário ──────────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

// ─── Endereço ─────────────────────────────────────────────────────────────────

export interface Address {
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  zipCode?: string
}

// ─── Cliente ──────────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: Address
  createdAt: string
  updatedAt: string
}

export interface CustomerPayload {
  name: string
  email: string
  phone?: string
  address?: Address
}

export interface CustomerFilters {
  name?: string
  email?: string
  phone?: string
  city?: string
  state?: string
  page?: number
  limit?: number
}

// ─── Produto ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string
  sku: string
  name: string
  description?: string
  price: number
  stock: number
  createdAt: string
  updatedAt: string
}

export interface ProductPayload {
  sku: string
  name: string
  description?: string
  price: number
  stock: number
}

export interface ProductFilters {
  sku?: string
  name?: string
  priceGte?: number
  priceLte?: number
  page?: number
  limit?: number
}

// ─── Pedido ───────────────────────────────────────────────────────────────────

export type OrderStatus = 'DRAFT' | 'PENDING' | 'COMPLETED' | 'CANCELED'

export interface OrderItem {
  productId: string
  product?: Product
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer?: Customer
  items: OrderItem[]
  status: OrderStatus
  total: number
  createdAt: string
  updatedAt: string
}

export interface OrderPayload {
  customerId: string
  items: { productId: string; quantity: number }[]
  status?: OrderStatus
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

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardData {
  totalRevenue: number
  ordersQuantityByStatus: Record<OrderStatus, number>
  topSellingProducts: Array<{
    product: Product
    totalSold: number
  }>
}

// ─── Paginação ────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// ─── Localização ─────────────────────────────────────────────────────────────

export interface State {
  id: number
  sigla: string
  nome: string
}

export interface City {
  id: number
  nome: string
}

export interface CepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
}
