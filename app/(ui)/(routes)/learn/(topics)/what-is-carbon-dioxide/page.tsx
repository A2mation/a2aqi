import Hero from './components/Hero'
import Table from './components/Table'
import Source from './components/Source'
import HealthEffect from './components/HealthEffect'
import AdBanner from '@/components/ad-banner'

import { createLearnMetadata } from "../seo";

export const metadata = createLearnMetadata(
  "Carbon dioxide",
  "what-is-carbon-dioxide"
);

const Page = () => {
  return (
    <>
      <Hero />
      <Table />
      <Source />
      <HealthEffect />
      <div className="flex flex-col justify-center items-center text-secondary gap-4 p-2 mt-20 pt-20 ">
        <h1 className="text-lg md:text-4xl p-2 text-primary font-extrabold border-b-2 border-blue-400 ">
          Choose Your
          <span className="px-2 text-blue-400 ">
            Air Quality Monitor
          </span>
          To Measure CO2 levels
        </h1>
        <AdBanner />
      </div>
    </>
  )
}

export default Page
