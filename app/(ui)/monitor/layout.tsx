import React from 'react'

const layout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <>
            <section className='px-0 md:px-2'>
                {children}
            </section>
        </>
    )
}

export default layout