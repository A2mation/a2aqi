import React from 'react'

import AuthSessionProviders from '@/providers/auth-session-provider';
import AdminNavbar from '@/components/admin-ui/admin-nav';


const layout = async ({
    children
}: {
    children: React.ReactNode
}) => {

    return (
        <>
            <AuthSessionProviders>
                <AdminNavbar />
                <section className="relative w-full max-w-7xl mx-auto">
                    {children}
                </section>
            </AuthSessionProviders>
        </>
    )
}

export default layout