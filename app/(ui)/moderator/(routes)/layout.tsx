import React from 'react'

import { Footer } from '@/components/aqi-ui/footer'
import AuthSessionProviders from '@/providers/auth-session-provider'
import ModeratorHeader from '@/components/moderator/Header'

const Layout = async ({
    children
}: {
    children: React.ReactNode
}) => {

    return (
        <>
            <AuthSessionProviders>
                <ModeratorHeader />
                <section className='bg-background'>
                    {children}
                    <Footer />
                </section>
            </AuthSessionProviders>
        </>
    )
}

export default Layout