<template>
  <VNavigationDrawer permanent width="240">
    <div class="pa-4 mb-2">
      <span class="text-h6 font-weight-bold">ERP System</span>
    </div>

    <VDivider />

    <VList nav class="mt-2">
      <VListItem
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.label"
        rounded="lg"
        active-color="primary"
      />
    </VList>
  </VNavigationDrawer>
</template>

<script setup lang="ts">
const navItems = [
  { name: 'dashboard', to: { name: 'dashboard' }, icon: 'mdi-view-dashboard', label: 'Dashboard' },
  { name: 'customers', to: { name: 'customers-list' }, icon: 'mdi-account-group', label: 'Clientes' },
  { name: 'products', to: { name: 'products-list' }, icon: 'mdi-package-variant', label: 'Produtos' },
  { name: 'orders', to: { name: 'orders-list' }, icon: 'mdi-cart', label: 'Pedidos' },
]
</script>
