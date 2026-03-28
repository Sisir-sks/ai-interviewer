import React from 'react';
import { Download, Award, CheckCircle, Target, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const FinalResultsScreen = ({ onRestart }) => {
  return (
    <div className="h-screen w-full flex items-center justify-center p-6 bg-background relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/5 rounded-full blur-[100px] z-0" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-neon-purple/5 rounded-full blur-[80px] z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel w-full max-w-4xl p-8 z-10 border-neon-blue/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] relative"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-purple-500 mb-2">
            SIMULATION COMPLETE
          </h1>
          <p className="text-gray-400 font-mono tracking-widest">PLACEMENT_GLADIATOR // FINAL ASSESSMENT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Main Score */}
          <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-6 border border-white/10">
            <Award className="text-neon-green mb-4" size={48} />
            <p className="text-gray-400 text-sm font-mono tracking-widest mb-1">OVERALL SURVIVAL SCORE</p>
            <p className="text-6xl font-bold text-white mb-2 shadow-neon-green/50">85<span className="text-3xl text-gray-500">%</span></p>
            <p className="text-neon-green font-bold tracking-widest px-4 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 mt-2">
              HIRE RECOMMENDATION
            </p>
          </div>

          {/* Detailed Metrics */}
          <div className="flex flex-col justify-center gap-4">
            
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Target className="text-neon-blue" size={20} />
                <span className="text-white font-bold">Technical Competence</span>
              </div>
              <span className="text-xl font-mono text-neon-blue">88%</span>
            </div>
            
             <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-neon-purple" size={20} />
                <span className="text-white font-bold">Communication Scope</span>
              </div>
              <span className="text-xl font-mono text-neon-purple">82%</span>
            </div>
            
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-neon-green/30 shadow-[0_0_10px_rgba(57,255,20,0.1)]">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-neon-green" size={20} />
                <span className="text-white font-bold">Offer Probability</span>
              </div>
              <span className="text-2xl font-bold text-neon-green">91%</span>
            </div>

          </div>
        </div>

        {/* Mock Salary */}
        <div className="glass-panel p-6 border-neon-green/50 shadow-[0_0_15px_rgba(57,255,20,0.2)] mb-8 flex justify-between items-center">
          <div>
            <p className="text-gray-400 font-mono text-sm mb-1">SIMULATED OFFER GENERATED</p>
            <div className="flex items-end gap-2">
              <DollarSign className="text-neon-green mb-1" size={24} />
              <p className="text-3xl font-bold text-white">125,000</p>
              <p className="text-gray-500 font-mono mb-1">/ YEAR BASE</p>
            </div>
          </div>
          <button className="h-12 px-6 rounded-xl bg-neon-green/20 text-neon-green font-bold flex items-center gap-2 hover:bg-neon-green/30 transition-all border border-neon-green/50">
            <Download size={18} />
            Download Certificate
          </button>
        </div>

        <div className="text-center">
          <button 
            onClick={onRestart}
            className="text-gray-400 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all font-mono"
          >
            INITIALIZE NEW SESSION
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default FinalResultsScreen;
