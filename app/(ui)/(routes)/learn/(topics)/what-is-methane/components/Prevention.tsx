'use client'

import Image from 'next/image'

const Prevention = () => {
    const methods = [
        {
            id: 1,
            title: 'Ventilation',
            description: 'Increasing airflow in areas where methane is present can dilute the concentration and reduce the risk of poisoning.',
            image: '/assets/ventilation.jpg',
        },
        {
            id: 2,
            title: 'Detection',
            description: 'As by increasing airflow in areas where methane is present can dilute the concentration and reduce the risk of poisoning.',
            image: '/assets/detection.jpg',
        },
        {
            id: 3,
            title: 'Maintenance',
            description: 'Regular maintenance of equipment and infrastructure can reduce the risk of leaks and emissions.',
            image: '/assets/maintenance.jpg',
        },
        {
            id: 4,
            title: 'Training',
            description: 'Providing training to workers on how to recognize and respond to methane exposure can help prevent poisonings.',
            image: '/assets/training.jpg',
        },
        {
            id: 5,
            title: 'Regulations',
            description: 'Implementing and enforcing regulations on methane emissions can reduce the overall release of gas into the atmosphere.',
            image: '/assets/regulations.jpg',
        },
    ]

    return (
        <main className="min-h-screen max-w-7xl mx-auto bg-background">
            {/* Header Section */}
            <section className="bg-white px-6 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20">
                <div className="max-w-5xl">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance mb-4">
                        To{' '}
                        <span className="text-primary">reduce methane poisoning</span>
                        {' '}episodes,
                        <br className="hidden sm:block" /> some ways are:
                    </h1>
                </div>
            </section>

            {/* Methods Grid */}
            <section className="px-6 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20">
                <div className="max-w-7xl mx-auto">
                    {/* First Row - 2 items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
                        {methods.slice(0, 2).map((method) => (
                            <div key={method.id} className="flex flex-col">
                                <div className="relative h-48 sm:h-56 md:h-64 w-full mb-6 bg-muted rounded-lg overflow-hidden">
                                    <Image
                                        src={method.image || "/placeholder.svg"}
                                        alt={method.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                                    {method.title}
                                </h2>
                                <p className="text-base md:text-xl text-primary leading-relaxed">
                                    {method.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Second Row - 2 items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
                        {methods.slice(2, 4).map((method) => (
                            <div key={method.id} className="flex flex-col">
                                <div className="relative h-48 sm:h-56 md:h-64 w-full mb-6 bg-muted rounded-lg overflow-hidden">
                                    <Image
                                        src={method.image || "/placeholder.svg"}
                                        alt={method.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                                    {method.title}
                                </h2>
                                <p className="text-base text-primary leading-relaxed">
                                    {method.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Third Row - 1 item + Note */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="flex flex-col">
                            <div className="relative h-48 sm:h-56 md:h-64 w-full mb-6 bg-muted rounded-lg overflow-hidden">
                                <Image
                                    src={methods[4].image || "/placeholder.svg"}
                                    alt={methods[4].title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                                {methods[4].title}
                            </h2>
                            <p className="text-base text-primary leading-relaxed">
                                {methods[4].description}
                            </p>
                        </div>

                        {/* Note Section */}
                        <div className="flex items-center">
                            <div className="w-full bg-primary text-white rounded-lg p-6 md:p-8 lg:p-10">
                                <h3 className="text-xl md:text-2xl font-bold mb-4">Note:</h3>
                                <p className="text-sm md:text-base leading-relaxed">
                                    This list is not exhaustive and the best course of action may depend on the specific circumstances and location of the potential exposure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Prevention
