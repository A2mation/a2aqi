import Hero from './components/Hero'
import Info from './components/Info'
import Source from './components/Source'
import Precautions from './components/Precautions'
import AdBanner from '@/components/ad-banner'

import { createLearnMetadata } from "../seo";

export const metadata = createLearnMetadata(
  "Ozone",
  "what-is-ozone"
);

const Page = () => {
  return (
    <>
      <Hero />
      <Info />
      <Source />
      <Precautions />
      <div className="flex flex-col justify-center items-center text-secondary gap-4 p-2 mt-20 pt-20 ">
        <h1 className="text-lg md:text-4xl p-2 text-primary font-extrabold border-b-2 border-blue-400 ">
          Choose Your
          <span className="px-2 text-blue-400 ">
            Air Quality Monitor
          </span>
          To Measure O3 in Air
        </h1>
        <AdBanner />
      </div>
    </>
  )
}

export default Page
