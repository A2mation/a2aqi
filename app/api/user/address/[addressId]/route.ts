import { NextResponse } from "next/server";
// Or your auth provider
import { addressSchema } from "@/lib/validation/UserAddressSchema";
import { prisma } from "@/lib/prisma";
import { userGuard } from "@/lib/userAuth";

export async function PATCH(
    req: Request,
    params: {
        params: Promise<{ addressId: string }>
    }
) {
    try {
        const { user } = await userGuard();

        const body = await req.json();
        const { addressId } = await params.params;

        const validatedData = addressSchema.parse(body);

        const updatedAddress = await prisma.$transaction(async (tx) => {

            const address = await tx.address.update({
                where: {
                    id: addressId,
                    userId: user.id,
                },
                data: {
                    type: validatedData.type,
                    email: validatedData.email,
                    phoneNumber: validatedData.phoneNumber,
                    street: validatedData.street,
                    city: validatedData.city,
                    state: validatedData.state,
                    zipCode: validatedData.zipCode,
                },
            });

            if (validatedData.isDefault) {
                await tx.user.update({
                    where: { id: user.id },
                    data: { billingAddressId: addressId },
                });
            }

            return address;
        });

        return NextResponse.json(updatedAddress);
    } catch (error: any) {
        console.error("[ADDRESS_PATCH]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    params: {
        params: Promise<{ addressId: string }>
    }
) {
    try {
        const { user } = await userGuard();

        const { addressId } = await params.params;

        const validuser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { billingAddressId: true }
        });

        if (validuser?.billingAddressId === addressId) {
            return new NextResponse("Cannot delete primary billing address. Set another default first.", { status: 400 });
        }

        await prisma.address.delete({
            where: {
                id: addressId,
                userId: user.id,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}