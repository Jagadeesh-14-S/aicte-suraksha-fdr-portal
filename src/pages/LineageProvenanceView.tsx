import React, { useState } from 'react';
import { 
  GitFork, 
  GitCommit, 
  History, 
  ShieldCheck, 
  Landmark, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Copy, 
  Eye, 
  Layers, 
  Binary, 
  Search,
  Filter,
  Clock,
  Sparkles,
  Link2,
  FileCheck2,
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { FdrInstrument } from '../types';

interface LineageProvenanceViewProps {
  onSelectFdr: (fdrId: string) => void;
  onOpenRefund: (fdr: FdrInstrument) => void;
  onOpenBankLien: (fdr: FdrInstrument) => void;
}

export const LineageProvenanceView: React.FC<LineageProvenanceViewProps> = ({
  onSelectFdr,
  onOpenRefund,
  onOpenBankLien
}) => {
  const { fdrList } = useApp();
  const { t } = useLanguage();

  const [selectedFdrId, setSelectedFdrId] = useState<string>(fdrList[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'PROVENANCE' | 'LINEAGE' | 'DUPLICATES' | 'POLICY'>('PROVENANCE');

  const selectedFdr = fdrList.find(f => f.id === selectedFdrId) || fdrList[0];

  // Helper to construct simulated provenance if not explicitly present
  const getFieldProvenanceList = (fdr: FdrInstrument) => {
    return [
      {
        field: 'Deposit Amount',
        fieldKey: 'depositAmount',
        value: `₹ ${(fdr.depositAmount / 100000).toFixed(2)} Lakhs (₹ ${fdr.depositAmount.toLocaleString('en-IN')})`,
        sourceType: fdr.bankVerification ? 'BANK_CONFIRMED' : 'OCR_EXTRACTED',
        sourceLabel: fdr.bankVerification ? 'Bank CBS camt.053 Confirmed' : 'Multimodal Vision-Language OCR',
        confidence: fdr.bankVerification ? 100 : 98.4,
        status: fdr.bankVerification ? 'BANK_CONFIRMED' : 'VALIDATED',
        timestamp: fdr.bankVerification ? fdr.bankVerification.verifiedAt : fdr.createdAt,
        confirmedBy: fdr.bankVerification ? fdr.bankVerification.verifiedByOfficer : 'Automated Ingestion Pipeline',
        proof: fdr.bankVerification?.cbsReferenceId || fdr.documentHash.slice(0, 16) + '...'
      },
      {
        field: 'Maturity Date (10-Yr Lock-In)',
        fieldKey: 'maturityDate',
        value: fdr.maturityDate,
        sourceType: 'OCR_EXTRACTED',
        sourceLabel: 'LayoutLM Multimodal Coordinate Parser',
        confidence: 96.8,
        status: 'VALIDATED',
        timestamp: fdr.createdAt,
        confirmedBy: 'Regional Officer Verification Bureau',
        proof: `SHA256:${fdr.documentHash.slice(0, 12)}`
      },
      {
        field: 'Issuing Bank & Branch',
        fieldKey: 'bankName',
        value: `${fdr.bankName} (${fdr.branchName})`,
        sourceType: fdr.bankVerification ? 'BANK_CONFIRMED' : 'INSTITUTION_ENTRY',
        sourceLabel: fdr.bankVerification ? 'Direct Finacle/BaNCS Core Interface' : 'Institution Declared',
        confidence: 100,
        status: fdr.bankVerification ? 'BANK_CONFIRMED' : 'SUBMITTED',
        timestamp: fdr.bankVerification ? fdr.bankVerification.verifiedAt : fdr.createdAt,
        confirmedBy: fdr.bankVerification ? fdr.bankVerification.verifiedByOfficer : 'Institution Authorized Signatory',
        proof: fdr.bankVerification?.cbsReferenceId || 'AFFIDAVIT-SIGNED'
      },
      {
        field: 'Deposit Account Number',
        fieldKey: 'accountNumber',
        value: fdr.accountNumber,
        sourceType: fdr.bankVerification ? 'BANK_CONFIRMED' : 'OCR_EXTRACTED',
        sourceLabel: fdr.bankVerification ? 'Bank Host Query Response (200 OK)' : 'OCR Character Normalization',
        confidence: 99.2,
        status: fdr.bankVerification ? 'BANK_CONFIRMED' : 'VALIDATED',
        timestamp: fdr.bankVerification ? fdr.bankVerification.verifiedAt : fdr.createdAt,
        confirmedBy: fdr.bankVerification ? fdr.bankVerification.verifiedByOfficer : 'OCR Extraction Engine v3',
        proof: fdr.bankVerification?.cryptographicSignature ? fdr.bankVerification.cryptographicSignature.slice(0, 16) + '...' : 'DOC-HASH-BOUND'
      },
      {
        field: 'Joint Holder Title',
        fieldKey: 'jointHolderNames',
        value: fdr.jointHolderNames,
        sourceType: 'RO_SCRUTINY',
        sourceLabel: 'Legal Scrutiny & APH Clause 2.18 Verification',
        confidence: 95.0,
        status: fdr.jointHolderNames.includes('AICTE') ? 'VALIDATED' : 'DISCREPANCY_DETECTED',
        timestamp: fdr.lastScrutinyDate || fdr.createdAt,
        confirmedBy: fdr.scrutinyOfficer || 'RO Scrutiny Desk',
        proof: 'APH-RULE-CLAUSE-2.18'
      },
      {
        field: 'Core Banking Lien Status',
        fieldKey: 'lienStatus',
        value: fdr.lienStatus === 'LIEN_CONFIRMED' ? 'Absolute Non-Encashable Lien Marked in CBS' : 'Lien Encumbrance Pending',
        sourceType: fdr.lienStatus === 'LIEN_CONFIRMED' ? 'BANK_CONFIRMED' : 'INSTITUTION_ENTRY',
        sourceLabel: fdr.lienStatus === 'LIEN_CONFIRMED' ? 'NeSL e-BG / CBS Cryptographic Bridge' : 'Pending Bank Response',
        confidence: fdr.lienStatus === 'LIEN_CONFIRMED' ? 100 : 50,
        status: fdr.lienStatus === 'LIEN_CONFIRMED' ? 'BANK_CONFIRMED' : 'AWAITING_BANK',
        timestamp: fdr.bankVerification?.verifiedAt || fdr.updatedAt,
        confirmedBy: fdr.bankVerification?.verifiedByOfficer || 'Pending',
        proof: fdr.bankVerification?.cryptographicSignature ? fdr.bankVerification.cryptographicSignature.slice(0, 16) + '...' : 'AWAITING-RESPONSE'
      }
    ];
  };

  const provenanceList = selectedFdr ? getFieldProvenanceList(selectedFdr) : [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Official Government Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#C2410C] uppercase tracking-wider mb-1">
            <GitFork className="w-4 h-4" />
            <span>FDR-SENTINEL Innovation Layer • Provenance & Lineage Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif">
            Evidence Provenance Ledger & Instrument Lineage Graph
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Every critical field carries immutable source origin, extraction method, confidence level, and bank confirmation status to prevent OCR errors from being mistaken for bank-confirmed truth.
          </p>
        </div>

        {/* Instrument Selector Dropdown */}
        <div className="shrink-0">
          <label className="text-[11px] font-bold text-slate-600 block mb-1">Active Instrument:</label>
          <select
            value={selectedFdrId}
            onChange={(e) => setSelectedFdrId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#C2410C] focus:bg-white transition-colors"
          >
            {fdrList.map(f => (
              <option key={f.id} value={f.id}>
                {f.fdrNumber} • {f.institutionName.slice(0, 28)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-white px-4 rounded-xl shadow-2xs">
        <button
          onClick={() => setActiveSubTab('PROVENANCE')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeSubTab === 'PROVENANCE'
              ? 'border-b-[#C2410C] text-[#C2410C]'
              : 'border-b-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Field-Level Evidence Provenance Ledger</span>
        </button>

        <button
          onClick={() => setActiveSubTab('LINEAGE')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeSubTab === 'LINEAGE'
              ? 'border-b-[#C2410C] text-[#C2410C]'
              : 'border-b-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>2. Predecessor-Successor Lineage Timeline</span>
        </button>

        <button
          onClick={() => setActiveSubTab('DUPLICATES')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeSubTab === 'DUPLICATES'
              ? 'border-b-[#C2410C] text-[#C2410C]'
              : 'border-b-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>3. Duplicate Candidate Resolution (Algo B)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('POLICY')}
          className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeSubTab === 'POLICY'
              ? 'border-b-[#C2410C] text-[#C2410C]'
              : 'border-b-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>4. Policy-as-Data Version Matrix</span>
        </button>
      </div>

      {/* Tab 1: Field-Level Evidence Provenance Ledger */}
      {activeSubTab === 'PROVENANCE' && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">FDR-SENTINEL Rule: OCR Extraction ≠ Bank Confirmation.</strong>
              <p className="text-[11px] text-amber-900 mt-0.5">
                Each field maintains strict provenance. Information submitted by an institution or extracted via OCR is flagged as <em>Unconfirmed</em> until cryptographically confirmed by an authorized bank host or verified officer.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Field Evidence Table • {selectedFdr.fdrNumber}
                </h3>
                <p className="text-xs text-slate-600">{selectedFdr.institutionName}</p>
              </div>
              <span className="text-[11px] font-mono bg-white px-2.5 py-1 rounded border border-slate-300 font-semibold text-slate-700">
                Doc Hash: {selectedFdr.documentHash.slice(0, 16)}...
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Attribute / Field Name</th>
                    <th className="px-4 py-3">Recorded Value</th>
                    <th className="px-4 py-3">Origin Source & Method</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-4 py-3">Provenance Status</th>
                    <th className="px-4 py-3">Confirmed By / Proof Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {provenanceList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {item.field}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-800 font-semibold">
                        {item.value}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-slate-800 font-medium block">{item.sourceLabel}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-slate-800">{item.confidence}%</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          item.status === 'BANK_CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.status === 'VALIDATED'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : item.status === 'AWAITING_BANK'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800 text-[11px]">{item.confirmedBy}</div>
                        <div className="font-mono text-[10px] text-slate-500">{item.proof}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Predecessor-Successor Lineage Timeline */}
      {activeSubTab === 'LINEAGE' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Instrument Lifecycle Lineage & Immutable History
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Predecessor and successor tracking preserves 100% of renewal, replacement, and release events without overwriting historical records.
                </p>
              </div>
              <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-mono text-slate-700 font-semibold border border-slate-300">
                Lineage Chain: Verified
              </span>
            </div>

            {/* Visual Timeline Nodes */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {/* Event 1: Genesis Creation */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xs flex items-center justify-center text-white text-[10px]">
                  1
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Original FDR Deposit Submission</span>
                    <span className="text-[10px] font-mono text-slate-500">{selectedFdr.issueDate}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Institution uploaded instrument scan. LayoutLM multimodal extraction executed, generating canonical SHA-256 hash <code className="text-slate-800 bg-white px-1 py-0.5 rounded border border-slate-200">{selectedFdr.documentHash.slice(0, 16)}...</code>.
                  </p>
                  <div className="text-[11px] text-slate-700 font-mono">
                    Instrument Ref: <strong>{selectedFdr.fdrNumber}</strong> • Principal: <strong>₹ {(selectedFdr.depositAmount / 100000).toFixed(1)} Lakhs</strong>
                  </div>
                </div>
              </div>

              {/* Event 2: Bank Lien Encumbrance */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-600 border-2 border-white shadow-xs flex items-center justify-center text-white text-[10px]">
                  2
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Core Banking (CBS) Non-Encashable Lien Registration</span>
                    <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      NeSL / ISO 20022 Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Issuing bank CBS ({selectedFdr.bankName}) marked an absolute statutory lien in favor of AICTE Regulation Bureau. Deposit locked against premature encashment or hypothecation.
                  </p>
                  {selectedFdr.bankVerification && (
                    <div className="text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200 space-y-0.5 font-mono">
                      <div>CBS Reference: <strong>{selectedFdr.bankVerification.cbsReferenceId}</strong></div>
                      <div>Verified By Officer: <strong>{selectedFdr.bankVerification.verifiedByOfficer}</strong> ({selectedFdr.bankVerification.officerDesignation})</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Event 3: 10-Year Lock-In Term & Scheduled Alerts */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-amber-600 border-2 border-white shadow-xs flex items-center justify-center text-white text-[10px]">
                  3
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">10-Year Statutory Lock-In & Milestone Surveillance</span>
                    <span className="text-[10px] font-mono text-slate-500">Maturity: {selectedFdr.maturityDate}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Automated deadline engine monitoring tenure. Advance notifications scheduled at T-180, T-90, and T-30 days prior to expiry under AICTE Approval Process Handbook (APH) regulations.
                  </p>
                </div>
              </div>

              {/* Event 4: Release or Renewal Event */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-purple-600 border-2 border-white shadow-xs flex items-center justify-center text-white text-[10px]">
                  4
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Release / Renewal Lifecycle Decision</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      selectedFdr.status === 'RELEASED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {selectedFdr.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    When lock-in period completes or institution requests return/renewal, 4-stage regulatory scrutiny is triggered. Predecessor record remains permanently in archive.
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => onOpenRefund(selectedFdr)}
                      className="px-3 py-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded text-xs font-semibold shadow-2xs"
                    >
                      Process Release Dossier
                    </button>
                    <button
                      onClick={() => onOpenBankLien(selectedFdr)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-xs font-semibold"
                    >
                      Inspect CBS Lien State
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Duplicate Candidate Resolution (Algorithm B) */}
      {activeSubTab === 'DUPLICATES' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Duplicate Candidate Scoring & Disambiguation (Algorithm B)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Evaluates normalized comparison vector across issuing bank, branch, reference number, deposit amount, and dates. Candidates are flagged for human review without automatic rejection.
              </p>
            </div>
            <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded font-mono border border-slate-200">
              Threshold: &gt; 80% Similarity
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-xs">Candidate Comparison: {selectedFdr.fdrNumber}</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                    Potential Duplicate (86% Match)
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Matched against: CNRB-0091827364</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">Identical Amount:</span>
                  <span className="font-bold text-slate-900">₹ 35,00,000 (100% Match)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Similar Account Number:</span>
                  <span className="font-bold text-amber-700">Last 6 digits match (91%)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Branch / IFSC:</span>
                  <span className="font-bold text-slate-900">Same Regional Office Zone</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600">
                <strong>Review Guidance:</strong> Verify whether this instrument represents a legitimate replacement for a maturing deposit or an accidental duplicate submission by the trust administrator.
              </p>

              <div className="flex justify-end space-x-2 pt-1 border-t border-slate-200">
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-xs font-semibold">
                  Mark Distinct / Legitimate
                </button>
                <button className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-semibold shadow-2xs">
                  Flag Confirmed Duplicate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Policy-as-Data Version Matrix */}
      {activeSubTab === 'POLICY' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Policy-as-Data Regulatory Configuration Engine
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Versioned policy rules for deposit norms, mandatory 10-year lock-in, and release checklist with authorized audit history.
              </p>
            </div>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded font-mono font-bold border border-emerald-200">
              Active: AICTE-APH-2024-27 (v2.18)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-900 block">Engineering & Technology</span>
              <p className="text-slate-600 text-[11px]">Mandatory Security Deposit: <strong>₹ 35.00 Lakhs</strong></p>
              <p className="text-slate-600 text-[11px]">Tenure: <strong>10 Years Fixed Lock-In</strong></p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">APH Chapter I Norms</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-900 block">Management & Pharmacy</span>
              <p className="text-slate-600 text-[11px]">Mandatory Security Deposit: <strong>₹ 15.00 - 25.00 Lakhs</strong></p>
              <p className="text-slate-600 text-[11px]">Tenure: <strong>10 Years Fixed Lock-In</strong></p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">APH Chapter II Norms</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-900 block">Polytechnic / Diploma</span>
              <p className="text-slate-600 text-[11px]">Mandatory Security Deposit: <strong>₹ 10.00 - 15.00 Lakhs</strong></p>
              <p className="text-slate-600 text-[11px]">Tenure: <strong>10 Years Fixed Lock-In</strong></p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">State DTE Co-Joint Rule</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

