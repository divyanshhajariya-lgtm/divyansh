import {
  BarChart3,
  Bot,
  Boxes,
  ScrollText,
  ShieldCheck,
} from 'lucide-react';
import React from 'react';
import { PortalTab } from './PortalHeader';

interface MobileBottomNavProps {
  activeTab: PortalTab;
  onTabChange: (tab: PortalTab) => void;
  bidsCount: number;
  auditLogsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  bidsCount,
  auditLogsCount,
}) => {
  const tabs: {
    badge?: number;
    icon: React.ElementType;
    id: PortalTab;
    label: string;
  }[] = [
    {
      icon: ShieldCheck,
      id: 'officer-dashboard',
      label: 'Officer',
    },
    {
      badge: bidsCount,
      icon: BarChart3,
      id: 'comparison',
      label: 'Bids & Risk',
    },
    {
      icon: Bot,
      id: 'copilot',
      label: 'AI Copilot',
    },
    {
      badge: auditLogsCount,
      icon: ScrollText,
      id: 'audit',
      label: 'CVC Audit',
    },
    {
      icon: Boxes,
      id: 'readme-3d',
      label: '3D Spec',
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 pb-safe shadow-2xl"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center h-full relative cursor-pointer transition-colors active:scale-95 touch-target ${
                isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 text-indigo-400' : 'text-slate-400'
                  }`}
                />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 bg-indigo-600 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-semibold tracking-tight ${
                  isActive ? 'text-white font-bold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
