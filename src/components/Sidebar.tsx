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
  ChevronRight
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
  const { fdrList, notifications } = useApp();

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
      label: 'FDR Repository',
      icon: FolderKanban,
      badge: fdrList.length
    },
    {
      id: 'scrutiny' as NavTab,
      label: 'Scrutiny & OCR Bureau',
      icon: FileSearch,
      badge: flaggedCount > 0 ? `${flaggedCount} Flagged` : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'bank-portal' as NavTab,
      label: 'Bank Lien & CBS Hub',
      icon: Landmark,
      badge: 'Live NeSL'
    },
    {
      id: 'maturity' as NavTab,
      label: 'Maturity & Alert Radar',
      icon: ClockAlert,
      badge: maturingCount > 0 ? `${maturingCount} Alerts` : null,
      badgeColor: 'bg-amber-500 text-slate-900'
    },
    {
      id: 'release' as NavTab,
      label: 'Release & Refund Portal',
      icon: FileCheck,
      badge: releasePendingCount > 0 ? `${releasePendingCount} Pending` : null,
      badgeColor: 'bg-emerald-500 text-slate-900'
    },
    {
      id: 'ledger' as NavTab,
      label: 'Immutable Audit Ledger',
      icon: Binary,
      badge: 'Merkle SHA-256'
    },
    {
      id: 'research' as NavTab,
      label: 'Academic Research Hub',
      icon: GraduationCap,
      badge: '2016-2021'
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0">
      <div className="p-4">
        {/* User Card */}
        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
              <p className="text-[11px] text-amber-400 font-medium truncate">{currentUser.role.replace('_', ' ')}</p>
            </div>
          </div>
          {currentUser.region && (
            <div className="mt-2 text-[10px] bg-slate-900/80 px-2 py-0.5 rounded text-blue-300 font-mono">
              Region: {currentUser.region}
            </div>
          )}
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
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

      {/* Compliance Footer Banner */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Statutory Compliance: AICTE APH 2024-27</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">
          Cryptographic Merkle State Root & NeSL e-BG Interoperable
        </p>
      </div>
    </aside>
  );
};

