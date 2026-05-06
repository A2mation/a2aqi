import { prisma } from "@/lib/prisma";
import { userRegisterFormSchema } from "@/lib/validation/vendor/Vendor.user.register.schema";
import { vendorGuard } from "@/lib/vendorAuth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


/**
 * Get all users added by the registered Vendor
 * 
 * Get Total Organization Count added by the vendor
 * 
 * Get Total Number of user Count those are Approved added by the vendor
 * 
 *  @param req 
 */
export async function GET(req: Request) {
    try {
        const { vendor } = await vendorGuard();

        const [users, approvedCount, orgGroup] = await Promise.all([
            prisma.user.findMany({
                where: { creatorId: vendor.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    organizationName: true,
                    phoneNumber: true,
                    status: true,
                    createdAt: true
                },
                orderBy: { id: 'desc' }
            }),

            prisma.user.count({
                where: {
                    creatorId: vendor.id,
                    status: 'APPROVED'
                }
            }),

            prisma.user.groupBy({
                by: ['organizationName'],
                where: {
                    creatorId: vendor.id,
                    organizationName: { not: null }
                }
            })
        ]);

        return NextResponse.json({
            users,
            stats: {
                totalUsers: users.length,
                totalApproved: approvedCount,
                totalOrganizations: orgGroup.length
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error", error: true },
            { status: 500 }
        );
    }
}


/**
 * Register **New** user by vendor's end
 * 
 * @param req 
 * @returns 
 */
export async function POST(req: Request) {
    try {
        const { vendor } = await vendorGuard();

        if (vendor.status !== 'ACTIVE') {
            return NextResponse.json(
                {
                    message: "Your are Not authorized to do this Operatin",
                    error: true
                },
                { status: 401 }
            );
        }

        const body = await req.json();

        const validation = userRegisterFormSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Invalid fields",
                    error: validation.error
                },
                { status: 400 }
            );
        }

        const {
            email,
            password,
            name,
            phoneNumber,
            accountType,
            organizationName,
            gstNumber
        } = validation.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists", error: true },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                creatorId: vendor.id,
                accountType: accountType,
                status: 'PENDING',
                organizationName: accountType === "ORGANIZATION" ? organizationName : null,
                gstNumber: accountType === "ORGANIZATION" ? gstNumber?.toUpperCase() : null,
            }
        });

        return NextResponse.json(
            {
                message: "User registered successfully",
                userId: newUser.id
            },
            { status: 200 }
        );

    } catch (error: any) {
        // console.error("[VENDOR_USER_REGISTER]", error);
        return NextResponse.json(
            { message: "Internal server error", error: true },
            { status: 500 }
        );
    }
}