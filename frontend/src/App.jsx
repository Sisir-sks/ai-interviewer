import React, { useState, useEffect, useRef } from 'react';
import ControlBar from './components/ControlBar';
import StatusSidebar from './components/StatusSidebar';
import FinalResultsScreen from './components/FinalResultsScreen';
import UploadScreen from './components/UploadScreen';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {

  const [view, setView] = useState('upload');
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [difficulty, setDifficulty] = useState('EASY');

  // 🔥 SESSION ID (IMPORTANT)
  const [sessionId] = useState(() => Date.now().toString());

  const chatRef = useRef();

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // 🏁 FINAL
  if (isFinished) {
    return <FinalResultsScreen onRestart={() => window.location.reload()} />;
  }

  // 🚀 START INTERVIEW
  async function startInterview(data) {
    setIsLoading(true);
    setChatHistory([]);

    try {
      const res = await fetch(`${API_URL}/interview/start`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resume_text: data?.resumeText || 'sample resume',
          session_id: sessionId   // 🔥 added
        })
      });

      const responseData = await res.json();

      if (responseData?.question) {
        speak(responseData.question);

        setChatHistory([
          { role: 'ai', content: responseData.question }
        ]);

        setView('interview');
      }

    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
  }

  // 💬 SEND ANSWER
  async function handleSend(text) {
    if (!text.trim()) return;

    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: text },
      { role: 'ai', content: '', loading: true }
    ]);

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/interview/answer`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answer: text,
          session_id: sessionId   // 🔥 added
        })
      });

      const responseData = await res.json();

      if (responseData?.next_question) {
        speak(responseData.next_question);

        setChatHistory(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'ai',
            content: responseData.next_question
          };
          return updated;
        });
      }

      setDifficulty(responseData?.difficulty?.toUpperCase() || "MEDIUM");

    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
  }

  // 🔊 VOICE
  function speak(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  // 🔥 LOADING SCREEN
  if (isLoading && view !== 'interview') {
    return (
      <div className="h-screen flex items-center justify-center text-white text-lg">
        🤖 Preparing your interview...
      </div>
    );
  }

  // 📄 UPLOAD SCREEN
  if (view === 'upload') {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <UploadScreen onComplete={startInterview} />
      </div>
    );
  }

  // 🚨 EMPTY INTERVIEW FIX
  if (view === 'interview' && chatHistory.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white gap-3">
        <div className="text-xl">🤖 Preparing your AI Interview...</div>
        <div className="text-gray-400 text-sm">Analyzing your resume...</div>
      </div>
    );
  }

  // 🎯 MAIN UI
  return (
    <div className="flex flex-row h-screen w-full bg-gradient-to-br from-black via-slate-900 to-black">

      <div className="flex-1 flex flex-col p-6 gap-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              🤖 AI Interviewer
            </h1>
            <p className="text-sm text-gray-400">
              AI-powered adaptive interview based on your resume
            </p>
          </div>

          <div className="text-sm text-gray-400">
            Difficulty: {difficulty}
          </div>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-auto p-6 space-y-4">

          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl max-w-[65%] shadow-lg ${
                msg.role === 'user'
                  ? 'ml-auto bg-gradient-to-r from-green-500/20 to-green-400/10 border border-green-400/20'
                  : 'mr-auto bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10'
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">
                {msg.role === 'ai' ? "🤖 AI Interviewer" : "🧑 You"}
              </div>

              <div className="text-sm">
                {msg.loading ? (
                  <div className="flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce delay-100">•</span>
                    <span className="animate-bounce delay-200">•</span>
                  </div>
                ) : msg.content}
              </div>
            </div>
          ))}

          <div ref={chatRef} />
        </div>

        {/* INPUT */}
        <div className="p-2 rounded-2xl bg-white/5 border border-white/10">
          <ControlBar onSend={handleSend} disabled={isLoading} />
        </div>

      </div>

      {/* SIDEBAR */}
      <div className="w-72 p-6 bg-black/40">
        <StatusSidebar
          difficulty={difficulty}
          activeAgent="AI Interviewer"
        />
      </div>

    </div>
  );
}

export default App;