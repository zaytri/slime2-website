import * as jose from 'jose'

export const WEBSITE_URL = process.env.WEBSITE_URL || ''
export const AUTH_SIGN_SECRET = new TextEncoder().encode(
  process.env.AUTH_SIGN_SECRET!,
)
export const AUTH_ENCRYPT_SECRET = jose.base64url.decode(
  process.env.AUTH_ENCRYPT_SECRET!,
)
