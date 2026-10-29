import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  ShieldAlert, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { simulateNeuroSymbolicOcr, OcrExtractionResult } from '../services/neuroSymbolicOcr';
import { evaluateFdrDiscrepancies } from '../services/discrepancyDetector';
import { RegionalOffice } from '../types';

interface FdrUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (fdrId: string) => void;
}

export const FdrUploadModal: React.FC<FdrUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { institutions, addNewFdr } = useApp();
  const { currentUser } = useAuth();

  const [selectedInstId, setSelectedInstId] = useState(institutions[0]?.id || '');
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrExtractionResult | null>(null);
  const [fileName, setFileName] = useState('');

  // Editable fields after extraction
  const [formData, setFormData] = useState({
    fdrNumber: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    accountNumber: '',
    depositAmount: 3500000,
    interestRate: 7.1,
    issueDate: new Date().toISOString().split('T')[0],
    maturityDate: new Date(Date.now() + 10 * 365.25 * 86400000).toISOString().split('T')[0],
    tenureYears: 10,
    jointHolderNames: ''
  });

  if (!isOpen) return null;

  const handleRunPreset = async (preset: 'valid_sbi' | 'tampered_pnb' | 'single_holder' | 'shortfall_andhra') => {
    setIsScanning(true);
    setFileName(`${preset}_scanned_instrument.pdf`);

    const result = await simulateNeuroSymbolicOcr({ name: `${preset}.pdf`, size: 1024000 }, preset);
    setOcrResult(result);

    const institution = institutions.find(i => i.id === selectedInstId);

    setFormData({
      fdrNumber: result.fdrNumber,
      bankName: result.bankName,
      branchName: result.branchName,
      ifscCode: result.ifscCode,
      accountNumber: '392819201948',
      depositAmount: result.depositAmount,
      interestRate: result.interestRate,
      issueDate: result.issueDate,
      maturityDate: result.maturityDate,
      tenureYears: result.tenureYears,
      jointHolderNames: result.jointHolderNames
    });

    setIsScanning(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setFileName(file.name);

    let preset: any = undefined;
    if (file.name.toLowerCase().includes('tamper') || file.name.toLowerCase().includes('fake')) {
      preset = 'tampered_pnb';
    } else if (file.name.toLowerCase().includes('single')) {
      preset = 'single_holder';
    }

    const result = await simulateNeuroSymbolicOcr(file, preset);
    setOcrResult(result);

    setFormData({
      fdrNumber: result.fdrNumber,
      bankName: result.bankName,
      branchName: result.branchName,
      ifscCode: result.ifscCode,
      accountNumber: '441002938192',
      depositAmount: result.depositAmount,
      interestRate: result.interestRate,
      issueDate: result.issueDate,
      maturityDate: result.maturityDate,
      tenureYears: result.tenureYears,
      jointHolderNames: result.jointHolderNames
    });

    setIsScanning(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inst = institutions.find(i => i.id === selectedInstId);

    const newFdr = await addNewFdr({
      ...formData,
      institutionId: selectedInstId,
      institutionName: inst?.name,
      region: inst?.region || 'WRO_MUMBAI',
      documentUrl: `/samples/${fileName || 'fdr_upload.pdf'}`,
      documentHash: ocrResult?.extractedHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      isForgedSuspect: (ocrResult?.elaForgeryScore || 0) > 0.4,
      forgeryConfidenceScore: ocrResult?.elaForgeryScore || 0.02
    });

    onSuccess(newFdr.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Digital FDR Ingestion & Verification Engine</h3>
              <p className="text-[11px] text-slate-300">
                LayoutLM Multimodal Vision-Language Extraction & ELA Forgery Scan
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Institution Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Submitting Institution
            </label>
            <select
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.aicteId} • {inst.category} • {inst.region})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Simulation Presets */}
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-amber-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Real-World Scenarios (One-Click Ingestion)</span>
              </span>
              <span className="text-[10px] text-slate-400">LayoutLM v3 + ELA</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleRunPreset('valid_sbi')}
                className="p-2 text-left bg-slate-900 hover:bg-slate-700 rounded-lg border border-emerald-900/60 hover:border-emerald-500 text-[11px] transition-all"
              >
                <div className="font-semibold text-emerald-400">1. Valid SBI FDR</div>
                <div className="text-[10px] text-slate-400 truncate">₹35L • Clean Joint</div>
              </button>
              <button
                type="button"
                onClick={() => handleRunPreset('tampered_pnb')}
                className="p-2 text-left bg-slate-900 hover:bg-slate-700 rounded-lg border border-rose-900/60 hover:border-rose-500 text-[11px] transition-all"
              >
                <div className="font-semibold text-rose-400">2. Tampered PNB</div>
                <div className="text-[10px] text-slate-400 truncate">ELA Forgery Alert</div>
              </button>
              <button
                type="button"
                onClick={() => handleRunPreset('single_holder')}
                className="p-2 text-left bg-slate-900 hover:bg-slate-700 rounded-lg border border-amber-900/60 hover:border-amber-500 text-[11px] transition-all"
              >
                <div className="font-semibold text-amber-400">3. Single Holder</div>
                <div className="text-[10px] text-slate-400 truncate">Missing AICTE RO</div>
              </button>
              <button
                type="button"
                onClick={() => handleRunPreset('shortfall_andhra')}
                className="p-2 text-left bg-slate-900 hover:bg-slate-700 rounded-lg border border-blue-900/60 hover:border-blue-500 text-[11px] transition-all"
              >
                <div className="font-semibold text-blue-400">4. Shortfall FDR</div>
                <div className="text-[10px] text-slate-400 truncate">₹10L vs ₹15L Norm</div>
              </button>
            </div>
          </div>

          {/* Or Drag & Drop Area */}
          <div className="relative border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-6 text-center transition-colors">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-10 h-10 mx-auto text-slate-500 mb-2" />
            <p className="text-xs font-medium text-slate-300">
              Drag & drop physical Fixed Deposit Receipt scan or click to browse
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Supports PDF, PNG, TIFF (Max 25 MB). Optical OCR & ELA run automatically.
            </p>
            {fileName && (
              <div className="mt-3 inline-flex items-center space-x-1.5 bg-blue-950/80 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-800">
                <FileCheck className="w-3.5 h-3.5" />
                <span>{fileName}</span>
              </div>
            )}
          </div>

          {/* Scanning Progress */}
          {isScanning && (
            <div className="p-4 bg-blue-950/40 border border-blue-800 rounded-xl flex items-center space-x-3 animate-pulse">
              <Cpu className="w-5 h-5 text-blue-400 animate-spin" />
              <div className="text-xs text-blue-300">
                <p className="font-semibold">Executing Multimodal Spatial Layout Analysis...</p>
                <p className="text-[10px] text-blue-400">
                  Detecting bank seals, key-value bounding boxes, and Error Level Analysis (ELA) compression deltas.
                </p>
              </div>
            </div>
          )}

          {/* Forensic / OCR Inspection Banner */}
          {ocrResult && !isScanning && (
            <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white">AI Vision-Extraction Summary</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                    Confidence: {(ocrResult.rawConfidence * 100).toFixed(0)}%
                  </span>
                </div>
                {/* Forgery ELA Badge */}
                <div className="flex items-center space-x-1.5 text-xs">
                  <span className="text-[10px] text-slate-400">ELA Forgery Metric:</span>
                  {ocrResult.elaForgeryScore > 0.4 ? (
                    <span className="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded font-bold text-[10px] flex items-center space-x-1 animate-pulse">
                      <ShieldAlert className="w-3 h-3 text-rose-400" />
                      <span>HIGH SUSPECT ({(ocrResult.elaForgeryScore * 100).toFixed(1)}%)</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono text-[10px]">
                      Authentic Raster ({(ocrResult.elaForgeryScore * 100).toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Form Fields populated by OCR */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">FDR Instrument Number</label>
                    <input
                      type="text"
                      value={formData.fdrNumber}
                      onChange={e => setFormData({ ...formData, fdrNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Issuing Bank Name</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Bank IFSC Code</label>
                    <input
                      type="text"
                      value={formData.ifscCode}
                      onChange={e => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono uppercase"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Deposit Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.depositAmount}
                      onChange={e => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Maturity Date (10-Yr)</label>
                    <input
                      type="date"
                      value={formData.maturityDate}
                      onChange={e => setFormData({ ...formData, maturityDate: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 text-xs">
                    Joint Holder Title (Must include Trust and Regional Officer, AICTE)
                  </label>
                  <input
                    type="text"
                    value={formData.jointHolderNames}
                    onChange={e => setFormData({ ...formData, jointHolderNames: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs"
                    required
                  />
                </div>

                <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 font-mono truncate max-w-sm">
                    SHA-256: {ocrResult.extractedHash.slice(0, 24)}...
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg transition-all"
                  >
                    <span>Ingest & Run Discrepancy Matrix</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

