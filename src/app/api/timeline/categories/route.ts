// /api/timeline/categories
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { categorySchema } from '@/schemas/category'
import { categoryService } from '@/services/timeline.service'
import type { CategoriesResponse, CreateCategoryResponse } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const categories = await categoryService.findCategories(user.id)

    return NextResponse.json<CategoriesResponse>(
      { categories },
      { status: 200 },
    )
  } catch (e) {
    console.error('GET /activities error:', e)
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

    const body = await request.json()
    const result = categorySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }

    const data = await categoryService.createCategory(
      user.id,
      result.data.name,
      result.data.colorToken,
    )

    return NextResponse.json<CreateCategoryResponse>(
      { id: data.id },
      { status: 201 },
    )
  } catch (e) {
    console.error('POST /activities error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
