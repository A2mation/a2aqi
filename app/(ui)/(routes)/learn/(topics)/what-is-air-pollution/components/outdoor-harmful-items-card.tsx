"use client";
import Image from "next/image";
import { WobbleCard } from "@/components/ui/wobble-card";


export function OutdoorHarmfulItemsCard() {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">



                <WobbleCard containerClassName="col-span-1 min-h-[300px]">
                    <div className="flex justify-between items-center">
                        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                            C&D activities
                        </h2>
                        <Image
                            src="/assets/cd-activities.png"
                            width={100}
                            height={100}
                            alt="linear demo image"
                            className="grayscale filter object-contain rounded-2xl"
                        />

                    </div>
                    <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                        Waste generated at construction and destruction activities substantially increase PM2.5 and PM10 levels in the air, hence in the nearby areas.
                    </p>
                </WobbleCard>

                <WobbleCard
                    containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
                >
                    <div className="flex items-center justify-between flex-col md:flex-row">

                        <div className="max-w-xs">
                            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Power Plant
                            </h2>
                            <p className="mt-4 text-left  text-base/6 text-neutral-200">
                                Industries and power plants are the main source of air pollution sources outdoors. Emissions from power plants cause photochemical smog.
                            </p>
                        </div>
                        <Image
                            src="/assets/power-plant.png"
                            width={200}
                            height={200}
                            alt="linear demo image"
                            className=" grayscale filter object-contain rounded-2xl"
                        />
                    </div>
                </WobbleCard>


                <WobbleCard
                    containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
                >
                    <div className="flex items-center justify-between flex-col md:flex-row">

                        <div className="max-w-xs">
                            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Garbage Burning
                            </h2>
                            <p className="mt-4 text-left  text-base/6 text-neutral-200">
                                Emissions from burning garbage produce various toxic gases and air pollutants such as CO, CO2, NO2, Smoke, dust, etc.
                            </p>
                        </div>
                        <Image
                            src="/assets/garbage-burning.png"
                            width={200}
                            height={200}
                            alt="linear demo image"
                            className=" grayscale filter object-contain rounded-2xl"
                        />
                    </div>
                </WobbleCard>
                <WobbleCard containerClassName="col-span-1 min-h-[300px]">
                    <div className="flex justify-between items-center">
                        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                            Unpaved roads
                        </h2>
                        <Image
                            src="/assets/unpaved-roads.png"
                            width={100}
                            height={100}
                            alt="linear demo image"
                            className="grayscale filter object-contain rounded-2xl"
                        />

                    </div>
                    <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                        Unpaved roads emit particulate matter, PM pollution {`(PM2.5, PM10)`}, dust, and debris. Hence, it can increase the overall PM levels of that area.
                    </p>
                </WobbleCard>



                <WobbleCard containerClassName="col-span-1 min-h-[300px]">
                    <div className="flex justify-between items-center">
                        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                            Wildfires & Volcanic eruptions
                        </h2>
                        <Image
                            src="/assets/wildfires-volcanic-eruptions.png"
                            width={100}
                            height={100}
                            alt="linear demo image"
                            className="grayscale filter object-contain rounded-2xl"
                        />

                    </div>
                    <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                        These are natural sources of outdoor air pollution. Because they emit carbon monoxide, black carbon, etc. which is injurious to wildlife as well.
                    </p>
                </WobbleCard>

                <WobbleCard
                    containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
                >
                    <div className="flex items-center justify-between flex-col md:flex-row">

                        <div className="max-w-xs">
                            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Oil refineries & brick kilns
                            </h2>
                            <p className="mt-4 text-left  text-base/6 text-neutral-200">
                                Pre-processing and processing of oil and bricks emit various pollutants including toxic metals, particulates, toxic gases like methane, etc.
                            </p>
                        </div>
                        <Image
                            src="/assets/oil-refineries.png"
                            width={200}
                            height={200}
                            alt="linear demo image"
                            className=" grayscale filter object-contain rounded-2xl"
                        />
                    </div>
                </WobbleCard>




            </div>
        </>
    );
}
