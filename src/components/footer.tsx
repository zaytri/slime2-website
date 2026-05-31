import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='mt-5 w-screen bg-emerald-800 p-3 text-center text-lime-100'>
      <p>
        Slime2 created by{' '}
        <Link
          href='https://zaytri.com/'
          className='text-lime-300 hover:underline'
          target='_blank'
        >
          Zaytri
        </Link>{' '}
        | Logo designed by{' '}
        <Link
          href='https://sidequestdesigns.com/'
          className='text-lime-300 hover:underline'
          target='_blank'
        >
          Bri @ SideQuest Designs
        </Link>
      </p>
      {/* <p>
        <Link href='/privacy' className='text-lime-300 hover:underline'>
          Privacy Policy
        </Link>{' '}
        -{' '}
        <Link href='/tos' className='text-lime-300 hover:underline'>
          Terms of Service
        </Link>
      </p> */}
    </footer>
  )
}
