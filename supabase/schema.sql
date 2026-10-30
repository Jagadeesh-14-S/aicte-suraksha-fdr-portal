-- ==============================================================================
-- AICTE-SURAKSHA: Database Schema for Supabase (PostgreSQL)
-- Problem Statement ID: 26265 (Streamline of Security Deposit / FDR Portal)
-- Organization: AICTE Regulation Bureau, Ministry of Education, Govt of India
-- ==============================================================================

-- Enable UUID extension & Cryptographic functions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. INSTITUTIONS TABLE
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aicte_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    trust_name VARCHAR(255) NOT NULL,
    region VARCHAR(50) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    total_approved_intake INTEGER DEFAULT 0,
    established_year INTEGER NOT NULL,
    total_deposit_value NUMERIC(15, 2) DEFAULT 0.00,
    compliance_score INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FDR INSTRUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.fdr_instruments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fdr_number VARCHAR(100) UNIQUE NOT NULL,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    region VARCHAR(50) NOT NULL,
    bank_name VARCHAR(150) NOT NULL,
    branch_name VARCHAR(150) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    deposit_amount NUMERIC(15, 2) NOT NULL,
    required_norm_amount NUMERIC(15, 2) NOT NULL,
    interest_rate NUMERIC(5, 2) NOT NULL,
    issue_date DATE NOT NULL,
    maturity_date DATE NOT NULL,
    tenure_years INTEGER NOT NULL DEFAULT 10,
    joint_holder_names TEXT NOT NULL,
    lien_status VARCHAR(50) DEFAULT 'LIEN_PENDING',
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    document_url TEXT,
    document_hash VARCHAR(100) NOT NULL,
    is_forged_suspect BOOLEAN DEFAULT FALSE,
    forgery_confidence_score NUMERIC(5, 4) DEFAULT 0.0000,
    last_scrutiny_date DATE,
    scrutiny_remarks TEXT,
    scrutiny_officer VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DISCREPANCY FLAGS TABLE
CREATE TABLE IF NOT EXISTS public.discrepancy_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fdr_id UUID REFERENCES public.fdr_instruments(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    rule_title VARCHAR(200) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- CRITICAL, WARNING, INFO
    description TEXT NOT NULL,
    detected_field VARCHAR(100) NOT NULL,
    expected_value TEXT NOT NULL,
    actual_value TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    resolved_by VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BANK VERIFICATIONS (CBS & NeSL) TABLE
CREATE TABLE IF NOT EXISTS public.bank_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fdr_id UUID UNIQUE REFERENCES public.fdr_instruments(id) ON DELETE CASCADE,
    cbs_reference_id VARCHAR(100) NOT NULL,
    bank_name VARCHAR(150) NOT NULL,
    branch_name VARCHAR(150) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_status VARCHAR(50) NOT NULL, -- ACTIVE_LOCKED, INVALID, UNENCUMBERED
    lien_marked BOOLEAN DEFAULT FALSE,
    lien_marking_date DATE,
    lien_expiry_date DATE,
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    verified_by_officer VARCHAR(150) NOT NULL,
    officer_designation VARCHAR(150) NOT NULL,
    cryptographic_signature TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RELEASE & REFUND REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.release_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id VARCHAR(50) UNIQUE NOT NULL,
    fdr_id UUID UNIQUE REFERENCES public.fdr_instruments(id) ON DELETE CASCADE,
    reason VARCHAR(100) NOT NULL,
    affidavit_submitted BOOLEAN DEFAULT FALSE,
    affidavit_doc_hash VARCHAR(100),
    no_due_certificate_submitted BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'PENDING_RO_SCRUTINY',
    ro_recommendation VARCHAR(50),
    ro_remarks TEXT,
    ro_action_date TIMESTAMPTZ,
    bureau_decision_date DATE,
    bureau_sanction_order_no VARCHAR(100),
    bureau_remarks TEXT,
    refund_disbursed_amount NUMERIC(15, 2),
    refund_utr_number VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. IMMUTABLE MERKLE AUDIT LEDGER TABLE
CREATE TABLE IF NOT EXISTS public.audit_blocks (
    block_index BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    fdr_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    data_hash VARCHAR(100) NOT NULL,
    previous_hash VARCHAR(100) NOT NULL,
    merkle_root VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50) NOT NULL
);

-- 7. REALTIME NOTIFICATIONS & ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fdr_id UUID REFERENCES public.fdr_instruments(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    days_remaining INTEGER,
    channels_sent TEXT[] DEFAULT ARRAY['IN_APP'],
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fdr_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discrepancy_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated & anonymous users (Demo prototype friendly)
CREATE POLICY "Public Read Institutions" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "Public Read FDRs" ON public.fdr_instruments FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update FDRs" ON public.fdr_instruments FOR ALL USING (true);
CREATE POLICY "Public Read Discrepancies" ON public.discrepancy_flags FOR ALL USING (true);
CREATE POLICY "Public Read Verifications" ON public.bank_verifications FOR ALL USING (true);
CREATE POLICY "Public Read Releases" ON public.release_requests FOR ALL USING (true);
CREATE POLICY "Public Read Audit" ON public.audit_blocks FOR ALL USING (true);
CREATE POLICY "Public Read Alerts" ON public.alerts FOR ALL USING (true);

-- Enable Supabase Realtime Publication for Live State Sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.fdr_instruments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discrepancy_flags;
ALTER PUBLICATION supabase_realtime ADD TABLE public.release_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_blocks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;

-- ==============================================================================
-- SEED INITIAL GENESIS BLOCK & CORE AICTE DATA
-- ==============================================================================

INSERT INTO public.audit_blocks (block_index, timestamp, fdr_id, action, performed_by, role, data_hash, previous_hash, merkle_root, ip_address)
VALUES (
    0,
    '2024-01-01 00:00:00+00',
    'GENESIS-AICTE-REGULATION-BUREAU',
    'GENESIS_INITIALIZATION',
    'AICTE Regulation Bureau Root Key',
    'BUREAU_ADMIN',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '0000000000000000000000000000000000000000000000000000000000000000',
    '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    '10.244.0.1 (NIC Central Gov Cloud)'
) ON CONFLICT DO NOTHING;

