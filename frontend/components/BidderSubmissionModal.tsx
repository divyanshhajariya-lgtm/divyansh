import {
  Building2,
  CheckCircle2,
  FileUp,
  Lock,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { DigiLockerConnectModal } from './DigiLockerConnectModal';

interface Props {
  isOpen: boolean;
  onBidSubmitted: (newBid: any) => void;
  onClose: () => void;
}

export const BidderSubmissionModal: React.FC<Props> = ({
  isOpen,
  onBidSubmitted,
  onClose,
}) => {
  const [bidderName, setBidderName] = useState(
    'Titan Cryogenic Infrastructure Ltd'
  );
  const [legalEntity, setLegalEntity] = useState(
    'Titan Cryogenic Infrastructure Ltd'
  );
  const [gstin, setGstin] = useState('33AABCT9102K1Z6');
  const [pan, setPan] = useState('AABCT9102K');
  const [cin, setCin] = useState('U28112TN2019PLC129841');
  const [enterpriseCategory, setEnterpriseCategory] = useState<
    'Large' | 'Medium' | 'Micro' | 'Small'
  >('Small');
  const [udyamNumber, setUdyamNumber] = useState('UDYAM-TN-02-0054321');
  const [quotedValueINR, setQuotedValueINR] = useState('4780000');
  const [localContentPercent, setLocalContentPercent] = useState('76');
  const [digiLockerAuthenticated, setDigiLockerAuthenticated] = useState(false);
  const [digiLockerTokenData, setDigiLockerTokenData] = useState<any>(null);
  const [showDigiLockerModal, setShowDigiLockerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleDigiLockerSuccess = (tokenData: any) => {
    setDigiLockerAuthenticated(true);
    setDigiLockerTokenData(tokenData);
    setShowDigiLockerModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/bids/submit', {
        body: JSON.stringify({
          bidderName,
          cin,
          digiLockerAadhaarRef: digiLockerTokenData?.aadhaar_last_four
            ? `XXXX-XXXX-${digiLockerTokenData.aadhaar_last_four}`
            : undefined,
          digiLockerAuthenticated,
          enterpriseCategory,
          gstin,
          legalEntity,
          localContentPercent: Number(localContentPercent),
          pan,
          quotedValueINR: Number(quotedValueINR),
          udyamNumber,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!res.ok) throw new Error('Submission failed');
      const data = await res.json();
      onBidSubmitted(data.bid);
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30">
                <FileUp className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <div className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                  GeM Bidder Ingestion Gateway
                </div>
                <h3 className="text-lg font-bold">Submit Tender Bid Package</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Tender context banner */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">
                  Tender ID: GEM/2026/B/891273
                </span>
                <p className="text-[11px] text-slate-500">
                  Procurement of High Pressure Cryogenic Valves - CPCL Manali Refinery
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                MoPNG CPCL
              </span>
            </div>

            {/* DigiLocker Trigger Card */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                digiLockerAuthenticated
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-slate-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      digiLockerAuthenticated
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">
                      {digiLockerAuthenticated
                        ? 'DigiLocker Authenticated (Tamper-Proof)'
                        : 'Authenticate via DigiLocker'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {digiLockerAuthenticated
                        ? 'Digitally signed Udyam & PAN documents verified with CCA root certificate.'
                        : 'Connect via Aadhaar e-Sign to grant maximum trust score & skip manual scans.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDigiLockerModal(true)}
                  className={`px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition cursor-pointer shrink-0 ${
                    digiLockerAuthenticated
                      ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {digiLockerAuthenticated
                    ? 'Verified (Click to Re-connect)'
                    : 'Connect DigiLocker'}
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bidder Name
                </label>
                <input
                  type="text"
                  required
                  value={bidderName}
                  onChange={(e) => setBidderName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  GSTIN (15 Digits)
                </label>
                <input
                  type="text"
                  required
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Permanent Account Number (PAN)
                </label>
                <input
                  type="text"
                  required
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Corporate Identity Number (CIN)
                </label>
                <input
                  type="text"
                  required
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  MSME Enterprise Category
                </label>
                <select
                  value={enterpriseCategory}
                  onChange={(e: any) => setEnterpriseCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Micro">Micro Enterprise (EMD Exempt)</option>
                  <option value="Small">Small Enterprise (EMD Exempt)</option>
                  <option value="Medium">Medium Enterprise (Standard EMD)</option>
                  <option value="Large">Large Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Udyam Registration Number
                </label>
                <input
                  type="text"
                  required
                  value={udyamNumber}
                  onChange={(e) => setUdyamNumber(e.target.value)}
                  placeholder="UDYAM-TN-02-0000000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Quoted Tender Price (INR)
                </label>
                <input
                  type="number"
                  required
                  value={quotedValueINR}
                  onChange={(e) => setQuotedValueINR(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Make in India Local Content (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={localContentPercent}
                  onChange={(e) => setLocalContentPercent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
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
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Ingesting & Verifying...'
                    : 'Ingest Bid & Run AI Verification'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <DigiLockerConnectModal
        isOpen={showDigiLockerModal}
        onClose={() => setShowDigiLockerModal(false)}
        onSuccess={handleDigiLockerSuccess}
      />
    </>
  );
};
