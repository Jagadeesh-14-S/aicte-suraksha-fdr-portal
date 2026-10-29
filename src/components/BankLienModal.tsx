import React, { useState } from 'react';
import { 
  X, 
  Landmark, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  FileKey, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FdrInstrument } from '../types';
import { queryBankCbs, markLienOnCbs, CbsQueryResponse } from '../services/bankCbsSimulator';

interface BankLienModalProps {
  fdr: FdrInstrument | null;
  onClose: () => void;
}

export const BankLienModal: React.FC<BankLienModalProps> = ({ fdr, onClose }) => {
  const { registerBankLienConfirmation } = useApp();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [queryResponse, setQueryResponse] = useState<CbsQueryResponse | null>(null);
  const [lienConfirmed, setLienConfirmed] = useState(false);

  if (!fdr) return null;

  const handleQueryCbs = async () => {
    setLoading(true);
    const resp = await queryBankCbs(fdr.bankName, fdr.ifscCode, fdr.accountNumber);
    setQueryResponse(resp);
    setLoading(false);
  };

  const handleExecuteLien = async () => {
    setLoading(true);
    const bankRecord = await markLienOnCbs(
      fdr.id,
      fdr.bankName,
      fdr.ifscCode,
      fdr.accountNumber,
      fdr.depositAmount,
      `Regional Officer, AICTE ${fdr.region}`
    );

    await registerBankLienConfirmation(fdr.id, bankRecord);
    setLienConfirmed(true);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Core Banking (CBS) & NeSL e-BG Gateway</h3>
              <p className="text-[11px] text-slate-300">
                Bidirectional Lien Registration Protocol • ISO 20022 camt.053 Ready
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Target Instrument Card */}
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Target Instrument</span>
              <span className="font-mono text-amber-400 font-bold">{fdr.fdrNumber}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">Bank / Branch</span>
                <span className="text-white">{fdr.bankName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">IFSC Code</span>
                <span className="text-white">{fdr.ifscCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Deposit Account No</span>
                <span className="text-white">{fdr.accountNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Deposit Sum</span>
                <span className="text-emerald-400 font-bold">₹ {fdr.depositAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action 1: Query CBS Host */}
          {!queryResponse && !lienConfirmed && (
            <div className="text-center py-6 space-y-3">
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Connect to the issuing bank's Core Banking Solution (Finacle / BaNCS host) to independently confirm active balance, account tenure, and lien availability.
              </p>
              <button
                type="button"
                onClick={handleQueryCbs}
                disabled={loading}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-2 shadow-lg transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Querying Bank CBS Server...' : 'Query Bank CBS Live Interface'}</span>
              </button>
            </div>
          )}

          {/* Query Response Card */}
          {queryResponse && (
            <div className={`p-4 rounded-xl border space-y-3 text-xs ${
              queryResponse.success
                ? 'bg-emerald-950/30 border-emerald-800'
                : 'bg-rose-950/30 border-rose-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {queryResponse.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                  )}
                  <span className="font-bold text-white">
                    {queryResponse.success ? 'Core Banking Record Verified' : 'CBS Integrity Discrepancy'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Response Code: {queryResponse.success ? '200 OK' : '409 CONFLICT'}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                {queryResponse.message}
              </p>

              {queryResponse.actualBalance !== undefined && (
                <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Actual Balance in CBS:</span>
                    <span className="text-white font-bold">₹ {queryResponse.actualBalance.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Account Holder On Record:</span>
                    <span className="text-white truncate">{queryResponse.holderNamesOnRecord}</span>
                  </div>
                </div>
              )}

              {/* Action 2: Execute Lien Marking */}
              {queryResponse.success && !lienConfirmed && (
                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={handleExecuteLien}
                    disabled={loading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Register Absolute Non-Encashable Lien</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Success Lien Marked Confirmation */}
          {lienConfirmed && (
            <div className="p-4 bg-emerald-950/50 border border-emerald-700 rounded-xl space-y-3 text-xs text-emerald-300">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
                <span>Non-Encashable Lien Successfully Registered!</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                The Core Banking host has marked an absolute encumbrance on this deposit in favor of AICTE. The deposit cannot be liquidated, transferred, or pledged without an authorized AICTE cryptographic release token.
              </p>
              <div className="p-2 bg-slate-900/80 rounded border border-emerald-900 text-[10px] font-mono text-emerald-400">
                NeSL Digital Signature: 0x9fa4b6c318281920acbb...e81c (Timestamp: {new Date().toISOString()})
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
                >
                  Close & Refresh Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
