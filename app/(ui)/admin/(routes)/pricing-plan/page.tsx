export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { format } from 'date-fns'

import { prisma } from '@/lib/prisma'
import { PricingPlanClient } from './components/client'
import { PricingPlanColumn } from './components/columns';

const PricingPlanPage = async () => {
  const allPricingPlans = await prisma.pricingPlan.findMany({
    include: {
      model: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const formattedPricingPlans: PricingPlanColumn[] = allPricingPlans.map((item) => ({
    id: item.id,
    modelName: item.model.name,
    duration: item.duration,
    price: new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: item.currency,
    }).format(item.price),

    isEnabled: item.isEnabled,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <section className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <PricingPlanClient data={formattedPricingPlans} />
      </div>
    </section>
  )
}

export default PricingPlanPage