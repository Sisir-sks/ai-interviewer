import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';

const CandidatePanel = ({ round }) => {
  const videoRef = useRef(null);
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasVideo(true);
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
      }
    };
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-80 h-48 glass-panel border-neon-purple/50 shadow-[0_0_15px_rgba(176,38,255,0.2)] flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="absolute top-0 w-full bg-neon-purple/20 backdrop-blur-md px-3 py-1 flex justify-between items-center z-10 border-b border-neon-purple/30">
        <span className="text-xs font-mono font-bold text-white">CANDIDATE: You</span>
        <span className="text-xs font-mono text-neon-purple shadow-[0_0_5px_#b026ff]">ROUND {round}</span>
      </div>

      {/* Video Stream */}
      <div className="flex-1 bg-black/60 flex items-center justify-center relative mt-6">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover absolute inset-0 z-0 ${hasVideo ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0 pointer-events-none" />
        
        {!hasVideo && (
           <div className="text-white/20 flex flex-col items-center z-10">
             <CameraOff size={32} className="mb-2" />
             <span className="text-xs font-mono">Webcam Offline</span>
           </div>
        )}

        {hasVideo && (
          <div className="absolute right-2 top-2 flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm z-10 border border-red-500/30">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
             <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-wider">REC</span>
          </div>
        )}

        {/* Scan line effect */}
        <div className="absolute inset-x-0 h-0.5 bg-neon-purple/30 shadow-[0_0_8px_#b026ff] animate-[scan_3s_ease-in-out_infinite] pointer-events-none" />
      </div>

    </div>
  );
};

export default CandidatePanel;
