import React from 'react'

const ContactusPage = () => {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="md:flex gap-x-24 clear-left md:mb-16 mb-10">
                    <div className=" md:mb-0 mb-4">
                        <h2 className="text-black font-manrope text-4xl font-semibold leading-10 mb-5 md:text-left text-center">Get In Touch</h2>
                        <p className="text-gray-600 text-lg font-normal leading-7 mb-7 md:text-left text-center">Whether you have a concern or simply want to say hello, We are here to facilitate communication with you.</p>
                        <div className="flex md:items-center md:justify-start justify-center">
                            <button className="w-36 h-12 rounded-full bg-blue-600 transition-all duration-700 hover:bg-blue-800 shadow text-white text-center text-base font-semibold leading-6">Contact Us</button>
                        </div>
                    </div>
                    <div className="border-l-2 md:border-blue-600 border-white px-10 py-6">
                        <div className="mb-8">
                            <h6 className="text-gray-500 text-sm font-medium leading-5 pb-3 md:text-start text-center">Email Address</h6>
                            <h3 className="text-black text-xl font-semibold leading-8 md:text-start text-center">a2mationsolution@gmail.com</h3>
                        </div>
                        <div>
                            <h6 className="text-gray-500 text-sm font-medium leading-5 pb-3 md:text-start text-center">Phone Number</h6>
                            <h3 className="text-black text-xl font-semibold leading-8 md:text-start text-center">7980630525</h3>
                        </div>
                    </div>
                </div>
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
                    <div className="h-96 relative flex justify-center">
                        <div className="w-full h-full absolute bg-gradient-to-t from-gray-800/50 to-gray-600/50"></div>
                        <img src="https://imgcld.yatra.com/ytimages/image/upload/t_yt_blog_w_800_c_fill_g_auto_q_auto:good_f_jpg/v1456139572/Delhi091.jpg" alt="New Delhi image" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 mb-6 text-center px-6">
                            <h5 className="text-white text-lg font-semibold leading-7 mb-2">New Delhi</h5>
                            {/* <p className="text-white text-base font-medium leading-6">Address</p> */}
                        </div>
                    </div>
                    <div className="h-96 relative flex justify-center">
                        <div className="w-full h-full absolute bg-gradient-to-t from-gray-800/50 to-gray-600/50"></div>
                        <img src="https://akm-img-a-in.tosshub.com/lingo/images/story/media_bank/202312/657bdd60d1fdd-taj-mumbai-150015589-16x9.png" alt="Mumbai image" className="w-full h-full  object-cover" />
                        <div className="absolute bottom-0 mb-6 text-center px-6">
                            <h5 className="text-white text-lg font-semibold leading-7 mb-2">Mumbai</h5>
                            {/* <p className="text-white text-base font-medium leading-6">Address</p> */}
                        </div>
                    </div>
                    <div className="h-96 relative flex justify-center">
                        <div className="w-full h-full absolute bg-gradient-to-t from-gray-800/50 to-gray-600/50"></div>
                        <img src="https://www.trodly.com/pictures/attraction/x1868.jpg.pagespeed.ic.ZWe86bWUER.jpg" alt="Kolkata image" className="w-full h-full  object-cover" />
                        <div className="absolute bottom-0 mb-6 text-center px-6">
                            <h5 className="text-white text-lg font-semibold leading-7 mb-2">Kolkata</h5>
                            {/* <p className="text-white text-base font-medium leading-6">Address</p> */}
                        </div>
                    </div>
                    <div className="h-96 relative flex justify-center">
                        <div className="w-full h-full absolute bg-gradient-to-t from-gray-800/50 to-gray-600/50"></div>
                        <img src="https://images.pexels.com/photos/12354645/pexels-photo-12354645.jpeg" alt="Hyderabad image" className="w-full h-full  object-cover" />
                        <div className="absolute bottom-0 mb-6 text-center px-6">
                            <h5 className="text-white text-lg font-semibold leading-7 mb-2">Hyderabad</h5>
                            {/* <p className="text-white text-base font-medium leading-6">987 Bahnhofstrasse, Zurich <br /> City Center, Zurich</p> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default ContactusPage
