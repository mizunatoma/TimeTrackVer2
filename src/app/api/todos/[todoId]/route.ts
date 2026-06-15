// /api/todos/[todoId]
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { todoItemService } from '@/services/todo.service'
import type { UpdateTodoItemRequest, UpdateTodoItemResponse } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export const PUT = async (
  request: NextRequest,
  { params }: { params: { todoId: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const todo = await todoItemService.getTodo(params.todoId, user.id)
    if (!todo)
      return NextResponse.json({ error: 'No todo found' }, { status: 404 })

    const { title, isDone } = (await request.json()) as UpdateTodoItemRequest
    const updatedTodo = await todoItemService.updateTodo(
      params.todoId,
      title,
      isDone,
    )

    return NextResponse.json<UpdateTodoItemResponse>({ todo: updatedTodo })
  } catch (e) {
    console.error('PUT /api/todos/[todoId]:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: { todoId: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const todo = await todoItemService.getTodo(params.todoId, user.id)
    if (!todo)
      return NextResponse.json({ error: 'No todo found' }, { status: 404 })

    await todoItemService.deleteTodo(todo.id)

    return new NextResponse(null, { status: 204 })
  } catch (e) {
    console.error('DELETE /api/todos/[todoId]:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
