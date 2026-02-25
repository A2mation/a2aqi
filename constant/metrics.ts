
export type MetricKey =
    | "Aqi"
    | "Pm25"
    | "Pm10"
    | "PM1"
    | "So2"
    | "No2"
    | "Co2"
    | "Co"
    | "O3"
    | "Noise"
    | "Tvoc"
    | "Smoke"
    | "Methane"
    | "H2"
    | "Ammonia"
    | "H2s"
    | "Temperature"
    | "Humidity";

export const SENSOR_OPTIONS = [
    "aqi", "pm10", "pm25", "so2", "no2", "co2", "co", "o3",
    "noise", "pm1", "tvoc", "smoke", "methane", "h2", "ammonia",
    "h2s", "temperature", "humidity"
];

export const BASE_METRICS: { key: MetricKey; label: string }[] = [
    { key: "Aqi", label: "AQI" },
    { key: "Pm25", label: "PM2.5" },
    { key: "Pm10", label: "PM10" },
    { key: "PM1", label: "PM1" },

    { key: "So2", label: "SO₂" },
    { key: "No2", label: "NO₂" },
    { key: "Co2", label: "CO₂" },
    { key: "Co", label: "CO" },
    { key: "O3", label: "O₃" },

    { key: "Noise", label: "Noise" },
    { key: "Tvoc", label: "TVOC" },
    { key: "Smoke", label: "Smoke" },
    { key: "Methane", label: "Methane" },
    { key: "H2", label: "H₂" },
    { key: "Ammonia", label: "Ammonia" },
    { key: "H2s", label: "H₂S" },

    { key: "Temperature", label: "Temperature" },
    { key: "Humidity", label: "Humidity" },
];

export type AvgMetricKey = `avg${MetricKey}`;
export type MinMetricKey = `min${MetricKey}`;
export type MaxMetricKey = `max${MetricKey}`;

export const AVG_METRIC_OPTIONS: { key: AvgMetricKey; label: string }[] =
    BASE_METRICS.map((m) => ({
        key: `avg${m.key}` as AvgMetricKey,
        label: m.label,
    }));

export const MIN_METRIC_OPTIONS: { key: MinMetricKey; label: string }[] =
    BASE_METRICS.map((m) => ({
        key: `min${m.key}` as MinMetricKey,
        label: m.label,
    }));

export const MAX_METRIC_OPTIONS: { key: MaxMetricKey; label: string }[] =
    BASE_METRICS.map((m) => ({
        key: `max${m.key}` as MaxMetricKey,
        label: m.label,
    }));
