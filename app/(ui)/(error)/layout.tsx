import React from 'react'
import { Footer } from '@/components/aqi-ui/footer'


const layout = async ({
    children
}: {
    children: React.ReactNode
}) => {

    return (
        <>
            <section>
                {children}
            </section>
            <Footer />
        </>
    )
}

export default layout