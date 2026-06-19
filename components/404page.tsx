import Image from "next/image"
import Link from "next/link"

import { Button } from "./ui/button"

const NotFoundPage = () => {
    return (
        <section className="min-h-screen flex items-center px-6">
            <div className="mx-auto max-w-7xl w-full grid gap-12 md:grid-cols-2 items-center">

                {/* Image */}
                <div className="flex justify-center">
                    <Image
                        src="/assets/Scarecrow.png"
                        alt="404 Scarecrow"
                        width={300}
                        height={400}
                        priority
                        className="w-55 sm:w-70 md:w-[320px] h-auto"
                    />
                </div>

                {/* Content */}
                <div className="text-center md:text-left">
                    <h1 className="text-sm tracking-widest uppercase text-gray-500 mb-4">
                        404 Not Found
                    </h1>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                        I have bad news for you
                    </h2>

                    <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-md mx-auto md:mx-0">
                        The page you are looking for might be removed or is temporarily
                        unavailable.
                    </p>

                    <Link href="/" className="inline-block mt-8">
                        <Button className="px-6 py-3">
                            Back to homepage
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    )
}

export default NotFoundPage
