"use client";
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, FileText, Send, CheckCircle, RefreshCw, Edit3, Settings, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ModifyRFP({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  
  const [rfp, setRfp] = useState<any>(null);
  const [changeSummary, setChangeSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfKey, setPdfKey] = useState(0); 

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
          updated_content: null, 
          change_summary: changeSummary
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setRfp(data.updated_rfp);
        setChangeSummary("");
        setPdfKey(prev => prev + 1); 
        alert('Amendment Issued! The official PDF and Corrigendum notice have been automatically generated.');
      }
    } catch (err) {
      alert('Error applying institutional amendment.');
    }
    setLoading(false);
  };

  if (!rfp) return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center text-white gap-6">
      <Loader2 size={40} className="animate-spin text-[#c8a96a]" />
      <p className="text-slate-400 font-bold tracking-[0.2em] text-xs uppercase">Initializing Secure Container...</p>
    </div>
  );

  return (
    <div className="h-screen bg-[#f0f4f8] flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-[#0a1628] h-[76px] px-8 flex items-center justify-between shrink-0 shadow-xl z-20 border-b border-white/5">
        <div className="flex items-center gap-6">
          <Link href="/bank?view=management" className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <h1 className="text-md font-black text-white tracking-tight">Institutional Control: <span className="text-[#c8a96a]">AMENDMENT MODE</span></h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">{rfp.title} · RFP #00{rfp.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <CheckCircle size={14} /> System Online
            </div>
            <Link 
                href="/bank?view=management" 
                className="px-6 py-2.5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-600 hover:border-white/20"
            >
                Exit Session
            </Link>
        </div>
      </header>

      {/* Main Content: Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: LIVE PDF PREVIEW */}
        <div className="w-[60%] lg:w-[65%] bg-[#1e1e2e] relative border-r border-[#c8a96a]/10 flex flex-col shadow-inner">
          <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
             <div className="px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-[#c8a96a] animate-pulse" />
                <span className="text-[10px] font-black text-[#0a1628] uppercase tracking-widest">Active Document Configuration</span>
             </div>
             <button 
                onClick={() => setPdfKey(k => k + 1)}
                className="p-2.5 bg-white text-slate-500 hover:text-[#0a1628] rounded-xl shadow-lg hover:bg-slate-50 transition-all border border-slate-200 active:scale-95"
                title="Force Refresh Preview"
             >
                <RefreshCw size={16} />
             </button>
          </div>

          <iframe
            key={pdfKey}
            src={`${BACKEND_URL}${rfp.pdf_url}?t=${Date.now()}#toolbar=0&navpanes=0`}
            className="w-full h-full border-none bg-slate-100"
            title="Current RFP Version"
          />

          <div className="absolute bottom-6 right-6 px-6 py-4 bg-[#0a1628]/90 backdrop-blur-xl text-white rounded-[1.5rem] border border-[#c8a96a]/20 shadow-2xl">
            <div className="flex items-center gap-5">
                <div className="text-right">
                     <p className="text-[9px] text-[#c8a96a]/80 font-black uppercase tracking-widest mb-0.5">Registry Status</p>
                    <p className="text-xs font-black text-white uppercase">{rfp.status}</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                     <FileText size={18} className="text-[#c8a96a]" />
                </div>
            </div>
          </div>
        </div>

        {/* RIGHT: AMENDMENT ENGINE */}
        <div className="w-[40%] lg:w-[35%] bg-white flex flex-col shadow-[-20px_0_50px_-10px_rgba(0,0,0,0.05)] overflow-y-auto custom-scrollbar">
          <div className="p-10 space-y-10">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-[#c8a96a]/10 to-[#e8c97a]/10 border border-[#c8a96a]/20 rounded-2xl flex items-center justify-center shadow-sm text-[#c8a96a]">
                  <Edit3 size={20} />
                </div>
                <h2 className="text-xl font-black text-[#0a1628] tracking-tight">Document Amendment Console</h2>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-100">
                Issue precise modification directives below. The subsystem will surgically update the technical architecture, regenerate the master PDF, and draft a formal <strong className="text-[#0a1628]">Corrigendum Notice</strong> for public broadcast.
              </p>
            </div>

            {/* Instruction Box */}
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <Settings size={12} /> Amendment Directives
                  </label>
                  <span className="text-[9px] font-black text-[#0a1628] bg-[#c8a96a]/10 px-3 py-1 rounded-full uppercase tracking-widest border border-[#c8a96a]/20">Official Change Log</span>
                </div>
                <div className="relative group">
                  <textarea 
                    rows={7}
                    disabled={loading}
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-[#c8a96a]/10 focus:border-[#c8a96a] focus:bg-white outline-none transition-all resize-none shadow-inner"
                    placeholder="e.g., Modify the technical evaluation weightage to 80% and extend the submission deadline by 14 days. Append mandatory ISO 27001 data sovereignty compliance."
                    value={changeSummary}
                    onChange={e => setChangeSummary(e.target.value)}
                    required
                  />
                  <div className={`absolute bottom-6 right-6 p-2.5 rounded-xl transition-all ${changeSummary.trim() ? 'bg-[#c8a96a] text-[#0a1628] shadow-md shadow-amber-900/20' : 'bg-slate-200 text-slate-400'}`}>
                    <Send size={16} className={changeSummary.trim() ? 'translate-x-[1px] -translate-y-[1px]' : ''} />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                disabled={loading || !changeSummary.trim()}
                className="w-full py-5 bg-[#0a1628] hover:bg-[#122654] text-[#c8a96a] rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-[#0a1628]/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] border border-[#c8a96a]/20 group"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={18} /> Compiling Official Amendment...</>
                ) : (
                  <><ShieldCheck size={18} /> Issue Formal Corrigendum</>
                )}
              </button>
            </form>

            <div className="pt-8 border-t border-slate-100">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">
                  <AlertCircle size={14} /> Cryptographic Audit Trail
               </div>

               {/* Impact Warning Card */}
               <div className="mb-6 p-6 bg-[#c8a96a]/5 rounded-3xl border border-[#c8a96a]/15 flex gap-4">
                 <div className="w-10 h-10 bg-[#c8a96a]/10 text-[#c8a96a] rounded-2xl flex items-center justify-center shrink-0">
                     <AlertCircle size={18} />
                 </div>
                 <div>
                     <h4 className="text-[10px] font-black text-[#0a1628] uppercase tracking-widest mb-1.5">Broadcast Warning</h4>
                     <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                         Execution constitutes a binding update. Registered vendors will be instantly notified via secure channels and the institutional index will sync automatically.
                     </p>
                 </div>
               </div>

               <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between opacity-70">
                     <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Original Issuance
                     </span>
                     <span className="text-[9px] text-slate-400 font-black tracking-widest">{rfp.created_at ? new Date(rfp.created_at).toLocaleDateString('en-IN') : 'N/A'}</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
