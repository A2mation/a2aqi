export function ClientLogos() {
    const logos = [
        { name: "logoipsum-254", src: "/assets/partner-company-logo/rgkar.svg" },
        { name: "logoipsum-257", src: "/assets/partner-company-logo/Medical_College_Bengal_Logo.svg" },
        { name: "logoipsum-251", src: "/assets/partner-company-logo/mkcg.png" },
        { name: "logoipsum-242", src: "/assets/partner-company-logo/manipur.jpg" },
        { name: "logoipsum-258", src: "/assets/partner-company-logo/bangur.jpg" },
    ]

    return (
        <section className="py-12 px-6 border-t border-border">
            <div className="container mx-auto">
                <h2 className="font-serif text-2xl md:text-3xl text-center mb-8 text-foreground/60">Trusted By</h2>
                <div className="flex items-center justify-center gap-12 flex-wrap opacity-40 grayscale">
                    {logos.map((logo) => (
                        <div key={logo.name} className="flex items-center justify-center h-20">
                            <img src={logo.src || "/placeholder.svg"} alt={logo.name} className="h-full w-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
