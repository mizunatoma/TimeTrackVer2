// /api/todo-lists
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { createTodoListSchema } from '@/schemas/todo'
import { profileService } from '@/services/profile.service'
import { todoListService } from '@/services/todo.service'
import type { CreateTodoListResponse, GetTodoListsResponse } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const todoLists = await todoListService.getTodoLists(user.id)

    return NextResponse.json<GetTodoListsResponse>(
      { todoLists },
      { status: 200 },
    )
  } catch (e) {
    logger.error('GET /api/todo-lists', {
      error: e instanceof Error ? e.stack : String(e),
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const profile = await profileService.findOne(user.id)
    if (!profile) {
      return NextResponse.json(
        { error: 'Authorization failure' },
        { status: 403 },
      )
    }
    const body = await request.json()
    const result = createTodoListSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }

    const todos = await todoListService.createTodoList(
      result.data.name,
      profile.id,
    )

    return NextResponse.json<CreateTodoListResponse>(
      { todoList: todos },
      { status: 201 },
    )
  } catch (e) {
    logger.error('POST /api/todo-list error', {
      error: e instanceof Error ? e.stack : String(e),
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
