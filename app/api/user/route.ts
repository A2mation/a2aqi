import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { userGuard } from "@/lib/userAuth"
import { handleUserError } from "@/lib/handleRoleError"

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
                createdAt: true,
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

        const updatedUser = await prisma.user.update({
            where: { id: sessionUser.id },
            data: {
                name: body.name,
                recoveryEmail: body.recoveryEmail,
                phoneNumber: body.phoneNumber,
                accountType: body.accountType,
                organizationName:
                    body.accountType === "ORGANIZATION"
                        ? body.organizationName
                        : null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                recoveryEmail: true,
                phoneNumber: true,
                accountType: true,
                organizationName: true,
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        return handleUserError(error)
    }
}