import { contactsRepository } from '@/repositories/contacts.repository'

export const contactsService = {
  async createContact(name: string, email: string, message: string) {
    return await contactsRepository.create(name, email, message)
  },
}
