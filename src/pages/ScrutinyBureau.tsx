import React, { useState } from 'react';
import { 
  FileSearch, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FdrInstrument } from '../types';

interface ScrutinyBureauProps {
  onInspectFdr: (fdrId: string) => void;
  onOpenBankLien: (fdr: FdrInstrument) => void;
}

export const ScrutinyBureau: React.FC<ScrutinyBureauProps> = ({
  onInspectFdr,
  onOpenBankLien
}) => {
  const { fdrList } = useApp();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#C2410C] uppercase tracking-wider mb-1">
            <FileSearch className="w-4 h-4 text-amber-700" />
            <span>AICTE Approval Process Handbook • Regional Scrutiny Bureau</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif">
            Regulatory Scrutiny & Document Forensics Queue
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            12-Point Automated Discrepancy Matrix, Error Level Analysis (ELA) Forgery Scanner, and Regional Officer Hearing Sanctions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-white border border-slate-300 p-1 rounded-lg text-xs shadow-sm">
          <button
            onClick={() => setActiveTab('DISCREPANCIES')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'DISCREPANCIES'
                ? 'bg-red-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Discrepancies ({flaggedList.length})
          </button>
          <button
            onClick={() => setActiveTab('ALL_PENDING')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'ALL_PENDING'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Review ({pendingScrutinyList.length})
          </button>
          <button
            onClick={() => setActiveTab('CLEARED')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'CLEARED'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scrutiny Cleared ({clearedList.length})
          </button>
        </div>
      </div>

      {/* Scrutiny Cases Grid */}
      <div className="space-y-4">
        {currentList.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center text-slate-500 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No Cases in this Queue</h3>
            <p className="text-xs text-slate-500 mt-1">All FDR submissions for this filter are processed and up to date.</p>
          </div>
        ) : (
          currentList.map((fdr) => (
            <div
              key={fdr.id}
              className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${
                fdr.isForgedSuspect
                  ? 'border-red-300 bg-red-50/20'
                  : fdr.discrepancies.length > 0
                  ? 'border-amber-300 bg-amber-50/10'
                  : 'border-slate-200/90'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{fdr.institutionName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono border border-slate-200">
                      Region: {fdr.region}
                    </span>
                    {fdr.isForgedSuspect && (
                      <span className="text-[10px] bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold border border-red-300 flex items-center space-x-1">
                        <ShieldAlert className="w-3 h-3 text-red-700" />
                        <span>FORGERY SUSPECT (ELA: {((fdr.forgeryConfidenceScore || 0.8) * 100).toFixed(0)}%)</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center space-x-4">
                    <span>FDR No: <strong className="text-slate-900 font-mono">{fdr.fdrNumber}</strong></span>
                    <span>•</span>
                    <span>Bank: <strong className="text-slate-900">{fdr.bankName}</strong></span>
                    <span>•</span>
                    <span>Deposit: <strong className="text-emerald-700 font-mono font-bold">₹ {(fdr.depositAmount / 100000).toFixed(1)} Lakhs</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenBankLien(fdr)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors shadow-sm flex items-center space-x-1"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                    <span>Query CBS</span>
                  </button>
                  <button
                    onClick={() => onInspectFdr(fdr.id)}
                    className="px-4 py-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Launch Forensics Inspector</span>
                  </button>
                </div>
              </div>

              {/* Discrepancy Breakdown Section */}
              {fdr.discrepancies.length > 0 && (
                <div className="pt-4 space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Automated Statutory Scrutiny Observations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {fdr.discrepancies.map((flag) => (
                      <div
                        key={flag.id}
                        className={`p-3 rounded-lg border text-xs ${
                          flag.severity === 'CRITICAL'
                            ? 'bg-red-50 border-red-200 text-red-900'
                            : 'bg-amber-50 border-amber-200 text-amber-900'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="flex items-center space-x-1.5">
                            {flag.severity === 'CRITICAL' ? (
                              <ShieldAlert className="w-3.5 h-3.5 text-red-700" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                            )}
                            <span>{flag.ruleTitle}</span>
                          </span>
                          <span className="text-[10px] font-mono opacity-80">{flag.code}</span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed">{flag.description}</p>
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
