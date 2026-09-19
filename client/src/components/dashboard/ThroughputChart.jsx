import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Activity } from 'lucide-react';
import { useVerification } from '../../context/VerificationContext.jsx';

export default function ThroughputChart() {
  const { metrics } = useVerification();
  const data = metrics?.throughputTimeSeries || [
    { time: '12 AM', pan: 120, aadhaar: 95, cibil: 45 },
    { time: '4 AM', pan: 80, aadhaar: 60, cibil: 25 },
    { time: '8 AM', pan: 350, aadhaar: 310, cibil: 190 },
    { time: '12 PM', pan: 620, aadhaar: 580, cibil: 340 },
    { time: '4 PM', pan: 710, aadhaar: 640, cibil: 390 },
    { time: '8 PM', pan: 490, aadhaar: 420, cibil: 260 },
    { time: '11:59 PM', pan: 210, aadhaar: 180, cibil: 110 }
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Daily Verifications Chart
            </h3>
            <p className="text-xs text-slate-500">Number of checks done throughout the day</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span>+18% Today</span>
        </div>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="panGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="aadhaarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cibilGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284C7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0284C7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.05)',
                fontSize: '12px'
              }}
            />
            <Area type="monotone" dataKey="pan" name="PAN Card" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#panGrad)" />
            <Area type="monotone" dataKey="aadhaar" name="Aadhaar Card" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#aadhaarGrad)" />
            <Area type="monotone" dataKey="cibil" name="Credit Score" stroke="#0284C7" strokeWidth={2} fillOpacity={1} fill="url(#cibilGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
