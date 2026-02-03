
import React from 'react';
import { View, UserSession } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  session: UserSession | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, session, onLogout }) => {
  // Publicly available items
  const publicItems = [
    { id: View.HOME, label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  ];

  // Protected items only visible after login
  const protectedItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: View.MINING, label: 'Mining Rig', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
    { id: View.TASKS, label: 'Daily Tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { id: View.WALLET, label: 'Wallet', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: View.INSIGHTS, label: 'AI Insights', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  ];

  const renderNavButton = (item: { id: View, label: string, icon: string }) => (
    <button
      key={item.id}
      onClick={() => onViewChange(item.id)}
      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
        currentView === item.id
          ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
      </svg>
      <span className="font-medium">{item.label}</span>
    </button>
  );

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 flex flex-col p-4 z-40">
      <div className="flex items-center space-x-2 mb-10 px-2 cursor-pointer" onClick={() => onViewChange(View.HOME)}>
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent italic">
          CryptoStrike
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {/* Always visible */}
        {publicItems.map(renderNavButton)}

        {/* Protected Items - Only if session exists */}
        {session && (
          <div className="pt-4 mt-4 border-t border-slate-800/50 space-y-1">
            <p className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">Mining Suite</p>
            {protectedItems.map(renderNavButton)}
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
           {session?.role === 'admin' && (
             <button
              onClick={() => onViewChange(View.ADMIN)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                currentView === View.ADMIN
                  ? 'bg-amber-600/10 text-amber-400 border border-amber-600/20'
                  : 'text-slate-500 hover:bg-slate-800 hover:text-amber-400/80'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium">Admin Panel</span>
            </button>
           )}

           {!session ? (
             <button
                onClick={() => onViewChange(View.AUTH)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  currentView === View.AUTH
                    ? 'bg-indigo-600/10 text-indigo-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Login Identity</span>
              </button>
           ) : (
             <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Logout Node</span>
              </button>
           )}
        </div>
      </nav>

      <div className="mt-auto p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
        <div className="text-xs text-slate-500 mb-1 font-black uppercase tracking-widest text-[8px]">Network Node</div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${session ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-600'}`}></div>
          <span className="text-sm font-bold text-slate-300">{session ? 'Online' : 'Standby'}</span>
        </div>
        {session && (
          <div className="mt-2 text-[10px] text-slate-500 mono truncate opacity-60 italic">{session.email}</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
