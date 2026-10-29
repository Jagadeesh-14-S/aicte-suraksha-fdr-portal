import React, { useState } from 'react';
import { 
  FolderKanban, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Lock, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Building2,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FdrInstrument, FdrStatus, RegionalOffice } from '../types';
import { REGIONAL_OFFICES_METADATA } from '../data/aicteNorms';

interface FdrRepositoryProps {
  onSelectFdr: (fdrId: string) => void;
  onOpenUpload: () => void;
  onOpenBankLien: (fdr: FdrInstrument) => void;
  onOpenRefund: (fdr: FdrInstrument) => void;
}

export const FdrRepository: React.FC<FdrRepositoryProps> = ({
  onSelectFdr,
  onOpenUpload,
  onOpenBankLien,
  onOpenRefund
}) => {
  const { 
    fdrList, 
    searchTerm, 
    setSearchTerm, 
    statusFilter, 
    setStatusFilter, 
    regionFilter, 
    setRegionFilter 
  } = useApp();
  const { currentUser } = useAuth();

  // Filtered List
  const filtered = fdrList.filter((fdr) => {
    // Search filter
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      !searchTerm ||
      fdr.institutionName.toLowerCase().includes(term) ||
      fdr.fdrNumber.toLowerCase().includes(term) ||
      fdr.bankName.toLowerCase().includes(term) ||
      fdr.accountNumber.toLowerCase().includes(term);

    // Status filter
    const matchStatus = statusFilter === 'ALL' || fdr.status === statusFilter;

    // Region filter
    const matchRegion = regionFilter === 'ALL' || fdr.region === regionFilter;

    return matchSearch && matchStatus && matchRegion;
  });

  const exportCsv = () => {
    const headers = ['FDR Number', 'Institution Name', 'Region', 'Bank Name', 'Account Number', 'Deposit Amount', 'Maturity Date', 'Lien Status', 'Status'];
    const rows = filtered.map(f => [
      f.fdrNumber,
      `"${f.institutionName.replace(/"/g, '""')}"`,
      f.region,
      f.bankName,
      f.accountNumber,
      f.depositAmount,
      f.maturityDate,
      f.lienStatus,
      f.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICTE_SURAKSHA_FDR_EXPORT_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <FolderKanban className="w-4 h-4" />
            <span>AICTE Regulation Bureau • National Database</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Institutional Security Deposit & FDR Repository
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking of institution-wise fixed deposits, bank lien encumbrances, and maturity milestones.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New FDR Submission</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Institution Name, FDR Number, Bank, or Account Number..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses ({fdrList.length})</option>
              <option value="LIEN_MARKED">Lien Marked (Active)</option>
              <option value="DISCREPANCY_FLAGGED">Discrepancy Flagged</option>
              <option value="MATURING_SOON">Maturing Soon (&lt; 30 Days)</option>
              <option value="MATURED">Matured / Overdue</option>
              <option value="RELEASE_REQUESTED">Release Requested</option>
              <option value="RELEASED">Released / Refunded</option>
              <option value="RENEWED">Renewed</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="md:col-span-3">
            <select
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Regional Offices (All India)</option>
              {(Object.keys(REGIONAL_OFFICES_METADATA) as RegionalOffice[]).map((reg) => (
                <option key={reg} value={reg}>
                  {REGIONAL_OFFICES_METADATA[reg].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary Chips */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Showing {filtered.length} of {fdrList.length} total instruments</span>
          {(searchTerm || statusFilter !== 'ALL' || regionFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setRegionFilter('ALL');
              }}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">FDR Instrument</th>
                <th className="px-4 py-3">Institution & Region</th>
                <th className="px-4 py-3">Deposit Sum</th>
                <th className="px-4 py-3">Maturity Date</th>
                <th className="px-4 py-3">Bank Lien Status</th>
                <th className="px-4 py-3">Regulatory Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No fixed deposit instruments matched the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((fdr) => {
                  const now = new Date();
                  const maturity = new Date(fdr.maturityDate);
                  const daysRemaining = Math.ceil((maturity.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <tr key={fdr.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* FDR Number & Bank */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono font-bold text-white">{fdr.fdrNumber}</div>
                        <div className="text-[11px] text-slate-400">{fdr.bankName}</div>
                        <div className="text-[10px] font-mono text-slate-500">{fdr.ifscCode}</div>
                      </td>

                      {/* Institution */}
                      <td className="px-4 py-3.5 max-w-[240px]">
                        <div className="font-semibold text-slate-200 truncate">{fdr.institutionName}</div>
                        <div className="text-[10px] text-slate-400 truncate">{fdr.jointHolderNames}</div>
                        <div className="text-[10px] font-mono text-blue-400">{fdr.region.split('_')[0]}</div>
                      </td>

                      {/* Deposit Sum */}
                      <td className="px-4 py-3.5 font-mono">
                        <div className="text-white font-bold">
                          ₹ {(fdr.depositAmount / 100000).toFixed(2)} Lakhs
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Tenure: {fdr.tenureYears} Yrs @ {fdr.interestRate}%
                        </div>
                      </td>

                      {/* Maturity Date */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono text-slate-200">{fdr.maturityDate}</div>
                        <div className="text-[10px] mt-0.5">
                          {daysRemaining < 0 ? (
                            <span className="text-rose-400 font-bold">
                              Overdue by {Math.abs(daysRemaining)} days
                            </span>
                          ) : daysRemaining <= 30 ? (
                            <span className="text-amber-400 font-bold">
                              {daysRemaining} days remaining
                            </span>
                          ) : (
                            <span className="text-slate-500">
                              {Math.floor(daysRemaining / 365.25)} yrs remaining
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Bank Lien */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          fdr.lienStatus === 'LIEN_CONFIRMED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          <Lock className="w-3 h-3" />
                          <span>{fdr.lienStatus === 'LIEN_CONFIRMED' ? 'CBS Marked' : 'Pending'}</span>
                        </span>
                      </td>

                      {/* Regulatory Status */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          fdr.status === 'DISCREPANCY_FLAGGED'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : fdr.status === 'MATURING_SOON'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : fdr.status === 'RELEASE_REQUESTED'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : fdr.status === 'RELEASED'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {fdr.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => onSelectFdr(fdr.id)}
                          className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg transition-colors inline-block"
                          title="Inspect Scrutiny & Forensics"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenBankLien(fdr)}
                          className="p-1.5 bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white rounded-lg transition-colors inline-block"
                          title="Core Banking CBS Lien Gateway"
                        >
                          <Lock className="w-4 h-4" />
                        </button>

                        {daysRemaining <= 90 && fdr.status !== 'RELEASED' && (
                          <button
                            onClick={() => onOpenRefund(fdr)}
                            className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-colors inline-block"
                            title="Process Release / Refund"
                          >
                            <FileCheck2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

