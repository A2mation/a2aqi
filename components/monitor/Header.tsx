'use client'

import { signOut } from 'next-auth/react'
import { LogOut, Plus } from 'lucide-react'

import Heading from '../ui/Heading'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Button } from '../ui/button'

const Header = (
    {
        setIsOpen,
        isDarkMode,
        setIsDarkMode
    }: {
        setIsOpen: (val: boolean) => void,
        isDarkMode: boolean,
        setIsDarkMode: (val: boolean) => void
    }
) => {

    return (
        <div className="border-b bg-card shrink-0">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Heading
                            title="Device Management"
                            description="Monitor and configure your sensor network"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 mr-4">
                            <Label htmlFor="dark-mode" className="text-xs text-foreground">{isDarkMode ? `Dark Mode` : 'Light Mode'}</Label>
                            <Switch id="dark-mode" className='cursor-pointer' checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                        </div>
                        <Button size="sm" className="gap-2 cursor-pointer" onClick={() => setIsOpen(true)}>
                            <Plus className="h-4 w-4" /> Register Device
                        </Button>

                        <Button size="sm" variant={'destructive'} className="gap-2 cursor-pointer" onClick={() => signOut()}>
                            <LogOut className="h-4 w-4" /> Log out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
