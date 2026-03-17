<template>
  <VApp>
    <AppSidebar />
    <AppHeader />
    <VMain>
      <VContainer fluid class="pa-6">
        <RouterView />
      </VContainer>
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSideBar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>
