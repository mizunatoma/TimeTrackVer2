// /api/todo-lists/[listId]/todos
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { createTodoItemSchema } from '@/schemas/todo'
import { todoItemService, todoListService } from '@/services/todo.service'
import type { CreateTodoItemResponse, GetTodoItemsResponse } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (
  _request: NextRequest,
  { params }: { params: { listId: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    // リストの存在確認と所有権チェック
    const todos = await todoItemService.getList(params.listId, user.id)
    if (!todos)
      return NextResponse.json({ error: 'No list found' }, { status: 404 })

    return NextResponse.json<GetTodoItemsResponse>({ todos })
  } catch (e) {
    logger.error('GET /api/todo-lists/[listId]/todos', {
      error: e instanceof Error ? e.stack : String(e),
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

export const POST = async (
  request: NextRequest,
  { params }: { params: { listId: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const list = await todoListService.getTodoList(user.id, params.listId)
    if (!list)
      return NextResponse.json({ error: 'No list found' }, { status: 404 })

    const body = await request.json()
    const result = createTodoItemSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }
    const newTodo = await todoItemService.createTodo(
      params.listId,
      result.data.title,
    )

    return NextResponse.json<CreateTodoItemResponse>(
      { todo: newTodo },
      { status: 201 },
    )
  } catch (e) {
    logger.error('POST /api/todo-lists/[listId]/todos', {
      error: e instanceof Error ? e.stack : String(e),
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
