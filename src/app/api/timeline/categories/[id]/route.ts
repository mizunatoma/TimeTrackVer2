// /api/timeline/categories/[id]
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { updateCategorySchema } from '@/schemas/category'
import { categoryService } from '@/services/timeline.service'
import type { CategoryResponse } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const category = await categoryService.findCategory(params.id, user.id)
    if (!category) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = await request.json()
    const result = updateCategorySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }

    const updated = await categoryService.updateCategories(
      category.id,
      result.data.name,
      result.data.colorToken,
    )

    return NextResponse.json<CategoryResponse>(
      { category: updated },
      { status: 200 },
    )
  } catch (e) {
    logger.error('PUT /category/[id] error', {
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
  { params }: { params: { id: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const category = await categoryService.findCategory(params.id, user.id)
    if (!category) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await categoryService.deleteCategories(params.id)

    return new NextResponse<CategoryResponse>(null, { status: 200 })
  } catch (e) {
    logger.error('DELETE /category/[id] error', {
      error: e instanceof Error ? e.stack : String(e),
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
