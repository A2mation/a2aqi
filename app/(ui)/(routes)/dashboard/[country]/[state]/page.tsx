'use client'
import { use } from 'react'

const StatePage = ({
    params,
}: {
    params: Promise<{ country: string, state: string }>
}) => {
    const { state } = use(params)
    console.log(state)
    

    return (
        <div className='text-red-500 flex items-center justify-center text-7xl'>
            <p>{state}</p>
        </div>
    )
}

export default StatePage
