import Image from "next/image"

const Info = () => {
    return (
        <main className="w-full bg-gradient-to-b from-teal-50 to-teal-100 min-h-screen">
            {/* Section 1: Why care about PM */}
            <section className="px-4 md:px-8 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-teal-900 text-center mb-2">
                        Why you should care about
                    </h1>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-6 md:mb-8">
                        Particulate Matter (PM)?
                    </h2>

                    <p className="text-lg md:text-2xl text-teal-800 text-center leading-relaxed mb-8 md:mb-12">
                        Particulates are smaller, microscopic particles invisible to the naked eye. Thus, PM1 and PM2.5 can enter your bloodstream via respiration. Further, Short-term and long-term exposure to PM has a variety of health effects including various cardiorespiratory diseases. Hence, short-term impacts include irritation in the eyes, nose, and throat. And long-term impacts are permanent respiratory problems such as asthma and bronchitis, heart diseases, and heart failure.
                    </p>

                    {/* Health Impact Icons Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 justify-items-center">
                        <HealthImpactIcon
                            src="https://lh6.googleusercontent.com/proxy/7XNuYOJgwBUA_lUFjhI7mXW1GKkp0X9AETyHrTBy2ytNiLs9uCbA614Ebcx9zf0Krpht5tzR1VxCm8iVjOlSaeNkK95BwPd6P0puw1eNH9_CKINWIsHPTz97hC_a1iOUtw"
                            label="Irritation in the eyes"
                        />
                        <HealthImpactIcon
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKbi9VcYhwUeFiW1CDaJNmIf7HNM_lT8jZkg&s"
                            label="Irritation in the nose"
                        />
                        <HealthImpactIcon
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSle3Zw_O4fjlvoITZ4KwBDPNFmUa27T7hyRQ&s"
                            label="Irritation in the throat"
                        />
                        <HealthImpactIcon
                            src="https://www.hsmc.ae/wp-content/uploads/2020/02/allergy-asthma-image3.jpg"
                            label="Asthma Problem"
                        />
                        <HealthImpactIcon
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9niGpc_w4oHxM3hW0d1BtS-y2r8te_BNcqA&s"
                            label="Heart diseases and Heart failure"
                        />
                    </div>
                </div>
            </section>

            {/* Section 2: Can it make me sick */}
            <section className="px-4 md:px-8 py-8 md:py-12 border-t border-teal-200">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-4 md:mb-6">
                        Can it make me sick by PM?
                    </h3>

                    <p className="text-lg md:text-2xl text-teal-800 text-center leading-relaxed mb-6 md:mb-10">
                        Without a doubt, YES! Even in small amounts, particulate can make you feel uneasy or sick.
                    </p>


                </div>
            </section>

            {/* Section 3: Health Impacts */}
            <section className="px-4 md:px-8 py-8 md:py-12 border-t border-teal-200">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-900 text-center mb-6 md:mb-8">
                        Health Impacts of PM on Human Health
                    </h3>

                    <p className="text-lg md:text-2xl text-teal-800 text-center leading-relaxed">
                        The ability of a particle to evade the body&apos;s defences and enter the lungs deeply increases with particle size. But, people with respiratory and heart conditions, children, and the elderly may be more vulnerable to PM2.5. Furthermore, Long-term exposure to fine particulate matter may also be associated with increased cases of chronic bronchitis, impaired lung function, and an increase in mortality rates from cardiorespiratory disease, according to research.
                    </p>
                </div>
            </section>
        </main>
    )
}

export default Info


const HealthImpactIcon = ({ src, label }: { src: string; label: string }) => (
    <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 md:w-20 md:h-20 relative">
            <img src={src || "/placeholder.svg"} alt={label} width={200} height={200} className="object-contain" />
        </div>
        <p className="text-center text-sm md:text-lg font-medium text-teal-800 max-w-20">
            {label}
        </p>
    </div>
);