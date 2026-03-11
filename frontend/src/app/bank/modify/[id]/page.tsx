"use client";
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, AlertCircle, FileText, Send, CheckCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ModifyRFP({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  
  const [rfp, setRfp] = useState<any>(null);
  const [changeSummary, setChangeSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfKey, setPdfKey] = useState(0); // For refreshing the PDF iframe

  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    fetch(`${BACKEND_URL}/rfp/${id}`)
      .then(res => res.json())
      .then(data => {
        setRfp(data);
      });
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeSummary.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/rfp/update/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updated_content: null, // Force AI to generate updated content
          change_summary: changeSummary
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setRfp(data.updated_rfp);
        setChangeSummary("");
        setPdfKey(prev => prev + 1); // Refresh the PDF viewer
        alert('Intelligent Update Applied! PDF and Corrigendum generated.');
      }
    } catch (err) {
      alert('Error applying intelligent update.');
    }
    setLoading(false);
  };

  if (!rfp) return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center text-white gap-4">
      <Loader2 size={32} className="animate-spin text-[#c8a96a]" />
      <p className="text-slate-400 font-semibold tracking-widest text-sm uppercase">Synchronizing Secure Stream...</p>
    </div>
  );

  return (
    <div className="h-screen bg-[#f0f4f8] flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-[#0a1628] h-[70px] px-8 flex items-center justify-between shrink-0 shadow-2xl z-10">
        <div className="flex items-center gap-6">
          <Link href="/bank?view=management" className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all">
            <ArrowLeft size={22} />
          </Link>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <h1 className="text-lg font-black text-white tracking-tight">AI Command Center: <span className="text-[#c8a96a] font-bold">REVISION MODE</span></h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{rfp.title} · RFP #{rfp.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <CheckCircle size={14} /> System Online
            </div>
            <Link 
                href="/bank" 
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 transition-all"
            >
                Exit Session
            </Link>
        </div>
      </header>

      {/* Main Content: Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: LIVE PDF PREVIEW */}
        <div className="w-[60%] bg-[#1e1e2e] relative border-r border-slate-200 flex flex-col shadow-inner">
          <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
             <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center gap-3 border border-white/20">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Live Document Preview</span>
             </div>
             <button 
                onClick={() => setPdfKey(k => k + 1)}
                className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
                title="Force Refresh Preview"
             >
                <RefreshCw size={14} />
             </button>
          </div>

          <iframe
            key={pdfKey}
            src={`${BACKEND_URL}${rfp.pdf_url}#toolbar=0&navpanes=0`}
            className="w-full h-full border-none"
            title="Current RFP Version"
          />

          <div className="absolute bottom-8 right-8 px-6 py-3 bg-slate-900/80 backdrop-blur-lg text-white rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Current Status</p>
                    <p className="text-xs font-black text-[#c8a96a] uppercase">{rfp.status}</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <FileText size={20} className="text-white/40" />
            </div>
          </div>
        </div>

        {/* RIGHT: AI REVISION ENGINE */}
        <div className="w-[40%] bg-white flex flex-col shadow-[-20px_0_50px_-10px_rgba(0,0,0,0.05)] overflow-y-auto custom-scrollbar">
          <div className="p-10 space-y-10">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 text-white">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Intelligent RFP Update</h2>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Type your desired changes in plain English. The AI will surgically update the document structure, regenerate the official PDF, and draft a formal Corrigendum Notice for all vendors.
              </p>
            </div>

            {/* Instruction Box */}
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Revision Instructions</label>
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest">Natural Language Processing</span>
                </div>
                <div className="relative group">
                  <textarea 
                    rows={6}
                    disabled={loading}
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white outline-none transition-all resize-none shadow-sm group-hover:border-slate-200"
                    placeholder="e.g., Change the technical evaluation weightage to 80% and the submission deadline to May 20th. Also, add a clause requiring ISO 27001 certification."
                    value={changeSummary}
                    onChange={e => setChangeSummary(e.target.value)}
                    required
                  />
                  <div className="absolute bottom-6 right-6 p-2 bg-indigo-100 text-indigo-600 rounded-xl opacity-40 group-focus-within:opacity-100 transition-opacity">
                    <Send size={16} />
                  </div>
                </div>
              </div>

              {/* Impact Warning */}
              <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-200">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest mb-1">Impact Warning</h4>
                    <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                        This update will be published instantly. All registered vendors will receive an official notification and the AI RAG engine will be re-synchronized to this version.
                    </p>
                </div>
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                disabled={loading || !changeSummary.trim()}
                className="w-full py-5 bg-[#0a1628] hover:bg-indigo-700 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:bg-slate-200 disabled:shadow-none active:scale-[0.98] group"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={20} /> Optimizing Document Structure...</>
                ) : (
                  <><Sparkles size={20} className="group-hover:rotate-12 transition-transform" /> Apply Intelligent Update</>
                )}
              </button>
            </form>

            <div className="pt-6 border-t border-slate-100">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <AlertCircle size={14} /> Revision History (Audit Trail)
               </div>
               <div className="mt-4 space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between opacity-60">
                     <span className="text-[10px] font-bold text-slate-600 uppercase">Original Document Issued</span>
                     <span className="text-[9px] text-slate-400 font-bold">{rfp.created_at ? new Date(rfp.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
