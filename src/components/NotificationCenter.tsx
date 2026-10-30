import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  Mail, 
  MessageSquare, 
  PhoneCall
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFdr: (fdrId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onSelectFdr
}) => {
  const { notifications, dismissAlert, markAllAlertsAsRead } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white border-l border-slate-300 text-slate-800 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-[#0B3558] text-white flex items-center justify-between border-b border-[#07243c]">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-sm font-bold text-white">Automated Regulatory Alerts</h3>
              <p className="text-[11px] text-blue-100">Time-sensitive maturity & discrepancy escalations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={markAllAlertsAsRead}
                className="text-xs text-blue-100 hover:text-white flex items-center space-x-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark Read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-blue-200 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCheck className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
              <p className="text-sm font-semibold text-slate-800">No active alerts or overdue instruments.</p>
              <p className="text-xs text-slate-500 mt-1">All fixed deposits are compliant with AICTE APH norms.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.severity === 'HIGH'
                    ? 'bg-rose-50 border-rose-200 hover:border-rose-300'
                    : item.severity === 'MEDIUM'
                    ? 'bg-amber-50 border-amber-200 hover:border-amber-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.severity === 'HIGH' ? 'bg-rose-600 animate-ping' : 'bg-amber-500'
                      }`}
                    />
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.title}</h4>
                  </div>
                  <button
                    onClick={() => dismissAlert(item.id)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-700 mt-2 leading-relaxed">{item.message}</p>

                {/* Institution & Dispatched Channels */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 truncate max-w-[180px] font-medium">
                    {item.institutionName}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-slate-500">Dispatched:</span>
                    {item.channelsSent.includes('EMAIL') && (
                      <span title="Email sent"><Mail className="w-3 h-3 text-blue-600" /></span>
                    )}
                    {item.channelsSent.includes('SMS') && (
                      <span title="SMS sent"><PhoneCall className="w-3 h-3 text-emerald-600" /></span>
                    )}
                    {item.channelsSent.includes('WHATSAPP') && (
                      <span title="WhatsApp Webhook sent"><MessageSquare className="w-3 h-3 text-green-600" /></span>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => {
                      onSelectFdr(item.fdrId);
                      onClose();
                    }}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
                  >
                    <span>Inspect Record</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white border-t border-slate-200 text-xs text-slate-500 text-center">
          Automated Smart Engine triggers alerts at T-180, T-90, T-30 days & Day 0.
        </div>
      </div>
    </div>
  );
};
