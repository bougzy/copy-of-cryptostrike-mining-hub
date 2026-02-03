
import React, { useState } from 'react';
import { View } from '../types';

interface HomeProps {
  onStart: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const faqs = [
    { q: "How does the AI-Mining logic work?", a: "Our system utilizes Gemini-driven insights to analyze network difficulty and energy costs in real-time, automatically adjusting your node's logic for peak efficiency." },
    { q: "Is the profit distribution real?", a: "Yes. Admin-verified miners receive distributions directly to their linked EVM-compatible wallets via the secure Control Center protocol." },
    { q: "What hardware is required?", a: "Our hub is cloud-compatible and rig-agnostic. You can contribute hash power via our optimized browser worker or link external ASIC rigs." },
    { q: "How do I secure my node?", a: "By linking your identity through EIP-6963 compatible providers (MetaMask, Trust, etc.), your hash contributions are cryptographically signed and immutable." }
  ];

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="animate-in fade-in duration-1000">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onStart(View.HOME)}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent italic">
                CryptoStrike
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => onStart(View.AUTH)}
                className="text-slate-300 hover:text-white text-sm font-bold transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onStart(View.DASHBOARD)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-bold transition-colors"
              >
                Launch App
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileNavOpen ? 'max-h-80' : 'max-h-0'}`}>
          <div className="px-4 py-4 space-y-3 bg-slate-900/95 border-t border-slate-800">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="block py-3 px-4 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <button
                onClick={() => { onStart(View.AUTH); setMobileNavOpen(false); }}
                className="w-full py-3 px-4 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-bold transition-colors text-left"
              >
                Login
              </button>
              <button
                onClick={() => { onStart(View.DASHBOARD); setMobileNavOpen(false); }}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-bold transition-colors"
              >
                Launch App
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 sm:h-20"></div>

      <div className="space-y-20 sm:space-y-32">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] sm:min-h-[85vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden rounded-2xl sm:rounded-[4rem] mx-2 sm:mx-4">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-slate-950 to-slate-950 -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-indigo-500/10 rounded-full blur-[80px] sm:blur-[120px] -z-20 animate-pulse"></div>

        <div className="inline-flex items-center space-x-2 bg-slate-900/50 border border-slate-800 px-3 sm:px-4 py-2 rounded-full mb-6 sm:mb-8 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-indigo-400">Mainnet v4.0 is Live</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white mb-6 sm:mb-8 tracking-tighter leading-none italic">
          MINING THE <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">FUTURE.</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg lg:text-xl max-w-2xl mb-8 sm:mb-12 leading-relaxed px-2">
          The next generation of cryptographic hash distribution. Secure your node, analyze market intelligence with AI, and automate your yield with 99.8% stability.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0">
          <button
            onClick={() => onStart(View.MINING)}
            className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-indigo-600 rounded-2xl sm:rounded-3xl font-black text-white text-base sm:text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(99,102,241,0.3)] hover:shadow-indigo-500/40"
          >
            LAUNCH REACTOR
            <div className="absolute inset-0 bg-white/20 rounded-2xl sm:rounded-3xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </button>
          <button
            onClick={() => onStart(View.DASHBOARD)}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl font-black text-slate-300 text-base sm:text-lg hover:bg-slate-800 transition-all active:scale-95"
          >
            EXPLORE NETWORK
          </button>
        </div>

        <div className="mt-12 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-20 opacity-50 grayscale transition-all hover:grayscale-0 duration-1000 w-full max-w-4xl px-4">
           <div className="flex flex-col items-center">
             <span className="text-2xl sm:text-3xl font-black text-white mb-1">99.8%</span>
             <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-500">Uptime</span>
           </div>
           <div className="flex flex-col items-center">
             <span className="text-2xl sm:text-3xl font-black text-white mb-1">4.2 EH/s</span>
             <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-500">Pool Power</span>
           </div>
           <div className="flex flex-col items-center">
             <span className="text-2xl sm:text-3xl font-black text-white mb-1">12ms</span>
             <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-500">Latency</span>
           </div>
           <div className="flex flex-col items-center">
             <span className="text-2xl sm:text-3xl font-black text-white mb-1">850k</span>
             <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-500">Active Nodes</span>
           </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 scroll-mt-20">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 italic tracking-tighter">ENGINEERED FOR YIELD</h2>
          <div className="w-16 sm:w-20 h-1 bg-indigo-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "AI-DRIVEN ALPHA",
              desc: "Gemini 3.0 Pro integrates directly with your rig, analyzing 1,000+ data points per second to predict network difficulty shifts.",
              icon: "M13 10V3L4 14h7v7l9-11h-7z"
            },
            {
              title: "MULTI-CHAIN NODES",
              desc: "Link MetaMask, Trust Wallet, or Phantom with zero-friction. Distributions occur automatically via audited smart contracts.",
              icon: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.223 0 2.388.22 3.468.618M15 12h.01M17 12a5 5 0 11-10 0 5 5 0 0110 0z"
            },
            {
              title: "LOW-POWER LOGIC",
              desc: "Our unique browser-based mining worker utilizes WebAssembly to maximize hash output while minimizing CPU thermal load.",
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            }
          ].map((feature, i) => (
            <div key={i} className="group p-6 sm:p-10 bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-[3rem] hover:bg-slate-800/80 transition-all duration-500">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 border border-indigo-500/20 group-hover:bg-indigo-600 transition-colors">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mb-3 sm:mb-4 tracking-tighter italic uppercase">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-12 lg:space-x-20">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 italic tracking-tighter">FAQ</h2>
            <p className="text-slate-500 text-sm">Everything you need to know about the CryptoStrike protocol.</p>
          </div>
          <div className="md:w-2/3 space-y-2 sm:space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-800 last:border-0">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full py-4 sm:py-6 flex items-center justify-between text-left group gap-4"
                >
                  <span className={`text-base sm:text-lg font-bold transition-colors ${activeFaq === i ? 'text-indigo-400' : 'text-slate-200 group-hover:text-white'}`}>{faq.q}</span>
                  <svg className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-indigo-400' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${activeFaq === i ? 'max-h-48 pb-4 sm:pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="bg-indigo-600 rounded-2xl sm:rounded-[4rem] p-6 sm:p-10 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-20">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 Z" fill="white" />
            </svg>
          </div>

          <div className="lg:w-1/2 relative z-10 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 italic tracking-tighter">REACH OUT</h2>
            <p className="text-indigo-100 text-base sm:text-lg mb-6 sm:mb-10 leading-relaxed">Have a bulk mining query or partnership inquiry? Our system specialists are available 24/7 for authorized node operators.</p>
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                 <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                 </svg>
              </div>
              <span className="text-white font-bold text-sm sm:text-base">ops@cryptostrike.io</span>
            </div>
          </div>

          <div className="lg:w-1/2 w-full bg-white rounded-2xl sm:rounded-[3rem] p-6 sm:p-8 lg:p-12 relative z-10 shadow-2xl">
             <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identity Name</label>
                 <input type="text" className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-indigo-500 transition-colors font-medium text-sm sm:text-base" placeholder="Ex: Satoshi" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Communication Node</label>
                 <input type="email" className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-indigo-500 transition-colors font-medium text-sm sm:text-base" placeholder="Ex: node@vault.com" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manifest</label>
                 <textarea className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-indigo-500 transition-colors font-medium h-24 sm:h-32 text-sm sm:text-base" placeholder="Tell us about your hash goals..."></textarea>
               </div>
               <button className="w-full py-4 sm:py-5 bg-indigo-600 rounded-xl sm:rounded-2xl text-white font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-xl active:scale-95 text-sm sm:text-base">
                 TRANSMIT SIGNAL
               </button>
             </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 pt-12 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-20 max-w-6xl mx-auto">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-white">CryptoStrike</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Empowering the decentralized world with high-performance hash power and AI market intelligence. Secure. Efficient. Scalable.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-sm uppercase tracking-widest">Protocol</h4>
            <ul className="space-y-3 sm:space-y-4 text-slate-500 text-sm">
              <li className="hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => onStart(View.MINING)}>Mining Rig</li>
              <li className="hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => onStart(View.WALLET)}>Secure Wallet</li>
              <li className="hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => onStart(View.TASKS)}>Daily Tasks</li>
              <li className="hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => onStart(View.INSIGHTS)}>AI Intelligence</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-sm uppercase tracking-widest">Network</h4>
            <ul className="space-y-3 sm:space-y-4 text-slate-500 text-sm">
              <li className="hover:text-indigo-400 transition-colors cursor-pointer">Live Node Status</li>
              <li className="hover:text-indigo-400 transition-colors cursor-pointer">Hash Rate API</li>
              <li className="hover:text-indigo-400 transition-colors cursor-pointer">Security Audits</li>
              <li className="hover:text-indigo-400 transition-colors cursor-pointer">Whitepaper</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-sm uppercase tracking-widest">Connect</h4>
            <ul className="space-y-3 sm:space-y-4 text-slate-500 text-sm">
              <li className="hover:text-indigo-400 transition-colors cursor-pointer">Official Discord</li>
              <li className="hover:text-indigo-400 transition-colors cursor-pointer">Node Operator TG</li>
              <li className="hover:text-indigo-400 transition-colors cursor-pointer">Mining Support</li>
              <li className="hover:text-indigo-400 transition-colors cursor-pointer">Enterprise API</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 max-w-6xl mx-auto pt-8 sm:pt-10 border-t border-slate-900">
           <p className="text-slate-600 text-xs order-2 sm:order-1">© 2024 CryptoStrike Protocol. All rights reserved.</p>
           <div className="flex items-center space-x-6 sm:space-x-8 text-slate-600 text-xs font-bold uppercase tracking-widest order-1 sm:order-2">
              <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms</span>
              <span className="hover:text-slate-400 cursor-pointer">Cookies</span>
           </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Home;
