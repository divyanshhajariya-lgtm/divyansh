import React, { useEffect, useState } from 'react';
import {
  AuditTrailLogs,
  BidderComparisonLedger,
  BidderSelectorCarousel,
  BidderSubmissionModal,
  ComplianceScoreCard,
  DigiLockerConnectModal,
  DocumentMismatchTable,
  GeminiCopilotPanel,
  LoadingScreen,
  OfficerActionPanel,
  OfficerDecisionBanner,
  OfficerDecisionModal,
  PortalFooter,
  PortalHeader,
  RiskAnalyticsCharts,
  TasksAndContactsModal,
  ThreeDReadme,
} from './components';
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
    | 'audit'
    | 'comparison'
    | 'copilot'
    | 'officer-dashboard'
    | 'readme-3d'
    | 'tasks'
  >('officer-dashboard');

  // Modals state
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionInitialAction, setDecisionInitialAction] = useState<
    'CLARIFICATION' | 'DISQUALIFY' | 'QUALIFY'
  >('QUALIFY');
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
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased">
      {/* Top Portal Header & Navigation */}
      <PortalHeader
        activeTab={activeTab}
        auditLogsCount={auditLogs.length}
        bidsCount={bids.length}
        onOpenDigiLocker={() => setShowDigiLockerModal(true)}
        onOpenIngestBid={() => setShowSubmissionModal(true)}
        onTabChange={setActiveTab}
        uncompletedTasksCount={tasks.filter((t) => !t.completed).length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: Officer Decision Support Dashboard */}
        {activeTab === 'officer-dashboard' && (
          <div className="space-y-6">
            {/* Bidder Selector Carousel */}
            <BidderSelectorCarousel
              bids={bids}
              onSelectBid={setSelectedBidId}
              selectedBidId={selectedBidId}
            />

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
              <OfficerDecisionBanner decision={activeBid.officerDecision} />
            )}

            {/* Side-by-Side Multi-Source Verification Matrix */}
            {activeBid && (
              <DocumentMismatchTable
                bidderName={activeBid.bidderName}
                parameters={activeBid.parameters}
              />
            )}

            {/* Officer Human-in-the-Loop Decision Actions Panel */}
            {activeBid && (
              <OfficerActionPanel
                bidderName={activeBid.bidderName}
                onTriggerAction={(action) => {
                  setDecisionInitialAction(action);
                  setShowDecisionModal(true);
                }}
              />
            )}
          </div>
        )}

        {/* TAB 2: Risk Distribution & Tender Comparison */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <RiskAnalyticsCharts bids={bids} />
            <BidderComparisonLedger
              bids={bids}
              onInspectBid={(bidId) => {
                setSelectedBidId(bidId);
                setActiveTab('officer-dashboard');
              }}
            />
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

        {/* TAB 6: 3D README & Tech Stack Justifications */}
        {activeTab === 'readme-3d' && <ThreeDReadme />}
      </main>

      {/* Footer */}
      <PortalFooter />

      {/* Modals */}
      {activeBid && (
        <OfficerDecisionModal
          bid={activeBid}
          initialAction={decisionInitialAction}
          isOpen={showDecisionModal}
          onClose={() => setShowDecisionModal(false)}
          onConfirmDecision={handleConfirmDecision}
        />
      )}

      <DigiLockerConnectModal
        isOpen={showDigiLockerModal}
        onClose={() => setShowDigiLockerModal(false)}
        onSuccess={(_tokenData, _docs) => {
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
