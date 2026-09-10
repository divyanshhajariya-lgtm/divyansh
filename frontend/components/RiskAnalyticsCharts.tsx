import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BidSubmission } from '../types';

interface Props {
  bids: BidSubmission[];
}

export const RiskAnalyticsCharts: React.FC<Props> = ({ bids }) => {
  // Compute risk category counts
  const riskCounts = {
    HIGH: bids.filter((b) => b.riskLevel === 'HIGH').length,
    LOW: bids.filter((b) => b.riskLevel === 'LOW').length,
    MEDIUM: bids.filter((b) => b.riskLevel === 'MEDIUM').length,
  };

  const pieData = [
    { color: '#059669', name: 'Low Risk (>=85)', value: riskCounts.LOW },
    { color: '#d97706', name: 'Medium Risk (60-84)', value: riskCounts.MEDIUM },
    { color: '#e11d48', name: 'High Risk (<60)', value: riskCounts.HIGH },
  ];

  // Compute bid score comparison
  const barData = bids.map((b) => ({
    fullName: b.bidderName,
    name: b.bidderName.split(' ')[0],
    quote: b.quotedValueINR / 100000, // Lakhs
    risk: b.riskLevel,
    score: b.complianceScore,
  }));

  return (
    <div
      id="risk-analytics-charts"
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5"
    >
      {/* Bid Score Comparison Chart */}
      <div className="lg:col-span-8 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Bidder Compliance Score vs Risk Index
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Normalized score comparison across active bidders in tender GEM/2026/B/891273
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-mono">
            {bids.length} Evaluated Bids
          </span>
        </div>

        <div className="h-52 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ bottom: 20, left: -20, right: 10, top: 10 }}
            >
              <CartesianGrid
                stroke="#f1f5f9"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                interval={0}
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg space-y-1">
                        <div className="font-bold">{data.fullName}</div>
                        <div>
                          Compliance Score:{' '}
                          <strong className="text-indigo-300">
                            {data.score} / 100
                          </strong>
                        </div>
                        <div>
                          Risk Classification:{' '}
                          <strong
                            className={
                              data.risk === 'LOW'
                                ? 'text-emerald-400'
                                : data.risk === 'MEDIUM'
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }
                          >
                            {data.risk}
                          </strong>
                        </div>
                        <div>Quoted Value: ₹{data.quote.toFixed(2)} Lakhs</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Tier Distribution Pie Chart */}
      <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Risk Categorization Spread
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Categorization based on statutory compliance thresholds
          </p>
        </div>

        <div className="h-48 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={pieData}
                dataKey="value"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    return (
                      <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-md text-xs">
                        <span>
                          {data.name}: <strong>{data.value} Bidders</strong>
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
          {pieData.map((d, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-[11px]"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-slate-600">{d.name}</span>
              </div>
              <span className="font-bold text-slate-800">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
