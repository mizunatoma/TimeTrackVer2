// /api/timeline/categories
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { categoryService } from '@/services/timeline.service'
import type {
  CategoriesResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
} from '@/types/api'
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

    const { name, colorToken } = (await request.json()) as CreateCategoryRequest
    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    const data = await categoryService.createCategory(user.id, name, colorToken)

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
