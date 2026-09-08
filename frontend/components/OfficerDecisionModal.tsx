import {
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Shield,
  Stamp,
  X,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { BidSubmission } from '../types';

interface Props {
  bid: BidSubmission;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDecision: (
    action: 'CLARIFICATION' | 'DISQUALIFY' | 'QUALIFY',
    remarks: string,
    officerName: string
  ) => Promise<void>;
}

export const OfficerDecisionModal: React.FC<Props> = ({
  bid,
  isOpen,
  onClose,
  onConfirmDecision,
}) => {
  const [selectedAction, setSelectedAction] = useState<
    'CLARIFICATION' | 'DISQUALIFY' | 'QUALIFY'
  >('QUALIFY');
  const [officerName, setOfficerName] = useState('R. Kalyanasundaram');
  const [officerDesignation, setOfficerDesignation] = useState(
    'Chief General Manager (Procurement), CPCL'
  );
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Auto-populate default template based on selected action
  const handleActionSelect = (
    action: 'CLARIFICATION' | 'DISQUALIFY' | 'QUALIFY'
  ) => {
    setSelectedAction(action);
    if (action === 'QUALIFY') {
      setRemarks(
        `Following algorithmic multi-source verification ($S_{comp}=${bid.complianceScore}/100) and review of DigiLocker-authenticated certificates, M/s ${bid.bidderName} satisfies all statutory requirements under GFR 2017 Rule 144, 149 and Public Procurement (Preference to Make in India) Order 2017. Recommended for Price Bid opening.`
      );
    } else if (action === 'DISQUALIFY') {
      setRemarks(
        `Disqualified under GFR 2017 Rule 151 / CGST Act Section 29 due to unresolved statutory defects and invalid eligibility documentation noted in the GeM-Verify audit matrix.`
      );
    } else {
      setRemarks(
        `Clarification sought under GFR 2017 Rule 173(xxiii) regarding parameter discrepancies. Bidder granted 48 hours to upload reconciliation documents via GeM portal.`
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmDecision(selectedAction, remarks, officerName);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Stamp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Human-in-the-Loop Vigilance Oversight
              </div>
              <h3 className="text-lg font-bold">
                Record Procurement Officer Decision
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Action Selector */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
              Decision Action for {bid.bidderName}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleActionSelect('QUALIFY')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition cursor-pointer ${
                  selectedAction === 'QUALIFY'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold">QUALIFY BIDDER</span>
                <span className="text-[10px] text-slate-500">Meets all criteria</span>
              </button>

              <button
                type="button"
                onClick={() => handleActionSelect('CLARIFICATION')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition cursor-pointer ${
                  selectedAction === 'CLARIFICATION'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-bold">CLARIFICATION</span>
                <span className="text-[10px] text-slate-500">48-Hour Notice</span>
              </button>

              <button
                type="button"
                onClick={() => handleActionSelect('DISQUALIFY')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition cursor-pointer ${
                  selectedAction === 'DISQUALIFY'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <XCircle className="w-5 h-5 text-rose-600" />
                <span className="font-bold">DISQUALIFY</span>
                <span className="text-[10px] text-slate-500">
                  Statutory Rejection
                </span>
              </button>
            </div>
          </div>

          {/* Officer credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Authorizing Officer Name
              </label>
              <input
                type="text"
                required
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Designation
              </label>
              <input
                type="text"
                required
                value={officerDesignation}
                onChange={(e) => setOfficerDesignation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Formal Remarks & CVC Reference */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700 uppercase tracking-wider">
                Formal Committee Remarks & Legal Justification
              </label>
              <span className="text-[10px] text-slate-400">
                Recorded into Tamper-Proof Audit Log
              </span>
            </div>
            <textarea
              rows={4}
              required
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Provide detailed legal justification citing GFR 2017, CVC circulars, or technical evaluation criteria..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-sans leading-relaxed"
            />
          </div>

          {/* Immutable Guarantee banner */}
          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-slate-600 flex items-start gap-2 text-[11px]">
            <Shield className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <span>
              This decision will be cryptographically hashed and permanently logged to the CVC-compliant GeM-Verify ledger. The generated SHA-256 block hash will be submitted in the Tender Evaluation Report.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-lg text-white font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                selectedAction === 'QUALIFY'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : selectedAction === 'DISQUALIFY'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Recording Decision...'
                  : `Confirm ${selectedAction}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
