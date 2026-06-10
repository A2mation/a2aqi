"use client"

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'

import RightColumn from './components/right-column'
import PaymentSection from './components/payment-section'
import AddressForm from './components/address-form'
import { PRODUCTS } from '@/data/products'
import { AddressFormValues } from '@/lib/validation/order/order.address.schema'


const CheckoutPage = () => {
    const params = useParams();
    const [step, setStep] = useState < 1 | 2 > (1)
    const [quantity, setQuantity] = useState < number > (1)
    const [savedAddress, setSavedAddress] = useState < AddressFormValues | null > (null)

    const p = PRODUCTS.find((s) => s.slug === params.slug);

    const product = {
        id: p?.id || '',
        title: p?.title || ``,
        subtitle: 'Standard Air Quality Monitor Device',
        basePrice: p?.price || 99999,
        delivery: p?.logistics.delivery || '',
        image: p?.images[0] || ''
    }

    const computedTotal = product.basePrice * quantity


    return (
        <div className="min-h-screen bg-[#f4f7f5] py-12 px-4 sm:px-6 lg:px-8 font-sans mt-20">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Step Content Wrapper (Left 2 Columns) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Progress Navigation Breadcrumb */}
                    <div className="flex items-center justify-start space-x-4 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                {savedAddress ? <Check className="w-4 h-4" /> : "1"}
                            </div>
                            <span className={`text-sm font-semibold ${step === 1 ? 'text-slate-900' : 'text-slate-400'}`}>Shipping</span>
                        </div>
                        <div className="h-0.5 w-12 bg-slate-200" />
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 2 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                2
                            </div>
                            <span className={`text-sm font-semibold ${step === 2 ? 'text-slate-900' : 'text-slate-400'}`}>Payment</span>
                        </div>
                    </div>

                    {/* Smooth Multistep Transition Engine */}
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <AddressForm
                                setStep={(v: number) => setStep(v as 1 | 2)}
                                setSavedAddress={setSavedAddress}
                            />
                        ) : savedAddress ? (
                            <PaymentSection
                                quantity={quantity}
                                product={product}
                                savedAddress={savedAddress}
                                setStep={(v: number) => setStep(v as 1 | 2)}
                            />
                        ) : null}
                    </AnimatePresence>
                </div>

                {/* Sticky Order Product Component Summary Column (Right Side) */}
                <RightColumn quantity={quantity} product={product} computedTotal={computedTotal} setQuantity={setQuantity} />

            </div>
        </div>
    )
}

export default CheckoutPage