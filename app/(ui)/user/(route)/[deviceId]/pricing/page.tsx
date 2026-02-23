import { PricingCard } from "./components/price-card"

const plans = [
    {
        id: "basic",
        name: "Basic",
        price: 2999,
        period: "year",
        features: [
            "Add up to 1 device",
            "Real-time AQI monitoring",
            "Basic analytics dashboard",
            "Email support",
            "Cancel anytime",
        ],
    },
    {
        id: "pro",
        name: "Pro",
        price: 7999,
        period: "year",
        featured: true,
        features: [
            "Add up to 5 devices",
            "Advanced analytics",
            "Historical data insights",
            "Priority support",
            "Everything in Basic plan",
        ],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: 19999,
        period: "year",
        features: [
            "Unlimited devices",
            "Advanced reporting & exports",
            "Multi-location tracking",
            "Dedicated account manager",
            "Everything in Pro plan",
        ],
    },
]

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-secondary text-primary py-20 px-4">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">
                        Choose Your Device Plan
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Select a yearly subscription based on how many devices you need to monitor.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <PricingCard key={plan.id} {...plan} />
                    ))}
                </div>
            </div>
        </div>
    )
}