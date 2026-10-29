import React, { useState } from 'react';
import { 
  X, 
  FileCheck, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  Landmark,
  BadgeAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FdrInstrument } from '../types';

interface RefundWorkflowModalProps {
  fdr: FdrInstrument | null;
  onClose: () => void;
}

export const RefundWorkflowModal: React.FC<RefundWorkflowModalProps> = ({ fdr, onClose }) => {
  const { submitReleaseRequest, processReleaseBureauDecision } = useApp();
  const { currentUser } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [sanctionNumber, setSanctionNumber] = useState(`AICTE/REG/FDR-REL/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
  const [bureauRemarks, setBureauRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!fdr) return null;

  const currentReq = fdr.releaseRequest;

  // Handle Bureau approval
  const handleApproveBureau = async () => {
    setSubmitting(true);
    await processReleaseBureauDecision(
      fdr.id,
      true,
      sanctionNumber,
      bureauRemarks || 'All statutory conditions fulfilled. Sanctioned for electronic refund.'
    );
    setSubmitting(false);
    onClose();
  };

  // Handle Institution initial submission
  const handleInitSubmission = async () => {
    setSubmitting(true);
    await submitReleaseRequest(fdr.id, {
      reason: 'MATURITY_COMPLETED_10_YEARS',
      affidavitSubmitted: true,
      noDueCertificateSubmitted: true
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Security Deposit Release & Refund Gateway</h3>
              <p className="text-[11px] text-slate-300">
                AICTE APH Clause 2.18 Multi-Tier Statutory Verification Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Stage Stepper Header */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 grid grid-cols-4 gap-2 text-center text-xs">
          <div className={`p-2 rounded-lg font-semibold ${
            currentReq ? 'bg-blue-900/50 text-blue-300 border border-blue-700' : 'bg-slate-800 text-slate-400'
          }`}>
            1. Institution Request
          </div>
          <div className={`p-2 rounded-lg font-semibold ${
            currentReq?.roRecommendation ? 'bg-blue-900/50 text-blue-300 border border-blue-700' : 'bg-slate-800 text-slate-400'
          }`}>
            2. RO Scrutiny
          </div>
          <div className={`p-2 rounded-lg font-semibold ${
            currentReq?.status === 'APPROVED' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-400'
          }`}>
            3. Bureau Sanction
          </div>
          <div className={`p-2 rounded-lg font-semibold ${
            fdr.status === 'RELEASED' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-400'
          }`}>
            4. UTR Disbursement
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Target Instrument Header */}
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 grid grid-cols-3 gap-2">
            <div>
              <span className="text-slate-500 block text-[10px]">Institution</span>
              <span className="text-white font-medium truncate block">{fdr.institutionName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Deposit Amount</span>
              <span className="text-emerald-400 font-bold">₹ {fdr.depositAmount.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Maturity Completed</span>
              <span className="text-white font-mono">{fdr.maturityDate}</span>
            </div>
          </div>

          {/* Conditional Workflow States */}
          {!currentReq ? (
            /* Stage 1: No request exists yet, institution can initiate */
            <div className="space-y-3 p-4 bg-slate-800 rounded-xl border border-slate-700">
              <h4 className="font-bold text-white text-sm">Initiate Release & Refund Dossier</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                As per AICTE Approval Process Handbook, the applicant institution may apply for the return of fixed deposit upon completion of the mandatory 10-year lock-in tenure.
              </p>
              
              <div className="space-y-2 pt-2 border-t border-slate-700 text-xs">
                <label className="flex items-center space-x-2 text-slate-200">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 bg-slate-900 border-slate-700" />
                  <span>Notarized Judicial Affidavit (No pending liabilities, court cases, or student grievances)</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-200">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 bg-slate-900 border-slate-700" />
                  <span>Original FDR Certificate / Bank Confirmation of Non-encashment</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-200">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 bg-slate-900 border-slate-700" />
                  <span>Affiliating University & Directorate of Technical Education (DTE) No-Objection Certificate</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleInitSubmission}
                  disabled={submitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg"
                >
                  <span>Submit Dossier to Regional Officer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : currentReq.status === 'PENDING_BUREAU_APPROVAL' ? (
            /* Stage 3: RO has recommended, Bureau Officer can sanction */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Regional Officer (RO) Verification Cleared</span>
                </div>
                <p className="leading-relaxed">
                  {currentReq.roRemarks || 'Scrutiny verified: 10-year term completed without any pending vigilance or student grievance cases. Recommended for Regulation Bureau sanction.'}
                </p>
                <div className="text-[10px] text-emerald-400/80 font-mono">
                  Recommended on: {currentReq.roActionDate || '2026-10-22'}
                </div>
              </div>

              <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Regulation Bureau Central Sanction Issuance
                </h4>

                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Official Sanction Order Number</label>
                  <input
                    type="text"
                    value={sanctionNumber}
                    onChange={e => setSanctionNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block text-[11px] mb-1">Bureau Sanction Directives</label>
                  <textarea
                    value={bureauRemarks}
                    onChange={e => setBureauRemarks(e.target.value)}
                    placeholder="Enter compliance release notes or approval decree..."
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleApproveBureau}
                    disabled={submitting}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Issue Central Sanction Order & Authorize Refund</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Completed state */
            <div className="p-6 bg-emerald-950/40 border border-emerald-800 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Security Deposit Released & Disbursed</h4>
              <p className="text-xs text-emerald-300 max-w-md mx-auto">
                Sanction Order #{currentReq.bureauSanctionOrderNo || 'AICTE-REG-2026-09'} executed. Lien revoked in Core Banking System. Principal sum of ₹{fdr.depositAmount.toLocaleString('en-IN')} released to Trust account.
              </p>
              {currentReq.refundUtrNumber && (
                <div className="inline-block bg-slate-900 px-4 py-1.5 rounded-lg border border-emerald-900 font-mono text-xs text-emerald-400">
                  Bank UTR: {currentReq.refundUtrNumber}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
