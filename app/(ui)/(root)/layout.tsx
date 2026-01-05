import React from 'react'
import { NavbarMain } from './components/Navbar'


const layout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    
    return (
        <>
            <section className="relative w-full">
                <NavbarMain />
                
                {children}
            </section>
        </>
    )
}

export default layout