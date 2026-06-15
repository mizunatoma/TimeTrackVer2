// /api/todo-lists
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { profileService } from '@/services/profile.service'
import { todoListService } from '@/services/todo.service'
import type {
  CreateTodoListRequest,
  CreateTodoListResponse,
  GetTodoListsResponse,
} from '@/types/api'
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
    console.error('GET /api/todo-lists:', e)
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
    const { name } = (await request.json()) as CreateTodoListRequest
    const todos = await todoListService.createTodoList(name, profile.id)

    return NextResponse.json<CreateTodoListResponse>(
      { todoList: todos },
      { status: 201 },
    )
  } catch (e) {
    console.error('POST /api/todo-list error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
