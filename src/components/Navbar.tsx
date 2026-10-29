import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Bot, 
  RotateCcw, 
  ChevronDown, 
  UserCheck, 
  Building2, 
  Landmark, 
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { useAuth, PRESET_USERS } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenCopilot: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot, onOpenNotifications }) => {
  const { currentUser, switchRole } = useAuth();
  const { notifications, resetToDefault, backendConnected } = useApp();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleIcons: Record<UserRole, React.ReactNode> = {
    BUREAU_ADMIN: <ShieldCheck className="w-4 h-4 text-amber-400" />,
    REGIONAL_OFFICER: <Building2 className="w-4 h-4 text-blue-400" />,
    INSTITUTION_USER: <FileCheck2 className="w-4 h-4 text-emerald-400" />,
    BANK_OFFICER: <Landmark className="w-4 h-4 text-purple-400" />
  };

  const roleLabels: Record<UserRole, string> = {
    BUREAU_ADMIN: 'AICTE Regulation Bureau (HQ)',
    REGIONAL_OFFICER: 'Regional Officer (RO)',
    INSTITUTION_USER: 'Technical Institution',
    BANK_OFFICER: 'Bank CBS / Lien Officer'
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Sovereign National Top Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-slate-900 to-emerald-700 px-4 py-1 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Government of India • Ministry of Education • AICTE Regulation Bureau</span>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-slate-300">
          <span>Problem ID: 26265</span>
          <span>•</span>
          <span>Smart Automation Portal</span>
          <span>•</span>
          <span className="font-mono text-amber-300">ISO 20022 & NeSL e-BG Ready</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center shadow-lg border border-blue-400/30">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                AICTE-<span className="text-amber-400">SURAKSHA</span>
              </span>
              <span className="bg-blue-900/80 text-blue-300 text-[10px] uppercase font-semibold px-2 py-0.5 rounded border border-blue-700">
                v2.4 Sovereign
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Unified Security Deposit & Fixed Deposit Receipt (FDR) Management Portal
            </p>
          </div>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Backend Status Pill */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border bg-slate-950/70 border-slate-800">
            <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`}></span>
            <span className={backendConnected ? 'text-emerald-400 font-semibold' : 'text-blue-300'}>
              {backendConnected ? 'Backend API: Live (:5000)' : 'GitHub Pages Cloud Mode'}
            </span>
          </div>

          {/* AICTE Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all border border-indigo-400/40"
            title="Ask AICTE Approval Process Handbook (APH) Regulatory Bot"
          >
            <Bot className="w-4 h-4 text-amber-300 animate-bounce" />
            <span className="hidden md:inline">Suraksha AI Copilot</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (confirm('Reset prototype state to default AICTE records?')) {
                resetToDefault();
              }
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center"
            title="Reset Mock State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Automated Regulatory Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-[10px] font-bold rounded-full flex items-center justify-center text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs transition-all"
            >
              <div className="flex items-center space-x-1.5">
                {roleIcons[currentUser.role]}
                <span className="font-semibold text-slate-200 hidden sm:inline">
                  {roleLabels[currentUser.role]}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Simulate Stakeholder Persona
                  </p>
                  <p className="text-xs text-amber-300 font-medium truncate mt-0.5">
                    {currentUser.title}
                  </p>
                </div>
                {(Object.keys(PRESET_USERS) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2.5 transition-colors ${
                      currentUser.role === r
                        ? 'bg-blue-600/30 text-blue-300 border-l-4 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {roleIcons[r]}
                    <div>
                      <div className="font-medium">{roleLabels[r]}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {PRESET_USERS[r].name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

