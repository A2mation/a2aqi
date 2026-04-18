import { Activity, Droplets, Thermometer, Wind } from "lucide-react";



const StatHighlight = () => {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatHighlightGrid label="Air Quality Index" value="42" unit="AQI" icon={Wind} color="text-purple-600" />
                <StatHighlightGrid label="Particulate Matter" value="12.5" unit="PM2.5" icon={Activity} color="text-blue-600" />
                <StatHighlightGrid label="Ambient Temp" value="24.8" unit="°C" icon={Thermometer} color="text-orange-600" />
                <StatHighlightGrid label="Relative Humidity" value="56" unit="%" icon={Droplets} color="text-cyan-600" />
            </div>
        </>
    )
}

export default StatHighlight


const StatHighlightGrid = ({ label, value, unit, icon: Icon, color }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10 ${color.replace('text', 'bg')}`}>
                <Icon size={18} className={color} />
            </div>
            <span className="text-sm font-medium text-gray-500">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            <span className="text-xs font-semibold text-gray-400">{unit}</span>
        </div>
    </div>
);