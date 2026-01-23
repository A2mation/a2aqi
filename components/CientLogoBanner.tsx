interface Logo {
    name: string
    src: string
}

interface ClientLogosProps {
    logos: Logo[]
}

export function ClientLogosBanner({ logos }: ClientLogosProps) {
    return (
        <section className="py-12 px-6 border-t border-border">
            <div className="container mx-auto">
                <h2 className="font-serif text-2xl md:text-5xl text-center mb-8 text-foreground/60">
                    <span className="border-b border-border">
                        Trusted By
                    </span>
                </h2>

                <div className="flex items-center justify-center gap-12 flex-wrap">
                    {logos.map((logo) => (
                        <div key={logo.name} className="flex items-center justify-center h-20">
                            <img
                                src={logo.src || "/placeholder.svg"}
                                alt={logo.name}
                                className="h-full w-auto"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
