import React from 'react';
import { BidSubmission } from '../types';

interface BidderSelectorCarouselProps {
  bids: BidSubmission[];
  selectedBidId: string;
  onSelectBid: (bidId: string) => void;
}

export const BidderSelectorCarousel: React.FC<BidderSelectorCarouselProps> = ({
  bids,
  selectedBidId,
  onSelectBid,
}) => {
  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
        <span>Select Bidder to Inspect ({bids.length} Submissions)</span>
        <span className="text-[11px] text-indigo-600 font-medium">
          Click to switch bidder view
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {bids.map((b) => {
          const isSelected = b.id === selectedBidId;
          return (
            <div
              key={b.id}
              onClick={() => onSelectBid(b.id)}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between gap-3 active:scale-[0.98] select-none touch-target ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="truncate">
                <div className="font-bold text-slate-900 truncate">
                  {b.bidderName}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  GSTIN: {b.gstin.slice(0, 8)}... • ₹
                  {(b.quotedValueINR / 100000).toFixed(1)}L
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    b.riskLevel === 'LOW'
                      ? 'bg-emerald-100 text-emerald-800'
                      : b.riskLevel === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {b.complianceScore}/100
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                  {b.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
