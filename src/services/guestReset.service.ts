import { guestRepository } from '@/repositories/guest.repository'
import { authService } from './auth.service'

export const guestResetService = {
  async reset() {
    const guest = await authService.findGuestUser()
    if (!guest) return
    await guestRepository.resetGuestData(guest.id)
  },
}
