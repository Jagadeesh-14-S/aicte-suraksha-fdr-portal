import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { IndiaEmblem } from './Emblems';
import { useLanguage } from '../context/LanguageContext';

export const GovFooter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-200 border-t-2 border-[#C2410C] font-sans text-xs">
      {/* Upper Links Band */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Col 1: Institutional Authority */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center space-x-2">
            <IndiaEmblem className="w-6 h-8 text-amber-400" />
            <div>
              <h4 className="font-bold text-white text-xs">
                {t('aicte_hindi')} ({t('aicte')})
              </h4>
              <p className="text-[11px] text-slate-400">
                All India Council for Technical Education, New Delhi
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed pr-4">
            e-SURAKSHA Portal is developed under the statutory regulatory mandate of AICTE Approval Process Handbook (APH) Chapters 1 & 2 for the automated monitoring of institutional security deposits and Fixed Deposit Receipts (FDRs).
          </p>
        </div>

        {/* Col 2: Official Quick Links */}
        <div>
          <h5 className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-2">
            Official Links
          </h5>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            <li>
              <a href="https://www.aicte-india.org" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center space-x-1">
                <span>AICTE Official Portal</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            </li>
            <li>
              <a href="https://www.education.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center space-x-1">
                <span>Ministry of Education, GoI</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            </li>
            <li>
              <a href="https://www.india.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center space-x-1">
                <span>National Portal of India</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            </li>
            <li>
              <a href="https://digilocker.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center space-x-1">
                <span>DigiLocker / NAD Gateway</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Portal Policies */}
        <div>
          <h5 className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-2">
            Portal Policies
          </h5>
          <ul className="space-y-1.5 text-[11px] text-slate-300">
            <li><span className="hover:text-white cursor-pointer">Terms & Conditions</span></li>
            <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
            <li><span className="hover:text-white cursor-pointer">Hyperlinking Policy</span></li>
            <li><span className="hover:text-white cursor-pointer">Copyright Policy</span></li>
            <li><span className="hover:text-white cursor-pointer">Web Information Manager</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Attribution Bar (Standard GoI NIC Style) */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 sm:px-8 py-3 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-center md:text-left">
            Website Content Managed by <strong>Regulation Bureau, All India Council for Technical Education (AICTE)</strong>
          </p>
          <div className="flex items-center space-x-4 text-[10px]">
            <span>Hosted on National Cloud (MeghRaj)</span>
            <span>•</span>
            <span>Last Updated: 30 Oct 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
