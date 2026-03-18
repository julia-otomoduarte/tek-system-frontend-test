<template>
  <div>
 
    <VRow class="mb-4">
      <VCol cols="12" sm="6" lg="3">
        <VCard color="blue-lighten-4" rounded="lg" elevation="0" height="100%">
          <VCardText class="pa-5">
            <div class="d-flex align-center mb-3">
              <VIcon icon="mdi-cash-multiple" color="blue-darken-2" size="20" class="mr-2" />
              <span class="text-body-2 text-medium-emphasis">Faturamento Total</span>
            </div>
            <div v-if="isLoading">
              <VProgressCircular indeterminate size="20" color="blue-darken-2" />
            </div>
            <div v-else class="text-h6 font-weight-bold text-blue-darken-2">
              {{ formatCurrency(stats?.totalRevenue ?? 0) }}
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        v-for="item in orderStatuses"
        :key="item.key"
        cols="12"
        sm="6"
        md="3"
      >
        <VCard :color="`${item.color}-lighten-4`" rounded="lg" elevation="0" height="100%">
          <VCardText class="pa-5">
            <div class="d-flex align-center mb-3">
              <VIcon :icon="item.icon" :color="`${item.color}-darken-2`" size="20" class="mr-2" />
              <span class="text-body-2 text-medium-emphasis">{{ item.label }}</span>
            </div>
            <div v-if="isLoading">
              <VProgressCircular indeterminate size="20" :color="`${item.color}-darken-2`" />
            </div>
            <div v-else :class="`text-h6 font-weight-bold text-${item.color}-darken-2`">
              {{ item.count }}
            </div>
            <div class="text-caption text-medium-emphasis mt-1">Pedidos</div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>


    <VRow>
      <VCol cols="12">
        <VCard rounded="lg" elevation="0" border>
          <VCardTitle class="pa-6 pb-2 text-body-1 font-weight-bold">
            Top 5 Produtos Mais Vendidos
          </VCardTitle>
          <VDataTable
            :headers="tableHeaders"
            :items="topProducts"
            :loading="isLoading"
            hide-default-footer
          >
            <template #no-data>
              <div class="text-center pa-6 text-medium-emphasis">
                Nenhum produto vendido ainda.
              </div>
            </template>
          </VDataTable>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed} from 'vue'
import { dashboardService} from '@/services/dashboard.service'
import { useToastStore } from '@/stores/toast.store'
import type { DashboardResponse } from '@/types/dashboard.types'

const toastStore = useToastStore()
const isLoading = ref(false)
const stats = ref<DashboardResponse | null>(null)

const tableHeaders = [
  { title: 'Produto', key: 'productName', align: 'start' as const },
  { title: 'Qtd. Vendida', key: 'totalQuantityFormatted', align: 'end' as const },
]

const topProducts = computed(() =>
  (stats.value?.topProducts ?? []).map((p) => ({
    ...p,
    totalQuantityFormatted: `${p.totalQuantity} un.`,
  }))
)

const defaultStatuses = [
  { label: 'Rascunho', key: 'DRAFT', color: 'grey', icon: 'mdi-pencil-outline' },
  { label: 'Pendente', key: 'PENDING', color: 'orange', icon: 'mdi-clock-outline' },
  { label: 'Concluído', key: 'COMPLETED', color: 'green', icon: 'mdi-check-circle-outline' },
  { label: 'Cancelado', key: 'CANCELED', color: 'red', icon: 'mdi-close-circle-outline' },
]

const orderStatuses = computed(() =>
  defaultStatuses.map((item) => ({
    ...item,
    count: stats.value?.ordersByStatus.find((o) => o.status === item.key)?.count ?? 0,
  }))
)

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

onMounted(async () => {
  isLoading.value = true
  try {
    stats.value = await dashboardService.getStats()
  } catch {
    toastStore.triggerToast('Erro ao carregar dados do dashboard.', 'error')
  } finally {
    isLoading.value = false
  }
})
</script>
