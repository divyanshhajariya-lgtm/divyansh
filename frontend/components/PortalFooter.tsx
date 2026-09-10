import { Shield } from 'lucide-react';
import React from 'react';

export const PortalFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-200">
            GeM-Verify Compliance Platform
          </span>
          <span>•</span>
          <span>Smart India Hackathon 2026 (Problem Statement 26100)</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>Ministry of Petroleum & Natural Gas</span>
          <span>•</span>
          <span>CPCL Manali Refinery</span>
          <span>•</span>
          <span>Central Vigilance Commission (CVC)</span>
        </div>
      </div>
    </footer>
  );
};
