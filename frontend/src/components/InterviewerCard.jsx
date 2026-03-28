import React from 'react';
import { motion } from 'framer-motion';

const InterviewerCard = ({ interviewer, isSpeaking, isDimmed }) => {
  return (
    <motion.div 
      className={`glass-panel p-4 flex flex-col items-center justify-center relative overflow-hidden ${isSpeaking ? 'border-neon-teal z-10' : 'border-white/10'} ${isDimmed ? 'opacity-40 grayscale-[50%]' : 'opacity-100'}`}
      animate={{ 
        scale: isSpeaking ? 1.05 : 1,
        boxShadow: isSpeaking ? '0 0 20px rgba(0, 240, 255, 0.4), inset 0 0 10px rgba(0, 240, 255, 0.2)' : 'none',
        borderColor: isSpeaking ? '#00f0ff' : 'rgba(255, 255, 255, 0.1)'
      }}
      transition={{ duration: 0.3 }}
    >
      
      {/* Speaking Indicator Pulse */}
      {isSpeaking && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <motion.div 
            className="w-2 h-2 rounded-full bg-neon-green"
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <span className="text-xs font-mono text-neon-green">Speaking</span>
        </div>
      )}

      {/* Listening Indicator */}
      {!isSpeaking && !isDimmed && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-xs font-mono text-blue-400">Listening</span>
        </div>
      )}

      <div className="relative mb-4">
        <motion.img 
          src={interviewer.avatar} 
          alt={interviewer.name}
          className={`w-24 h-24 rounded-full object-cover border-2 ${isSpeaking ? 'border-neon-blue' : 'border-white/20'}`}
          animate={{
            boxShadow: isSpeaking ? '0 0 15px #00f0ff' : 'none'
          }}
        />
        {isSpeaking && (
          <motion.div 
            className="absolute -inset-1 rounded-full border border-neon-blue z-0"
            animate={{ scale: [1, 1.1, 1], opacity: [0, 0.5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </div>

      <h3 className="text-lg font-bold text-white">{interviewer.name}</h3>
      <p className="text-sm text-neon-blue font-mono mt-1">{interviewer.role}</p>

      {/* Voice visualizer mockup */}
      {isSpeaking && (
        <div className="flex gap-1 h-4 mt-4 items-end">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i}
              className="w-1 bg-neon-blue rounded-t-sm"
              animate={{ height: ["4px", `${Math.random() * 16 + 4}px`, "4px"] }}
              transition={{ repeat: Infinity, duration: 0.4 + i * 0.1 }}
            />
          ))}
        </div>
      )}

    </motion.div>
  );
};

export default InterviewerCard;
