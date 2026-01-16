import React from 'react'
import Hero from './components/Hero'
import Info from './components/Info'
import Effects from './components/Effects'
import Precaution from './components/Precaution'
import Knowledege from './components/Knowledege'
import AdBanner from '@/components/ad-banner'

const Page = () => {
  return (
    <>
      <Hero />
      <Info />
      <Effects />
      <Precaution />
      <Knowledege />

      <div className="flex flex-col justify-center items-center text-secondary gap-4 p-2 mt-0 pt-10 ">
        <h1 className="text-lg md:text-4xl p-2 text-primary font-extrabold border-b-2 border-blue-400 ">
          Choose Your
          <span className="px-2 text-blue-400 ">
            Air Quality Monitor
          </span>
          To Measure Humidity in Air
        </h1>
        <AdBanner />
      </div>
    </>
  )
}

export default Page
