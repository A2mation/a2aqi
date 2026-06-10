"use client";

import Script from "next/script";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { http } from "@/lib/http";
import { Button } from "@/components/ui/button";
import { verifyPaymentOnServer } from "@/lib/razorpay-helpers";
import { AddressFormValues } from "@/lib/validation/order/order.address.schema";

const OrderCheckOutButton = ({
  product,
  amount,
  qty,
  address,
}: {
  product: {
    id: string;
    title: string;
    subtitle: string;
    basePrice: number;
    delivery: string;
    image: string;
  };
  amount: number;
  qty: number;
  address: AddressFormValues;
}) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!(window as any).Razorpay) {
      toast.error("Payment SDK not loaded. Please refresh.");
      return;
    }

    try {
      setIsLoading(true);

      const { data: order } = await http.post("/api/payments/create-order", {
        address,
        email: address.email,
        productId: product.id,
        qty
      });

      if (!order || !order.orderId) {
        throw new Error("Invalid order data received from server");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: product.title,
        description: product.subtitle,
        order_id: order.orderId,
        handler: async (response: any) => {
          const success = await verifyPaymentOnServer({
            response,
            router,
            redirectPath: "/products",
          });

          if (success) {
            toast.success("Payment Successful!");
          } else {
            setIsLoading(false);
          }
        },
        prefill: {
          name: address.fullName,
          email: address.email,
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


  return (
    <>
      {/* This loads the official script  */}
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <Button onClick={handlePayment} disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-lg shadow-md flex items-center justify-center space-x-2 transition-all text-base">
        {isLoading ? "Processing..." : `Authorize Payment Total: ₹${amount.toLocaleString('en-IN')}.00`}
        <ShieldCheck className="w-5 h-5" />
      </Button>

    </>
  );
};

export default OrderCheckOutButton;
