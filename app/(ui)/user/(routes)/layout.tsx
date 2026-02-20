import React from 'react'

import AuthSessionProviders from '@/providers/auth-session-provider';
import { Footer } from '@/components/aqi-ui/footer';
import { getAuthSession } from '@/auth';
import { ROLE } from '@/types/type';
import { redirect } from 'next/navigation';

const layout = async ({
    children
}: {
    children: React.ReactNode
}) => {

    const session = await getAuthSession();

    if (!session?.user && !(session?.user.role === ROLE.USER)) {
        redirect("/user/sign-in");
    }

    return (
        <>
            <AuthSessionProviders>
                {/* TODO :: Device Modal Provide Need to SetUp here */}
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
                <footer className="w-full md:w-[calc(100%_-_200px)] relative md:left-[200px]">
                    <Footer />
                </footer>


            </AuthSessionProviders >
        </>
    )
}

export default layout