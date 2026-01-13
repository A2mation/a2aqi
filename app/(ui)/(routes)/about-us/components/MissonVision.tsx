import React from 'react'
import { CardSpotlight } from "@/components/ui/card-spotlight";

const MissonVision = () => {
    return (
        <>
            <CardSpotlight className="h-96 w-100 bg-blue-500">
                <p className="text-2xl font-bold relative z-20 mt-2 text-white">
                    Our
                    Mission
                </p>

                <p className="text-neutral-300 mt-4 relative z-20 text-base">
                    Our mission in AQI is to empower everyone to take control of their air quality. For it, we provide real-time, user-friendly access to air quality data. Our main goal is to transform complex data into actionable insights that help you in saving your families and loved ones. It includes health advice and actionable solutions as per the air quality conditions in your area.
                </p>
            </CardSpotlight>
            <CardSpotlight className="h-96 w-100 bg-blue-500">
                <p className="text-2xl font-bold relative z-20 mt-2 text-white">
                    Our Vision
                </p>

                <p className="text-neutral-300 mt-4 relative z-20 text-base">
                    We envision a future where everyone is aware of the air they are breathing. We aim to form a community where everyone can breathe freely and where clean air is a fundamental right and not a luxury. For it, we are continuously developing innovative air quality monitoring solutions. Besides, we also suggest top and possible options for cleaner air.
                </p>
            </CardSpotlight>
        </>
    )
}

export default MissonVision





