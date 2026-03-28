import React, { useState } from 'react';
import { Upload, FileText, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const UploadScreen = ({ onComplete }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resumeText.trim() || !jobDescription.trim()) return;

    setIsSubmitting(true);
    // Simulate analyzing time before transitioning
    setTimeout(() => {
      onComplete({ resumeText, jobDescription });
    }, 2500); 
  };

  const handleFileUpload = async (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }
        setter(fullText);
      } else if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setter(result.value);
      } else {
        const text = await file.text();
        setter(text);
      }
    } catch (err) {
      console.error("Error reading file:", err);
      alert("Failed to read file.");
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full opacity-100 transition-opacity duration-1000">
        <div className="relative">
           <div className="w-24 h-24 rounded-full border-b-2 border-t-2 border-neon-blue animate-spin"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <Briefcase className="w-8 h-8 text-neon-blue animate-pulse" />
           </div>
        </div>
        <h2 className="mt-8 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-purple-500 animate-pulse">Placement Manager is reviewing...</h2>
        <p className="mt-4 text-gray-400 text-sm max-w-md text-center">Parsing your resume, analyzing the job description, and assembling your specialized interview panel.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8 h-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-purple-500 mb-4">Prepare for Combat</h1>
        <p className="text-gray-400 text-lg">Provide your details to face the PlacementGladiator arena.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Resume Section */}
        <div className="glass-panel p-6 flex flex-col gap-4 relative group">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue">
               <FileText className="w-5 h-5" />
             </div>
             <h2 className="text-xl font-semibold text-white">Your Resume</h2>
           </div>
           
           <textarea 
             className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all resize-none font-mono text-sm"
             placeholder="Paste your resume text here..."
             value={resumeText}
             onChange={(e) => setResumeText(e.target.value)}
             required
           />
           
           <div className="flex items-center justify-between mt-2">
             <span className="text-xs text-gray-500">Or upload a file (.txt, .pdf, .docx)</span>
             <label className="cursor-pointer glass-button px-4 py-2 flex items-center gap-2 text-neon-blue hover:text-white transition-colors">
               <Upload className="w-4 h-4" />
               <span className="text-xs font-semibold uppercase tracking-wider">Upload File</span>
               <input 
                 type="file" 
                 accept=".txt,.pdf,.docx"
                 className="hidden"
                 onChange={(e) => handleFileUpload(e, setResumeText)}
               />
             </label>
           </div>
        </div>

        {/* Job Description Section */}
        <div className="glass-panel p-6 flex flex-col gap-4 relative group">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
               <Briefcase className="w-5 h-5" />
             </div>
             <h2 className="text-xl font-semibold text-white">Job Description</h2>
           </div>
           
           <textarea 
             className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none font-mono text-sm"
             placeholder="Paste the target Job Description..."
             value={jobDescription}
             onChange={(e) => setJobDescription(e.target.value)}
             required
           />
           
           <div className="flex items-center justify-between mt-2">
             <span className="text-xs text-gray-500">Or upload a file (.txt, .pdf, .docx)</span>
             <label className="cursor-pointer glass-button px-4 py-2 flex items-center gap-2 text-purple-400 hover:text-white transition-colors">
               <Upload className="w-4 h-4" />
               <span className="text-xs font-semibold uppercase tracking-wider">Upload File</span>
               <input 
                 type="file" 
                 accept=".txt,.pdf,.docx"
                 className="hidden"
                 onChange={(e) => handleFileUpload(e, setJobDescription)}
               />
             </label>
           </div>
        </div>

        <div className="md:col-span-2 flex justify-center mt-6">
          <button 
            type="submit" 
            disabled={!resumeText.trim() || !jobDescription.trim()}
            className="group relative px-8 py-4 bg-gradient-to-r from-neon-blue to-purple-600 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden flex items-center gap-3"
          >
            <span className="relative z-10 text-lg tracking-wide">Enter the Arena</span>
            <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-600 to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
          </button>
        </div>

      </form>
    </div>
  );
};

export default UploadScreen;
