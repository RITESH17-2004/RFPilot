"use client";
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, AlertCircle, FileText, Send, CheckCircle, RefreshCw, Rocket, Save } from 'lucide-react';
import Link from 'next/link';

export default function ReviewAndPublishRFP({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  
  const [rfp, setRfp] = useState<any>(null);
  const [changeInstruction, setChangeInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [pdfKey, setPdfKey] = useState(0); 

  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    fetch(`${BACKEND_URL}/rfp/${id}`)
      .then(res => res.json())
      .then(data => {
        setRfp(data);
      });
  }, [id]);

  const handleSilentUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeInstruction.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/rfp/draft/update/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updated_content: null,
          change_summary: changeInstruction
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setRfp(data);
        setChangeInstruction("");
        setPdfKey(prev => prev + 1);
        alert('Draft Refined! PDF updated (No corrigendum issued for this internal change).');
      }
    } catch (err) {
      alert('Error updating draft.');
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`${BACKEND_URL}/rfp/publish/${id}`, {
        method: 'POST'
      });
      if (res.ok) {
        alert('RFP Published Successfully! It is now live for vendors and RAG context is initialized.');
        router.push('/bank?view=management');
      }
    } catch (err) {
      alert('Error publishing RFP.');
    }
    setPublishing(false);
  };

  if (!rfp) return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center text-white gap-4">
      <Loader2 size={32} className="animate-spin text-[#c8a96a]" />
      <p className="text-slate-400 font-semibold tracking-widest text-sm uppercase">Loading Draft Instance...</p>
    </div>
  );

  return (
    <div className="h-screen bg-[#f0f4f8] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[#0a1628] h-[70px] px-8 flex items-center justify-between shrink-0 shadow-2xl z-10">
        <div className="flex items-center gap-6">
          <Link href="/bank?view=management" className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all">
            <ArrowLeft size={22} />
          </Link>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <h1 className="text-lg font-black text-white tracking-tight">Stage: <span className="text-[#c8a96a]">REVIEW & RELEASE</span></h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{rfp.title} · #00{rfp.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle size={14} /> Internal Review
            </div>
            <button 
                onClick={handlePublish}
                disabled={publishing || loading}
                className="px-8 py-2.5 bg-gradient-to-br from-[#c8a96a] to-[#e8c97a] hover:from-[#b8993a] hover:to-[#d8b96a] text-[#0a1628] rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-900/20 flex items-center gap-2 disabled:opacity-50"
            >
                {publishing ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />}
                Publish Official RFP
            </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* PDF PREVIEW */}
        <div className="w-[60%] bg-[#1e1e2e] relative border-r border-slate-200 flex flex-col">
          <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
             <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center gap-3 border border-white/20">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Draft Preview (Private)</span>
             </div>
             <button onClick={() => setPdfKey(k => k + 1)} className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all">
                <RefreshCw size={14} />
             </button>
          </div>

          <iframe
            key={pdfKey}
            src={`${BACKEND_URL}${rfp.pdf_url}#toolbar=0&navpanes=0`}
            className="w-full h-full border-none"
            title="Draft Preview"
          />
        </div>

        {/* AI EDITOR CONTROLS */}
        <div className="w-[40%] bg-white flex flex-col shadow-[-20px_0_50px_-10px_rgba(0,0,0,0.05)] overflow-y-auto custom-scrollbar">
          <div className="p-10 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg text-white">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Refine Draft Structure</h2>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Review the document on the left. Changes made here are <strong>internal only</strong> and will not generate a corrigendum. Use this to perfect the document before release.
              </p>
            </div>

            <form onSubmit={handleSilentUpdate} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Surgical Refinement Instructions</label>
                <div className="relative group">
                  <textarea 
                    rows={6}
                    disabled={loading || publishing}
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white outline-none transition-all resize-none shadow-sm"
                    placeholder="e.g., Update the technical evaluation matrix to include a 10% weightage for past banking experience and 5% for local support presence."
                    value={changeInstruction}
                    onChange={e => setChangeInstruction(e.target.value)}
                  />
                  <div className="absolute bottom-6 right-6 p-2 bg-indigo-100 text-indigo-600 rounded-xl opacity-40">
                    <Send size={16} />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || publishing || !changeInstruction.trim()}
                className="w-full py-5 bg-[#0a1628] hover:bg-indigo-700 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl flex items-center justify-center gap-3 disabled:bg-slate-200"
              >
                {loading ? <><Loader2 className="animate-spin" size={20} /> Refining Document...</> : <><Save size={20} /> Save Changes to Draft</>}
              </button>
            </form>

            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
                <h4 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FileText size={14} className="text-[#c8a96a]" /> Final Compliance Check
                </h4>
                <p className="text-[11px] text-slate-400 leading-loose">
                    This document includes standard bank disclaimers and follows World Bank procurement frameworks. Ensure all technical specifications align with your department's security policy.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
