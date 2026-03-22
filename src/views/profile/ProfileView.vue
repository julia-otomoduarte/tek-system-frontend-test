<template>
  <div>
    <div class="d-flex align-center justify-end mb-6">
      <VBtn color="error" variant="outlined" prepend-icon="mdi-logout" @click="logout">Sair</VBtn>
    </div>

    <div v-if="loading" class="d-flex justify-center pa-8">
      <VProgressCircular indeterminate color="primary" />
    </div>

    <VRow v-else>
      <VCol cols="12" md="4">
        <VCard rounded="lg" elevation="0" border class="text-center pa-6">
          <VAvatar color="primary" size="80" class="mb-3">
            <span class="text-h5 font-weight-bold text-white">{{ initials }}</span>
          </VAvatar>
          <div class="text-subtitle-1 font-weight-bold">{{ authStore.user?.name }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ authStore.user?.email }}</div>
        </VCard>
      </VCol>

      <VCol cols="12" md="8">
        <VForm ref="formRef" @submit.prevent="onSubmit">
          <VCard rounded="lg" elevation="0" border class="mb-4">
            <VCardTitle class="pa-4 pb-0">Informações Pessoais</VCardTitle>
            <VCardText class="pt-4">
              <VRow>
                <VCol cols="12">
                  <VTextField
                    v-model="form.name"
                    label="Nome"
                    prepend-inner-icon="mdi-account-outline"
                    density="compact"
                    bg-color="grey-lighten-5"
                    color="primary"
                    base-color="primary"
                    :rules="[rules.required]"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="form.email"
                    label="E-mail"
                    prepend-inner-icon="mdi-email-outline"
                    density="compact"
                    bg-color="grey-lighten-5"
                    color="primary"
                    base-color="primary"
                    type="email"
                    :rules="[rules.required, rules.email]"
                  />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <VCard rounded="lg" elevation="0" border class="mb-6">
            <VCardTitle class="pa-4 pb-0">Alterar Senha</VCardTitle>
            <VCardText class="pt-4">
              <p class="text-body-2 text-medium-emphasis mb-4">
                Deixe em branco para manter a senha atual.
              </p>
              <VRow>
                <VCol cols="12">
                  <VTextField
                    v-model="form.password"
                    label="Nova senha"
                    prepend-inner-icon="mdi-lock-outline"
                    density="compact"
                    bg-color="grey-lighten-5"
                    color="primary"
                    base-color="primary"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :rules="form.password ? [rules.minPassword] : []"
                    @click:append-inner="showPassword = !showPassword"
                  />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <div class="d-flex justify-space-between">
            <VBtn
              color="error"
              variant="text"
              prepend-icon="mdi-delete-outline"
              @click="deleteDialog = true"
              >Excluir conta</VBtn
            >
            <VBtn type="submit" color="primary" :loading="saving">Salvar alterações</VBtn>
          </div>
        </VForm>
      </VCol>
    </VRow>

    <VDialog v-model="deleteDialog" max-width="400">
      <VCard class="rounded-xl py-4">
        <VCardTitle class="text-h6 font-weight-bold d-flex align-center gap-2">
          Excluir conta
          <VIcon icon="mdi-alert-circle-outline" color="warning" size="22" />
        </VCardTitle>
        <VCardText>
          Tem certeza que deseja excluir sua conta? <br />
          Esta ação não pode ser desfeita.
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn variant="outlined" @click="deleteDialog = false">Cancelar</VBtn>
          <VBtn variant="flat" color="error" :loading="deleting" @click="deleteAccount"
            >Excluir</VBtn
          >
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToastStore } from '@/stores/toast.store'
import { getApiError } from '@/utils/api-error'
import api from '@/plugins/axios'

const authStore = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const formRef = ref()
const saving = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const deleteDialog = ref(false)
const deleting = ref(false)

const form = ref({
  name: authStore.user?.name ?? '',
  email: authStore.user?.email ?? '',
  password: '',
})

const initials = computed(() => {
  const name = authStore.user?.name ?? ''
  return name
    .split(' ')
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
})

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido',
  minPassword: (v: string) => v.length >= 6 || 'Mínimo 6 caracteres',
}

function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('accessToken')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? '')) as { sub?: string; id?: string }
    return payload.sub ?? payload.id ?? null
  } catch {
    return null
  }
}

async function fetchUser(id: string) {
  loading.value = true
  try {
    const { data } = await api.get<{ id: string; name: string; email: string }>(`/users/${id}`)
    authStore.user = { id: data.id, name: data.name, email: data.email }
    localStorage.setItem('user', JSON.stringify(authStore.user))
    form.value.name = data.name
    form.value.email = data.email
  } catch {
    toast.triggerToast('Erro ao carregar dados do perfil.', 'error')
    router.push({ name: 'dashboard' })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!authStore.user) {
    const userId = getUserIdFromToken()
    if (userId) {
      await fetchUser(userId)
    } else {
      router.push({ name: 'login' })
    }
  }
})

async function deleteAccount() {
  deleting.value = true
  try {
    await api.delete(`/users/${authStore.user?.id}`)
    authStore.logoutUser()
    router.push({ name: 'login' })
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao excluir conta.'), 'error')
  } finally {
    deleting.value = false
  }
}

function logout() {
  authStore.logoutUser()
  router.push({ name: 'login' })
}

async function onSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const payload: { name: string; email: string; password?: string } = {
      name: form.value.name,
      email: form.value.email,
    }
    if (form.value.password) {
      payload.password = form.value.password
    }

    const { data } = await api.patch<{ id: string; name: string; email: string }>(
      `/users/${authStore.user?.id}`,
      payload,
    )

    authStore.user = { id: data.id, name: data.name, email: data.email }
    localStorage.setItem('user', JSON.stringify(authStore.user))

    form.value.password = ''
    toast.triggerToast('Perfil atualizado com sucesso.', 'success')
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao atualizar perfil.'), 'error')
  } finally {
    saving.value = false
  }
}
</script>
