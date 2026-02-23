import React from 'react'

const layout = async ({
    children
}: {
    children: React.ReactNode
}) => {

    

    return (
        <>
          
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


            
        </>
    )
}

export default layout