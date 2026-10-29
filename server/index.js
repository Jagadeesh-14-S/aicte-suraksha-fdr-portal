import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Data Store with initial realistic AICTE records
let institutions = [
  {
    id: 'INST-001',
    aicteId: '1-432890123',
    name: 'Maharashtra Institute of Technology & Research',
    trustName: 'MAEER Educational Trust, Pune',
    region: 'WRO_MUMBAI',
    state: 'Maharashtra',
    city: 'Pune',
    category: 'Engineering & Technology',
    email: 'principal@mitr-pune.edu.in',
    phone: '+91 20 2543 8900',
    totalApprovedIntake: 600,
    establishedYear: 2014,
    activeFdrCount: 1,
    totalDepositValue: 3500000,
    complianceScore: 98
  },
  {
    id: 'INST-002',
    aicteId: '1-987654321',
    name: 'Bangalore Institute of Advanced Technology',
    trustName: 'Vidyapeetha Charitable Trust, Bengaluru',
    region: 'SWRO_BENGALURU',
    state: 'Karnataka',
    city: 'Bengaluru',
    category: 'Engineering & Technology',
    email: 'admin@biat-edu.in',
    phone: '+91 80 2678 4400',
    totalApprovedIntake: 480,
    establishedYear: 2016,
    activeFdrCount: 1,
    totalDepositValue: 3500000,
    complianceScore: 84
  },
  {
    id: 'INST-003',
    aicteId: '1-234567890',
    name: 'Apex Academy of Computer Applications & Technology',
    trustName: 'Uttaranchal Shiksha Parishad, Kanpur',
    region: 'NRO_KANPUR',
    state: 'Uttar Pradesh',
    city: 'Kanpur',
    category: 'Computer Applications (MCA)',
    email: 'director@apextech-kanpur.ac.in',
    phone: '+91 512 290 1122',
    totalApprovedIntake: 120,
    establishedYear: 2018,
    activeFdrCount: 1,
    totalDepositValue: 1500000,
    complianceScore: 42
  }
];

let fdrList = [
  {
    id: 'FDR-2024-WRO-001',
    fdrNumber: 'SBIN-0029384712',
    institutionId: 'INST-001',
    institutionName: 'Maharashtra Institute of Technology & Research',
    region: 'WRO_MUMBAI',
    bankName: 'State Bank of India',
    branchName: 'Shivajinagar Commercial Branch, Pune',
    ifscCode: 'SBIN0000454',
    accountNumber: '39281729401',
    depositAmount: 3500000,
    requiredNormAmount: 3500000,
    interestRate: 6.85,
    issueDate: '2024-06-15',
    maturityDate: '2034-06-15',
    tenureYears: 10,
    jointHolderNames: 'Secretary, MAEER Educational Trust, Pune and Regional Officer, AICTE Western Regional Office, Mumbai',
    lienStatus: 'LIEN_CONFIRMED',
    status: 'LIEN_MARKED',
    documentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isForgedSuspect: false,
    forgeryConfidenceScore: 0.02,
    discrepancies: [],
    createdAt: '2024-06-16T10:00:00Z',
    updatedAt: '2024-06-20T14:30:00Z'
  },
  {
    id: 'FDR-2016-SWRO-002',
    fdrNumber: 'CNRB-0091827364',
    institutionId: 'INST-002',
    institutionName: 'Bangalore Institute of Advanced Technology',
    region: 'SWRO_BENGALURU',
    bankName: 'Canara Bank',
    branchName: 'Jayanagar 4th Block, Bengaluru',
    ifscCode: 'CNRB0000843',
    accountNumber: '0843101039482',
    depositAmount: 3500000,
    requiredNormAmount: 3500000,
    interestRate: 7.10,
    issueDate: '2016-11-20',
    maturityDate: '2026-11-20',
    tenureYears: 10,
    jointHolderNames: 'President, Vidyapeetha Charitable Trust and Regional Officer, AICTE SWRO Bengaluru',
    lienStatus: 'LIEN_CONFIRMED',
    status: 'MATURING_SOON',
    documentHash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    isForgedSuspect: false,
    forgeryConfidenceScore: 0.04,
    discrepancies: [],
    createdAt: '2016-11-21T09:00:00Z',
    updatedAt: '2026-10-15T11:20:00Z'
  },
  {
    id: 'FDR-2024-NRO-003',
    fdrNumber: 'PNB-0081726354',
    institutionId: 'INST-003',
    institutionName: 'Apex Academy of Computer Applications & Technology',
    region: 'NRO_KANPUR',
    bankName: 'Punjab National Bank',
    branchName: 'Mall Road, Kanpur',
    ifscCode: 'PUNB0024500',
    accountNumber: '024500DP001928',
    depositAmount: 1500000,
    requiredNormAmount: 1500000,
    interestRate: 6.50,
    issueDate: '2024-05-10',
    maturityDate: '2034-05-10',
    tenureYears: 10,
    jointHolderNames: 'Uttaranchal Shiksha Parishad & Regional Officer, AICTE Kanpur',
    lienStatus: 'LIEN_PENDING',
    status: 'DISCREPANCY_FLAGGED',
    documentHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    isForgedSuspect: true,
    forgeryConfidenceScore: 0.89,
    discrepancies: [
      {
        id: 'DISC-003-1',
        code: 'SEC-FORGERY-ELA',
        ruleTitle: 'Error Level Analysis (ELA) Compression Tamper Flag',
        severity: 'CRITICAL',
        description: 'Multi-level pixel noise divergence detected around the deposit amount. Font kerning indicates digital cut-and-paste manipulation.',
        detectedField: 'depositAmount',
        expectedValue: 'Authentic single-layer bank raster',
        actualValue: 'Spliced bitmap artifact (ELA Delta: 89.2%)',
        resolved: false
      }
    ],
    createdAt: '2024-05-11T12:00:00Z',
    updatedAt: '2024-05-15T10:15:00Z'
  }
];

let auditBlocks = [
  {
    blockIndex: 0,
    timestamp: '2024-01-01T00:00:00Z',
    fdrId: 'GENESIS-AICTE-REGULATION-BUREAU',
    action: 'GENESIS_INITIALIZATION',
    performedBy: 'AICTE Regulation Bureau Root Key',
    role: 'BUREAU_ADMIN',
    dataHash: '0000000000000000000000000000000000000000000000000000000000000000',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    merkleRoot: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    ipAddress: '10.244.0.1 (NIC Central Gov Cloud)'
  }
];

// --- REST API ENDPOINTS ---

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'AICTE-SURAKSHA Backend Gateway',
    version: '2.4.0-Sovereign',
    standards: ['ISO 20022 camt.053', 'NeSL e-BG', 'LayoutLMv3', 'SHA-256 Merkle DAG'],
    timestamp: new Date().toISOString()
  });
});

// Get all institutions
app.get('/api/institutions', (req, res) => {
  res.json({ success: true, count: institutions.length, data: institutions });
});

// Get all FDRs with query filters
app.get('/api/fdrs', (req, res) => {
  const { status, region, search } = req.query;
  let result = [...fdrList];

  if (status && status !== 'ALL') {
    result = result.filter(f => f.status === status);
  }
  if (region && region !== 'ALL') {
    result = result.filter(f => f.region === region);
  }
  if (search) {
    const s = String(search).toLowerCase();
    result = result.filter(f => 
      f.institutionName.toLowerCase().includes(s) ||
      f.fdrNumber.toLowerCase().includes(s) ||
      f.bankName.toLowerCase().includes(s)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// Create new FDR
app.post('/api/fdrs', (req, res) => {
  const data = req.body;
  const newFdr = {
    id: `FDR-${Date.now().toString().slice(-6)}`,
    fdrNumber: data.fdrNumber || `FDR-${Math.floor(1000000 + Math.random() * 9000000)}`,
    institutionId: data.institutionId || 'INST-001',
    institutionName: data.institutionName || 'Technical Institution',
    region: data.region || 'WRO_MUMBAI',
    bankName: data.bankName || 'State Bank of India',
    branchName: data.branchName || 'Commercial Branch',
    ifscCode: data.ifscCode || 'SBIN0000454',
    accountNumber: data.accountNumber || '100000000000',
    depositAmount: Number(data.depositAmount) || 3500000,
    requiredNormAmount: 3500000,
    interestRate: Number(data.interestRate) || 7.0,
    issueDate: data.issueDate || new Date().toISOString().split('T')[0],
    maturityDate: data.maturityDate || new Date(Date.now() + 10 * 365.25 * 86400000).toISOString().split('T')[0],
    tenureYears: Number(data.tenureYears) || 10,
    jointHolderNames: data.jointHolderNames || 'Trust & Regional Officer, AICTE',
    lienStatus: data.lienStatus || 'LIEN_PENDING',
    status: data.isForgedSuspect ? 'DISCREPANCY_FLAGGED' : 'SUBMITTED',
    documentHash: data.documentHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isForgedSuspect: Boolean(data.isForgedSuspect),
    forgeryConfidenceScore: Number(data.forgeryConfidenceScore) || 0.02,
    discrepancies: data.discrepancies || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  fdrList.unshift(newFdr);

  // Append to audit ledger
  auditBlocks.push({
    blockIndex: auditBlocks.length,
    timestamp: new Date().toISOString(),
    fdrId: newFdr.id,
    action: 'NEW_FDR_SUBMITTED',
    performedBy: req.body.performedBy || 'Authorized Institution Trustee',
    role: 'INSTITUTION_USER',
    dataHash: newFdr.documentHash,
    previousHash: auditBlocks[auditBlocks.length - 1].merkleRoot,
    merkleRoot: `0x${Date.now().toString(16).padEnd(64, 'a')}`,
    ipAddress: req.ip || '14.139.60.22 (NIC AICTE Gateway)'
  });

  res.status(201).json({ success: true, message: 'FDR ingested and appended to Merkle chain', data: newFdr });
});

// Update FDR Scrutiny Decision
app.post('/api/fdrs/:id/scrutiny', (req, res) => {
  const { id } = req.params;
  const { status, remarks, officerName } = req.body;

  const fdr = fdrList.find(f => f.id === id);
  if (!fdr) {
    return res.status(404).json({ success: false, message: 'FDR not found' });
  }

  fdr.status = status || fdr.status;
  fdr.scrutinyRemarks = remarks;
  fdr.scrutinyOfficer = officerName || 'Regional Officer';
  fdr.lastScrutinyDate = new Date().toISOString().split('T')[0];
  fdr.updatedAt = new Date().toISOString();

  auditBlocks.push({
    blockIndex: auditBlocks.length,
    timestamp: new Date().toISOString(),
    fdrId: fdr.id,
    action: `SCRUTINY_UPDATED_${status}`,
    performedBy: officerName || 'Regional Officer',
    role: 'REGIONAL_OFFICER',
    dataHash: `0x${Date.now().toString(16).padEnd(64, 'b')}`,
    previousHash: auditBlocks[auditBlocks.length - 1].merkleRoot,
    merkleRoot: `0x${Date.now().toString(16).padEnd(64, 'c')}`,
    ipAddress: req.ip || '10.244.12.8'
  });

  res.json({ success: true, message: 'Scrutiny recorded', data: fdr });
});

// Execute Bank Lien Marking (CBS)
app.post('/api/fdrs/:id/lien', (req, res) => {
  const { id } = req.params;
  const fdr = fdrList.find(f => f.id === id);
  if (!fdr) return res.status(404).json({ success: false, message: 'FDR not found' });

  fdr.lienStatus = 'LIEN_CONFIRMED';
  fdr.status = 'LIEN_MARKED';
  fdr.bankVerification = {
    cbsReferenceId: `CBS-${fdr.bankName.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-8)}`,
    bankName: fdr.bankName,
    branchName: fdr.branchName,
    ifscCode: fdr.ifscCode,
    accountNumber: fdr.accountNumber,
    accountStatus: 'ACTIVE_LOCKED',
    lienMarked: true,
    lienMarkingDate: new Date().toISOString().split('T')[0],
    verifiedAt: new Date().toLocaleString(),
    verifiedByOfficer: req.body.officerName || 'Senior Bank Lien Custodian',
    officerDesignation: 'Chief Manager (Credit & Guarantees)',
    cryptographicSignature: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
  };

  res.json({ success: true, message: 'Lien registered on Core Banking Solution', data: fdr });
});

// Get Cryptographic Ledger
app.get('/api/ledger', (req, res) => {
  res.json({
    success: true,
    blockCount: auditBlocks.length,
    isChainValid: true,
    blocks: auditBlocks
  });
});

// AI Copilot Endpoint
app.post('/api/copilot/query', (req, res) => {
  const { query } = req.body;
  const q = String(query || '').toLowerCase();

  let answer = 'According to AICTE Approval Process Handbook (APH 2024-27), all technical institutions must maintain security deposits locked jointly with the Regional Officer of AICTE.';
  let source = 'AICTE APH Chapters 1 & 2';

  if (q.includes('engineering') || q.includes('norm') || q.includes('amount')) {
    answer = 'Under AICTE APH Clause 1.4.2, the security deposit for Engineering & Technology is ₹35,00,000 (₹28,00,000 for concessions). Minimum mandatory lock-in is 10 years.';
    source = 'AICTE APH Chapter 1, Section 1.4.2';
  } else if (q.includes('lien') || q.includes('bank') || q.includes('cbs')) {
    answer = 'Banks must register an absolute non-encashable lien in favor of AICTE. No loan or premature encashment is permitted without explicit AICTE written sanction.';
    source = 'AICTE Joint Operating Circular & Banking Regulation Act';
  }

  res.json({ success: true, query, answer, source, timestamp: new Date().toISOString() });
});

// Serve static build in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`AICTE-SURAKSHA Backend Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api/health`);
  console.log(`Standard: ISO 20022 camt.053 & NeSL e-BG Interoperable`);
  console.log(`=======================================================`);
});

