'use client'

import Button, { ButtonText } from '@/components/button'

const links = [
  // ['Download Slime2', 'https://zaytri.itch.io/slime2'],
  // ['Widget Setup', 'https://forums.slime2.stream/resources/widget-setup.3/'],
  // ['Widget Dev Docs', 'https://docs.slime2.stream/'],
  ['Forums', 'https://slime2.forumotion.com/'],
  ['Discord', 'https://discord.gg/NcZvztE9dc'],
  ['Custom Widgets', 'https://slime2.forumotion.com/c3-custom-widgets'],
  ['Source Code', 'https://github.com/zaytri/slime2-desktop'],

  // [
  //   'What is slime2?',
  //   'https://forums.slime2.stream/threads/what-is-slime2.36/',
  // ],
]

export default function Home() {
  return (
    <div className='space-y-5 rounded-[8px] border border-zinc-500 bg-gradient-to-b from-zinc-800/90 to-zinc-900/90 px-8 py-8 text-center font-round text-white shadow-[inset_0_5px_15px_5px_#0002] ring-2 ring-zinc-900/50 [text-shadow:0_2px_black]'>
      <h1 className='font-mochiy text-2xl font-medium'>
        Slime2<span className='text-xl'> - Your streams, your way!</span>
      </h1>

      <p className='!mt-4 max-w-xl text-left font-fredoka text-lg'>
        Slime2 is a desktop app for managing and customizing local overlays and
        bots for your streams, available on Linux, Windows, and macOS!
      </p>
      <div className='flex justify-center'>
        <iframe
          src='https://itch.io/embed/3567176?linkback=true&amp;border_width=4&amp;bg_color=f1fee0&amp;fg_color=222222&amp;link_color=327345&amp;border_color=529365'
          width='100%'
          height='173'
          className='max-w-[558px]'
        >
          <a href='https://zaytri.itch.io/slime2'>Slime2 by Zaytri</a>
        </iframe>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        {links.map(([name, path]) => {
          return (
            <Button key={name} className='px-4 pb-4 pt-3' href={path}>
              <ButtonText className='font-mochiy text-2xl !font-normal'>
                {name}
              </ButtonText>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
