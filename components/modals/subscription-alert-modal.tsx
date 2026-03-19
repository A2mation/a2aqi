"use client"

import { useEffect, useState } from 'react'
import { Modal } from '../ui/modal'
import { Button, buttonVariants } from '../ui/button'
import { Crown, Lock } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'

interface SubscriptionModalProps {
    isOpen: boolean
    onClose: () => void
    loading?: boolean
}

export const SubscriptionModal = ({
    isOpen,
    onClose,
    loading
}: SubscriptionModalProps) => {
    const { deviceId } = useParams();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) return null;

    const onUpgrade = () => {
        // Add your Stripe or payment redirect logic here
        window.location.assign('/pricing');
    };

    return (
        <Modal
            title="Subscription Required"
            description="This device is currently inactive. Please upgrade your plan to access real-time AQI analytics and reporting."
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className='flex flex-col items-center justify-center space-y-4 py-4'>
                <div className='p-4 bg-primary/10 rounded-full'>
                    <Crown className="w-10 h-10 text-primary" />
                </div>

                <div className='pt-6 space-y-2 flex flex-col items-center justify-center w-full'>
                    <Button
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={onUpgrade}
                    >
                        View Pricing Plans
                    </Button>
                    <Link
                        href={`/user/${deviceId}/devices`}
                        onClick={onClose}
                        className={
                            cn(
                                buttonVariants({
                                    variant: 'link'
                                })
                            )
                        }
                    >
                        Go to Devices
                    </Link>
                </div>
            </div>
        </Modal>
    )
}