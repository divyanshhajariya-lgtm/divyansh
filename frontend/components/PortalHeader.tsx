import {
  BarChart3,
  Bot,
  Boxes,
  Lock,
  PlusCircle,
  ScrollText,
  Shield,
  ShieldCheck,
  Users2,
} from 'lucide-react';
import React from 'react';

export type PortalTab =
  | 'audit'
  | 'comparison'
  | 'copilot'
  | 'officer-dashboard'
  | 'readme-3d'
  | 'tasks';

interface PortalHeaderProps {
  activeTab: PortalTab;
  onTabChange: (tab: PortalTab) => void;
  bidsCount: number;
  auditLogsCount: number;
  uncompletedTasksCount: number;
  onOpenDigiLocker: () => void;
  onOpenIngestBid: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  activeTab,
  onTabChange,
  bidsCount,
  auditLogsCount,
  uncompletedTasksCount,
  onOpenDigiLocker,
  onOpenIngestBid,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md pt-safe">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Logo & Hackathon branding */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-sm shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-extrabold text-sm sm:text-lg tracking-tight text-white flex items-center gap-1.5 shrink-0">
                  GeM-Verify
                </h1>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-600 text-white truncate">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[170px] xs:max-w-xs sm:max-w-md">
                Ministry of Petroleum & Natural Gas • CPCL
              </p>
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => onTabChange('readme-3d')}
              title="3D Technical Architecture & Spec"
              aria-label="3D Architecture"
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-purple-400/40 bg-purple-900/30 text-purple-200 hover:bg-purple-900/50 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 touch-target justify-center"
            >
              <Boxes className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-purple-400 shrink-0" />
              <span className="hidden sm:inline">3D Architecture</span>
            </button>

            <button
              onClick={onOpenDigiLocker}
              title="DigiLocker Direct Authentication"
              aria-label="DigiLocker Auth"
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-blue-400/40 bg-blue-900/30 text-blue-200 hover:bg-blue-900/50 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 touch-target justify-center"
            >
              <Lock className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
              <span className="hidden sm:inline">DigiLocker</span>
            </button>

            <button
              onClick={onOpenIngestBid}
              title="Ingest New Bidder Submission"
              aria-label="Ingest Bid"
              className="px-2.5 py-2 sm:px-3.5 sm:py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5 touch-target justify-center"
            >
              <PlusCircle className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="text-xs">Ingest Bid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Tender Sub-bar */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 text-[11px] sm:text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col xs:flex-row xs:items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[9px] sm:text-[10px] shrink-0">
              ACTIVE
            </span>
            <strong className="text-slate-200 font-mono text-[11px] sm:text-xs shrink-0">
              GEM/2026/B/891273
            </strong>
            <span className="hidden md:inline truncate text-slate-400">
              • Cryogenic Valves & Fittings (CPCL Manali Refinery)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono shrink-0 justify-between xs:justify-end">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
              8 Registries Live
            </span>
            <span className="text-slate-400">GFR 2017 Audited</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Visible on tablet/desktop, smooth horizontal scroll on mobile */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto touch-scroll text-xs font-medium border-t border-slate-800 scrollbar-none">
        <button
          onClick={() => onTabChange('officer-dashboard')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'officer-dashboard'
              ? 'border-indigo-500 text-white font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Officer Decision Portal</span>
        </button>

        <button
          onClick={() => onTabChange('comparison')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'comparison'
              ? 'border-indigo-500 text-white font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Risk Distribution & Bids ({bidsCount})</span>
        </button>

        <button
          onClick={() => onTabChange('copilot')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'copilot'
              ? 'border-indigo-500 text-white font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 text-indigo-400" />
          <span>AI Vigilance Copilot</span>
        </button>

        <button
          onClick={() => onTabChange('audit')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'audit'
              ? 'border-indigo-500 text-white font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ScrollText className="w-4 h-4" />
          <span>CVC Audit Trail ({auditLogsCount})</span>
        </button>

        <button
          onClick={() => onTabChange('tasks')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'tasks'
              ? 'border-indigo-500 text-white font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span>Tasks & Directory ({uncompletedTasksCount})</span>
        </button>

        <button
          onClick={() => onTabChange('readme-3d')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'readme-3d'
              ? 'border-indigo-500 text-white font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Boxes className="w-4 h-4 text-amber-400" />
          <span>3D System Spec & "Why We Use"</span>
        </button>
      </div>
    </header>
  );
};
