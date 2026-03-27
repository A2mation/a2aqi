import { Mail, Phone, MapPin, UserCheck, Map } from 'lucide-react';

const ContactusPage = () => {
    return (
        <section className="py-24 min-h-screen flex items-center justify-center bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left Column: Content & Direct Contact */}
                    <div>
                        <h2 className="text-blue-600 font-manrope text-sm font-bold uppercase tracking-wider mb-4">
                            Get In Touch
                        </h2>
                        <h1 className="text-slate-900 font-manrope text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                            Let's build something <br /> great together.
                        </h1>
                        <p className="text-slate-600 text-lg font-normal leading-7 mb-10 max-w-xl">
                            Have questions about our air quality monitoring solutions? Our team is ready to help you navigate your environmental data needs.
                        </p>

                        <div className="space-y-8">
                            {/* Sales Manager Contact */}
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                    <UserCheck size={24} />
                                </div>
                                <div>
                                    <h4 className="text-slate-900 font-semibold text-lg">Sales Manager</h4>
                                    <p className="text-blue-600 font-medium">Reply within 24 hours</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="text-slate-900 font-semibold text-lg">Email Us</h4>
                                    <p className="text-slate-600">a2mationsolution@gmail.com</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex gap-4 items-start">
                                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-slate-900 font-semibold text-lg">Call Us</h4>
                                    <p className="text-slate-600">+91 8777353002, +91 7980264700</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Address & Map Mockup */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-blue-100/50 rounded-3xl -z-10 group-hover:bg-blue-100 transition-colors duration-500"></div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100">
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="text-blue-600" size={20} />
                                    <span className="text-slate-500 font-medium uppercase tracking-widest text-xs">Registered Office</span>
                                </div>
                                <h3 className="text-slate-900 text-2xl font-bold leading-snug">
                                    129/1, Sodla Tank Road,<br />
                                    North 24 Parganas, <br />
                                    West Bengal, Kolkata- 743133
                                </h3>
                            </div>

                            {/* Visual Element: Image of Kolkata (Victoria Memorial or similar) */}
                            <div className="h-64 w-full rounded-xl overflow-hidden relative">
                                <img
                                    src="https://www.trodly.com/pictures/attraction/x1868.jpg.pagespeed.ic.ZWe86bWUER.jpg"
                                    alt="Kolkata HQ"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent flex items-end p-6">
                                    <p className="text-white font-medium">Serving clients across India</p>
                                </div>
                            </div>

                            <a
                                href="https://www.google.com/maps/search/?api=1&query=A2MATION+TECHNOLOGY+SOLUTION+Kolkata&query_place_id=ChIJQ1DfFA6R-DkRfbnEwQZ1kns"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                            >
                                <Map size={20} />
                                Find us on Google Maps
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ContactusPage;