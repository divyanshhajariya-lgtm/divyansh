import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Hash,
  Info,
  Shield,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { ParameterVerification } from '../types';

interface Props {
  bidderName: string;
  parameters: ParameterVerification[];
}

export const DocumentMismatchTable: React.FC<Props> = ({
  parameters,
}) => {
  const [activeDomainFilter, setActiveDomainFilter] = useState<string>('ALL');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const domains = [
    'ALL',
    'Identity & Tax',
    'Enterprise Category',
    'Direct Verification',
    'Policy Compliance',
    'Integrity Checks',
    'Social Security',
  ];

  const filteredParams =
    activeDomainFilter === 'ALL'
      ? parameters
      : parameters.filter((p) => p.domain === activeDomainFilter);

  const getStatusBadge = (status: ParameterVerification['status']) => {
    switch (status) {
      case 'CLEAN':
      case 'COMPLIANT':
      case 'VALID':
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified Match
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Discrepancy / Gap
          </span>
        );
      case 'FAILED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Defect / Failed
          </span>
        );
    }
  };

  return (
    <div
      id="document-mismatch-table-container"
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Side-by-Side Multi-Source Verification Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated cross-check comparing bidder-uploaded artifacts against live Government registries & DigiLocker.
          </p>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setActiveDomainFilter(dom)}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
                activeDomainFilter === dom
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dom === 'ALL' ? 'All Checks' : dom}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4 w-1/4">Parameter & Domain</th>
              <th className="py-3 px-4 w-1/3">
                Official Portal Live Data (Source)
              </th>
              <th className="py-3 px-4 w-1/4">
                Bidder Submission (OCR Extracted)
              </th>
              <th className="py-3 px-4 text-center">Status & Weight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredParams.map((param) => {
              const isExpanded = expandedRow === param.id;
              return (
                <React.Fragment key={param.id}>
                  <tr
                    className={`hover:bg-slate-50/60 transition cursor-pointer ${
                      param.status === 'FAILED'
                        ? 'bg-rose-50/20'
                        : param.status === 'WARNING'
                        ? 'bg-amber-50/20'
                        : ''
                    }`}
                    onClick={() => setExpandedRow(isExpanded ? null : param.id)}
                  >
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-900">
                        {param.parameter}
                      </div>
                      <div className="text-[11px] text-indigo-600 font-medium mt-0.5 flex items-center gap-1">
                        <span>{param.domain}</span>
                        {param.digiLockerSigned && (
                          <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200">
                            DigiLocker Signed
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="text-slate-800 font-medium leading-relaxed">
                        {param.portalData}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                        Source:{' '}
                        <span className="font-semibold text-slate-600">
                          {param.portalSource}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="text-slate-800 leading-relaxed">
                        {param.bidderUploadData}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
                        <FileText className="w-3 h-3 text-slate-400" />
                        {param.bidderDocName}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top text-center">
                      <div className="flex flex-col items-center gap-1">
                        {getStatusBadge(param.status)}
                        <span className="text-[10px] text-slate-400 font-mono">
                          W: {(param.weight * 100).toFixed(0)}% | C:{' '}
                          {param.score.toFixed(1)}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Discrepancy Note & Hash Drawer if present */}
                  {(param.discrepancyNote || param.sha256Hash || isExpanded) && (
                    <tr className="bg-slate-50/50">
                      <td
                        colSpan={4}
                        className="px-4 py-2.5 border-t border-slate-100 text-[11px]"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {param.discrepancyNote ? (
                            <div className="flex items-start gap-1.5 text-amber-900 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
                              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span>
                                <strong>Procurement Audit Note:</strong>{' '}
                                {param.discrepancyNote}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-500">
                              No discrepancies detected across statutory fields.
                            </span>
                          )}

                          {param.sha256Hash && (
                            <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                              <Hash className="w-3 h-3 text-slate-400" />
                              <span>
                                SHA-256: {param.sha256Hash.slice(0, 18)}...
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
