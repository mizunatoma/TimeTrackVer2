import {
  todoItemRepository,
  todoListRepository,
} from '@/repositories/todo.repository'
import type { TodoItemDTO, TodoListDTO } from '@/types/api'
import type { Todo, TodoList } from '@prisma/client'

export class ReorderIdsMismatchError extends Error {}

const toTodoListDTO = (todoList: TodoList): TodoListDTO => ({
  id: todoList.id,
  profileId: todoList.profileId,
  name: todoList.name,
  sortOrder: todoList.sortOrder,
  createdAt: todoList.createdAt.toISOString(),
  updatedAt: todoList.updatedAt.toISOString(),
})

const toTodoItemDTO = (todo: Todo): TodoItemDTO => ({
  id: todo.id,
  todoListId: todo.todoListId,
  title: todo.title,
  isDone: todo.isDone,
  doneAt: todo.doneAt ? todo.doneAt.toISOString() : null,
  createdAt: todo.createdAt.toISOString(),
  updatedAt: todo.updatedAt.toISOString(),
})

export const todoListService = {
  async getTodoLists(userId: string) {
    const lists = await todoListRepository.findAll(userId)
    return lists.map(toTodoListDTO)
  },
  async getTodoList(userId: string, listId: string) {
    const list = await todoListRepository.findOne(userId, listId)
    if (!list) return null
    return toTodoListDTO(list)
  },
  async createTodoList(name: string, profileId: string) {
    const list = await todoListRepository.create(name, profileId)
    return toTodoListDTO(list)
  },
  async updateTodoListName(listId: string, name: string) {
    const list = await todoListRepository.updateName(listId, name)
    return toTodoListDTO(list)
  },
  async deleteTodoList(listId: string) {
    await todoListRepository.softDelete(listId)
  },

  async reorderTodoList(userId: string, orderedListIds: string[]) {
    const ownAllLists = await todoListRepository.findAll(userId)
    const ownIdSet = new Set(ownAllLists.map((l) => l.id))

    const noDuplicates = new Set(orderedListIds).size === orderedListIds.length
    const sameCount = orderedListIds.length === ownAllLists.length
    const allOwned = orderedListIds.every((id) => ownIdSet.has(id))
    if (!noDuplicates || !sameCount || !allOwned) {
      throw new ReorderIdsMismatchError()
    }

    const reorderedLists = await todoListRepository.reorder(
      userId,
      orderedListIds,
    )
    return reorderedLists.map(toTodoListDTO)
  },
}

export const todoItemService = {
  async getList(listId: string, userId: string) {
    const list = await todoItemRepository.findAll(listId, userId)
    if (!list) return null
    return list.todos.map(toTodoItemDTO)
  },
  async getTodo(todoId: string, userId: string) {
    const todo = await todoItemRepository.findOne(todoId, userId)
    if (!todo) return null
    return toTodoItemDTO(todo)
  },
  async createTodo(todoListId: string, title: string) {
    const todo = await todoItemRepository.create(todoListId, title)
    return toTodoItemDTO(todo)
  },
  async updateTodo(todoId: string, title: string, isDone: boolean) {
    const todo = await todoItemRepository.update(todoId, title, isDone)
    return toTodoItemDTO(todo)
  },
  async deleteTodo(todoId: string) {
    await todoItemRepository.delete(todoId)
  },
}
