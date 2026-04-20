import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { moderatorGuard } from "@/lib/moderatorAuth";
import { handleModeratorError } from "@/lib/handleRoleError";
import { moderatordeviceSchema } from "@/lib/validation/ModeratorDevice";

export async function POST(request: Request) {
  try {
    await moderatorGuard();

    const body = await request.json();

    const result = moderatordeviceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: result.error,
        },
        {
          status: 400,
        },
      );
    }

    const { name, serialNo, model, apiKey } = result.data;

    if (!serialNo) {
      return NextResponse.json(
        { message: "Serial No is required", error: true },
        { status: 400 },
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { message: "ApiKey is required", error: true },
        { status: 400 },
      );
    }

    const modelId = await prisma.deviceModel.findUnique({
      where: {
        id: model,
      },
      select: {
        id: true,
      },
    });

    if (!modelId) {
      return NextResponse.json(
        { message: "Invalid Model", error: true },
        { status: 400 },
      );
    }


    const newDeviceModel = await prisma.device.create({
      data: {
        name,
        apiKey,
        serialNo,
        modelId: model,
      },
    });

    return NextResponse.json(newDeviceModel, { status: 201 });
  } catch (error) {
    return handleModeratorError(error);
  }
}
