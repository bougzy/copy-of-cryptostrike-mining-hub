
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MiningView from './components/MiningView';
import TasksView from './components/TasksView';
import WalletConnect from './components/WalletConnect';
import InsightsView from './components/InsightsView';
import AdminDashboard from './components/AdminDashboard';
import Home from './components/Home';
import Auth from './components/Auth';
import { View, MiningStats, Task, WalletInfo, MiningInsight, UserWallet, UserSession, DbStatus } from './types';
import { generateDailyTasks, fetchMiningInsights } from './services/geminiService';
import { connectToCloudDatabase, syncProgressToCloud } from './services/dbService';
import { workerScript } from './miningWorker';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('crypto_session');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [dbStatus, setDbStatus] = useState<DbStatus>({
    connected: false,
    cluster: 'Disconnected',
    latency: 0,
    lastSync: 'Never',
    url: ''
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [btcPrice, setBtcPrice] = useState<number>(68432.12);
  const [isMining, setIsMining] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [discoveredProviders, setDiscoveredProviders] = useState<any[]>([]);
  const workerRef = useRef<Worker | null>(null);

  const [stats, setStats] = useState<MiningStats>(() => {
    const saved = localStorage.getItem('crypto_stats');
    return saved ? JSON.parse(saved) : {
      hashRate: 0,
      totalMined: 0.1245,
      dailyEarnings: 0.0084,
      activeRigs: 1,
      efficiency: 99
    };
  });

  const [wallet, setWallet] = useState<WalletInfo>({
    address: null,
    connected: false,
    balance: 0,
    network: 'Mainnet'
  });

  const [systemWallets, setSystemWallets] = useState<UserWallet[]>(() => {
    const saved = localStorage.getItem('system_wallets');
    return saved ? JSON.parse(saved) : [
      { id: 'usr_1', address: '0x3F1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S', profit: 0.045, lastActive: '2 hours ago', status: 'ACTIVE' }
    ];
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [insights, setInsights] = useState<MiningInsight[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Persistence & DB Sync
  useEffect(() => {
    localStorage.setItem('crypto_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('system_wallets', JSON.stringify(systemWallets));
  }, [systemWallets]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('crypto_session', JSON.stringify(session));
      // Connect to DB when session starts
      if (!dbStatus.connected) {
        connectToCloudDatabase().then(setDbStatus);
      }
    } else {
      localStorage.removeItem('crypto_session');
    }
  }, [session]);

  // Persist sidebar collapsed state
  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Periodic Cloud Sync
  useEffect(() => {
    if (session && dbStatus.connected) {
      const interval = setInterval(async () => {
        setIsSyncing(true);
        await syncProgressToCloud({ stats, wallet });
        setIsSyncing(false);
        setDbStatus(prev => ({ ...prev, lastSync: new Date().toLocaleTimeString() }));
      }, 30000); // Sync every 30s
      return () => clearInterval(interval);
    }
  }, [session, dbStatus.connected, stats, wallet]);

  // EIP-6963 Wallet Discovery
  useEffect(() => {
    const onAnnouncement = (event: any) => {
      setDiscoveredProviders(prev => {
        if (prev.find(p => p.info.uuid === event.detail.info.uuid)) return prev;
        return [...prev, event.detail];
      });
    };

    window.addEventListener("eip6963:announceProvider", onAnnouncement);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => window.removeEventListener("eip6963:announceProvider", onAnnouncement);
  }, []);

  // Robust BTC Price Fetching
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const endpoints = [
          'https://api.coincap.io/v2/assets/bitcoin',
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
        ];
        let price = null;
        try {
          const res = await fetch(endpoints[0], { signal: AbortSignal.timeout(5000) });
          const data = await res.json();
          price = parseFloat(data.data.priceUsd);
        } catch (e) {
          const res = await fetch(endpoints[1], { signal: AbortSignal.timeout(5000) });
          const data = await res.json();
          price = data.bitcoin.usd;
        }
        if (price && !isNaN(price)) setBtcPrice(price);
      } catch (err) {
        console.debug("Price sync currently unavailable.");
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  // Web Worker for Real Mining
  useEffect(() => {
    try {
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      worker.onmessage = (e) => {
        if (e.data.type === 'progress') {
          const increment = 0.00000001 * (e.data.count / 100);
          setStats(prev => ({
            ...prev,
            totalMined: prev.totalMined + increment,
            hashRate: Math.floor(Math.random() * 5) + 45 
          }));
        }
      };
      workerRef.current = worker;
      return () => worker.terminate();
    } catch (e) {
      console.error("Worker initialization failed", e);
    }
  }, []);

  useEffect(() => {
    if (isMining && session) {
      workerRef.current?.postMessage('start');
    } else {
      workerRef.current?.postMessage('stop');
      setStats(prev => ({ ...prev, hashRate: 0 }));
    }
  }, [isMining, session]);

  // Initialization Data (AI)
  useEffect(() => {
    const init = async () => {
      if (!session) return;
      setIsLoadingTasks(true);
      setIsLoadingInsights(true);
      try {
        const [dailyTasks, aiInsights] = await Promise.all([
          generateDailyTasks(),
          fetchMiningInsights()
        ]);
        setTasks(dailyTasks);
        setInsights(aiInsights);
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setIsLoadingTasks(false);
        setIsLoadingInsights(false);
      }
    };
    init();
  }, [session]);

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    if (newSession.role === 'admin') {
      setCurrentView(View.ADMIN);
    } else {
      setCurrentView(View.DASHBOARD);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setCurrentView(View.HOME);
    setIsMining(false);
    setWallet({ address: null, connected: false, balance: 0, network: 'Mainnet' });
    setDbStatus({ connected: false, cluster: 'Disconnected', latency: 0, lastSync: 'Never', url: '' });
  };

  const getProvider = (name: string) => {
    const discovered = discoveredProviders.find(p => p.info.name.toLowerCase().includes(name.toLowerCase()));
    if (discovered) return discovered.provider;
    const eth = (window as any).ethereum;
    if (name === 'MetaMask') return eth?.providers?.find((p: any) => p.isMetaMask) || (eth?.isMetaMask ? eth : null);
    if (name === 'Coinbase Wallet') return (window as any).coinbaseWalletExtension || (eth?.isCoinbaseWallet ? eth : null);
    if (name === 'Trust Wallet') return (window as any).trustWallet || eth?.providers?.find((p: any) => p.isTrust) || (eth?.isTrust ? eth : null);
    if (name === 'Phantom') return (window as any).phantom?.ethereum || (eth?.isPhantom ? eth : null);
    return eth;
  };

  const handleConnectWallet = async (providerName: string) => {
    setConnectionError(null);
    const providerToUse = getProvider(providerName);
    if (!providerToUse) throw new Error(`The ${providerName} extension was not detected.`);
    try {
      const accounts = await providerToUse.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      const provider = new ethers.BrowserProvider(providerToUse);
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();
      setWallet({
        address,
        connected: true,
        balance: parseFloat(ethers.formatEther(balance)),
        network: `${providerName} (${network.name === 'unknown' ? 'EVM' : network.name})`
      });
      setSystemWallets(prev => {
        const addrLower = address.toLowerCase();
        if (prev.find(w => w.address.toLowerCase() === addrLower)) return prev;
        return [...prev, { id: `usr_${Date.now()}`, address, profit: stats.totalMined, lastActive: 'Just connected', status: 'ACTIVE' }];
      });
    } catch (err: any) {
      console.error("Handshake failed:", err);
      throw new Error(err.message || "Connection failed.");
    }
  };

  const handleDisconnectWallet = () => setWallet({ address: null, connected: false, balance: 0, network: 'Mainnet' });

  const handleAdminAddProfit = (walletId: string, amount: number) => {
    setSystemWallets(prev => prev.map(w => w.id === walletId ? { ...w, profit: w.profit + amount } : w));
    const target = systemWallets.find(w => w.id === walletId);
    if (target?.address === wallet.address) setStats(prev => ({ ...prev, totalMined: prev.totalMined + amount }));
  };

  const handleAdminTransferProfit = (walletId: string, amount: number, dest: string) => {
    setSystemWallets(prev => prev.map(w => w.id === walletId ? { ...w, profit: Math.max(0, w.profit - amount) } : w));
    const target = systemWallets.find(w => w.id === walletId);
    if (target?.address === wallet.address) setStats(prev => ({ ...prev, totalMined: Math.max(0, prev.totalMined - amount) }));
  };

  const renderContent = () => {
    if (currentView === View.HOME) return <Home onStart={(v) => session ? setCurrentView(v) : setCurrentView(View.AUTH)} />;
    if (currentView === View.AUTH) return <Auth onLoginSuccess={handleLoginSuccess} />;
    if (!session) return <Home onStart={(v) => session ? setCurrentView(v) : setCurrentView(View.AUTH)} />;

    if (currentView === View.ADMIN) {
      if (session.role !== 'admin') {
        setCurrentView(View.DASHBOARD);
        return <Dashboard stats={stats} />;
      }
      return <AdminDashboard userWallets={systemWallets} adminWallet={wallet} onAddProfit={handleAdminAddProfit} onTransferProfit={handleAdminTransferProfit} dbStatus={dbStatus} />;
    }

    switch (currentView) {
      case View.DASHBOARD: return <Dashboard stats={stats} />;
      case View.MINING: return <MiningView onMine={() => {}} isMining={isMining} setIsMining={setIsMining} />;
      case View.TASKS: return <TasksView tasks={tasks} onCompleteTask={(id) => {
        const task = tasks.find(t => t.id === id);
        if (task && !task.completed) {
          setStats(prev => ({ ...prev, totalMined: prev.totalMined + task.reward }));
          setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
        }
      }} loading={isLoadingTasks} />;
      case View.WALLET: return <WalletConnect wallet={wallet} onConnect={handleConnectWallet} onDisconnect={handleDisconnectWallet} error={connectionError} setError={setConnectionError} discoveredProviders={discoveredProviders} />;
      case View.INSIGHTS: return <InsightsView insights={insights} loading={isLoadingInsights} />;
      default: return <Dashboard stats={stats} />;
    }
  };

  // Check if we should show the full-page layout (no sidebar/header) for Home and Auth
  const isFullPageView = currentView === View.HOME || currentView === View.AUTH;

  // Full-page layout for Home and Auth (no sidebar, no dashboard header)
  if (isFullPageView) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
        {currentView === View.HOME ? (
          <Home onStart={(v) => session ? setCurrentView(v) : setCurrentView(View.AUTH)} />
        ) : (
          <div className="min-h-screen flex items-center justify-center p-4">
            <Auth onLoginSuccess={handleLoginSuccess} />
          </div>
        )}
      </div>
    );
  }

  // Dashboard layout with sidebar for authenticated views
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden lg:flex">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        session={session}
        onLogout={handleLogout}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      <main className="flex-1 overflow-y-auto relative min-h-screen w-full">
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 mr-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-3 sm:space-x-6 flex-1 min-w-0">
            {session ? (
              <>
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-500 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">BTC</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm sm:text-lg truncate">${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="w-px h-6 bg-slate-800 hidden sm:block"></div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">Power Level</span>
                  <span className="text-cyan-400 font-mono font-bold text-lg">{stats.hashRate > 0 ? `${stats.hashRate} MH/s` : 'IDLE'}</span>
                </div>
                {dbStatus.connected && (
                  <>
                    <div className="w-px h-6 bg-slate-800 hidden lg:block"></div>
                    <div className="hidden lg:flex flex-col items-center">
                       <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-0.5">Cloud Storage</span>
                       <div className="flex items-center space-x-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-spin' : 'bg-emerald-500'}`}></div>
                         <span className="text-[11px] font-bold text-slate-300">Live Sync</span>
                       </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-3 text-slate-500">
                 <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.223 0 2.388.22 3.468.618M15 12h.01M17 12a5 5 0 11-10 0 5 5 0 0110 0z" />
                    </svg>
                 </div>
                 <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] truncate">Public Protocol Alpha</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {session && (
               <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl mr-2">
                 <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,1)]"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{session.role} authorized</span>
               </div>
            )}
            <button onClick={() => session ? setCurrentView(View.WALLET) : setCurrentView(View.AUTH)} className={`group flex items-center space-x-2 sm:space-x-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all border ${wallet.connected ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${wallet.connected ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
              <span className="text-[10px] sm:text-xs font-bold mono truncate max-w-[80px] sm:max-w-none">{wallet.connected ? `${wallet.address?.slice(0, 6)}...${wallet.address?.slice(-4)}` : (session ? 'SYNC WALLET' : 'IDENTITY PENDING')}</span>
            </button>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">{renderContent()}</div>
      </main>
      {isMining && session && (
        <div className="fixed bottom-4 right-4 sm:bottom-10 sm:right-10 bg-indigo-600/90 backdrop-blur-xl text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl border border-white/10 flex items-center space-x-3 sm:space-x-4 shadow-2xl z-50 animate-in slide-in-from-right-10">
          <div className="relative w-3 h-3 sm:w-4 sm:h-4"><div className="absolute inset-0 bg-white rounded-full animate-ping"></div><div className="relative w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div></div>
          <div><p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-70">Computing Hashes</p><p className="text-xs sm:text-sm font-bold">Node Rig Active</p></div>
        </div>
      )}
    </div>
  );
};

export default App;
