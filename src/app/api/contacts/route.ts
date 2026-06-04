// /api/contacts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/prisma'
import type { ContactBody } from '@/types/api'

// ===============================
// POST
// ===============================
export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as ContactBody
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 },
      )
    }

    const contact = await prisma.contacts.create({
      data: { name, email, message },
    })

    return NextResponse.json({ contact }, { status: 200 })
  } catch (e) {
    console.error('POST /contact error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
