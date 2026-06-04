// /api/timeline/categories
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/prisma'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import type {
  CategoriesResponse,
  CreateCategoryResponse,
  CreateCategoryRequest,
} from '@/types/api'

// ===============================
// GET
// ===============================
export const GET = async () => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const categories = await prisma.activity.findMany({
      where: {
        profile: { userId: user.id },
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        colorToken: true,
      },
    })

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

// ===============================
// POST
// ===============================
export const POST = async (request: NextRequest) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const { name, colorToken } = (await request.json()) as CreateCategoryRequest
    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    const data = await prisma.activity.create({
      data: {
        name,
        colorToken,
        profile: { connect: { userId: user.id } },
      },
    })

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
