import React from 'react'
import { GlobeDemo } from './components/GlobeDemo'
import IntroSection from './components/IntroSection'
import MissonVision from './components/MissonVision'

const AboutUsPage = () => {
    return (
        <>
            <section className=''>
                <GlobeDemo />
            </section>
            <section className='bg-blue-100 my-20'>
                <IntroSection />
            </section>
            <section className='max-w-7xl mx-auto flex items-center justify-center flex-col md:flex-row gap-10 mb-10'>
                <MissonVision />
            </section>
        </>
    )
}

export default AboutUsPage


