import {
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Shield,
  Stamp,
  X,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
  initialAction?: 'CLARIFICATION' | 'DISQUALIFY' | 'QUALIFY';
}

export const OfficerDecisionModal: React.FC<Props> = ({
  bid,
  isOpen,
  onClose,
  onConfirmDecision,
  initialAction = 'QUALIFY',
}) => {
  const [selectedAction, setSelectedAction] = useState<
    'CLARIFICATION' | 'DISQUALIFY' | 'QUALIFY'
  >(initialAction);
  const [officerName, setOfficerName] = useState('R. Kalyanasundaram');
  const [officerDesignation, setOfficerDesignation] = useState(
    'Chief General Manager (Procurement), CPCL'
  );
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Sync initial action and remarks on open
  useEffect(() => {
    if (isOpen) {
      const actionToSet: 'CLARIFICATION' | 'DISQUALIFY' | 'QUALIFY' =
        initialAction === 'DISQUALIFY' || initialAction === 'CLARIFICATION'
          ? initialAction
          : 'QUALIFY';
      handleActionSelect(actionToSet);
    }
  }, [isOpen, initialAction, bid.id]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
              <Stamp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-slate-400">
                Human-in-the-Loop Vigilance Oversight
              </div>
              <h3 className="text-base sm:text-lg font-bold">
                Record Procurement Officer Decision
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition cursor-pointer touch-target"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 text-xs overflow-y-auto touch-scroll flex-1">
          {/* Action Selector */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
              Decision Action for {bid.bidderName}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => handleActionSelect('QUALIFY')}
                className={`p-3 rounded-xl border flex sm:flex-col items-center justify-start sm:justify-center text-left sm:text-center gap-2.5 sm:gap-1.5 transition cursor-pointer touch-target ${
                  selectedAction === 'QUALIFY'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">QUALIFY BIDDER</span>
                  <span className="text-[10px] text-slate-500 block">Meets all criteria</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleActionSelect('CLARIFICATION')}
                className={`p-3 rounded-xl border flex sm:flex-col items-center justify-start sm:justify-center text-left sm:text-center gap-2.5 sm:gap-1.5 transition cursor-pointer touch-target ${
                  selectedAction === 'CLARIFICATION'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold block">CLARIFICATION</span>
                  <span className="text-[10px] text-slate-500 block">48-Hour Notice</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleActionSelect('DISQUALIFY')}
                className={`p-3 rounded-xl border flex sm:flex-col items-center justify-start sm:justify-center text-left sm:text-center gap-2.5 sm:gap-1.5 transition cursor-pointer touch-target ${
                  selectedAction === 'DISQUALIFY'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <span className="font-bold block">DISQUALIFY</span>
                  <span className="text-[10px] text-slate-500 block">
                    Statutory Rejection
                  </span>
                </div>
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
                className="w-full px-3.5 py-2.5 sm:py-2 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium touch-target"
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
                className="w-full px-3.5 py-2.5 sm:py-2 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium touch-target"
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
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-sans leading-relaxed touch-target"
            />
          </div>

          {/* Immutable Guarantee banner */}
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 flex items-start gap-2 text-[11px]">
            <Shield className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <span>
              This decision will be cryptographically hashed and permanently logged to the CVC-compliant GeM-Verify ledger. The generated SHA-256 block hash will be submitted in the Tender Evaluation Report.
            </span>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 font-semibold text-slate-600 hover:text-slate-800 cursor-pointer text-center touch-target"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-3 sm:py-2.5 px-5 rounded-xl text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 touch-target active:scale-98 ${
                selectedAction === 'QUALIFY'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : selectedAction === 'DISQUALIFY'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              <FileCheck className="w-4 h-4 shrink-0" />
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
