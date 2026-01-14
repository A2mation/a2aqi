import React from 'react'
import Hero from './components/Hero'
import Intro from './components/Intro'
import EmmissionSources from './components/EmmissionSources'
import Enviourment from './components/Enviourment'
import AmmoniaConcentration from './components/AmmoniaConcentration'
import HealthHazard from './components/HealthHazard'
import Solution from './components/Solution'

const Page = () => {
  return (
    <>
      <Hero />
      <Intro />
      <EmmissionSources />
      <Enviourment />
      <AmmoniaConcentration />
      <HealthHazard />
      <Solution />
    </>
  )
}

export default Page
