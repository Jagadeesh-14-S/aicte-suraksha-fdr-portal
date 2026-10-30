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
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();

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
      {/* 1. Official AICTE Regulation Bureau Executive Banner (Authentic Government White & Tricolor) */}
      <div className="bg-white rounded-xl p-6 text-slate-900 shadow-xs border border-slate-200/90 relative overflow-hidden">
        {/* Top Sovereign Tricolor Accent Ribbon */}
        <div className="h-1.5 w-full flex absolute top-0 left-0">
          <div className="w-1/3 bg-[#FF9933]"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-[#138808]"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 pt-1">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#C2410C] text-xs font-bold uppercase tracking-wider">
              <span>{t('hero_council')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
              {t('hero_title')}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="bg-emerald-50 text-emerald-900 px-2.5 py-0.5 rounded font-mono font-bold border border-emerald-300">
                Policy Active: AICTE APH 2024-27 (v2.18)
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-medium">
                10-Year Lock-In & Separation of Scrutiny/Approval Enforced
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {t('hero_subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-center">
            <button
              onClick={() => onNavigateTab('lineage')}
              className="px-3.5 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 border border-orange-300 shadow-2xs transition-colors"
            >
              <span>Provenance & Lineage</span>
            </button>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2.5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t('btn_submit_fdr')}</span>
            </button>
            <button
              onClick={() => onNavigateTab('repository')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 flex items-center space-x-1.5 transition-colors"
            >
              <span>{t('btn_view_repo')} ({fdrList.length})</span>
              <ArrowUpRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Subtle Ashoka Emblem Watermark in background */}
        <div className="absolute right-4 -bottom-6 opacity-5 pointer-events-none text-slate-900">
          <IndiaEmblem className="w-48 h-48" />
        </div>
      </div>

      {/* 2. Official Statutory KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Escrow Under Custody */}
        <div className="bg-white border border-slate-200/90 border-t-4 border-t-amber-600 rounded-xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{t('kpi_total_corpus')}</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-800">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            ₹ {(totalDepositAmount / 10000000).toFixed(2)} Cr
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1.5">
            <span className="text-emerald-700 font-semibold">{activeFdrCount} Active Instruments</span>
            <span>across 8 Territorial ROs</span>
          </div>
        </div>

        {/* KPI 2: CBS Live Lien Compliance */}
        <div className="bg-white border border-slate-200/90 border-t-4 border-t-emerald-600 rounded-xl p-5 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{t('kpi_bank_lien')}</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 font-mono">
            {lienComplianceRate}%
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <strong className="text-slate-800">{lienConfirmedCount} of {fdrList.length}</strong> {t('kpi_bank_desc')}
          </div>
        </div>

        {/* KPI 3: Scrutiny Discrepancies */}
        <div 
          onClick={() => onNavigateTab('scrutiny')}
          className="bg-white border border-slate-200/90 border-t-4 border-t-rose-600 rounded-xl p-5 shadow-xs hover:border-red-400 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{t('kpi_discrepancy')}</span>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-800 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-700 font-mono">
            {discrepancyCount}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
            <span className="text-rose-700 font-bold">{t('kpi_discrepancy_desc')}</span>
          </div>
        </div>

        {/* KPI 4: Maturity Surveillance */}
        <div 
          onClick={() => onNavigateTab('maturity')}
          className="bg-white border border-slate-200/90 border-t-4 border-t-orange-500 rounded-xl p-5 shadow-xs hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{t('kpi_maturity')}</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-800 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-800 font-mono">
            {maturingSoonCount}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <strong className="text-amber-800">{releasePendingCount}</strong> {t('kpi_maturity_desc')}
          </div>
        </div>
      </div>

      {/* 3. Operational Queue & Regional Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): Priority Cases Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-[#C2410C]" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                {t('queue_title')}
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('scrutiny')}
              className="text-xs text-[#C2410C] hover:underline font-bold flex items-center space-x-1"
            >
              <span>{t('view_all_cases')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="px-3.5 py-2.5">{t('col_inst_name')}</th>
                  <th className="px-3.5 py-2.5">{t('col_principal')}</th>
                  <th className="px-3.5 py-2.5">{t('col_ro')}</th>
                  <th className="px-3.5 py-2.5">{t('col_finding')}</th>
                  <th className="px-3.5 py-2.5">{t('col_status')}</th>
                  <th className="px-3.5 py-2.5 text-right">{t('col_action')}</th>
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
                    <td className="px-3.5 py-3 text-slate-700 font-semibold text-[11px]">
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
                          <span>{t('status_compliant')}</span>
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
                          ? 'bg-orange-50 text-orange-800 border border-orange-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {fdr.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <button
                        onClick={() => onSelectFdr(fdr.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-[11px] font-semibold transition-colors shadow-2xs"
                      >
                        {t('btn_inspect')}
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
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                {t('territorial_coverage')}
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
                      <span className="font-mono text-slate-900 font-bold">₹ {(data.value / 100000).toFixed(0)} L ({data.count})</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="bg-[#C2410C] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 10)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigateTab('repository')}
              className="w-full mt-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors border border-slate-300 text-center"
            >
              {t('filter_all_ros')}
            </button>
          </div>

          {/* Technical Regulatory Standards Spotlight */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
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
                className="text-[#C2410C] hover:underline font-bold"
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
