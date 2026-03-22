<template>
  <VContainer
    class="bg-[url(/tek-system-background.jpg)] bg-cover bg-center pa-0"
    fluid
    style="min-height: 100vh"
  >
    <VRow
      align="center"
      justify="center"
      style="min-height: 100vh; background-color: rgba(17, 21, 54, 0.7)"
      class="ma-0"
    >
      <VCol cols="12" sm="8" md="4">
        <VCard class="pa-8 flex flex-col justify-center items-center rounded-xl" elevation="10">
          <div class="text-center mb-4 w-full flex justify-center">
            <img src="/tek-system.png" alt="Tek System" style="max-height: 80px" />
          </div>
          <VCardTitle style="font-weight: 500; font-size: 1.5rem; margin-bottom: 1rem"
            >Login</VCardTitle
          >

          <VForm ref="formRef">
            <VTextField
              v-model="form.email"
              label="E-mail"
              type="email"
              :rules="[rules.required, rules.email]"
              class="mb-3"
              bg-color="grey-lighten-5"
              color="primary"
              base-color="primary"
            />

            <VTextField
              v-model="form.password"
              label="Senha"
              type="password"
              :rules="[rules.required]"
              class="mb-4"
              bg-color="grey-lighten-5"
              color="primary"
              base-color="primary"
            />

            <VBtn
              type="button"
              color="primary"
              block
              :loading="isLoading"
              @click="handleSubmit"
              style="font-size: 1rem; font-weight: 600"
            >
              Entrar
            </VBtn>
          </VForm>

          <div class="text-center mt-4">
            Não tem conta? <RouterLink to="/register" class="register-link">Registre-se</RouterLink>
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
      ? (error.response?.data?.message ?? 'Erro ao realizar login.')
      : 'Erro inesperado.'
    toastStore.triggerToast(message, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-link {
  text-decoration: none;
}
.register-link:hover {
  text-decoration: underline;
}
</style>
