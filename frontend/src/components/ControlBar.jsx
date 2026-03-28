import React, { useState, useRef } from 'react';
import { Mic, MicOff, Send, Paperclip } from 'lucide-react';

const ControlBar = ({ onSend, disabled }) => {

  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');

  const recognitionRef = useRef(null);

  // 🎤 START SPEECH RECOGNITION
  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setInputText(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  // 🛑 STOP RECORDING
  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  // 🔁 TOGGLE
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // 🚀 SEND
  const handleSendClick = () => {
    if (!inputText.trim()) return;

    onSend(inputText);
    setInputText('');

    if (isRecording) stopRecording();
  };

  return (
    <div className="glass-panel px-6 py-4 flex items-center gap-4 w-full">

      {/* 🎤 MIC BUTTON */}
      <button 
        onClick={toggleRecording}
        disabled={disabled}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          isRecording 
            ? 'bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse'
            : 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50'
        }`}
      >
        {isRecording ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      {/* 📝 INPUT */}
      <div className="flex-1 relative flex items-center">
        <input 
          type="text"
          placeholder="Type or speak your answer..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendClick()}
          disabled={disabled}
          className="w-full bg-white/5 border border-white/20 rounded-full py-3 px-6 text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
        />

        <button className="absolute right-4 text-gray-400" disabled>
          <Paperclip size={18} />
        </button>
      </div>

      {/* 🚀 SEND */}
      <button 
        onClick={handleSendClick}
        disabled={disabled}
        className="h-12 px-8 rounded-full bg-gradient-to-r from-neon-blue to-purple-500 text-white font-bold flex items-center gap-2 hover:shadow-[0_0_15px_rgba(176,38,255,0.6)] transition-all"
      >
        <span>Respond</span>
        <Send size={16} />
      </button>

    </div>
  );
};

export default ControlBar;