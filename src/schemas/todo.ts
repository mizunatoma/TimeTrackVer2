import z from 'zod'

export const createTodoItemSchema = z.object({
  title: z.string(),
})

export const updateTodoItemSchema = z.object({
  title: z.string(),
  isDone: z.boolean(),
})

export const createTodoListSchema = z.object({
  name: z.string(),
})

export const reorderTodoListsSchema = z.object({
  orderedListIds: z.array(z.string().min(1)).min(1),
})

export type CreateTodoListRequest = z.infer<typeof createTodoListSchema>
export type UpdateTodoListRequest = z.infer<typeof createTodoListSchema>
export type CreateTodoItemRequest = z.infer<typeof createTodoItemSchema>
export type UpdateTodoItemRequest = z.infer<typeof updateTodoItemSchema>
export type ReorderTodoListsRequest = z.infer<typeof reorderTodoListsSchema>
