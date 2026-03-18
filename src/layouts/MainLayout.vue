<template>
  <VApp>
    <AppSidebar v-model:drawer="isDrawerOpen" />
    <AppHeader @toggle-drawer="isDrawerOpen = !isDrawerOpen" />
    <VMain>
      <VContainer fluid class="pa-6">
        <RouterView />
      </VContainer>
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const { mobile } = useDisplay()
const isDrawerOpen = ref(!mobile.value)
</script>
