import { ref } from 'vue'

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '')
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '')
}

export function maskDocument(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  if (digits.length <= 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').replace(/-$/, '')
  }
  return digits
    .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5')
    .replace(/-$/, '')
}

export function unmasked(value: string): string {
  return value.replace(/\D/g, '')
}

export function useMoneyMask(initialValue = 0) {
  const displayValue = ref(
    initialValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  )

  function onInput(e: Event, callback: (value: number) => void) {
    const input = e.target as HTMLInputElement

    const digits = input.value.replace(/\D/g, '')
    const numeric = parseInt(digits || '0') / 100

    displayValue.value = numeric.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    input.value = displayValue.value

    callback(numeric)
  }

  function setValue(value: number) {
    displayValue.value = value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return { displayValue, onInput, setValue }
}
