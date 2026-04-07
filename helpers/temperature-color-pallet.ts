export const temperaturePalette = {
    ranges: [
        {
            label: "extreme_cold",
            min: -50,
            max: 0,
            color: "bg-blue-900",
            hex: "#1e3a8a"
        },
        {
            label: "very_cold",
            min: 0,
            max: 10,
            color: "bg-blue-500",
            hex: "#3b82f6"
        },
        {
            label: "cool",
            min: 10,
            max: 20,
            color: "bg-green-400",
            hex: "#4ade80"
        },
        {
            label: "mild",
            min: 20,
            max: 25,
            color: "bg-yellow-300",
            hex: "#fde047"
        },
        {
            label: "warm",
            min: 25,
            max: 30,
            color: "bg-yellow-400",
            hex: "#facc15"
        },
        {
            label: "hot",
            min: 30,
            max: 35,
            color: "bg-orange-400",
            hex: "#fb923c"
        },
        {
            label: "very_hot",
            min: 35,
            max: 40,
            color: "bg-red-500",
            hex: "#ef4444"
        },
        {
            label: "extreme_heat",
            min: 40,
            max: 100,
            color: "bg-red-800",
            hex: "#991b1b"
        }
    ]
} as const;


type TemperatureRange = typeof temperaturePalette.ranges[number];

function getTemperatureRange(temp: number): TemperatureRange {
    return (
        temperaturePalette.ranges.find(
            (range) => temp >= range.min && temp < range.max
        ) ?? temperaturePalette.ranges[temperaturePalette.ranges.length - 1]
    );
}

export function getTemperatureValue<K extends keyof TemperatureRange>(
    temp: number,
    key: K
): TemperatureRange[K] {
    return getTemperatureRange(temp)[key];
}
