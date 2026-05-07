import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { vendorGuard } from "@/lib/vendorAuth";
import { vendorDeviceFormSchema } from "@/lib/validation/vendor/vendor.device.registration.schema";
import { DeviceStatus } from "@prisma/client";
import { vendorDeviceCredentialsSender } from "@/lib/resend/client";

/**
 * Get all devices added by the registered Vendor
 * 
 *  @param req 
 */
export async function GET(req: Request) {
    try {
        const { vendor } = await vendorGuard();

        const devicesRaw = await prisma.device.findMany({
            where: { createdById: vendor.id },
            select: {
                id: true,
                name: true,
                serialNo: true,
                apiKey: true,
                type: true,
                loaction: true,
                lat: true,
                lng: true,
                status: true,
                model: {
                    select: {
                        name: true,
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                latestSensorReadings: {
                    select: {
                        measuredAt: true
                    }
                },
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const now = new Date();
        const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

        const devices = devicesRaw.map(device => {
            const latestReading = device.latestSensorReadings;

            const isActive = latestReading
                ? (now.getTime() - new Date(latestReading.measuredAt).getTime()) <= FIVE_MINUTES_IN_MS
                : false;

            return {
                id: device.id,
                name: device.name,
                serialNo: device.serialNo,
                isActive: isActive,
                apiKey: device.apiKey,
                type: device.type,
                location: device.loaction,
                lat: device.lat,
                lng: device.lng,
                status: device.status,
                model: device.model,
                user: device.user,
                createdAt: device.createdAt
            };
        });

        return NextResponse.json(
            devices,
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error", error: true },
            { status: 500 }
        );
    }
}


/**
 * Register **New** device by vendor's end
 * 
 * @param req 
 * @returns 
 */
export async function POST(req: Request) {
    try {
        const { vendor } = await vendorGuard();

        if (vendor.status !== 'ACTIVE') {
            return NextResponse.json(
                { message: "You are not authorized to do this operation", error: true },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validation = vendorDeviceFormSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: "Invalid fields", error: validation.error },
                { status: 400 }
            );
        }

        const { name, modelId, location, lat, lng, user } = validation.data;

        let serialNo: string = '';
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 10) {
            serialNo = CREATE_SERIAL_NUMBER();

            // CHECK IF IT EXISTS IN DB
            const existing = await prisma.device.findUnique({
                where: { serialNo: serialNo },
                select: { id: true }
            });

            if (!existing) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            return NextResponse.json(
                { message: "Could not generate a unique Serial Number", error: true },
                { status: 403 }
            );
        }

        const apiKey = GENERATE_SECURE_API_KEY_16();

        const parsedLat = lat ? parseFloat(lat) : null;
        const parsedLng = lng ? parseFloat(lng) : null;

        const res = await prisma.device.create({
            data: {
                name,
                modelId,
                serialNo,
                apiKey,
                loaction: location,
                state: 'PENDING',
                lat: (parsedLat !== null && !isNaN(parsedLat)) ? parsedLat : null,
                lng: (parsedLng !== null && !isNaN(parsedLng)) ? parsedLng : null,
                status: DeviceStatus.ASSIGNED,
                isActive: false,
                userId: user,
                createdById: vendor.id
            }
        });

        const emailResponse = await vendorDeviceCredentialsSender(
            vendor.email,
            serialNo,
            apiKey
        );

        if (emailResponse.error) {
            await prisma.device.delete({ where: { id: res.id } });

            return NextResponse.json(
                { message: "Device registered but email failed to send. Please try again.", error: true },
                { status: 500 }
            );
        }

        return NextResponse.json({ data: res }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal server error", error: true },
            { status: 500 }
        );
    }
}

/**
 * GENERATES A 10-DIGIT SERIAL NUMBER STARTING WITH 'A2AQ'
 * @PARAM {BOOLEAN} ALPHANUMERIC - IF TRUE, USES LETTERS AND NUMBERS.
 * @RETURNS {STRING} - THE 10-DIGIT SERIAL NUMBER IN ALL CAPS
 */
function CREATE_SERIAL_NUMBER(ALPHANUMERIC = true) {
    const PREFIX = "A2AQ";
    const CHARSET = ALPHANUMERIC
        ? "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        : "0123456789";

    let RANDOM_PART = "";

    // GENERATE THE REMAINING 6 CHARACTERS
    for (let I = 0; I < 6; I++) {
        RANDOM_PART += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
    }

    return PREFIX + RANDOM_PART;
}


/**
 * GENERATES A CRYPTOGRAPHICALLY SECURE 16-DIGIT API KEY
 * FORMAT: A2AQ + 12 SECURE ALPHANUMERIC CHARACTERS
 */
function GENERATE_SECURE_API_KEY_16() {
    const PREFIX = "A2AQ";
    const TOTAL_LENGTH = 16;
    const RANDOM_LENGTH = TOTAL_LENGTH - PREFIX.length; // 12 CHARACTERS
    const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // USE CRYPTO FOR PRODUCTION-GRADE RANDOMNESS
    const RANDOM_VALUES = new Uint32Array(RANDOM_LENGTH);
    crypto.getRandomValues(RANDOM_VALUES);

    let RANDOM_PART = "";
    for (let I = 0; I < RANDOM_LENGTH; I++) {
        RANDOM_PART += CHARSET[RANDOM_VALUES[I] % CHARSET.length];
    }

    return PREFIX + RANDOM_PART;
}