import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";

import { http } from "./http";

interface VerifyProps {
    response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    };
    router: AppRouterInstance;
    redirectPath?: string;
}

export const verifyPaymentOnServer = async ({
    response,
    router,
    redirectPath = "/user"
}: VerifyProps) => {
    try {
        const { data } = await http.post("/api/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
        });

        if (data.success) {
            toast.success("Payment Verified & Subscription Active!");
            router.push(redirectPath);
            router.refresh();
            return true;
        }
    } catch (error: any) {
        console.error("Verification failed", error);
        const msg = error.response?.data?.message || "Payment verification failed!";
        toast.error(msg);
        return false;
    }
};