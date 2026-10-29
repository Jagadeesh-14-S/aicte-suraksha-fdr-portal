import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FdrInstrument, AuditBlock } from '../types';

const STORAGE_URL_KEY = 'suraksha_supabase_url';
const STORAGE_KEY_KEY = 'suraksha_supabase_anon_key';

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';

  return {
    url: localUrl || envUrl,
    anonKey: localKey || envKey
  };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: { persistSession: true },
        realtime: { params: { eventsPerSecond: 10 } }
      });
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  localStorage.setItem(STORAGE_URL_KEY, url.trim());
  localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  supabaseInstance = null; // Reset to force re-instantiation
}

export function clearSupabaseCredentials(): void {
  localStorage.removeItem(STORAGE_URL_KEY);
  localStorage.removeItem(STORAGE_KEY_KEY);
  supabaseInstance = null;
}

export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string }> {
  const creds = url && anonKey ? { url, anonKey } : getSupabaseCredentials();

  if (!creds.url || !creds.anonKey) {
    return { success: false, message: 'Supabase URL or Anon Key is missing.' };
  }

  try {
    const tempClient = createClient(creds.url, creds.anonKey);
    const { error } = await tempClient.from('institutions').select('id').limit(1);

    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, it's connected to Postgres but schema not run
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        return { 
          success: true, 
          message: 'Connected to Supabase! (Tables pending: please run schema.sql in Supabase SQL Editor)' 
        };
      }
      return { success: false, message: `Supabase Error: ${error.message}` };
    }

    return { success: true, message: 'Successfully connected to Supabase PostgreSQL & Realtime!' };
  } catch (err: any) {
    return { success: false, message: `Connection Failed: ${err.message || err}` };
  }
}

export async function fetchFdrInstrumentsFromSupabase(): Promise<FdrInstrument[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('fdr_instruments')
      .select(`
        *,
        discrepancies:discrepancy_flags(*),
        bankVerification:bank_verifications(*),
        releaseRequest:release_requests(*)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetch failed:', error);
      return null;
    }

    // Map snake_case to camelCase
    return data.map((item: any) => ({
      id: item.id,
      fdrNumber: item.fdr_number,
      institutionId: item.institution_id,
      institutionName: item.institution_name,
      region: item.region,
      bankName: item.bank_name,
      branchName: item.branch_name,
      ifscCode: item.ifsc_code,
      accountNumber: item.account_number,
      depositAmount: Number(item.deposit_amount),
      requiredNormAmount: Number(item.required_norm_amount),
      interestRate: Number(item.interest_rate),
      issueDate: item.issue_date,
      maturityDate: item.maturity_date,
      tenureYears: item.tenure_years,
      jointHolderNames: item.joint_holder_names,
      lienStatus: item.lien_status,
      status: item.status,
      documentUrl: item.document_url,
      documentHash: item.document_hash,
      isForgedSuspect: item.is_forged_suspect,
      forgeryConfidenceScore: Number(item.forgery_confidence_score),
      discrepancies: (item.discrepancies || []).map((d: any) => ({
        id: d.id,
        code: d.code,
        ruleTitle: d.rule_title,
        severity: d.severity,
        description: d.description,
        detectedField: d.detected_field,
        expectedValue: d.expected_value,
        actualValue: d.actual_value,
        resolved: d.resolved
      })),
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (e) {
    console.warn('Supabase error:', e);
    return null;
  }
}
