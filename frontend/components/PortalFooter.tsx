import { Shield } from 'lucide-react';
import React from 'react';

export const PortalFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6 mt-12 pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <Shield className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold text-slate-200">
            GeM-Verify Compliance Platform
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="text-[11px] text-slate-400">SIH 2026 (Problem Statement 26100)</span>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4 text-[11px] text-slate-400">
          <span>MoPNG</span>
          <span>•</span>
          <span>CPCL Manali</span>
          <span>•</span>
          <span>CVC Guidelines</span>
        </div>
      </div>
    </footer>
  );
};
