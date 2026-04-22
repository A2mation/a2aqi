"use client";

import Script from "next/script";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

import { http } from "@/lib/http";
import { Button } from "@/components/ui/button";
import { verifyPaymentOnServer } from "@/lib/razorpay-helpers";

const CheckOutButton = ({
  pricingPlanId,
  amount,
}: {
  pricingPlanId: string;
  amount: number;
}) => {
  const session = useSession();

  const router = useRouter();
  const { deviceId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!(window as any).Razorpay) {
      toast.error("Payment SDK not loaded. Please refresh.");
      return;
    }

    try {
      setIsLoading(true);

      const { data: order } = await http.post("/api/payments/create-order", {
        deviceId,
        pricingPlanId,
      });

      if (!order || !order.orderId) {
        throw new Error("Invalid order data received from server");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "A2AQI",
        description: "Device Subscription",
        order_id: order.orderId,
        handler: async (response: any) => {
          const success = await verifyPaymentOnServer({
            response,
            router,
            redirectPath: "/user",
          });

          if (success) {
            toast.success("Payment Successful!");
          } else {
            setIsLoading(false);
          }
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

      rzp.on("payment.failed", async function (response: any) {
        await verifyPaymentOnServer({
          response: {
            razorpay_order_id: response.error.metadata.order_id,
            razorpay_payment_id: response.error.metadata.payment_id,
            razorpay_signature: "",
            error_code: response.error.code,
            error_description: response.error.description,
          },
          router,
        });
      });

      rzp.open();
    } catch (error: any) {
      console.error("Payment Initiation Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to initiate payment.",
      );
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

      <Button onClick={handlePayment} disabled={isLoading} className="w-full cursor-pointer">
        {isLoading ? "Processing..." : `Pay ₹${amount}`}
      </Button>
    </>
  );
};

export default CheckOutButton;
