import Button, { ButtonIcon, ButtonText } from '@/components/button'
import Loading from '@/components/loading'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import * as Icon from 'react-feather'

type UserProps = {
  jwt: string
  provider: Provider
  image: string
  name: string
  url: string
  keyExpiration: Date | null
  logout: (info?: string) => void
  setKeyExpiration: (date: Date) => void
}

const avatarSize = 60
const providerLogoSize = 20

export default function User({
  jwt,
  provider,
  image,
  name,
  keyExpiration,
  logout,
  setKeyExpiration,
  url,
}: UserProps) {
  const [downloading, setDownloading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const currentDate = new Date()
  const activeKey = keyExpiration && keyExpiration > currentDate
  const expiredKey = keyExpiration && keyExpiration < currentDate

  useEffect(() => {
    // clean URL
    window.history.replaceState(null, '', window.location.pathname)
  }, [])

  async function download(refresh = false) {
    setDownloading(true)

    const keyData = await axios
      .post<AuthKeyResponse>(
        `/api/auth/${provider}/key`,
        { refresh },
        { headers: { Authorization: `Bearer ${jwt}` } },
      )
      .then(response => response.data)
      .catch(error => console.error(error))

    if (keyData && keyData.key) {
      if (keyData.keyExpiration) {
        setKeyExpiration(new Date(keyData.keyExpiration))
      }

      // https://stackoverflow.com/a/33542499
      const scriptText = `slime2.setKey('${provider}', '${keyData.key}')`
      const blob = new Blob([scriptText], {
        type: 'text/javascript',
      })
      const downloadElement = document.createElement('a')
      downloadElement.href = URL.createObjectURL(blob)
      downloadElement.download = `SLIME2_${provider.toUpperCase()}_KEY.js`
      downloadElement.style.display = 'none'
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement)
    } else {
      // error fetching key
      logout('Something went wrong, please login again.')
    }

    setDownloading(false)
  }

  async function deleteAccount() {
    setDeleting(true)

    try {
      await axios.delete(`/api/auth/${provider}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
    } catch {
      setDeleting(false)
      logout('Something went wrong, please login again.')
    }

    setDeleting(false)
  }

  let loading: ReactNode = null
  if (downloading) {
    loading = <Loading message='Preparing Key for Download...' />
  } else if (deleting) {
    loading = <Loading message='Deleting Account...' />
  }

  return (
    <div className='flex max-w-lg flex-col space-y-5'>
      <h1 className='text-center font-round text-4xl font-medium'>
        Welcome
        <Link href={url} target='_blank'>
          <div className='relative mx-3 inline-block'>
            <Image
              unoptimized
              src={image!}
              alt=''
              width={avatarSize}
              height={avatarSize}
              className='inline rounded-full'
            />

            <Image
              src={`/assets/${
                provider === 'google' ? 'youtube' : provider
              }-logo.svg`}
              height={providerLogoSize}
              width={providerLogoSize}
              alt=''
              className='absolute -bottom-px -right-1'
            />
          </div>
        </Link>
        {name}!
      </h1>

      {loading || (
        <>
          {provider === 'google' && (
            <p className='mt-5 rounded-lg border-2 border-amber-800 bg-amber-100 px-5 py-3'>
              <strong className='font-semibold'>
                ⚠️ YouTube support is still in development!
              </strong>
              <br />
              <br />
              You can download a YouTube key but it won&apos;t do anything.
            </p>
          )}
          <Button
            className='px-5 pb-3 pt-5 text-3xl'
            href='https://forums.slime2.stream/resources/setting-up-slime2-widgets.3/'
          >
            <ButtonIcon>
              <Icon.HelpCircle width='1em' height='1em' strokeWidth={3} />
            </ButtonIcon>
            <ButtonText>How to Use Key</ButtonText>
          </Button>
          {activeKey && (
            <Button
              className='px-5 pb-3 pt-5 text-3xl'
              onClick={() => download(true)}
            >
              <ButtonIcon>
                <Icon.Download width='1em' height='1em' strokeWidth={3} />
              </ButtonIcon>
              <ButtonText>Download Existing Key</ButtonText>
            </Button>
          )}
          {expiredKey && (
            <p className='text-center'>
              Your key has <strong>expired</strong>, please download a new one.
            </p>
          )}

          <Button
            className='px-5 pb-3 pt-5 text-3xl'
            onClick={() => download()}
          >
            <ButtonIcon>
              <Icon.Download width='1em' height='1em' strokeWidth={3} />
            </ButtonIcon>
            <ButtonText>Download New Key</ButtonText>
          </Button>

          <p className='mt-5 rounded-lg border-2 border-amber-800 bg-amber-100 px-5 py-3 text-black [text-shadow:none]'>
            <strong className='font-medium'>
              ⚠️ Downloading a new key will expire all previous keys.
            </strong>
            <br />
            <br />
            Download a new key if you want to reset your key or your current one
            has expired.
          </p>

          <Button className='px-5 pb-3 pt-5 text-3xl' onClick={() => logout()}>
            <ButtonIcon>
              <Icon.LogOut width='1em' height='1em' strokeWidth={3} />
            </ButtonIcon>
            <ButtonText>Log Out</ButtonText>
          </Button>

          <Button
            className='px-5 pb-3 pt-5 text-3xl hover:from-rose-600 hover:to-red-900 focus:from-rose-600 focus:to-red-900'
            onClick={async () => {
              if (confirm('Are you sure you want to delete your account?')) {
                await deleteAccount()
                logout('Your account has been deleted.')
              }
            }}
          >
            <ButtonIcon>
              <Icon.Trash2 width='1em' height='1em' strokeWidth={3} />
            </ButtonIcon>
            <ButtonText>Delete Account</ButtonText>
          </Button>
        </>
      )}
    </div>
  )
}
