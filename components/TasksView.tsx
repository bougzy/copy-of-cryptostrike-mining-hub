
import React from 'react';
import { Task } from '../types';

interface TasksViewProps {
  tasks: Task[];
  onCompleteTask: (id: string) => void;
  loading: boolean;
}

const TasksView: React.FC<TasksViewProps> = ({ tasks, onCompleteTask, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 animate-pulse">Syncing dynamic daily tasks with AI...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Daily Challenges</h1>
        <p className="text-slate-400">Complete these activities to boost your hash rate and earn extra BTC.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`p-6 rounded-3xl border transition-all duration-300 ${
              task.completed 
                ? 'bg-slate-800/20 border-slate-700/30 opacity-60' 
                : 'bg-slate-800/40 border-slate-700 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                task.type === 'AI' ? 'bg-indigo-500/20 text-indigo-400' : 
                task.type === 'SYSTEM' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {task.type}
              </span>
              <span className="text-indigo-400 font-mono font-bold">+{task.reward} BTC</span>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">{task.title}</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{task.description}</p>
            
            <button
              disabled={task.completed}
              onClick={() => onCompleteTask(task.id)}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                task.completed 
                  ? 'bg-emerald-500/10 text-emerald-500 cursor-default' 
                  : 'bg-slate-700 hover:bg-indigo-600 text-white'
              }`}
            >
              {task.completed ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Completed</span>
                </span>
              ) : 'Complete Task'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksView;
