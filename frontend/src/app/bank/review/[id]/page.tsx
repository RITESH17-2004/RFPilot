"use client";
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, FileText, Send, CheckCircle, RefreshCw, Rocket, Save, PenTool, Settings } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center text-white gap-6">
      <Loader2 size={40} className="animate-spin text-[#c8a96a]" />
      <p className="text-slate-400 font-bold tracking-[0.2em] text-xs uppercase">Loading Institutional Draft...</p>
    </div>
  );

  return (
    <div className="h-screen bg-[#f0f4f8] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[#0a1628] h-[76px] px-8 flex items-center justify-between shrink-0 shadow-xl z-20 border-b border-white/5">
        <div className="flex items-center gap-6">
          <Link href="/bank?view=management" className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <h1 className="text-md font-black text-white tracking-tight">Stage: <span className="text-[#c8a96a]">REVIEW & RELEASE</span></h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">{rfp.title} · #00{rfp.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
            <div className="px-4 py-2 bg-[#c8a96a]/10 border border-[#c8a96a]/20 text-[#c8a96a] rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle size={14} /> Internal Review
            </div>
            <button 
                onClick={handlePublish}
                disabled={publishing || loading}
                className="px-8 py-3 bg-[#c8a96a] hover:bg-[#b8995a] text-[#0a1628] rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all shadow-lg shadow-amber-900/20 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-[#e8c97a]/40 active:scale-[0.98]"
            >
                {publishing ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
                Publish Institutional RFP
            </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* PDF PREVIEW */}
        <div className="w-[60%] lg:w-[65%] bg-[#1e1e2e] relative border-r border-[#c8a96a]/10 flex flex-col shadow-inner">
          <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
             <div className="px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-[#c8a96a] animate-pulse" />
                <span className="text-[10px] font-black text-[#0a1628] uppercase tracking-widest">Draft Preview (Private)</span>
             </div>
             <button onClick={() => setPdfKey(k => k + 1)} className="p-2.5 bg-white text-slate-500 hover:text-[#0a1628] rounded-xl shadow-lg hover:bg-slate-50 transition-all border border-slate-200" title="Refresh Preview">
                <RefreshCw size={16} />
             </button>
          </div>

          <iframe
            key={pdfKey}
            src={`${BACKEND_URL}${rfp.pdf_url}?t=${Date.now()}#toolbar=0&navpanes=0`}
            className="w-full h-full border-none"
            title="Draft Preview"
          />
        </div>

        {/* EDITOR CONTROLS */}
        <div className="w-[40%] lg:w-[35%] bg-white flex flex-col shadow-[-20px_0_50px_-10px_rgba(0,0,0,0.05)] overflow-y-auto custom-scrollbar">
          <div className="p-10 space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-[#c8a96a]/10 to-[#e8c97a]/10 border border-[#c8a96a]/20 rounded-2xl flex items-center justify-center shadow-sm text-[#c8a96a]">
                  <PenTool size={20} />
                </div>
                <h2 className="text-xl font-black text-[#0a1628] tracking-tight">Document Revision Console</h2>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-100">
                Review the generated document. Structural modifications engineered here are <strong className="text-[#0a1628]">internal only</strong> and will not generate a public corrigendum. Execute revisions prior to final publishing.
              </p>
            </div>

            <form onSubmit={handleSilentUpdate} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Settings size={12} /> Revision Directives
                </label>
                <div className="relative group">
                  <textarea 
                    rows={7}
                    disabled={loading || publishing}
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-[#c8a96a]/10 focus:border-[#c8a96a] focus:bg-white outline-none transition-all resize-none shadow-inner"
                    placeholder="e.g., Modify the Technical Evaluation Matrix to assign a 15% weightage to Data Security protocols..."
                    value={changeInstruction}
                    onChange={e => setChangeInstruction(e.target.value)}
                  />
                  <div className={`absolute bottom-6 right-6 p-2.5 rounded-xl transition-all ${changeInstruction.trim() ? 'bg-[#c8a96a] text-[#0a1628] shadow-md shadow-amber-900/20' : 'bg-slate-200 text-slate-400'}`}>
                    <Send size={16} className={changeInstruction.trim() ? 'translate-x-[1px] -translate-y-[1px]' : ''} />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || publishing || !changeInstruction.trim()}
                className="w-full py-5 bg-[#0a1628] hover:bg-[#122654] text-[#c8a96a] rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-[#0a1628]/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] border border-[#c8a96a]/20"
              >
                {loading ? <><Loader2 className="animate-spin" size={18} /> Compiling Revision...</> : <><Save size={18} /> Execute Revision</>}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
