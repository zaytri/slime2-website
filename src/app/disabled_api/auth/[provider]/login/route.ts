import { NextResponse, type NextRequest } from 'next/server'
import {
  authTokenValidator,
  generateWebsiteToken,
  providerPathValidator,
  generateJWT,
} from '../../auth'
import prisma from '@/helpers/database'
import { createAuth } from '../../authProvider'

// post to save token using authorization code and login
export async function POST(request: NextRequest, { params }: AuthOptions) {
  try {
    const { code } = authTokenValidator.parse(await request.json())
    const provider = providerPathValidator.parse(params.provider)

    const auth = createAuth(provider)

    const tokens = await auth.getTokens(code)
    const { accessToken, refreshToken, scope } = tokens
    const {
      id: providerAccountId,
      name,
      image,
      url,
    } = await auth.getUser(tokens)

    // create / update user
    const { websiteToken, clientTokenExpires } = await prisma.user.upsert({
      where: { provider_providerAccountId: { provider, providerAccountId } },
      create: {
        provider,
        providerAccountId,
        accessToken,
        refreshToken,
        scope,
        ...generateWebsiteToken(provider, providerAccountId),
      },
      update: {
        accessToken,
        refreshToken,
        scope,
        ...generateWebsiteToken(provider, providerAccountId),
      },
      select: { websiteToken: true, clientTokenExpires: true },
    })

    const jwt = await generateJWT(websiteToken, providerAccountId)

    return NextResponse.json<AuthLoginResponse>({
      keyExpiration: clientTokenExpires ? clientTokenExpires.toString() : null,
      jwt,
      name,
      image,
      url,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: '400 Bad Request' }, { status: 400 })
  }
}
