import React from 'react';
import { 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Landmark,
  FileText,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FdrInstrument } from '../types';

interface ReleaseRefundWorkflowProps {
  onOpenRefund: (fdr: FdrInstrument) => void;
  onSelectFdr: (fdrId: string) => void;
}

export const ReleaseRefundWorkflow: React.FC<ReleaseRefundWorkflowProps> = ({
  onOpenRefund,
  onSelectFdr
}) => {
  const { fdrList } = useApp();
  const { currentUser } = useAuth();

  const releaseRequested = fdrList.filter(f => f.status === 'RELEASE_REQUESTED');
  const releasedCompleted = fdrList.filter(f => f.status === 'RELEASED');
  const eligibleForRelease = fdrList.filter(f => {
    if (f.status === 'RELEASED' || f.status === 'RELEASE_REQUESTED') return false;
    return f.status === 'MATURED' || f.status === 'MATURING_SOON';
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Official Government Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4 text-blue-700" />
            <span>Statutory 10-Year Lock-In Fulfillment & Discharge Workflow</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Security Deposit Release & Refund Processing
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            AICTE Approval Process Handbook (APH) Clause 2.18 multi-tier scrutiny, judicial affidavit verification, and Core Banking release authorization.
          </p>
        </div>
      </div>

      {/* 4-Stage Statutory Process Blueprint Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          AICTE Prescribed 4-Stage Release Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1">
            <span className="text-blue-900 font-bold block text-[11px]">Stage 1: Institution Request</span>
            <p className="text-slate-700 text-[11px]">
              Submission of completion letter, notarized non-liability affidavit & university NOC.
            </p>
          </div>
          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-1">
            <span className="text-indigo-900 font-bold block text-[11px]">Stage 2: Regional Scrutiny</span>
            <p className="text-slate-700 text-[11px]">
              Regional Officer (RO) site audit, student grievance check, and release recommendation.
            </p>
          </div>
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1">
            <span className="text-amber-900 font-bold block text-[11px]">Stage 3: Executive Bureau Order</span>
            <p className="text-slate-700 text-[11px]">
              Competent Authority (Member Secretary / Advisor) digital sign-off of discharge sanction.
            </p>
          </div>
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
            <span className="text-emerald-900 font-bold block text-[11px]">Stage 4: Bank CBS Lien Discharge</span>
            <p className="text-slate-700 text-[11px]">
              Automated ISO 20022 message dispatch to issuing bank for removal of encumbrance.
            </p>
          </div>
        </div>
      </div>

      {/* Requests In Progress */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Active Release Applications ({releaseRequested.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Under Review by Regulation Bureau</span>
        </div>

        <div className="divide-y divide-slate-100">
          {releaseRequested.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No pending release requests requiring immediate action.
            </div>
          ) : (
            releaseRequested.map(fdr => (
              <div key={fdr.id} className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      RELEASE PENDING
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800">{fdr.fdrNumber}</span>
                    <span className="text-xs text-slate-500">• {fdr.bankName}</span>
                  </div>
                  <div className="font-semibold text-slate-900 text-sm">{fdr.institutionName}</div>
                  <div className="text-xs text-slate-600 flex items-center space-x-4">
                    <span>Maturity: <strong className="text-slate-800">{fdr.maturityDate}</strong></span>
                    <span>Deposit: <strong className="text-slate-800 font-mono">₹ {(fdr.depositAmount / 100000).toFixed(1)} Lakhs</strong></span>
                    <span>Region: <strong className="text-slate-800">{fdr.region}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => onOpenRefund(fdr)}
                    className="px-3.5 py-1.5 bg-[#0B3558] hover:bg-[#07243c] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
                  >
                    <span>Inspect & Review Sanction</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Eligible Instruments */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Eligible For Release After Lock-In Period ({eligibleForRelease.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Matured or nearing completion</span>
        </div>

        <div className="divide-y divide-slate-100">
          {eligibleForRelease.map(fdr => (
            <div key={fdr.id} className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    ELIGIBLE
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800">{fdr.fdrNumber}</span>
                  <span className="text-xs text-slate-500">• {fdr.bankName}</span>
                </div>
                <div className="font-semibold text-slate-900 text-sm">{fdr.institutionName}</div>
                <div className="text-xs text-slate-600 flex items-center space-x-4">
                  <span>Maturity Date: <strong className="text-slate-800">{fdr.maturityDate}</strong></span>
                  <span>Amount: <strong className="text-slate-800 font-mono">₹ {(fdr.depositAmount / 100000).toFixed(1)} Lakhs</strong></span>
                </div>
              </div>

              <button
                onClick={() => onOpenRefund(fdr)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <span>Initiate Discharge Dossier</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
