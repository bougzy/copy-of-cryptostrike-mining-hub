
import React, { useState } from 'react';
import { WalletInfo } from '../types';

interface WalletConnectProps {
  wallet: WalletInfo;
  onConnect: (providerName: string) => Promise<void>;
  onDisconnect: () => void;
  error: string | null;
  setError: (err: string | null) => void;
  discoveredProviders: any[];
}

const WALLET_PROVIDERS = [
  {
    name: 'MetaMask',
    id: 'metamask',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg',
    description: 'The industry standard Ethereum browser wallet.'
  },
  {
    name: 'Coinbase Wallet',
    id: 'coinbase',
    icon: 'https://images.ctfassets.net/q5ulk4u67rxd/488v2vY6mR273mYidYy9Kq/8a27d530188040449581c356e9c9f28d/coinbase-wallet-logo.png',
    description: 'Secure custody and DeFi interaction by Coinbase.'
  },
  {
    name: 'Trust Wallet',
    id: 'trust',
    icon: 'https://trustwallet.com/assets/images/media/assets/TWT.png',
    description: 'Trusted multi-chain mobile wallet for 60M+ users.'
  },
  {
    name: 'Phantom',
    id: 'phantom',
    icon: 'https://phantom.app/img/logo.png',
    description: 'Powerful wallet for EVM and Solana ecosystems.'
  },
  {
    name: 'Rainbow',
    id: 'rainbow',
    icon: 'https://avatars.githubusercontent.com/u/47543026?s=200&v=4',
    description: 'The most fun and beautiful way to use Ethereum.'
  }
];

const WalletConnect: React.FC<WalletConnectProps> = ({ 
  wallet, 
  onConnect, 
  onDisconnect, 
  error, 
  setError, 
  discoveredProviders 
}) => {
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleConnect = async (provider: typeof WALLET_PROVIDERS[0]) => {
    setConnectingId(provider.id);
    setError(null);
    try {
      await onConnect(provider.name);
    } catch (e: any) {
      setError(e.message || "Connection failed.");
    } finally {
      setConnectingId(null);
    }
  };

  const isDiscovered = (name: string) => {
    // 1. EIP-6963 discovery (The gold standard)
    const foundInDiscovery = discoveredProviders.some(p => p.info.name.toLowerCase().includes(name.toLowerCase()));
    if (foundInDiscovery) return true;

    // 2. Comprehensive legacy injection detection
    const eth = (window as any).ethereum;
    if (name === 'MetaMask') {
      if (eth?.providers) return eth.providers.some((p: any) => p.isMetaMask);
      return !!eth?.isMetaMask;
    }
    if (name === 'Coinbase Wallet') {
      return !!((window as any).coinbaseWalletExtension || eth?.isCoinbaseWallet);
    }
    if (name === 'Trust Wallet') {
      return !!((window as any).trustWallet || eth?.isTrust || (eth?.providers?.some((p: any) => p.isTrust)));
    }
    if (name === 'Phantom') {
      return !!((window as any).phantom?.ethereum || eth?.isPhantom);
    }
    if (name === 'Rainbow') {
      return !!eth?.isRainbow;
    }

    return false;
  };

  return (
    <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Identity Center</h1>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">Synchronize your cryptographic identity to authorize mining nodes and receive distributions.</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-900/50 border border-slate-800 px-5 py-2.5 rounded-2xl shadow-inner">
           <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Detection Engine Live</span>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-3xl flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Provider Discovery Blocked</p>
              <p className="text-red-400/80 text-xs">{error}</p>
            </div>
          </div>
          <button onClick={() => setError(null)} className="text-slate-500 hover:text-white p-2.5 bg-white/5 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {WALLET_PROVIDERS.map((provider) => {
              const detected = isDiscovered(provider.name);
              const isConnecting = connectingId === provider.id;
              const isThisConnected = wallet.connected && wallet.network.includes(provider.name);

              return (
                <button
                  key={provider.id}
                  disabled={wallet.connected || !!connectingId}
                  onClick={() => handleConnect(provider)}
                  className={`group relative p-8 rounded-[3.5rem] border transition-all duration-500 text-left overflow-hidden ${
                    isThisConnected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_20px_50px_rgba(99,102,241,0.2)] ring-2 ring-indigo-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-800/80 active:scale-[0.98]'
                  } ${wallet.connected && !isThisConnected ? 'opacity-40 grayscale blur-[1px] pointer-events-none' : ''}`}
                >
                  <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-500/5 rounded-full blur-[60px] group-hover:bg-indigo-500/10 transition-colors duration-700"></div>
                  
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    {/* Enhanced Logo Container */}
                    <div className="w-20 h-20 rounded-[1.75rem] bg-white p-4 flex items-center justify-center border-2 border-slate-800 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <img 
                        src={provider.icon} 
                        alt={provider.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback icon if URL fails
                          (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/2152/2152539.png';
                        }}
                      />
                    </div>
                    {isConnecting ? (
                      <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : detected ? (
                      <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-emerald-500/30 tracking-widest uppercase">Verified</div>
                    ) : (
                      <div className="bg-slate-950/50 text-slate-600 text-[10px] font-black px-4 py-1.5 rounded-full border border-slate-800 tracking-widest uppercase">Inactive</div>
                    )}
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors">{provider.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2">{provider.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-12 p-10 bg-slate-900/40 border border-slate-800/60 rounded-[3.5rem] flex flex-col md:flex-row md:items-center md:space-x-10 space-y-6 md:space-y-0 relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="w-20 h-20 rounded-[2.25rem] bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-inner group-hover:bg-indigo-500/20 transition-colors">
              <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="relative z-10">
              <h4 className="text-white font-bold text-xl mb-2">Protocol Troubleshooting</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                If your preferred wallet is installed but marked "Inactive", ensure the extension has site access permissions. For mobile users, ensure you are utilizing the integrated DApp browser within the official wallet application.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className={`rounded-[3.5rem] p-12 text-white shadow-2xl transition-all duration-1000 relative overflow-hidden group ${
            wallet.connected ? 'bg-indigo-600' : 'bg-slate-900 border border-slate-800'
          }`}>
             <div className="absolute -top-10 -right-10 p-12 opacity-[0.03] group-hover:rotate-45 transition-transform duration-1000 pointer-events-none select-none">
               <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944z" clipRule="evenodd" />
               </svg>
            </div>

            <h3 className="text-4xl font-black mb-12 relative z-10 tracking-tight">Active Node</h3>
            
            {wallet.connected ? (
              <div className="space-y-10 relative z-10">
                <div className="p-8 bg-white/10 rounded-[2.5rem] backdrop-blur-xl border border-white/20 shadow-xl group-hover:bg-white/15 transition-colors">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">Linked Primary Address</p>
                  <p className="mono text-xs font-bold break-all leading-relaxed text-indigo-50">
                    {wallet.address}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-[10px] font-black uppercase opacity-60 mb-2">Net Value</p>
                    <p className="text-lg font-black mono truncate text-white">{wallet.balance.toFixed(4)} ETH</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-[10px] font-black uppercase opacity-60 mb-2">Gateway</p>
                    <p className="text-xs font-black mono truncate text-white uppercase">{wallet.network.split(' ')[0]}</p>
                  </div>
                </div>
                <button
                  onClick={onDisconnect}
                  className="w-full bg-white text-indigo-600 font-black py-6 rounded-[2.5rem] hover:bg-slate-50 transition-all shadow-2xl active:scale-95 uppercase tracking-widest text-sm"
                >
                  Terminate Link
                </button>
              </div>
            ) : (
              <div className="relative z-10">
                <p className="text-slate-400 mb-14 leading-relaxed font-medium text-lg">
                  Link an authorized cryptographic provider to synchronize your mining rig and enable automated distributions.
                </p>
                <div className="flex items-center space-x-4 text-indigo-400">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] group-hover:tracking-[0.4em] transition-all">Protocol Standby</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900/60 rounded-[3.5rem] border border-slate-800 p-10 group overflow-hidden relative">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <h4 className="text-white font-bold text-lg mb-4 flex items-center space-x-3 relative z-10">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.223 0 2.388.22 3.468.618M15 12h.01M17 12a5 5 0 11-10 0 5 5 0 0110 0z" />
              </svg>
              <span>Audit Protocol</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed relative z-10">
              Every synchronization handshake is verified via EIP-712 cryptographic signatures. We never request access to private keys or recovery phrases. Your rewards are distributed directly to the authorized vault address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
