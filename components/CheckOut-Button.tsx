"use client";

import Script from "next/script";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

import { http } from "@/lib/http";
import { Button } from "@/components/ui/button";
import { verifyPaymentOnServer } from "@/lib/razorpay-helpers";
import { useParams } from "next/navigation";

const CheckOutButton = ({ amount }: { amount: number }) => {
    const session = useSession();

    const { deviceId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const pricingPlanId = '69a56bd6fd69e7569e82cb05'

    const handlePayment = async () => {
        if (!(window as any).Razorpay) {
            toast.error("Payment SDK not loaded. Please refresh.");
            return;
        }

        try {
            setIsLoading(true);

            const { data: order } = await http.post("/api/payments/create-order", { deviceId, pricingPlanId });


            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "A2AQI",
                description: "Device Subscription",
                order_id: order.id,
                handler: async (response: any) => {
                    console.log(response)
                    await verifyPaymentOnServer(response);
                    console.log("Payment Success:", response);
                    toast.success("Payment Successful!");
                },
                prefill: {
                    name: session.data?.user.name,
                    email: session.data?.user.email,
                },
                theme: {
                    color: "#0096FF",
                },
                modal: {
                    ondismiss: () => setIsLoading(false),
                },
            };


            const rzp = new (window as any).Razorpay(options);

            rzp.on('payment.failed', function (response: any) {
                console.error("Reason:", response.error.description);
                toast.error(`Payment Failed: ${response.error.description}`);
                setIsLoading(false);
            });

            rzp.open();



        } catch (error: any) {
            console.error(error);
            toast.error("Failed to initiate payment.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!session) {
        return null;
    }

    return (
        <>
            {/* This loads the official script  */}
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />

            <Button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full"
            >
                {isLoading ? "Processing..." : `Pay ₹${amount}`}
            </Button>
        </>
    );
};

export default CheckOutButton;