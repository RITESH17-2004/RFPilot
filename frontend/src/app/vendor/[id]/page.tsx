"use client";
import { useEffect, useState, use } from 'react';
import { ArrowLeft, Send, MessageSquare, AlertTriangle, FileText, Download, Info, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function VendorRFPDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [rfp, setRfp] = useState<any>(null);
  const [queries, setQueries] = useState<any[]>([]);
  const [newQuery, setNewQuery] = useState("");
  const [asking, setAsking] = useState(false);
  const [corrigenda, setCorrigenda] = useState<any[]>([]);

  const [selectedCorrigendum, setSelectedCorrigendum] = useState<any>(null);

  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    if (id) {
      fetch(`${BACKEND_URL}/rfp/${id}`).then(res => res.json()).then(data => setRfp(data));
      fetch(`${BACKEND_URL}/vendor/queries/${id}`).then(res => res.json()).then(data => setQueries(data));
      fetch(`${BACKEND_URL}/rfp/${id}/corrigenda`).then(res => res.json()).then(data => setCorrigenda(data));
    }
  }, [id]);

  const handleAskQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuery.trim()) return;
    setAsking(true);
    try {
      const res = await fetch(`${BACKEND_URL}/vendor/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfp_id: Number(id), question: newQuery })
      });
      const data = await res.json();
      setQueries([...queries, data]);
      setNewQuery("");
    } catch { alert("Error asking query."); }
    setAsking(false);
  };

  if (!rfp) return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center text-white gap-4">
      <Loader2 size={32} className="animate-spin text-[#c8a96a]" />
      <p className="text-slate-400 font-semibold tracking-widest text-sm uppercase">Loading RFP Document...</p>
    </div>
  );

  return (
    <div className="h-screen bg-[#f0f4f8] flex flex-col overflow-hidden relative">
      {/* Modal for Full Corrigendum Notice */}
      {selectedCorrigendum && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0a1628]/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 leading-tight">Official Corrigendum Notice</h2>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Amendment Version {selectedCorrigendum.version}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCorrigendum(null)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all"
              >
                <ArrowLeft size={20} className="rotate-90" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 prose prose-slate max-w-none">
              <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em] mb-1">Executive Summary of Changes</h4>
                <p className="text-sm font-bold text-slate-800 leading-relaxed">{selectedCorrigendum.change_summary}</p>
              </div>
              <div className="whitespace-pre-wrap text-sm text-slate-600 leading-loose font-medium">
                {selectedCorrigendum.full_notice}
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <Info size={14} /> Issued on {new Date(selectedCorrigendum.created_at).toLocaleDateString()}
              </div>
              <button 
                onClick={() => setSelectedCorrigendum(null)}
                className="px-6 py-2.5 bg-[#0a1628] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                Acknowledge Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <header className="bg-[#0a1628] h-[60px] px-6 flex items-center justify-between shrink-0 shadow-xl shadow-black/20">
        <div className="flex items-center gap-4">
          <Link href="/vendor" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <h1 className="text-sm font-bold text-white line-clamp-1">{rfp.title}</h1>
            <p className="text-[10px] text-[#c8a96a] font-bold uppercase tracking-widest">RFP #{rfp.id} · Secure Document Stream</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            {corrigenda.length > 0 && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] font-black text-amber-500 uppercase tracking-widest">
                    <AlertTriangle size={12} /> {corrigenda.length} AMENDMENTS ACTIVE
                </div>
            )}
            <a
            href={`${BACKEND_URL}${rfp.pdf_url}`}
            download
            className="flex items-center gap-2 px-4 py-2 bg-[#c8a96a] hover:bg-[#b8993a] text-[#0a1628] rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-900/20"
            >
            <Download size={14} /> Download PDF
            </a>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left: PDF Viewer */}
        <div className="w-[62%] bg-[#1e1e2e] relative border-r border-[#0a1628]/40 flex flex-col">
          <iframe
            src={`${BACKEND_URL}${rfp.pdf_url}#toolbar=0&navpanes=0`}
            className="w-full flex-1 border-none"
            title="RFP Document Viewer"
          />
          <div className="absolute bottom-5 left-5 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md text-white rounded-full text-[10px] font-bold border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AES-256 Encrypted · Secure Viewer</span>
          </div>
        </div>

        {/* Right: Intelligence Panel */}
        <div className="w-[38%] flex flex-col bg-white overflow-hidden">

          {/* Corrigenda Section - PROFESSIONAL ENHANCEMENT */}
          <div className={`shrink-0 border-b border-slate-100 flex flex-col max-h-[42%] ${corrigenda.length > 0 ? 'bg-slate-50/50' : 'bg-slate-50/20'}`}>
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-200/60 bg-white">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${corrigenda.length > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-300'}`}>
                    <AlertTriangle size={16} />
                </div>
                <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Regulatory Updates</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Official Amendments & Corrigenda</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border ${corrigenda.length > 0 ? 'bg-amber-500 border-amber-600 text-white shadow-sm shadow-amber-200' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                {corrigenda.length} ISSUED
              </span>
            </div>
            
            <div className="overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
              {corrigenda.map((c: any) => (
                <button 
                    key={c.id} 
                    onClick={() => setSelectedCorrigendum(c)}
                    className="w-full group text-left bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md hover:shadow-amber-100 transition-all relative overflow-hidden active:scale-[0.98]"
                >
                  <div className="absolute top-0 right-0 p-1 bg-amber-500 text-white rounded-bl-lg transform translate-x-8 group-hover:translate-x-0 transition-transform">
                    <Info size={10} />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">V{c.version} AMENDMENT</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-md">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 group-hover:text-amber-700 transition-colors line-clamp-1 mb-1.5">{c.change_summary}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1 italic">Click to view official change notice...</p>
                    <ArrowLeft size={12} className="rotate-180 text-slate-300 group-hover:text-amber-500 transition-colors" />
                  </div>
                </button>
              ))}
              
              {corrigenda.length === 0 && (
                <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center bg-white/50">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <FileText size={20} className="text-slate-200" />
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Compliance Status: No Changes</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Chat Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 bg-white">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200">
                <MessageSquare size={13} className="text-white" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800">AI RAG Assistant</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Answers grounded in RFP source content</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/40">
              {queries.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 opacity-70">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                    <MessageSquare size={24} className="text-slate-300" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Ask a question about<br />this RFP document
                  </p>
                </div>
              )}
              {queries.map((q: any) => (
                <div key={q.id} className="space-y-3">
                  {/* User question */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-[#0a1628] text-white px-4 py-3 rounded-2xl rounded-tr-sm text-xs font-medium leading-relaxed shadow-sm">
                      {q.question}
                    </div>
                  </div>
                  {/* AI Answer */}
                  <div className="flex justify-start">
                    <div className="max-w-[90%]">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-5 h-5 bg-indigo-600 rounded-md flex items-center justify-center">
                          <MessageSquare size={10} className="text-white" />
                        </div>
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">AI Officer</span>
                        {q.is_duplicate && (
                          <span className="flex items-center gap-0.5 text-[9px] font-bold text-slate-400">
                            <CheckCircle size={9} /> Cached
                          </span>
                        )}
                      </div>
                      <div className="bg-white text-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm text-xs leading-relaxed border border-slate-200 shadow-sm">
                        {q.answer || (
                          <span className="text-slate-400 italic flex items-center gap-2">
                            <Loader2 size={12} className="animate-spin" /> Awaiting bank approval...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleAskQuery} className="relative">
                <textarea
                  rows={2}
                  placeholder="Ask about compliance, technical requirements..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-4 pr-14 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  value={newQuery}
                  onChange={e => setNewQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAskQuery(e as any); } }}
                />
                <button
                  disabled={asking || !newQuery.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#0a1628] text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                >
                  {asking ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
