import Hero from './components/Hero'
import Source from './components/Source'
import EnvironmentImpact from './components/EnvironmentImpact'
import Tables from './components/Tables'
import Solution from './components/Solution'
import AdBanner from '@/components/ad-banner'


const Page = () => {
  return (
    <>
      <Hero />
      <Source />
      <EnvironmentImpact />
      <Tables />
      <Solution />

      <div className="flex flex-col justify-center items-center text-secondary gap-4 p-2 mt-20 pt-20 ">
        <h1 className="text-lg md:text-4xl p-2 text-primary font-extrabold border-b-2 border-blue-400 ">
          Choose Your
          <span className="px-2 text-blue-400 ">
            Air Quality Monitor
          </span>
          To Measure CO in Air
        </h1>
        <AdBanner />
      </div>
    </>
  )
}

export default Page
