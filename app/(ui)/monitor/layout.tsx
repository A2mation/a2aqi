import { getAuthSession } from '@/auth'
import AuthSessionProviders from '@/providers/auth-session-provider'
import React from 'react'

const layout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const session = await getAuthSession()
    return (
        <>
            <AuthSessionProviders>

                <section className='bg-background'>
                    {children}
                </section>
            </AuthSessionProviders>
        </>
    )
}

export default layout