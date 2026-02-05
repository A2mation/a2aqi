import React from 'react'

import AuthSessionProviders from '@/providers/auth-session-provider';
import { NavbarMain } from "@/app/(ui)/(root)/components/Navbar";
import { Footer } from '@/components/aqi-ui/footer';


const layout = async ({
    children
}: {
    children: React.ReactNode
}) => {

    return (
        <>
            <AuthSessionProviders>
                <NavbarMain />
                <section className="relative w-full">
                    {children}
                </section>
                <Footer/>
            </AuthSessionProviders>
        </>
    )
}

export default layout