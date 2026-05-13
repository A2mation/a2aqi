'use client'

import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { LogOut, Plus, ChevronLeft } from 'lucide-react'

import { Button } from '../ui/button'

interface HeaderProps {
    setIsOpen: (val: boolean) => void;
}

const Header = ({ setIsOpen }: HeaderProps) => {
    const router = useRouter();
    const session = useSession();

    return (
        <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 py-4">
                {session?.data && (
                    <div className="mb-2 animate-in fade-in slide-in-from-top-1 duration-500">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0 text-center">
                            Welcome back,
                        </p>
                        <h1 className="text-2xl md:text-4xl text-center font-extrabold tracking-tighter text-slate-900 dark:text-slate-50">
                            {session.data.user.name}
                        </h1>
                    </div>
                )}
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
                            <div>
                                <h2 className="text-xl md:text-3xl flex flex-row items-center gap-2 font-bold text-foreground tracking-tight">
                                    Device Management
                                    
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                   Monitor and configure your sensor network
                                </p>
                            </div>
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