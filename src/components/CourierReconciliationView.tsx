import React, { useState } from 'react';
import { Truck, CheckCircle, RefreshCw, FileText, Download, ArrowUpRight } from 'lucide-react';

export const CourierReconciliationView: React.FC = () => {
  const [courier, setCourier] = useState('ALL');

  const statements = [
    {
      id: 'REC-2026-03-A',
      courier: 'TRAX Sonic',
      period: '01 Mar - 07 Mar 2026',
      totalDelivered: 42,
      grossCodPKR: 114500,
      freightDeductedPKR: 9800,
      netSettledPKR: 104700,
      status: 'RECONCILED',
      disbursedDate: '2026-03-08',
    },
    {
      id: 'REC-2026-03-B',
      courier: 'PostEx Rapid',
      period: '01 Mar - 07 Mar 2026',
      totalDelivered: 28,
      grossCodPKR: 68400,
      freightDeductedPKR: 5600,
      netSettledPKR: 62800,
      status: 'RECONCILED',
      disbursedDate: '2026-03-08',
    },
    {
      id: 'REC-2026-03-C',
      courier: 'TCS COD',
      period: '08 Mar - 14 Mar 2026',
      totalDelivered: 19,
      grossCodPKR: 54200,
      freightDeductedPKR: 4900,
      netSettledPKR: 49300,
      status: 'PROCESSING',
      disbursedDate: 'Expected Today',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 p-6 sm:p-8 border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-400">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Courier COD Reconciliation & Payment Remittance</h2>
            <p className="text-xs text-slate-300">
              Automated settlement auditing across Trax, PostEx, TCS and Leopards API remittances.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {statements.map((st) => (
          <div
            key={st.id}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-slate-900 p-6 border border-slate-800"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-bold text-xs">{st.id}</span>
                <span className="font-bold text-white text-base">{st.courier}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    st.status === 'RECONCILED'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {st.status}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Billing Cycle: {st.period} • {st.totalDelivered} Delivered Parcels
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div className="rounded-2xl bg-slate-950 p-2.5 border border-slate-800">
                <div className="text-[10px] text-slate-400">Gross COD Collected</div>
                <div className="font-bold font-mono text-white">Rs. {st.grossCodPKR.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-slate-950 p-2.5 border border-slate-800">
                <div className="text-[10px] text-slate-400">Freight & COD Fees</div>
                <div className="font-bold font-mono text-red-400">-Rs. {st.freightDeductedPKR.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-emerald-950/30 p-2.5 border border-emerald-500/30">
                <div className="text-[10px] text-emerald-400">Net Remittance</div>
                <div className="font-extrabold font-mono text-emerald-400">Rs. {st.netSettledPKR.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
