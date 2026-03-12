import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { userGuard } from "@/lib/userAuth";
import { UserBillingAddressController } from "@/domains/users/controllers/user.billing.address.controller";

const controller = new UserBillingAddressController();

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ addressId: string }> }
) {
    const { user } = await userGuard();
    const { addressId } = await params;
    const body = await req.json();

    return controller.patchAddress(user.id, addressId, body);
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ addressId: string }> }
) {
    const { user } = await userGuard();
    const { addressId } = await params;

    return controller.deleteAddress(user.id, addressId);
}