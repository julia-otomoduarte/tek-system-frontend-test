<template>
  <div>
    <div class="d-flex align-center justify-end mb-6">
      <VBtn color="primary" prepend-icon="mdi-plus" :to="{ name: 'order-create' }">
        Novo Pedido
      </VBtn>
    </div>

    <VCard rounded="lg" elevation="0" border class="mb-4 pa-4">
      <VRow align="center" class="ma-0">
        <VCol cols="12" sm="5" class="pa-1">
          <VTextField
            v-model="filters.orderNumber"
            label="Número do pedido"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            density="compact"
            bg-color="grey-lighten-5"
            color="primary"
            base-color="primary"
            @update:model-value="onFilterChange"
          />
        </VCol>
        <VCol cols="12" sm="5" class="pa-1">
          <VSelect
            v-model="filters.status"
            :items="statusItems"
            item-title="label"
            item-value="value"
            label="Status"
            clearable
            hide-details
            density="compact"
            bg-color="grey-lighten-5"
            color="primary"
            base-color="primary"
            @update:model-value="onFilterChange"
          >
            <template #selection="{ item }">
              <VChip :color="statusConfig[item.value as OrderStatus]?.color" size="small" label>
                {{ statusConfig[item.value as OrderStatus]?.label }}
              </VChip>
            </template>
          </VSelect>
        </VCol>
        <VCol cols="12" sm="2" class="pa-1 d-flex justify-end">
          <VBadge
            :content="activeExtraFilters"
            :model-value="activeExtraFilters > 0"
            color="primary"
          >
            <VBtn variant="outlined" prepend-icon="mdi-filter-variant" @click="filterDrawer = true">
              Filtros
            </VBtn>
          </VBadge>
        </VCol>
      </VRow>
    </VCard>

    <VCard rounded="lg" elevation="0" border>
      <VDataTableServer
        :headers="headers"
        :items="orders"
        :items-length="total"
        :loading="loading"
        :items-per-page="10"
        @update:options="onTableOptions"
      >
        <template #[`item.customer`]="{ item }">
          <div class="py-1">
            <div class="text-body-2 font-weight-medium">{{ item.customer?.name }}</div>
            <div class="text-caption text-medium-emphasis">{{ item.customer?.email }}</div>
          </div>
        </template>
        <template #[`item.status`]="{ item }">
          <VChip :color="statusConfig[item.status]?.color" size="small" label>
            {{ statusConfig[item.status]?.label }}
          </VChip>
        </template>
        <template #[`item.total`]="{ item }">
          {{ formatCurrency(item.total) }}
        </template>
        <template #[`item.actions`]="{ item }">
          <VBtn
            icon
            size="small"
            variant="text"
            :to="{ name: 'order-detail', params: { id: item.id } }"
          >
            <VIcon icon="mdi-eye" size="18" />
          </VBtn>
          <VBtn
            v-if="item.status === 'DRAFT' || item.status === 'PENDING'"
            icon
            size="small"
            variant="text"
            :to="{ name: 'order-edit', params: { id: item.id } }"
          >
            <VIcon icon="mdi-pencil" size="18" />
          </VBtn>
          <VBtn
            v-if="item.status === 'DRAFT' || item.status === 'PENDING'"
            icon
            size="small"
            variant="text"
            color="error"
            @click="confirmDelete(item)"
          >
            <VIcon icon="mdi-delete" size="18" />
          </VBtn>
        </template>
      </VDataTableServer>
    </VCard>

    <VNavigationDrawer v-model="filterDrawer" location="right" temporary width="320">
      <div class="pa-4">
        <div class="d-flex align-center justify-space-between mb-4">
          <span class="text-subtitle-1 font-weight-bold">Filtros</span>
          <VBtn icon size="small" variant="text" @click="filterDrawer = false">
            <VIcon icon="mdi-close" />
          </VBtn>
        </div>

        <div class="d-flex flex-column ga-4">
          <VAutocomplete
            v-model="filters.customerId"
            :items="customerOptions"
            item-title="name"
            item-value="id"
            label="Cliente"
            prepend-inner-icon="mdi-account-search"
            clearable
            hide-details
            density="compact"
            bg-color="grey-lighten-5"
            color="primary"
            base-color="primary"
            :loading="loadingCustomers"
            no-data-text="Nenhum cliente encontrado"
            @update:search="onCustomerSearch"
          />

          <VDivider />

          <p class="text-body-2 text-medium-emphasis mb-0">Faixa de valor</p>
          <VRow class="ma-0">
            <VCol cols="6" class="pa-1">
              <VTextField
                v-model.number="filters.totalGte"
                label="Mínimo"
                prefix="R$"
                type="number"
                hide-details
                density="compact"
                bg-color="grey-lighten-5"
                color="primary"
                base-color="primary"
              />
            </VCol>
            <VCol cols="6" class="pa-1">
              <VTextField
                v-model.number="filters.totalLte"
                label="Máximo"
                prefix="R$"
                type="number"
                hide-details
                density="compact"
                bg-color="grey-lighten-5"
                color="primary"
                base-color="primary"
              />
            </VCol>
          </VRow>
        </div>

        <div class="d-flex ga-2 mt-6">
          <VBtn variant="outlined" class="flex-grow-1" @click="clearExtraFilters">Limpar</VBtn>
          <VBtn color="primary" class="flex-grow-1" @click="applyFilters">Aplicar</VBtn>
        </div>
      </div>
    </VNavigationDrawer>

    <VDialog v-model="deleteDialog" max-width="400">
      <VCard class="rounded-xl py-4">
        <VCardTitle class="text-h6 font-weight-bold d-flex align-center gap-2">
          Excluir pedido
          <VIcon icon="mdi-alert-circle-outline" color="warning" size="22" />
        </VCardTitle>
        <VCardText>
          Tem certeza que deseja excluir o pedido <strong>{{ selectedOrder?.orderNumber }}</strong
          >?
          <br />
          Esta ação não pode ser desfeita.
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn variant="outlined" @click="deleteDialog = false">Cancelar</VBtn>
          <VBtn variant="flat" color="error" :loading="deleting" @click="deleteOrder">Excluir</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ordersService } from '@/services/orders.service'
import { customersService } from '@/services/customers.service'
import { useToastStore } from '@/stores/toast.store'
import { getApiError } from '@/utils/api-error'

import type { Order, OrderFilters, OrderStatus } from '@/types/order.types'
import type { Customer } from '@/types/customer.types'

const toast = useToastStore()

const orders = ref<Order[]>([])
const total = ref(0)
const loading = ref(false)
const currentPage = ref(1)

const filters = ref<OrderFilters>({ page: 1, limit: 10 })
const filterDrawer = ref(false)

const customerOptions = ref<Customer[]>([])
const loadingCustomers = ref(false)

const deleteDialog = ref(false)
const deleting = ref(false)
const selectedOrder = ref<Order | null>(null)

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  DRAFT: { label: 'Rascunho', color: 'grey' },
  PENDING: { label: 'Pendente', color: 'blue' },
  COMPLETED: { label: 'Concluído', color: 'green' },
  CANCELED: { label: 'Cancelado', color: 'red' },
}

const statusItems = (Object.keys(statusConfig) as OrderStatus[]).map((value) => ({
  value,
  label: statusConfig[value].label,
}))

const headers = [
  { title: 'Nº Pedido', key: 'orderNumber' },
  { title: 'Cliente', key: 'customer' },
  { title: 'Status', key: 'status' },
  { title: 'Total', key: 'total' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const },
]

const activeExtraFilters = computed(
  () =>
    [filters.value.customerId, filters.value.totalGte, filters.value.totalLte].filter(
      (v) => v !== undefined && v !== null && v !== '',
    ).length,
)

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function fetchOrders(page = 1) {
  loading.value = true
  try {
    const { data } = await ordersService.listOrders({ ...filters.value, page })
    orders.value = data.data
    total.value = data.meta.total
    currentPage.value = page
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao carregar pedidos.'), 'error')
  } finally {
    loading.value = false
  }
}

async function fetchCustomers(name = '') {
  loadingCustomers.value = true
  try {
    const { data } = await customersService.listCustomers({ name, limit: 20 })
    customerOptions.value = data.data
  } finally {
    loadingCustomers.value = false
  }
}

let searchTimeout: ReturnType<typeof setTimeout>
function onFilterChange() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => fetchOrders(1), 400)
}

let customerTimeout: ReturnType<typeof setTimeout>
function onCustomerSearch(search: string) {
  clearTimeout(customerTimeout)
  customerTimeout = setTimeout(() => fetchCustomers(search ?? ''), 400)
}

function onTableOptions({ page }: { page: number }) {
  fetchOrders(page)
}

function applyFilters() {
  filterDrawer.value = false
  fetchOrders(1)
}

function clearExtraFilters() {
  filters.value.customerId = undefined
  filters.value.totalGte = undefined
  filters.value.totalLte = undefined
  filterDrawer.value = false
  fetchOrders(1)
}

function confirmDelete(order: Order) {
  selectedOrder.value = order
  deleteDialog.value = true
}

async function deleteOrder() {
  if (!selectedOrder.value) return
  deleting.value = true
  try {
    await ordersService.removeOrder(selectedOrder.value.id)
    toast.triggerToast('Pedido excluído com sucesso.', 'success')
    deleteDialog.value = false
    fetchOrders(currentPage.value)
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao excluir pedido.'), 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchOrders()
  fetchCustomers()
})
</script>

<style scoped>
:deep(thead tr th) {
  background-color: #f5f5f5 !important;
  font-weight: 700 !important;
}
</style>
