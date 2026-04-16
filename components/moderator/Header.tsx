'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

import { Button } from '../ui/button'
import { NavbarLogo } from '../ui/resizable-navbar'

const ModeratorHeader = () => {

    return (
        <div className="border-b bg-card shrink-0">
            <div className="max-w-7xl mx-auto px-6 py-2">
                <div className="flex flex-row md:items-center justify-between gap-4">
                    <div className='mt-4'>
                        <NavbarLogo />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Button size="sm" variant={'destructive'} className="gap-2 cursor-pointer" onClick={() => signOut()}>
                            <LogOut className="h-4 w-4" /> Log out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModeratorHeader
