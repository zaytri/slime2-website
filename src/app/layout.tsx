import Header from '@/components/header'
import './globals.css'

import Footer from '@/components/footer'
import clsx from 'clsx'
import fontClasses from '@/helpers/fonts'
import WaveSvg from '@/components/svg/WaveSvg'

export const metadata = {
  title: 'Slime2 - Your streams, your way!',
  description:
    'Slime2 - A desktop app to manage and customize local overlays and bots for your streams, available on Linux, Windows, and Mac!',
  icons: {
    icon: [
      { url: '/app-icon/favicon-16x16.png', sizes: '16x16' },
      { url: '/app-icon/favicon-32x32.png', sizes: '32x32' },
    ],
    apple: '/app-icon/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  keywords: [
    'Slime2',
    'Streaming',
    'Stream Widgets',
    'Stream Overlays',
    'Stream Alerts',
    'zaytri, stream tools, stream bot, twitch, twitch tools, twitch widgets, twitch overlays, twitch alerts, twitch bot',
  ],
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html
      lang='en'
      className={clsx(fontClasses, 'h-screen w-screen overflow-x-hidden')}
    >
      <body className='relative flex h-screen flex-col items-center px-4'>
        <div className='fixed inset-0 -z-[1] bg-lime-600 bg-gradient-to-br from-green-700 to-lime-600 px-5 shadow-[inset_0_0_50px_#FFF3]'>
          <div className='absolute inset-0 bg-black text-white opacity-10 mix-blend-overlay'>
            <WaveSvg className=' -translate-y-60' />
          </div>
        </div>
        <Header />
        <main className='flex-1 flex-col pt-6'>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
