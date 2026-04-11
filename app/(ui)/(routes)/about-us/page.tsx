
import Cta from './components/Cta'
import { GlobeDemo } from './components/GlobeDemo'
import IntroSection from './components/IntroSection'
import MissonVision from './components/MissonVision'
import StatsBar from './components/StatsBar'
import Teams from './components/Teams'

const AboutUsPage = () => {
    return (
        <>
            <section className=''>
                <GlobeDemo />
            </section>

            <section className='bg-blue-50 py-24 my-20 rounded-t-[3rem] relative z-10'>
                <IntroSection />
            </section>

            <MissonVision />

            <StatsBar />

            {/* <Teams /> */}

            <Cta />
        </>
    )
}

export default AboutUsPage