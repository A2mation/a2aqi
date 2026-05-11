'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LogOut, Plus, ChevronLeft } from 'lucide-react'

import Heading from '../ui/Heading'
import { Button } from '../ui/button'

interface HeaderProps {
    setIsOpen: (val: boolean) => void;
}

const Header = ({ setIsOpen }: HeaderProps) => {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 py-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-start gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mt-1 h-9 w-9 shrink-0 rounded-full border bg-background hover:bg-accent"
                            onClick={() => router.back()}
                        >
                            <ChevronLeft className="h-5 w-5" />
                            <span className="sr-only">Back</span>
                        </Button>

                        <div className="space-y-1">
                            <Heading
                                title="Device Management"
                                description="Monitor and configure your sensor network"
                            />
                        </div>
                    </div>

                    {/* Right Section: Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 ml-auto md:ml-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex gap-2 transition-all hover:shadow-md"
                            onClick={() => setIsOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            <span>Register Device</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="flex sm:hidden h-9 w-9"
                            onClick={() => setIsOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>

                        <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

                        <Button
                            size="sm"
                            variant="destructive"
                            className="gap-2 shadow-sm transition-all hover:shadow-destructive/20"
                            onClick={() => signOut()}
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden xs:inline">Log out</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header