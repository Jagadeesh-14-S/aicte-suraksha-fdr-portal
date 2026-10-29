import { FdrInstrument, Institution, AuditBlock } from '../types';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : '/api';

export interface BackendHealthResponse {
  isConnected: boolean;
  service?: string;
  version?: string;
  standards?: string[];
  url?: string;
}

export const apiService = {
  async checkHealth(): Promise<BackendHealthResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          isConnected: true,
          service: data.service,
          version: data.version,
          standards: data.standards,
          url: API_BASE_URL
        };
      }
      return { isConnected: false };
    } catch {
      return { isConnected: false };
    }
  },

  async getFdrs(): Promise<FdrInstrument[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/fdrs`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    return null;
  },

  async createFdr(fdrData: Partial<FdrInstrument>): Promise<FdrInstrument | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/fdrs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fdrData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    return null;
  },

  async updateScrutiny(fdrId: string, status: string, remarks: string, officerName?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/fdrs/${fdrId}/scrutiny`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks, officerName })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async markLien(fdrId: string, officerName?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/fdrs/${fdrId}/lien`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerName })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getLedger(): Promise<AuditBlock[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/ledger`);
      if (res.ok) {
        const json = await res.json();
        return json.blocks;
      }
    } catch {}
    return null;
  },

  async askCopilot(query: string): Promise<{ answer: string; source: string } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/copilot/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (res.ok) {
        const json = await res.json();
        return { answer: json.answer, source: json.source };
      }
    } catch {}
    return null;
  }
};
