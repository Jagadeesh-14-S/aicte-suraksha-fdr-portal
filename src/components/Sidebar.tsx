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
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export type NavTab = 
  | 'dashboard'
  | 'repository'
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

  const flaggedCount = fdrList.filter(f => f.status === 'DISCREPANCY_FLAGGED').length;
  const maturingCount = fdrList.filter(f => f.status === 'MATURING_SOON' || f.status === 'MATURED').length;
  const releasePendingCount = fdrList.filter(f => f.status === 'RELEASE_REQUESTED').length;

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'repository' as NavTab,
      label: 'FDR Master Repository',
      icon: FolderKanban,
      badge: fdrList.length
    },
    {
      id: 'scrutiny' as NavTab,
      label: 'Scrutiny Bureau (RO)',
      icon: FileSearch,
      badge: flaggedCount > 0 ? `${flaggedCount} Case${flaggedCount > 1 ? 's' : ''}` : null,
      badgeColor: 'bg-red-600 text-white'
    },
    {
      id: 'bank-portal' as NavTab,
      label: 'Core Banking (CBS) Gateway',
      icon: Landmark,
      badge: 'NeSL'
    },
    {
      id: 'maturity' as NavTab,
      label: 'Maturity & Validity Radar',
      icon: ClockAlert,
      badge: maturingCount > 0 ? `${maturingCount} Alerts` : null,
      badgeColor: 'bg-amber-600 text-white'
    },
    {
      id: 'release' as NavTab,
      label: 'Release & Refund Portal',
      icon: FileCheck,
      badge: releasePendingCount > 0 ? `${releasePendingCount} Pending` : null,
      badgeColor: 'bg-emerald-600 text-white'
    },
    {
      id: 'ledger' as NavTab,
      label: 'Regulatory Audit Ledger',
      icon: Binary,
      badge: 'CAG Proof'
    },
    {
      id: 'research' as NavTab,
      label: 'Academic Research Hub',
      icon: GraduationCap,
      badge: '2016-2021'
    }
  ];

  return (
    <aside className="w-64 bg-[#0B3558] text-slate-100 border-r border-[#082842] flex flex-col justify-between shrink-0 shadow-md">
      <div className="p-4">
        {/* Officer Profile Card */}
        <div className="p-3 bg-[#082842] rounded-lg border border-[#13446e] mb-5 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-[#1b4e7a] border border-[#2a689f] flex items-center justify-center font-bold text-amber-300 text-xs">
              {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate leading-tight">{currentUser.name}</h4>
              <p className="text-[10px] text-amber-300 font-semibold truncate mt-0.5">{currentUser.role.replace(/_/g, ' ')}</p>
            </div>
          </div>
          {currentUser.region && (
            <div className="mt-2 text-[10px] bg-[#051c2f] px-2 py-0.5 rounded text-slate-300 font-mono flex items-center space-x-1">
              <Building className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">Jurisdiction: {currentUser.region.split('_')[0]}</span>
            </div>
          )}
        </div>

        {/* Section Heading */}
        <div className="px-2 pb-2 text-[10px] uppercase font-bold text-slate-300 tracking-wider">
          Regulatory Portals
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1b4e7a] text-white font-bold border-l-4 border-amber-400 shadow-inner'
                    : 'text-slate-200 hover:text-white hover:bg-[#0e3b61]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-300'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      item.badgeColor || 'bg-[#082842] text-slate-300 border border-[#13446e]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Official Government Statutory Footer */}
      <div className="p-4 border-t border-[#082842] bg-[#072238] text-[10px] text-slate-300 space-y-1">
        <div className="flex items-center space-x-1.5 font-semibold text-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>AICTE APH 2024-27 Norms</span>
        </div>
        <p className="text-slate-400 text-[9px] leading-tight">
          Ministry of Education, Govt of India • Regulation Bureau (New Delhi)
        </p>
      </div>
    </aside>
  );
};
