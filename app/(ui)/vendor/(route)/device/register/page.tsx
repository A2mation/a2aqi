'use client'

import { AlertCircle, ChevronLeft, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

import Heading from '@/components/ui/Heading';
import { Separator } from '@/components/ui/separator';
import { DeviceForm } from './components/vendor-device-register-form';
import { Button } from '@/components/ui/button';


const VendorDeviceRegistrationPage = () => {
    const router = useRouter()
    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 max-w-7xl mx-auto h-screen">

            <div className="flex items-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="flex items-center cursor-pointer gap-1 text-muted-foreground hover:text-primary transition-colors -ml-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </Button>
            </div>

            <div className='px-3'>
                <div className="flex items-start justify-between">
                    <Heading
                        title="Register New Device"
                        description="Add a new device to the inventory. Serial Number and API Keys will be generated automatically upon submission."
                    />
                </div>

                <Separator className='my-5' />


                <DeviceForm />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 border border-blue-200 bg-blue-50 rounded-lg flex items-start gap-3"
            >
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                    <h3 className="text-sm font-semibold text-blue-800">Registration Info</h3>
                    <p className="text-sm text-blue-700">
                        Upon successful submission, the <strong>Device ID and API Key</strong> will be sent
                        to your <strong>registered email address</strong>. Please ensure your inbox is
                        accessible to complete the setup.
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 border border-red-200 bg-red-50 rounded-lg flex items-start gap-3"
            >
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                    <h3 className="text-sm font-semibold text-red-800">Important Note</h3>
                    <p className="text-sm text-red-700">
                        Please double-check all information before submitting. As a vendor,
                        <strong> you cannot edit or delete device details</strong> once the account has been created.
                        Any corrections will require administrative intervention.
                    </p>
                </div>
            </motion.div>

        </div>
    );
};

export default VendorDeviceRegistrationPage;