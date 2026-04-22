import { features, getPlanName, getPlanPeriod } from "@/constant/Plan-Feature";
import { prisma } from "@/lib/prisma";
import { userGuard } from "@/lib/userAuth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const deviceId = searchParams.get("deviceId");

    if (!deviceId) {
      return NextResponse.json(
        {
          message: "Require Device Id",
          error: true,
        },
        {
          status: 404,
        },
      );
    }

    await userGuard();

    const model = await prisma.device.findUnique({
      where: {
        id: deviceId,
      },
      select: {
        modelId: true,
      },
    });

    if (!model) {
      return NextResponse.json(
        {
          message: "Model Not Found",
          error: true,
        },
        {
          status: 404,
        },
      );
    }

    const plans = await prisma.pricingPlan.findMany({
      where: {
        modelId: model.modelId,
        isEnabled: true,
      },
    });

    if (!plans) {
      return NextResponse.json(
        {
          message: "Model Plans Not Found",
          error: true,
        },
        {
          status: 404,
        },
      );
    }

    if (plans.length === 0) {
      return NextResponse.json(
        {
          message: "No Plans Found For This Device Please contact Admins",
          error: true,
        },
        {
          status: 404,
        },
      );
    }

    const formattedPlans = plans.map((plan) => {
      return {
        id: plan.id,
        name: getPlanName(plan.duration),
        price: plan.price,
        period: getPlanPeriod(plan.duration),
        features: features,
      };
    });

    return NextResponse.json(formattedPlans);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something Went Wrong",
        error: true,
      },
      {
        status: 500,
      },
    );
  }
}
