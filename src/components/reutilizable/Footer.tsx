/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { QRCodeCanvas } from "qrcode.react"
import React from 'react'
import { Icons } from './Icons'
import { ArrowRight, BrainIcon, Heart, Linkedin, MapPinCheckInsideIcon, Twitch } from 'lucide-react'

type Props = {}

type LiIconsProps = {
  component: React.ReactNode
  icon_name?: string
  socialMediaUrl: string

}


const LiIcons = (props: LiIconsProps) => {
  return (
    <li>
      <a href={`${props.socialMediaUrl}`} className="flex items-center space-x-3 hover:text-purple-500 transition" referrerPolicy='no-referrer' rel='noopener' target='_blank'>
        {props.component}
        <span className='capitalize'>{props.icon_name}</span>
      </a>
    </li>
  )
}

const links = [
  {
    name: "Home",
    url: "#"
  },
  {
    name: "About",
    url: "#"
  },
  {
    name: "Guide",
    url: "#"
  },
  {
    name: "Contact",
    url: "#"
  },
]

const groupIcons: { [key: string]: React.ReactNode } = {
  github: <Icons.github key={0} />,
  twitter: <Icons.twitter key={1} />,
  youtube: <Icons.youtube key={2} />,
  facebook: <Icons.facebook key={3} />,
  linkedin: <Linkedin key={4} size={20} />,
  twitch: <Twitch key={5} />,
  curriculum: <MapPinCheckInsideIcon />
}

const socialMediaUrl: string[] = [
  "https://www.github.com/flan02",
  "https://www.twitter.com/flano2",
  "https://www.youtube.com/@flan_02",
  "https://www.facebook.com/dan.chanivet/",
  "https://www.linkedin.com/in/dan-chanivet-574084b2/",
  "https://www.twitch.tv/flano2",
  "https://danchanivet.me",
]

const Footer = (props: Props) => {
  const siteUrl = 'https://www.cvai.online'
  return (
    <footer className="relative py-20 flex flex-col items-center bg-yellow-50/50 dark:bg-gray-900/50 overflow-hidden md:py-40">
      <div className="relative z-[1] m-auto px-6 md:px-12 lg:px-0">

        <div className="m-auto md:w-10/12 lg:w-9/12 xl:w-full">
          <div className="flex flex-wrap items-center justify-between md:flex-nowrap lg:space-x-16">
            <div className="w-full space-x-12 flex justify-center text-gray-300 sm:w-7/12 md:justify-start">
              <ul className="list-inside space-y-8">
                {
                  links.map((link, index) => (
                    <li key={index} className='flex space-x-2 items-end hover:text-purple-500 dark:text-zinc-700 dark:hover:text-purple-500'>
                      <ArrowRight />
                      <a href={`/${link.url}`} className="transition">{link.name}</a></li>
                  ))
                }

              </ul>

              <ul role="list" className="space-y-8 dark:text-zinc-700">
                {
                  Object.keys(groupIcons).map((key, index) => (
                    <LiIcons key={key} component={groupIcons[key]} icon_name={key} socialMediaUrl={socialMediaUrl[index]} />
                  ))
                }

              </ul>
            </div>
            <div className="w-10/12 m-auto mt-10 space-y-6 text-center sm:text-left sm:w-5/12 sm:mt-auto">
              <div className="flex flex-col items-center">
                <p className="text-xs text-muted-foreground mb-2">Escanea este código para visitar nuestra página en tu móvil</p>

                <QRCodeCanvas
                  value={siteUrl}
                  size={128} // Tamaño del QR
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>

              <div className="flex items-center justify-center">
                <BrainIcon fill="rgb(168 85 247 / 0.8)" className="pr-2 text-purple-500/70 size-8" />
                <span className="block text-muted-foreground underline underline-offset-4 font-bold">CVAI &copy; {new Date().getFullYear()}</span>
              </div>

              <div className="flex flex-col justify-between text-white space-y-1">
                <a href="/tos" className="font-mono underline underline-offset-4 dark:text-zinc-700">Términos de uso</a>
                <a href="#" className="font-mono underline underline-offset-4 dark:text-zinc-700">Políticas de privacidad</a>
                <a href="#" className="font-mono underline underline-offset-4 text-white dark:text-zinc-700">Contáctanos</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute h-full inset-0 flex items-center">
        <div aria-hidden="true" className="w-56 h-56 m-auto blur-xl rounded-full md:w-[30rem] md:h-[30rem] md:blur-3xl"></div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 w-full h-full opacity-80"></div>
    </footer>


  )
}

export default Footer