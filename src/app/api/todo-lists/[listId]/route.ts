// /api/todo-lists/[listId]
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { createTodoListSchema } from '@/schemas/todo'
import { todoListService } from '@/services/todo.service'
import type { UpdateTodoListResponse } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export const PUT = async (
  request: NextRequest,
  { params }: { params: { listId: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const todoList = await todoListService.getTodoList(user.id, params.listId)
    if (!todoList)
      return NextResponse.json({ error: 'No list found' }, { status: 404 })

    const body = await request.json()
    const result = createTodoListSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }
    const updatedList = await todoListService.updateTodoListName(
      params.listId,
      result.data.name,
    )

    return NextResponse.json<UpdateTodoListResponse>(
      { todoList: updatedList },
      { status: 200 },
    )
  } catch (e) {
    logger.error('PUT /api/todo-lists/[listId]', {
      error: e instanceof Error ? e.stack : String(e),
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: { listId: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const todoList = await todoListService.getTodoList(user.id, params.listId)
    if (!todoList)
      return NextResponse.json({ error: 'No list found' }, { status: 404 })

    await todoListService.deleteTodoList(params.listId)

    return new NextResponse(null, { status: 204 }) // Responseのデータなし、リクエスト成功ステータスコード
  } catch (e) {
    logger.error('DELETE /api/todo-lists/[listId]', {
      error: e instanceof Error ? e.stack : String(e),
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
