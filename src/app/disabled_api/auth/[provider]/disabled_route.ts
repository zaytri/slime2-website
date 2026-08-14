import { NextResponse, type NextRequest } from 'next/server'
import {
  providerPathValidator,
  authValidator,
  getAuthenticatedUser,
} from '../auth'
import prisma from '@/helpers/database'
import { createAuth } from '../authProvider'

// redirects to the provider's authorization url
export async function GET(request: NextRequest, { params }: AuthOptions) {
  try {
    const provider = providerPathValidator.parse(params.provider)

    const { state } = authValidator.parse({
      state: request.nextUrl.searchParams.get('state'),
    })

    const url = createAuth(provider).generateAuthUrl(state)
    return NextResponse.redirect(url)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: '400 Bad Request' }, { status: 400 })
  }
}

// delete user
export async function DELETE(request: NextRequest, { params }: AuthOptions) {
  try {
    const provider = providerPathValidator.parse(params.provider)

    const { id } = await getAuthenticatedUser(request, provider)

    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ success: 'Account Deleted' }, { status: 200 })
  } catch (error) {
    console.error(error)
    // delete failed
    return NextResponse.json({ error: '400 Bad Request' }, { status: 400 })
  }
}
