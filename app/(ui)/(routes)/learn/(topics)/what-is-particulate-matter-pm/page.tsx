import React from 'react'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Source from './components/Source'
import Info from './components/Info'
import Solution from './components/Solution'
import AdBanner from '@/components/ad-banner'

import { createLearnMetadata } from "../seo";

export const metadata = createLearnMetadata(
  "Particulate Matter (PM)",
  "what-is-particulate-matter-pm"
);

const Page = () => {
  return (
    <>
      <Hero />
      <Intro />
      <Source />
      <Info />
      <Solution />

      <div className="flex flex-col justify-center items-center text-secondary gap-4 p-2 pt-20 ">
        <h1 className="text-lg md:text-4xl p-2 text-primary font-extrabold border-b-2 border-blue-400 ">
          Choose Your
          <span className="px-2 text-blue-400 ">
            Air Quality Monitor
          </span>
          To Measure PM in Air
        </h1>
        <AdBanner />
      </div>
    </>
  )
}

export default Page
