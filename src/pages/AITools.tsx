/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, FileText, Send, Sparkles, Download, Copy, Check, ChevronRight, Loader2, FileDown } from 'lucide-react';
import { generateCV, generateCoverLetter } from '../services/geminiService';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { jsPDF } from 'jspdf';

type Tool = 'CV' | 'CoverLetter';

export function AITools() {
  const [activeTool, setActiveTool] = useState<Tool>('CV');
  const [selectedTemplate, setSelectedTemplate] = useState<'Modern' | 'Traditional' | 'Creative'>('Modern');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showFormats, setShowFormats] = useState(false);

  // Form states
  const [cvData, setCvData] = useState({
    fullName: '', email: '', phone: '', education: '', experience: '', skills: '', targetRole: ''
  });
  const [clData, setClData] = useState({
    fullName: '', 
    jobTitle: '', 
    companyName: '', 
    experienceSummary: '', 
    keySkills: '',
    hiringManager: '',
    companyValues: '',
    tone: 'Professional' as 'Professional' | 'Enthusiastic' | 'Confident'
  });

  const handleGenerateCV = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const cv = await generateCV({ ...cvData, template: selectedTemplate });
      setResult(cv || 'No content generated');
    } catch (err) {
      alert('Failed to generate CV. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCL = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const cl = await generateCoverLetter(clData);
      setResult(cl || 'No content generated');
    } catch (err) {
      alert('Failed to generate Cover Letter. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = (format: 'txt' | 'pdf' | 'docx' | 'md') => {
    if (!result) return;
    
    const fileName = `${activeTool}_Nigerian_JobPortal`;
    
    if (format === 'pdf') {
      const doc = new jsPDF();
      
      // Basic text wrapping for jsPDF
      const splitText = doc.splitTextToSize(result, 180);
      doc.text(splitText, 10, 10);
      doc.save(`${fileName}.pdf`);
    } else {
      let type = 'text/plain';
      let extension: string = format;
      
      if (format === 'md') type = 'text/markdown';
      if (format === 'docx') {
        type = 'application/msword';
        extension = 'doc'; // Using .doc for accessibility
      }

      const element = document.createElement("a");
      const file = new Blob([result], {type: type});
      element.href = URL.createObjectURL(file);
      element.download = `${fileName}.${extension}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    setShowFormats(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center md:justify-start gap-4">
             AI Career Suite <Sparkles className="w-8 h-8 text-emerald-500" />
          </h1>
          <p className="text-gray-500 max-w-xl font-sans">
            Use the power of Generative AI to create professional documents tailored for the Nigerian corporate world.
          </p>
        </div>
        
        <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl">
          {(['CV', 'CoverLetter'] as Tool[]).map((tool) => (
            <button
              key={tool}
              onClick={() => { setActiveTool(tool); setResult(null); }}
              className={cn(
                "px-8 py-3 rounded-xl text-sm font-bold transition-all",
                activeTool === tool 
                  ? "bg-white text-emerald-600 shadow-md" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              )}
            >
              {tool === 'CV' ? 'CV Generator' : 'Cover Letter'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Form Column */}
        <motion.div 
          key={activeTool}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-200"
        >
          {activeTool === 'CV' ? (
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">Choose Template Style</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Modern', 'Traditional', 'Creative'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTemplate(t)}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-left",
                        selectedTemplate === t 
                          ? "border-emerald-600 bg-emerald-50" 
                          : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <div className={cn(
                        "text-sm font-bold mb-1",
                        selectedTemplate === t ? "text-emerald-700" : "text-slate-700"
                      )}>{t}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        {t === 'Modern' && 'Clean & Bold'}
                        {t === 'Traditional' && 'Professional'}
                        {t === 'Creative' && 'Personality'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleGenerateCV} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" value={cvData.fullName} onChange={(v) => setCvData({...cvData, fullName: v})} placeholder="e.g. Adeola Okafor" />
                <Input label="Target Role" value={cvData.targetRole} onChange={(v) => setCvData({...cvData, targetRole: v})} placeholder="e.g. Marketing Manager" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Email" value={cvData.email} onChange={(v) => setCvData({...cvData, email: v})} placeholder="adeola@example.com" />
                <Input label="Phone" value={cvData.phone} onChange={(v) => setCvData({...cvData, phone: v})} placeholder="+234..." />
              </div>
              <Textarea label="Education" value={cvData.education} onChange={(v) => setCvData({...cvData, education: v})} placeholder="e.g. BSc Economics, University of Ibadan (2018 - 2022)" />
              <Textarea label="Work Experience" value={cvData.experience} onChange={(v) => setCvData({...cvData, experience: v})} placeholder="List your previous roles and key achievements..." rows={4} />
              <Textarea label="Skills (comma separated)" value={cvData.skills} onChange={(v) => setCvData({...cvData, skills: v})} placeholder="Project Management, Python, Team Leadership..." />
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-5 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Generate Professional CV</>}
              </button>
            </form>
          </div>
          ) : (
            <form onSubmit={handleGenerateCL} className="space-y-6">
              <Input label="Full Name" value={clData.fullName} onChange={(v) => setClData({...clData, fullName: v})} placeholder="e.g. Chinedu Balogun" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Job Title Applying For" value={clData.jobTitle} onChange={(v) => setClData({...clData, jobTitle: v})} placeholder="e.g. Sales Executive" />
                <Input label="Company Name" value={clData.companyName} onChange={(v) => setClData({...clData, companyName: v})} placeholder="e.g. Zenith Bank" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Hiring Manager (Optional)" value={clData.hiringManager} onChange={(v) => setClData({...clData, hiringManager: v})} placeholder="e.g. Mrs. Adeoye" />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">Cover Letter Tone</label>
                  <div className="flex gap-2">
                    {(['Professional', 'Enthusiastic', 'Confident'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setClData({...clData, tone: t})}
                        className={cn(
                          "px-3 py-2 rounded-xl text-[10px] font-bold border transition-all flex-1",
                          clData.tone === t 
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                            : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Input label="Company Values/Mission (To Tailor Content)" value={clData.companyValues} onChange={(v) => setClData({...clData, companyValues: v})} placeholder="e.g. Innovation, Customer First, Integrity" />

              <Textarea label="Brief Summary of Experience" value={clData.experienceSummary} onChange={(v) => setClData({...clData, experienceSummary: v})} placeholder="What makes you the best fit for this role?" rows={4} />
              <Textarea label="Key Achievements to Highlight" value={clData.keySkills} onChange={(v) => setClData({...clData, keySkills: v})} placeholder="Mention 3-4 top achievements or relevant projects..." />
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-5 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Generate Professional Cover Letter</>}
              </button>
            </form>
          )}
        </motion.div>

        {/* Result Column */}
        <div className="lg:sticky lg:top-24">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center h-[600px]"
              >
                 <div className="w-20 h-20 bg-indigo-50 rounded-3xl shadow-sm flex items-center justify-center text-indigo-500 mb-6 font-bold">
                    AI
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to Build</h3>
                 <p className="text-slate-500 font-sans max-w-xs mb-8">Fill out the form to generate a professionally indexed document tailored for the Nigerian market.</p>
                 <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-300 animate-bounce delay-0" />
                    <div className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce delay-75" />
                    <div className="w-2 h-2 rounded-full bg-emerald-300 animate-bounce delay-150" />
                 </div>
              </motion.div>
            ) : loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-emerald-900 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center h-[600px] border border-emerald-800"
              >
                 <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mb-6" />
                 <h3 className="text-2xl font-bold text-white mb-2">Gemini is Thinking...</h3>
                 <p className="text-emerald-100/60 font-sans max-w-xs">Our AI is crafting your document. This usually takes just a few seconds.</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]"
              >
                 <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
                    <h4 className="font-bold flex items-center gap-2 tracking-tight">
                       <Check className="w-5 h-5 p-1 bg-white text-emerald-600 rounded-full" />
                       Content Ready
                    </h4>
                    <div className="flex gap-2 relative">
                       <div className="relative">
                          <button 
                            onClick={() => setShowFormats(!showFormats)}
                            title="Download Options"
                            className="p-2 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          
                          <AnimatePresence>
                            {showFormats && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 min-w-[160px]"
                              >
                                {(['txt', 'pdf', 'docx', 'md'] as const).map((fmt) => (
                                  <button
                                    key={fmt}
                                    onClick={() => handleDownload(fmt)}
                                    className="w-full text-left px-5 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 text-sm font-bold flex items-center justify-between border-b last:border-0 border-slate-50 transition-colors"
                                  >
                                    .{fmt.toUpperCase()}
                                    <FileDown className="w-4 h-4 opacity-40" />
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>
                       
                       <button 
                         onClick={handleCopy}
                         title="Copy to clipboard"
                         className="p-2 hover:bg-emerald-500 rounded-lg transition-colors relative"
                       >
                         {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                       </button>
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto p-12 prose prose-emerald max-w-none prose-sm font-sans">
                    <Markdown>{result!}</Markdown>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string, value: string, placeholder: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-300"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }: { label: string, value: string, placeholder: string, rows?: number, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block pl-1">{label}</label>
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        rows={rows}
        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-300 resize-none"
      />
    </div>
  );
}
