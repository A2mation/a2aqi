import React from 'react'

import AuthSessionProviders from '@/providers/auth-session-provider';
import { Footer } from '@/components/aqi-ui/footer';
import { getAuthSession } from '@/auth';

import { ModalProvider } from '@/providers/device-store-provider';
import { redirect } from "next/navigation";

const layout = async ({
    children
}: {
    children: React.ReactNode
}) => {

    const session = await getAuthSession()

    if (!session?.user) {
        redirect("/user/sign-in")
    }

    return (
        <>
            <AuthSessionProviders>
                <ModalProvider />
                <main
                    style={{
                        ["--background" as any]: "oklch(0.98 0.005 264)",
                        ["--primary" as any]: "oklch(0.48 0.20 264)",
                    }}
                >
                    <section className='px-0 md:px-2'>
                        {children}
                    </section>
                </main>
                <footer className="w-full md:w-[calc(100%-200px)] relative md:left-50">
                    <Footer />
                </footer>


            </AuthSessionProviders >
        </>
    )
}

export default layout