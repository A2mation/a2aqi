import React from 'react'

interface MethanSource {
    id: string
    title: string
    description: string
    icon: string
}

const MethaneSourceCard = ({ title, description, icon }: Omit<MethanSource, 'id'>) => (
    <div className="flex flex-col items-center text-center">
        <div className="mb-4 h-24 w-24 flex items-center justify-center">
            <img
                src={icon}
                alt="Icons"
                width={200}
                height={200}
            />
        </div>
        <h3 className="mb-3 text-2xl font-semibold text-blue-600">{title}</h3>
        <p className="text-gray-600 text-base md:text-xl leading-relaxed">{description}</p>
    </div>
)


const Source = () => {
    const sources: MethanSource[] = [
        {
            id: 'industrial',
            title: 'Industrial processes',
            description:
                'Methane is produced during the production of some industrial chemicals. Moreover, it is also used as fuel in various industrial processes.',
            icon: "https://eponline.com/-/media/ENV/eponline/Images/2023/08,-d-,17,-d-,23pollution.jpg",
        },
        {
            id: 'biomass',
            title: 'Biomass burning',
            description:
                'Methane produces when organic matter is burned. Such as during forest fires or the burning of crops.',
            icon: "https://fl-i.thgim.com/public/incoming/of3tmw/article69174702.ece/alternates/FREE_1200/stubble%20burning.jpg",
        },
        {
            id: 'landfills',
            title: 'Landfills',
            description:
                'Landfills are a major source of methane emissions. Because organic waste in the landfill breaks down and produces methane gas',
            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdt9Q82xeidYwPMEYA61Zf6VkGSss6NiqsDQ&s",
        },
        {
            id: 'manure',
            title: 'Manure Production',
            description:
                'Digestive processes of livestock produce CH4. Further manure decomposition results in methane gas in the soil.',
            icon: "https://grist.org/wp-content/uploads/2015/09/steamingmanure.jpg",
        },
        {
            id: 'energy',
            title: 'Energy Production',
            description:
                'Methane is a byproduct of coal mining. It is also produced during the extraction of oil and natural gas.',
            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1ebtm5xfW0nOHcVJ-vrgY071YjgfjT0OtwQ&s",
        },
        {
            id: 'wastewater',
            title: 'Waste Water Treatment',
            description:
                'Methane is produced during the treatment of wastewater in sewage treatment plants.',
            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjm0xLgpjFLMlDPxNz76rKaXcRHB02QQV6aA&s",
        },
    ]

    return (
        <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                        Sources of <span className="text-blue-600">Methane (CH4)</span>
                    </h1>
                    <div className="mt-4 sm:mt-6 h-1 w-16 bg-gray-300 rounded"></div>
                </div>

                {/* Intro Text */}
                <p className="mb-12 sm:mb-16 text-base sm:text-xl text-blue-600 leading-relaxed max-w-3xl">
                    Methane (CH4) occurs naturally and produce by a variety of sources. Some of the sources of methane gas are as follows:
                </p>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
                    {sources.map((source) => (
                        <MethaneSourceCard
                            key={source.id}
                            title={source.title}
                            description={source.description}
                            icon={source.icon}
                        />
                    ))}
                </div>
            </div>
            <div className='bg-blue-400 rounded-2xl mb-10 mt-10'>
                <div className='mx-auto max-w-6xl'>
                    <div className='flex justify-between items-center flex-col md:flex-row p-4 '>
                        <div className='text-base md:text-xl text-white'>
                            Thus, Its important to note that while some sources of methane are natural and unavoidable. Besides, many human activities contribute to the release of methane into the atmosphere,
                        </div>
                        <img
                            src="https://img.freepik.com/premium-vector/pollution-earth-with-dirty-smoke-from-factory-buildings_1639-11884.jpg?semt=ais_hybrid&w=740&q=80"
                            alt=""
                            height={200}
                            width={200}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Source
