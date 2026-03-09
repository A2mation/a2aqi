import { PaymentStatus } from "@prisma/client";

export interface CreatePaymentDTO {
    userId: string;
    deviceId: string;
    pricingPlanId: string;
    couponId?: string; 

    amount: number;
    discountAmount?: number;
    finalAmount: number;
    currency?: string; 

    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    status?: PaymentStatus;
    metadata?: any;
}

export interface UpdatePaymentSuccessDTO {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}