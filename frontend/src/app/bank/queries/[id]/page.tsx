"use client";
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, X, MessageSquare, Bot, User, ShieldCheck, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReviewQueries({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [queries, setQueries] = useState<any[]>([]);
  const [rfp, setRfp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    if (id) {
      fetch(`${BACKEND_URL}/rfp/${id}`).then(res => res.json()).then(data => setRfp(data));
      // Fetch ALL queries (pending and answered) for the bank
      fetch(`${BACKEND_URL}/bank/queries/${id}`).then(res => res.json()).then(data => {
        setQueries(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleApprove = async (queryId: number, currentAnswer: string) => {
    setProcessing(queryId);
    try {
      const res = await fetch(`${BACKEND_URL}/bank/query/${queryId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved_answer: currentAnswer })
      });
      if (res.ok) {
        // Update local state to show it as answered
        setQueries(queries.map(q => q.id === queryId ? { ...q, status: 'answered' } : q));
      } else {
        alert("Failed to approve query.");
      }
    } catch (err) {
      alert("Network error while approving.");
    }
    setProcessing(null);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* Top Header */}
      <header className="bg-[#0a1628] h-[68px] px-8 flex items-center justify-between sticky top-0 z-10 shadow-xl shadow-black/20">
        <div className="flex items-center gap-4">
          <Link href="/bank?view=management" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 font-semibold text-sm">
            <ArrowLeft size={16} /> Back to My RFPs
          </Link>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#c8a96a]" />
            <h1 className="text-sm font-bold text-white tracking-widest uppercase">Compliance Review Portal</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-10 flex flex-col items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-[#c8a96a]" />
              <span className="text-[#c8a96a] text-xs font-bold uppercase tracking-widest">Action Required</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0a1628] tracking-tight">Vendor Clarifications</h1>
            <p className="text-slate-500 mt-2 font-medium">
              Review and approve AI-generated responses for RFP: <span className="text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-md">{rfp?.title}</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => <div key={i} className="h-64 skeleton bg-white rounded-3xl" />)}
          </div>
        ) : (
          <div className="space-y-6">
            {queries.map((q: any) => (
              <div key={q.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all overflow-hidden flex flex-col md:flex-row group">
                {/* Vendor Question Side */}
                <div className="px-8 py-8 flex-1 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col relative">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <User size={16} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question Provided</span>
                    </div>
                    {q.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                        <AlertCircle size={12} /> Pending Approval
                      </span>
                    )}
                    {q.status === 'answered' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        <Check size={12} /> Approved & Published
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-bold text-[#0a1628] leading-tight mb-2">{q.question}</p>
                </div>

                {/* AI Proposed Answer Side */}
                <div className={`p-8 flex-1 flex flex-col justify-between ${q.status === 'answered' ? 'bg-emerald-50/30' : 'bg-slate-50/50'}`}>
                  <div>
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${q.status === 'answered' ? 'bg-emerald-100 text-emerald-600' : 'bg-[#0a1628] text-[#c8a96a]'}`}>
                        <Bot size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Proposed Answer</span>
                        {q.is_duplicate && <p className="text-[9px] text-[#c8a96a] font-bold uppercase tracking-widest">Grounded Document Context</p>}
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-sm text-slate-700 leading-relaxed overflow-hidden">
                      <textarea
                        className="w-full h-full min-h-[100px] border-none focus:ring-0 resize-none p-0 text-sm bg-transparent font-medium"
                        defaultValue={q.status === 'answered' ? q.bank_answer || q.answer : q.answer}
                        disabled={q.status === 'answered' || processing === q.id}
                        id={`answer-input-${q.id}`}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  {q.status === 'pending' && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => {
                          const textArea = document.getElementById(`answer-input-${q.id}`) as HTMLTextAreaElement;
                          handleApprove(q.id, textArea.value);
                        }}
                        disabled={processing === q.id}
                        className="flex-1 py-3.5 bg-[#0a1628] hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                      >
                        {processing === q.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        {processing === q.id ? 'Approving...' : 'Approve & Publish'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {!loading && queries.length === 0 && (
              <div className="py-24 text-center bg-white border border-slate-200 rounded-3xl shadow-sm">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl mx-auto flex items-center justify-center text-slate-300 mb-5">
                  <MessageSquare size={30} />
                </div>
                <h3 className="text-xl font-bold text-[#0a1628] mb-2">No Clarifications Requested</h3>
                <p className="text-slate-500 font-medium">Vendors have not submitted any queries for this RFP yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
