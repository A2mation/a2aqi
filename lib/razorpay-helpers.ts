import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";

import { http } from "./http";

interface VerifyProps {
    response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        error_code?: string;
        error_description?: string;
    };
    router: AppRouterInstance;
    redirectPath?: string;
    attempts?: number;
}

export async function verifyPaymentOnServer({
    response,
    router,
    redirectPath = '/user',
    attempts = 1 // Initial attempt set to 1
}: VerifyProps) {
    const MAX_TRIES = 3;

    try {
        const { data } = await http.post("/api/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            error_code: response.error_code,
            error_description: response.error_description
        });

        // SUCCESS: Subscription is active
        if (data.success) {
            toast.dismiss();
            toast.success("Payment Verified & Subscription Active!");
            router.push(redirectPath);
            router.refresh();
            return true;
        }

        // PROCESSING: Server is still working (e.g., Webhook locked the record)
        if (data.processing) {
            if (attempts >= MAX_TRIES) {
                toast.dismiss();
                toast.error("Verification is taking longer than usual. Please check your dashboard in a moment.");
                router.push(redirectPath); // Send them to dashboard anyway
                return false;
            }

            toast.loading(`Finalizing subscription... (Attempt ${attempts}/${MAX_TRIES})`, { id: "verify-progress" });

            await new Promise(resolve => setTimeout(resolve, 2500 * attempts));

            return verifyPaymentOnServer({
                response,
                router,
                redirectPath,
                attempts: attempts + 1
            });
        }

        // FAILURE: Actual verification error
        toast.error(data.message || "Payment verification failed!");
        return false;

    } catch (error: any) {
        console.error("Verification Error:", error);
        toast.error("Communication error with server.");
        return false;
    }
}