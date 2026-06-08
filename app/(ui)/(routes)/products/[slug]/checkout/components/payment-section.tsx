
import { motion } from 'framer-motion'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, MapPin, ShieldCheck } from 'lucide-react'
import { AddressFormValues } from './address-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const PaymentSection = ({
    quantity,
    product,
    savedAddress,
    setStep,
}: {
    quantity: number
    product: {
        title: string
        subtitle: string
        basePrice: number
        delivery: string
        image: string
    }
    savedAddress: AddressFormValues,
    setStep: (v: number) => void,
}) => {

    const computedTotal = product.basePrice * quantity


    const handlePaymentSubmit = () => {
        alert(`Redirecting to payment gateway to process order for ${quantity} unit(s)...`)
    }

    return (
        <>
            <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <Card className="border-slate-200/80 shadow-md bg-white rounded-xl">
                    <CardHeader className="border-b border-slate-100 pb-4 relative">
                        <div className="flex items-center space-x-2 text-slate-800">
                            <CreditCard className="w-5 h-5 text-emerald-500" />
                            <CardTitle className="text-xl font-bold">Select Secure Gateway</CardTitle>
                        </div>
                        <CardDescription>All transactions are verified and encrypted instantly.</CardDescription>
                        <button
                            onClick={() => setStep(1)}
                            className="absolute top-6 right-6 text-xs font-semibold text-emerald-600 hover:underline"
                        >
                            Modify Address
                        </button>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* Address verification pill inside step 2 */}
                        <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start space-x-3">
                            <MapPin className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                            <div className="text-xs text-slate-600 space-y-1">
                                <p className="font-semibold text-slate-800">Shipping Target Address:</p>
                                <p>{savedAddress?.fullName} — {savedAddress?.phone}</p>
                                <p>{savedAddress?.addressLine}, {savedAddress?.city}, {savedAddress?.state} - {savedAddress?.pincode}</p>
                            </div>
                        </div>

                        {/* Premium Custom Payment Gateway Toggle Option Box */}
                        <div className="p-4 border-2 border-emerald-500 bg-emerald-50/40 rounded-xl flex items-center justify-between cursor-pointer shadow-sm">
                            <div className="flex items-center space-x-4">
                                <div className="w-5 h-5 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-white" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Razorpay Secure Checkout</p>
                                    <p className="text-xs text-slate-500">Cards, Netbanking, UPI, Wallets</p>
                                </div>
                            </div>
                            <div className="text-emerald-600 font-bold text-xs tracking-wider uppercase bg-emerald-100 px-2.5 py-1 rounded-md">Instant</div>
                        </div>

                        <Button onClick={handlePaymentSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-lg shadow-md flex items-center justify-center space-x-2 transition-all text-base">
                            <ShieldCheck className="w-5 h-5" />
                            <span>Authorize Payment Total: ₹{computedTotal.toLocaleString('en-IN')}.00</span>
                        </Button>
                    </CardContent>
                    <CardFooter className="bg-slate-50 border-t border-slate-100 rounded-b-xl py-4 flex items-center justify-center space-x-2 text-xs text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Secured and Managed by A2MATION Systems</span>
                    </CardFooter>
                </Card>
            </motion.div>
        </>
    )
}

export default PaymentSection
