import prisma from '@/helpers/database'
import { NextRequest, NextResponse } from 'next/server'
import { generateClientToken, providerPathValidator } from '../../auth'
import { createAuth } from '../../authProvider'

const corsHeaders = new Headers()
corsHeaders.set('Access-Control-Allow-Origin', '*')
corsHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
corsHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

// needed for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// use clientToken (key) to get accessToken
export async function GET(request: NextRequest, { params }: AuthOptions) {
  try {
    const authorization = request.headers.get('Authorization')
    const provider = providerPathValidator.parse(params.provider)

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw Error('Invalid Authorization')
    }

    const key = authorization.split(' ')[1] // remove 'Bearer '

    const { id, providerAccountId, refreshToken, accessToken, scope } =
      await prisma.user.findUniqueOrThrow({
        where: { clientToken: key, clientTokenExpires: { gt: new Date() } },
        select: {
          id: true,
          providerAccountId: true,
          refreshToken: true,
          accessToken: true,
          scope: true,
        },
      })

    const newTokens = await createAuth(provider).refreshTokens({
      refreshToken,
      accessToken,
      scope,
    })

    const keyData = generateClientToken(provider, providerAccountId)

    const { accessToken: newAccessToken } = await prisma.user.update({
      where: { id },
      data: {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
        scope: newTokens.scope,
        // refresh expiration date
        clientTokenExpires: keyData.clientTokenExpires,
      },
      select: { accessToken: true },
    })

    return NextResponse.json(
      { token: newAccessToken },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: '400 Bad Request' }, { status: 400 })
  }
}
