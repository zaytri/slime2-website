import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='mt-5 w-screen bg-emerald-800 py-3 text-center text-lime-100'>
      SlimeChat created by{' '}
      <Link
        href='https://zaytri.com/'
        className='text-lime-300 hover:underline'
      >
        Zaytri
      </Link>
    </footer>
  )
}
