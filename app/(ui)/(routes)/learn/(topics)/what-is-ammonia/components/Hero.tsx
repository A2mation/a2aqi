import { Wind } from 'lucide-react'
import React from 'react'

const Hero = () => {
    return (
        <section
            className="h-[94dvh] md:h-[50dvh] w-full bg-center bg-cover bg-no-repeat mb-5"
            style={{
                backgroundImage: "url('https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg')",
            }}
        >
            {/* Optional overlay */}
            <div className="h-full w-full bg-black/15 flex items-center justify-center flex-col">
                <div className="h-1/2 w-1/2 flex flex-col justify-center text-secondary gap-4">
                    <h1 className="flex items-center justify-start text-3xl md:text-5xl ">
                        <Wind className="h-15 w-15 md:h-20 md:w-20 text-secondary" /> {`Ammonia (NH₃)`}
                    </h1>
                    <span className="text-md md:text-2xl">
                        Ammonia (NH₃) is a toxic gas that is made up of one nitrogen and three hydrogen atoms. Naturally, it is found in small amounts, but can be produced through industries. Since, ammonia uses in the manufacturing of fertilizers, refrigeration, and cleaning products. It used as a raw product for making chemicals such as nitric oxide.
                    </span>

                </div>

            </div>

        </section>
    )
}

export default Hero
