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
  Bell
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <ClockAlert className="w-4 h-4" />
            <span>Automated Timeline & Predictive Escalations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Maturity & Validity Tracking Radar
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking of 8-10 year lock-in tenures, advance reminder dispatches, and renewal compliance.
          </p>
        </div>
      </div>

      {/* Escalation Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1: Overdue */}
        <div className="bg-rose-950/30 border border-rose-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-bold uppercase tracking-wider">Overdue (&gt; 10 Years)</span>
            <span className="text-lg font-bold font-mono">{overdueList.length}</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Statutory lock-in expired. Immediate renewal or authorized refund processing mandated.
          </p>
        </div>

        {/* Tier 2: Imminent 30 Days */}
        <div className="bg-amber-950/30 border border-amber-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Matures in &le; 30 Days</span>
            <span className="text-lg font-bold font-mono">{imminent30List.length}</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Omnichannel alerts (SMS, Email, WhatsApp) dispatched automatically every 72 hours.
          </p>
        </div>

        {/* Tier 3: 90 Days Warning */}
        <div className="bg-blue-950/30 border border-blue-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-xs font-bold uppercase tracking-wider">Advance Notice (&le; 90 Days)</span>
            <span className="text-lg font-bold font-mono">{warning90List.length}</span>
          </div>
          <p className="text-[11px] text-slate-300">
            T-90 reminder triggered to trust management for board resolution on renewal or release.
          </p>
        </div>
      </div>

      {/* Actionable Maturity Queue */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Instruments Requiring Imminent Regulatory Action
        </h3>

        {[...overdueList, ...imminent30List, ...warning90List].length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-white">No Imminent Expiries</p>
            <p className="text-xs text-slate-400 mt-1">All fixed deposits have healthy tenures exceeding 90 days.</p>
          </div>
        ) : (
          [...overdueList, ...imminent30List, ...warning90List].map(({ fdr, daysDiff }) => (
            <div
              key={fdr.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-sm space-y-4 ${
                daysDiff < 0
                  ? 'border-rose-800/80 bg-rose-950/20'
                  : daysDiff <= 30
                  ? 'border-amber-800/80 bg-amber-950/20'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{fdr.institutionName}</span>
                    <span className="font-mono text-xs text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {fdr.fdrNumber}
                    </span>
                    {daysDiff < 0 ? (
                      <span className="text-[10px] bg-rose-950 text-rose-300 font-bold px-2.5 py-0.5 rounded-full border border-rose-800 animate-pulse">
                        OVERDUE ({Math.abs(daysDiff)} DAYS)
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-950 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-800">
                        {daysDiff} DAYS REMAINING
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center space-x-4">
                    <span>Maturity Date: <strong className="text-white font-mono">{fdr.maturityDate}</strong></span>
                    <span>•</span>
                    <span>Deposit: <strong className="text-emerald-400 font-mono">₹ {(fdr.depositAmount / 100000).toFixed(1)} Lakhs</strong></span>
                    <span>•</span>
                    <span>Bank: <strong className="text-slate-300">{fdr.bankName}</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleDispatchNotice(fdr.id)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {dispatchedId === fdr.id ? 'Notice Dispatched!' : 'Dispatch Notice (SMS/Email)'}
                    </span>
                  </button>

                  <button
                    onClick={() => setRenewingId(renewingId === fdr.id ? null : fdr.id)}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Record Renewal</span>
                  </button>

                  <button
                    onClick={() => onOpenRefund(fdr)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-colors"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Process Release</span>
                  </button>
                </div>
              </div>

              {/* Inline Renewal Drawer */}
              {renewingId === fdr.id && (
                <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-3 text-xs animate-in slide-in-from-top-2">
                  <h4 className="font-bold text-white">Record Statutory 10-Year Renewal</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">New Maturity Date</label>
                      <input
                        type="date"
                        value={newMaturityDate}
                        onChange={e => setNewMaturityDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => handleRenew(fdr.id)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md"
                      >
                        Confirm Renewal & Update Merkle Ledger
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

