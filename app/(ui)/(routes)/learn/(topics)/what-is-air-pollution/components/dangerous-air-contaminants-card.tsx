"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

export function DangerousAirContaminantsCard() {
    const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
        null
    );
    const ref = useRef<HTMLDivElement>(null!);
    const id = useId();

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setActive(false);
            }
        }

        if (active && typeof active === "object") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    return (
        <>
            <AnimatePresence>
                {active && typeof active === "object" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 h-full w-full z-10"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active && typeof active === "object" ? (
                    <div className="fixed inset-0  grid place-items-center z-[100]">
                        <motion.button
                            key={`button-${active.title}-${id}`}
                            layout
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    duration: 0.05,
                                },
                            }}
                            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                            onClick={() => setActive(null)}
                        >
                            <CloseIcon />
                        </motion.button>
                        <motion.div
                            layoutId={`card-${active.title}-${id}`}
                            ref={ref}
                            className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
                        >
                            <motion.div layoutId={`image-${active.title}-${id}`}>
                                <img
                                    width={200}
                                    height={200}
                                    src={active.src}
                                    alt={active.title}
                                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                                />
                            </motion.div>

                            <div>
                                <div className="flex justify-between items-start p-4">
                                    <div className="">
                                        <motion.h3
                                            layoutId={`title-${active.title}-${id}`}
                                            className="font-bold text-neutral-700 dark:text-neutral-200"
                                        >
                                            {active.title}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${active.description}-${id}`}
                                            className="text-neutral-600 dark:text-neutral-400"
                                        >
                                            {active.description}
                                        </motion.p>
                                    </div>

                                    <motion.a
                                        layoutId={`button-${active.title}-${id}`}
                                        // href={active.ctaLink}
                                        target="_blank"
                                        className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                                    >
                                        {active.ctaText}
                                    </motion.a>
                                </div>
                                <div className="pt-4 relative px-4">
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                                    >
                                        {typeof active.content === "function"
                                            ? active.content()
                                            : active.content}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
            <ul className="max-w-4xl mx-auto w-full gap-4">
                {cards.map((card, index) => (
                    <motion.div
                        layoutId={`card-${card.title}-${id}`}
                        key={`card-${card.title}-${id}`}
                        onClick={() => setActive(card)}
                        className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
                    >
                        <div className="flex gap-4 flex-col md:flex-row ">
                            <motion.div layoutId={`image-${card.title}-${id}`}>
                                <img
                                    width={100}
                                    height={100}
                                    src={card.src}
                                    alt={card.title}
                                    className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                                />
                            </motion.div>
                            <div className="">
                                <motion.h3
                                    layoutId={`title-${card.title}-${id}`}
                                    className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                                >
                                    {card.title}
                                </motion.h3>
                                <motion.p
                                    layoutId={`description-${card.description}-${id}`}
                                    className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                                >
                                    {card.description}
                                </motion.p>
                            </div>
                        </div>
                        <motion.button
                            layoutId={`button-${card.title}-${id}`}
                            className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
                        >
                            {card.ctaText}
                        </motion.button>
                    </motion.div>
                ))}
            </ul>
        </>
    );
}

export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.05,
                },
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-black"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </motion.svg>
    );
};

const cards = [
    {
        description: "Particulate Matter...",
        title: "PM2.5 & PM10",
        src: "https://www.ppsthane.com/wp-content/uploads/2016/02/Sources-of-PM-Infographic-by-Perfect-Pollucon-Services-V1.png",
        ctaText: "Show",
        ctaLink: "",
        content: () => {
            return (
                <p>
                    Particulate Matter (PM2.5 and PM10) consists of tiny solid or liquid particles in the air, such as dust, smoke, and vehicle exhaust. PM2.5 is especially harmful because it can penetrate deep into the lungs and enter the bloodstream. These particles mainly come from vehicles, industrial activities, construction, biomass burning, and wildfires. Exposure can cause coughing and breathing problems in the short term and increase the risk of asthma, heart disease, lung cancer, strokes, and premature death over time, with children, older adults, pregnant women, and people with existing heart or lung conditions being most at risk.
                </p>
            );
        },
    },
    {
        description: "Carbon Monoxide (CO)...",
        title: "Carbon Monoxide",
        src: "https://images.jdmagicbox.com/quickquotes/images_main/-mzobc290.jpg",
        ctaText: "Show",
        ctaLink: "",
        content: () => {
            return (
                <p>
                    Carbon Monoxide (CO) is a colorless, odorless gas produced by incomplete combustion of fuels such as gasoline, diesel, coal, and wood. Often called the “silent killer,” CO reduces the blood ability to carry oxygen by binding strongly to hemoglobin. Common sources include vehicles, gas stoves, heaters, generators, and fireplaces. Low-level exposure can cause headaches, dizziness, and fatigue, while higher levels may lead to confusion, loss of consciousness, brain damage, or death, making indoor exposure particularly dangerous due to its ability to build up without warning.
                </p>
            );
        },
    },

    {
        description: "SO₂ is a pungent...",
        title: "Sulfur Dioxide",
        src: "https://www.obwtechnologies.com/wp-content/uploads/2025/04/sulphur-dioxide1-1.jpg",
        ctaText: "Show",
        ctaLink: "",
        content: () => {
            return (
                <p>
                    Sulfur Dioxide (SO₂) is a pungent, irritating gas released mainly from burning sulfur-containing fossil fuels in power plants, oil refineries, and industrial processes. It can quickly irritate the airways, causing coughing, wheezing, chest tightness, and breathing difficulties, especially in people with asthma or other lung conditions. Repeated or high exposure can reduce lung function, and SO₂ also contributes to acid rain, which damages forests, acidifies lakes and rivers, and harms buildings and monuments.
                </p>
            );
        },
    },
    {
        description: "(NO₂) is a reddish...",
        title: "Nitrogen Dioxide",
        src: "https://i0.wp.com/cacgas.com.au/wp-content/uploads/2025/07/compressed-gas-cylinder-containing-nitrogen-dioxide-make-the-cylinder-silver-1.png?fit=1024%2C768&ssl=1",
        ctaText: "Show",
        ctaLink: "",
        content: () => {
            return (
                <p>
                    Nitrogen Dioxide (NO₂) is a reddish-brown gas with a sharp odor produced mainly by vehicle exhaust, power plants, and fuel-burning appliances. It irritates the airways, worsens asthma, and reduces lung function, increasing the risk of respiratory infections, especially in children and older adults. Long-term exposure is linked to heart disease and chronic lung damage, and NO₂ also contributes to the formation of smog, fine particulate matter (PM2.5), and ground-level ozone, further worsening air quality.
                </p>
            );
        },
    },
    {
        description: "(CH₄) is a colorless...",
        title: "Methane",
        src: "https://media.istockphoto.com/id/1159373642/photo/ch4-molecule-methane-render-of-3d-model-with-copy-space.jpg?s=612x612&w=0&k=20&c=tiB7wbEzYeDtWjK2s9SjaNmZQId4otaZnnTl3tnIUnE=",
        ctaText: "Show",
        ctaLink: "",
        content: () => {
            return (
                <p>
                    Methane (CH₄) is a colorless, odorless gas released from natural sources and human activities such as agriculture, landfills, oil and gas production, and waste decomposition. While methane is not directly toxic at typical outdoor levels, it plays a major role in climate change by trapping heat in the atmosphere and contributing to the formation of ground-level ozone, which harms respiratory health. High concentrations in enclosed spaces can displace oxygen, creating safety risks, and reducing methane emissions is important for both air quality and climate protection.
                </p>
            );
        },
    },
];
