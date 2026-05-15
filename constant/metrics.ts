export type MetricKey =
    | "Aqi"
    | "Pm25"
    | "Pm10"
    | "Pm1"
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

export const PARAM_MASTER_CONFIG = [
    { id: 'aqi', label: 'AQI', color: '#6366f1', shadow: 'shadow-indigo-200' },
    { id: 'pm25', label: 'PM2.5', color: '#06b6d4', shadow: 'shadow-cyan-200' },
    { id: 'pm10', label: 'PM10', color: '#8b5cf6', shadow: 'shadow-purple-200' },
    { id: 'pm1', label: 'PM1.0', color: '#6366f1', shadow: 'shadow-indigo-300' },
    { id: 'temperature', label: 'Temp', color: '#f59e0b', shadow: 'shadow-orange-200' },
    { id: 'humidity', label: 'Humidity', color: '#3b82f6', shadow: 'shadow-blue-200' },
    { id: 'co2', label: 'CO2', color: '#10b981', shadow: 'shadow-emerald-200' },
    { id: 'co', label: 'CO', color: '#14b8a6', shadow: 'shadow-teal-200' },
    { id: 'no2', label: 'NO2', color: '#ef4444', shadow: 'shadow-red-200' },
    { id: 'so2', label: 'SO2', color: '#f97316', shadow: 'shadow-orange-400' },
    { id: 'o3', label: 'Ozone', color: '#ec4899', shadow: 'shadow-pink-200' },
    { id: 'tvoc', label: 'TVOC', color: '#84cc16', shadow: 'shadow-lime-200' },
    { id: 'noise', label: 'Noise', color: '#a855f7', shadow: 'shadow-purple-400' },
    { id: 'smoke', label: 'Smoke', color: '#64748b', shadow: 'shadow-slate-300' },
    { id: 'methane', label: 'Methane', color: '#adff2f', shadow: 'shadow-green-200' },
    { id: 'ammonia', label: 'Ammonia', color: '#fbbf24', shadow: 'shadow-yellow-300' },
    { id: 'h2', label: 'H2', color: '#22d3ee', shadow: 'shadow-cyan-400' },
    { id: 'h2s', label: 'H2S', color: '#94a3b8', shadow: 'shadow-slate-400' },
];

export const BASE_METRICS: { key: MetricKey; label: string }[] = [
    { key: "Aqi", label: "AQI" },
    { key: "Pm25", label: "PM2.5" },
    { key: "Pm10", label: "PM10" },
    { key: "Pm1", label: "PM1" },

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
