import * as z from "zod"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { userGuard } from "@/lib/userAuth"
import { handleUserError } from "@/lib/handleRoleError"
import { profileSchema } from "@/lib/validation/UserProfileSchema"


export async function GET() {
    try {
        const { user: sessionUser } = await userGuard()

        const user = await prisma.user.findUnique({
            where: {
                id: sessionUser.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                recoveryEmail: true,
                phoneNumber: true,
                authProvider: true,
                accountType: true,
                organizationName: true,
                gstNumber: true,
                createdAt: true,
                billingAddressId: true,
                billingAddress: true,
                addresses: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        type: true,
                        isDefault: true,
                        state: true,
                        street: true,
                        zipCode: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            },
        })

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(user)

    } catch (error) {
        return handleUserError(error)
    }
}


export async function PATCH(req: Request) {
    try {
        const { user: sessionUser } = await userGuard()
        const body = await req.json()

        const result = profileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: z.treeifyError(result.error)
                },
                { status: 400 }
            );
        }

        const { name, accountType, recoveryEmail, phoneNumber, organizationName, gstNumber, billingAddressId } = result.data;

        const updatedUser = await prisma.user.update({
            where: { id: sessionUser.id },
            data: {
                name,
                recoveryEmail,
                phoneNumber,
                accountType,
                organizationName,
                gstNumber,
                billingAddressId
            },
            select: {
                id: true,
                name: true,
                email: true,
                recoveryEmail: true,
                phoneNumber: true,
                accountType: true,
                organizationName: true,
                gstNumber: true,
                billingAddressId: true
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        return handleUserError(error)
    }
}