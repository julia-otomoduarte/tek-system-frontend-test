<template>
  <div>
    <div class="d-flex align-center justify-end mb-6">
      <VBtn color="primary" prepend-icon="mdi-plus" :to="{ name: 'customer-create' }">
        Novo Cliente
      </VBtn>
    </div>

    <VCard rounded="lg" elevation="0" border class="mb-4 pa-4">
      <VRow align="center" class="ma-0">
        <VCol cols="12" sm="5" class="pa-1">
          <VTextField
            v-model="filters.name"
            label="Buscar por nome"
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
          <VTextField
            v-model="filters.email"
            label="Buscar por email"
            prepend-inner-icon="mdi-email-outline"
            clearable
            hide-details
            density="compact"
            bg-color="grey-lighten-5"
            color="primary"
            base-color="primary"
            @update:model-value="onFilterChange"
          />
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
        :items="customers"
        :items-length="total"
        :loading="loading"
        :items-per-page="10"
        @update:options="onTableOptions"
      >
        <template #[`item.phone`]="{ item }">
          {{ maskPhone(item.phone ?? '') }}
        </template>
        <template #[`item.document`]="{ item }">
          {{ maskDocument(item.document ?? '') }}
        </template>
        <template #[`item.actions`]="{ item }">
          <VBtn
            icon
            size="small"
            variant="text"
            :to="{ name: 'customer-edit', params: { id: item.id } }"
          >
            <VIcon icon="mdi-pencil" size="18" />
          </VBtn>
          <VBtn icon size="small" variant="text" color="error" @click="confirmDelete(item)">
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
          <VTextField
            :model-value="maskPhone(filters.phone ?? '')"
            label="Telefone"
            prepend-inner-icon="mdi-phone-outline"
            clearable
            hide-details
            density="compact"
            bg-color="grey-lighten-5"
            color="primary"
            base-color="primary"
            @input="(e: Event) => { const v = unmasked((e.target as HTMLInputElement).value).slice(0, 11); filters.phone = v; (e.target as HTMLInputElement).value = maskPhone(v) }"
            @click:clear="filters.phone = undefined"
          />
          <VTextField
            :model-value="maskDocument(filters.document ?? '')"
            label="Documento (CPF/CNPJ)"
            prepend-inner-icon="mdi-card-account-details-outline"
            clearable
            hide-details
            density="compact"
            bg-color="grey-lighten-5"
            color="primary"
            base-color="primary"
            @input="(e: Event) => { const v = unmasked((e.target as HTMLInputElement).value).slice(0, 14); filters.document = v; (e.target as HTMLInputElement).value = maskDocument(v) }"
            @click:clear="filters.document = undefined"
          />
          <VSelect
            v-model="selectedState"
            :items="states"
            item-title="nome"
            item-value="sigla"
            label="Estado"
            prepend-inner-icon="mdi-map-marker-outline"
            clearable
            hide-details
            density="compact"
            :loading="loadingStates"
            bg-color="grey-lighten-5"
            color="primary"
            base-color="primary"
          />
          <VSelect
            v-model="filters.city"
            :items="cities"
            item-title="nome"
            item-value="nome"
            label="Cidade"
            prepend-inner-icon="mdi-city-variant-outline"
            clearable
            hide-details
            density="compact"
            :disabled="!selectedState"
            :loading="loadingCities"
            bg-color="grey-lighten-5"
            color="primary"
            base-color="primary"
          />
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
          Excluir cliente
          <VIcon icon="mdi-alert-circle-outline" color="warning" size="22" />
        </VCardTitle>
        <VCardText>
          Tem certeza que deseja excluir <strong>{{ selectedCustomer?.name }}</strong
          >?
          <br />
          Esta ação não pode ser desfeita.
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn variant="outlined" @click="deleteDialog = false">Cancelar</VBtn>
          <VBtn variant="flat" color="error" :loading="deleting" @click="deleteCustomer"
            >Excluir</VBtn
          >
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { customersService } from '@/services/customers.service'
import { locationsService } from '@/services/locations.service'
import { useToastStore } from '@/stores/toast.store'
import type { Customer, CustomerFilters } from '@/types/customer.types'
import { maskPhone, maskDocument, unmasked } from '@/utils/input-masks'

const toast = useToastStore()

const customers = ref<Customer[]>([])
const total = ref(0)
const loading = ref(false)
const currentPage = ref(1)

const filters = ref<CustomerFilters>({ page: 1, limit: 10 })

const filterDrawer = ref(false)

const states = ref<{ id: number; sigla: string; nome: string }[]>([])
const cities = ref<{ id: number; nome: string }[]>([])
const selectedState = ref<string | null>(null)
const loadingStates = ref(false)
const loadingCities = ref(false)

const deleteDialog = ref(false)
const deleting = ref(false)
const selectedCustomer = ref<Customer | null>(null)

const headers = [
  { title: 'Nome', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Telefone', key: 'phone' },
  { title: 'Documento', key: 'document' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const },
]

const activeExtraFilters = computed(
  () =>
    [filters.value.phone, filters.value.document, filters.value.state, filters.value.city].filter(
      Boolean,
    ).length,
)

async function fetchCustomers(page = 1) {
  loading.value = true
  try {
    const { data } = await customersService.listCustomers({ ...filters.value, page })
    customers.value = data.data
    total.value = data.meta.total
    currentPage.value = page
  } catch {
    toast.triggerToast('Erro ao carregar clientes.', 'error')
  } finally {
    loading.value = false
  }
}

async function fetchStates() {
  loadingStates.value = true
  try {
    const { data } = await locationsService.getStates()
    states.value = data
  } finally {
    loadingStates.value = false
  }
}

async function fetchCities(uf: string) {
  loadingCities.value = true
  try {
    const { data } = await locationsService.getCitiesByState(uf)
    cities.value = data
  } finally {
    loadingCities.value = false
  }
}

watch(selectedState, (newState) => {
  filters.value.city = undefined
  cities.value = []
  filters.value.state = newState ?? undefined
  if (newState) fetchCities(newState)
})

let searchTimeout: ReturnType<typeof setTimeout>
function onFilterChange() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => fetchCustomers(1), 400)
}

function onTableOptions({ page }: { page: number }) {
  fetchCustomers(page)
}

function applyFilters() {
  filterDrawer.value = false
  fetchCustomers(1)
}

function clearExtraFilters() {
  filters.value.phone = undefined
  filters.value.document = undefined
  filters.value.city = undefined
  filters.value.state = undefined
  selectedState.value = null
  filterDrawer.value = false
  fetchCustomers(1)
}

function confirmDelete(customer: Customer) {
  selectedCustomer.value = customer
  deleteDialog.value = true
}

async function deleteCustomer() {
  if (!selectedCustomer.value) return
  deleting.value = true
  try {
    await customersService.removeCustomer(selectedCustomer.value.id)
    toast.triggerToast('Cliente excluído com sucesso.', 'success')
    deleteDialog.value = false
    fetchCustomers(currentPage.value)
  } catch {
    toast.triggerToast('Erro ao excluir cliente.', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchCustomers()
  fetchStates()
})
</script>

<style scoped>
:deep(thead tr th) {
  background-color: #f5f5f5 !important;
  font-weight: 700 !important;
}
</style>
