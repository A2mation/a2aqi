import React from 'react'
import { getServerSession } from 'next-auth';

import AuthSessionProviders from '@/providers/auth-session-provider';


const layout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const session = await getServerSession();

    return (
        <>
            <AuthSessionProviders session={session}>
                <section className="relative w-full">
                    {children}
                </section>
            </AuthSessionProviders>
        </>
    )
}

export default layout