"use client";
import Image from "next/image";
import { WobbleCard } from "@/components/ui/wobble-card";


export function IndoorHarmfulItemsCard() {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">

                <WobbleCard
                    containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
                >
                    <div className="flex items-center justify-between flex-col md:flex-row">

                        <div className="max-w-xs">
                            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Tobacco smoke
                            </h2>
                            <p className="mt-4 text-left  text-base/6 text-neutral-200">
                                Cigarette smoking is not only injurious to the person who is smoking. But it is equally injurious to people indoors who inhale second-hand smoke.
                            </p>
                        </div>
                        <Image
                            src="/assets/tobacco-smoke.png"
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
                            Burning Fuels & Kerosene
                        </h2>
                        <Image
                            src="/assets/burning-fuels.png"
                            width={100}
                            height={100}
                            alt="linear demo image"
                            className="grayscale filter object-contain rounded-2xl"
                        />

                    </div>
                    <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                        Incomplete combustion of fuels in various home appliances such as stoves, furnaces, etc. release CO and PM.
                    </p>
                </WobbleCard>

                <WobbleCard containerClassName="col-span-1 min-h-[300px]">
                    <div className="flex justify-between items-center">
                        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                            Air fresheners
                        </h2>
                        <Image
                            src="/assets/air-freshener.png"
                            width={100}
                            height={100}
                            alt="linear demo image"
                            className="grayscale filter object-contain rounded-2xl"
                        />

                    </div>
                    <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                        Air fresheners and cleaning agents are a potential source of VOCs. If used in excess amounts, they can cause headaches, nausea, etc.
                    </p>
                </WobbleCard>

                <WobbleCard
                    containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
                >
                    <div className="flex items-center justify-between flex-col md:flex-row">

                        <div className="max-w-xs">
                            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Cooing Fumes
                            </h2>
                            <p className="mt-4 text-left  text-base/6 text-neutral-200">
                                Cooking activities can emit various air pollutants. Humidity levels inside the home can increase when more water is used in cooking.
                            </p>
                        </div>
                        <Image
                            src="/assets/cooking-fumes.png"
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
                                Photocopiers & Printers
                            </h2>
                            <p className="mt-4 text-left  text-base/6 text-neutral-200">
                                These are O3 emitters in a home or office setting. Ozone levels, when exceeding the limits can cause various health effects.
                            </p>
                        </div>
                        <Image
                            src="/assets/photocopiers-and-printer.png"
                            width={200}
                            height={200}
                            alt="linear demo image"
                            className=" grayscale filter object-contain rounded-2xl"
                        />
                    </div>
                </WobbleCard>
                <WobbleCard containerClassName="col-span-1 min-h-[300px]">
                    <div className="flex justify-between items-center">
                        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                            Pet Dander
                        </h2>
                        <Image
                            src="/assets/pet-dander.png"
                            width={100}
                            height={100}
                            alt="linear demo image"
                            className="grayscale filter object-contain rounded-2xl"
                        />

                    </div>
                    <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                        This acts as a stressor for respiratory disorders as well as a trigger for asthma attacks. Therefore, animal contact must be reduced as much as possible
                    </p>
                </WobbleCard>




            </div>
        </>
    );
}
