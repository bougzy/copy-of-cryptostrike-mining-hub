
import React, { useState, useEffect } from 'react';
import { UserWallet, WalletInfo, DbStatus } from '../types';
import { ethers } from 'ethers';
import { getObfuscatedUrl, fetchAllUsersFromDb } from '../services/dbService';

interface AdminDashboardProps {
  userWallets: UserWallet[];
  adminWallet: WalletInfo;
  onAddProfit: (walletId: string, amount: number) => void;
  onTransferProfit: (walletId: string, amount: number, destinationAddress: string) => void;
  dbStatus: DbStatus;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userWallets, adminWallet, onAddProfit, onTransferProfit, dbStatus }) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [actionAmount, setActionAmount] = useState<string>('');
  const [customAddress, setCustomAddress] = useState<string>('');
  const [txStatus, setTxStatus] = useState<'IDLE' | 'PENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'NODES' | 'DATABASE'>('NODES');
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const selectedWallet = userWallets.find(w => w.id === selectedWalletId);

  useEffect(() => {
    if (selectedWallet) {
      setCustomAddress(selectedWallet.address);
    } else {
      setCustomAddress('');
    }
  }, [selectedWallet]);

  useEffect(() => {
    if (activeTab === 'DATABASE') {
      setLoadingUsers(true);
      fetchAllUsersFromDb().then(users => {
        setDbUsers(users);
        setLoadingUsers(false);
      });
    }
  }, [activeTab]);

  const handleRealCredit = async () => {
    if (!adminWallet.connected) {
      setErrorMessage("You must connect your admin wallet first to perform real-world crediting.");
      setTxStatus('ERROR');
      return;
    }
    if (!ethers.isAddress(customAddress)) {
      setErrorMessage("The provided target address is not a valid Ethereum address.");
      setTxStatus('ERROR');
      return;
    }
    const amount = parseFloat(actionAmount);
    if (isNaN(amount) || amount <= 0 || !selectedWallet) return;
    setTxStatus('PENDING');
    setErrorMessage(null);
    setTxHash(null);
    try {
      const ethProvider = (window as any).ethereum;
      if (!ethProvider) throw new Error("No crypto wallet detected.");
      const provider = new ethers.BrowserProvider(ethProvider);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({ to: customAddress, value: ethers.parseEther(amount.toString()) });
      setTxHash(tx.hash);
      await tx.wait();
      onAddProfit(selectedWallet.id, amount);
      setTxStatus('SUCCESS');
      setActionAmount('');
    } catch (err: any) {
      setTxStatus('ERROR');
      setErrorMessage(err.reason || err.message || "Transaction failed");
    }
  };

  const handleDebitAdjustment = () => {
    const amount = parseFloat(actionAmount);
    if (!isNaN(amount) && amount > 0 && selectedWalletId) {
      onTransferProfit(selectedWalletId, amount, customAddress);
      setActionAmount('');
      setTxStatus('SUCCESS');
      setTimeout(() => setTxStatus('IDLE'), 3000);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-500 relative">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1 sm:mb-2 tracking-tighter uppercase italic">Control Center</h1>
          <p className="text-slate-400 text-sm sm:text-base">Master panel for node distributions and cloud database orchestration.</p>
        </div>
        <div className="flex items-center">
          <div className="bg-amber-500/10 text-amber-400 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-amber-500/20 text-[10px] sm:text-xs font-black flex items-center space-x-2 sm:space-x-3 shadow-lg shadow-amber-900/10">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
            <span className="tracking-widest">ADMIN ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('NODES')}
          className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'NODES' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300 bg-slate-900 border border-slate-800'}`}
        >
          Node Ledger
        </button>
        <button
          onClick={() => setActiveTab('DATABASE')}
          className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'DATABASE' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300 bg-slate-900 border border-slate-800'}`}
        >
          Cloud Database
        </button>
      </div>

      {activeTab === 'NODES' ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
          {/* Mobile Card View */}
          <div className="block lg:hidden">
            {userWallets.length === 0 ? (
              <div className="px-4 py-12 text-center text-slate-500 italic font-medium text-sm">
                No authorized nodes detected in the network.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {userWallets.map((wallet) => (
                  <div key={wallet.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.223 0 2.388.22 3.468.618M15 12h.01M17 12a5 5 0 11-10 0 5 5 0 0110 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="mono text-sm text-white font-bold block">{wallet.address.slice(0, 8)}...{wallet.address.slice(-4)}</span>
                          <span className="text-[9px] text-slate-500 uppercase tracking-widest">Verified Identity</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${wallet.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                        {wallet.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Balance (BTC)</span>
                        <span className="text-indigo-400 mono font-black text-lg">{wallet.profit.toFixed(6)}</span>
                      </div>
                      <button
                        onClick={() => { setSelectedWalletId(wallet.id); setTxStatus('IDLE'); setErrorMessage(null); }}
                        className="bg-white/5 border border-white/10 text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                      >
                        Adjust
                      </button>
                    </div>
                    <div className="text-slate-500 text-xs">Last active: {wallet.lastActive}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-6 xl:px-8 py-5 xl:py-6">Node Identifier</th>
                  <th className="px-6 xl:px-8 py-5 xl:py-6">Link Status</th>
                  <th className="px-6 xl:px-8 py-5 xl:py-6 text-center">Protocol Balance (BTC)</th>
                  <th className="px-6 xl:px-8 py-5 xl:py-6">Last Handshake</th>
                  <th className="px-6 xl:px-8 py-5 xl:py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {userWallets.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-500 italic font-medium">No authorized nodes detected in the network.</td></tr>
                ) : (
                  userWallets.map((wallet) => (
                    <tr key={wallet.id} className="group hover:bg-slate-800/40 transition-all duration-300">
                      <td className="px-6 xl:px-8 py-5 xl:py-6">
                        <div className="flex items-center space-x-3 xl:space-x-4">
                          <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.223 0 2.388.22 3.468.618M15 12h.01M17 12a5 5 0 11-10 0 5 5 0 0110 0z" /></svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="mono text-sm text-white font-bold">{wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}</span>
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Verified Identity</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 xl:px-8 py-5 xl:py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${wallet.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{wallet.status}</span>
                      </td>
                      <td className="px-6 xl:px-8 py-5 xl:py-6 text-indigo-400 mono font-black text-center text-lg">{wallet.profit.toFixed(6)}</td>
                      <td className="px-6 xl:px-8 py-5 xl:py-6 text-slate-500 text-xs font-medium">{wallet.lastActive}</td>
                      <td className="px-6 xl:px-8 py-5 xl:py-6 text-right">
                        <button onClick={() => { setSelectedWalletId(wallet.id); setTxStatus('IDLE'); setErrorMessage(null); }} className="bg-white/5 border border-white/10 text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95">Adjust Node</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 animate-in slide-in-from-left-4 duration-500">
          {/* Database Connection Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-[2.5rem]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-10">
                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tighter italic">Connection Manifest</h3>
                <div className={`px-3 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest border self-start ${dbStatus.connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {dbStatus.connected ? 'LIVE CONNECTION' : 'OFFLINE'}
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-6 bg-slate-950 rounded-xl sm:rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Endpoint URL</p>
                  <p className="mono text-xs text-indigo-300 break-all">{getObfuscatedUrl(dbStatus.url)}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-4 sm:p-6 bg-slate-950 rounded-xl sm:rounded-2xl border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Cluster</p>
                    <p className="text-white font-bold text-sm sm:text-base">{dbStatus.cluster}</p>
                  </div>
                  <div className="p-4 sm:p-6 bg-slate-950 rounded-xl sm:rounded-2xl border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Database Name</p>
                    <p className="text-white font-bold text-sm sm:text-base">forex</p>
                  </div>
                </div>
              </div>

              {/* User Collection */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-10 border-t border-slate-800/50">
                <h4 className="text-white text-xs font-black uppercase tracking-widest mb-4 sm:mb-6">User Collection Snapshot</h4>
                <div className="bg-slate-950 rounded-xl sm:rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[400px]">
                      <thead className="bg-slate-900 text-[8px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 sm:py-4">Node Identity</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4">Role</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4">Enrolled On</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/30">
                        {loadingUsers ? (
                          <tr><td colSpan={3} className="px-6 py-10 text-center"><div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                        ) : dbUsers.map((u, i) => (
                          <tr key={i} className="text-xs">
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-300 font-medium truncate max-w-[150px]">{u.email}</td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black ${u.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                {u.role.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-500 mono">{new Date(u.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Database Health & Sync */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2.5rem]">
              <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4 sm:mb-6">Database Health</h4>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs sm:text-sm">Cluster Latency</span>
                  <span className="text-emerald-400 mono font-bold text-sm">{dbStatus.latency}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs sm:text-sm">Last Sync</span>
                  <span className="text-white mono font-bold text-sm">{dbStatus.lastSync}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs sm:text-sm">Sync Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(34,197,94,1)]"></div>
                    <span className="text-white text-xs font-bold">Synchronized</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 group cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h4 className="text-white font-black italic uppercase tracking-tighter text-lg sm:text-xl mb-3 sm:mb-4 relative z-10">Manual Sync</h4>
              <p className="text-indigo-100 text-xs mb-6 sm:mb-8 relative z-10">Force a high-priority data replication to Cluster0 to ensure cross-node data consistency.</p>
              <button className="w-full py-3 sm:py-4 bg-white text-indigo-600 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all relative z-10">Force DB Sync</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedWallet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => txStatus !== 'PENDING' && setSelectedWalletId(null)}></div>
          <div className="relative w-full max-w-md sm:max-w-xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 right-0 p-4 sm:p-8">
              <button onClick={() => setSelectedWalletId(null)} disabled={txStatus === 'PENDING'} className="text-slate-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 sm:p-10">
              <div className="flex flex-col items-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-2xl sm:rounded-[2rem] flex items-center justify-center mb-4 shadow-2xl border border-white/5 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400 relative z-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-1 tracking-tighter uppercase italic text-center">Manual Disbursement</h2>
                <p className="text-slate-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-60">Admin Protocol Overlay</p>
              </div>

              {txStatus === 'PENDING' ? (
                <div className="py-8 sm:py-12 flex flex-col items-center justify-center space-y-4 sm:space-y-6">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-base sm:text-lg animate-pulse tracking-tight">Syncing Transaction...</p>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Network Confirmation Pending</p>
                  </div>
                </div>
              ) : txStatus === 'SUCCESS' ? (
                <div className="py-6 sm:py-8 animate-in zoom-in duration-500">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 sm:p-8 rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-white">Execution Successful</h4>
                    {txHash && (
                      <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="inline-block text-indigo-400 hover:text-indigo-300 text-xs font-mono underline break-all px-4">
                        TxHash: {txHash.slice(0, 15)}...{txHash.slice(-8)}
                      </a>
                    )}
                    <button onClick={() => setTxStatus('IDLE')} className="w-full bg-slate-800 text-white font-black py-3 sm:py-4 rounded-xl sm:rounded-2xl mt-4 hover:bg-slate-700 transition-all uppercase tracking-widest text-xs">Return to Ledger</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {errorMessage && (
                    <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl flex items-start space-x-3">
                      <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p className="text-[11px] text-red-400 font-bold">{errorMessage}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Recipient / Target Address</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0x..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 sm:py-4 text-white font-mono text-sm focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner pr-10"
                          value={customAddress}
                          onChange={(e) => setCustomAddress(e.target.value)}
                        />
                        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                          <svg className={`w-5 h-5 ${ethers.isAddress(customAddress) ? 'text-emerald-500' : 'text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zM10 14a1 1 0 100-2 1 1 0 000 2zm1-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" /></svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Adjustment Amount (ETH/BTC)</label>
                      <input
                        type="number"
                        placeholder="0.0000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 sm:py-4 text-white font-mono text-lg sm:text-xl focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                        value={actionAmount}
                        onChange={(e) => setActionAmount(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
                      <button
                        onClick={handleRealCredit}
                        disabled={!actionAmount || parseFloat(actionAmount) <= 0 || !customAddress}
                        className="group bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-black py-4 sm:py-5 rounded-xl sm:rounded-2xl transition-all shadow-xl shadow-indigo-900/20 flex flex-col items-center justify-center space-y-1 uppercase tracking-widest text-[10px]"
                      >
                        <span className="text-base sm:text-lg">CREDIT</span>
                        <span className="opacity-60 text-[8px] sm:text-[9px] font-medium">Blockchain Tx</span>
                      </button>
                      <button
                        onClick={handleDebitAdjustment}
                        disabled={!actionAmount || parseFloat(actionAmount) <= 0 || !customAddress}
                        className="group bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-black py-4 sm:py-5 rounded-xl sm:rounded-2xl border border-slate-700 transition-all flex flex-col items-center justify-center space-y-1 uppercase tracking-widest text-[10px]"
                      >
                        <span className="text-base sm:text-lg">DEBIT</span>
                        <span className="opacity-60 text-[8px] sm:text-[9px] font-medium">Local Record</span>
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 sm:pt-6 border-t border-slate-800 flex items-start space-x-3 text-slate-500">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-[8px] sm:text-[9px] leading-relaxed uppercase tracking-tighter">Manual credit transfers are final and irreversible once broadcasted. The debit action records a local protocol withdrawal linked to the provided destination.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
