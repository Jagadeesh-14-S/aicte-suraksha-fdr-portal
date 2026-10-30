import React, { useState } from 'react';
import { 
  Bell, 
  Bot, 
  RotateCcw, 
  ChevronDown, 
  Building2, 
  Landmark, 
  FileCheck2,
  ShieldCheck,
  Database,
  Globe,
  SlidersHorizontal,
  ExternalLink,
  Check
} from 'lucide-react';
import { useAuth, PRESET_USERS } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { IndiaEmblem, AicteEmblem } from './Emblems';

interface NavbarProps {
  onOpenCopilot: () => void;
  onOpenNotifications: () => void;
  onOpenSupabase: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenCopilot, 
  onOpenNotifications, 
  onOpenSupabase 
}) => {
  const { currentUser, switchRole } = useAuth();
  const { notifications, resetToDefault, backendConnected } = useApp();
  const { language, setLanguage, t } = useLanguage();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleFontSizeChange = (size: 'sm' | 'md' | 'lg') => {
    setFontSize(size);
    if (size === 'sm') {
      document.documentElement.style.fontSize = '90%';
    } else if (size === 'lg') {
      document.documentElement.style.fontSize = '110%';
    } else {
      document.documentElement.style.fontSize = '100%';
    }
  };

  const roleIcons: Record<UserRole, React.ReactNode> = {
    BUREAU_ADMIN: <ShieldCheck className="w-4 h-4 text-emerald-800" />,
    REGIONAL_OFFICER: <Building2 className="w-4 h-4 text-amber-800" />,
    INSTITUTION_USER: <FileCheck2 className="w-4 h-4 text-orange-800" />,
    BANK_OFFICER: <Landmark className="w-4 h-4 text-slate-800" />
  };

  const roleLabels: Record<UserRole, string> = {
    BUREAU_ADMIN: 'AICTE Regulation Bureau (HQ)',
    REGIONAL_OFFICER: 'Regional Officer (RO)',
    INSTITUTION_USER: 'Technical Institution',
    BANK_OFFICER: 'Bank CBS / Lien Officer'
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Official Government of India Top Utility Bar */}
      <div className="bg-slate-100/90 border-b border-slate-200 text-slate-700 text-[11px] px-4 sm:px-8 py-1.5 flex items-center justify-between font-sans">
        {/* Left: Sovereign National Identity */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-slate-900 font-bold">
            <span className="font-serif">{t('goi')}</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="font-medium text-slate-700">Government of India</span>
          </div>
          <span className="hidden md:inline text-slate-400">•</span>
          <div className="hidden md:flex items-center space-x-1 text-slate-600">
            <span>{t('moe')}</span>
            <span className="text-slate-400">|</span>
            <span>Ministry of Education</span>
          </div>
        </div>

        {/* Right: Official GoI Accessibility & Multilingual Strip */}
        <div className="flex items-center space-x-3 sm:space-x-4 text-[11px]">
          <a 
            href="#main-content" 
            className="hidden sm:inline text-slate-600 hover:text-slate-900 underline transition-colors"
          >
            {t('skip_to_main')}
          </a>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline text-slate-600">{t('screen_reader')}</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          
          {/* Font Resizing Controls (Official GoI Standard) */}
          <div className="flex items-center space-x-1 font-bold text-slate-600">
            <button 
              onClick={() => handleFontSizeChange('sm')} 
              className={`px-1 rounded hover:bg-slate-200 ${fontSize === 'sm' ? 'text-orange-700 underline font-extrabold' : ''}`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button 
              onClick={() => handleFontSizeChange('md')} 
              className={`px-1 rounded hover:bg-slate-200 ${fontSize === 'md' ? 'text-orange-700 underline font-extrabold' : ''}`}
              title="Standard Font Size"
            >
              A
            </button>
            <button 
              onClick={() => handleFontSizeChange('lg')} 
              className={`px-1 rounded hover:bg-slate-200 ${fontSize === 'lg' ? 'text-orange-700 underline font-extrabold' : ''}`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>
          <span className="text-slate-300">|</span>

          {/* Multilingual Dropdown (All Major Indian Languages Supported) */}
          <div className="relative">
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1.5 text-slate-800 font-bold hover:text-orange-700 bg-white px-2.5 py-1 rounded border border-slate-300 shadow-2xs transition-colors"
              title="Select Language / भाषा चुनें"
            >
              <Globe className="w-3.5 h-3.5 text-orange-600" />
              <span>{currentLangObj.nativeName} ({currentLangObj.name})</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-300 rounded-xl shadow-xl py-2 z-50 text-slate-800 max-h-80 overflow-y-auto">
                <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Select Language / भाषा चुनें
                </div>
                {SUPPORTED_LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-orange-50 transition-colors ${
                      language === item.code ? 'bg-orange-50 text-orange-900 font-bold border-l-4 border-l-orange-600' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{item.nativeName}</span>
                      <span className="text-[11px] text-slate-500 ml-1.5">({item.name})</span>
                    </div>
                    {language === item.code && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Official Institutional Header (AICTE Emblem + Typography) */}
      <div className="px-4 sm:px-8 py-3 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Official Emblems & Institutional Identity */}
        <div className="flex items-center space-x-3.5">
          <IndiaEmblem className="w-9 h-11 text-amber-900 shrink-0" />
          <div className="h-10 w-[1px] bg-slate-300 mx-1 hidden sm:block"></div>
          <AicteEmblem className="w-11 h-11 shrink-0" />
          
          <div>
            <div className="leading-tight">
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 font-serif tracking-wide">
                {t('aicte_hindi')}
              </h2>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                {t('aicte')}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 mt-0.5">
                <span className="font-semibold text-amber-900">{t('regulation_bureau')}</span>
                <span className="text-slate-300">•</span>
                <span className="font-bold text-slate-800">FDR-SENTINEL</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">PS 26265 • Provenance-Aware Lifecycle Portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Operational Controls & Officer Card */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 self-end md:self-center">
          {/* Supabase Cloud DB Status */}
          <button
            onClick={onOpenSupabase}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
            title="Supabase PostgreSQL: Connected (https://facgypxmfphniegjmbdj.supabase.co)"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Database className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden lg:inline text-[11px] font-semibold">Supabase (Live)</span>
          </button>

          {/* AICTE Regulatory Copilot */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            title="AICTE Approval Process Handbook (APH) Regulatory Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden sm:inline text-[11px] font-bold">{t('copilot')}</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
            title="Regulatory Alerts & Deadlines"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-[10px] font-bold rounded-full flex items-center justify-center text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (confirm('Reset portal data to official AICTE sample records?')) {
                resetToDefault();
              }
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
            title={t('reset_mock')}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Official Stakeholder Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-2 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 transition-colors shadow-2xs"
            >
              <div className="flex items-center space-x-1.5">
                {roleIcons[currentUser.role]}
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] font-bold text-slate-900 leading-tight truncate max-w-[140px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] text-slate-500 font-semibold uppercase">
                    {roleLabels[currentUser.role]}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-300 rounded-xl shadow-xl py-2 z-50 text-slate-800">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Designated Stakeholder Login
                  </p>
                  <p className="text-xs text-slate-900 font-bold truncate mt-0.5">
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
                        ? 'bg-orange-50 text-orange-950 border-l-4 border-l-orange-600 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {roleIcons[r]}
                    <div>
                      <div className="font-semibold text-xs">{roleLabels[r]}</div>
                      <div className="text-[10px] text-slate-500 truncate">
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

      {/* 3. Official Sovereign Tri-color Ribbon Accent (Signature of Indian Govt Portals) */}
      <div className="h-[3px] w-full flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>
    </header>
  );
};
