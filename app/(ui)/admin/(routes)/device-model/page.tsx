import React from 'react'
import { DeviceModelClient } from './components/client'
import { DeviceModelColumn } from './components/columns'

export const dummyDeviceModelColumns: DeviceModelColumn[] = [
    {
        id: "dev-001",
        name: "iPhone 14 Pro",
        createdAt: "2024-01-10T08:30:00.000Z",
    },
    {
        id: "dev-002",
        name: "Samsung Galaxy S23",
        createdAt: "2024-02-05T14:12:00.000Z",
    },
    {
        id: "dev-003",
        name: "Google Pixel 8",
        createdAt: "2024-03-18T09:45:00.000Z",
    },
    {
        id: "dev-004",
        name: "OnePlus 11",
        createdAt: "2024-04-02T18:20:00.000Z",
    },
    {
        id: "dev-005",
        name: "Xiaomi Mi 13",
        createdAt: "2024-05-11T11:05:00.000Z",
    },
];



const DeviceModelPage = () => {
    return (
        <section className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <DeviceModelClient data={dummyDeviceModelColumns} />
            </div>
        </section>
    )
}

export default DeviceModelPage
