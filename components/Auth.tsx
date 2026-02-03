
import React, { useState, useEffect } from 'react';
import { UserSession } from '../types';
import { registerUserInDb, verifyUserInDb, connectToCloudDatabase } from '../services/dbService';

interface AuthProps {
  onLoginSuccess: (session: UserSession) => void;
  initialMode?: 'login' | 'register';
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    connectToCloudDatabase().then(() => setDbConnected(true));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (!email || !password || !confirmPassword) throw new Error("Please fill all fields.");
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        
        // Save to Simulated MongoDB
        await registerUserInDb(email, password);
        
        setSuccess("Registration successful! Identity saved to Cluster0.");
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      } else {
        if (!email || !password) throw new Error("Please fill all fields.");

        // Authenticate via Simulated MongoDB
        const session = await verifyUserInDb(email, password);
        onLoginSuccess(session);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-700">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500"></div>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
            {isLoading ? (
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
            {mode === 'login' ? 'Protocol Access' : 'Node Enrollment'}
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-1.5 h-1.5 rounded-full ${dbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              {dbConnected ? 'Database: Cluster0 Connected' : 'Connecting to Atlas...'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 animate-in slide-in-from-top-2">
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[11px] text-red-400 font-bold">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 animate-in slide-in-from-top-2">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-[11px] text-emerald-400 font-bold">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Communication Node (Email)</label>
            <input 
              type="email" 
              required
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium disabled:opacity-50"
              placeholder="Ex: node-01@vault.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Manifest (Password)</label>
            <input 
              type="password" 
              required
              disabled={isLoading}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium disabled:opacity-50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {mode === 'register' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Re-Verify Manifest</label>
              <input 
                type="password" 
                required
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium disabled:opacity-50"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading || !dbConnected}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-900/20 uppercase tracking-widest text-xs flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center space-x-3">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>SYNCING WITH CLOUD...</span>
              </span>
            ) : (
              <span>{mode === 'login' ? 'INITIALIZE SESSION' : 'ENROLL NEW NODE'}</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-xs font-medium">
            {mode === 'login' ? "New to the protocol?" : "Already verified?"}
            <button 
              disabled={isLoading}
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
                setSuccess(null);
              }}
              className="ml-2 text-indigo-400 hover:text-indigo-300 font-black uppercase tracking-widest disabled:opacity-50"
            >
              {mode === 'login' ? 'Register Node' : 'Initialize Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
