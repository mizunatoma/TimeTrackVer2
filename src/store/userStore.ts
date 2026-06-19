import { ProfileDTO } from '@/types/api'
import { create } from 'zustand'

type UserStore = {
  user: ProfileDTO | null
  setUser: (user: ProfileDTO) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
