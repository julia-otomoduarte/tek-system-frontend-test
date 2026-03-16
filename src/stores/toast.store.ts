import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useToastStore = defineStore('toast', () => {
    const showToast = ref(false)
    const message = ref('')
    const color = ref<'success' | 'error' | 'info' | 'warning'>('success')

    function triggerToast(msg: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') {
        message.value = msg
        color.value = type
        showToast.value = true

        setTimeout(() => {
            showToast.value = false
        }, 3000)
    }

    return {
        showToast,
        message,
        color,
        triggerToast,
    }
})