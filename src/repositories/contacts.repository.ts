import { prisma } from '@/app/_utils/prisma'

export const contactsRepository = {
  async create(name: string, email: string, message: string) {
    const contact = await prisma.contacts.create({
      data: { name, email, message },
    })
    return contact
  },
}
