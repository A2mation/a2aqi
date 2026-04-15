import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";
import { MonitorDetailsFormSchema } from "@/lib/validation/MonitorDetails.schema";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        await adminGuard();

        const monitors = await prisma.monitor.findMany({
            include: {
                _count: {
                    select: { devices: true }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const formattedMonitors = monitors.map((monitor) => ({
            ...monitor,
            deviceCount: monitor._count.devices,
        }));

        return NextResponse.json(formattedMonitors).headers.set('Cache-Control', 'no-store, max-age=0');

    } catch (error: any) {
        return handleAdminError(error);
    }
}


export async function POST(request: Request) {
    try {
        await adminGuard();

        const body = await request.json();
        
        const validation = MonitorDetailsFormSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { 
                    message: "Validation Error", 
                    errors: validation.error.flatten().fieldErrors 
                },
                { status: 400 }
            );
        }

        const { name, email, password, status, tag, deviceIds } = validation.data;

        if (!password) {
            return new NextResponse("Password is required for new monitors", { status: 400 });
        }

        const existingMonitor = await prisma.monitor.findUnique({
            where: { email }
        });

        if (existingMonitor) {
            return NextResponse.json(
                { message: "A monitor with this email already exists." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newMonitor = await prisma.monitor.create({
            data: {
                name,
                email,
                password: hashedPassword,
                status,
                tag,
                // This creates the entries in the MonitorDevice junction table automatically
                devices: {
                    create: deviceIds?.map((id: string) => ({
                        device: {
                            connect: { id }
                        }
                    }))
                }
            },
            include: {
                devices: true
            }
        });

        const { password: _, ...monitorWithoutPassword } = newMonitor;

        return NextResponse.json(monitorWithoutPassword, { status: 201 }).headers.set('Cache-Control', 'no-store, max-age=0');

    } catch (error: any) {
        return handleAdminError(error);
    }
}