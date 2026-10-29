import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Award, 
  Layers, 
  ShieldCheck, 
  Copy, 
  Check, 
  Search,
  Filter
} from 'lucide-react';
import { ACADEMIC_RESEARCH_PAPERS } from '../data/academicResearchRefs';
import { ResearchPaper } from '../types';

export const ResearchSynthesis: React.FC = () => {
  const [publisherFilter, setPublisherFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPapers = ACADEMIC_RESEARCH_PAPERS.filter(p => {
    const matchPub = publisherFilter === 'ALL' || p.publisher === publisherFilter;
    const matchSearch = 
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchPub && matchSearch;
  });

  const handleCopyCitation = (paper: ResearchPaper) => {
    const citation = `${paper.authors} (${paper.year}). ${paper.title}. ${paper.venue}. https://doi.org/${paper.doiOrUrl}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(paper.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 text-white shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <GraduationCap className="w-5 h-5 text-amber-400" />
          <span>Peer-Reviewed Academic Literature Foundation (2016–2021)</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Scientific Research & Novelty Architecture Synthesis
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          AICTE-SURAKSHA synthesizes 8 foundational papers published in <strong>IEEE Xplore</strong>, <strong>SpringerLink</strong>, and <strong>Elsevier ScienceDirect</strong> between 2016 and 2021. It elevates academic breakthroughs into an operational, ultra-advanced regulatory prototype.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-[11px] bg-blue-950 text-blue-300 px-3 py-1 rounded-full border border-blue-800 font-medium">
            IEEE Access & Transactions
          </span>
          <span className="text-[11px] bg-emerald-950 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800 font-medium">
            Springer Financial Innovation & LNCS
          </span>
          <span className="text-[11px] bg-amber-950 text-amber-300 px-3 py-1 rounded-full border border-amber-800 font-medium">
            Elsevier Forensic Science & ESWA
          </span>
        </div>
      </div>

      {/* Comparative Novelty Matrix: Traditional vs Literature vs AICTE-SURAKSHA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Ultra-Advanced Novelty & Differentiation Matrix</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Capability Dimension</th>
                <th className="px-4 py-3">Traditional AICTE Practice</th>
                <th className="px-4 py-3">Academic Literature (2016–2021)</th>
                <th className="px-4 py-3 bg-blue-950/40 text-blue-300">AICTE-SURAKSHA (Novel Contribution)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="hover:bg-slate-800/30">
                <td className="px-4 py-3.5 font-bold text-white">Document Verification</td>
                <td className="px-4 py-3.5 text-slate-400">Manual physical scrutiny in regional filing cabinets</td>
                <td className="px-4 py-3.5 text-slate-300">Basic OCR text extraction (Xu et al., 2020)</td>
                <td className="px-4 py-3.5 bg-blue-950/20 font-semibold text-emerald-300">
                  Multimodal LayoutLM + Error Level Analysis (ELA) pixel tamper detection
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="px-4 py-3.5 font-bold text-white">Bank Lien Encumbrance</td>
                <td className="px-4 py-3.5 text-slate-400">Postal letters between AICTE RO and bank branch</td>
                <td className="px-4 py-3.5 text-slate-300">Consortium smart contract guarantees (Wang et al., 2019)</td>
                <td className="px-4 py-3.5 bg-blue-950/20 font-semibold text-emerald-300">
                  Live ISO 20022 camt.053 Core Banking Solution (CBS) API integration with NeSL e-BG
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="px-4 py-3.5 font-bold text-white">Maturity Monitoring</td>
                <td className="px-4 py-3.5 text-slate-400">Reactive checks only when institutions apply</td>
                <td className="px-4 py-3.5 text-slate-300">Time-based smart contract events (Zhang et al., 2017)</td>
                <td className="px-4 py-3.5 bg-blue-950/20 font-semibold text-emerald-300">
                  Predictive Multi-Tier Escalation Radar (T-180, T-90, T-30, T-0) with Omnichannel Webhooks
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="px-4 py-3.5 font-bold text-white">Release / Refund Audit</td>
                <td className="px-4 py-3.5 text-slate-400">6–18 month paper dossier circulation</td>
                <td className="px-4 py-3.5 text-slate-300">Merkle root document verification (Hahn & Wonsun, 2018)</td>
                <td className="px-4 py-3.5 bg-blue-950/20 font-semibold text-emerald-300">
                  4-Tier Cryptographic Merkle State Machine with Zero-Knowledge Audit Dossier export for CAG/CVC
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
        <div className="flex items-center space-x-2">
          {['ALL', 'IEEE', 'Springer', 'Elsevier', 'ACM'].map(pub => (
            <button
              key={pub}
              onClick={() => setPublisherFilter(pub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                publisherFilter === pub
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              {pub}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search papers by keyword..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPapers.map((paper) => (
          <div
            key={paper.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between text-xs space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  paper.publisher === 'IEEE'
                    ? 'bg-blue-950 text-blue-300 border-blue-800'
                    : paper.publisher === 'Springer'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : paper.publisher === 'Elsevier'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-purple-950 text-purple-300 border-purple-800'
                }`}>
                  {paper.publisher} • {paper.year}
                </span>

                <span className="font-mono text-[10px] text-slate-400">{paper.id}</span>
              </div>

              <h3 className="font-bold text-white text-sm leading-snug">
                {paper.title}
              </h3>
              <p className="text-[11px] text-slate-400 italic">
                {paper.authors} — <span className="text-slate-300 not-italic font-medium">{paper.venue}</span>
              </p>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Core Scholarly Contribution:
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {paper.coreContribution}
                </p>
              </div>

              <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-900/60 space-y-1.5">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>How AICTE-SURAKSHA Implements This:</span>
                </span>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  {paper.surakshaImplementation}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {paper.tags.map(t => (
                  <span key={t} className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleCopyCitation(paper)}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1 shrink-0 ml-2"
                title="Copy APA Citation"
              >
                {copiedId === paper.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Cite Paper</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

