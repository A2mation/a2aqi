import React from 'react'

const Precaution = () => {
    return (
        <section className='max-w-7xl mx-auto'>
            <main className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <h1 className="text-center text-2xl sm:text-xl lg:text-5xl font-bold mb-12 text-slate-900">
                        How you can <span className="text-orange-500">save yourself</span> from pollen?
                    </h1>

                    {/* Tips Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                        {/* Tip 1: Limit Outdoors */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-full max-w-xs h-48 sm:h-56 mb-6 flex items-center justify-center">
                                <img
                                    src="https://img.freepik.com/free-vector/people-staying-indoors-because-pandemic-curfew_23-2148515252.jpg"
                                    width={400}
                                    height={200}
                                    alt=""
                                />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Limit outdoors</h2>
                            <p className="text-2xl text-slate-600 leading-relaxed">
                                If you suffer from pollen allergies, limit your outdoor activities when the count is high. This generally
                                happens between 5 and 10 am. Other than that, spring months contain the highest count throughout the year.
                            </p>
                        </div>

                        {/* Tip 2: Bath and Change Clothes */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-full max-w-xs h-48 sm:h-56 mb-6 flex items-center justify-center">
                                <img
                                    src="https://i.guim.co.uk/img/media/d97b6651fe5ac0b27b09d3aabaa3fbd9d1d4e719/0_0_2100_1680/master/2100.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=439cd9f90e9319fa2f26dcad3586a9fd"
                                    width={400}
                                    height={200}
                                    alt=""
                                />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Take a bath and change your clothes</h2>
                            <p className="text-2xl text-slate-600 leading-relaxed">
                                When you come from outside, take a bath to wash off any pollen on your body. A fresh set of clothes will
                                further help in reducing the allergy episodes.
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="col-span-1 md:col-span-2 border-t border-slate-200 my-4"></div>

                        {/* Tip 3: Consult a Doctor */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-full max-w-xs h-48 sm:h-56 mb-6 bg-blue-600 rounded-lg flex items-center justify-center">
                                <img
                                    src="https://img.freepik.com/free-vector/hospital-service-concept-flat-illustration_1150-50287.jpg?semt=ais_hybrid&w=740&q=80"
                                    width={400}
                                    height={200}
                                    alt=""
                                />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Consult a doctor</h2>
                            <p className="text-2xl text-slate-600 leading-relaxed">
                                When you experience any symptoms, contact and consult a doctor to prevent any life-threatening allergy
                                attacks.
                            </p>
                        </div>

                        {/* Tip 4: Proper Medication */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-full max-w-xs h-48 sm:h-56 mb-6 flex items-center justify-center">
                                <img
                                    src="https://cdn.vectorstock.com/i/500p/19/93/man-takes-medicine-pills-in-mouth-eating-vector-31171993.jpg"
                                    width={400}
                                    height={200}
                                    alt=""
                                />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Take proper medication</h2>
                            <p className="text-2xl text-slate-600 leading-relaxed">
                                If you already have allergy asthma, take proper medication as prescribed by your doctor to avoid any
                                unforeseen circumstances.
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="col-span-1 md:col-span-2 border-t border-slate-200 my-4"></div>

                        {/* Tip 5: Windows Closed */}
                        <div className="col-span-1 md:col-span-2 flex flex-col items-center text-center max-w-2xl mx-auto">
                            <div className="w-full max-w-xs h-48 sm:h-56 mb-6 flex items-center justify-center">
                                <img
                                    src="https://img.freepik.com/free-vector/coronavirus-curfew-concept-illustration_23-2148792816.jpg?semt=ais_hybrid&w=740&q=80"
                                    width={400}
                                    height={200}
                                    alt=""
                                />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Windows closed during pollen season</h2>
                            <p className="text-2xl text-slate-600 leading-relaxed">
                                Keep your windows and doors closed around the pollen season when pollen levels are at their highest in the
                                air. Since it can enter your home through open windows and doors, it is important to keep them shut during
                                high pollen allergy season.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </section>
    )
}

export default Precaution
