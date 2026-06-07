import {
  Radio_Canada,
  Fredoka,
  Finlandica,
  Grandstander,
  Nunito,
  Mochiy_Pop_One,
  Atkinson_Hyperlegible,
} from 'next/font/google'

const radioCanada = Radio_Canada({
  subsets: ['latin'],
  variable: '--font-radio-canada',
  display: 'swap',
})

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
})

const finlandica = Finlandica({
  subsets: ['latin'],
  variable: '--font-finlandica',
  display: 'swap',
})

const grandstander = Grandstander({
  subsets: ['latin'],
  variable: '--font-grandstander',
  display: 'swap',
})

const mochiy = Mochiy_Pop_One({
  subsets: ['latin'],
  variable: '--font-mochiy',
  display: 'swap',
  weight: '400',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const atkinson = Atkinson_Hyperlegible({
  subsets: ['latin'],
  variable: '--font-atkinson',
  display: 'swap',
  weight: '400',
})

const fontClasses = [
  radioCanada,
  fredoka,
  finlandica,
  grandstander,
  mochiy,
  nunito,
  atkinson,
]
  .map(font => font.variable)
  .join(' ')

export default fontClasses
