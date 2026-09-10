import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Shield,
  UserCheck,
} from 'lucide-react';
import React, { useState } from 'react';
import { AuditLogEntry } from '../types';

interface AuditTrailLogsProps {
  logs: AuditLogEntry[];
}

export const AuditTrailLogs: React.FC<AuditTrailLogsProps> = ({ logs }) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredLogs = logs.filter((l) => {
    if (filterAction === 'ALL') return true;
    return l.actionType === filterAction;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const exportAuditJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `GeM_Vigilance_Audit_Ledger_${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getActionBadge = (type: AuditLogEntry['actionType']) => {
    switch (type) {
      case 'ANOMALY_DETECTED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Anomaly Flagged
          </span>
        );
      case 'DECISION_FINALIZED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> Decision Finalized
          </span>
        );
      case 'DIGILOCKER_AUTH':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <Shield className="w-3 h-3" /> DigiLocker Auth
          </span>
        );
      case 'INGESTION':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
            <FileText className="w-3 h-3" /> Ingestion
          </span>
        );
      case 'OFFICER_OVERRIDE':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Officer Override
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Registry Cross-Check
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 md:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            Immutable Audit Trail & Vigilance Verification Ledger
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Adhering to Central Vigilance Commission (CVC) Circular #05/04/21 and General Financial Rules (GFR 2017).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2.5 sm:py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs font-medium text-slate-700 focus:outline-none touch-target"
          >
            <option value="ALL">All Actions</option>
            <option value="INGESTION">Ingestion</option>
            <option value="DIGILOCKER_AUTH">DigiLocker Auth</option>
            <option value="API_CROSS_VERIFY">Registry Verify</option>
            <option value="ANOMALY_DETECTED">Anomaly Detected</option>
            <option value="DECISION_FINALIZED">Decision Finalized</option>
          </select>

          <button
            onClick={exportAuditJSON}
            className="px-3 py-2.5 sm:py-1.5 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer touch-target"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Ledger</span>
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {filteredLogs.map((log) => (
          <div key={log.id} className="p-4 md:p-5 hover:bg-slate-50/70 transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Block #{log.blockHeight}
                </span>
                {getActionBadge(log.actionType)}
                <span className="text-slate-500 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  {log.actor}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <Clock className="w-3 h-3" />
                <span>{new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
              </div>
            </div>

            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {log.description}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-3 text-[11px] text-slate-500">
              <div className="md:col-span-4">
                <span className="font-semibold text-slate-700">Target Bid:</span>{' '}
                <span className="font-mono text-indigo-700">{log.targetBidId}</span>
              </div>

              <div className="md:col-span-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[10px]">
                <div className="truncate max-w-xs md:max-w-md">
                  <span className="text-slate-400">Current Hash:</span>{' '}
                  <span
                    onClick={() => handleCopyHash(log.currentHash)}
                    className="cursor-pointer hover:text-indigo-600 underline font-semibold text-slate-700"
                    title="Click to copy full SHA-256 hash"
                  >
                    {log.currentHash.slice(0, 24)}...
                  </span>
                  {copiedHash === log.currentHash && (
                    <span className="ml-1 text-emerald-600 font-bold">Copied!</span>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {log.cvcRuleRef}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
