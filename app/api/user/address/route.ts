import { NextResponse } from "next/server"; // Replace with your auth helper
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validation/UserAddressSchema";
import { userGuard } from "@/lib/userAuth";

export async function POST(req: Request) {
    try {
        const { user: sessionUser } = await userGuard();

        const body = await req.json();

        const validation = addressSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error, { status: 400 });
        }

        const { street, city, state, zipCode, type, isDefault } = validation.data;


        const result = await prisma.$transaction(async (tx) => {
        
            const newAddress = await tx.address.create({
                data: {
                    street,
                    city,
                    state,
                    zipCode,
                    type,
                    country: "India",
                    isDefault,
                    userId: sessionUser.id,
                },
            });

            // If it's the first address OR user explicitly checked 'isDefault'
            const addressCount = await tx.address.count({
                where: { userId: sessionUser.id }
            });

            if (isDefault || addressCount === 1) {
                await tx.user.update({
                    where: { id: sessionUser.id },
                    data: { billingAddressId: newAddress.id },
                });

                await tx.address.updateMany({
                    where: {
                        userId: sessionUser.id,
                        id: { not: newAddress.id },
                    },
                    data: { isDefault: false },
                });
            }

            return newAddress;
        });

        return NextResponse.json(result, { status: 201 });

    } catch (error) {
        console.error("[ADDRESS_POST_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}