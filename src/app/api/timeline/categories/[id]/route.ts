// /api/timeline/categories/[id]
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { categoryService } from '@/services/timeline.service'
import type { CategoryResponse, UpdateCategoryRequest } from '@/types/api'
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

    const { name, colorToken } = (await request.json()) as UpdateCategoryRequest
    if (!name) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const updated = await categoryService.updateCategories(
      category.id,
      name,
      colorToken,
    )

    return NextResponse.json<CategoryResponse>(
      { category: updated },
      { status: 200 },
    )
  } catch (e) {
    console.error('PUT /category/[id] error:', e)
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
    console.error('DELETE /category/[id] error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
