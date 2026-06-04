// /api/todo-lists/[listId]
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/prisma'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import type { UpdateTodoListResponse, UpdateTodoListRequest } from '@/types/api'

// ===============================
// PUT
// ===============================
export const PUT = async (
  request: NextRequest,
  { params }: { params: { listId: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const todoList = await prisma.todoList.findFirst({
      where: {
        id: params.listId,
        profile: { userId: user.id },
      },
    })
    if (!todoList)
      return NextResponse.json({ error: 'No list found' }, { status: 403 })

    const { name } = (await request.json()) as UpdateTodoListRequest
    const updated = await prisma.todoList.update({
      where: { id: params.listId },
      data: { name },
    })

    const mapped = {
      id: updated.id,
      profileId: updated.profileId,
      name: updated.name,
      sortOrder: updated.sortOrder,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    }

    return NextResponse.json<UpdateTodoListResponse>(
      { todoList: mapped },
      { status: 200 },
    )
  } catch (e) {
    console.error('PUT /api/todo-list/[listId]:', e)
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
  { params }: { params: { listId: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const todoList = await prisma.todoList.findFirst({
      where: {
        id: params.listId,
        profile: { userId: user.id },
      },
    })
    if (!todoList)
      return NextResponse.json({ error: 'No list found' }, { status: 403 })

    await prisma.todoList.update({
      where: { id: params.listId },
      data: { deletedAt: new Date() },
    })

    return new NextResponse(null, { status: 204 }) // Responseのデータなし、リクエスト成功ステータスコード
  } catch (e) {
    console.error('DELETE /api/todo-lists/[listId]:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
