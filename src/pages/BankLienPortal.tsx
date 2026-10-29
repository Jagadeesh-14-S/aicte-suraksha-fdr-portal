import React, { useState } from 'react';
import { 
  Landmark, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  Search,
  FileKey2,
  Terminal
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { queryBankCbs, markLienOnCbs } from '../services/bankCbsSimulator';

export const BankLienPortal: React.FC = () => {
  const { fdrList, registerBankLienConfirmation } = useApp();
  const { currentUser } = useAuth();

  const [testIfsc, setTestIfsc] = useState('SBIN0000454');
  const [testAccount, setTestAccount] = useState('39281729401');
  const [testBank, setTestBank] = useState('State Bank of India');
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryOutput, setQueryOutput] = useState<any>(null);

  const handleTestQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setQueryLoading(true);
    const resp = await queryBankCbs(testBank, testIfsc, testAccount);
    setQueryOutput(resp);
    setQueryLoading(false);
  };

  const lienConfirmedList = fdrList.filter(f => f.lienStatus === 'LIEN_CONFIRMED');
  const pendingLienList = fdrList.filter(f => f.lienStatus !== 'LIEN_CONFIRMED');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
            <Landmark className="w-4 h-4" />
            <span>Open Banking & NeSL e-BG Interoperability</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Bank Lien & Core Banking (CBS) Gateway
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            ISO 20022 camt.053 / pain.001 live reconciliation bridge to prevent unauthorized liquidation or double-pledging.
          </p>
        </div>
      </div>

      {/* CBS API Test Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (5 Cols): Live CBS Query Simulator */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>CBS Real-Time Test Bench</span>
          </div>

          <form onSubmit={handleTestQuery} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Bank Host Selection</label>
              <select
                value={testBank}
                onChange={e => setTestBank(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="State Bank of India">State Bank of India (SBI Finacle)</option>
                <option value="Canara Bank">Canara Bank (i-Flex BaNCS)</option>
                <option value="Punjab National Bank">Punjab National Bank (Finacle 10)</option>
                <option value="HDFC Bank">HDFC Bank (Commercial Host)</option>
                <option value="Bank of India">Bank of India (Core Host)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">IFSC Routing Code</label>
                <input
                  type="text"
                  value={testIfsc}
                  onChange={e => setTestIfsc(e.target.value.toUpperCase())}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Deposit A/c Number</label>
                <input
                  type="text"
                  value={testAccount}
                  onChange={e => setTestAccount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  required
                />
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">ISO 20022 camt.053 Payload</span>
              <button
                type="submit"
                disabled={queryLoading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${queryLoading ? 'animate-spin' : ''}`} />
                <span>{queryLoading ? 'Connecting...' : 'Query CBS Gateway'}</span>
              </button>
            </div>
          </form>

          {/* Console Output */}
          {queryOutput && (
            <div className={`p-4 rounded-xl border space-y-2 text-xs font-mono ${
              queryOutput.success
                ? 'bg-slate-950 border-emerald-800/80 text-emerald-400'
                : 'bg-slate-950 border-rose-800/80 text-rose-400'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span>STATUS: {queryOutput.success ? '200 OK (VERIFIED)' : '409 CONFLICT (DISCREPANCY)'}</span>
                <span className="text-slate-500">{new Date().toLocaleTimeString()}</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans">{queryOutput.message}</p>
              {queryOutput.record && (
                <div className="text-[10px] space-y-0.5 text-slate-400 pt-2 border-t border-slate-800">
                  <div>CBS Ref: <span className="text-white">{queryOutput.record.cbsReferenceId}</span></div>
                  <div>Digital Sign: <span className="text-white truncate block">{queryOutput.record.cryptographicSignature}</span></div>
                  <div>Account Status: <span className="text-emerald-400 font-bold">{queryOutput.record.accountStatus}</span></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right (7 Cols): Active Confirmed Liens Ledger */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Registered AICTE Non-Encashable Liens ({lienConfirmedList.length})</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">100% NeSL Interoperable</span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {lienConfirmedList.map((fdr) => (
              <div
                key={fdr.id}
                className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 hover:border-slate-600 transition-all text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white">{fdr.institutionName}</div>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800 text-[10px]">
                    Lien Marked: ₹ {(fdr.depositAmount / 100000).toFixed(1)} L
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 font-mono">
                  <div>FDR: <span className="text-slate-200">{fdr.fdrNumber}</span></div>
                  <div>Bank: <span className="text-slate-200">{fdr.bankName}</span></div>
                  <div>IFSC: <span className="text-slate-200">{fdr.ifscCode}</span></div>
                </div>

                {fdr.bankVerification && (
                  <div className="pt-2 border-t border-slate-700/80 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Lien Custodian: {fdr.bankVerification.verifiedByOfficer}</span>
                    <span className="font-mono text-purple-400">
                      CBS Ref: {fdr.bankVerification.cbsReferenceId}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
