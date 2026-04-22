import { SnackbarType } from '@/app/(panel)/components/Snackbar'
import { create } from 'zustand'

interface SnackbarState {
    isOpen: boolean
    message: string
    type: SnackbarType
    show: (message: string, type?: 'success' | 'error' | 'info') => void
    hide: () => void
}

export const useSnackbar = create<SnackbarState>((set) => ({
    isOpen: false,
    message: '',
    type: 'success',
    show: (message, type = 'success') => set({ isOpen: true, message, type }),
    hide: () => set({ isOpen: false })
}))