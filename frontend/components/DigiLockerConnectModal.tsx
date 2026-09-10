import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Lock,
  RefreshCw,
  ShieldCheck,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tokenData: any, docs: any[]) => void;
}

export const DigiLockerConnectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [aadhaarLastFour, setAadhaarLastFour] = useState('8921');
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'auth' | 'fetching' | 'success'>('auth');
  const [fetchedDocs, setFetchedDocs] = useState<any[]>([]);
  const [tokenResult, setTokenResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleAuthenticate = async () => {
    if (!consent) {
      setError(
        'Aadhaar electronic consent is mandated under Information Technology Act 2000 Section 6A.'
      );
      return;
    }
    setError(null);
    setLoading(true);
    setStep('fetching');

    try {
      // Step 1: Obtain mock OAuth Token
      const tokenRes = await fetch('/api/v1/digilocker/oauth/token', {
        body: JSON.stringify({
          aadhaar_last_four: aadhaarLastFour,
          consent: true,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!tokenRes.ok) {
        throw new Error('DigiLocker gateway token generation failed');
      }

      const tokenData = await tokenRes.json();
      setTokenResult(tokenData);

      // Step 2: Fetch verified documents
      const docsRes = await fetch(
        `/api/v1/digilocker/fetch-documents/${tokenData.access_token}`
      );
      const docsData = await docsRes.json();

      setFetchedDocs(docsData.documents || []);
      setStep('success');
      onSuccess(tokenData, docsData.documents || []);
    } catch (err: any) {
      setError(err.message || 'DigiLocker connection failed');
      setStep('auth');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* DigiLocker Header with Indian e-Gov colors */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
              <Lock className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-blue-200 flex items-center gap-1.5">
                <span>Govt of India</span>
                <span>•</span>
                <span>Digital India Initiative</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold">
                DigiLocker Verification Gateway
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

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto touch-scroll flex-1">
          {step === 'auth' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <strong>Instant Tamper-Proof Credential Pull:</strong> Direct DigiLocker authentication eliminates manual certificate tampering, provides root CCA verification, and auto-qualifies the bidder for high-trust scoring.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Signatory Aadhaar (Last 4 Digits)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={4}
                    value={aadhaarLastFour}
                    onChange={(e) =>
                      setAadhaarLastFour(e.target.value.replace(/\D/g, ''))
                    }
                    placeholder="8921"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="absolute right-3 top-2.5 text-xs text-slate-400">
                    XXXX-XXXX-{aadhaarLastFour || '####'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50">
                <input
                  type="checkbox"
                  id="consent-check"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label
                  htmlFor="consent-check"
                  className="text-xs text-slate-600 leading-relaxed cursor-pointer"
                >
                  I grant explicit legal consent under Section 6A of the
                  Information Technology Act, 2000 to CPCL & GeM-Verify to pull
                  digitally signed enterprise certificates from Udyam, CBDT, and
                  GSTN for tender validation.
                </label>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 font-medium">
                  {error}
                </div>
              )}

              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-800 text-center touch-target"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAuthenticate}
                  disabled={loading}
                  className="py-3 sm:py-2.5 px-5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 touch-target"
                >
                  <span>Authenticate via DigiLocker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 'fetching' && (
            <div className="py-10 text-center space-y-4">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Validating Cryptographic Root Certificates...
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Connecting to National DigiLocker API repository and
                  validating SHA-256 hashes against CBDT and Ministry of MSME
                  authorities.
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">
                    DigiLocker Authentication Succeeded
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    Status: <strong>DIGITALLY_SIGNED</strong> | Token:{' '}
                    <span className="font-mono">
                      {tokenResult?.access_token.slice(0, 16)}...
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Retrieved Issuer Documents ({fetchedDocs.length})
                </span>
                <div className="space-y-2">
                  {fetchedDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div className="font-bold text-slate-900">
                            {doc.doc_type}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {doc.doc_id}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Signed & Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
              >
                Apply DigiLocker Proof to Bid
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
