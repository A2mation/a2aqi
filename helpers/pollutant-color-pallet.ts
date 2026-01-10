export type PollutantType =
    | "pm25"
    | "pm10"
    | "co"
    | "so2"
    | "no2"
    | "o3";

export function getPollutantBorderClass(
    type: PollutantType,
    value: number
) {
    switch (type) {
        case "pm25":
            if (value <= 30) return "border-green-500";
            if (value <= 60) return "border-yellow-500";
            if (value <= 90) return "border-orange-500";
            if (value <= 120) return "border-red-500";
            return "border-purple-600";

        case "pm10":
            if (value <= 50) return "border-green-500";
            if (value <= 100) return "border-yellow-500";
            if (value <= 250) return "border-orange-500";
            if (value <= 350) return "border-red-500";
            return "border-purple-600";

        case "co":
            if (value <= 4000) return "border-green-500";
            if (value <= 8000) return "border-yellow-500";
            if (value <= 12000) return "border-orange-500";
            if (value <= 16000) return "border-red-500";
            return "border-purple-600";

        case "so2":
            if (value <= 40) return "border-green-500";
            if (value <= 80) return "border-yellow-500";
            if (value <= 380) return "border-orange-500";
            if (value <= 800) return "border-red-500";
            return "border-purple-600";

        case "no2":
            if (value <= 40) return "border-green-500";
            if (value <= 80) return "border-yellow-500";
            if (value <= 180) return "border-orange-500";
            if (value <= 280) return "border-red-500";
            return "border-purple-600";

        case "o3":
            if (value <= 50) return "border-green-500";
            if (value <= 100) return "border-yellow-500";
            if (value <= 168) return "border-orange-500";
            if (value <= 208) return "border-red-500";
            return "border-purple-600";
    }
}


export function getPollutantGradientClass(
    type: PollutantType,
    value: number
) {
    const base =
        getPollutantBorderClass(type, value)
            .replace("border-", "");

    return `bg-gradient-to-br from-${base} to-${base}`;
}
