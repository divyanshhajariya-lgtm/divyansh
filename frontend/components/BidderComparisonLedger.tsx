import React from 'react';
import { BidSubmission } from '../types';

interface BidderComparisonLedgerProps {
  bids: BidSubmission[];
  tenderId?: string;
  onInspectBid: (bidId: string) => void;
}

export const BidderComparisonLedger: React.FC<BidderComparisonLedgerProps> = ({
  bids,
  tenderId = 'GEM/2026/B/891273',
  onInspectBid,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Bidder Credential Comparison Ledger
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Summary of all evaluated submissions for Tender {tenderId}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <th className="py-3 px-4">Bidder Name</th>
              <th className="py-3 px-4">GSTIN & PAN</th>
              <th className="py-3 px-4">MSME Tier</th>
              <th className="py-3 px-4">MII Content</th>
              <th className="py-3 px-4">Quote (INR)</th>
              <th className="py-3 px-4 text-center">Score</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bids.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/70 transition">
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  {b.bidderName}
                  <div className="text-[10px] text-slate-400 font-mono">
                    {b.id}
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-600">
                  <div>{b.gstin}</div>
                  <div className="text-slate-400">{b.pan}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-700">
                    {b.enterpriseCategory}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    Udyam Verified
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-slate-800">
                    {b.localContentPercent}%
                  </span>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {b.miiClass.split(' ')[0]}
                  </div>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                  ₹{b.quotedValueINR.toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full font-extrabold text-xs inline-block ${
                      b.riskLevel === 'LOW'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.riskLevel === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {b.complianceScore}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.status === 'QUALIFIED' || b.status === 'AI_RECOMMENDED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'DISQUALIFIED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {b.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onInspectBid(b.id)}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-[11px] font-semibold transition cursor-pointer"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
