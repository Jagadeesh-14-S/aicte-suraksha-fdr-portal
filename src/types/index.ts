export type UserRole = 'BUREAU_ADMIN' | 'REGIONAL_OFFICER' | 'INSTITUTION_USER' | 'BANK_OFFICER';

export type FdrStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'BANK_VERIFIED'
  | 'LIEN_MARKED'
  | 'SCRUTINY_APPROVED'
  | 'DISCREPANCY_FLAGGED'
  | 'MATURING_SOON'
  | 'MATURED'
  | 'RENEWAL_PENDING'
  | 'RENEWED'
  | 'RELEASE_REQUESTED'
  | 'RELEASE_APPROVED'
  | 'RELEASED';

export type RegionalOffice = 
  | 'WRO_MUMBAI'
  | 'SRO_CHENNAI'
  | 'SWRO_BENGALURU'
  | 'NRO_KANPUR'
  | 'NWRO_CHANDIGARH'
  | 'CRO_BHOPAL'
  | 'SCRO_HYDERABAD'
  | 'ERO_KOLKATA';

export type InstitutionCategory = 
  | 'Engineering & Technology'
  | 'Management (MBA/PGDM)'
  | 'Pharmacy'
  | 'Computer Applications (MCA)'
  | 'Architecture & Planning'
  | 'Polytechnic Diploma';

export interface Institution {
  id: string;
  aicteId: string; // e.g. "1-931829101"
  name: string;
  trustName: string;
  region: RegionalOffice;
  state: string;
  city: string;
  category: InstitutionCategory;
  email: string;
  phone: string;
  totalApprovedIntake: number;
  establishedYear: number;
  activeFdrCount: number;
  totalDepositValue: number;
  complianceScore: number; // 0 - 100
}

export interface DiscrepancyFlag {
  id: string;
  code: string;
  ruleTitle: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
  detectedField: string;
  expectedValue: string;
  actualValue: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface BankVerificationRecord {
  cbsReferenceId: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  accountNumber: string;
  accountStatus: 'ACTIVE_LOCKED' | 'INVALID' | 'UNENCUMBERED' | 'DISPUTED';
  lienMarked: boolean;
  lienMarkingDate?: string;
  lienExpiryDate?: string;
  verifiedAt: string;
  verifiedByOfficer: string;
  officerDesignation: string;
  cryptographicSignature: string;
}

export interface FdrInstrument {
  id: string;
  fdrNumber: string;
  institutionId: string;
  institutionName: string;
  region: RegionalOffice;
  bankName: string;
  branchName: string;
  ifscCode: string;
  accountNumber: string;
  depositAmount: number; // in INR
  requiredNormAmount: number; // as per AICTE APH
  interestRate: number; // % p.a.
  issueDate: string; // YYYY-MM-DD
  maturityDate: string; // YYYY-MM-DD
  tenureYears: number;
  jointHolderNames: string; // e.g. "Chairman, Trust XYZ & Regional Officer AICTE Mumbai"
  lienStatus: 'LIEN_CONFIRMED' | 'LIEN_PENDING' | 'NO_LIEN' | 'REVOKED';
  status: FdrStatus;
  documentUrl?: string;
  documentHash: string; // SHA-256
  isForgedSuspect: boolean;
  forgeryConfidenceScore?: number; // 0.0 - 1.0 (ELA analysis)
  discrepancies: DiscrepancyFlag[];
  bankVerification?: BankVerificationRecord;
  lastScrutinyDate?: string;
  scrutinyRemarks?: string;
  scrutinyOfficer?: string;
  releaseRequest?: ReleaseRequest;
  renewalHistory?: RenewalRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface ReleaseRequest {
  requestId: string;
  requestedAt: string;
  reason: 'MATURITY_COMPLETED_10_YEARS' | 'INSTITUTION_CLOSURE' | 'EXCESS_DEPOSIT_REDUCTION';
  affidavitSubmitted: boolean;
  affidavitDocHash?: string;
  noDueCertificateSubmitted: boolean;
  status: 'PENDING_RO_SCRUTINY' | 'PENDING_BUREAU_APPROVAL' | 'APPROVED' | 'REJECTED';
  roRecommendation?: 'RECOMMENDED_FOR_RELEASE' | 'DEFICIENCY_FOUND';
  roRemarks?: string;
  roActionDate?: string;
  bureauDecisionDate?: string;
  bureauSanctionOrderNo?: string;
  bureauRemarks?: string;
  refundDisbursedAmount?: number;
  refundUtrNumber?: string;
}

export interface RenewalRecord {
  renewalId: string;
  previousFdrNumber: string;
  newFdrNumber: string;
  renewedAt: string;
  previousMaturityDate: string;
  newMaturityDate: string;
  interestAccumulated: number;
  actionTakenBy: string;
}

export interface AuditBlock {
  blockIndex: number;
  timestamp: string;
  fdrId: string;
  action: string;
  performedBy: string;
  role: UserRole;
  dataHash: string;
  previousHash: string;
  merkleRoot: string;
  ipAddress: string;
}

export interface AlertNotification {
  id: string;
  fdrId: string;
  institutionName: string;
  type: 'MATURITY_EXPIRY' | 'DISCREPANCY_ALERT' | 'LIEN_LAPSE' | 'REFUND_REQUEST' | 'RO_ESCALATION';
  title: string;
  message: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  read: boolean;
  daysRemaining?: number;
  channelsSent: ('IN_APP' | 'EMAIL' | 'SMS' | 'WHATSAPP')[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  publisher: 'IEEE' | 'Springer' | 'Elsevier' | 'ACM';
  doiOrUrl: string;
  coreContribution: string;
  surakshaImplementation: string;
  tags: string[];
}

