import React from 'react'

import { Footer } from '@/components/aqi-ui/footer'
import AuthSessionProviders from '@/providers/auth-session-provider'

const layout = async ({
    children
}: {
    children: React.ReactNode
}) => {

    return (
        <>
            <AuthSessionProviders>
                <section className='bg-background'>
                    {children}
                    <Footer/>
                </section>
            </AuthSessionProviders>
        </>
    )
}

export default layout