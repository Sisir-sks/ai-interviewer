import React from 'react';
import { Activity, ShieldAlert, Cpu, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusSidebar = ({ currentRound, score, difficulty, activeAgent }) => {
  return (
    <div className="h-full flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-wider text-white flex items-center gap-2 border-b border-white/10 pb-4">
          <Activity className="text-neon-blue" />
          SESSION STATS
        </h2>
      </div>

      {/* Round & Difficulty */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
        <div>
          <p className="text-xs text-gray-400 font-mono">ROUND</p>
          <p className="text-2xl font-bold text-white">{currentRound} <span className="text-gray-500 text-sm">/ 5</span></p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 font-mono">DIFFICULTY</p>
          <p className={`text-lg font-bold ${difficulty === 'HARD' ? 'text-neon-red shadow-[0_0_5px_#ff003c]' : 'text-neon-green'}`}>
            {difficulty}
          </p>
        </div>
      </div>

      {/* Survival Score */}
      <div className="glass-panel p-4 border border-neon-blue/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
        <div className="flex justify-between items-end mb-2">
          <p className="text-xs text-neon-blue font-mono flex items-center gap-1">
            <Award size={14} /> SURVIVAL SCORE
          </p>
          <p className="text-2xl font-bold text-white">{score}%</p>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Active Speaker Status */}
      <div className="mt-4">
        <p className="text-xs text-gray-400 font-mono mb-3">CURRENTLY EXECUTING</p>
        <div className="bg-white/5 p-3 rounded-lg flex items-center gap-3 border border-white/10">
           <Cpu size={18} className={activeAgent ? 'text-neon-green animate-pulse' : 'text-gray-500'} />
           <div>
             <p className="text-sm font-bold text-white">{activeAgent || 'Awaiting...'}</p>
             <p className="text-xs text-gray-400 font-mono">{activeAgent ? 'Processing output' : 'Idling'}</p>
           </div>
        </div>
      </div>

      {/* Interview Progress Steps */}
      <div className="mt-8 flex-1">
        <p className="text-xs text-gray-400 font-mono mb-4">INTERVIEW PROTOCOL</p>
        <div className="flex flex-col gap-4">
          {[
            { step: 1, name: 'HR Screening', status: currentRound > 1 ? 'completed' : currentRound === 1 ? 'active' : 'pending' },
            { step: 2, name: 'Technical Basics', status: currentRound > 2 ? 'completed' : currentRound === 2 ? 'active' : 'pending' },
            { step: 3, name: 'DSA / Coding', status: currentRound > 3 ? 'completed' : currentRound === 3 ? 'active' : 'pending' },
            { step: 4, name: 'System Design', status: currentRound > 4 ? 'completed' : currentRound === 4 ? 'active' : 'pending' },
            { step: 5, name: 'Negotiation', status: currentRound > 5 ? 'completed' : currentRound === 5 ? 'active' : 'pending' }
          ].map((item) => (
             <div key={item.step} className="flex items-center gap-3">
               <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${item.status === 'completed' ? 'bg-neon-green/20 border-neon-green text-neon-green' : item.status === 'active' ? 'bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'border-gray-600 text-gray-600'}`}>
                 {item.step}
               </div>
               <span className={`text-sm ${item.status === 'active' ? 'text-white font-bold' : 'text-gray-400'}`}>
                 {item.name}
               </span>
             </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default StatusSidebar;
