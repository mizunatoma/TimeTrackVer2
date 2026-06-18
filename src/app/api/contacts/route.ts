// /api/contacts
import { contactSchema } from '@/schemas/contact'
import { contactsService } from '@/services/contacts.service'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()
    const result = contactSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }

    const contact = await contactsService.createContact(
      result.data.name,
      result.data.email,
      result.data.message,
    )

    return NextResponse.json({ contact }, { status: 200 })
  } catch (e) {
    console.error('POST /contact error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
