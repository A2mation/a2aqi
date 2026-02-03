'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { ROLE } from '@/types/type'



export function Unauthorized({
    type
}: {
    type: ROLE
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="flex flex-col items-center justify-center gap-6 text-center max-w-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {`Access Denied`}
                    </h1>
                    <p className="text-base text-muted-foreground">
                        You don't have permission to access this resource. If you believe this is a mistake, please contact support.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
                    <Button asChild variant="outline" className="w-full sm:w-auto bg-transparent">
                        <Link href={
                            type === ROLE.ADMIN ? "/" : type === ROLE.WRITER ? '/blogs' : '/' 
                        }>Go Home</Link>
                    </Button>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href={
                            type === ROLE.ADMIN ? "/admin/sign-in" : type === ROLE.WRITER ? '/blogs/sign-in' : '/user/sing-in'
                        }>Return to Login</Link>
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground pt-2">
                    Error Code: 401 Unauthorized
                </p>
            </div>
        </div>
    )
}
