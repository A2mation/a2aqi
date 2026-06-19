import React from 'react'

import { FloatingMarketingNav } from '@/components/FloatingMarketingNav'
import { PromoBannerModal } from '@/components/modals/promo-banner-modal'


const DashboardLayout = async ({
    children
}: { children: React.ReactNode }) => {

    return (
        <>
            <div className='py-0.5 mt-20 px-2 md:px-0'>
                {children}
            </div>
            <FloatingMarketingNav />
            <PromoBannerModal />
        </>

    )
}

export default DashboardLayout