import { CheckCircle2 } from 'lucide-react';
import React from 'react';
import { OfficerDecision } from '../types';

interface OfficerDecisionBannerProps {
  decision: OfficerDecision;
}

export const OfficerDecisionBanner: React.FC<OfficerDecisionBannerProps> = ({
  decision,
}) => {
  return (
    <div
      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        decision.action === 'QUALIFY'
          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
          : decision.action === 'DISQUALIFY'
          ? 'bg-rose-50 border-rose-300 text-rose-950'
          : 'bg-amber-50 border-amber-300 text-amber-950'
      }`}
    >
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          <span>Officer Decision Finalized: {decision.action}</span>
        </div>
        <p className="text-xs mt-1 leading-relaxed">
          <strong>Remarks:</strong> {decision.remarks}
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Recorded by {decision.officerName} ({decision.officerDesignation}) at{' '}
          {new Date(decision.timestamp).toLocaleString()}
        </p>
      </div>

      <div className="shrink-0 text-left sm:text-right font-mono text-[11px] text-slate-600 bg-white/70 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto w-full sm:w-auto">
        <span className="text-[10px] uppercase font-bold text-slate-500 block sm:inline">Audit Hash: </span>
        <span className="font-bold break-all">{decision.auditHash.slice(0, 16)}...</span>
      </div>
    </div>
  );
};
