import { google } from 'googleapis'
import { type Credentials } from 'google-auth-library'
import { Auth } from './auth'

const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET
const scopes = ['https://www.googleapis.com/auth/youtube.readonly']
const accessType = 'offline'
const prompts = ['consent', 'select_account']

export class GoogleAuth extends Auth {
  readonly provider: Provider = 'google'

  private authClient = new google.auth.OAuth2(
    clientId,
    clientSecret,
    this.redirectUrl,
  )

  private apiClient = google.youtube({
    version: 'v3',
    auth: this.authClient,
  })

  private transformCredentials(credentials: Credentials): AuthProviderToken {
    const { access_token, refresh_token, scope } = credentials
    if (!access_token || !refresh_token || !scope) {
      throw Error('Unable to fetch Google tokens')
    }

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      scope: scope,
    }
  }

  private transformTokens(tokens: AuthProviderToken): Credentials {
    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      scope: tokens.scope,
    }
  }

  generateAuthUrl(state: string) {
    return this.authClient.generateAuthUrl({
      access_type: accessType,
      scope: scopes,
      state,
      prompt: prompts.join(' '),
    })
  }

  async getTokens(code: string): Promise<AuthProviderToken> {
    const { tokens } = await this.authClient.getToken(code)
    return this.transformCredentials(tokens)
  }

  async refreshTokens(tokens: AuthProviderToken): Promise<AuthProviderToken> {
    this.authClient.setCredentials(this.transformTokens(tokens))
    const { credentials } = await this.authClient.refreshAccessToken()

    return this.transformCredentials(credentials)
  }

  async getUser(tokens: AuthProviderToken): Promise<AuthUser> {
    this.authClient.setCredentials(this.transformTokens(tokens))
    const response = await this.apiClient.channels.list({
      mine: true,
      part: ['id', 'snippet'],
    })

    const { items } = response.data
    if (!items) throw Error('YouTube channel not found')

    const [channel] = items
    const { id, snippet } = channel
    if (!id || !snippet) throw Error('YouTube channel not found')

    const { title, thumbnails, customUrl } = snippet
    if (!title) throw Error('YouTube channel not found')

    return {
      id,
      name: title,
      image:
        thumbnails?.medium?.url ||
        thumbnails?.standard?.url ||
        thumbnails?.default?.url ||
        '',
      url: customUrl ? `https://www.youtube.com/${customUrl}` : '',
    }
  }
}
