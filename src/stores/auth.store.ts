import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import {login, register} from '@/services/auth.service'
import type { LoginPayload, RegisterPayload } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('accessToken'))
    const user = ref<{ id: number; name: string; email: string } | null>(null)

    const isAuthenticated = computed(() => !!token.value)

    const loginUser = async (payload: LoginPayload) => {
        try {
            const data = await login(payload)
            token.value = data.accessToken
            user.value = data.user
            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)

        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    }

    async function registerUser(payload: RegisterPayload) {
        try {
            const data = await register(payload)
            token.value = data.accessToken
            user.value = data.user
            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)

        } catch (error) {
            console.error('Registration failed:', error)
            throw error
        }
    }

    const logoutUser = () => {
        token.value = null
        user.value = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    }

    return {
        token,
        user,
        isAuthenticated,
        loginUser,
        registerUser,
        logoutUser,
    }
})