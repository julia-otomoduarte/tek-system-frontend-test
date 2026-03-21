<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-h5 font-bold">
          {{ isEdit ? 'Editar Produto' : 'Novo Produto' }}
        </h1>
        <div class="text-body-2 text-medium-emphasis mt-1">
          <RouterLink :to="{ name: 'products-list' }" class="text-decoration-none">
            Produtos
          </RouterLink>
          &rsaquo; {{ isEdit ? 'Editar' : 'Novo' }}
        </div>
      </div>
    </div>

    <VForm ref="formRef" @submit.prevent="onSubmit">
      <VCard rounded="lg" elevation="0" border class="mb-6">
        <VCardTitle class="pa-4 pb-0 mb-6">Dados do Produto</VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" md="4">
              <VTextField
                v-model="form.sku"
                label="SKU"
                :rules="[rules.required]"
                density="compact"
                hint="Código único do produto"
              />
            </VCol>
            <VCol cols="12" md="8">
              <VTextField
                v-model="form.name"
                label="Nome do produto"
                :rules="[rules.required]"
                density="compact"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="form.description"
                label="Descrição (opcional)"
                density="compact"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                :model-value="displayPrice"
                label="Preço"
                prefix="R$"
                density="compact"
                :rules="[rules.required, rules.positiveNumber]"
                @input="handlePriceInput"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model.number="form.stock"
                label="Estoque"
                type="number"
                :rules="[rules.required, rules.nonNegative]"
                density="compact"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <div class="flex justify-end gap-3">
        <VBtn variant="outlined" :to="{ name: 'products-list' }">Cancelar</VBtn>
        <VBtn type="submit" color="primary" :loading="saving">
          {{ isEdit ? 'Salvar alterações' : 'Cadastrar produto' }}
        </VBtn>
      </div>
    </VForm>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productsService } from '@/services/products.service'
import { useToastStore } from '@/stores/toast.store'
import { getApiError } from '@/utils/api-error'
import type { ProductPayload } from '@/types/product.types'
import { useMoneyMask } from '@/utils/input-masks'

const {
  displayValue: displayPrice,
  onInput: onPriceInput,
  setValue: setPriceValue,
} = useMoneyMask()

function handlePriceInput(e: Event) {
  onPriceInput(e, (v) => (form.value.price = v))
}

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const formRef = ref()

const form = ref<ProductPayload>({
  sku: '',
  name: '',
  description: '',
  price: 0,
  stock: 0,
})

const rules = {
  required: (v: string | number) =>
    (v !== '' && v !== null && v !== undefined) || 'Campo obrigatório',
  positiveNumber: () => form.value.price > 0 || 'O preço do produto deve ser maior que zero',
  nonNegative: (v: number) => v >= 0 || 'Deve ser zero ou maior',
}

async function fetchProduct(id: string) {
  try {
    const { data } = await productsService.getProductById(id)
    setPriceValue(data.price)
    form.value = {
      sku: data.sku,
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
    }
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao carregar produto.'), 'error')
    router.push({ name: 'products-list' })
  }
}

async function onSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (isEdit.value) {
      await productsService.updateProduct(route.params.id as string, form.value)
      toast.triggerToast('Produto atualizado com sucesso.', 'success')
    } else {
      await productsService.createProduct(form.value)
      toast.triggerToast('Produto cadastrado com sucesso.', 'success')
    }
    router.push({ name: 'products-list' })
  } catch (error) {
    toast.triggerToast(getApiError(error, 'Erro ao salvar produto.'), 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (isEdit.value) fetchProduct(route.params.id as string)
})
</script>
