import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { reorderTodoListsSchema } from '@/schemas/todo'
import {
  ReorderIdsMismatchError,
  todoListService,
} from '@/services/todo.service'
import { NextResponse } from 'next/server'

export const PATCH = async (req: Request) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const body = await req.json()
    const result = reorderTodoListsSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }

    const todoLists = await todoListService.reorderTodoList(
      user.id,
      result.data.orderedListIds,
    )

    return NextResponse.json({ todoLists }, { status: 200 })
  } catch (e) {
    if (e instanceof ReorderIdsMismatchError) {
      return NextResponse.json(
        { error: 'ReorderIds Mismatch Error' },
        { status: 400 },
      )
    } else {
      logger.error('PATCH /todo-lists/reorder error', {
        error: e instanceof Error ? e.stack : String(e),
      })
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      )
    }
  }
}
