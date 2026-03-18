<template>
  <VAppBar elevation="0" border="b">
    <template #prepend>
      <VBtn icon @click="emit('toggle-drawer')">
        <VIcon>mdi-menu</VIcon>
      </VBtn>
    </template>

    <VAppBarTitle>{{ pageTitle }}</VAppBarTitle>

    <template #append>
      <VBtn icon @click="router.push({ name: 'profile' })">
        <VAvatar color="primary" size="36">
          <span class="text-body-2 font-weight-bold">{{ userInitials }}</span>
        </VAvatar>
      </VBtn>
    </template>
  </VAppBar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const emit = defineEmits<{ (e: 'toggle-drawer'): void }>()


const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const userInitials = computed(() => {
  const name = authStore.user?.name ?? ''
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
})

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  'customers-list': 'Clientes',
  'customer-create': 'Novo Cliente',
  'customer-edit': 'Editar Cliente',
  'products-list': 'Produtos',
  'product-create': 'Novo Produto',
  'product-edit': 'Editar Produto',
  'orders-list': 'Pedidos',
  'order-create': 'Novo Pedido',
  'order-detail': 'Detalhe do Pedido',
  profile: 'Meu Perfil',
}

const pageTitle = computed(() => pageTitles[route.name as string] ?? '')
</script>
