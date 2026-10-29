import { AlertNotification, FdrInstrument } from '../types';

export function generateAutomatedAlerts(fdrList: FdrInstrument[]): AlertNotification[] {
  const alerts: AlertNotification[] = [];
  const now = new Date();

  fdrList.forEach(fdr => {
    // 1. Maturity Alerts
    if (fdr.maturityDate && fdr.status !== 'RELEASED' && fdr.status !== 'RENEWED') {
      const maturity = new Date(fdr.maturityDate);
      const daysDiff = Math.ceil((maturity.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff < 0) {
        // Overdue!
        alerts.push({
          id: `ALERT-OVERDUE-${fdr.id}`,
          fdrId: fdr.id,
          institutionName: fdr.institutionName,
          type: 'MATURITY_EXPIRY',
          title: `CRITICAL OVERDUE: Deposit Matured ${Math.abs(daysDiff)} Days Ago`,
          message: `FDR #${fdr.fdrNumber} (₹${(fdr.depositAmount / 100000).toFixed(1)} Lakhs) for ${fdr.institutionName} has exceeded its 10-year term without renewal or AICTE release. Statutory penalty applies.`,
          severity: 'HIGH',
          createdAt: new Date().toISOString(),
          read: false,
          daysRemaining: daysDiff,
          channelsSent: ['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP']
        });
      } else if (daysDiff <= 30) {
        alerts.push({
          id: `ALERT-30D-${fdr.id}`,
          fdrId: fdr.id,
          institutionName: fdr.institutionName,
          type: 'MATURITY_EXPIRY',
          title: `ACTION REQUIRED: Matures in ${daysDiff} Days`,
          message: `FDR #${fdr.fdrNumber} matures on ${fdr.maturityDate}. Institution must submit Renewal FDR or apply for Refund with judicial non-liability affidavit immediately.`,
          severity: 'HIGH',
          createdAt: new Date().toISOString(),
          read: false,
          daysRemaining: daysDiff,
          channelsSent: ['IN_APP', 'EMAIL', 'SMS']
        });
      } else if (daysDiff <= 90) {
        alerts.push({
          id: `ALERT-90D-${fdr.id}`,
          fdrId: fdr.id,
          institutionName: fdr.institutionName,
          type: 'MATURITY_EXPIRY',
          title: `Advance Expiry Warning (${daysDiff} Days)`,
          message: `FDR #${fdr.fdrNumber} scheduled to mature on ${fdr.maturityDate}. Advance notification dispatched to Trust Chairman and Regional Officer.`,
          severity: 'MEDIUM',
          createdAt: new Date().toISOString(),
          read: false,
          daysRemaining: daysDiff,
          channelsSent: ['IN_APP', 'EMAIL']
        });
      }
    }

    // 2. Discrepancy / Forgery Alerts
    if (fdr.isForgedSuspect || (fdr.discrepancies && fdr.discrepancies.some(d => d.severity === 'CRITICAL'))) {
      const critCount = fdr.discrepancies.filter(d => d.severity === 'CRITICAL').length;
      alerts.push({
        id: `ALERT-DISC-${fdr.id}`,
        fdrId: fdr.id,
        institutionName: fdr.institutionName,
        type: 'DISCREPANCY_ALERT',
        title: `INTEGRITY ALERT: ${critCount} Critical Deficiencies Flagged`,
        message: `FDR #${fdr.fdrNumber} failed automated regulatory scrutiny. Detected: ${fdr.discrepancies.map(d => d.ruleTitle).slice(0, 2).join('; ')}. Immediate RO review required.`,
        severity: 'HIGH',
        createdAt: new Date().toISOString(),
        read: false,
        channelsSent: ['IN_APP', 'EMAIL']
      });
    }

    // 3. Refund / Release pending alert
    if (fdr.status === 'RELEASE_REQUESTED' && fdr.releaseRequest?.status === 'PENDING_BUREAU_APPROVAL') {
      alerts.push({
        id: `ALERT-REL-${fdr.id}`,
        fdrId: fdr.id,
        institutionName: fdr.institutionName,
        type: 'REFUND_REQUEST',
        title: `Release Sanction Pending for Bureau Approval`,
        message: `RO has recommended refund of ₹${((fdr.releaseRequest.refundDisbursedAmount || fdr.depositAmount) / 100000).toFixed(1)} Lakhs for ${fdr.institutionName}. Sanction order pending at Central Bureau.`,
        severity: 'MEDIUM',
        createdAt: new Date().toISOString(),
        read: false,
        channelsSent: ['IN_APP', 'EMAIL']
      });
    }
  });

  return alerts;
}
