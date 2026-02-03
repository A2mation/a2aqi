import React from 'react'
import { NavbarMain } from './components/Navbar'


const layout = async ({
    children
}: {
    children: React.ReactNode
}) => {

    return (
        <>
            <NavbarMain />
            <section className="relative w-full">
                {children}
            </section>
        </>
    )
}

export default layout