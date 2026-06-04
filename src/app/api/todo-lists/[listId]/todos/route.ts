// /api/todo-lists/[listId]/todos
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/prisma'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import type {
  GetTodoItemsResponse,
  CreateTodoItemRequest,
  CreateTodoItemResponse,
} from '@/types/api'

// ===============================
// GET
// ===============================
export const GET = async (
  request: NextRequest,
  { params }: { params: { listId: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    // リストの存在確認と所有権チェック
    const todoList = await prisma.todoList.findFirst({
      where: {
        id: params.listId,
        profile: { userId: user.id },
      },
      select: {
        todos: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!todoList)
      return NextResponse.json({ error: 'No list found' }, { status: 403 })

    const mapped = todoList.todos.map((todo) => ({
      id: todo.id,
      todoListId: todo.todoListId,
      title: todo.title,
      isDone: todo.isDone,
      doneAt: todo.doneAt ? todo.doneAt.toISOString() : null,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    }))

    return NextResponse.json<GetTodoItemsResponse>(
      { todos: mapped },
      { status: 200 },
    )
  } catch (e) {
    console.error('GET /api/todo-lists/[listId]/todos:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

// ===============================
// POST
// ===============================
export const POST = async (
  request: NextRequest,
  { params }: { params: { listId: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const { listId } = params

    const todoList = await prisma.todoList.findFirst({
      where: {
        id: params.listId,
        profile: { userId: user.id },
      },
    })
    if (!todoList)
      return NextResponse.json({ error: 'No list found' }, { status: 403 })

    const { title } = (await request.json()) as CreateTodoItemRequest

    const todo = await prisma.todo.create({
      data: {
        todoListId: listId,
        title,
      },
    })

    const mapped = {
      id: todo.id,
      todoListId: todo.todoListId,
      title: todo.title,
      isDone: todo.isDone,
      doneAt: todo.doneAt ? todo.doneAt.toISOString() : null,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    }

    return NextResponse.json<CreateTodoItemResponse>(
      { todo: mapped },
      { status: 201 },
    )
  } catch (e) {
    console.error('POST /api/todo-lists/[listId]/todos:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
