import Link from 'next/link'
import Navigation from './navigation'
import Image from 'next/image'
import logo from '../../public/assets/logo2.png'

export default function Header() {
  return (
    <header className='flex w-screen flex-col items-center px-4 pt-6'>
      <Link href='/'>
        <div className=''>
          <Image
            src={logo}
            className='logo max-h-48 w-auto drop-shadow-[0_0_5px_#FFF2]'
            alt='Slime2 Logo'
            priority
          />
        </div>
      </Link>
      {/* <Navigation /> */}
    </header>
  )
}
