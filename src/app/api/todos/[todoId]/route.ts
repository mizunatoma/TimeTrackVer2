// /api/todos/[todoId]
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/prisma'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import type { UpdateTodoItemRequest, UpdateTodoItemResponse } from '@/types/api'

// ===============================
// PUT
// ===============================
export const PUT = async (
  request: NextRequest,
  { params }: { params: { todoId: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const todo = await prisma.todo.findFirst({
      where: {
        id: params.todoId,
        todoList: { profile: { userId: user.id } },
      },
    })
    if (!todo)
      return NextResponse.json({ error: 'No list found' }, { status: 403 })

    const { title, isDone } = (await request.json()) as UpdateTodoItemRequest
    const updated = await prisma.todo.update({
      where: { id: params.todoId },
      data: {
        title,
        isDone,
        doneAt: isDone === true ? new Date() : null,
      },
    })

    const mapped = {
      id: updated.id,
      todoListId: updated.todoListId,
      title: updated.title,
      isDone: updated.isDone,
      doneAt: updated.doneAt ? updated.doneAt.toISOString() : null,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    }

    return NextResponse.json<UpdateTodoItemResponse>(
      { todo: mapped },
      { status: 200 },
    )
  } catch (e) {
    console.error('PUT /api/todos/[todoId]:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

// ===============================
// DELETE
// ===============================
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { todoId: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const todo = await prisma.todo.findFirst({
      where: {
        id: params.todoId,
        todoList: { profile: { userId: user.id } },
      },
    })
    if (!todo)
      return NextResponse.json({ error: 'No list found' }, { status: 403 })

    await prisma.todo.update({
      where: { id: params.todoId },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json(null, { status: 200 })
  } catch (e) {
    console.error('DELETE /api/todos/[todoId]:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
