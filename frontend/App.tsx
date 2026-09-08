import {
  AlertTriangle,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Lock,
  PlusCircle,
  ScrollText,
  Shield,
  ShieldCheck,
  Sparkles,
  Users2,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AuditTrailLogs } from './components/AuditTrailLogs';
import { BidderSubmissionModal } from './components/BidderSubmissionModal';
import { ComplianceScoreCard } from './components/ComplianceScoreCard';
import { DigiLockerConnectModal } from './components/DigiLockerConnectModal';
import { DocumentMismatchTable } from './components/DocumentMismatchTable';
import { GeminiCopilotPanel } from './components/GeminiCopilotPanel';
import { OfficerDecisionModal } from './components/OfficerDecisionModal';
import { RiskAnalyticsCharts } from './components/RiskAnalyticsCharts';
import { TasksAndContactsModal } from './components/TasksAndContactsModal';
import {
  AuditLogEntry,
  BidSubmission,
  OfficerContact,
  OfficerTask,
} from './types';

export default function App() {
  const [bids, setBids] = useState<BidSubmission[]>([]);
  const [selectedBidId, setSelectedBidId] = useState<string>('BID-2026-001');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [tasks, setTasks] = useState<OfficerTask[]>([]);
  const [contacts, setContacts] = useState<OfficerContact[]>([]);
  const [activeTab, setActiveTab] = useState<
    'audit' | 'comparison' | 'copilot' | 'officer-dashboard' | 'tasks'
  >('officer-dashboard');

  // Modals state
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [showDigiLockerModal, setShowDigiLockerModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [bidsRes, logsRes, tasksRes, contactsRes] = await Promise.all([
        fetch('/api/v1/bids'),
        fetch('/api/v1/audit-logs'),
        fetch('/api/v1/tasks'),
        fetch('/api/v1/contacts'),
      ]);

      const bidsData = await bidsRes.json();
      const logsData = await logsRes.json();
      const tasksData = await tasksRes.json();
      const contactsData = await contactsRes.json();

      setBids(bidsData.bids || []);
      setAuditLogs(logsData.logs || []);
      setTasks(tasksData.tasks || []);
      setContacts(contactsData.contacts || []);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeBid = bids.find((b) => b.id === selectedBidId) || bids[0];

  const handleTriggerReverify = async () => {
    if (!activeBid) return;
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/v1/verify/${activeBid.id}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.bid) {
        setBids((prev) =>
          prev.map((b) => (b.id === data.bid.id ? data.bid : b))
        );
        // Refresh audit logs
        const logsRes = await fetch('/api/v1/audit-logs');
        const logsData = await logsRes.json();
        setAuditLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error('Re-verification failed:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirmDecision = async (
    action: 'CLARIFICATION' | 'DISQUALIFY' | 'QUALIFY',
    remarks: string,
    officerName: string
  ) => {
    if (!activeBid) return;
    try {
      const res = await fetch(`/api/v1/decision/${activeBid.id}`, {
        body: JSON.stringify({
          action,
          officerDesignation: 'Chief General Manager (Procurement), CPCL',
          officerName,
          remarks,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const data = await res.json();
      if (data.bid) {
        setBids((prev) =>
          prev.map((b) => (b.id === data.bid.id ? data.bid : b))
        );
        const logsRes = await fetch('/api/v1/audit-logs');
        const logsData = await logsRes.json();
        setAuditLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error('Decision record failed:', err);
    }
  };

  const handleBidSubmitted = (newBid: BidSubmission) => {
    setBids((prev) => [newBid, ...prev]);
    setSelectedBidId(newBid.id);
    setActiveTab('officer-dashboard');
    fetch('/api/v1/audit-logs')
      .then((r) => r.json())
      .then((d) => setAuditLogs(d.logs || []));
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed } : t))
    );
    await fetch(`/api/v1/tasks/${taskId}`, {
      body: JSON.stringify({ completed }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });
  };

  const handleAddTask = async (taskData: Partial<OfficerTask>) => {
    const res = await fetch('/api/v1/tasks', {
      body: JSON.stringify(taskData),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    const data = await res.json();
    if (data.task) setTasks((prev) => [data.task, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold">Initializing GeM-Verify Engine...</h2>
        <p className="text-xs text-slate-400 mt-1">
          Connecting to DigiLocker, GSTN & Central Debarment Registries
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased">
      {/* Top National Portal Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo & Hackathon branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-sm">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                    GeM-Verify
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-600 text-white">
                      SIH 2026 #26100
                    </span>
                  </h1>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                  Ministry of Petroleum & Natural Gas • Chennai Petroleum
                  Corporation Limited (CPCL)
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowDigiLockerModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-400/40 bg-blue-900/30 text-blue-200 hover:bg-blue-900/50 text-xs font-semibold transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>DigiLocker Auth</span>
              </button>

              <button
                onClick={() => setShowSubmissionModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Ingest Bid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Tender Sub-bar */}
        <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">
                ACTIVE TENDER
              </span>
              <strong className="text-slate-200 font-mono">
                GEM/2026/B/891273
              </strong>
              <span className="hidden md:inline">
                • Procurement of High Pressure Cryogenic Valves & Fittings (CPCL
                Manali Refinery)
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono shrink-0">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                8 Govt Registries Live
              </span>
              <span>GFR 2017 & CVC Audited</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto text-xs font-medium border-t border-slate-800">
          <button
            onClick={() => setActiveTab('officer-dashboard')}
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
            onClick={() => setActiveTab('comparison')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'comparison'
                ? 'border-indigo-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Risk Distribution & Bids ({bids.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
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
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'audit'
                ? 'border-indigo-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ScrollText className="w-4 h-4" />
            <span>CVC Audit Trail ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'tasks'
                ? 'border-indigo-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users2 className="w-4 h-4" />
            <span>
              Tasks & Directory ({tasks.filter((t) => !t.completed).length})
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: Officer Decision Support Dashboard */}
        {activeTab === 'officer-dashboard' && (
          <div className="space-y-6">
            {/* Bidder Selector Carousel */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                <span>
                  Select Bidder to Inspect ({bids.length} Submissions)
                </span>
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
                      onClick={() => setSelectedBidId(b.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600/30'
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

            {/* Bidder Compliance Score Card */}
            {activeBid && (
              <ComplianceScoreCard
                bid={activeBid}
                isVerifying={isVerifying}
                onTriggerReverify={handleTriggerReverify}
              />
            )}

            {/* Officer Decision Status Banner (If already decided) */}
            {activeBid?.officerDecision && (
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  activeBid.officerDecision.action === 'QUALIFY'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : activeBid.officerDecision.action === 'DISQUALIFY'
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      Officer Decision Finalized:{' '}
                      {activeBid.officerDecision.action}
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed">
                    <strong>Remarks:</strong>{' '}
                    {activeBid.officerDecision.remarks}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Recorded by {activeBid.officerDecision.officerName} (
                    {activeBid.officerDecision.officerDesignation}) at{' '}
                    {new Date(
                      activeBid.officerDecision.timestamp
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="shrink-0 text-right font-mono text-[11px] text-slate-600 bg-white/70 px-3 py-1.5 rounded-lg border border-slate-200">
                  <span>Audit Hash:</span>
                  <div className="font-bold">
                    {activeBid.officerDecision.auditHash.slice(0, 16)}...
                  </div>
                </div>
              </div>
            )}

            {/* Side-by-Side Multi-Source Verification Matrix */}
            {activeBid && (
              <DocumentMismatchTable
                bidderName={activeBid.bidderName}
                parameters={activeBid.parameters}
              />
            )}

            {/* Section 8: OFFICER DECISION ACTIONS (STICKY BOTTOM / ACTION PANEL) */}
            <div className="bg-slate-900 rounded-xl p-5 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-sm sm:text-base">
                    Procurement Officer Human-in-the-Loop Decision
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjudicate technical eligibility for{' '}
                  <strong>{activeBid.bidderName}</strong> adhering to GFR 2017 &
                  CVC guidelines.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => setShowDecisionModal(true)}
                  className="px-4 py-2.5 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Qualify</span>
                </button>

                <button
                  onClick={() => setShowDecisionModal(true)}
                  className="px-4 py-2.5 rounded-lg font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Seek Clarification</span>
                </button>

                <button
                  onClick={() => setShowDecisionModal(true)}
                  className="px-4 py-2.5 rounded-lg font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject / Disqualify</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Risk Distribution & Tender Comparison */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <RiskAnalyticsCharts bids={bids} />

            {/* Bidders Comparative Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Bidder Credential Comparison Ledger
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Summary of all evaluated submissions for Tender
                    GEM/2026/B/891273
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
                      <tr
                        key={b.id}
                        className="hover:bg-slate-50/70 transition"
                      >
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
                              b.status === 'QUALIFIED' ||
                              b.status === 'AI_RECOMMENDED'
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
                            onClick={() => {
                              setSelectedBidId(b.id);
                              setActiveTab('officer-dashboard');
                            }}
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
          </div>
        )}

        {/* TAB 3: AI Vigilance Copilot & Deep Reasoning */}
        {activeTab === 'copilot' && (
          <GeminiCopilotPanel activeBid={activeBid} />
        )}

        {/* TAB 4: CVC & GFR Immutable Audit Trail */}
        {activeTab === 'audit' && <AuditTrailLogs logs={auditLogs} />}

        {/* TAB 5: Committee Tasks & Nodal Directory */}
        {activeTab === 'tasks' && (
          <TasksAndContactsModal
            contacts={contacts}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            tasks={tasks}
          />
        )}
      </main>

      {/* Footer */}
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

      {/* Modals */}
      {activeBid && (
        <OfficerDecisionModal
          bid={activeBid}
          isOpen={showDecisionModal}
          onClose={() => setShowDecisionModal(false)}
          onConfirmDecision={handleConfirmDecision}
        />
      )}

      <DigiLockerConnectModal
        isOpen={showDigiLockerModal}
        onClose={() => setShowDigiLockerModal(false)}
        onSuccess={(tokenData, docs) => {
          // If active bid isn't digilocker verified, we can mark it
          if (activeBid && !activeBid.digiLockerAuthenticated) {
            setBids((prev) =>
              prev.map((b) =>
                b.id === activeBid.id
                  ? {
                      ...b,
                      complianceScore: Math.min(100, b.complianceScore + 10),
                      digiLockerAadhaarRef: 'XXXX-XXXX-8921',
                      digiLockerAuthenticated: true,
                    }
                  : b
              )
            );
          }
          setShowDigiLockerModal(false);
        }}
      />

      <BidderSubmissionModal
        isOpen={showSubmissionModal}
        onBidSubmitted={handleBidSubmitted}
        onClose={() => setShowSubmissionModal(false)}
      />
    </div>
  );
}
