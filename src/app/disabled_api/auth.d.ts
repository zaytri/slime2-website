type Provider = 'twitch' | 'google'

type AuthOptions = {
  params: {
    provider: Provider
  }
}

type AuthProviderToken = {
  accessToken: string
  refreshToken: string
  scope: string
}

type AuthWebsiteToken = {
  websiteToken: string
  websiteTokenExpires: Date
}

type AuthClientToken = {
  clientToken: string
  clientTokenExpires: Date
}

type AuthUser = {
  id: string
  name: string
  image: string
  url: string
}

type AuthLoginResponse = {
  keyExpiration: string | null
  jwt: string
  name: string
  image: string
  url: string
}

type AuthKeyResponse = {
  keyExpiration: string | null
  key: string
}
