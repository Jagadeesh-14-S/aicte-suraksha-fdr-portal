import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Landmark, 
  CheckCircle2, 
  AlertOctagon,
  ArrowUpRight,
  Plus,
  FileSearch,
  BookOpen,
  Building,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { REGIONAL_OFFICES_METADATA } from '../data/aicteNorms';
import { RegionalOffice } from '../types';
import { IndiaEmblem, AicteEmblem } from '../components/Emblems';

interface DashboardOverviewProps {
  onNavigateTab: (tab: any) => void;
  onOpenUpload: () => void;
  onSelectFdr: (fdrId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTab,
  onOpenUpload,
  onSelectFdr
}) => {
  const { fdrList } = useApp();
  const { currentUser } = useAuth();

  // Aggregate Metrics
  const totalDepositAmount = fdrList.reduce((acc, f) => acc + f.depositAmount, 0);
  const activeFdrCount = fdrList.filter(f => f.status !== 'RELEASED').length;
  const lienConfirmedCount = fdrList.filter(f => f.lienStatus === 'LIEN_CONFIRMED').length;
  const discrepancyCount = fdrList.filter(f => f.status === 'DISCREPANCY_FLAGGED').length;
  const maturingSoonCount = fdrList.filter(f => f.status === 'MATURING_SOON' || f.status === 'MATURED').length;
  const releasePendingCount = fdrList.filter(f => f.status === 'RELEASE_REQUESTED').length;

  const lienComplianceRate = Math.round((lienConfirmedCount / (fdrList.length || 1)) * 100);

  // Group by Region
  const regionBreakdown: Record<string, { count: number; value: number }> = {};
  fdrList.forEach(f => {
    if (!regionBreakdown[f.region]) {
      regionBreakdown[f.region] = { count: 0, value: 0 };
    }
    regionBreakdown[f.region].count += 1;
    regionBreakdown[f.region].value += f.depositAmount;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Official AICTE Regulation Bureau Executive Banner */}
      <div className="bg-[#0B3558] rounded-xl p-6 text-white shadow-sm border border-[#082842] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span>अखिल भारतीय तकनीकी शिक्षा परिषद • विनियमन ब्यूरो</span>
              <span className="text-slate-400">•</span>
              <span>New Delhi</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif">
              National Security Deposit & FDR Surveillance Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Statutory regulatory portal for automated validity monitoring, live Core Banking Solution (CBS) lien tracking, multi-tier discrepancy detection, and 10-year lock-in refund management under AICTE Approval Process Handbook (APH) regulations.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0 self-start md:self-center">
            <button
              onClick={onOpenUpload}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-[#0B3558] font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Digital FDR</span>
            </button>
            <button
              onClick={() => onNavigateTab('repository')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 flex items-center space-x-1.5 transition-colors"
            >
              <span>Repository ({fdrList.length})</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtle Ashoka Emblem Watermark in background */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
          <IndiaEmblem className="w-48 h-48 text-white" />
        </div>
      </div>

      {/* 2. Official Statutory KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Escrow Under Custody */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Total Deposit Corpus</span>
            <div className="p-2 bg-blue-50 rounded-lg text-[#0B3558]">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0B3558] font-mono">
            ₹ {(totalDepositAmount / 10000000).toFixed(2)} Cr
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1.5">
            <span className="text-emerald-700 font-semibold">{activeFdrCount} Active Instruments</span>
            <span>across 8 Territorial ROs</span>
          </div>
        </div>

        {/* KPI 2: CBS Live Lien Compliance */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Bank Lien Compliance</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            {lienComplianceRate}%
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <strong className="text-slate-800">{lienConfirmedCount} of {fdrList.length}</strong> non-encashable liens marked in CBS
          </div>
        </div>

        {/* KPI 3: Scrutiny Discrepancies */}
        <div 
          onClick={() => onNavigateTab('scrutiny')}
          className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm hover:border-red-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Discrepancy Cases</span>
            <div className="p-2 bg-red-50 rounded-lg text-red-700 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-red-700 font-mono">
            {discrepancyCount}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
            <span className="text-red-700 font-bold">Action Required:</span>
            <span>RO Scrutiny & ELA Review</span>
          </div>
        </div>

        {/* KPI 4: Maturity Surveillance */}
        <div 
          onClick={() => onNavigateTab('maturity')}
          className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Maturity Alerts</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-700 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono">
            {maturingSoonCount}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <strong className="text-amber-700">{releasePendingCount}</strong> release requests under statutory review
          </div>
        </div>
      </div>

      {/* 3. Operational Queue & Regional Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): Priority Cases Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                Priority Regulatory Action Queue
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('scrutiny')}
              className="text-xs text-[#0B3558] hover:underline font-bold flex items-center space-x-1"
            >
              <span>View All Regional Cases</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="px-3.5 py-2.5">Institution & Instrument No</th>
                  <th className="px-3.5 py-2.5">Principal Sum</th>
                  <th className="px-3.5 py-2.5">Territorial RO</th>
                  <th className="px-3.5 py-2.5">Regulatory Finding</th>
                  <th className="px-3.5 py-2.5">Status</th>
                  <th className="px-3.5 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fdrList.slice(0, 5).map((fdr) => (
                  <tr key={fdr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3.5 py-3">
                      <div className="font-bold text-slate-900 truncate max-w-[200px]">
                        {fdr.institutionName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">{fdr.fdrNumber}</div>
                    </td>
                    <td className="px-3.5 py-3 font-mono font-bold text-slate-800">
                      ₹ {(fdr.depositAmount / 100000).toFixed(1)} L
                    </td>
                    <td className="px-3.5 py-3 text-slate-600 font-semibold text-[11px]">
                      {fdr.region.split('_')[0]}
                    </td>
                    <td className="px-3.5 py-3">
                      {fdr.discrepancies.length > 0 ? (
                        <span className="text-red-700 text-[11px] font-semibold truncate block max-w-[170px]" title={fdr.discrepancies[0].ruleTitle}>
                          {fdr.discrepancies[0].ruleTitle}
                        </span>
                      ) : (
                        <span className="text-emerald-700 text-[11px] font-medium flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>100% Compliant</span>
                        </span>
                      )}
                    </td>
                    <td className="px-3.5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        fdr.status === 'DISCREPANCY_FLAGGED'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : fdr.status === 'MATURING_SOON'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : fdr.status === 'RELEASE_REQUESTED'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {fdr.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <button
                        onClick={() => onSelectFdr(fdr.id)}
                        className="px-2.5 py-1 bg-[#0B3558] hover:bg-[#124b7a] text-white rounded text-[11px] font-medium transition-colors shadow-sm"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 Cols): Regional Coverage & Regulatory Standards */}
        <div className="lg:col-span-4 space-y-5">
          {/* Territorial Regional Office Distribution */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Territorial RO Coverage
              </h3>
              <span className="text-[10px] font-mono text-slate-500">8 Regional Offices</span>
            </div>

            <div className="space-y-3 pt-1">
              {(Object.keys(REGIONAL_OFFICES_METADATA) as RegionalOffice[]).slice(0, 5).map((reg) => {
                const data = regionBreakdown[reg] || { count: 0, value: 0 };
                const pct = Math.round((data.value / (totalDepositAmount || 1)) * 100);

                return (
                  <div key={reg} className="text-xs space-y-1">
                    <div className="flex justify-between text-slate-700">
                      <span className="truncate max-w-[160px] font-medium">{REGIONAL_OFFICES_METADATA[reg].name}</span>
                      <span className="font-mono text-[#0B3558] font-bold">₹ {(data.value / 100000).toFixed(0)} L ({data.count})</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="bg-[#0B3558] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 10)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigateTab('repository')}
              className="w-full mt-2 py-2 bg-slate-100 hover:bg-slate-200 text-[#0B3558] font-bold rounded-lg text-xs transition-colors border border-slate-200 text-center"
            >
              Filter All 8 Regional Offices
            </button>
          </div>

          {/* Technical Regulatory Standards Spotlight */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-[#0B3558] font-bold">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Statutory Compliance Architecture</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Designed according to AICTE Approval Process Handbook (APH) Chapters 1 & 2 norms, ISO 20022 Core Banking Messaging standards, and SHA-256 Merkle Audit trails.
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="font-mono text-slate-500">Standards: ISO 20022 / NeSL</span>
              <button
                onClick={() => onNavigateTab('research')}
                className="text-[#0B3558] hover:underline font-bold"
              >
                View Research Hub &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
