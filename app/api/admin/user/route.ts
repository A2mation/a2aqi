import { handleAdminError } from "@/lib/handleRoleError";
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const users = await prisma.user.findMany();

        return NextResponse.json(users, {
            status: 200
        })

    } catch (error) {
        return handleAdminError(error);
    }
}