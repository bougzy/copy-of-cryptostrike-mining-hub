
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MiningStats } from '../types';

const data = [
  { name: '00:00', value: 0.002 },
  { name: '04:00', value: 0.004 },
  { name: '08:00', value: 0.003 },
  { name: '12:00', value: 0.006 },
  { name: '16:00', value: 0.008 },
  { name: '20:00', value: 0.007 },
  { name: '24:00', value: 0.011 },
];

interface DashboardProps {
  stats: MiningStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Network Overview</h1>
        <div className="text-xs sm:text-sm text-slate-400">Last updated: Just now</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Current Hashrate', value: `${stats.hashRate} TH/s`, color: 'text-indigo-400' },
          { label: 'Total Mined', value: `${stats.totalMined.toFixed(4)} BTC`, color: 'text-cyan-400' },
          { label: 'Estimated Daily', value: `${stats.dailyEarnings.toFixed(4)} BTC`, color: 'text-emerald-400' },
          { label: 'Active Rigs', value: stats.activeRigs, color: 'text-amber-400' },
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-800/40 border border-slate-700/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-sm">
            <div className="text-slate-400 text-xs sm:text-sm mb-1 sm:mb-2 truncate">{item.label}</div>
            <div className={`text-lg sm:text-2xl font-bold mono ${item.color} truncate`}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Charts and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Earnings Performance (24h)</h2>
          <div className="h-[200px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-slate-800/40 border border-slate-700/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">System Health</h2>
          <div className="space-y-4 sm:space-y-6">
            {/* Efficiency Bar */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span className="text-slate-400">Efficiency</span>
                <span className="text-indigo-400">{stats.efficiency}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${stats.efficiency}%` }}></div>
              </div>
            </div>

            {/* Hardware Status */}
            <div className="pt-4 border-t border-slate-700">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-slate-400 text-xs sm:text-sm">Hardware Status</span>
                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] sm:text-xs font-bold rounded">OPTIMAL</span>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-500">GPU Temp</span>
                  <span className="text-slate-200">62°C</span>
                </li>
                <li className="flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-500">Fan Speed</span>
                  <span className="text-slate-200">2400 RPM</span>
                </li>
                <li className="flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-500">Uptime</span>
                  <span className="text-slate-200">14d 02h 22m</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
