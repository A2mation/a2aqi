import Hero from './components/Hero'
import Info from './components/Info'
import Effects from './components/Effects'
import Precaution from './components/Precaution'
import Solution from './components/Solution'

import { createLearnMetadata } from "../seo";

export const metadata = createLearnMetadata(
  "Pollen",
  "what-is-pollen"
);


const Page = () => {
  return (
    <>
      <Hero />
      <Info />
      <Effects />
      <Precaution />
      <Solution />
    </>
  )
}

export default Page
