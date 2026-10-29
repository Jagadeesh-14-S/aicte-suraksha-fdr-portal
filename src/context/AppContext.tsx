import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AlertNotification, 
  AuditBlock, 
  BankVerificationRecord, 
  DiscrepancyFlag, 
  FdrInstrument, 
  FdrStatus, 
  Institution, 
  ReleaseRequest, 
  RenewalRecord 
} from '../types';
import { MOCK_FDR_INSTRUMENTS, MOCK_INSTITUTIONS } from '../data/mockInstitutions';
import { ImmutableAuditChain, INITIAL_GENESIS_BLOCK } from '../services/merkleAuditLedger';
import { generateAutomatedAlerts } from '../services/automatedAlertEngine';
import { evaluateFdrDiscrepancies } from '../services/discrepancyDetector';
import { useAuth } from './AuthContext';

interface AppContextType {
  institutions: Institution[];
  fdrList: FdrInstrument[];
  auditBlocks: AuditBlock[];
  notifications: AlertNotification[];
  selectedFdr: FdrInstrument | null;
  setSelectedFdr: (fdr: FdrInstrument | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  regionFilter: string;
  setRegionFilter: (region: string) => void;
  
  // Actions
  addNewFdr: (fdr: Partial<FdrInstrument>) => Promise<FdrInstrument>;
  updateFdrScrutiny: (fdrId: string, status: FdrStatus, remarks: string) => Promise<void>;
  registerBankLienConfirmation: (fdrId: string, bankRecord: BankVerificationRecord) => Promise<void>;
  submitReleaseRequest: (fdrId: string, releaseData: Partial<ReleaseRequest>) => Promise<void>;
  processReleaseBureauDecision: (fdrId: string, approved: boolean, sanctionNo: string, remarks: string) => Promise<void>;
  renewFdrInstrument: (fdrId: string, renewal: Partial<RenewalRecord>, newMaturity: string) => Promise<void>;
  resolveDiscrepancy: (fdrId: string, discrepancyId: string) => Promise<void>;
  dismissAlert: (id: string) => void;
  markAllAlertsAsRead: () => void;
  resetToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_FDR_KEY = 'suraksha_fdr_records_v1';
const LOCAL_STORAGE_AUDIT_KEY = 'suraksha_audit_blocks_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [institutions, setInstitutions] = useState<Institution[]>(MOCK_INSTITUTIONS);
  
  const [fdrList, setFdrList] = useState<FdrInstrument[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_FDR_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved FDR list', e);
      }
    }
    return MOCK_FDR_INSTRUMENTS;
  });

  const [auditChain] = useState<ImmutableAuditChain>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_AUDIT_KEY);
    if (saved) {
      try {
        return new ImmutableAuditChain(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse audit blocks', e);
      }
    }
    return new ImmutableAuditChain([INITIAL_GENESIS_BLOCK]);
  });

  const [auditBlocks, setAuditBlocks] = useState<AuditBlock[]>(auditChain.getBlocks());
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [selectedFdr, setSelectedFdr] = useState<FdrInstrument | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');

  // Sync state to local storage & refresh alerts
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FDR_KEY, JSON.stringify(fdrList));
    setNotifications(generateAutomatedAlerts(fdrList));
  }, [fdrList]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_AUDIT_KEY, JSON.stringify(auditBlocks));
  }, [auditBlocks]);

  const addNewFdr = async (data: Partial<FdrInstrument>): Promise<FdrInstrument> => {
    const inst = institutions.find(i => i.id === data.institutionId);
    const evalResult = evaluateFdrDiscrepancies(data, inst);

    const newFdr: FdrInstrument = {
      id: `FDR-${Date.now().toString().slice(-6)}`,
      fdrNumber: data.fdrNumber || `FDR-${Math.floor(1000000 + Math.random() * 9000000)}`,
      institutionId: data.institutionId || 'INST-001',
      institutionName: data.institutionName || inst?.name || 'Technical Institute',
      region: data.region || inst?.region || 'WRO_MUMBAI',
      bankName: data.bankName || 'State Bank of India',
      branchName: data.branchName || 'Commercial Branch',
      ifscCode: data.ifscCode || 'SBIN0000454',
      accountNumber: data.accountNumber || '100000000000',
      depositAmount: data.depositAmount || 3500000,
      requiredNormAmount: inst ? inst.totalDepositValue : 3500000,
      interestRate: data.interestRate || 7.0,
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      maturityDate: data.maturityDate || new Date(Date.now() + 10 * 365.25 * 86400000).toISOString().split('T')[0],
      tenureYears: data.tenureYears || 10,
      jointHolderNames: data.jointHolderNames || 'Trust & Regional Officer, AICTE',
      lienStatus: data.lienStatus || 'LIEN_PENDING',
      status: evalResult.criticalCount > 0 ? 'DISCREPANCY_FLAGGED' : 'SUBMITTED',
      documentUrl: data.documentUrl || '/samples/fdr_sample.pdf',
      documentHash: data.documentHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      isForgedSuspect: data.isForgedSuspect || false,
      forgeryConfidenceScore: data.forgeryConfidenceScore || 0.02,
      discrepancies: evalResult.discrepancies,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newBlock = await auditChain.appendBlock(
      newFdr.id,
      'NEW_FDR_SUBMITTED',
      currentUser.name,
      currentUser.role,
      { fdrNumber: newFdr.fdrNumber, depositAmount: newFdr.depositAmount, status: newFdr.status }
    );

    setAuditBlocks(auditChain.getBlocks());
    setFdrList(prev => [newFdr, ...prev]);
    return newFdr;
  };

  const updateFdrScrutiny = async (fdrId: string, status: FdrStatus, remarks: string) => {
    const fdr = fdrList.find(f => f.id === fdrId);
    if (!fdr) return;

    const updatedList = fdrList.map(item => {
      if (item.id === fdrId) {
        return {
          ...item,
          status,
          scrutinyRemarks: remarks,
          scrutinyOfficer: currentUser.name,
          lastScrutinyDate: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });

    await auditChain.appendBlock(
      fdrId,
      `SCRUTINY_UPDATED_${status}`,
      currentUser.name,
      currentUser.role,
      { newStatus: status, remarks }
    );

    setAuditBlocks(auditChain.getBlocks());
    setFdrList(updatedList);
  };

  const registerBankLienConfirmation = async (fdrId: string, bankRecord: BankVerificationRecord) => {
    const updatedList = fdrList.map(item => {
      if (item.id === fdrId) {
        return {
          ...item,
          lienStatus: 'LIEN_CONFIRMED' as const,
          status: 'LIEN_MARKED' as const,
          bankVerification: bankRecord,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });

    await auditChain.appendBlock(
      fdrId,
      'CBS_LIEN_MARKED',
      currentUser.name,
      currentUser.role,
      { cbsRef: bankRecord.cbsReferenceId, signature: bankRecord.cryptographicSignature }
    );

    setAuditBlocks(auditChain.getBlocks());
    setFdrList(updatedList);
  };

  const submitReleaseRequest = async (fdrId: string, releaseData: Partial<ReleaseRequest>) => {
    const req: ReleaseRequest = {
      requestId: `REL-${Date.now().toString().slice(-6)}`,
      requestedAt: new Date().toISOString(),
      reason: releaseData.reason || 'MATURITY_COMPLETED_10_YEARS',
      affidavitSubmitted: releaseData.affidavitSubmitted ?? true,
      affidavitDocHash: 'affidavit-verified-sha256',
      noDueCertificateSubmitted: releaseData.noDueCertificateSubmitted ?? true,
      status: 'PENDING_RO_SCRUTINY'
    };

    const updatedList = fdrList.map(item => {
      if (item.id === fdrId) {
        return {
          ...item,
          status: 'RELEASE_REQUESTED' as const,
          releaseRequest: req,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });

    await auditChain.appendBlock(
      fdrId,
      'RELEASE_REQUEST_SUBMITTED',
      currentUser.name,
      currentUser.role,
      { requestId: req.requestId, reason: req.reason }
    );

    setAuditBlocks(auditChain.getBlocks());
    setFdrList(updatedList);
  };

  const processReleaseBureauDecision = async (
    fdrId: string, 
    approved: boolean, 
    sanctionNo: string, 
    remarks: string
  ) => {
    const updatedList = fdrList.map(item => {
      if (item.id === fdrId && item.releaseRequest) {
        const newReqStatus = approved ? 'APPROVED' as const : 'REJECTED' as const;
        return {
          ...item,
          status: approved ? ('RELEASED' as const) : ('LIEN_MARKED' as const),
          lienStatus: approved ? ('REVOKED' as const) : item.lienStatus,
          releaseRequest: {
            ...item.releaseRequest,
            status: newReqStatus,
            bureauDecisionDate: new Date().toISOString().split('T')[0],
            bureauSanctionOrderNo: sanctionNo,
            bureauRemarks: remarks,
            refundUtrNumber: approved ? `UTR-AICTE-SBIN-${Date.now().toString().slice(-8)}` : undefined
          },
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });

    await auditChain.appendBlock(
      fdrId,
      approved ? 'RELEASE_SANCTIONED' : 'RELEASE_REJECTED',
      currentUser.name,
      currentUser.role,
      { sanctionNo, approved, remarks }
    );

    setAuditBlocks(auditChain.getBlocks());
    setFdrList(updatedList);
  };

  const renewFdrInstrument = async (fdrId: string, renewal: Partial<RenewalRecord>, newMaturity: string) => {
    const fdr = fdrList.find(f => f.id === fdrId);
    if (!fdr) return;

    const newRecord: RenewalRecord = {
      renewalId: `RNW-${Date.now().toString().slice(-6)}`,
      previousFdrNumber: fdr.fdrNumber,
      newFdrNumber: renewal.newFdrNumber || `FDR-RNW-${Date.now().toString().slice(-6)}`,
      renewedAt: new Date().toISOString(),
      previousMaturityDate: fdr.maturityDate,
      newMaturityDate: newMaturity,
      interestAccumulated: renewal.interestAccumulated || 200000,
      actionTakenBy: currentUser.name
    };

    const updatedList = fdrList.map(item => {
      if (item.id === fdrId) {
        return {
          ...item,
          fdrNumber: newRecord.newFdrNumber,
          maturityDate: newMaturity,
          status: 'RENEWED' as const,
          renewalHistory: [...(item.renewalHistory || []), newRecord],
          discrepancies: item.discrepancies.filter(d => !d.code.includes('EXPIRY') && !d.code.includes('OVERDUE')),
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });

    await auditChain.appendBlock(
      fdrId,
      'FDR_RENEWAL_COMPLETED',
      currentUser.name,
      currentUser.role,
      { previousFdr: fdr.fdrNumber, newFdr: newRecord.newFdrNumber, newMaturity }
    );

    setAuditBlocks(auditChain.getBlocks());
    setFdrList(updatedList);
  };

  const resolveDiscrepancy = async (fdrId: string, discrepancyId: string) => {
    const updatedList = fdrList.map(item => {
      if (item.id === fdrId) {
        const updatedDiscs = item.discrepancies.map(d => {
          if (d.id === discrepancyId) {
            return {
              ...d,
              resolved: true,
              resolvedAt: new Date().toISOString(),
              resolvedBy: currentUser.name
            };
          }
          return d;
        });

        // Re-calculate status
        const unresolvedCrits = updatedDiscs.filter(d => !d.resolved && d.severity === 'CRITICAL');
        return {
          ...item,
          discrepancies: updatedDiscs,
          status: unresolvedCrits.length === 0 ? ('SCRUTINY_APPROVED' as const) : item.status,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });

    await auditChain.appendBlock(
      fdrId,
      'DISCREPANCY_RESOLVED',
      currentUser.name,
      currentUser.role,
      { discrepancyId }
    );

    setAuditBlocks(auditChain.getBlocks());
    setFdrList(updatedList);
  };

  const dismissAlert = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAlertsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetToDefault = () => {
    localStorage.removeItem(LOCAL_STORAGE_FDR_KEY);
    localStorage.removeItem(LOCAL_STORAGE_AUDIT_KEY);
    setFdrList(MOCK_FDR_INSTRUMENTS);
    setAuditBlocks([INITIAL_GENESIS_BLOCK]);
    setNotifications(generateAutomatedAlerts(MOCK_FDR_INSTRUMENTS));
  };

  return (
    <AppContext.Provider value={{
      institutions,
      fdrList,
      auditBlocks,
      notifications,
      selectedFdr,
      setSelectedFdr,
      searchTerm,
      setSearchTerm,
      statusFilter,
      setStatusFilter,
      regionFilter,
      setRegionFilter,
      addNewFdr,
      updateFdrScrutiny,
      registerBankLienConfirmation,
      submitReleaseRequest,
      processReleaseBureauDecision,
      renewFdrInstrument,
      resolveDiscrepancy,
      dismissAlert,
      markAllAlertsAsRead,
      resetToDefault
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

