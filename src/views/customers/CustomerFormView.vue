<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <div class="text-body-2 text-medium-emphasis mt-1">
          <RouterLink :to="{ name: 'customers-list' }" class="text-decoration-none">
            Clientes
          </RouterLink>
          &rsaquo; {{ isEdit ? 'Editar' : 'Novo' }}
        </div>
      </div>
    </div>

    <VForm ref="formRef" @submit.prevent="onSubmit">
      <VCard rounded="lg" elevation="0" border class="mb-4">
        <VCardTitle class="pa-4 pb-0 mb-4">Dados Pessoais</VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.name"
                label="Nome completo"
                :rules="[rules.required]"
                density="compact"
                bg-color="grey-lighten-5"
                color="primary"
                base-color="primary"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                density="compact"
                bg-color="grey-lighten-5"
                color="primary"
                base-color="primary"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                :model-value="maskPhone(form.phone)"
                label="Telefone"
                :rules="[rules.required]"
                density="compact"
                bg-color="grey-lighten-5"
                color="primary"
                base-color="primary"
                @input="(e: Event) => { const v = unmasked((e.target as HTMLInputElement).value).slice(0, 11); form.phone = v; (e.target as HTMLInputElement).value = maskPhone(v) }"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                :model-value="maskDocument(form.document)"
                label="CPF / CNPJ"
                :rules="[rules.required]"
                density="compact"
                bg-color="grey-lighten-5"
                color="primary"
                base-color="primary"
                @input="(e: Event) => { const v = unmasked((e.target as HTMLInputElement).value).slice(0, 14); form.document = v; (e.target as HTMLInputElement).value = maskDocument(v) }"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <VCard rounded="lg" elevation="0" border class="mb-6">
        <VCardTitle class="pa-4 pb-0 mb-4">Endereço</VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" md="3">
              <VTextField
                v-model="form.address.zipCode"
                label="CEP"
                density="compact"
                bg-color="grey-lighten-5"
                color="primary"
                base-color="primary"
                :loading="loadingCep"
                @blur="fetchAddressByCep"
              />
            </VCol>
            <VCol cols="12" md="7">
              <VTextField
                v-model="form.address.street"
                label="Logradouro"
                density="compact"
                bg-color="grey-lighten-5"
                color="primary"
                base-color="primary"
                :disabled="cepAutoFilled"
              />
            </VCol>
            <VCol cols="12" md="2">
              <VTextField
                v-model="form.address.number"
                label="Número"
                density="compact"
                bg-color="grey-lighten-5"
                color="primary"
                base-color="primary"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="form.address.neighborhood"
                label="Bairro"
                density="compact"
                bg-color="grey-lighten-5"
                color="primary"
                base-color="primary"
                :disabled="cepAutoFilled"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VSelect
                v-model="selectedState"
                :items="states"
                item-title="nome"
                item-value="sigla"
                label="Estado"
                density="compact"
                bg-color="grey-lighten-5"
                color="primary"
                base-color="primary"
                clearable
                :loading="loadingStates"
                :disabled="cepAutoFilled"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VSelect
                v-model="form.address.city"
                :items="cities"
                item-title="nome"
                item-value="nome"
                label="Cidade"
                density="compact"
                bg-color="grey-lighten-5"
                color="primary"
                base-color="primary"
                clearable
                :disabled="cepAutoFilled || !selectedState"
                :loading="loadingCities"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <div class="d-flex justify-end ga-3">
        <VBtn variant="outlined" :to="{ name: 'customers-list' }">Cancelar</VBtn>
        <VBtn type="submit" color="primary" :loading="saving">
          {{ isEdit ? 'Salvar alterações' : 'Cadastrar cliente' }}
        </VBtn>
      </div>
    </VForm>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { customersService } from '@/services/customers.service'
import { locationsService } from '@/services/locations.service'
import { useToastStore } from '@/stores/toast.store'
import { maskPhone, maskDocument, unmasked } from '@/utils/input-masks'
import { getApiError } from '@/utils/api-error'
import type { CustomerPayload } from '@/types/customer.types'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const cepAutoFilled = ref(false)
const loadingCep = ref(false)
const loadingStates = ref(false)
const loadingCities = ref(false)
const formRef = ref()

const states = ref<{ id: number; sigla: string; nome: string }[]>([])
const cities = ref<{ id: number; nome: string }[]>([])
const selectedState = ref<string | null>(null)
let keepCity = false

const form = ref<CustomerPayload>({
  name: '',
  email: '',
  phone: '',
  document: '',
  address: {
    zipCode: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
  },
})

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
}

async function fetchStates() {
  loadingStates.value = true
  try {
    const { data } = await locationsService.getStates()
    states.value = data
  } finally {
    loadingStates.value = false
  }
}

async function fetchCities(uf: string) {
  loadingCities.value = true
  try {
    const { data } = await locationsService.getCitiesByState(uf)
    cities.value = data
  } finally {
    loadingCities.value = false
  }
}

watch(
  () => form.value.address.zipCode,
  (val) => {
    if (!val) cepAutoFilled.value = false
  },
)

watch(selectedState, (newState) => {
  form.value.address.state = newState ?? ''
  if (keepCity) {
    keepCity = false
  } else {
    form.value.address.city = ''
  }
  cities.value = []
  if (newState) fetchCities(newState)
})

async function fetchAddressByCep() {
  const cep = form.value.address.zipCode.replace(/\D/g, '')
  if (cep.length !== 8) return

  loadingCep.value = true
  try {
    const { data } = await locationsService.getCep(cep)
    form.value.address.street = data.street
    form.value.address.neighborhood = data.neighborhood
    form.value.address.city = data.city
    keepCity = true
    selectedState.value = data.state
    cepAutoFilled.value = true
  } catch (error) {
    toast.triggerToast(getApiError(error, 'CEP não encontrado.'), 'error')
  } finally {
    loadingCep.value = false
  }
}

async function fetchCustomer(id: string) {
  try {
    const { data } = await customersService.getCustomerById(id)
    form.value = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      document: data.document,
      address: { ...data.address },
    }
    keepCity = true
    selectedState.value = data.address.state || null
    if (data.address.zipCode) cepAutoFilled.value = true
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao carregar cliente.'), 'error')
    router.push({ name: 'customers-list' })
  }
}

async function onSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (isEdit.value) {
      await customersService.updateCustomer(route.params.id as string, form.value)
      toast.triggerToast('Cliente atualizado com sucesso.', 'success')
    } else {
      await customersService.createCustomer(form.value)
      toast.triggerToast('Cliente cadastrado com sucesso.', 'success')
    }
    router.push({ name: 'customers-list' })
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao salvar cliente.'), 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchStates()
  if (isEdit.value) fetchCustomer(route.params.id as string)
})
</script>
