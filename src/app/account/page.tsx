'use client'

import axios from 'axios'
import Image from 'next/image'
import { nanoid } from 'nanoid'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Button, { ButtonText } from '@/components/button'
import Loading from '@/components/loading'
import User from './user'

const sessionStateKey = 'slime2-oauth-state'

const links: LoginLink[] = [
  { provider: 'twitch', text: 'Twitch', icon: 'assets/twitch-logo.svg' },
  // { provider: 'google', text: 'YouTube', icon: 'assets/youtube-logo.svg' },
]

type LoginLink = {
  provider: Provider
  text: string
  icon: string
}

export default function Account() {
  const [state, setState] = useState<string>()
  const [loginClicked, setLoginClicked] = useState(false)
  const [provider, setProvider] = useState<Provider>()
  const [code, setCode] = useState<string>()
  const [keyExpiration, setKeyExpiration] = useState<Date | null>(null)
  const [jwt, setJWT] = useState<string>()
  const [name, setName] = useState<string>()
  const [image, setImage] = useState<string>()
  const [url, setUrl] = useState<string>()
  const [info, setInfo] = useState('')
  const searchParams = useSearchParams()

  function logout(logoutInfo: string = '') {
    // clean URL
    window.history.replaceState(null, '', window.location.pathname)

    setLoginClicked(false)
    setProvider(undefined)
    setCode(undefined)
    setKeyExpiration(null)
    setJWT(undefined)
    setName(undefined)
    setImage(undefined)
    setUrl(undefined)
    setInfo(logoutInfo)
  }

  useEffect(() => {
    const sessionState = getSessionState()
    setState(sessionState)

    const codeParam = searchParams.get('code')
    const stateParam = searchParams.get('state')
    const providerParam = searchParams.get('provider')

    // clean URL
    window.history.replaceState(null, '', window.location.pathname)

    // set code and provider if they exist and the state matches
    if (codeParam && providerParam && stateParam === sessionState) {
      setCode(codeParam)
      setProvider(providerParam as Provider)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await axios
          .post<AuthLoginResponse>(`/api/auth/${provider}/login`, { code })
          .then(response => response.data)
        if (user.keyExpiration) {
          setKeyExpiration(new Date(user.keyExpiration))
        }
        setImage(user.image)
        setName(user.name)
        setJWT(user.jwt)
        setUrl(user.url)
      } catch {
        // unable to fetch user
        logout('Something went wrong, please login again.')
      }
    }

    if (code && provider && !jwt) {
      fetchUser()
    }
  }, [code, provider, jwt])

  if (!state) return null

  if (jwt && !info) {
    return (
      <>
        <User
          jwt={jwt}
          image={image!}
          provider={provider!}
          name={name!}
          keyExpiration={keyExpiration}
          logout={logout}
          setKeyExpiration={setKeyExpiration}
          url={url!}
        />
      </>
    )
  }

  if (code && provider && !info) {
    // authorization code successfully obtained
    return <Loading message='Verifying Authorization...' />
  }

  const loginSearchParams = new URLSearchParams({ state })
  function loginLink(provider: Provider) {
    return `/api/auth/${provider}?${loginSearchParams.toString()}`
  }

  function onLoginClick(provider: Provider) {
    setLoginClicked(true)
  }

  if (loginClicked && !info) {
    return <Loading message='Redirecting to Authorization...' />
  }

  return (
    <div className='max-w-lg space-y-5'>
      <h1 className='text-center font-round text-3xl font-medium'>
        Account Login
      </h1>

      <p className='mt-5 rounded-lg border-2 border-amber-800 bg-amber-100 px-5 py-3 text-black [text-shadow:none]'>
        <strong className='text-lg font-medium'>
          ⚠️ Notice: Account login will be removed in the future.
        </strong>
        <br />
        <br />
        <div className='!text-left font-nunito'>
          The Slime2 desktop app is replacing Slime2 legacy, and handles all
          authentication locally. For those still using Slime2 legacy widgets,
          account login will continue to be here until all of the legacy widgets
          have been ported to Slime2 desktop widgets.
        </div>
      </p>
      {/* <p className='!mt-2 text-center'>
        By logging in, you agree to the{' '}
        <a className=' text-green-300 underline' href='/privacy'>
          Privacy Policy
        </a>{' '}
        and{' '}
        <a className='text-green-300 underline' href='/tos'>
          Terms of Service
        </a>
        .
      </p> */}
      {info && (
        <p className='rounded-lg border-2 border-rose-800 bg-rose-100 px-5 py-3 text-center text-lg text-black [text-shadow:none]'>
          {info}
        </p>
      )}
      {links.map(({ provider, text, icon }) => {
        return (
          <div key={provider} className='flex gap-5'>
            <Image
              src={icon}
              alt=''
              className='-mt-1 object-contain text-white'
              width={48}
              height={48}
            />
            <Button
              className='flex-1 px-5 pb-3 pt-5 text-3xl'
              href={loginLink(provider)}
              onClick={() => {
                onLoginClick(provider)
              }}
              internalLink
            >
              <ButtonText>{text} Account</ButtonText>
            </Button>
          </div>
        )
      })}
    </div>
  )
}

// get the oauth state from session storage
function getSessionState(): string {
  let sessionState = sessionStorage.getItem(sessionStateKey)

  // generate new state if it doesn't exist
  if (!sessionState) {
    sessionState = nanoid()
    sessionStorage.setItem(sessionStateKey, sessionState)
  }

  return sessionState
}
