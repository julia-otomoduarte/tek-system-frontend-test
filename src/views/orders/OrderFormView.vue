<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">{{ isEdit ? 'Editar Pedido' : 'Novo Pedido' }}</h1>
        <div class="text-body-2 text-medium-emphasis mt-1">
          <RouterLink :to="{ name: 'orders-list' }" class="text-decoration-none"
            >Pedidos</RouterLink
          >
          &rsaquo; {{ isEdit ? 'Editar' : 'Novo' }}
        </div>
      </div>
    </div>

    <VForm ref="formRef" @submit.prevent="onSubmit">
      <VCard rounded="lg" elevation="0" border class="mb-4">
        <VCardTitle class="pa-4 pb-0 mb-4">Cliente</VCardTitle>
        <VCardText>
          <VAutocomplete
            v-model="form.customerId"
            :items="customerOptions"
            item-title="name"
            item-value="id"
            label="Selecionar cliente"
            prepend-inner-icon="mdi-account-search"
            clearable
            density="compact"
            bg-color="grey-lighten-5"
            color="primary"
            base-color="primary"
            :loading="loadingCustomers"
            no-data-text="Nenhum cliente encontrado"
            :rules="[rules.required]"
            @update:search="onCustomerSearch"
          />
        </VCardText>
      </VCard>

      <VCard rounded="lg" elevation="0" border class="mb-6">
        <VCardTitle class="pa-4 pb-2 mb-4">Itens do Pedido</VCardTitle>
        <VCardText>
          <div v-for="(item, index) in form.items" :key="index" class="mb-3">
            <VRow align="center">
              <VCol cols="12" sm="7">
                <VAutocomplete
                  v-model="item.productId"
                  :items="productOptions"
                  item-title="name"
                  item-value="id"
                  label="Produto"
                  density="compact"
                  bg-color="grey-lighten-5"
                  color="primary"
                  base-color="primary"
                  clearable
                  hide-details
                  :loading="loadingProducts"
                  no-data-text="Nenhum produto encontrado"
                  :rules="[rules.required]"
                  @update:search="onProductSearch"
                  @update:model-value="(id) => onProductSelect(id, index)"
                />
              </VCol>
              <VCol cols="8" sm="3">
                <VTextField
                  v-model.number="item.quantity"
                  label="Quantidade"
                  type="number"
                  density="compact"
                  bg-color="grey-lighten-5"
                  color="primary"
                  base-color="primary"
                  hide-details
                  :rules="[rules.minOne]"
                  min="1"
                />
              </VCol>
              <VCol cols="4" sm="2" class="d-flex justify-end">
                <VBtn
                  icon
                  variant="text"
                  color="error"
                  size="small"
                  :disabled="form.items.length === 1"
                  @click="removeItem(index)"
                >
                  <VIcon icon="mdi-delete" />
                </VBtn>
              </VCol>
            </VRow>

            <div v-if="item.unitPrice" class="text-caption text-medium-emphasis mt-1 pl-1">
              {{ formatCurrency(item.unitPrice) }} × {{ item.quantity }} =
              <strong>{{ formatCurrency(item.unitPrice * item.quantity) }}</strong>
            </div>
          </div>

          <VBtn
            variant="text"
            color="primary"
            prepend-icon="mdi-plus"
            class="mt-2"
            @click="addItem"
          >
            Adicionar item
          </VBtn>

          <VDivider class="my-4" />

          <div class="d-flex justify-end">
            <span class="text-subtitle-1 font-weight-bold">
              Total: {{ formatCurrency(total) }}
            </span>
          </div>
        </VCardText>
      </VCard>

      <div class="d-flex justify-end ga-3">
        <VBtn variant="outlined" :to="{ name: 'orders-list' }">Cancelar</VBtn>
        <VBtn type="submit" color="primary" :loading="saving">
          {{ isEdit ? 'Salvar alterações' : 'Criar pedido' }}
        </VBtn>
      </div>
    </VForm>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ordersService } from '@/services/orders.service'
import { customersService } from '@/services/customers.service'
import { productsService } from '@/services/products.service'
import { useToastStore } from '@/stores/toast.store'
import { getApiError } from '@/utils/api-error'
import type { Customer } from '@/types/customer.types'
import type { Product } from '@/types/product.types'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const formRef = ref()

const form = ref({
  customerId: '',
  items: [{ productId: '', quantity: 1, unitPrice: 0 }],
})

const customerOptions = ref<Customer[]>([])
const loadingCustomers = ref(false)

const productOptions = ref<Product[]>([])
const loadingProducts = ref(false)

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  minOne: (v: number) => v >= 1 || 'Mínimo 1',
}

const total = computed(() =>
  form.value.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
)

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function addItem() {
  form.value.items.push({ productId: '', quantity: 1, unitPrice: 0 })
}

function removeItem(index: number) {
  form.value.items.splice(index, 1)
}

function onProductSelect(productId: string | null, index: number) {
  const product = productOptions.value.find((p) => p.id === productId)
  const item = form.value.items[index]
  if (item) item.unitPrice = product?.price ?? 0
}

async function loadItemPrices(items: { productId: string; quantity: number }[]) {
  return Promise.all(
    items.map(async (item) => {
      try {
        const { data } = await productsService.getProductById(item.productId)
        return { ...item, unitPrice: data.price }
      } catch {
        return { ...item, unitPrice: 0 }
      }
    }),
  )
}

async function fetchOrder(id: string) {
  try {
    const { data } = await ordersService.getOrderById(id)

    if (data.customer) {
      const currentCustomer = data.customer as unknown as Customer
      if (!customerOptions.value.some((c) => c.id === currentCustomer.id)) {
        customerOptions.value.unshift(currentCustomer)
      }
    }

    const itemsWithPrices = await loadItemPrices(
      data.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    )

    form.value = {
      customerId: data.customerId,
      items: itemsWithPrices,
    }
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao carregar pedido.'), 'error')
    router.push({ name: 'orders-list' })
  }
}

let customerTimeout: ReturnType<typeof setTimeout>
async function fetchCustomers(name = '') {
  loadingCustomers.value = true
  try {
    const { data } = await customersService.listCustomers({ name, limit: 20 })
    const results = data.data
    if (form.value.customerId && !results.some((c) => c.id === form.value.customerId)) {
      const current = customerOptions.value.find((c) => c.id === form.value.customerId)
      if (current) results.unshift(current)
    }
    customerOptions.value = results
  } finally {
    loadingCustomers.value = false
  }
}
function onCustomerSearch(search: string) {
  clearTimeout(customerTimeout)
  customerTimeout = setTimeout(() => fetchCustomers(search ?? ''), 400)
}

let productTimeout: ReturnType<typeof setTimeout>
async function fetchProducts(name = '') {
  loadingProducts.value = true
  try {
    const { data } = await productsService.listProducts({ name, limit: 50 })
    productOptions.value = data.data
  } finally {
    loadingProducts.value = false
  }
}
function onProductSearch(search: string) {
  clearTimeout(productTimeout)
  productTimeout = setTimeout(() => fetchProducts(search ?? ''), 400)
}

async function onSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const payload = {
      customerId: form.value.customerId,
      items: form.value.items.map(({ productId, quantity }) => ({ productId, quantity })),
    }

    if (isEdit.value) {
      await ordersService.updateOrder(route.params.id as string, payload)
      toast.triggerToast('Pedido atualizado com sucesso.', 'success')
    } else {
      await ordersService.createOrder(payload)
      toast.triggerToast('Pedido criado com sucesso.', 'success')
    }

    router.push({ name: 'orders-list' })
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao salvar pedido.'), 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchCustomers()
  fetchProducts()
  if (isEdit.value) {
    fetchOrder(route.params.id as string)
  }
})
</script>
