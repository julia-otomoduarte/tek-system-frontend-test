import { ref } from 'vue'

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
