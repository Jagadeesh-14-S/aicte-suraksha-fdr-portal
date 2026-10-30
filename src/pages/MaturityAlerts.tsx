import React, { useState } from 'react';
import { 
  ClockAlert, 
  AlertTriangle, 
  Calendar, 
  Send, 
  CheckCircle2, 
  RotateCw, 
  Mail, 
  MessageSquare, 
  PhoneCall,
  FileCheck2,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FdrInstrument } from '../types';

interface MaturityAlertsProps {
  onOpenRefund: (fdr: FdrInstrument) => void;
  onSelectFdr: (fdrId: string) => void;
}

export const MaturityAlerts: React.FC<MaturityAlertsProps> = ({
  onOpenRefund,
  onSelectFdr
}) => {
  const { fdrList, renewFdrInstrument } = useApp();
  const { currentUser } = useAuth();

  const [dispatchedId, setDispatchedId] = useState<string | null>(null);
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const [newMaturityDate, setNewMaturityDate] = useState(
    new Date(Date.now() + 10 * 365.25 * 86400000).toISOString().split('T')[0]
  );

  const now = new Date();

  // Categorize FDRs
  const overdueList: { fdr: FdrInstrument; daysDiff: number }[] = [];
  const imminent30List: { fdr: FdrInstrument; daysDiff: number }[] = [];
  const warning90List: { fdr: FdrInstrument; daysDiff: number }[] = [];
  const safeList: { fdr: FdrInstrument; daysDiff: number }[] = [];

  fdrList.forEach(fdr => {
    if (fdr.status === 'RELEASED') return;
    const maturity = new Date(fdr.maturityDate);
    const daysDiff = Math.ceil((maturity.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      overdueList.push({ fdr, daysDiff });
    } else if (daysDiff <= 30) {
      imminent30List.push({ fdr, daysDiff });
    } else if (daysDiff <= 90) {
      warning90List.push({ fdr, daysDiff });
    } else {
      safeList.push({ fdr, daysDiff });
    }
  });

  const handleDispatchNotice = (fdrId: string) => {
    setDispatchedId(fdrId);
    setTimeout(() => {
      setDispatchedId(null);
    }, 2500);
  };

  const handleRenew = async (fdrId: string) => {
    await renewFdrInstrument(fdrId, {}, newMaturityDate);
    setRenewingId(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Official Government Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
            <ClockAlert className="w-4 h-4 text-amber-600" />
            <span>Automated Timeline & Predictive Escalations Module</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Security Deposit Validity & Maturity Tracker
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Predictive tracking for 10-year lock-ins, automatic 90-60-30 day alerts, and escalation triggers under AICTE Approval Process Handbook (APH).
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg font-medium">
            Next Cron Sweep: <strong>23:59 IST (Daily)</strong>
          </span>
        </div>
      </div>

      {/* Escalation Category Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-sm flex items-center justify-between border-l-4 border-l-rose-600">
          <div>
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">Overdue / Matured</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{overdueList.length}</span>
            <span className="text-[11px] text-slate-500">Requires immediate renewal / release</span>
          </div>
          <AlertCircle className="w-8 h-8 text-rose-600/60" />
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm flex items-center justify-between border-l-4 border-l-amber-500">
          <div>
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">Expiring &lt; 30 Days</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{imminent30List.length}</span>
            <span className="text-[11px] text-slate-500">Tier-3 SMS & Notice active</span>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500/60" />
        </div>

        <div className="bg-white border border-yellow-200 rounded-xl p-4 shadow-sm flex items-center justify-between border-l-4 border-l-yellow-500">
          <div>
            <span className="text-xs font-semibold text-yellow-800 uppercase tracking-wider block">Expiring 31–90 Days</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{warning90List.length}</span>
            <span className="text-[11px] text-slate-500">Advance reminder sent</span>
          </div>
          <ClockAlert className="w-8 h-8 text-yellow-600/60" />
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm flex items-center justify-between border-l-4 border-l-emerald-600">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">Compliant (&gt; 90 Days)</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{safeList.length}</span>
            <span className="text-[11px] text-slate-500">Within valid regulatory term</span>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-600/60" />
        </div>
      </div>

      {/* Main Action List */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Time-Sensitive Instruments Requiring Administrative Follow-Up
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Total Monitored: {fdrList.length} Instruments
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {[...overdueList, ...imminent30List, ...warning90List].length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All instruments have healthy maturity validity. No pending expirations within 90 days.
            </div>
          ) : (
            [...overdueList, ...imminent30List, ...warning90List].map(({ fdr, daysDiff }) => {
              const isOverdue = daysDiff < 0;
              const isImminent = daysDiff >= 0 && daysDiff <= 30;

              return (
                <div key={fdr.id} className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        isOverdue 
                          ? 'bg-rose-100 text-rose-800 border-rose-200' 
                          : isImminent 
                            ? 'bg-amber-100 text-amber-800 border-amber-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {isOverdue ? `EXPIRED (${Math.abs(daysDiff)} DAYS AGO)` : `MATURING IN ${daysDiff} DAYS`}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-800">{fdr.fdrNumber}</span>
                      <span className="text-xs text-slate-500">• {fdr.bankName}</span>
                    </div>
                    <div className="font-semibold text-slate-900 text-sm">{fdr.institutionName}</div>
                    <div className="text-xs text-slate-600 flex items-center space-x-4">
                      <span>Maturity Date: <strong className="text-slate-800">{fdr.maturityDate}</strong></span>
                      <span>Amount: <strong className="text-slate-800 font-mono">₹ {(fdr.depositAmount / 100000).toFixed(1)} Lakhs</strong></span>
                      <span>Region: <strong className="text-slate-800">{fdr.region}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleDispatchNotice(fdr.id)}
                      disabled={dispatchedId === fdr.id}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-600" />
                      <span>{dispatchedId === fdr.id ? 'Notice Dispatched ✓' : 'Dispatch Regulatory Notice'}</span>
                    </button>

                    <button
                      onClick={() => onOpenRefund(fdr)}
                      className="px-3.5 py-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Process Release / Renewal</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
