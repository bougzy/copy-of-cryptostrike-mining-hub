
import React, { useState, useEffect } from 'react';

interface MiningViewProps {
  onMine: (amount: number) => void;
  isMining: boolean;
  setIsMining: (mining: boolean) => void;
}

const MiningView: React.FC<MiningViewProps> = ({ onMine, isMining, setIsMining }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isMining) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 5) % 360);
        onMine(0.000001); // Simulate small mining increment
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isMining, onMine]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">
          Mining Reactor
        </h1>
        <p className="text-slate-400 max-w-md mx-auto">
          Power up your mining rig to contribute to the global hash rate and earn rewards in real-time.
        </p>
      </div>

      <div className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${isMining ? 'animate-pulse' : ''}`}></div>
        <div className="relative w-64 h-64 bg-slate-900 rounded-full border-4 border-slate-800 flex items-center justify-center overflow-hidden">
          {/* Animated reactor graphics */}
          <div 
            className="absolute inset-4 border-2 border-dashed border-indigo-500/30 rounded-full transition-transform duration-75"
            style={{ transform: `rotate(${rotation}deg)` }}
          ></div>
          <div 
            className="absolute inset-8 border border-cyan-500/20 rounded-full transition-transform duration-100"
            style={{ transform: `rotate(${-rotation * 1.5}deg)` }}
          ></div>
          
          <button 
            onClick={() => setIsMining(!isMining)}
            className={`z-10 w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 ${
              isMining 
                ? 'bg-red-500/10 border-2 border-red-500/50 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
                : 'bg-indigo-600 border-2 border-indigo-400 text-white shadow-[0_0_30px_rgba(99,102,241,0.5)]'
            }`}
          >
            <svg className="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMining ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              )}
            </svg>
            <span className="font-bold text-xs uppercase tracking-widest">
              {isMining ? 'Stop' : 'Launch'}
            </span>
          </button>

          {isMining && (
             <div className="absolute bottom-6 text-indigo-400 font-mono text-[10px] animate-bounce">
               MINING ACTIVE...
             </div>
          )}
        </div>
      </div>

      <div className="flex space-x-8">
        <div className="text-center">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Power Consumption</div>
          <div className="text-xl font-bold text-slate-200">1.2 kW/h</div>
        </div>
        <div className="w-px bg-slate-800 self-stretch"></div>
        <div className="text-center">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Temperature</div>
          <div className={`text-xl font-bold transition-colors ${isMining ? 'text-orange-400' : 'text-slate-200'}`}>
            {isMining ? '64°C' : '38°C'}
          </div>
        </div>
        <div className="w-px bg-slate-800 self-stretch"></div>
        <div className="text-center">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Hash Stability</div>
          <div className="text-xl font-bold text-emerald-400">99.8%</div>
        </div>
      </div>
    </div>
  );
};

export default MiningView;
