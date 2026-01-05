import { Card } from "@/components/ui/card"
import { CircleHelp } from "lucide-react"

const cities = [
    {
        name: "Ahmedabad",
        aqi: 158,
        temp: "22°C",
        humidity: "53%",
        landmark: (
            <svg
                className="w-20 h-20 text-gray-300"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <path d="M50 20 L70 40 L70 75 L30 75 L30 40 Z" />
                <circle cx="50" cy="35" r="8" />
                <path d="M42 35 L58 35 M50 27 L50 43" />
                <rect x="40" y="60" width="20" height="15" />
            </svg>
        ),
    },
    {
        name: "Bangalore",
        aqi: 12,
        temp: "26°C",
        humidity: "45%",
        borderColor: "border-blue-400",
        landmark: (
            <svg
                className="w-20 h-20 text-gray-300"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <path d="M30 75 L30 40 L50 25 L70 40 L70 75" />
                <circle cx="50" cy="35" r="10" />
                <rect x="40" y="55" width="20" height="20" />
                <path d="M25 75 L75 75" />
            </svg>
        ),
    },
    {
        name: "Chennai",
        aqi: 168,
        temp: "29°C",
        humidity: "62%",
        landmark: (
            <svg
                className="w-20 h-20 text-gray-300"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <path d="M50 20 L50 75" />
                <path d="M35 30 L65 30 M30 40 L70 40 M25 50 L75 50 M30 60 L70 60 M35 70 L65 70" />
                <circle cx="50" cy="25" r="5" />
            </svg>
        ),
    },
    {
        name: "Hyderabad",
        aqi: 133,
        temp: "25°C",
        humidity: "44%",
        landmark: (
            <svg
                className="w-20 h-20 text-gray-300"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <path d="M30 75 L30 50 L50 35 L70 50 L70 75" />
                <circle cx="50" cy="30" r="8" />
                <rect x="40" y="60" width="20" height="15" />
                <path d="M25 50 L35 50 M65 50 L75 50" />
            </svg>
        ),
    },
    {
        name: "Kolkata",
        aqi: 222,
        temp: "18°C",
        humidity: "64%",
        landmark: (
            <svg
                className="w-20 h-20 text-gray-300"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <rect x="35" y="50" width="30" height="25" />
                <path d="M30 50 L50 30 L70 50" />
                <rect x="45" y="60" width="10" height="15" />
                <circle cx="40" cy="40" r="3" />
                <circle cx="60" cy="40" r="3" />
            </svg>
        ),
    },
    {
        name: "Mumbai",
        aqi: 178,
        temp: "32°C",
        humidity: "36%",
        borderColor: "border-orange-400",
        landmark: (
            <svg
                className="w-20 h-20 text-gray-300"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <path d="M30 75 L30 45 M70 75 L70 45" />
                <path d="M30 45 L50 25 L70 45" />
                <rect x="35" y="55" width="10" height="20" />
                <rect x="55" y="55" width="10" height="20" />
                <path d="M25 75 L75 75" strokeWidth="2" />
            </svg>
        ),
    },
    {
        name: "New Delhi",
        aqi: 189,
        temp: "15°C",
        humidity: "63%",
        landmark: (
            <svg
                className="w-20 h-20 text-gray-300"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <path d="M50 25 L50 75" />
                <path d="M30 40 L70 40 M30 50 L70 50 M30 60 L70 60" />
                <rect x="40" y="30" width="20" height="10" />
                <path d="M25 75 L75 75" strokeWidth="2" />
            </svg>
        ),
    },
    {
        name: "Pune",
        aqi: 158,
        temp: "28°C",
        humidity: "30%",
        landmark: (
            <svg
                className="w-20 h-20 text-gray-300"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
            >
                <circle cx="50" cy="45" r="20" />
                <path d="M50 25 L50 15 M50 65 L50 75" />
                <rect x="40" y="60" width="20" height="15" />
                <path d="M30 75 L70 75" />
            </svg>
        ),
    },
]

function getAQIColor(aqi: number) {
    if (aqi <= 50) return "text-green-500"
    if (aqi <= 100) return "text-yellow-500"
    if (aqi <= 150) return "text-orange-500"
    if (aqi <= 200) return "text-red-500"
    return "text-purple-600"
}

export default function PopularCityCards() {
    return (
        <main className="min-h-xl p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 border-b-2 pb-4">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-1">India's Metro Cities</h1>
                    <h2 className="text-xl text-blue-600">Air Quality Index</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cities.map((city) => (
                        <Card
                            key={city.name}
                            className={`relative p-6 bg-white shadow-sm hover:shadow-md transition-shadow border-2 ${city.borderColor || "border-gray-200"
                                }`}
                        >
                            <div className="absolute top-4 right-4">
                                <div className="bg-gray-800 text-white rounded-full p-1">
                                    <CircleHelp className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="shrink-0">{city.landmark}</div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">{city.name}</h3>
                                    <div className={`text-5xl font-bold ${getAQIColor(city.aqi)} mb-4`}>{city.aqi}</div>

                                    <div className="grid grid-cols-2 gap-x-4 text-sm">
                                        <div>
                                            <div className="text-gray-500 mb-1">Temp.</div>
                                            <div className="text-gray-900 font-medium">{city.temp}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1">Hum.</div>
                                            <div className="text-gray-900 font-medium">{city.humidity}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    )
}
