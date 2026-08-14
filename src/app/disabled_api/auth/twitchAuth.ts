import axios from 'axios'
import { Auth } from './auth'
import { StaticAuthProvider, getTokenInfo } from '@twurple/auth'
import { ApiClient } from '@twurple/api'

const forceVerify = true
const scopes = [
  'chat:read',
  'channel:read:redemptions',
  'moderator:read:followers',
]
const clientId = process.env.TWITCH_CLIENT_ID || ''
const clientSecret = process.env.TWITCH_CLIENT_SECRET || ''
const responseType = 'code'
const authorizationGrantType = 'authorization_code'
const refreshGrantType = 'refresh_token'

const authorizeUrl = 'https://id.twitch.tv/oauth2/authorize'
const tokenUrl = 'https://id.twitch.tv/oauth2/token'

type TwitchTokenResponse = {
  access_token: string
  refresh_token: string
  scope: string[]
  token_type: string
  expires_in?: number
}

export class TwitchAuth extends Auth {
  readonly provider: Provider = 'twitch'

  generateAuthUrl(state: string) {
    const searchParams = new URLSearchParams({
      client_id: clientId,
      force_verify: forceVerify.toString(),
      redirect_uri: this.redirectUrl,
      response_type: responseType,
      scope: scopes.join(' '),
      state,
    })

    return `${authorizeUrl}?${searchParams.toString()}`
  }

  async getTokens(code: string): Promise<AuthProviderToken> {
    const data = await axios
      .post<TwitchTokenResponse>(tokenUrl, {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: authorizationGrantType,
        redirect_uri: this.redirectUrl,
      })
      .then(response => response.data)

    const { access_token, refresh_token, scope } = data

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      scope: scope.join(' '),
    }
  }

  async refreshTokens(tokens: AuthProviderToken): Promise<AuthProviderToken> {
    const data = await axios
      .post<TwitchTokenResponse>(tokenUrl, {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: refreshGrantType,
        refresh_token: tokens.refreshToken,
      })
      .then(response => response.data)

    const { access_token, refresh_token, scope } = data

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      scope: scope.join(' '),
    }
  }

  async getUser(tokens: AuthProviderToken): Promise<AuthUser> {
    const { accessToken } = tokens
    const { userId } = await getTokenInfo(accessToken, clientId)
    if (!userId) throw Error('Twitch user not found')

    const authProvider = new StaticAuthProvider(clientId, accessToken)
    const apiClient = new ApiClient({ authProvider })
    const user = await apiClient.users.getUserById(userId)
    if (!user) throw Error('Twitch user not found')

    return {
      id: user.id,
      name: user.displayName,
      image: user.profilePictureUrl,
      url: `https://www.twitch.tv/${user.name}`,
    }
  }
}
