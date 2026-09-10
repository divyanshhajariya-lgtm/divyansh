import { AlertTriangle, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import React from 'react';

interface OfficerActionPanelProps {
  bidderName: string;
  onTriggerAction: (action: 'CLARIFICATION' | 'DISQUALIFY' | 'QUALIFY') => void;
}

export const OfficerActionPanel: React.FC<OfficerActionPanelProps> = ({
  bidderName,
  onTriggerAction,
}) => {
  return (
    <div className="bg-slate-900 rounded-xl p-5 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm sm:text-base">
            Procurement Officer Human-in-the-Loop Decision
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Adjudicate technical eligibility for <strong>{bidderName}</strong> adhering
          to GFR 2017 & CVC guidelines.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          onClick={() => onTriggerAction('QUALIFY')}
          className="px-4 py-2.5 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Approve & Qualify</span>
        </button>

        <button
          onClick={() => onTriggerAction('CLARIFICATION')}
          className="px-4 py-2.5 rounded-lg font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Seek Clarification</span>
        </button>

        <button
          onClick={() => onTriggerAction('DISQUALIFY')}
          className="px-4 py-2.5 rounded-lg font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <XCircle className="w-4 h-4" />
          <span>Reject / Disqualify</span>
        </button>
      </div>
    </div>
  );
};
