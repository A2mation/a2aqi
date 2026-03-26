import React from 'react';
import * as Icons from 'lucide-react';

const TechnicalSpecs = ({ product }: { product: any }) => {
    return (
        <section className="mt-16 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="p-8 border-b rounded-t-[2.5rem] border-slate-50 bg-slate-50/50">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Icons.FileText className="text-blue-600" />
                    Full Technical Specifications
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {product.specs.map((spec: any, i: number) => (
                    <div
                        key={i}
                        className={`flex items-center justify-between p-6 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                            } border-b border-slate-100 last:border-0 md:nth-last-[-n+2]:border-0`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                {/* Using our dynamic icon helper here */}
                                {React.createElement((Icons as any)[spec.icon] || Icons.HelpCircle, { size: 18 })}
                            </div>
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                {spec.label}
                            </span>
                        </div>
                        <span className="text-base font-bold text-slate-900 text-right">
                            {spec.value}
                        </span>
                    </div>
                ))}

                {/* Logistics & Special Info (Dynamic Add-ons) */}
                <div className="flex items-center justify-between rounded-b-[2.5rem] p-6 bg-blue-600 text-white md:col-span-2">
                    <div className="flex items-center gap-4">
                        <Icons.Package size={20} />
                        <span className="text-sm font-bold uppercase tracking-wider">Minimum Order Quantity</span>
                    </div>
                    <span className="text-lg font-black">{product.logistics.moq || '1 Unit'}</span>
                </div>
            </div>
        </section>
    );
};

export default TechnicalSpecs;