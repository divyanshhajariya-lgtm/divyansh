import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Globe,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { BidSubmission, ChatMessage } from '../types';

interface Props {
  activeBid: BidSubmission;
}

export const GeminiCopilotPanel: React.FC<Props> = ({ activeBid }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      content: `Greetings Officer. I am your **GeM-Verify Vigilance Copilot** for Tender **${activeBid.tenderId}** (CPCL Manali Refinery).\n\nActive Bidder under review: **${activeBid.bidderName}**\n- **Score:** ${activeBid.complianceScore}/100 (${activeBid.riskLevel} Risk)\n- **DigiLocker Status:** ${activeBid.digiLockerAuthenticated ? 'Verified ✅' : 'Unsigned ⚠️'}\n- **Make in India:** ${activeBid.localContentPercent}% (${activeBid.miiClass})\n\nYou can ask me to draft formal clarification notices, verify CVC procurement clauses, or run deep reasoning on potential shell company indicators.`,
      id: 'init-1',
      modelUsed: 'GeM Procurement Core',
      role: 'assistant',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [aiMode, setAiMode] = useState<
    'fast-scan' | 'grounded-search' | 'pro-thinking'
  >('pro-thinking');
  const [deepAnalysis, setDeepAnalysis] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      content: text,
      id: `usr-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsSending(true);

    try {
      const history = messages.map((m) => ({
        content: m.content,
        role: m.role as 'assistant' | 'user',
      }));

      const res = await fetch('/api/v1/gemini/chat', {
        body: JSON.stringify({
          bidId: activeBid.id,
          history,
          message: text,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        content: data.response || 'No response returned.',
        id: `bot-${Date.now()}`,
        modelUsed: 'gemini-3.5-flash',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        content: `Error communicating with Gemini Copilot: ${err.message}`,
        id: `err-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const runDeepEvaluation = async (
    mode: 'fast-scan' | 'grounded-search' | 'pro-thinking'
  ) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/v1/gemini/analyze', {
        body: JSON.stringify({
          bidId: activeBid.id,
          mode,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const data = await res.json();
      setDeepAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      id="gemini-copilot-panel"
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-210px)] min-h-[520px] md:h-[740px]"
    >
      {/* Copilot Header */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">
                GeM-Verify AI Vigilance Copilot
              </h3>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30">
                Multi-Turn Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
              Procurement & CVC compliance assistant evaluating {activeBid.bidderName}
            </p>
          </div>
        </div>

        {/* Intelligence Mode Pills */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs overflow-x-auto touch-scroll w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => {
              setAiMode('pro-thinking');
              runDeepEvaluation('pro-thinking');
            }}
            className={`px-2.5 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap touch-target ${
              aiMode === 'pro-thinking'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="High Thinking Reasoning (gemini-3.1-pro-preview with ThinkingLevel.HIGH)"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-300" />
            <span>High Thinking</span>
          </button>

          <button
            onClick={() => {
              setAiMode('fast-scan');
              runDeepEvaluation('fast-scan');
            }}
            className={`px-2.5 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap touch-target ${
              aiMode === 'fast-scan'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Low-Latency Fast Scan (gemini-3.1-flash-lite)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Fast Scan</span>
          </button>

          <button
            onClick={() => {
              setAiMode('grounded-search');
              runDeepEvaluation('grounded-search');
            }}
            className={`px-2.5 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap touch-target ${
              aiMode === 'grounded-search'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Live Google Search Grounding"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-300" />
            <span>Live Grounding</span>
          </button>
        </div>
      </div>

      {/* Deep Analysis Card if generated */}
      {deepAnalysis && (
        <div className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50/40 border-b border-slate-200 text-xs space-y-2.5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              {deepAnalysis.modelUsed} Executive Audit Memo
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                deepAnalysis.suggestedAction === 'QUALIFY'
                  ? 'bg-emerald-100 text-emerald-800'
                  : deepAnalysis.suggestedAction === 'DISQUALIFY'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Suggested: {deepAnalysis.suggestedAction}
            </span>
          </div>

          <p className="text-slate-700 leading-relaxed">
            {deepAnalysis.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            <div className="bg-white p-2.5 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">
                Key Risk Flags Identified:
              </span>
              <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                {deepAnalysis.keyRisks?.map((r: string, idx: number) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-2.5 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">
                CVC & GFR 2017 Recommendation:
              </span>
              <p className="text-slate-700 italic">
                "{deepAnalysis.cvcRecommendation}"
              </p>
            </div>
          </div>

          {deepAnalysis.sources && deepAnalysis.sources.length > 0 && (
            <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-700">
                Grounded Citations:
              </span>
              {deepAnalysis.sources.map((s: any, idx: number) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                >
                  [{idx + 1}] {s.title}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            <div
              className={`max-w-xl p-3.5 rounded-2xl leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-xs'
                  : 'bg-slate-100/90 text-slate-800 border border-slate-200/80 rounded-tl-xs whitespace-pre-line'
              }`}
            >
              {msg.content}

              {msg.modelUsed && (
                <div
                  className={`mt-2 pt-1.5 border-t text-[10px] ${
                    msg.role === 'user'
                      ? 'border-white/10 text-slate-400'
                      : 'border-slate-200 text-slate-400'
                  }`}
                >
                  Engine: {msg.modelUsed} •{' '}
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Copilot analyzing procurement rules and drafting response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Action Chips */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto touch-scroll scrollbar-none text-[11px]">
        <span className="font-semibold text-slate-500 whitespace-nowrap pl-1 shrink-0">
          Officer Prompts:
        </span>
        <button
          onClick={() =>
            handleSendMessage(
              `Draft a formal 48-hour clarification notice for ${activeBid.bidderName} regarding their Make in India and EPFO parameters under GFR 2017 Rule 173.`
            )
          }
          className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap transition cursor-pointer shrink-0 touch-target"
        >
          Draft 48-Hour Clarification Notice
        </button>
        <button
          onClick={() =>
            handleSendMessage(
              `What are the CVC guidelines on evaluating minor statutory delays in EPFO remittances vs disqualification?`
            )
          }
          className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap transition cursor-pointer shrink-0 touch-target"
        >
          Check CVC Rule on EPFO Gaps
        </button>
        <button
          onClick={() =>
            handleSendMessage(
              `Inspect whether ${activeBid.bidderName} qualifies as a Class-I Local Supplier for purchase preference in CPCL refinery tenders.`
            )
          }
          className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap transition cursor-pointer shrink-0 touch-target"
        >
          Verify MII Class-I Purchase Preference
        </button>
      </div>

      {/* Chat Input Box */}
      <div className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`Ask GeM-Verify Copilot about ${activeBid.bidderName}, GFR 2017...`}
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 touch-target"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || isSending}
          title="Send message to Copilot"
          aria-label="Send"
          className="p-2.5 min-w-[44px] min-h-[44px] bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center justify-center touch-target"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
