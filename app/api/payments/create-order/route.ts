import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/auth';
import { withAuditContext } from '@/lib/withAuditContext';
import { createOrder } from '@/domains/payments/services/payment.service';
import { AddressFormValues } from '@/lib/validation/order/order.address.schema';

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json()
        const { deviceId, pricingPlanId, productId, email, address, qty }: {
            deviceId: string,
            pricingPlanId: string,
            productId: string,
            email: string,
            qty: number,
            address: AddressFormValues,
        } = body
        if (productId) {
            if (!email) {
                return new NextResponse('Unauthorized', { status: 401 });
            }

            return withAuditContext(
                {
                    userId: email,
                    ip: req.headers.get("x-forwarded-for") || "unknown",
                    route: "/api/payments/create-order"
                },
                async () => {

                    const savedAddress = await prisma.address.create({
                        data: {
                            name: address.fullName,
                            email: address.email,
                            phoneNumber: address.phone,

                            street: `${address.street}, ${address.addressLine}`,
                            city: address.city,
                            state: address.state,
                            zipCode: address.pincode,
                            country: "India",

                            type: "BILLING",
                            isDefault: true,
                        },
                    })

                    
                    const order = await createOrder({ qty, email, productId })


                    await prisma.orders.create({
                        data: {
                            productId,
                            productSlug: order?.product?.slug!,
                            quantity: qty,
                            email,

                            addressId: savedAddress.id,
                            paymentId: order?.payment?.id!,
                        }
                    })
                    
                    return NextResponse.json(order)

                }
            )
        }



        const userId = session.user.id;

        return withAuditContext(
            {
                userId,
                ip: req.headers.get("x-forwarded-for") || "unknown",
                route: "/api/payments/create-order"
            },
            async () => {

                const order = await createOrder({ userId, deviceId, pricingPlanId })

                return NextResponse.json(order)

            }
        )
    } catch (error) {
        console.error('[RAZORPAY_ORDER_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}