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
            <VendorNavbar />
            <section className='bg-[#fafafa]/50'>
                <div className='mx-auto max-w-7xl'>
                    {children}
                </div>
            </section >
            <Footer />
        </>
    )
}

export default VendorLayout