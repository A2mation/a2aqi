import React from 'react'
import { DeviceClient } from './components/client'
import { DeviceColumn } from './components/columns'

export const dummyDevices: DeviceColumn[] = [
    {
        id: "device-001",
        name: "Office Phone A",
        serialNo: "SN-AX92K-001",
        model: "iPhone 14 Pro",
        createdAt: "2024-01-15T10:20:00.000Z",
    },
    {
        id: "device-002",
        name: "Warehouse Tablet",
        serialNo: "SN-WH77T-002",
        model: "Samsung Galaxy Tab S8",
        createdAt: "2024-02-03T08:45:00.000Z",
    },
    {
        id: "device-003",
        name: "Reception Phone",
        serialNo: "SN-RC33P-003",
        model: "Google Pixel 8",
        createdAt: "2024-03-12T13:30:00.000Z",
    },
    {
        id: "device-004",
        name: "Manager Laptop",
        serialNo: "SN-MG55L-004",
        model: "MacBook Pro M2",
        createdAt: "2024-04-01T16:10:00.000Z",
    },
    {
        id: "device-005",
        name: "Testing Device",
        serialNo: "SN-TS11X-005",
        model: "OnePlus 11",
        createdAt: "2024-05-20T09:00:00.000Z",
    },
];



const DevicePage = () => {
    return (
        <section className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <DeviceClient data={dummyDevices} />
            </div>
        </section>
    )
}

export default DevicePage
