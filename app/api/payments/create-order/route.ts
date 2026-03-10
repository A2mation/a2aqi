import { NextResponse } from 'next/server';

import { getAuthSession } from '@/auth';
import { withAuditContext } from '@/lib/withAuditContext';
import { createOrder } from '@/domains/payments/services/payment.service';

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json()
        const { deviceId, pricingPlanId } = body

        const userId = session.user.id;

        return withAuditContext(
            {
                userId,
                ip: req.headers.get("x-forwarded-for") || "unknown",
                route: "/api/payments/create-order"
            },
            async () => {

                const order = await createOrder(userId, deviceId, pricingPlanId)

                return NextResponse.json(order)

            }
        )
    } catch (error) {
        console.error('[RAZORPAY_ORDER_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}