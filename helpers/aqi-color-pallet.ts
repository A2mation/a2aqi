type AQIPallet = {
    label: string;
    color: string;
    borderClass: string;
    bg: string;
    text: string;
    card: string;
    backgroundColor: string;
    range: [number, number];
};

export const aqiColorPallet: AQIPallet[] = [
    {
        label: "Good",
        color: "#00E400",
        borderClass: "border-green-500",
        backgroundColor: "bg-green-500",
        bg: "from-green-100 via-green-50 to-green-100 dark:from-green-950 dark:via-green-900 dark:to-green-950",
        text: "text-green-600 dark:text-green-400",
        card: "bg-green-50/80 dark:bg-green-950/40",
        range: [0, 50]
    },
    {
        label: "Moderate",
        color: "#FFFF00",
        borderClass: "border-yellow-400",
        backgroundColor: "bg-yellow-500",
        bg: "from-yellow-100 via-yellow-50 to-yellow-100 dark:from-yellow-950 dark:via-yellow-900 dark:to-yellow-950",
        text: "text-yellow-700 dark:text-yellow-400",
        card: "bg-yellow-50/80 dark:bg-yellow-950/40",
        range: [51, 100]
    },
    {
        label: "Unhealthy for Sensitive Groups",
        color: "#FF7E00",
        borderClass: "border-orange-500",
        backgroundColor: "bg-orange-500",
        bg: "from-orange-100 via-orange-50 to-orange-100 dark:from-orange-950 dark:via-orange-900 dark:to-orange-950",
        text: "text-orange-700 dark:text-orange-400",
        card: "bg-orange-50/80 dark:bg-orange-950/40",
        range: [101, 150]
    },
    {
        label: "Unhealthy",
        color: "#FF0000",
        borderClass: "border-red-500",
        backgroundColor: "bg-red-500",
        bg: "from-red-100 via-red-50 to-red-100 dark:from-red-950 dark:via-red-900 dark:to-red-950",
        text: "text-red-700 dark:text-red-400",
        card: "bg-red-50/80 dark:bg-red-950/40",
        range: [151, 200]
    },
    {
        label: "Very Unhealthy",
        color: "#4C002A",
        borderClass: "border-red-500",
        backgroundColor: "bg-purple-500",
        bg: "from-purple-200 via-purple-100 to-purple-200 dark:from-purple-950 dark:via-purple-900 dark:to-purple-950",
        text: "text-purple-700 dark:text-purple-400",
        card: "bg-purple-100/80 dark:bg-purple-950/40",
        range: [201, 300]
    },
    {
        label: "Hazardous",
        color: "#7E0023",
        borderClass: "border-red-500",
        backgroundColor: "bg-purple-800",
        bg: "from-rose-900 via-red-950 to-black",
        text: "text-rose-600",
        card: "bg-rose-950/70",
        range: [301, 500]
    },
];

export const getAQIBorderClass = (aqi: number): string => {
    return aqiColorPallet.find(
        (p) => aqi >= p.range[0] && aqi <= p.range[1]
    )?.borderClass ?? "border-gray-200";
}

export const getAQIColor = (aqi: number): string => {
    return (
        aqiColorPallet.find(
            (p) => aqi >= p.range[0] && aqi <= p.range[1]
        )?.color ?? "#000000"
    );
};

export const getAQIBgColor = (aqi: number): string => {
    return (
        aqiColorPallet.find(
            (p) => aqi >= p.range[0] && aqi <= p.range[1]
        )?.backgroundColor ?? "bg-black"
    );
};

export type AQITheme = {
  label: string
  color: string
  borderClass: string
  bg: string
  text: string
  card: string
}

export const getAQITheme = (value: number): AQITheme => {
  return (
    aqiColorPallet.find(
      (p) => value >= p.range[0] && value <= p.range[1]
    ) ?? {
      label: "Unknown",
      color: "#000000",
      borderClass: "border-gray-300",
      bg: "from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800",
      text: "text-gray-600 dark:text-gray-400",
      card: "bg-gray-50/80 dark:bg-gray-900/40",
    }
  )
}