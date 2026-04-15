import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";
import { MonitorDetailsFormSchema } from '@/lib/validation/MonitorDetails.schema';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
    req: Request,
    { params }: { params: Promise<{ monitorId: string }> }
) {
    try {

        await adminGuard();

        const { monitorId } = await params;

        if (!monitorId) {
            return new NextResponse("Monitor ID is required", { status: 400 });
        }

        const monitor = await prisma.monitor.findUnique({
            where: {
                id: monitorId
            },
            include: {
                _count: {
                    select: { devices: true }
                }
            }
        });

        if (!monitor) {
            return new NextResponse("Monitor not found", { status: 404 });
        }

        const { password, ...monitorData } = monitor;

        return NextResponse.json({
            ...monitorData,
            deviceCount: monitor._count.devices
        }).headers.set('Cache-Control', 'no-store, max-age=0');

    } catch (err: any) {
        return handleAdminError(err);
    }
}


export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ monitorId: string }> }
): Promise<NextResponse> {
    try {
        await adminGuard();
        const { monitorId } = await params;

        if (!monitorId) {
            return new NextResponse("Monitor ID not found", { status: 400 });
        }

        const body = await req.json();
        const validation = MonitorDetailsFormSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: "Validation Error", errors: validation.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, email, password, status, tag, deviceIds } = validation.data;

        if (email) {
            const existingEmail = await prisma.monitor.findFirst({
                where: {
                    email,
                    NOT: { id: monitorId }
                },
                select: { id: true }
            });

            if (existingEmail) {
                return NextResponse.json(
                    { message: "This email is already in use by another monitor." },
                    { status: 409 }
                );
            }
        }

        const updateData: any = {
            name,
            email,
            status,
            tag,
            devices: {
                deleteMany: {},
                create: deviceIds?.map((id: string) => ({
                    device: {
                        connect: { id }
                    }
                }))
            }
        };

        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 12);
        }

        const updatedMonitor = await prisma.monitor.update({
            where: { id: monitorId },
            data: updateData,
            include: {
                devices: true
            }
        });

        const { password: _, ...monitorWithoutPassword } = updatedMonitor;
        return NextResponse.json(monitorWithoutPassword);

    } catch (err: any) {
        return handleAdminError(err);
    }
}


export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ monitorId: string }> }
) {
    try {
        await adminGuard();

        const { monitorId } = await params;

        if (!monitorId) {
            return new NextResponse("Monitor ID is required", { status: 400 });
        }

        /** * Transactional Delete
         * the MonitorDevice relation, you should delete the assignments first.
         */
        await prisma.$transaction([
            // Clean up device assignments first
            prisma.monitorDevice.deleteMany({
                where: {
                    monitorId: monitorId
                }
            }),
            // Delete the actual monitor account
            prisma.monitor.delete({
                where: {
                    id: monitorId
                }
            })
        ]);

        return new NextResponse("Monitor and associated assignments deleted successfully", {
            status: 200
        }).headers.set('Cache-Control', 'no-store, max-age=0');

    } catch (err: any) {
        if (err.code === 'P2025') {
            return new NextResponse("Monitor not found", { status: 404 });
        }

        return handleAdminError(err);
    }
}