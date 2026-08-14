import { z } from 'zod'
import { nanoid } from 'nanoid'
import * as jose from 'jose'
import { type NextRequest } from 'next/server'
import prisma from '@/helpers/database'
import {
  AUTH_ENCRYPT_SECRET,
  AUTH_SIGN_SECRET,
  WEBSITE_URL,
} from './authConstants'

export abstract class Auth {
  abstract readonly provider: Provider
  get redirectUrl() {
    return `${WEBSITE_URL}/api/auth/${this.provider}/redirect`
  }
  abstract generateAuthUrl(state: string): string
  abstract getTokens(code: string): Promise<AuthProviderToken>
  abstract refreshTokens(tokens: AuthProviderToken): Promise<AuthProviderToken>
  abstract getUser(tokens: AuthProviderToken): Promise<AuthUser>
}

export const authValidator = z.object({
  state: z.string(),
})

export const authRedirectValidator = z.object({
  code: z.string(),
  state: z.string(),
})

export const authTokenValidator = z.object({
  code: z.string(),
})

export const providerPathValidator = z.union([
  z.literal('twitch'),
  z.literal('google'),
])

export function generateWebsiteToken(
  provider: string,
  providerAccountId: string,
): AuthWebsiteToken {
  // 1 hour in the future
  const expirationDate = new Date()
  expirationDate.setHours(expirationDate.getHours() + 1)

  return {
    websiteToken: generateToken(provider, providerAccountId),
    websiteTokenExpires: expirationDate,
  }
}

export function generateClientToken(
  provider: string,
  providerAccountId: string,
): AuthClientToken {
  // 1 month in the future
  const expirationDate = new Date()
  expirationDate.setMonth(expirationDate.getMonth() + 1)

  return {
    clientToken: generateToken(provider, providerAccountId),
    clientTokenExpires: expirationDate,
  }
}

function generateToken(provider: string, providerAccountId: string): string {
  return `${provider}_${nanoid()}${providerAccountId}`
}

export async function generateJWT(
  websiteToken: string,
  providerAccountId: string,
) {
  const signedJwt = await new jose.SignJWT({ websiteToken, providerAccountId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(AUTH_SIGN_SECRET)

  const encryptedJwt = await new jose.EncryptJWT({ jwt: signedJwt })
    .setProtectedHeader({ alg: 'dir', enc: 'A192GCM' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .encrypt(AUTH_ENCRYPT_SECRET)

  return encryptedJwt
}

export async function readJWT(authorization: string | null) {
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw Error('Invalid Authorization')
  }

  const jwt = authorization.split(' ')[1] // remove 'Bearer '

  const { payload: encryptedPayload } = await jose.jwtDecrypt(
    jwt,
    AUTH_ENCRYPT_SECRET,
  )
  const signedJwt = encryptedPayload.jwt

  if (!signedJwt) {
    throw Error('Signed JWT not found')
  }

  const { payload } = await jose.jwtVerify(
    signedJwt as string,
    AUTH_SIGN_SECRET,
  )
  const { websiteToken, providerAccountId } = payload

  if (!websiteToken || !providerAccountId) {
    throw Error('Invalid JWT')
  }

  return {
    websiteToken: websiteToken as string,
    providerAccountId: providerAccountId as string,
  }
}

export async function getAuthenticatedUser(
  request: NextRequest,
  provider: string,
) {
  const { websiteToken, providerAccountId } = await readJWT(
    request.headers.get('Authorization'),
  )

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      provider_providerAccountId: { provider, providerAccountId },
      websiteToken,
      websiteTokenExpires: {
        gt: new Date(),
      },
    },
  })

  return user
}
