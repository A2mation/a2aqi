import React from 'react'


const DashboardLayout = async ({
    children
}: { children: React.ReactNode }) => {

    return (
        <>
            <div className='max-w-7xl mx-auto mt-20 px-2 md:px-0'>
                {children}
            </div>
        </>

    )
}

export default DashboardLayout