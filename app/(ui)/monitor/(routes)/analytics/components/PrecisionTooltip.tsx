export const PrecisionTooltip = ({ active, payload, label, isDelta, unit, baselineId, devicesList }: any) => {
    if (!active || !payload) return null;
    return (
        <div className="bg-white/95 backdrop-blur-xl border border-gray-100 p-6 rounded-[2.5rem] shadow-2xl min-w-55">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">{label}</p>
            <div className="space-y-4">
                {payload.map((item: any) => {
                    if (isDelta && item.name === baselineId) return null;

                    const val = typeof item.value === 'number' ? Math.round(item.value * 10) / 10 : 'N/A';
                    const isPos = typeof val === 'number' && val > 0;
                    const device = devicesList.find((d: any) => d.serialNo === item.name);

                    return (
                        <div key={item.name} className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.stroke }} />
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-slate-700">{item.name}</span>
                                    <span className="text-[8px] text-gray-400 font-bold uppercase">{device?.location}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-sm font-black ${isDelta ? (isPos ? 'text-emerald-500' : 'text-red-500') : 'text-slate-900'}`}>
                                    {isDelta && isPos ? '+' : ''}{val}
                                </span>
                                <span className="ml-1 text-[10px] font-bold text-gray-400">{unit}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            {isDelta && (
                <div className="mt-4 pt-3 border-t border-gray-50">
                    <p className="text-[9px] font-bold text-gray-400 italic">Variance relative to {baselineId}</p>
                </div>
            )}
        </div>
    );
};