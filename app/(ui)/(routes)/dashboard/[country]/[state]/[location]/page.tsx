'use client'
import { use } from 'react'

const LocationPage = ({
    params,
}: {
    params: Promise<{ country: string, state: string, location: string }>
}) => {
    const { location, state, country } = use(params)
    console.log(location, state, country)

    return (
        <div className='text-red-500 flex items-center justify-center text-7xl'>
            <p>{location} {state} {country}</p>
        </div>
    )
}

export default LocationPage
