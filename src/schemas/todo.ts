import z from 'zod'

export const createTodoItemSchema = z.object({
  title: z.string(),
})

export const updateTodoItemSchema = z.object({
  title: z.string(),
  isDone: z.boolean(),
})
