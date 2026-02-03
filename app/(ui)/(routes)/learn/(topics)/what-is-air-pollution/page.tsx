import { Wind } from "lucide-react";

import { IndoorHarmfulItemsCard } from "./components/indoor-harmful-items-card";
import { OutdoorHarmfulItemsCard } from "./components/outdoor-harmful-items-card";
import { Tooltip } from "@/components/ui/tooltip-card";
import { DangerousAirContaminantsCard } from "./components/dangerous-air-contaminants-card";
import HealthImpactByPollution from "./components/health-impact-pl";
import AdBanner from "@/components/ad-banner";

import { createLearnMetadata } from "../seo";

export const metadata = createLearnMetadata(
    "Air Pollution",
    "what-is-air-pollution"
);

const AirPollutionArticle = () => {
    return (
        <>
            <section
                className="h-[94dvh] md:h-[50dvh] w-full bg-center bg-cover bg-no-repeat mb-5"
                style={{
                    backgroundImage: "url('/assets/cloudy-sky.jpg')",
                }}
            >
                {/* Optional overlay */}
                <div className="h-full w-full bg-black/15 flex items-center justify-center flex-col">
                    <div className="h-1/2 w-1/2 flex flex-col justify-center text-secondary gap-4">
                        <h1 className="flex items-center justify-start text-5xl md:text-8xl ">
                            <Wind className="h-15 w-15 md:h-20 md:w-20 text-secondary" /> Air
                        </h1>
                        <span className="text-md md:text-2xl">
                            Air is an invisible mixture of various gases. It exists naturally in our environment. Oxygen is one of the various gases present in the air that we breathe. Furthermore, various gases present in air causes air pollution.
                        </span>

                    </div>

                </div>

            </section>

            <section
                className=" h-full max-w-7xl mx-auto lg:h-3/4 "
            >
                <div className="flex items-center justify-center f gap-4 w-full">
                    <div
                        className="h-50 md:h-100 w-3/4 bg-center bg-cover bg-no-repeat my-10 border-b-cyan-900 rounded-2xl"
                        style={{
                            backgroundImage: "url('/assets/factory-pollution.png')",
                        }}
                    />


                </div>

                <div
                    className="flex flex-col justify-center items-center w-full"
                >
                    <div className="flex gap-2 text-2xl md:text-5xl font-bold">
                        What is
                        <span className="text-blue-400">
                            Air Pollution?
                        </span>
                    </div>
                    <div className="mt-4 w-3/4">

                        <span className="text-xl text-neutral-600 dark:text-neutral-400">
                            Air pollution happens when{" "}
                            <Tooltip
                                containerClassName="text-neutral-600 dark:text-neutral-400"
                                content="like carbon monoxide (CO), nitrogen oxides (NOx), sulfur dioxide (SO2), methane (CH4), and volatile organic compounds (VOCs), which harm health (respiratory issues, cancer) and the environment (acid rain, climate change, smog)."
                            >
                                <span className="font-bold">gases</span>
                            </Tooltip>{", "}
                            <Tooltip
                                containerClassName="text-neutral-600 dark:text-neutral-400"
                                content="Dust pollution is the presence of excessive airborne particulate matter (PM) from natural (soil erosion, sandstorms) and human activities (construction, industry, vehicles) that degrades air quality, harms health by causing respiratory and cardiovascular issues, damages ecosystems, and reduces visibility"
                            >
                                <span className="font-bold">dust</span>
                            </Tooltip>{", "}
                            <Tooltip
                                containerClassName="text-neutral-600 dark:text-neutral-400"
                                content="The contamination of soil with harmful substances (pollutants) at concentrations high enough to damage human health, plants, animals, or the entire ecosystem, making it unfit for its natural or intended use"
                            >
                                <span className="font-bold">dirt</span>
                            </Tooltip>{", "}
                            <Tooltip
                                containerClassName="text-neutral-600 dark:text-neutral-400"
                                content="Pollen is a powdery substance that releases by certain plants and trees, especially flowers that helps them reproduce"
                            >
                                <span className="font-bold">pollen</span>
                            </Tooltip>{", "}
                            <Tooltip
                                containerClassName="text-neutral-600 dark:text-neutral-400"
                                content="the presence of fine, black, carbon-based particles in the air, resulting from incomplete burning of fossil fuels and biomass."
                            >
                                <span className="font-bold">soot</span>
                            </Tooltip>{", "}
                            <Tooltip
                                containerClassName="text-neutral-600 dark:text-neutral-400"
                                content="A virus is a tiny infectious agent with genetic material (DNA or RNA) inside a protein shell (capsid) that can only multiply by hijacking a living cell's machinery, making copies of itself, often harming the host cell."
                            >
                                <span className="font-bold">viruses</span>
                            </Tooltip>{", "}etc.
                            contaminate the air making it unclean, unhealthy, and toxic to breathe.
                            The amount of air pollution present in the air determines its effects on humans, animals, plants, and the entire ecosystem. Hence, the amount of pollution in the air affects the level of harm it poses to humans, animals, and plants.
                        </span>

                    </div>
                </div>


            </section>

            <section
                className="h-fit w-full my-5 py-20"
            >


                <div className="bg-blue-100 pt-5 pb-15">

                    <div className="flex items-center justify-center flex-col gap-2 p-4 mb-5">
                        <h1 className="text-2xl md:text-6xl font-bold">
                            Where does air pollution
                            <span className="pl-2 text-blue-400 ">
                                come from?
                            </span>
                        </h1>
                        <h2 className="px-10 py-5 text-md md:text-2xl bg-blue-400 text-white font-bold rounded-2xl mt-4">
                            Indoor Air Pollution Sources
                        </h2>
                    </div>
                    <div className="flex flex-col justify-center text-secondary gap-4 p-2">
                        <IndoorHarmfulItemsCard />
                    </div>

                    <div className="flex items-center justify-center flex-col gap-2 my-10">

                        <h2 className="px-10 py-5 text-md md:text-2xl  bg-blue-400 text-white font-bold rounded-2xl mt-10">
                            Outdoor Air Pollution Sources
                        </h2>

                        <span className="text-sm md:text-lg w-3/4 md:w-1/2 text-center flex items-center justify-center mt-5">
                            Vehicles, factories, garbage burning, dust, power plants, construction and demolition activities, oil refineries, emissions from aircraft and planes, wildfires, volcanic eruptions, etc.
                        </span>

                    </div>

                    <div className="flex flex-col justify-center text-secondary gap-4 p-2">
                        <OutdoorHarmfulItemsCard />
                    </div>
                </div>


                <div className="flex flex-col justify-center items-center text-secondary gap-4 p-2">
                    <span className="text-xl md:text-4xl text-gray-500 m-10">
                        Some common but extremely dangerous air contaminants are
                    </span>
                    <DangerousAirContaminantsCard />
                </div>

                <div className="flex flex-col justify-center items-center text-secondary gap-4 p-2 mt-20 pt-20 bg-blue-100">
                    <h1 className="text-2xl md:text-6xl text-primary font-bold">
                        Health
                        <span className="pl-2 text-blue-400 ">
                            Impacts By Air Pollution
                        </span>
                    </h1>
                    <HealthImpactByPollution />
                </div>

                <div className="flex flex-col justify-center items-center text-secondary gap-4 p-2 mt-20 pt-20 ">
                    <h1 className="text-lg md:text-4xl p-2 text-primary font-extrabold border-b-2 border-blue-400 ">
                        Choose Your
                        <span className="px-2 text-blue-400 ">
                            Air Quality Monitor
                        </span>
                        To Measure Air Pollution
                    </h1>
                    <AdBanner />
                </div>

            </section>


        </>
    );
};

export default AirPollutionArticle;




