<template>
  <div>
    <div class="d-flex align-center justify-end mb-6">
      <VBtn color="primary" prepend-icon="mdi-plus" :to="{ name: 'product-create' }">
        Novo Produto
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
            v-model="filters.sku"
            label="Buscar por SKU"
            prepend-inner-icon="mdi-barcode"
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
        :items="products"
        :items-length="total"
        :loading="loading"
        :items-per-page="10"
        @update:options="onTableOptions"
      >
        <template #[`item.price`]="{ item }">
          {{ formatCurrency(item.price) }}
        </template>
        <template #[`item.actions`]="{ item }">
          <VBtn
            icon
            size="small"
            variant="text"
            :to="{ name: 'product-edit', params: { id: item.id } }"
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

        <p class="text-body-2 text-medium-emphasis mb-2">Faixa de preço</p>
        <VRow class="ma-0">
          <VCol cols="6" class="pa-1">
            <VTextField
              v-model.number="filters.priceGte"
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
              v-model.number="filters.priceLte"
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

        <div class="d-flex ga-2 mt-6">
          <VBtn variant="outlined" class="flex-grow-1" @click="clearExtraFilters">Limpar</VBtn>
          <VBtn color="primary" class="flex-grow-1" @click="applyFilters">Aplicar</VBtn>
        </div>
      </div>
    </VNavigationDrawer>

    <VDialog v-model="deleteDialog" max-width="400">
      <VCard class="rounded-xl py-4">
        <VCardTitle class="text-h6 font-weight-bold d-flex align-center gap-2">
          Excluir produto
          <VIcon icon="mdi-alert-circle-outline" color="warning" size="22" />
        </VCardTitle>
        <VCardText>
          Tem certeza que deseja excluir <strong>{{ selectedProduct?.name }}</strong
          >?
          <br />
          Esta ação não pode ser desfeita.
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn variant="outlined" @click="deleteDialog = false">Cancelar</VBtn>
          <VBtn variant="flat" color="error" :loading="deleting" @click="deleteProduct"
            >Excluir</VBtn
          >
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { productsService } from '@/services/products.service'
import { useToastStore } from '@/stores/toast.store'
import { getApiError } from '@/utils/api-error'
import type { Product, ProductFilters } from '@/types/product.types'

const toast = useToastStore()

const products = ref<Product[]>([])
const total = ref(0)
const loading = ref(false)
const currentPage = ref(1)

const filters = ref<ProductFilters>({ page: 1, limit: 10 })
const filterDrawer = ref(false)

const deleteDialog = ref(false)
const deleting = ref(false)
const selectedProduct = ref<Product | null>(null)

const headers = [
  { title: 'SKU', key: 'sku' },
  { title: 'Nome', key: 'name' },
  { title: 'Descrição', key: 'description' },
  { title: 'Preço', key: 'price' },
  { title: 'Estoque', key: 'stock' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' as const },
]

const activeExtraFilters = computed(
  () =>
    [filters.value.priceGte, filters.value.priceLte].filter((v) => v !== undefined && v !== null)
      .length,
)

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function fetchProducts(page = 1) {
  loading.value = true
  try {
    const { data } = await productsService.listProducts({ ...filters.value, page })
    products.value = data.data
    total.value = data.meta.total
    currentPage.value = page
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao carregar produtos.'), 'error')
  } finally {
    loading.value = false
  }
}

let searchTimeout: ReturnType<typeof setTimeout>
function onFilterChange() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => fetchProducts(1), 400)
}

function onTableOptions({ page }: { page: number }) {
  fetchProducts(page)
}

function applyFilters() {
  filterDrawer.value = false
  fetchProducts(1)
}

function clearExtraFilters() {
  filters.value.priceGte = undefined
  filters.value.priceLte = undefined
  filterDrawer.value = false
  fetchProducts(1)
}

function confirmDelete(product: Product) {
  selectedProduct.value = product
  deleteDialog.value = true
}

async function deleteProduct() {
  if (!selectedProduct.value) return
  deleting.value = true
  try {
    await productsService.removeProduct(selectedProduct.value.id)
    toast.triggerToast('Produto excluído com sucesso.', 'success')
    deleteDialog.value = false
    fetchProducts(currentPage.value)
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao excluir produto.'), 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => fetchProducts())
</script>

<style scoped>
:deep(thead tr th) {
  background-color: #f5f5f5 !important;
  font-weight: 700 !important;
}
</style>
