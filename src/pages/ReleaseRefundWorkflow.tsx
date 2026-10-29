import React from 'react';
import { 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Landmark,
  FileText
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
    const now = new Date();
    const maturity = new Date(fdrList[0]?.maturityDate || '');
    return f.status === 'MATURED' || f.status === 'MATURING_SOON';
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <FileCheck className="w-4 h-4" />
          <span>Statutory 10-Year Lock-In Fulfillment</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Security Deposit Release & Refund Processing Portal
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          AICTE Approval Process Handbook (APH) Clause 2.18 multi-tier scrutiny, judicial affidavit verification, and automated Core Banking disbursement.
        </p>
      </div>

      {/* 4-Stage Statutory Process Blueprint Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          AICTE Prescribed 4-Stage Release Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
            <span className="text-blue-400 font-bold block text-[11px]">Stage 1: Institution Request</span>
            <p className="text-slate-300 text-[11px]">
              Submission of completion letter, notarized non-liability affidavit & university NOC.
            </p>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
            <span className="text-purple-400 font-bold block text-[11px]">Stage 2: Regional Scrutiny</span>
            <p className="text-slate-300 text-[11px]">
              Regional Officer (RO) site audit, student grievance check, and release recommendation.
            </p>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
            <span className="text-amber-400 font-bold block text-[11px]">Stage 3: Bureau Sanction</span>
            <p className="text-slate-300 text-[11px]">
              Regulation Bureau Central HQ sanction order issuance & lien revocation decree.
            </p>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
            <span className="text-emerald-400 font-bold block text-[11px]">Stage 4: Bank Disbursement</span>
            <p className="text-slate-300 text-[11px]">
              Core Banking electronic fund release directly to applicant Trust bank account.
            </p>
          </div>
        </div>
      </div>

      {/* Active Release Dossiers Queue */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Active Release & Refund Dossiers Under Review ({releaseRequested.length})
        </h3>

        {releaseRequested.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
            <p className="text-sm">No active release requests pending scrutiny.</p>
          </div>
        ) : (
          releaseRequested.map((fdr) => (
            <div
              key={fdr.id}
              className="bg-slate-900 border border-blue-900/60 rounded-2xl p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{fdr.institutionName}</span>
                    <span className="font-mono text-xs text-blue-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      Req ID: {fdr.releaseRequest?.requestId}
                    </span>
                    <span className="text-[10px] bg-blue-950 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-800">
                      {fdr.releaseRequest?.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mt-1 flex items-center space-x-4">
                    <span>FDR: <strong className="text-white font-mono">{fdr.fdrNumber}</strong></span>
                    <span>•</span>
                    <span>Release Sum: <strong className="text-emerald-400 font-mono">₹ {(fdr.depositAmount / 100000).toFixed(1)} Lakhs</strong></span>
                    <span>•</span>
                    <span>Region: <strong className="text-slate-300">{fdr.region}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenRefund(fdr)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Execute Release Sanction Order</span>
                </button>
              </div>

              {/* Verified Attachments */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Judicial Non-Liability Affidavit</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Original FDR Certificate Verified</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>University No-Dues Certificate</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed Releases History */}
      {releasedCompleted.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Completed & Disbursed Releases ({releasedCompleted.length})
          </h3>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Institution & FDR No</th>
                  <th className="px-4 py-3">Sanction Order</th>
                  <th className="px-4 py-3">Disbursed Amount</th>
                  <th className="px-4 py-3">Bank UTR Number</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {releasedCompleted.map(fdr => (
                  <tr key={fdr.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{fdr.institutionName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{fdr.fdrNumber}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      {fdr.releaseRequest?.bureauSanctionOrderNo || 'AICTE-REG-SANCTION-01'}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                      ₹ {(fdr.depositAmount / 100000).toFixed(1)} Lakhs
                    </td>
                    <td className="px-4 py-3 font-mono text-purple-400">
                      {fdr.releaseRequest?.refundUtrNumber || 'UTR-AICTE-SBIN-992102'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded font-bold text-[10px]">
                        RELEASED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
