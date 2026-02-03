import Hero from './components/Hero'
import Info from './components/Info'


import { createLearnMetadata } from "../seo";

export const metadata = createLearnMetadata(
  "Radon",
  "what-is-radon"
);

const Page = () => {
  return (
    <>
      <Hero />
      <Info />
    </>
  )
}

export default Page
