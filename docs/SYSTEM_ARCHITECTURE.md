# AICTE-SURAKSHA: System Architecture & Technical Specifications

## 1. System Overview

**AICTE-SURAKSHA** is an enterprise-grade, cloud-native regulatory platform engineered for the **All India Council for Technical Education (AICTE) Regulation Bureau**, Ministry of Education, Government of India. It automates the end-to-end lifecycle management of security deposits and Fixed Deposit Receipts (FDRs) mandated under the AICTE Approval Process Handbook (APH).

```
+--------------------------------------------------------------------------------------------------+
|                                     AICTE-SURAKSHA ARCHITECTURE                                  |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   +-----------------------+     +-----------------------+     +------------------------------+   |
|   |  Technical Institute  |     |  Regional Office (RO) |     |   AICTE Regulation Bureau    |   |
|   |   Trustees & Principals|     |  8 Territorial ROs    |     |   Central HQ (New Delhi)     |   |
|   +-----------+-----------+     +-----------+-----------+     +--------------+---------------+   |
|               |                             |                                |                   |
|               v                             v                                v                   |
|  +--------------------------------------------------------------------------------------------+  |
|  |                            Sovereign Presentation & RBAC Gateway                           |  |
|  |           (Next.js / Vite React 19 + Tailwind CSS + Lucide + Responsive Mobile/Desktop)     |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                               |                                                  |
|  +--------------------------------------------v-----------------------------------------------+  |
|  |                           AICTE-SURAKSHA Intelligent Core Engine                           |  |
|  |                                                                                            |  |
|  |   +---------------------------------------+    +---------------------------------------+   |  |
|  |   |   Neuro-Symbolic Multimodal OCR       |    |   12-Point Automated Discrepancy      |   |  |
|  |   |   (LayoutLMv3 Spatial Transformer +   |    |   Detection Matrix (APH Chapter 1 & 2 |   |  |
|  |   |    Error Level Analysis ELA Forgery)  |    |   Deposit Norms, Joint Name Predicate)|   |  |
|  |   +-------------------+-------------------+    +-------------------+-------------------+   |  |
|  |                       |                                            |                       |  |
|  |   +-------------------v-------------------+    +-------------------v-------------------+   |  |
|  |   |   Open Banking & CBS Lien Gateway     |    |   Automated Maturity Radar &          |   |  |
|  |   |   (ISO 20022 camt.053 / NeSL e-BG     |    |   Omnichannel Alert Engine            |   |  |
|  |   |    Live API Reconciliation Bridge)    |    |   (T-180, T-90, T-30, T-0 Escalation) |   |  |
|  |   +-------------------+-------------------+    +-------------------+-------------------+   |  |
|  |                       |                                            |                       |  |
|  |   +-------------------v--------------------------------------------v-------------------+   |  |
|  |   |                 Statutory 4-Stage Release & Refund State Machine                   |   |  |
|  |   |        (Application -> RO Scrutiny -> Bureau Sanction Order -> UTR Disbursement)  |   |  |
|  |   +---------------------------------------+--------------------------------------------+   |  |
|  +-------------------------------------------|------------------------------------------------+  |
|                                              |                                                   |
|  +-------------------------------------------v------------------------------------------------+  |
|  |                       Cryptographic & Data Persistence Layer                               |  |
|  |                                                                                            |  |
|  |   +---------------------------------------+    +---------------------------------------+   |  |
|  |   |   Immutable Merkle Audit Ledger       |    |   Off-Chain Encrypted Document Vault  |   |  |
|  |   |   (SHA-256 Hash Chain + Merkle Roots  |    |   (PDFs, Notarized Affidavits,        |   |  |
|  |   |    for CAG / CVC Statutory Auditing)  |    |    Core Banking Cryptographic Tokens) |   |  |
|  |   +---------------------------------------+    +---------------------------------------+   |  |
|  +--------------------------------------------------------------------------------------------+  |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Core Functional Modules

### Module 1: Centralized Digital FDR Repository
- Unified repository covering all 8 AICTE Regional Offices:
  - WRO (Mumbai), SRO (Chennai), SWRO (Bengaluru), NRO (Kanpur), NWRO (Chandigarh), CRO (Bhopal), SCRO (Hyderabad), ERO (Kolkata).
- Institution-wise and instrument-wise records tracking:
  - Bank details, IFSC, Branch, Deposit Account Number.
  - Principal deposit amount vs AICTE APH prescribed norm.
  - Joint ownership titles, tenure, issue date, and maturity date.
  - Current status: `SUBMITTED`, `BANK_VERIFIED`, `LIEN_MARKED`, `SCRUTINY_APPROVED`, `DISCREPANCY_FLAGGED`, `MATURING_SOON`, `MATURED`, `RELEASE_REQUESTED`, `RELEASED`, `RENEWED`.

### Module 2: Neuro-Symbolic Ingestion & ELA Forgery Detection
- **LayoutLM Spatial Vision Transformer:** Jointly evaluates visual layout tokens, coordinates, and typography to ingest non-standard physical receipts across 40+ scheduled commercial banks.
- **Error Level Analysis (ELA) Engine:** Computes localized compression residuals to expose digital cut-and-paste manipulation, modified amounts (e.g. ₹5L altered to ₹15L), forged stamps, and altered dates.

### Module 3: Open Banking CBS Lien Integration (ISO 20022 / NeSL)
- Direct Core Banking Solution (CBS) reconciliation mimicking SBI, PNB, Canara Bank, and HDFC systems.
- Implements `pain.001` (Customer Credit Transfer) and `camt.053` (Bank to Customer Statement) messages.
- Automatic registration of **Non-Encashable Liens** in favor of the concerned Regional Officer.

### Module 4: 12-Point Automated Discrepancy Matrix
Evaluates statutory compliance:
1. `APH-JOINT-CLAUSE-VIOLATION`: Verifies explicit joint ownership with "Regional Officer, AICTE".
2. `APH-AMOUNT-SHORTFALL`: Evaluates category-based minimum norm (e.g., ₹35L for Engineering, ₹15L for Management/Pharmacy/MCA/Polytechnic).
3. `APH-TENURE-DEFICIT`: Validates 8-10 year lock-in tenure.
4. `APH-OVERDUE-CRITICAL`: Detects expired instruments sitting idle without renewal or release.
5. `APH-EXPIRY-30D`: Flags imminent maturity within 30 days.
6. `BANK-IFSC-INVALID`: Validates RBI IFSC format and branch routing.
7. `BANK-LIEN-MISSING`: Enforces active Core Banking non-encashable lien.
8. `SEC-FORGERY-ELA`: Flags documents exceeding ELA tamper confidence threshold (40%).
9. `APH-JURISDICTION-MISMATCH`: Confirms institution's state falls within the named RO jurisdiction.
10. `BANK-ACC-IRREGULAR`: Checks deposit account format integrity.
11. `WORDS-VS-NUMBERS`: Cross-validates numerical amount against text representation.
12. `COMPLIANCE-INDEX`: Computes real-time composite health index (0–100%).

### Module 5: Automated Maturity Radar & Omnichannel Escalation
- Real-time days-to-maturity tracker.
- Automatic trigger at key intervals:
  - **T-180 Days:** Statutory advance advisory.
  - **T-90 Days:** Formal renewal notice to Trust Chairperson & Principal.
  - **T-30 Days:** High-priority reminder with direct link to online renewal or refund portal.
  - **Day 0 / Overdue:** Automated show-cause notice and compliance penalty flag.
- Omnichannel broadcast simulation: In-App, Email, SMS, and WhatsApp webhooks.

### Module 6: Statutory 4-Tier Release & Refund Engine
- **Stage 1 (Institution):** Submits 10-year completion request, original receipt, and notarized Judicial Non-Liability Affidavit.
- **Stage 2 (Regional Officer):** Scrutinizes physical records, verifies zero pending student grievances or unpaid faculty salaries, and issues recommendation.
- **Stage 3 (Regulation Bureau):** Central HQ issues electronic Sanction Order decree.
- **Stage 4 (Bank CBS):** Generates lien revocation token and disburses funds via RTGS/NEFT with UTR confirmation.

### Module 7: Immutable Cryptographic Merkle Audit Trail
- Every regulatory event is appended into a SHA-256 block chain.
- Computes Merkle tree roots for batch verification.
- Exportable audit dossiers designed for Comptroller and Auditor General (CAG) and Central Vigilance Commission (CVC) inspections.

### Module 8: Suraksha AI Regulatory Copilot
- Interactive natural language assistant trained on AICTE Approval Process Handbook (APH 2024-27).
- Answers regulatory questions, explains discrepancy reasons, and provides step-by-step guidance.
