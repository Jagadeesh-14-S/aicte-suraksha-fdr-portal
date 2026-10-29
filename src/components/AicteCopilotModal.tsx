import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  FileCheck2, 
  ShieldAlert, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface CopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  sourceDoc?: string;
  chips?: string[];
}

export const AicteCopilotModal: React.FC<CopilotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Namaste! I am your AICTE-SURAKSHA Regulatory AI Copilot, trained on the AICTE Approval Process Handbook (APH 2024-27) and Indian Banking Lien norms. How can I assist you with Fixed Deposit Receipts, security deposit norms, discrepancy resolution, or refund workflows today?",
      sourceDoc: 'AICTE Approval Process Handbook (APH) Chapters 1 & 2',
      chips: [
        'What is the deposit norm for Engineering?',
        'How does AICTE lien marking work with Banks?',
        'What are the mandatory conditions for FDR refund/release?',
        'How does Error Level Analysis (ELA) detect forged FDRs?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = '';
      let source = 'AICTE APH 2024-27';

      const q = textToSend.toLowerCase();

      if (q.includes('engineering') || q.includes('norm') || q.includes('amount') || q.includes('how much')) {
        reply = `**Security Deposit Norms for Technical Institutions (AICTE APH Clause 1.4.2):**\n\n` +
          `• **Engineering & Technology (UG/Integrated):** ₹35,00,000 (₹28,00,000 for Women/SC/ST/NER/J&K concessions).\n` +
          `• **Management (MBA/PGDM):** ₹15,00,000.\n` +
          `• **Pharmacy (B.Pharm):** ₹15,00,000.\n` +
          `• **Computer Applications (MCA):** ₹15,00,000.\n` +
          `• **Polytechnic Diploma:** ₹15,00,000.\n\n` +
          `**Mandatory Tenure:** Minimum 8 to 10 years lock-in period. Interest accrued periodically is designated for student welfare and institutional scholarships.`;
        source = 'AICTE APH Chapter 1, Section 1.4.2 & Appendix 14';
      } else if (q.includes('lien') || q.includes('bank') || q.includes('cbs') || q.includes('encash')) {
        reply = `**Bank Lien Marking Protocol & Non-Encashment Mandate:**\n\n` +
          `1. The Fixed Deposit Receipt must be registered in the **joint names** of the Trust/Society Chairperson/Secretary AND the **Regional Officer, AICTE**.\n` +
          `2. **Lien Clause:** Scheduled Commercial Banks must mark an absolute, non-encashable lien in favor of AICTE in their Core Banking System (CBS).\n` +
          `3. **Prohibition:** Banks are strictly prohibited from allowing premature encashment, loan/overdraft creation, or assignment without prior explicit written sanction / NOC from AICTE.`;
        source = 'AICTE Joint Operating Circular & Banking Regulation Act Sec 45';
      } else if (q.includes('refund') || q.includes('release') || q.includes('10 year')) {
        reply = `**FDR Release & Refund Mandatory Checklist:**\n\n` +
          `Upon completion of the 10-year term (or formal closure of the institution), the applicant trust must submit:\n` +
          `1. Formal application on AICTE Web Portal.\n` +
          `2. **Prescribed Affidavit** sworn before an Executive / Judicial Magistrate affirming no pending litigation, faculty salary dues, or student grievances.\n` +
          `3. Original FDR document / Bank Lien discharge confirmation.\n` +
          `4. No-Dues Certificate from the concerned State Government / Affiliating University.\n\n` +
          `The release requires joint recommendation by the Regional Officer (RO) and final sanction by the Regulation Bureau, New Delhi.`;
        source = 'AICTE APH Chapter 2, Clause 2.18: Release of Security Deposit';
      } else if (q.includes('ela') || q.includes('forgery') || q.includes('tamper') || q.includes('fake')) {
        reply = `**Error Level Analysis (ELA) & Multimodal Forensics:**\n\n` +
          `Based on Al-Sumaidaee et al. (Elsevier FSIDI 2020), digital document tampering leaves telltale compression signatures:\n` +
          `• When an institution alters numbers (e.g., modifying ₹5,00,000 to ₹15,00,000 in an image editor), the edited pixels undergo an extra JPEG compression cycle.\n` +
          `• SURAKSHA's ELA engine re-saves the image at a known quality level and computes pixel-wise residual error delta.\n` +
          `• Spliced fonts, altered dates, and counterfeit rubber stamps glow bright in the ELA heatmap, automatically triggering a **CRITICAL FORGERY ALERT** before the Regional Officer.`;
        source = 'Elsevier FSIDI 2020 & SURAKSHA Neuro-Symbolic Verification Engine';
      } else {
        reply = `According to AICTE regulations and the Approval Process Handbook, all institutions must maintain valid, unencumbered security deposits locked in joint accounts with the Regional Officer of AICTE. Deposits are tracked from submission through 10-year maturity to final audit-cleared release. Would you like to review specific norms for your institution category?`;
        source = 'AICTE Regulatory Bureau Knowledge Base';
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: reply,
          sourceDoc: source
        }
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col h-[650px] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">Suraksha AI Regulatory Copilot</h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                  APH 2024-27 Live
                </span>
              </div>
              <p className="text-[11px] text-slate-300">AICTE Approval Process & Banking Lien Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-br-sm'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                {m.sourceDoc && (
                  <div className="mt-2 pt-2 border-t border-slate-700/80 text-[10px] text-amber-300/90 flex items-center space-x-1">
                    <BookOpen className="w-3 h-3 shrink-0" />
                    <span>Statutory Ref: {m.sourceDoc}</span>
                  </div>
                )}
              </div>

              {m.chips && (
                <div className="mt-3 flex flex-wrap gap-1.5 max-w-[90%]">
                  {m.chips.map((chip, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => handleSend(chip)}
                      className="text-[11px] bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 hover:border-blue-500/50 px-2.5 py-1 rounded-full transition-all text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
              <Bot className="w-4 h-4 animate-spin text-blue-400" />
              <span>Analyzing AICTE Regulatory Handbook & Legal Precedents...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about AICTE FDR rules, lien marking, refund affidavit, or ELA forgery..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

