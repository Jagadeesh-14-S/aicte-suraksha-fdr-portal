import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileSearch, 
  Landmark, 
  ClockAlert, 
  FileCheck, 
  Binary, 
  GraduationCap,
  ShieldCheck,
  Building,
  UserCheck,
  GitFork
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

export type NavTab = 
  | 'dashboard'
  | 'repository'
  | 'lineage'
  | 'scrutiny'
  | 'bank-portal'
  | 'maturity'
  | 'release'
  | 'ledger'
  | 'research';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser } = useAuth();
  const { fdrList } = useApp();
  const { t } = useLanguage();

  const flaggedCount = fdrList.filter(f => f.status === 'DISCREPANCY_FLAGGED').length;
  const maturingCount = fdrList.filter(f => f.status === 'MATURING_SOON' || f.status === 'MATURED').length;
  const releasePendingCount = fdrList.filter(f => f.status === 'RELEASE_REQUESTED').length;

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      labelKey: 'nav_dashboard',
      defaultLabel: 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'repository' as NavTab,
      labelKey: 'nav_repository',
      defaultLabel: 'FDR Master Repository',
      icon: FolderKanban,
      badge: fdrList.length,
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-300'
    },
    {
      id: 'lineage' as NavTab,
      labelKey: 'nav_lineage',
      defaultLabel: 'Evidence Provenance & Lineage',
      icon: GitFork,
      badge: 'P0 Core',
      badgeColor: 'bg-orange-100 text-orange-950 border border-orange-200'
    },
    {
      id: 'scrutiny' as NavTab,
      labelKey: 'nav_scrutiny',
      defaultLabel: 'Scrutiny Bureau (RO)',
      icon: FileSearch,
      badge: flaggedCount > 0 ? `${flaggedCount}` : null,
      badgeColor: 'bg-rose-100 text-rose-800 border border-rose-200'
    },
    {
      id: 'bank-portal' as NavTab,
      labelKey: 'nav_cbs',
      defaultLabel: 'Core Banking (CBS) Gateway',
      icon: Landmark,
      badge: 'NeSL',
      badgeColor: 'bg-purple-100 text-purple-800 border border-purple-200'
    },
    {
      id: 'maturity' as NavTab,
      labelKey: 'nav_maturity',
      defaultLabel: 'Maturity & Validity Radar',
      icon: ClockAlert,
      badge: maturingCount > 0 ? `${maturingCount}` : null,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-200'
    },
    {
      id: 'release' as NavTab,
      labelKey: 'nav_refund',
      defaultLabel: 'Release & Refund Portal',
      icon: FileCheck,
      badge: releasePendingCount > 0 ? `${releasePendingCount}` : null,
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    },
    {
      id: 'ledger' as NavTab,
      labelKey: 'nav_ledger',
      defaultLabel: 'Regulatory Audit Ledger',
      icon: Binary,
      badge: 'CAG Proof',
      badgeColor: 'bg-slate-100 text-slate-800 border border-slate-300'
    },
    {
      id: 'research' as NavTab,
      labelKey: 'nav_research',
      defaultLabel: 'Academic Research Hub',
      icon: GraduationCap,
      badge: '2016-2021',
      badgeColor: 'bg-orange-100 text-orange-900 border border-orange-200'
    }
  ];

  return (
    <aside className="w-64 bg-white text-slate-800 border-r border-slate-200/90 flex flex-col justify-between shrink-0 shadow-2xs">
      <div className="p-3.5">
        {/* Officer Profile Card */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-4 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C2410C] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="truncate">
              <div className="font-bold text-slate-900 truncate text-[11px]">{currentUser.name}</div>
              <div className="text-[10px] text-amber-900 font-semibold uppercase tracking-wider">{currentUser.role.replace('_', ' ')}</div>
            </div>
          </div>
        </div>

        {/* Navigation Category Label */}
        <div className="px-2 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {t('regulatory_portals')}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                  isActive
                    ? 'bg-orange-50 text-orange-950 font-bold border-l-4 border-l-[#C2410C] shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C2410C]' : 'text-slate-500'}`} />
                  <span className="truncate">{t(item.labelKey, item.defaultLabel)}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${item.badgeColor || 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Statutory Regulatory Footnote */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/60">
        <div className="flex items-center space-x-2 text-[11px] text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="truncate">{t('compliance_norm')}</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1 leading-snug">
          Central surveillance repository mandated for all AICTE approved institutions across India.
        </p>
      </div>
    </aside>
  );
};
