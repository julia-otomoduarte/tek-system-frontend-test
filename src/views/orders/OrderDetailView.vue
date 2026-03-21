<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <div class="d-flex align-center ga-3">
          <h1 class="text-h5 font-weight-bold">Pedido #{{ order?.orderNumber }}</h1>
          <VChip v-if="order" :color="statusConfig[order.status]?.color" size="small" label>
            {{ statusConfig[order.status]?.label }}
          </VChip>
        </div>
        <div class="text-body-2 text-medium-emphasis mt-1">
          <RouterLink :to="{ name: 'orders-list' }" class="text-decoration-none"
            >Pedidos</RouterLink
          >
          &rsaquo; Detalhe
        </div>
      </div>
      <VBtn
        v-if="canChangeStatus"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-swap-horizontal"
        @click="statusDialog = true"
      >
        Alterar Status
      </VBtn>
    </div>

    <div v-if="loading" class="d-flex justify-center pa-8">
      <VProgressCircular indeterminate color="primary" />
    </div>

    <template v-else-if="order">
      <VRow>
        <VCol cols="12" md="6">
          <VCard rounded="lg" elevation="0" border height="100%">
            <VCardTitle class="pa-4 pb-2">Dados do Pedido</VCardTitle>
            <VCardText class="pa-0">
              <VList>
                <VListItem>
                  <template #prepend>
                    <VIcon icon="mdi-calendar-outline" color="primary" class="mr-3" />
                  </template>
                  <VListItemTitle class="text-body-2 font-weight-medium"
                    >Data do Pedido</VListItemTitle
                  >
                  <VListItemSubtitle>{{ formatDate(order.createdAt) }}</VListItemSubtitle>
                </VListItem>
                <VDivider />
                <VListItem>
                  <template #prepend>
                    <VIcon icon="mdi-currency-usd" color="primary" class="mr-3" />
                  </template>
                  <VListItemTitle class="text-body-2 font-weight-medium"
                    >Valor Total</VListItemTitle
                  >
                  <VListItemSubtitle>{{ formatCurrency(order.total) }}</VListItemSubtitle>
                </VListItem>
                <VDivider />
                <VListItem>
                  <template #prepend>
                    <VIcon icon="mdi-tag-outline" color="primary" class="mr-3" />
                  </template>
                  <VListItemTitle class="text-body-2 font-weight-medium">Status</VListItemTitle>
                  <VListItemSubtitle>
                    <VChip
                      :color="statusConfig[order.status]?.color"
                      size="x-small"
                      label
                      class="mt-1"
                    >
                      {{ statusConfig[order.status]?.label }}
                    </VChip>
                  </VListItemSubtitle>
                </VListItem>
              </VList>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="12" md="6">
          <VCard rounded="lg" elevation="0" border height="100%">
            <VCardTitle class="pa-4 pb-2">Dados do Cliente</VCardTitle>
            <VCardText class="pa-0">
              <VList>
                <VListItem>
                  <template #prepend>
                    <VIcon icon="mdi-account-outline" color="primary" class="mr-3" />
                  </template>
                  <VListItemTitle class="text-body-2 font-weight-medium">Nome</VListItemTitle>
                  <VListItemSubtitle>
                    <RouterLink
                      :to="{ name: 'customer-edit', params: { id: order.customer?.id } }"
                      class="text-decoration-none text-primary"
                    >
                      {{ order.customer?.name }}
                    </RouterLink>
                  </VListItemSubtitle>
                </VListItem>
                <VDivider />
                <VListItem>
                  <template #prepend>
                    <VIcon icon="mdi-email-outline" color="primary" class="mr-3" />
                  </template>
                  <VListItemTitle class="text-body-2 font-weight-medium">Email</VListItemTitle>
                  <VListItemSubtitle>{{ order.customer?.email }}</VListItemSubtitle>
                </VListItem>
                <VDivider />
                <VListItem>
                  <template #prepend>
                    <VIcon icon="mdi-phone-outline" color="primary" class="mr-3" />
                  </template>
                  <VListItemTitle class="text-body-2 font-weight-medium">Telefone</VListItemTitle>
                  <VListItemSubtitle>{{ order.customer?.phone ?? '-' }}</VListItemSubtitle>
                </VListItem>
                <VDivider />
                <VListItem>
                  <template #prepend>
                    <VIcon icon="mdi-card-account-details-outline" color="primary" class="mr-3" />
                  </template>
                  <VListItemTitle class="text-body-2 font-weight-medium">Documento</VListItemTitle>
                  <VListItemSubtitle>{{ order.customer?.document ?? '-' }}</VListItemSubtitle>
                </VListItem>
                <VDivider />
                <VListItem>
                  <template #prepend>
                    <VIcon icon="mdi-map-marker-outline" color="primary" class="mr-3" />
                  </template>
                  <VListItemTitle class="text-body-2 font-weight-medium">Localidade</VListItemTitle>
                  <VListItemSubtitle>
                    {{ order.customer?.address?.city && order.customer?.address?.state
                      ? `${order.customer.address.city} - ${order.customer.address.state}`
                      : '-' }}
                  </VListItemSubtitle>
                </VListItem>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <VCard rounded="lg" elevation="0" border class="mt-4">
        <VCardTitle class="pa-4 pb-2">Itens do Pedido</VCardTitle>
        <VTable>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço Unit.</th>
              <th class="text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.productId">
              <td>{{ item.sku }}</td>
              <td>{{ item.productName }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatCurrency(item.unitPrice) }}</td>
              <td class="text-right">{{ formatCurrency(item.unitPrice * item.quantity) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="text-right font-weight-bold pa-3">Total</td>
              <td class="text-right font-weight-bold pa-3">{{ formatCurrency(order.total) }}</td>
            </tr>
          </tfoot>
        </VTable>
      </VCard>
    </template>

    <VDialog v-model="statusDialog" max-width="400">
      <VCard>
        <VCardTitle class="pa-4">Alterar Status</VCardTitle>
        <VCardText>
          <VSelect
            v-model="newStatus"
            :items="availableStatuses"
            item-title="label"
            item-value="value"
            label="Novo status"
            density="compact"
          >
            <template #selection="{ item }">
              <VChip :color="statusConfig[item.value as OrderStatus]?.color" size="small" label>
                {{ statusConfig[item.value as OrderStatus]?.label }}
              </VChip>
            </template>
          </VSelect>
        </VCardText>
        <VCardActions class="justify-end pa-4 pt-0">
          <VBtn variant="text" @click="statusDialog = false">Cancelar</VBtn>
          <VBtn
            color="primary"
            :loading="updatingStatus"
            :disabled="!newStatus"
            @click="changeStatus"
          >
            Confirmar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ordersService } from '@/services/orders.service'
import { useToastStore } from '@/stores/toast.store'
import { getApiError } from '@/utils/api-error'
import type { Order, OrderStatus } from '@/types/order.types'
import { customersService } from '@/services/customers.service'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const order = ref<Order | null>(null)
const loading = ref(false)
const statusDialog = ref(false)
const newStatus = ref<OrderStatus | null>(null)
const updatingStatus = ref(false)

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  DRAFT: { label: 'Rascunho', color: 'grey' },
  PENDING: { label: 'Pendente', color: 'blue' },
  COMPLETED: { label: 'Concluído', color: 'green' },
  CANCELED: { label: 'Cancelado', color: 'red' },
}

const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: ['PENDING', 'COMPLETED', 'CANCELED'],
  PENDING: ['COMPLETED', 'CANCELED'],
  COMPLETED: [],
  CANCELED: [],
}

const canChangeStatus = computed(() =>
  order.value ? statusTransitions[order.value.status].length > 0 : false,
)

const availableStatuses = computed(() => {
  if (!order.value) return []
  return statusTransitions[order.value.status].map((value) => ({
    value,
    label: statusConfig[value].label,
  }))
})

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

async function fetchOrder() {
  loading.value = true
  try {
    const { data } = await ordersService.getOrderById(route.params.id as string)
    console.log(data)
    order.value = data
    const customerData = await fetchCustomer(data.customerId)
    if (customerData) {
      order.value.customer = customerData
    }
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao carregar pedido.'), 'error')
    router.push({ name: 'orders-list' })
  } finally {
    loading.value = false
  }
}

async function fetchCustomer(id: string) {
  try {
    const { data } = await customersService.getCustomerById(id)
    return data
  } catch {
    return null
  }
}

async function changeStatus() {
  if (!newStatus.value || !order.value) return
  updatingStatus.value = true
  try {
    await ordersService.updateStatus(order.value.id, newStatus.value)
    order.value.status = newStatus.value
    toast.triggerToast('Status atualizado com sucesso.', 'success')
    statusDialog.value = false
    newStatus.value = null
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao atualizar status.'), 'error')
  } finally {
    updatingStatus.value = false
  }
}

onMounted(fetchOrder)
</script>
