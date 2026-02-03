import React from 'react'
import Hero from './components/Hero'
import Source from './components/Source'
import Impacts from './components/Impacts'
import Reduce from './components/Reduce'
import Table from './components/Table'
import AdBanner from '@/components/ad-banner'

import { createLearnMetadata } from "../seo";

export const metadata = createLearnMetadata(
  "Nitrogen Dioxide",
  "what-is-nitrogen-dioxide"
);

const Page = () => {
  return (
    <>
      <Hero />
      <Source />
      <Impacts />
      <Reduce />
      <Table />
      <div className="flex flex-col justify-center items-center text-secondary gap-4 p-2 mt-2 pt-5 ">
        <h1 className="text-lg md:text-4xl p-2 text-primary font-extrabold border-b-2 border-blue-400 ">
          Choose Your
          <span className="px-2 text-blue-400 ">
            Air Quality Monitor
          </span>
          To Measure NO2
        </h1>
        <AdBanner />
      </div>
    </>
  )
}

export default Page
