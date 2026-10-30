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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white border border-slate-300 rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 bg-[#0B3558] text-white flex items-center justify-between border-b border-[#07243c]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Security Deposit Release & Refund Gateway</h3>
              <p className="text-xs text-blue-100">
                AICTE Approval Process Handbook (APH) Clause 2.18 Multi-Tier Statutory Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Stage Stepper Header */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 grid grid-cols-4 gap-2 text-center text-xs">
          <div className={`p-2 rounded-lg font-semibold ${
            currentReq ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-white text-slate-500 border border-slate-200'
          }`}>
            1. Institution Request
          </div>
          <div className={`p-2 rounded-lg font-semibold ${
            currentReq?.roRecommendation ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-white text-slate-500 border border-slate-200'
          }`}>
            2. RO Scrutiny
          </div>
          <div className={`p-2 rounded-lg font-semibold ${
            currentReq?.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-white text-slate-500 border border-slate-200'
          }`}>
            3. Bureau Sanction
          </div>
          <div className={`p-2 rounded-lg font-semibold ${
            fdr.status === 'RELEASED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-white text-slate-500 border border-slate-200'
          }`}>
            4. UTR Disbursement
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Target Instrument Header */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2">
            <div>
              <span className="text-slate-500 block text-[10px]">Institution</span>
              <span className="text-slate-900 font-semibold truncate block">{fdr.institutionName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Deposit Amount</span>
              <span className="text-emerald-700 font-bold">₹ {fdr.depositAmount.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Maturity Completed</span>
              <span className="text-slate-900 font-mono font-medium">{fdr.maturityDate}</span>
            </div>
          </div>

          {/* Conditional Workflow States */}
          {!currentReq ? (
            /* Stage 1: No request exists yet, institution can initiate */
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">Initiate Release & Refund Dossier</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                As per AICTE Approval Process Handbook, the applicant institution may apply for the return of fixed deposit upon completion of the mandatory 10-year lock-in tenure.
              </p>
              
              <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                <label className="flex items-center space-x-2 text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                  <span>Notarized Judicial Affidavit (No pending liabilities, court cases, or student grievances)</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                  <span>Original FDR Certificate / Bank Confirmation of Non-encashment</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 border-slate-300 focus:ring-blue-500" />
                  <span>Affiliating University & Directorate of Technical Education (DTE) No-Objection Certificate</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleInitSubmission}
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#0B3558] hover:bg-[#07243c] text-white font-semibold rounded-lg text-xs flex items-center space-x-2 shadow-sm"
                >
                  <span>Submit Dossier to Regional Officer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : currentReq.status === 'PENDING_BUREAU_APPROVAL' ? (
            /* Stage 3: RO has recommended, Bureau Officer can sanction */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Regional Officer (RO) Verification Cleared</span>
                </div>
                <p className="leading-relaxed text-slate-700">
                  {currentReq.roRemarks || 'Scrutiny verified: 10-year term completed without any pending vigilance or student grievance cases. Recommended for Regulation Bureau sanction.'}
                </p>
                <div className="text-[10px] text-emerald-700 font-mono">
                  Recommended on: {currentReq.roActionDate || '2026-10-22'}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Regulation Bureau Central Sanction Issuance
                </h4>

                <div>
                  <label className="text-slate-700 font-semibold block text-[11px] mb-1">Official Sanction Order Number</label>
                  <input
                    type="text"
                    value={sanctionNumber}
                    onChange={e => setSanctionNumber(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block text-[11px] mb-1">Bureau Sanction Directives</label>
                  <textarea
                    value={bureauRemarks}
                    onChange={e => setBureauRemarks(e.target.value)}
                    placeholder="Enter compliance release notes or approval decree..."
                    rows={2}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleApproveBureau}
                    disabled={submitting}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs flex items-center space-x-1.5 shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Issue Central Sanction Order & Authorize Refund</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Completed state */
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Security Deposit Released & Disbursed</h4>
              <p className="text-xs text-slate-700 max-w-md mx-auto">
                Sanction Order #{currentReq.bureauSanctionOrderNo || 'AICTE-REG-2026-09'} executed. Lien revoked in Core Banking System. Principal sum of ₹{fdr.depositAmount.toLocaleString('en-IN')} released to Trust account.
              </p>
              {currentReq.refundUtrNumber && (
                <div className="inline-block bg-white px-4 py-1.5 rounded-lg border border-slate-300 font-mono text-xs text-emerald-800 font-bold">
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
