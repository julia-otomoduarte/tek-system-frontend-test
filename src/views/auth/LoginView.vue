<template>
  <VContainer class="fill-height" fluid>
    <VRow align="center" justify="center">
      <VCol cols="12" sm="8" md="4">
        <VCard class="pa-4">
          <VCardTitle class="text-center mb-4">Login</VCardTitle>

          <VForm ref="formRef">
            <VTextField
              v-model="form.email"
              label="E-mail"
              type="email"
              :rules="[rules.required, rules.email]"
              class="mb-3"
            />

            <VTextField
              v-model="form.password"
              label="Senha"
              type="password"
              :rules="[rules.required]"
              class="mb-4"
            />

            <VBtn
              type="button"
              color="primary"
              block
              :loading="isLoading"
              @click="handleSubmit"
            >
              Entrar
            </VBtn>
          </VForm>

          <div class="text-center mt-4">
            <RouterLink to="/register">Não tem conta? Registre-se</RouterLink>
          </div>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { VForm } from 'vuetify/components'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import { useToastStore } from '@/stores/toast.store'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const formRef = ref<InstanceType<typeof VForm> | null>(null)
const isLoading = ref(false)

const form = reactive({
  email: '',
  password: '',
})

const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
  email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail inválido',
}

async function handleSubmit() {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  isLoading.value = true
  try {
    await authStore.loginUser(form)
    toastStore.triggerToast('Login realizado com sucesso!', 'success')
    router.push({ name: 'dashboard' })
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message ?? 'Erro ao realizar login.'
      : 'Erro inesperado.'
    toastStore.triggerToast(message, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>
