import { NextResponse, type NextRequest } from 'next/server'
import { authRedirectValidator, providerPathValidator } from '../../auth'
import { WEBSITE_URL } from '../../authConstants'

// redirects to /account with the code, state, and provider
export async function GET(request: NextRequest, { params }: AuthOptions) {
  try {
    const { searchParams } = request.nextUrl
    const { code, state } = authRedirectValidator.parse({
      code: searchParams.get('code'),
      state: searchParams.get('state'),
    })

    const provider = providerPathValidator.parse(params.provider)

    const newSearchParams = new URLSearchParams({
      code,
      state,
      provider,
    })

    return NextResponse.redirect(
      `${WEBSITE_URL}/account?${newSearchParams.toString()}`,
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: '500 Server Error' }, { status: 500 })
  }
}
