'use client'

const Source = () => {
    return (
        <section>
            <div className="w-full py-8 md:py-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-12 text-center">
                        <h1 className="mb-4 text-balance text-3xl font-bold text-slate-900 md:text-4xl lg:text-5xl">
                            Where does CO come from?
                        </h1>
                        <p className="mx-auto max-w-3xl text-sm text-slate-600 md:text-base">
                            Carbon monoxide (CO) is a dangerous toxic gas and poisonous element. Because it can be released through
                            various anthropogenic sources but CO can exist in the natural environment as well.
                        </p>
                    </div>

                    {/* Natural Sources Section */}
                    <div className="mb-16">
                        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 md:text-3xl">Natural Sources:</h2>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {naturalSources.map((source) => (
                                <SourceCard key={source.id} source={source} />
                            ))}
                        </div>
                    </div>

                    {/* Manmade Sources Section */}
                    <div>
                        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 md:text-3xl">Manmade Sources:</h2>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {manmadeSources.map((source) => (
                                <SourceCard key={source.id} source={source} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Source



function SourceCard({ source }: { source: SourceItem }) {
    return (
        <div className="flex flex-col items-center rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 text-5xl">{source.icon}</div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">{source.title}</h3>
            <p className="text-sm text-slate-600">{source.description}</p>
        </div>
    )
}

interface SourceItem {
    id: number
    title: string
    description: string
    icon: string
}

const naturalSources: SourceItem[] = [
    {
        id: 1,
        title: "Volcanic eruption",
        description: "CO released from volcanic activities",
        icon: "🌋",
    },
    {
        id: 2,
        title: "Forest fires",
        description: "CO emitted from burning vegetation",
        icon: "🔥",
    },
    {
        id: 3,
        title: "Natural gases",
        description: "Natural gases released from coal mines",
        icon: "⛏️",
    },
]

const manmadeSources: SourceItem[] = [
    {
        id: 4,
        title: "Combustion by vehicles",
        description: "Commercial vehicles, airplanes, tractors, trucks, and automobiles",
        icon: "🚗",
    },
    {
        id: 5,
        title: "Industries",
        description: "Industries working at high temperatures and using carbon compounds as raw products",
        icon: "🏭",
    },
    {
        id: 6,
        title: "Metal Manufacturing",
        description: "Metal production and processing facilities",
        icon: "⚙️",
    },
    {
        id: 7,
        title: "Electricity supply",
        description: "Power generation and distribution",
        icon: "⚡",
    },
    {
        id: 8,
        title: "Smoking",
        description: "Cigarette and tobacco combustion",
        icon: "🚬",
    },
    {
        id: 9,
        title: "Burning waste",
        description: "Waste incineration and burning",
        icon: "🔥",
    },
    {
        id: 10,
        title: "Power plants",
        description: "Fossil fuel power generation",
        icon: "🏢",
    },
    {
        id: 11,
        title: "Gas extraction",
        description: "Extraction of gas from sea oil and land",
        icon: "🛢️",
    },
]