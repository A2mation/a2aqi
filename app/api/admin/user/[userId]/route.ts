import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { AccountType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { UserFormSchema } from "@/lib/validation/admin/User";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        if (!userId) {
            return NextResponse.json({ message: "User ID not found" }, { status: 400 });
        }

        await adminGuard();

        const body = await req.json();


        const validation = UserFormSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: "Validation Error", errors: validation.error },
                { status: 400 }
            );
        }

        const { name, email, password, accountType, status, organizationName, gstNumber } = validation.data;


        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true }
        });

        if (!existingUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        const updateData: any = {
            name,
            email,
            accountType,
            status,
        };

        if (password && password.trim() !== "") {
            updateData.password = await hash(password, 10);
        }

        if (accountType === AccountType.ORGANIZATION) {
            updateData.organizationName = organizationName;
            updateData.gstNumber = gstNumber;
        } else {
            updateData.organizationName = null;
            updateData.gstNumber = null;
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("[USER_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}



export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        if (!userId) {
            return NextResponse.json({ message: "User ID is required", error: true }, { status: 400 });
        }

        // Check if the user exists and count critical relations
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: {
                        devices: true,
                        payments: true,
                        deviceSubscriptions: true,
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found", error: true }, { status: 404 });
        }

        // Prevent deletion if they have active financial records
        // This matches the "409 Conflict" logic in your frontend CellAction
        if (user._count.payments > 0 || user._count.deviceSubscriptions > 0) {
            return NextResponse.json(
                {
                    message: "User has active subscriptions or payment history and cannot be deleted. Consider deactivating them instead.",
                    error: true
                },
                { status: 409 }
            );
        }

        // you may need to delete addresses or comments first in a transaction.
        await prisma.$transaction([
            // Delete non-critical related records first if not cascaded in Prisma schema
            prisma.comment.deleteMany({ where: { userId: userId } }),
            prisma.address.deleteMany({ where: { userId: userId } }),

            // Finally, delete the user
            prisma.user.delete({
                where: { id: userId },
            }),
        ]);

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("[USER_DELETE]", error);
        return NextResponse.json({ message: "Internal error", error: true }, { status: 500 });
    }
}