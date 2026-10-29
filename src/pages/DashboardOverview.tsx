import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Layers, 
  Landmark, 
  FileCheck2, 
  Building2, 
  TrendingUp, 
  CheckCircle2, 
  AlertOctagon,
  ArrowUpRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { REGIONAL_OFFICES_METADATA } from '../data/aicteNorms';
import { RegionalOffice } from '../types';

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
  const { fdrList, institutions, notifications } = useApp();
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
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>All India Council for Technical Education • Regulation Bureau</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Security Deposit & Fixed Deposit Central Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Unified digital repository providing real-time lien tracking, automated 10-year maturity monitoring, multimodal forgery detection, and statutory release workflow for technical institutions.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onOpenUpload}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Digital FDR</span>
            </button>
            <button
              onClick={() => onNavigateTab('repository')}
              className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-all"
            >
              <span>Explore Master Repository</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Escrow Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Escrow Funds</span>
            <div className="p-2 bg-blue-950 rounded-lg text-blue-400">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ₹ {(totalDepositAmount / 10000000).toFixed(2)} Cr
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">{activeFdrCount} Active Instruments</span>
            <span>across 8 Regional Offices</span>
          </div>
        </div>

        {/* KPI 2: CBS Lien Compliance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Bank Lien Compliance</span>
            <div className="p-2 bg-emerald-950 rounded-lg text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {lienComplianceRate}%
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-400">
            <span className="text-slate-300 font-semibold">{lienConfirmedCount} of {fdrList.length}</span>
            <span>confirmed via Core Banking</span>
          </div>
        </div>

        {/* KPI 3: Discrepancy & Tamper Alerts */}
        <div 
          onClick={() => onNavigateTab('scrutiny')}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-rose-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Discrepancy Flags</span>
            <div className="p-2 bg-rose-950 rounded-lg text-rose-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">
            {discrepancyCount}
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-400">
            <span className="text-rose-400 font-semibold">Action Required</span>
            <span>• ELA & Joint Name Deficits</span>
          </div>
        </div>

        {/* KPI 4: Imminent Maturity & Renewals */}
        <div 
          onClick={() => onNavigateTab('maturity')}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-amber-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Maturity Alerts (&lt; 90 Days)</span>
            <div className="p-2 bg-amber-950 rounded-lg text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {maturingSoonCount}
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">{releasePendingCount} Release Pending</span>
            <span>• Auto Reminders Active</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Regional Distribution & High Priority Action Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): Critical Action Items Queue */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Urgent Action Queue (AICTE Regulation Bureau Priority)
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('scrutiny')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
            >
              <span>View All Scrutiny Cases</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-2.5 rounded-l-lg">Institution & FDR No</th>
                  <th className="px-3 py-2.5">Deposit Amount</th>
                  <th className="px-3 py-2.5">Region</th>
                  <th className="px-3 py-2.5">Critical Observation</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {fdrList.slice(0, 5).map((fdr) => (
                  <tr key={fdr.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-3 py-3">
                      <div className="font-semibold text-white truncate max-w-[200px]">
                        {fdr.institutionName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">{fdr.fdrNumber}</div>
                    </td>
                    <td className="px-3 py-3 font-mono font-medium text-slate-200">
                      ₹ {(fdr.depositAmount / 100000).toFixed(1)} L
                    </td>
                    <td className="px-3 py-3 text-slate-400 font-mono text-[11px]">
                      {fdr.region.split('_')[0]}
                    </td>
                    <td className="px-3 py-3">
                      {fdr.discrepancies.length > 0 ? (
                        <span className="text-rose-400 text-[11px] font-medium truncate block max-w-[180px]" title={fdr.discrepancies[0].ruleTitle}>
                          {fdr.discrepancies[0].ruleTitle}
                        </span>
                      ) : (
                        <span className="text-emerald-400 text-[11px] flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Fully Compliant</span>
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        fdr.status === 'DISCREPANCY_FLAGGED'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : fdr.status === 'MATURING_SOON'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : fdr.status === 'RELEASE_REQUESTED'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {fdr.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => onSelectFdr(fdr.id)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-white rounded text-[11px] font-medium transition-colors"
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

        {/* Right Column (4 Cols): Regional Coverage & AICTE Compliance Index */}
        <div className="lg:col-span-4 space-y-4">
          {/* Regional Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Territorial RO Distribution
              </h3>
              <span className="text-[10px] font-mono text-slate-400">8 Regional Offices</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {(Object.keys(REGIONAL_OFFICES_METADATA) as RegionalOffice[]).slice(0, 5).map((reg) => {
                const data = regionBreakdown[reg] || { count: 0, value: 0 };
                const pct = Math.round((data.value / (totalDepositAmount || 1)) * 100);

                return (
                  <div key={reg} className="text-xs space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span className="truncate max-w-[150px] font-medium">{REGIONAL_OFFICES_METADATA[reg].name}</span>
                      <span className="font-mono text-amber-400">₹ {(data.value / 100000).toFixed(0)} L ({data.count})</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 8)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigateTab('repository')}
              className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Filter by All Regions
            </button>
          </div>

          {/* Academic Innovation Spotlight */}
          <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/50 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>Research Foundation (2016-2021)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Powered by 8 seminal peer-reviewed papers (IEEE Access, Springer, Elsevier) on LayoutLM visual transformers, Merkle audit trees, and Core Banking smart escrow protocols.
            </p>
            <button
              onClick={() => onNavigateTab('research')}
              className="text-[11px] text-amber-300 hover:text-amber-200 font-semibold flex items-center space-x-1"
            >
              <span>Explore Academic Synthesis Hub</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

