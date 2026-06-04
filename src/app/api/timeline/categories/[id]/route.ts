// /api/timeline/categories/[id]
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/prisma'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import type { CategoryResponse, UpdateCategoryRequest } from '@/types/api'

// ===============================
// PUT
// ===============================
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const category = await prisma.activity.findFirst({
      where: {
        id: params.id,
        profile: { userId: user.id },
        deletedAt: null,
      },
    })
    if (!category) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const { name, colorToken } = (await request.json()) as UpdateCategoryRequest
    const updated = await prisma.activity.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(colorToken !== undefined && { colorToken }),
      },
    })

    const mapped = {
      id: updated.id,
      name: updated.name,
      colorToken: updated.colorToken,
    }

    return NextResponse.json<CategoryResponse>(
      { category: mapped },
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

// ===============================
// DELETE
// ===============================
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const category = await prisma.activity.findFirst({
      where: {
        id: params.id,
        profile: { userId: user.id },
        deletedAt: null,
      },
    })
    if (!category) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const deleted = await prisma.activity.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    })

    const mapped = {
      id: deleted.id,
      name: deleted.name,
      colorToken: deleted.colorToken,
    }

    return NextResponse.json<CategoryResponse>(
      { category: mapped },
      { status: 200 },
    )
  } catch (e) {
    console.error('DELETE /category/[id] error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
