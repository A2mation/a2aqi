export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { PricingPlanForm } from "./components/plan-form";


const SinglePricingPlanPage = async ({
  params,
}: {
  params: Promise<{ pricingPlanId: string }>
}) => {
  const pricingPlanId = (await params).pricingPlanId;

  const pricingPlan = pricingPlanId === "new"
    ? null
    : await prisma.pricingPlan.findUnique({
      where: {
        id: pricingPlanId
      }
    });

  const deviceModels = await prisma.deviceModel.findMany({
    orderBy: {
      name: "asc"
    }
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8'>
        <PricingPlanForm
          initialData={pricingPlan}
          deviceModels={deviceModels}
        />
      </div>
    </div>
  )
}

export default SinglePricingPlanPage;