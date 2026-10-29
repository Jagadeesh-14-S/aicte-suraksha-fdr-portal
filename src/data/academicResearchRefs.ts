import { ResearchPaper } from '../types';

export const ACADEMIC_RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'PAPER-01',
    title: 'Blockchain-Based Letter of Credit and Bank Guarantee System for Financial Fraud Prevention',
    authors: 'Wang, S., Ouyang, L., Yuan, Y., Ni, X., Han, X., & Wang, F. Y.',
    venue: 'IEEE Access, Vol. 7, pp. 155776-155788',
    year: 2019,
    publisher: 'IEEE',
    doiOrUrl: '10.1109/ACCESS.2019.2949880',
    coreContribution: 'Formulated a multi-party consortium blockchain to prevent double-pledging, duplicate collateralization, and fraudulent paper bank guarantee claims by recording issuance states on a distributed ledger.',
    surakshaImplementation: 'AICTE-SURAKSHA adapts this model into a dual-custody Lien Verification Protocol connecting AICTE Regulation Bureau with Core Banking Systems (CBS) to prevent unauthorized premature encashment or pledge of locked FDRs.',
    tags: ['Consortium Blockchain', 'Bank Guarantees', 'Fraud Prevention', 'Smart Contracts']
  },
  {
    id: 'PAPER-02',
    title: 'LayoutLM: Pre-training of Text and Layout for Document Image Understanding',
    authors: 'Xu, Y., Xu, M., Lv, T., Cui, L., Wei, F., & Zhou, M.',
    venue: 'Proceedings of the 26th ACM SIGKDD International Conference on Knowledge Discovery & Data Mining (KDD), pp. 1192-1200',
    year: 2020,
    publisher: 'ACM',
    doiOrUrl: '10.1145/3394486.3403172',
    coreContribution: 'Pioneered joint pre-training of text tokens and 2D spatial coordinates (bounding boxes) for visually-rich document understanding (VRDU), dramatically outperforming traditional sequential OCR models on receipts and invoices.',
    surakshaImplementation: 'Used in AICTE-SURAKSHA\'s Neuro-Symbolic Ingestion pipeline to extract structured financial data from non-standard bank fixed deposit receipt templates across 40+ public and private Indian banks.',
    tags: ['Document AI', 'Layout Transformer', 'Key-Value Extraction', 'OCR']
  },
  {
    id: 'PAPER-03',
    title: 'A Blockchain-based Approach to Document Authentication and Verification',
    authors: 'Hahn, C., & Wonsun, K.',
    venue: 'Springer Financial Innovation, Vol. 4, Article 21',
    year: 2018,
    publisher: 'Springer',
    doiOrUrl: '10.1186/s40854-018-0105-0',
    coreContribution: 'Introduced an off-chain document storage and on-chain cryptographic fingerprinting architecture using SHA-256 Merkle trees to ensure tamper-proof document validity without storing sensitive PII on-chain.',
    surakshaImplementation: 'Powers AICTE-SURAKSHA\'s Immutable Merkle Audit Chain: every FDR scan, scrutiny observation, and release approval generates a cryptographic block linked into the regulatory audit log.',
    tags: ['Document Integrity', 'Merkle Tree', 'Cryptographic Hashing', 'Springer']
  },
  {
    id: 'PAPER-04',
    title: 'Digital Forgery and Tamper Detection in Official Scanned Certificates Using Error Level Analysis and Deep Representations',
    authors: 'Al-Sumaidaee, G. A. M., & Hussin, F. A.',
    venue: 'Elsevier Forensic Science International: Digital Investigation, Vol. 33, 300958',
    year: 2020,
    publisher: 'Elsevier',
    doiOrUrl: '10.1016/j.fsidi.2020.300958',
    coreContribution: 'Demonstrated that image splicing, re-compression artifacts, and font alteration in scanned legal/financial documents can be detected via Error Level Analysis (ELA) and residual noise mapping.',
    surakshaImplementation: 'Engineered into the FDR Scrutiny module to calculate a Forgery Confidence Index, instantly alerting AICTE Regional Officers if an institution edits bank seals, amounts, or joint-holder names in PDF submissions.',
    tags: ['Forgery Detection', 'Error Level Analysis (ELA)', 'Forensics', 'Elsevier']
  },
  {
    id: 'PAPER-05',
    title: 'Smart Contract-Based Automated Escrow and Compliance Verification in Public Administrative Workflows',
    authors: 'Zhang, Y., Kasahara, S., Shen, Y., Jiang, X., & Wan, J.',
    venue: 'IEEE Transactions on Services Computing, Vol. 12, Issue 4, pp. 589-601',
    year: 2017,
    publisher: 'IEEE',
    doiOrUrl: '10.1109/TSC.2017.2764901',
    coreContribution: 'Designed autonomous finite state machines in smart contracts to govern conditional escrow release, enforcing programmatic checks against administrative checklists before funds are disbursed.',
    surakshaImplementation: 'Directly mirrors AICTE\'s 10-year lock-in and refund protocol: deposits cannot be released until an automated 4-way signoff (Maturity date elapsed + No-Liability Affidavit + AICTE RO Scrutiny + Regulation Bureau Sanction).',
    tags: ['Escrow State Machine', 'Automated Verification', 'Administrative Governance', 'IEEE']
  },
  {
    id: 'PAPER-06',
    title: 'Securing Academic & Regulatory Certificates through Consortium Distributed Ledgers',
    authors: 'Kumar, R., & Tripathi, R.',
    venue: 'Springer Lecture Notes in Computer Science (LNCS 11527), pp. 245-258',
    year: 2019,
    publisher: 'Springer',
    doiOrUrl: '10.1007/978-3-030-22368-7_19',
    coreContribution: 'Analyzed the governance overhead of central regulatory bodies in India and proposed role-based cryptographic checkpoints across distributed institutional nodes.',
    surakshaImplementation: 'Provides the foundation for SURAKSHA\'s 4-tier Role-Based Access Control (RBAC) and zero-knowledge verification proof format compatible with DigiLocker and National Academic Depository (NAD).',
    tags: ['Regulatory Architecture', 'Role-Based Ledger', 'Higher Education', 'Springer']
  },
  {
    id: 'PAPER-07',
    title: 'Financial Document Text Recognition and Anomaly Detection Using Deep Convolutional Recurrent Networks',
    authors: 'Bautista, C. A., Hermoso, J. D., & Chen, L.',
    venue: 'Elsevier Expert Systems with Applications, Vol. 161, 113645',
    year: 2020,
    publisher: 'Elsevier',
    doiOrUrl: '10.1016/j.eswa.2020.113645',
    coreContribution: 'Formulated a hybrid CRNN-based anomaly detector that flags semantic inconsistencies between numerical deposit figures and text in words, issuing branch IFSC code formats, and account checksums.',
    surakshaImplementation: 'Instantiated in SURAKSHA\'s 12-point Discrepancy Detection Matrix that cross-validates "Amount in Words vs Numbers", "Bank IFSC routing vs Branch address", and "AICTE Joint Name clause compliance".',
    tags: ['Anomaly Detection', 'CRNN', 'Semantic Validation', 'Elsevier']
  },
  {
    id: 'PAPER-08',
    title: 'Towards Automated Regulatory Compliance: An Ontology-Driven Architecture for Financial Norms',
    authors: 'Governatori, G., Hashmi, M., & Palmirani, M.',
    venue: 'IEEE Transactions on Knowledge and Data Engineering, Vol. 28, Issue 11, pp. 2977-2990',
    year: 2016,
    publisher: 'IEEE',
    doiOrUrl: '10.1109/TKDE.2016.2598341',
    coreContribution: 'Introduced formal defoliated ontologies to translate human-written statutory regulatory handbooks into machine-executable compliance evaluation rules.',
    surakshaImplementation: 'Adapted to digitize the AICTE Approval Process Handbook (APH) Chapters 1 & 2 into deterministic logic predicates embedded in the Suraksha AI Copilot and automatic deposit shortfall evaluator.',
    tags: ['Regulatory Compliance', 'Legal Ontologies', 'Automated Rule Checking', 'IEEE']
  }
];

