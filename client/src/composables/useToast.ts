import { reactive } from 'vue'

export interface Toast {
    id: string
    title: string
    description?: string
    color?: 'green' | 'blue' | 'red' | 'yellow'
    duration?: number
}

interface ToastState {
    toasts: Toast[]
}

const state = reactive<ToastState>({
    toasts: []
})

let toastIdCounter = 0

export function useToast() {
    const add = (toast: Omit<Toast, 'id'>) => {
        const id = `toast-${++toastIdCounter}`
        const duration = toast.duration || 3000

        const newToast: Toast = {
            ...toast,
            id
        }

        state.toasts.push(newToast)

        // Auto remove after duration
        setTimeout(() => {
            remove(id)
        }, duration)

        return id
    }

    const remove = (id: string) => {
        const index = state.toasts.findIndex(t => t.id === id)
        if (index > -1) {
            state.toasts.splice(index, 1)
        }
    }

    const clear = () => {
        state.toasts = []
    }

    return {
        toasts: state.toasts,
        add,
        remove,
        clear
    }
}
