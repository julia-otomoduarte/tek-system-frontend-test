<template>
  <VNavigationDrawer
    :model-value="drawer"
    :temporary="isMobile"
    :permanent="!isMobile"
    width="240"
    @update:model-value="emit('update:drawer', $event)"
  >
    <div class="pa-4 mb-2">
      <span class="text-h6 font-weight-bold">Tek-System</span>
    </div>

    <VDivider />

    <VList nav class="mt-2">
      <VListItem
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        :exact="item.exact"
        :prepend-icon="item.icon"
        :title="item.label"
        rounded="lg"
        active-color="secondary"
        style="font-size: 1rem"
      />
      <VListItem
        :to="{ name: 'profile' }"
        prepend-icon="mdi-account-circle"
        title="Perfil"
        rounded="lg"
        active-color="secondary"
      />
    </VList>
  </VNavigationDrawer>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { mobile: isMobile } = useDisplay()

defineProps<{ drawer: boolean }>()
const emit = defineEmits<{ (e: 'update:drawer', value: boolean): void }>()

const navItems = [
  {
    name: 'dashboard',
    to: { name: 'dashboard' },
    icon: 'mdi-view-dashboard',
    label: 'Dashboard',
    exact: true,
  },
  {
    name: 'customers',
    to: { name: 'customers-list' },
    icon: 'mdi-account-group',
    label: 'Clientes',
    exact: false,
  },
  {
    name: 'products',
    to: { name: 'products-list' },
    icon: 'mdi-package-variant',
    label: 'Produtos',
    exact: false,
  },
  { name: 'orders', to: { name: 'orders-list' }, icon: 'mdi-cart', label: 'Pedidos', exact: false },
]
</script>

<style scoped>
:deep(.v-list-item:hover > .v-list-item__overlay) {
  background-color: #761c1e;
  opacity: 0.1;
}
:deep(.v-list-item:hover .v-list-item-title),
:deep(.v-list-item:hover .v-icon) {
  color: #761c1e;
}
</style>
