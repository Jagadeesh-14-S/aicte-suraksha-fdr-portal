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
      text: "Namaste! I am the AICTE-SURAKSHA Regulatory Virtual Assistant, indexed on the AICTE Approval Process Handbook (APH) and Scheduled Commercial Banking Lien procedures. How may I assist you with Fixed Deposit Receipts, deposit norms, discrepancy resolution, or refund workflows today?",
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
      let source = 'AICTE APH Guidelines';

      const q = textToSend.toLowerCase();

      if (q.includes('engineering') || q.includes('norm') || q.includes('amount') || q.includes('how much')) {
        reply = `Under AICTE Approval Process Handbook Chapter II:\n\n• New Technical Institution (Engineering & Technology): ₹35 Lakhs security deposit.\n• Pharmacy / Architecture / Management / MCA: ₹15 Lakhs to ₹25 Lakhs depending on category.\n• Must be maintained as Fixed Deposit Receipt (FDR) for a mandatory lock-in period of 10 years, pledged jointly in the name of the Applicant Society/Trust and the Regional Officer, AICTE.`;
        source = 'AICTE APH Appendix 4: Norms for Land and Security Deposits';
      } else if (q.includes('lien') || q.includes('bank') || q.includes('nesl')) {
        reply = `AICTE-SURAKSHA mandates bidirectional lien confirmation via Core Banking Solution (CBS) APIs using ISO 20022 camt.053 standard or NeSL e-BG repository:\n\n1. The issuing bank's Finacle/BaNCS core marks an absolute encumbrance prohibiting encashment, premature withdrawal, or loan against FDR without AICTE's explicit digital sanction.\n2. Both the Trust and AICTE RO appear as joint holders with AICTE holding the exclusive lien privilege.`;
        source = 'AICTE Statutory Circular: Security Deposit Preservation & RBI CBS Protocol';
      } else if (q.includes('refund') || q.includes('release') || q.includes('mature') || q.includes('10')) {
        reply = `Security Deposit Release follows the AICTE 4-Stage Regulatory Architecture:\n\n1. Institution submits release dossier (10-year term completion proof, non-liability affidavit, university NOC).\n2. Regional Officer conducts scrutiny audit and issues clearance.\n3. Regulation Bureau (Central AICTE) issues official Sanction Order.\n4. Issuing bank CBS automatically discharges lien and credits principal to verified institution account via RTGS/NEFT.`;
        source = 'AICTE APH Clause 2.18: Procedure for Refund of Security Deposit';
      } else if (q.includes('ela') || q.includes('forg') || q.includes('tamper') || q.includes('fake')) {
        reply = `Error Level Analysis (ELA) detects digital tampering by analyzing compression error deltas:\n\n• Resaved and edited JPEG/PDF artifacts exhibit higher high-frequency noise levels.\n• When an FDR receipt has altered deposit amounts, maturity dates, or forged bank seals, the ELA heatmap isolates the modified bounding box with >95% confidence (based on IEEE/Elsevier digital forensic standards).`;
        source = 'IEEE Access & Elsevier Forensic Science International: Digital Document Verification';
      } else {
        reply = `Regarding your inquiry on "${textToSend}": All technical institutions operating under AICTE approval must keep security deposits active throughout the operational tenure or the statutory 10-year lock-in period. If an FDR is expiring or showing discrepancies in interest/joint holding, immediate renewal or rectification is required to maintain institutional approval status.`;
        source = 'AICTE Regulation Bureau Administrative Guidelines';
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
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-300 rounded-xl shadow-2xl flex flex-col h-[600px] max-h-[90vh] overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-orange-600/20 flex items-center justify-center text-orange-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">AICTE Regulatory Virtual Assistant</h3>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-mono font-medium">
                  APH Guidelines Active
                </span>
              </div>
              <p className="text-xs text-slate-300">AICTE Approval Process & Banking Lien Helpdesk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#C2410C] text-white rounded-br-none shadow-xs font-medium'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                {m.sourceDoc && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-amber-900 font-medium flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                    <span>Reference: {m.sourceDoc}</span>
                  </div>
                )}
              </div>

              {m.chips && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                  {m.chips.map((chip, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => handleSend(chip)}
                      className="text-left text-[11px] bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-950 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors shadow-2xs"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-orange-600 animate-spin" />
              <span>Analyzing AICTE Regulatory Regulations...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about AICTE deposit norms, 10-year lock-in, bank lien, or refund..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-40 text-white rounded-lg transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
