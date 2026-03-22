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
          <VCardTitle style="font-weight: 500; font-size: 1.5rem; margin-bottom: 1rem">
            Criar Conta
          </VCardTitle>

          <VForm ref="formRef">
            <VTextField
              v-model="form.name"
              label="Nome"
              :rules="[rules.required]"
              class="mb-3"
              bg-color="grey-lighten-5"
              color="primary"
              base-color="primary"
            />

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
              :rules="[rules.required, rules.minLength]"
              class="mb-3"
              bg-color="grey-lighten-5"
              color="primary"
              base-color="primary"
            />

            <VTextField
              v-model="form.confirmPassword"
              label="Confirmar Senha"
              type="password"
              :rules="[rules.required, rules.passwordMatch]"
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
              Registrar
            </VBtn>
          </VForm>

          <div class="text-center mt-4">
            Já tem conta? <RouterLink to="/login" class="login-link">Faça login</RouterLink>
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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
  email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail inválido',
  minLength: (value: string) => value.length >= 6 || 'Mínimo 6 caracteres',
  passwordMatch: (value: string) => value === form.password || 'As senhas não coincidem',
}

async function handleSubmit() {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  isLoading.value = true
  try {
    await authStore.registerUser({
      name: form.name,
      email: form.email,
      password: form.password,
    })
    toastStore.triggerToast('Conta criada com sucesso!', 'success')
    router.push({ name: 'dashboard' })
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message ?? 'Erro ao criar conta.'
      : 'Erro inesperado.'
    toastStore.triggerToast(message, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-link {
  text-decoration: none;
}
.login-link:hover {
  text-decoration: underline;
}
</style>
