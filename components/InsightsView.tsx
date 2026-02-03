
import React from 'react';
import { MiningInsight } from '../types';

interface InsightsViewProps {
  insights: MiningInsight[];
  loading: boolean;
}

const InsightsView: React.FC<InsightsViewProps> = ({ insights, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 animate-pulse">Consulting Gemini for latest mining alpha...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">AI Mining Insights</h1>
        <p className="text-slate-400">Strategic intelligence generated from real-time market data to optimize your mining performance.</p>
      </div>

      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <div 
            key={idx}
            className="p-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-3xl backdrop-blur-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                insight.relevance === 'HIGH' ? 'bg-red-500/20 text-red-400' : 
                insight.relevance === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
              }`}>
                {insight.relevance} RELEVANCE
              </span>
            </div>
            
            <div className="flex items-start space-x-6">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">{insight.topic}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{insight.content}</p>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-3xl mt-10">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-500 rounded-xl">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
             </svg>
          </div>
          <div>
            <h4 className="font-bold text-white">Advanced Strategy?</h4>
            <p className="text-slate-400 text-sm">Our AI models continuously monitor 150+ metrics. New insights generate every 4 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsView;
