import { NextResponse } from "next/server";

import { redis } from "@/lib/redis";
import { SensorError } from "@/domains/sensors/sensor.error";
import { authenticateSensor } from "@/domains/sensors/sensor.auth";
import { getPage1, getPage10, getPage11, getPage12, getPage13, getPage14, getPage2, getPage3, getPage4, getPage5, getPage6, getPage7, getPage8, getPage9 } from "./constant";
import { prisma } from "@/lib/prisma";

const REDIS_FLAG_KEY = `display:flags:iitkgp`
const FLAG = `0~0~0~0~0~0~0~0~0~0~0~0~0~0~`
const FLAG_PAGE1 = REDIS_FLAG_KEY + ':Page1'
const FLAG_PAGE2 = REDIS_FLAG_KEY + ':Page2'
const FLAG_PAGE3 = REDIS_FLAG_KEY + ':Page3'
const FLAG_PAGE4 = REDIS_FLAG_KEY + ':Page4'
const FLAG_PAGE5 = REDIS_FLAG_KEY + ':Page5'
const FLAG_PAGE6 = REDIS_FLAG_KEY + ':Page6'
const FLAG_PAGE7 = REDIS_FLAG_KEY + ':Page7'
const FLAG_PAGE8 = REDIS_FLAG_KEY + ':Page8'
const FLAG_PAGE9 = REDIS_FLAG_KEY + ':Page9'
const FLAG_PAGE10 = REDIS_FLAG_KEY + ':Page10'
const FLAG_PAGE11 = REDIS_FLAG_KEY + ':Page11'
const FLAG_PAGE12 = REDIS_FLAG_KEY + ':Page12'
const FLAG_PAGE13 = REDIS_FLAG_KEY + ':Page13'
const FLAG_PAGE14 = REDIS_FLAG_KEY + ':Page14'

export async function GET(req: Request) {
    try {
        const apiKey = req.headers.get("x-api-key");
        const serialNo = req.headers.get("x-serialNo");

        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing API key" },
                { status: 401 }
            );
        }
        if (!serialNo) {
            return NextResponse.json(
                { error: "Missing Serial No" },
                { status: 401 }
            );
        }

        const device = await authenticateSensor(serialNo, apiKey);

        const { searchParams } = new URL(req.url);
        const flagParam = searchParams.get("flag");
        const pageParam = searchParams.get("page");

        if (!flagParam) {
            return NextResponse.json(
                { error: 'No flag given' },
                { status: 400 }
            );
        }

        // Convert parameters to numbers
        const flag = Number(flagParam);
        const page = pageParam ? Number(pageParam) : null;

        // Condition 1: flag is 1
        // Return: flag
        if (flag === 1) {
            const flagData = await redis.get(REDIS_FLAG_KEY);

            if (!flagData) {
                await Promise.all([
                    redis.set(FLAG_PAGE1, 0),
                    redis.set(FLAG_PAGE2, 0),
                    redis.set(FLAG_PAGE3, 0),
                    redis.set(FLAG_PAGE4, 0),
                    redis.set(FLAG_PAGE5, 0),
                    redis.set(FLAG_PAGE6, 0),
                    redis.set(FLAG_PAGE7, 0),
                    redis.set(FLAG_PAGE8, 0),
                    redis.set(FLAG_PAGE9, 0),
                    redis.set(FLAG_PAGE10, 0),
                    redis.set(FLAG_PAGE11, 0),
                    redis.set(FLAG_PAGE12, 0),
                    redis.set(FLAG_PAGE13, 0),
                    redis.set(FLAG_PAGE14, 0),
                ]);

                return NextResponse.json(
                    { flag: FLAG },
                    { status: 200 }
                );
            }

            const [
                PAGE1,
                PAGE2,
                PAGE3,
                PAGE4,
                PAGE5,
                PAGE6,
                PAGE7,
                PAGE8,
                PAGE9,
                PAGE10,
                PAGE11,
                PAGE12,
                PAGE13,
                PAGE14,
            ] = await Promise.all([
                redis.get(FLAG_PAGE1),
                redis.get(FLAG_PAGE2),
                redis.get(FLAG_PAGE3),
                redis.get(FLAG_PAGE4),
                redis.get(FLAG_PAGE5),
                redis.get(FLAG_PAGE6),
                redis.get(FLAG_PAGE7),
                redis.get(FLAG_PAGE8),
                redis.get(FLAG_PAGE9),
                redis.get(FLAG_PAGE10),
                redis.get(FLAG_PAGE11),
                redis.get(FLAG_PAGE12),
                redis.get(FLAG_PAGE13),
                redis.get(FLAG_PAGE14),
            ]);
            return NextResponse.json(
                { flag: `${PAGE1}~${PAGE2}~${PAGE3}~${PAGE4}~${PAGE5}~${PAGE6}~${PAGE7}~${PAGE8}~${PAGE9}~${PAGE10}~${PAGE11}~${PAGE12}~${PAGE13}~${PAGE14}~` },
                { status: 200 }
            );
        }

        // Condition 2: flag is 0 AND page is between 1 and 14 (inclusive)
        // Return: modified data string
        if (flag === 0 && page !== null && page >= 1 && page <= 14) {

            if (page === 1) {
                await redis.set(FLAG_PAGE1, 0);

                return NextResponse.json(
                    { message: getPage1() },
                    { status: 200 }
                );
            }

            if (page === 2) {

                const [parameters] = await Promise.all([
                    prisma.latestSensorReading.findUnique({
                        where: {
                            deviceId: device.id
                        },
                        select: {
                            temperature: true,
                            humidity: true,
                            so2: true,
                            no2: true,
                            co2: true
                        }
                    }),

                    redis.set(FLAG_PAGE2, 1)
                ]);

                return NextResponse.json(
                    { message: getPage2(parameters?.temperature, parameters?.humidity, parameters?.so2, parameters?.no2, parameters?.co2) },
                    { status: 200 }
                );
            }

            if (page === 3) {

                const [parameters] = await Promise.all([
                    prisma.latestSensorReading.findUnique({
                        where: {
                            deviceId: device.id
                        },
                        select: {
                            pm25: true,
                            pm10: true,
                            aqi: true,
                        }
                    }),

                    redis.set(FLAG_PAGE3, 1)
                ]);

                return NextResponse.json(
                    { message: getPage3(parameters?.pm25, parameters?.pm10, parameters?.aqi) },
                    { status: 200 }
                );
            }

            if (page === 4) {
                await redis.set(FLAG_PAGE4, 0);
                return NextResponse.json(
                    { message: getPage4('TEST', 'TEST', 'NOT NEEDED', 'NOT NEEDED') },
                    { status: 200 }
                );
            }

            if (page === 5) {
                await redis.set(FLAG_PAGE5, 0);
                return NextResponse.json(
                    { message: getPage5() },
                    { status: 200 }
                );
            }

            if (page === 6) {
                await redis.set(FLAG_PAGE6, 0);
                return NextResponse.json(
                    { message: getPage6() },
                    { status: 200 }
                );
            }

            if (page === 7) {
                await redis.set(FLAG_PAGE7, 0);
                return NextResponse.json(
                    { message: getPage7() },
                    { status: 200 }
                );
            }

            if (page === 8) {
                await redis.set(FLAG_PAGE8, 0);
                return NextResponse.json(
                    { message: getPage8() },
                    { status: 200 }
                );
            }


            if (page === 9) {
                await redis.set(FLAG_PAGE9, 0);
                return NextResponse.json(
                    { message: getPage9() },
                    { status: 200 }
                );
            }

            if (page === 10) {
                await redis.set(FLAG_PAGE10, 0);
                return NextResponse.json(
                    { message: getPage10() },
                    { status: 200 }
                );
            }

            if (page === 11) {
                await redis.set(FLAG_PAGE11, 0);
                return NextResponse.json(
                    { message: getPage11() },
                    { status: 200 }
                );
            }


            if (page === 12) {
                await redis.set(FLAG_PAGE12, 0);
                return NextResponse.json(
                    { message: getPage12() },
                    { status: 200 }
                );
            }

            if (page === 13) {
                await redis.set(FLAG_PAGE13, 0);
                return NextResponse.json(
                    { message: getPage13() },
                    { status: 200 }
                );
            }

            if (page === 14) {
                await redis.set(FLAG_PAGE14, 0);
                return NextResponse.json(
                    { message: getPage14() },
                    { status: 200 }
                );
            }


            return NextResponse.json(
                { message: `Success! You requested page ${page} with flag 0.` },
                { status: 200 }
            );
        }

        // Fallback if the query params don't match expected criteria
        return NextResponse.json(
            { error: "Invalid flag or page range combination" },
            { status: 400 }
        );

    } catch (err: any) {
        if (err instanceof SensorError) {
            return NextResponse.json(
                { error: err.message },
                { status: err.statusCode }
            );
        }
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}