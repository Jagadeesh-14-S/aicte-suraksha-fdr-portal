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
  Terminal,
  CheckCircle
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
      {/* Official Government Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">
            <Landmark className="w-4 h-4 text-blue-700" />
            <span>Open Banking & NeSL e-BG Interoperability Gateway</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Bank Lien & Core Banking System (CBS) Verification
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Official ISO 20022 camt.053 reconciliation bridge with Scheduled Commercial Banks to prevent unauthorized liquidation or double-pledging.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium rounded-lg">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>NeSL e-BG Interoperable</span>
          </span>
        </div>
      </div>

      {/* CBS API Test Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (5 Cols): Live CBS Query Simulator */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
            <Terminal className="w-4 h-4 text-blue-700" />
            <span>CBS Real-Time Inquiry Console</span>
          </div>

          <form onSubmit={handleTestQuery} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Bank Host Selection</label>
              <select
                value={testBank}
                onChange={e => setTestBank(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
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
                <label className="text-slate-700 font-semibold block mb-1">IFSC Routing Code</label>
                <input
                  type="text"
                  value={testIfsc}
                  onChange={e => setTestIfsc(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Deposit A/c Number</label>
                <input
                  type="text"
                  value={testAccount}
                  onChange={e => setTestAccount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">ISO 20022 camt.053</span>
              <button
                type="submit"
                disabled={queryLoading}
                className="px-4 py-2 bg-[#0B3558] hover:bg-[#07243c] text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${queryLoading ? 'animate-spin' : ''}`} />
                <span>{queryLoading ? 'Connecting...' : 'Query CBS Gateway'}</span>
              </button>
            </div>
          </form>

          {/* Console Output */}
          {queryOutput && (
            <div className={`p-4 rounded-lg border space-y-2 text-xs font-mono ${
              queryOutput.success
                ? 'bg-slate-900 border-emerald-600 text-emerald-400'
                : 'bg-slate-900 border-rose-600 text-rose-400'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span>STATUS: {queryOutput.success ? '200 OK (VERIFIED)' : '409 CONFLICT (DISCREPANCY)'}</span>
                <span className="text-slate-400">{new Date().toLocaleTimeString()}</span>
              </div>
              <p className="text-[11px] text-slate-200 font-sans">{queryOutput.message}</p>
              {queryOutput.record && (
                <div className="text-[10px] space-y-1 text-slate-300 pt-2 border-t border-slate-800">
                  <div>CBS Reference: <span className="text-white font-mono">{queryOutput.record.cbsReferenceId}</span></div>
                  <div className="truncate">Digital Signature: <span className="text-slate-300 font-mono">{queryOutput.record.cryptographicSignature}</span></div>
                  <div>Account Status: <span className="text-emerald-400 font-bold">{queryOutput.record.accountStatus}</span></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right (7 Cols): Active Confirmed Liens Ledger */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Registered AICTE Non-Encashable Liens ({lienConfirmedList.length})</span>
            </div>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
              Verified & Pledged
            </span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {lienConfirmedList.map((fdr) => (
              <div
                key={fdr.id}
                className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 hover:border-blue-300 transition-all text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900">{fdr.institutionName}</div>
                  <span className="font-mono text-emerald-800 font-bold bg-emerald-100/80 px-2.5 py-0.5 rounded border border-emerald-200 text-xs">
                    Lien Marked: ₹ {(fdr.depositAmount / 100000).toFixed(1)} L
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                  <div>FDR: <span className="font-mono font-medium text-slate-800">{fdr.fdrNumber}</span></div>
                  <div>Bank: <span className="font-medium text-slate-800">{fdr.bankName}</span></div>
                  <div>IFSC: <span className="font-mono font-medium text-slate-800">{fdr.ifscCode}</span></div>
                </div>

                {fdr.bankVerification && (
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Lien Officer: <strong className="text-slate-800">{fdr.bankVerification.verifiedByOfficer}</strong></span>
                    <span className="font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
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
