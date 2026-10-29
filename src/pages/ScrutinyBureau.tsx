import React, { useState } from 'react';
import { 
  FileSearch, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Eye, 
  Ban, 
  Check, 
  Building2,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FdrInstrument } from '../types';

interface ScrutinyBureauProps {
  onInspectFdr: (fdrId: string) => void;
  onOpenBankLien: (fdr: FdrInstrument) => void;
}

export const ScrutinyBureau: React.FC<ScrutinyBureauProps> = ({
  onInspectFdr,
  onOpenBankLien
}) => {
  const { fdrList, updateFdrScrutiny, resolveDiscrepancy } = useApp();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'DISCREPANCIES' | 'ALL_PENDING' | 'CLEARED'>('DISCREPANCIES');

  const flaggedList = fdrList.filter(f => f.status === 'DISCREPANCY_FLAGGED');
  const pendingScrutinyList = fdrList.filter(f => f.status === 'SUBMITTED' || f.status === 'BANK_VERIFIED');
  const clearedList = fdrList.filter(f => f.status === 'SCRUTINY_APPROVED' || f.status === 'LIEN_MARKED');

  const currentList = 
    activeTab === 'DISCREPANCIES' ? flaggedList :
    activeTab === 'ALL_PENDING' ? pendingScrutinyList : clearedList;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
            <FileSearch className="w-4 h-4" />
            <span>AICTE Approval Process Handbook • Scrutiny Bureau</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Regulatory Scrutiny & Forensics Queue
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            12-Point Automated Discrepancy Matrix, Error Level Analysis (ELA) Forgery Scanner, and Regional Officer Sanctions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('DISCREPANCIES')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'DISCREPANCIES'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Discrepancies ({flaggedList.length})
          </button>
          <button
            onClick={() => setActiveTab('ALL_PENDING')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'ALL_PENDING'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Review ({pendingScrutinyList.length})
          </button>
          <button
            onClick={() => setActiveTab('CLEARED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'CLEARED'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Scrutiny Cleared ({clearedList.length})
          </button>
        </div>
      </div>

      {/* Scrutiny Cases Grid */}
      <div className="space-y-4">
        {currentList.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">No Cases in this Queue</h3>
            <p className="text-xs text-slate-400 mt-1">All FDR submissions for this filter are processed and up to date.</p>
          </div>
        ) : (
          currentList.map((fdr) => (
            <div
              key={fdr.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all ${
                fdr.isForgedSuspect
                  ? 'border-rose-700/80 bg-rose-950/20'
                  : fdr.discrepancies.length > 0
                  ? 'border-amber-800/60'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{fdr.institutionName}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                      Region: {fdr.region}
                    </span>
                    {fdr.isForgedSuspect && (
                      <span className="text-[10px] bg-rose-950 text-rose-300 px-2.5 py-0.5 rounded-full font-bold border border-rose-800 flex items-center space-x-1 animate-pulse">
                        <ShieldAlert className="w-3 h-3 text-rose-400" />
                        <span>FORGERY SUSPECT (ELA: {((fdr.forgeryConfidenceScore || 0.8) * 100).toFixed(0)}%)</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center space-x-4">
                    <span>FDR No: <strong className="text-slate-200 font-mono">{fdr.fdrNumber}</strong></span>
                    <span>•</span>
                    <span>Bank: <strong className="text-slate-200">{fdr.bankName}</strong></span>
                    <span>•</span>
                    <span>Deposit: <strong className="text-emerald-400 font-mono">₹ {(fdr.depositAmount / 100000).toFixed(1)} Lakhs</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenBankLien(fdr)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    Query Core Banking
                  </button>
                  <button
                    onClick={() => onInspectFdr(fdr.id)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Launch Forensics Inspector</span>
                  </button>
                </div>
              </div>

              {/* Discrepancy Breakdown Section */}
              {fdr.discrepancies.length > 0 && (
                <div className="pt-4 space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Automated Discrepancy Findings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {fdr.discrepancies.map((flag) => (
                      <div
                        key={flag.id}
                        className={`p-3 rounded-xl border text-xs ${
                          flag.severity === 'CRITICAL'
                            ? 'bg-rose-950/30 border-rose-800 text-rose-200'
                            : 'bg-amber-950/30 border-amber-800 text-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="flex items-center space-x-1.5">
                            {flag.severity === 'CRITICAL' ? (
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            <span>{flag.ruleTitle}</span>
                          </span>
                          <span className="text-[10px] font-mono opacity-70">{flag.code}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{flag.description}</p>
                      </div>
                    ))}
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
