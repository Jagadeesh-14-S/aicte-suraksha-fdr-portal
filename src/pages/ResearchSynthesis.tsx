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
      {/* Official Page Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-800 uppercase tracking-wider">
          <GraduationCap className="w-5 h-5 text-blue-700" />
          <span>Peer-Reviewed Academic Literature Foundation (2016–2021)</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Scientific Research & Novelty Architecture Synthesis
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          The AICTE-SURAKSHA portal synthesizes foundational research published in <strong>IEEE Xplore</strong>, <strong>SpringerLink</strong>, and <strong>Elsevier ScienceDirect</strong> between 2016 and 2021, elevating academic breakthroughs in financial forensics and distributed consensus into an operational government regulatory portal.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs bg-blue-50 text-blue-800 px-3 py-1 rounded-full border border-blue-200 font-medium">
            IEEE Access & Transactions (Computer Vision & Security)
          </span>
          <span className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 font-medium">
            Springer Financial Innovation & LNCS
          </span>
          <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200 font-medium">
            Elsevier Forensic Science & Expert Systems with Applications
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search papers, authors, algorithms..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
            {['ALL', 'IEEE', 'Springer', 'Elsevier'].map(pub => (
              <button
                key={pub}
                onClick={() => setPublisherFilter(pub)}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  publisherFilter === pub
                    ? 'bg-[#C2410C] text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {pub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Research Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPapers.map(paper => (
          <div key={paper.id} className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                  paper.publisher === 'IEEE' 
                    ? 'bg-blue-50 text-blue-800 border-blue-200' 
                    : paper.publisher === 'Springer'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {paper.publisher} • {paper.year}
                </span>
                <span className="text-xs text-slate-500 font-mono">{paper.venue}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                {paper.title}
              </h3>

              <div className="text-xs text-slate-600">
                Authors: <span className="text-slate-800 font-medium">{paper.authors}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                <strong className="text-slate-800">Key Finding:</strong> {paper.coreContribution}
              </p>

              <div className="pt-1">
                <div className="text-[11px] text-blue-900 font-semibold mb-1">
                  Relevance to AICTE-SURAKSHA:
                </div>
                <div className="text-xs text-slate-700 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                  {paper.surakshaImplementation}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {paper.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleCopyCitation(paper)}
                className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium flex items-center space-x-1"
              >
                {copiedId === paper.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Cite</span>
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
