<template>
  <VApp>
    <AppSidebar v-model:drawer="isDrawerOpen" />
    <AppHeader @toggle-drawer="isDrawerOpen = !isDrawerOpen" />
    <VMain>
      <VContainer fluid class="pa-6 bg-grey-lighten-5" style="min-height: 100%">
        <RouterView />
      </VContainer>
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import AppSidebar from '@/components/layout/AppSideBar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const { mobile } = useDisplay()
const isDrawerOpen = ref(!mobile.value)
</script>
