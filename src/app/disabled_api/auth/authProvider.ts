import { Auth } from './auth'
import { GoogleAuth } from './googleAuth'
import { TwitchAuth } from './twitchAuth'

export function createAuth(provider: Provider): Auth {
  switch (provider) {
    case 'twitch':
      return new TwitchAuth()
    case 'google':
      return new GoogleAuth()
    default:
      throw Error('Unhandled authentication provider')
  }
}
