import { NextResponse } from "next/server";
import { AdminRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";
import { VendorEditFormSchema } from "@/lib/validation/vendor/Vendor.registration.schema";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ vendorId: string }> }
) {
    try {
        const { vendorId } = await params;

        if (!vendorId) {
            return NextResponse.json({ message: "Moderator ID not found" }, { status: 400 });
        }

        await adminGuard();

        const body = await req.json();
        const validation = VendorEditFormSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: "Validation Error", errors: validation.error },
                { status: 400 }
            );
        }

        const { name, email, password, status, gstNumber } = validation.data;

        await prisma.admin.update({
            where: {
                id: vendorId,
                role: 'VENDOR'
            }, data: {
                name,
                status,
                gstNumber
            }
        });

        return NextResponse.json({
            message: 'Update Successfully'
        }, { status: 200 });

    } catch (error) {
        return handleAdminError(error)
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ vendorId: string }> }
) {
    try {
        const { vendorId } = await params;

        if (!vendorId) {
            return NextResponse.json({ message: "Vendor ID not found", error: true }, { status: 400 });
        }

        await adminGuard();

        const target = await prisma.admin.findUnique({
            where: {
                id: vendorId,
                // role: 'VENDOR'
            }, select: {
                id: true,
                role: true
            }
        });

        if (target?.role !== AdminRole.VENDOR) {
            return NextResponse.json({
                message: "Unauthorized: Cannot delete non-vendor accounts here",
                error: true
            }, {
                status: 403
            });
        }

        // await prisma.$transaction([
        //     prisma.device.deleteMany({
        //         where: { createdById: vendorId }
        //     }),
        //     //    TODO: DELETE THE USERS Created By the Vendor
        //     prisma.admin.delete({
        //         where: { id: vendorId }
        //     })
        // ]);

        return NextResponse.json({
            success: true,
            message: 'Vendor Delete Successfully'
        }, {
            status: 200
        })

    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ message: "vendor not found" }, { status: 404 });
        }
        return handleAdminError(error)
    }
}