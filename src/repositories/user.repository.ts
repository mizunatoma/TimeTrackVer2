import { prisma } from "@/app/_utils/prisma";

export const userRepository = {

  async create(passwordHash:string, email:string) { 
    const newUser = await prisma.user.create({
        data: { passwordHash, email },
      })
  return newUser;
  },

  async findByEmail(email:string) { 
    const currentUser = await prisma.user.findUnique({
        where: { email },
    })
  return currentUser;
  },

  async guest() { 
    const guestUser = await prisma.user.findUnique({
      where: { email: process.env.GUEST_EMAIL! },
    })
  return guestUser;
  },
};