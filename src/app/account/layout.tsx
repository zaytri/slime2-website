export const metadata = {
  title: 'Account ~ slime2',
}

export default async function AccountLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className='rounded-[8px] border border-zinc-500 bg-gradient-to-b from-zinc-800/90 to-zinc-900/90 px-8 py-4 text-center font-round text-white shadow-[inset_0_5px_15px_5px_#0002] ring-2 ring-zinc-900/50 [text-shadow:0_2px_black]'>
      {' '}
      {children}
    </div>
  )
}
