import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  FileSearch, 
  AlertTriangle, 
  Layers, 
  Lock, 
  Check, 
  ExternalLink,
  Ban,
  FileCheck2,
  Calendar,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FdrInstrument } from '../types';

interface DiscrepancyInspectorModalProps {
  fdr: FdrInstrument | null;
  onClose: () => void;
  onOpenBankLienModal?: (fdr: FdrInstrument) => void;
}

export const DiscrepancyInspectorModal: React.FC<DiscrepancyInspectorModalProps> = ({
  fdr,
  onClose,
  onOpenBankLienModal
}) => {
  const { updateFdrScrutiny, resolveDiscrepancy } = useApp();
  const { currentUser } = useAuth();

  const [showElaHeatmap, setShowElaHeatmap] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!fdr) return null;

  const hasCritical = fdr.discrepancies.some(d => !d.resolved && d.severity === 'CRITICAL');
  const hasWarning = fdr.discrepancies.some(d => !d.resolved && d.severity === 'WARNING');

  const handleApprove = async () => {
    setSubmitting(true);
    await updateFdrScrutiny(fdr.id, 'SCRUTINY_APPROVED', remarks || 'Scrutiny verified and approved by Regional Officer.');
    setSubmitting(false);
    onClose();
  };

  const handleFlagDeficiency = async () => {
    setSubmitting(true);
    await updateFdrScrutiny(fdr.id, 'DISCREPANCY_FLAGGED', remarks || 'Deficiency letter issued to applicant trust.');
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              hasCritical ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
            }`}>
              <FileSearch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">Regulatory Scrutiny & Forensics Console</h3>
                <span className="font-mono text-xs text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {fdr.fdrNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {fdr.institutionName} • Region: {fdr.region}
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

        {/* Content: Two-Column Split Screen */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-4 p-5">
          {/* Left Column (5 Cols): Visual Document Simulation & ELA Layer */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Visual Inspection & Layer Analysis
              </span>
              <button
                type="button"
                onClick={() => setShowElaHeatmap(!showElaHeatmap)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center space-x-1.5 transition-all ${
                  showElaHeatmap
                    ? 'bg-rose-600 text-white border-rose-400 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{showElaHeatmap ? 'Disable ELA Heatmap' : 'Toggle ELA Forensic Heatmap'}</span>
              </button>
            </div>

            {/* Document Mock Canvas */}
            <div className={`relative rounded-xl border p-4 font-serif text-slate-800 transition-all select-none ${
              showElaHeatmap
                ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border-purple-600 text-purple-200'
                : 'bg-amber-50/95 border-amber-200 shadow-inner'
            }`}>
              {/* ELA Watermark / Overlay */}
              {showElaHeatmap && (
                <div className="absolute inset-0 bg-rose-500/10 pointer-events-none flex items-center justify-center">
                  <div className="text-center p-3 bg-black/80 rounded-xl border border-rose-500/80 backdrop-blur-md">
                    <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto mb-1 animate-pulse" />
                    <p className="text-xs font-bold text-rose-300">ELA Compression Delta Active</p>
                    <p className="text-[10px] text-slate-300">
                      Noise residual threshold: {((fdr.forgeryConfidenceScore || 0.05) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}

              {/* Bank Header */}
              <div className="text-center border-b border-slate-400 pb-2 mb-3">
                <h4 className="font-bold text-sm tracking-wide uppercase">{fdr.bankName}</h4>
                <p className="text-[10px] font-sans text-slate-600">{fdr.branchName} • IFSC: {fdr.ifscCode}</p>
                <p className="text-[11px] font-bold text-blue-900 mt-1 uppercase tracking-wider">
                  TERM DEPOSIT RECEIPT / FIXED DEPOSIT
                </p>
              </div>

              {/* Document Key-Values */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                  <span className="font-sans text-slate-500">Deposit A/c No:</span>
                  <span className="font-mono font-bold">{fdr.accountNumber}</span>
                </div>

                <div className={`flex justify-between border-b border-dotted border-slate-300 pb-1 ${
                  fdr.isForgedSuspect ? 'bg-rose-500/20 px-1 rounded border-rose-500' : ''
                }`}>
                  <span className="font-sans text-slate-500">Principal Deposit:</span>
                  <span className="font-bold text-emerald-800">₹ {fdr.depositAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                  <span className="font-sans text-slate-500">Tenure / Term:</span>
                  <span className="font-bold">{fdr.tenureYears} Years</span>
                </div>

                <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                  <span className="font-sans text-slate-500">Dates:</span>
                  <span className="text-[11px] font-mono">Issued: {fdr.issueDate} • Matures: {fdr.maturityDate}</span>
                </div>

                <div className={`p-1.5 rounded border ${
                  fdr.jointHolderNames.includes('AICTE') 
                    ? 'bg-emerald-500/10 border-emerald-400' 
                    : 'bg-rose-500/20 border-rose-500'
                }`}>
                  <span className="font-sans text-[10px] block text-slate-500 uppercase font-semibold">
                    Payable Jointly To:
                  </span>
                  <span className="font-bold text-[11px]">{fdr.jointHolderNames}</span>
                </div>

                {/* Stamped Seals */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="border-2 border-emerald-600 rounded-lg p-1 text-[9px] text-emerald-700 font-bold uppercase rotate-[-3deg] text-center max-w-[120px]">
                    NON-ENCASHABLE LIEN MARKED
                  </div>
                  <div className="border border-blue-800 rounded p-1 text-[9px] text-blue-900 font-mono text-center">
                    Authorized Signatory<br />Branch Seal
                  </div>
                </div>
              </div>
            </div>

            {/* Document Hash Provenance */}
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Cryptographic Proof</span>
                <span className="text-emerald-400 font-mono">SHA-256 Validated</span>
              </div>
              <p className="font-mono text-[10px] text-slate-300 break-all">
                {fdr.documentHash}
              </p>
            </div>
          </div>

          {/* Right Column (7 Cols): Discrepancy Breakdown & Scrutiny Controls */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                12-Point Automated Scrutiny Matrix Results
              </h4>

              {fdr.discrepancies.length === 0 ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold">100% Regulatory Compliance</p>
                    <p className="text-[11px] text-emerald-400/80 mt-0.5">
                      All criteria (Joint title, Deposit norm, 10-Yr lock-in, Bank Lien, and ELA integrity) satisfied.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {fdr.discrepancies.map((flag) => (
                    <div
                      key={flag.id}
                      className={`p-3 rounded-xl border text-xs transition-all ${
                        flag.resolved
                          ? 'bg-slate-800/40 border-slate-700 opacity-60'
                          : flag.severity === 'CRITICAL'
                          ? 'bg-rose-950/40 border-rose-800'
                          : 'bg-amber-950/40 border-amber-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1.5 font-bold">
                          {flag.severity === 'CRITICAL' ? (
                            <ShieldAlert className="w-4 h-4 text-rose-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          )}
                          <span className={flag.severity === 'CRITICAL' ? 'text-rose-300' : 'text-amber-300'}>
                            {flag.ruleTitle}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {flag.code}
                        </span>
                      </div>

                      <p className="text-slate-300 text-[11px] leading-relaxed mt-1">
                        {flag.description}
                      </p>

                      <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] bg-slate-900/80 p-2 rounded-lg border border-slate-800 font-mono">
                        <div>
                          <span className="text-slate-500 block">Expected:</span>
                          <span className="text-emerald-400">{flag.expectedValue}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Actual Submitted:</span>
                          <span className="text-rose-400">{flag.actualValue}</span>
                        </div>
                      </div>

                      {!flag.resolved && (
                        <div className="mt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => resolveDiscrepancy(fdr.id, flag.id)}
                            className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Mark Resolved with Justification</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Core Banking Lien Status */}
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Core Banking (CBS) Lien Status
                </span>
                <span className={`font-bold ${
                  fdr.lienStatus === 'LIEN_CONFIRMED' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {fdr.lienStatus === 'LIEN_CONFIRMED' ? 'Lien Confirmed in CBS' : 'Lien Confirmation Pending'}
                </span>
              </div>
              {onOpenBankLienModal && (
                <button
                  type="button"
                  onClick={() => onOpenBankLienModal(fdr)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verify on Bank CBS</span>
                </button>
              )}
            </div>

            {/* Scrutiny Action & Remarks */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Regional Officer / Bureau Scrutiny Remarks
              </label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Enter regulatory observation, hearing directives, or deficiency notification rationale..."
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleFlagDeficiency}
                  disabled={submitting}
                  className="px-4 py-2 bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-rose-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Flag Deficiency & Serve Notice</span>
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={submitting || hasCritical}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-colors"
                  title={hasCritical ? 'Resolve critical discrepancies before approval' : 'Approve for approval process handbook'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Regulatory Scrutiny</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
