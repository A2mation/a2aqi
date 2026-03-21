import React from 'react'

const ExportLogs = () => {
    return (
        <>
            <div className="mt-8 grid grid-cols-1 gap-8">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Recent Export Logs</h3>
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 font-medium">Weekly_Report_Oct_0{i}.pdf</span>
                                <span className="text-xs font-bold text-gray-400 font-mono">2.4 MB</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExportLogs
