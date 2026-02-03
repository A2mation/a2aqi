import React from 'react'
import Hero from './components/Hero'
import SoundAndNoise from './components/SoundAndNoise'
import Noise from './components/Noise'
import Info from './components/Info'
import Cause from './components/Cause'
import AceeptableNoiseLevel from './components/AceeptableNoiseLevel'
import Effects from './components/Effects'
import Table from './components/Table'
import Cure from './components/Cure'
import AdBanner from '@/components/ad-banner'

import { createLearnMetadata } from "../seo";

export const metadata = createLearnMetadata(
  "Noise Pollution",
  "what-is-noise-pollution"
);

const Page = () => {
  return (
    <>
      <Hero />
      <SoundAndNoise />
      <Noise />
      <Info />
      <Cause />
      <AceeptableNoiseLevel />
      <Effects />
      <Table />
      <Cure />
      <div className="flex flex-col justify-center items-center text-secondary gap-4 p-2 mt-20 pt-20 ">
        <h1 className="text-lg md:text-4xl p-2 text-primary font-extrabold border-b-2 border-blue-400 ">
          Use a device to measure
          <span className="px-2 text-blue-400 ">
            Noise
          </span>
          level indoor & outdoor
        </h1>
        <AdBanner />
      </div>
    </>
  )
}

export default Page
