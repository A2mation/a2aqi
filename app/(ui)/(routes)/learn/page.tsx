"use client";

import { AlertTriangle, Beaker, Car, Cloud, Droplets, Factory, Flame, FlaskConical, Flower, Leaf, Radiation, Skull, Sun, Volume2, Wind } from "lucide-react";
import { useRouter } from "next/navigation";

import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function LearnAirQualityPage() {
    const router = useRouter();
    return (
        <>
            <section className="max-w-7xl mx-auto my-10">
                <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
                    <GridItem
                        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                        icon={<Wind className="h-4 w-4 text-black dark:text-neutral-400" fill="#60CDEB" />}
                        title="What is Air Pollution?"
                        description="Learn what air pollution is, its causes, and how it affects health and the environment."
                        gradient="radial-gradient(circle at top left, #1E4F5F, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-air-pollution')}
                    />

                    <GridItem
                        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                        icon={<FlaskConical className="h-4 w-4 text-black dark:text-neutral-400" fill="#7C83FD" />}
                        title="What is Ammonia (NH₃)?"
                        description="Understand ammonia as an air pollutant, its sources, and potential health impacts."
                        gradient="radial-gradient(circle at top right, #2F2E7A, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-ammonia')}
                    />

                    <GridItem
                        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                        icon={<Skull className="h-4 w-4 text-black dark:text-neutral-400" fill="#E3F51D" />}
                        title="What is Hydrogen Sulfide (H₂S)?"
                        description="Explore what H₂S is, where it comes from, and why it can be harmful."
                        gradient="radial-gradient(circle at bottom left, #5C6400, transparent 65%)"
                        onTitleClick={()=> router.push('/learn/what-is-hydrogen-sulfide')}
                    />

                    <GridItem
                        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                        icon={<Radiation className="h-4 w-4 text-black dark:text-neutral-400" fill="#7A5AF8" />}
                        title="What is Radon?"
                        description="Learn about radon gas, how it enters indoor spaces, and associated health risks."
                        gradient="radial-gradient(circle at top right, #3F2A7A, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-radon')}
                    />

                    <GridItem
                        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                        icon={<AlertTriangle className="h-4 w-4 text-black dark:text-neutral-400" fill="#F97316" />}
                        title="What is Carbon Monoxide (CO)?"
                        description="Discover what CO is, common sources, and why it is considered dangerous."
                        gradient="radial-gradient(circle at top left, #7A2E14, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-carbon-monoxide')}
                    />
                </ul>

                <ul className="grid grid-cols-1 grid-rows-none gap-4 mt-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
                    <GridItem
                        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                        icon={<Factory className="h-4 w-4 text-black dark:text-neutral-400" fill="#6B7280" />}
                        title="What is Sulfur Dioxide (SO₂)?"
                        description="Understand sulfur dioxide emissions and their effects on air quality."
                        gradient="radial-gradient(circle at top left, #374151, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-sulfur-dioxide')}
                    />

                    <GridItem
                        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                        icon={<Sun className="h-4 w-4 text-black dark:text-neutral-400" fill="#FACC15" />}
                        title="What is Ozone (O₃)?"
                        description="Learn how ozone forms and how it impacts health at ground level."
                        gradient="radial-gradient(circle at top right, #7C5E10, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-ozone')}
                    />

                    <GridItem
                        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                        icon={<Volume2 className="h-4 w-4 text-black dark:text-neutral-400" fill="#38BDF8" />}
                        title="What is Noise Pollution?"
                        description="Explore how excessive noise affects health and overall well-being."
                        gradient="radial-gradient(circle at top left, #164E63, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-noise-pollution')}
                    />

                    <GridItem
                        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                        icon={<Flame className="h-4 w-4 text-black dark:text-neutral-400" fill="#EF4444" />}
                        title="What is Methane (CH₄)?"
                        description="Understand methane emissions and their role in air quality and climate change."
                        gradient="radial-gradient(circle at top right, #7F1D1D, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-methane')}
                    />

                    <GridItem
                        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                        icon={<Cloud className="h-4 w-4 text-black dark:text-neutral-400" fill="#94A3B8" />}
                        title="What are PM2.5 and PM10?"
                        description="Learn about fine particulate matter and why it poses serious health risks."
                        gradient="radial-gradient(circle at top left, #334155, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-particulate-matter-pm')}
                    />
                </ul>

                <ul className="grid grid-cols-1 grid-rows-none gap-4 mt-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
                    <GridItem
                        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                        icon={<Leaf className="h-4 w-4 text-black dark:text-neutral-400" fill="#22C55E" />}
                        title="What is Carbon Dioxide (CO₂)?"
                        description="Understand CO₂ levels, sources, and their impact on indoor air quality."
                        gradient="radial-gradient(circle at top left, #334155, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-carbon-dioxide')}
                    />

                    <GridItem
                        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                        icon={<Droplets className="h-4 w-4 text-black dark:text-neutral-400" fill="#0EA5E9" />}
                        title="What is Humidity?"
                        description="Learn how humidity affects comfort, health, and indoor environments."
                        gradient="radial-gradient(circle at top right, #0C4A6E, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-humidity')}
                    />

                    <GridItem
                        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                        icon={<Flower className="h-4 w-4 text-black dark:text-neutral-400" fill="#EC4899" />}
                        title="What is Pollen?"
                        description="Explore pollen as an allergen and its impact on respiratory health."
                        gradient="radial-gradient(circle at bottom left, #831843, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-pollen')}
                    />

                    <GridItem
                        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                        icon={<Beaker className="h-4 w-4 text-black dark:text-neutral-400" fill="#6366F1" />}
                        title="What are VOCs?"
                        description="Understand volatile organic compounds and their effects on indoor air quality."
                        gradient="radial-gradient(circle at top right, #312E81, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-voc')}
                    />

                    <GridItem
                        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                        icon={<Car className="h-4 w-4 text-black dark:text-neutral-400" fill="#64748B" />}
                        title="What is Nitrogen Dioxide (NO₂)?"
                        description="Learn about NO₂ pollution, its sources, and health implications."
                        gradient="radial-gradient(circle at top left, #1F2937, transparent 60%)"
                        onTitleClick={()=> router.push('/learn/what-is-nitrogen-dioxide')}
                    />
                </ul>
            </section>


        </>
    );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
    gradient?: string;
    onTitleClick?: () => void;
}

const GridItem = ({ area, icon, title, description, gradient, onTitleClick }: GridItemProps) => {
    return (
        <li className={`min-h-[14rem] list-none ${area}`}>
            <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                    blur={0}
                    borderWidth={3}
                    spread={80}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                />

                {/* Gradient layer */}
                <div
                    className="absolute inset-0 rounded-xl opacity-[0.06]"
                    style={{ background: gradient }}
                />

                <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="w-fit rounded-lg border border-gray-600 p-2">
                            {icon}
                        </div>

                        <div className="space-y-3">
                            <h3
                                className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white hover:underline hover:cursor-pointer"
                                onClick={onTitleClick}
                            >
                                {title}
                            </h3>
                            <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400">
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

