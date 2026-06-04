// /api/todo-lists
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { prisma } from '@/app/_utils/prisma'
import type {
  CreateTodoListRequest,
  CreateTodoListResponse,
  GetTodoListsResponse,
} from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

// ===============================
// GET
// ===============================
export const GET = async () => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const todosLists = await prisma.todoList.findMany({
      where: {
        profile: { userId: user.id },
        deletedAt: null,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    })

    const todoLists = todosLists.map((todoList) => ({
      id: todoList.id,
      profileId: todoList.profileId,
      name: todoList.name,
      sortOrder: todoList.sortOrder,
      createdAt: todoList.createdAt.toISOString(),
      updatedAt: todoList.updatedAt.toISOString(),
    }))

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

// ===============================
// POST
// ===============================
export const POST = async (request: NextRequest) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const profile = await prisma.profile.findFirst({
      where: {
        userId: user.id,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Authorization failure' },
        { status: 403 },
      )
    }
    const { name } = (await request.json()) as CreateTodoListRequest

    const todoList = await prisma.todoList.create({
      data: {
        name,
        profileId: profile.id,
        sortOrder: 0,
      },
    })

    const mapped = {
      id: todoList.id,
      profileId: todoList.profileId,
      name: todoList.name,
      sortOrder: todoList.sortOrder,
      createdAt: todoList.createdAt.toISOString(),
      updatedAt: todoList.updatedAt.toISOString(),
    }

    return NextResponse.json<CreateTodoListResponse>(
      { todoList: mapped },
      { status: 201 },
    ) // 201=成功(新規作成)
  } catch (e) {
    console.error('POST /api/todo-list error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
