<template>
  <VSnackbar
    v-model="toastStore.showToast"
    :color="toastStore.color"
    :timeout="3000"
    location="top"
  >
    {{ toastStore.message }}
  </VSnackbar>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast.store'

const toastStore = useToastStore()
</script>