import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { NotificationCenter } from './components/NotificationCenter';
import { AicteCopilotModal } from './components/AicteCopilotModal';
import { FdrUploadModal } from './components/FdrUploadModal';
import { DiscrepancyInspectorModal } from './components/DiscrepancyInspectorModal';
import { BankLienModal } from './components/BankLienModal';
import { RefundWorkflowModal } from './components/RefundWorkflowModal';
import { SupabaseConnectModal } from './components/SupabaseConnectModal';

import { DashboardOverview } from './pages/DashboardOverview';
import { FdrRepository } from './pages/FdrRepository';
import { ScrutinyBureau } from './pages/ScrutinyBureau';
import { BankLienPortal } from './pages/BankLienPortal';
import { MaturityAlerts } from './pages/MaturityAlerts';
import { ReleaseRefundWorkflow } from './pages/ReleaseRefundWorkflow';
import { ImmutableLedger } from './pages/ImmutableLedger';
import { ResearchSynthesis } from './pages/ResearchSynthesis';

import { useApp } from './context/AppContext';
import { FdrInstrument } from './types';

export const App: React.FC = () => {
  const { fdrList } = useApp();

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [supabaseOpen, setSupabaseOpen] = useState(false);

  const [inspectFdr, setInspectFdr] = useState<FdrInstrument | null>(null);
  const [bankLienFdr, setBankLienFdr] = useState<FdrInstrument | null>(null);
  const [refundFdr, setRefundFdr] = useState<FdrInstrument | null>(null);

  const handleSelectFdrById = (fdrId: string) => {
    const found = fdrList.find(f => f.id === fdrId);
    if (found) {
      setInspectFdr(found);
    }
  };

  const handleUploadSuccess = (newFdrId: string) => {
    setUploadOpen(false);
    handleSelectFdrById(newFdrId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Sovereignty & Role Navigation Bar */}
      <Navbar
        onOpenCopilot={() => setCopilotOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenSupabase={() => setSupabaseOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Persistent Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
        />

        {/* Main Operational Canvas */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {currentTab === 'dashboard' && (
            <DashboardOverview
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenUpload={() => setUploadOpen(true)}
              onSelectFdr={handleSelectFdrById}
            />
          )}

          {currentTab === 'repository' && (
            <FdrRepository
              onSelectFdr={handleSelectFdrById}
              onOpenUpload={() => setUploadOpen(true)}
              onOpenBankLien={(fdr) => setBankLienFdr(fdr)}
              onOpenRefund={(fdr) => setRefundFdr(fdr)}
            />
          )}

          {currentTab === 'scrutiny' && (
            <ScrutinyBureau
              onInspectFdr={handleSelectFdrById}
              onOpenBankLien={(fdr) => setBankLienFdr(fdr)}
            />
          )}

          {currentTab === 'bank-portal' && (
            <BankLienPortal />
          )}

          {currentTab === 'maturity' && (
            <MaturityAlerts
              onOpenRefund={(fdr) => setRefundFdr(fdr)}
              onSelectFdr={handleSelectFdrById}
            />
          )}

          {currentTab === 'release' && (
            <ReleaseRefundWorkflow
              onOpenRefund={(fdr) => setRefundFdr(fdr)}
              onSelectFdr={handleSelectFdrById}
            />
          )}

          {currentTab === 'ledger' && (
            <ImmutableLedger />
          )}

          {currentTab === 'research' && (
            <ResearchSynthesis />
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onSelectFdr={handleSelectFdrById}
      />

      <AicteCopilotModal
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
      />

      <FdrUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      <DiscrepancyInspectorModal
        fdr={inspectFdr}
        onClose={() => setInspectFdr(null)}
        onOpenBankLienModal={(fdr) => setBankLienFdr(fdr)}
      />

      <BankLienModal
        fdr={bankLienFdr}
        onClose={() => setBankLienFdr(null)}
      />

      <RefundWorkflowModal
        fdr={refundFdr}
        onClose={() => setRefundFdr(null)}
      />

      <SupabaseConnectModal
        isOpen={supabaseOpen}
        onClose={() => setSupabaseOpen(false)}
      />
    </div>
  );
};
export default App;

