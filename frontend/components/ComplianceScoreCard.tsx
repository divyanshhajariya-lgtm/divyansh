import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import React from 'react';
import { BidSubmission } from '../types';

interface Props {
  bid: BidSubmission;
  isVerifying: boolean;
  onTriggerReverify: () => void;
}

export const ComplianceScoreCard: React.FC<Props> = ({
  bid,
  isVerifying,
  onTriggerReverify,
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW':
        return {
          badge: 'bg-emerald-600 text-white',
          bar: 'bg-emerald-600',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          glow: 'shadow-emerald-100',
          icon: ShieldCheck,
          label: 'LOW RISK (Score >= 85)',
          sub: 'Mandatory statutory requirements met, DigiLocker verified',
        };
      case 'MEDIUM':
        return {
          badge: 'bg-amber-600 text-white',
          bar: 'bg-amber-500',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          glow: 'shadow-amber-100',
          icon: AlertTriangle,
          label: 'MEDIUM RISK (Score 60 - 84)',
          sub: 'Minor mismatches (trade name variance, cleared late remittance)',
        };
      default:
        return {
          badge: 'bg-rose-600 text-white',
          bar: 'bg-rose-600',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          glow: 'shadow-rose-100',
          icon: XCircle,
          label: 'HIGH RISK (Score < 60 or Hard Flags)',
          sub: 'Statutory defects, GST suspended, or debarment inquiry',
        };
    }
  };

  const riskConfig = getRiskColor(bid.riskLevel);
  const Icon = riskConfig.icon;

  return (
    <div
      id="compliance-score-card"
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6 transition-all"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Bidder Compliance Evaluation
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              ID: {bid.id}
            </span>
            {bid.digiLockerAuthenticated && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                DigiLocker Authenticated
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
            {bid.bidderName}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
            <span>
              GSTIN: <strong className="text-slate-700 font-mono">{bid.gstin}</strong>
            </span>
            <span>•</span>
            <span>
              PAN: <strong className="text-slate-700 font-mono">{bid.pan}</strong>
            </span>
            <span>•</span>
            <span>
              Category:{' '}
              <strong className="text-slate-700">{bid.enterpriseCategory} (MSME)</strong>
            </span>
            <span>•</span>
            <span>
              Quote:{' '}
              <strong className="text-slate-800">
                ₹{bid.quotedValueINR.toLocaleString('en-IN')}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="reverify-btn"
            onClick={onTriggerReverify}
            disabled={isVerifying}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles
              className={`w-3.5 h-3.5 text-indigo-600 ${
                isVerifying ? 'animate-spin' : ''
              }`}
            />
            {isVerifying ? 'Re-verifying...' : 'Re-verify Registries'}
          </button>
          <div
            className={`px-3.5 py-1.5 rounded-lg border flex items-center gap-2 ${riskConfig.bg}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wide">
              {bid.riskLevel} RISK
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-5 items-center">
        {/* Score gauge block */}
        <div className="md:col-span-4 bg-gradient-to-br from-slate-50 to-slate-100/70 p-5 rounded-xl border border-slate-200/80 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Dynamic Compliance Score ($S_{'{comp}'}$)
          </div>
          <div className="flex items-baseline justify-center gap-1 my-2">
            <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
              {bid.complianceScore}
            </span>
            <span className="text-lg font-bold text-slate-400">/ 100</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden my-2">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ${riskConfig.bar}`}
              style={{
                width: `${Math.min(100, Math.max(0, bid.complianceScore))}%`,
              }}
            />
          </div>
          <p className="text-xs font-medium text-slate-600 mt-2">
            {riskConfig.sub}
          </p>
        </div>

        {/* Breakdown formula & Status */}
        <div className="md:col-span-8 flex flex-col justify-between h-full space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">
                AI Recommendation
              </span>
              <span
                className={`text-xs font-bold mt-0.5 inline-block ${
                  bid.status === 'AI_RECOMMENDED' || bid.status === 'QUALIFIED'
                    ? 'text-emerald-700'
                    : bid.status === 'DISQUALIFIED'
                    ? 'text-rose-700'
                    : 'text-amber-700'
                }`}
              >
                {bid.status.replace('_', ' ')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">
                Make in India Tier
              </span>
              <span
                className="text-xs font-bold text-slate-800 mt-0.5 block truncate"
                title={bid.miiClass}
              >
                {bid.localContentPercent}% ({bid.miiClass.split(' ')[0]})
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 block">
                CVC & GFR Integrity
              </span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                {bid.parameters.find((p) => p.domain === 'Integrity Checks')
                  ?.statusLabel || 'Clean Record'}
              </span>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2.5">
            <Award className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Procurement Scoring Formula: </span>
              <span className="font-mono text-blue-800">S_comp = Σ (W_i × C_i)</span>
              <span className="text-blue-700 block mt-0.5">
                Weighted index covers Statutory Tax (20%), MSME/Udyam (20%),
                DigiLocker Proof (15%), Make in India (15%), Debarment Cleanliness
                (15%), and Social Security (15%).
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
