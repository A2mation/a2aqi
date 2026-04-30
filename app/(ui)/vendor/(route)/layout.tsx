import React from 'react'
import { VendorNavbar } from './components/Navbar';
import { Footer } from '@/components/aqi-ui/footer'

const VendorLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {

    return (
        <>
            <section>
                <VendorNavbar />
                {children}
                <Footer />
            </section >
        </>
    )
}

export default VendorLayout