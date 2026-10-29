import { BankVerificationRecord } from '../types';

export interface CbsQueryResponse {
  success: boolean;
  message: string;
  record?: BankVerificationRecord;
  actualBalance?: number;
  interestRate?: number;
  holderNamesOnRecord?: string;
  hasActiveLien?: boolean;
}

/**
 * Open Banking & ISO 20022 CBS Live Lien-Marking Simulator
 * Models real-time Core Banking Solution (CBS) interfaces (SBI, Canara, PNB, HDFC, BoI)
 * compliant with NeSL Electronic Bank Guarantee (e-BG) and ISO 20022 pain.001 / camt.053 standard.
 */
export async function queryBankCbs(
  bankName: string,
  ifscCode: string,
  accountNumber: string
): Promise<CbsQueryResponse> {
  // Simulate network latency to CBS Finacle / BaNCS host
  await new Promise(resolve => setTimeout(resolve, 600));

  const cleanAcc = (accountNumber || '').trim();
  const cleanIfsc = (ifscCode || '').trim().toUpperCase();

  // Simulated disputed account
  if (cleanAcc.includes('001928') || cleanIfsc.includes('PUNB')) {
    return {
      success: false,
      message: 'DISCREPANCY: Account balance on CBS is ₹5,00,000.00 (Shortfall against ₹15,00,000 certificate). Lien cannot be marked.',
      actualBalance: 500000,
      interestRate: 6.50,
      holderNamesOnRecord: 'Uttaranchal Shiksha Parishad (Single Holder)',
      hasActiveLien: false
    };
  }

  // Simulated valid SBI account
  return {
    success: true,
    message: 'CBS Connection Active: Account verified in Core Banking host. Non-encashable lien registered in favor of AICTE.',
    actualBalance: 3500000,
    interestRate: 7.10,
    holderNamesOnRecord: 'Chairman / Secretary & Regional Officer, AICTE',
    hasActiveLien: true,
    record: {
      cbsReferenceId: `CBS-${cleanIfsc.slice(0, 4)}-${Date.now().toString().slice(-8)}`,
      bankName: bankName || 'State Bank of India',
      branchName: 'Main Commercial Branch',
      ifscCode: cleanIfsc || 'SBIN0000454',
      accountNumber: cleanAcc || '39281729401',
      accountStatus: 'ACTIVE_LOCKED',
      lienMarked: true,
      lienMarkingDate: new Date().toISOString().split('T')[0],
      lienExpiryDate: new Date(Date.now() + 10 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0],
      verifiedAt: new Date().toLocaleString(),
      verifiedByOfficer: 'R. K. Sharma (Emp #58921)',
      officerDesignation: 'Chief Manager (Credit & Guarantees)',
      cryptographicSignature: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    }
  };
}

export async function markLienOnCbs(
  fdrId: string,
  bankName: string,
  ifscCode: string,
  accountNumber: string,
  amount: number,
  roTitle: string
): Promise<BankVerificationRecord> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const cbsRef = `CBS-NE-SL-${Date.now().toString().slice(-6)}`;
  return {
    cbsReferenceId: cbsRef,
    bankName,
    branchName: 'Designated Authorized Branch',
    ifscCode,
    accountNumber,
    accountStatus: 'ACTIVE_LOCKED',
    lienMarked: true,
    lienMarkingDate: new Date().toISOString().split('T')[0],
    lienExpiryDate: new Date(Date.now() + 10 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0],
    verifiedAt: new Date().toLocaleString(),
    verifiedByOfficer: 'Senior Operations Head',
    officerDesignation: 'Assistant General Manager / Lien Custodian',
    cryptographicSignature: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
  };
}
