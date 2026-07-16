import { prisma } from '@/app/_utils/prisma'

export const todoListRepository = {
  async findAll(userId: string) {
    const todosLists = await prisma.todoList.findMany({
      where: {
        profile: { userId },
        deletedAt: null,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    })
    return todosLists
  },

  async findOne(userId: string, listId: string) {
    const todosList = await prisma.todoList.findFirst({
      where: {
        id: listId,
        profile: { userId },
      },
    })
    return todosList
  },

  async create(name: string, profileId: string) {
    const todoList = await prisma.todoList.create({
      data: {
        name,
        profileId,
        sortOrder: 0,
      },
    })
    return todoList
  },

  async updateName(listId: string, name: string) {
    const todoList = await prisma.todoList.update({
      where: { id: listId },
      data: { name },
    })
    return todoList
  },

  async softDelete(listId: string) {
    await prisma.todoList.update({
      where: { id: listId },
      data: { deletedAt: new Date() },
    })
  },

  async reorder(userId: string, orderedListIds: string[]) {
    const updatedLists = await prisma.$transaction(
      orderedListIds.map((id, index) =>
        prisma.todoList.update({
          // ↑ transaction配列形式では tx ではなく prisma のまま
          // 配列形式にはコールバックがないのでtxも存在しない。
          where: {
            id,
            profile: { userId },
          },
          data: { sortOrder: index },
        }),
      ),
    )
    return updatedLists
  },
}

export const todoItemRepository = {
  async findAll(listId: string, userId: string) {
    const list = await prisma.todoList.findFirst({
      where: {
        id: listId,
        profile: { userId },
      },
      select: {
        todos: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
    return list
  },

  async findOne(todoId: string, userId: string) {
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        todoList: { profile: { userId } },
      },
    })
    return todo
  },

  async create(todoListId: string, title: string) {
    const todo = await prisma.todo.create({
      data: {
        todoListId,
        title,
      },
    })
    return todo
  },

  async update(todoId: string, title: string, isDone: boolean) {
    const todo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        title,
        isDone,
        doneAt: isDone === true ? new Date() : null,
      },
    })
    return todo
  },

  async delete(todoId: string) {
    await prisma.todo.update({
      where: { id: todoId },
      data: { deletedAt: new Date() },
    })
  },

  async findTodosCompletedTodayByUsers(userIds: string[]) {
    const date = new Date().toLocaleDateString('sv-SE', {
      timeZone: 'Asia/Tokyo',
    })
    const fromDay = new Date(`${date}T00:00:00.000+09:00`)
    const toDay = new Date(`${date}T23:59:59.999+09:00`)
    const todosCompletedToday = await prisma.todo.findMany({
      where: {
        todoList: { profile: { userId: { in: userIds } } },
        // IN句: 全ユーザー分を1クエリで取得（N+1回避）
        isDone: true,
        doneAt: { gte: fromDay, lte: toDay },
        deletedAt: null,
      },
      include: {
        todoList: { select: { profile: { select: { userId: true } } } },
        // 仕分け用に持ち主のuserIdだけ同乗させる（selectで転送量を最小化）
      },
    })
    return todosCompletedToday
  },
}
