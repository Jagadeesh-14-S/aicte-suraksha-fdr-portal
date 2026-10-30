import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink, 
  Lock, 
  Zap, 
  RefreshCw,
  Trash2
} from 'lucide-react';
import { 
  getSupabaseCredentials, 
  saveSupabaseCredentials, 
  clearSupabaseCredentials, 
  testSupabaseConnection 
} from '../services/supabaseClient';

interface SupabaseConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionChanged?: () => void;
}

export const SupabaseConnectModal: React.FC<SupabaseConnectModalProps> = ({
  isOpen,
  onClose,
  onConnectionChanged
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [status, setStatus] = useState<{ testing: boolean; success?: boolean; message?: string }>({
    testing: false
  });
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url);
      setAnonKey(creds.anonKey);
      setStatus({ testing: false });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ testing: true });

    const result = await testSupabaseConnection(url, anonKey);
    setStatus({ testing: false, success: result.success, message: result.message });

    if (result.success) {
      saveSupabaseCredentials(url, anonKey);
      if (onConnectionChanged) onConnectionChanged();
    }
  };

  const handleDisconnect = () => {
    clearSupabaseCredentials();
    setUrl('');
    setAnonKey('');
    setStatus({ testing: false, success: false, message: 'Disconnected. Using in-memory & local state.' });
    if (onConnectionChanged) onConnectionChanged();
  };

  const copySchemaNotice = () => {
    navigator.clipboard.writeText('-- Run supabase/schema.sql in Supabase SQL Editor to initialize all tables, RLS policies, and triggers.');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">Supabase PostgreSQL & Realtime Backend</h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                  Cloud Native
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Connect your hosted PostgreSQL database, Realtime webhooks, and Row-Level Security
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Supabase Benefits Banner */}
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start space-x-2">
              <Database className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">PostgreSQL Engine</span>
                <span className="text-[11px] text-slate-400">Relational data model with ACID compliance.</span>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Row-Level Security</span>
                <span className="text-[11px] text-slate-400">Granular AICTE RBAC for Bureau and ROs.</span>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Postgres Realtime</span>
                <span className="text-[11px] text-slate-400">Instant WebSocket updates on status changes.</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleTestAndSave} className="space-y-3">
            <div>
              <label className="text-slate-300 block font-semibold mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 block font-semibold mb-1">
                Supabase Anon / Public API Key
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={e => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Status Message */}
            {status.message && (
              <div className={`p-3 rounded-xl border flex items-center space-x-2 text-xs ${
                status.success
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800 text-rose-300'
              }`}>
                {status.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              {url ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              ) : <div />}

              <button
                type="submit"
                disabled={status.testing}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${status.testing ? 'animate-spin' : ''}`} />
                <span>{status.testing ? 'Testing Connection...' : 'Test & Save Supabase Connection'}</span>
              </button>
            </div>
          </form>

          {/* Database Setup Helper */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span>Database Schema Script</span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
              >
                <span>Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="leading-relaxed">
              We have generated the full SQL migration script located at <code className="text-white bg-slate-800 px-1 rounded">supabase/schema.sql</code> with all tables, constraints, RLS policies, and triggers ready to run in the Supabase SQL Editor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

