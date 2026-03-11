"use client";
import Link from 'next/link';
import { Building2, Store, Sparkles, ShieldCheck, Zap, Brain, Clock, FileCheck, ArrowRight, ChevronRight, Globe, Lock, Cpu, BarChart3, Search, MessageCircle, FileText, CheckCircle, Database, Network, Scale, Code, GitMerge, FileSearch, CheckCircle2, History, Users, Layers } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-x-hidden relative text-slate-900 font-sans selection:bg-[#0033a0] selection:text-white">
      
      {/* BACKGROUND AMBIENCE */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] -left-[5%] w-[60%] h-[60%] rounded-full bg-blue-100/30 blur-[120px] animate-pulse" />
        <div className="absolute top-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-indigo-50/40 blur-[100px] animate-pulse delay-700" />
      </div>

      {/* NAVIGATION */}
      <nav className="relative z-50 max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-[#0033a0] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-black text-2xl tracking-tighter">IB</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-black tracking-tighter uppercase leading-none text-[#0a1628]">Indian <span className="text-blue-600">Bank</span></span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 leading-none">RFP Intel Engine</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-10">
            <Link href="/login?role=vendor" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-[#0033a0] transition-all">Partner Portal</Link>
            <Link href="/login?role=bank" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-[#0033a0] transition-all">Admin Terminal</Link>
            <Link href="/signup" className="px-8 py-3.5 bg-white border border-slate-200 shadow-sm rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Establish Credentials</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-24 text-left">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-32">
            
            <div className="lg:w-3/5">
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border border-blue-100 bg-blue-50/50 text-[#0033a0] text-xs font-black uppercase tracking-[0.1em] mb-10 backdrop-blur-sm shadow-sm">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Neural Multi-RAG Protocol v1.0.4</span>
                </div>

                <h1 className="text-7xl md:text-[90px] font-black tracking-tighter mb-8 leading-[0.85] text-[#0a1628] uppercase">
                    AI <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0033a0] via-blue-600 to-[#0033a0]">
                        Automated
                    </span> <br/>
                    Procurement
                </h1>

                <p className="text-xl md:text-2xl text-slate-500 max-w-xl mb-12 leading-relaxed font-medium">
                    The modern institutional standard for digital RFP lifecycles. Harness document intelligence to draft, publish, and audit banking bids.
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                    <Link href="/signup?role=bank" className="px-10 py-6 bg-[#0033a0] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-all shadow-2xl shadow-blue-200 flex items-center gap-3 group active:scale-95">
                        Bank Official <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/signup?role=vendor" className="px-10 py-6 bg-white border-2 border-slate-100 text-slate-600 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:border-[#0033a0] hover:text-[#0033a0] transition-all flex items-center gap-3 group shadow-xl active:scale-95">
                        Register Partner <Globe size={18} />
                    </Link>
                </div>
            </div>

            {/* NEURAL HUB - REVERTED & FULLY CONNECTED */}
            <div className="lg:w-2/5 relative flex items-center justify-center h-[600px]">
                <div className="relative w-full h-full flex items-center justify-center">
                    
                    {/* Concentric Professional Scan Rings */}
                    <div className="absolute w-[520px] h-[520px] border border-blue-50 rounded-full opacity-40" />
                    <div className="absolute w-[440px] h-[440px] border-[2px] border-blue-100/40 border-dashed rounded-full animate-spin-slow opacity-60" />
                    <div className="absolute w-[360px] h-[360px] border border-indigo-100 rounded-full animate-reverse-spin opacity-40" />

                    {/* Central Brain Core - BOLDEST AS REQUESTED */}
                    <div className="relative z-20">
                        <div className="absolute inset-0 bg-[#0033a0] blur-[50px] opacity-20 rounded-full animate-pulse" />
                        <div className="relative w-40 h-36 bg-[#0033a0] rounded-[3rem] shadow-[0_0_80px_rgba(0,51,160,0.35)] flex items-center justify-center group hover:scale-110 transition-transform duration-500 border border-white/20">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-[3rem]" />
                            <Brain size={72} className="text-white animate-pulse" />
                        </div>
                    </div>

                    {/* Multi-Domain Expanded Nodes - BALANCED POSITIONING */}
                    <div className="absolute top-[10%] right-[15%] z-30 animate-float"><DomainBadge icon={Scale} label="Legal" color="text-blue-600" /></div>
                    <div className="absolute bottom-[12%] left-[5%] z-30 animate-float-delayed"><DomainBadge icon={Code} label="Tech" color="text-indigo-600" /></div>
                    <div className="absolute top-[18%] left-[8%] z-30 animate-float" style={{ animationDelay: '-2s' }}><DomainBadge icon={ShieldCheck} label="Rules" color="text-emerald-600" /></div>
                    <div className="absolute bottom-[10%] right-[10%] z-30 animate-float-delayed" style={{ animationDelay: '-4s' }}><DomainBadge icon={History} label="Audit" color="text-amber-600" /></div>
                    <div className="absolute top-[45%] right-[-5%] z-30 animate-float"><DomainBadge icon={Users} label="Vendors" color="text-purple-600" /></div>
                    <div className="absolute bottom-[45%] left-[-5%] z-30 animate-float-delayed"><DomainBadge icon={Layers} label="RAG" color="text-blue-400" /></div>

                    {/* ALL-NODE STOCHASTIC DATA BEAMS (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                        <defs>
                            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="#0033a0" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                        {/* 1. Legal (Top Right) */}
                        <path d="M 320 80 Q 260 140 200 200" stroke="url(#beamGrad)" strokeWidth="2" strokeDasharray="6,6" fill="none" className="animate-beam-random-1" />
                        {/* 2. Tech (Bottom Left) */}
                        <path d="M 80 340 Q 140 270 200 200" stroke="url(#beamGrad)" strokeWidth="2" strokeDasharray="6,6" fill="none" className="animate-beam-random-2" />
                        {/* 3. Rules (Top Left) */}
                        <path d="M 100 120 Q 150 160 200 200" stroke="url(#beamGrad)" strokeWidth="2" strokeDasharray="6,6" fill="none" className="animate-beam-random-3" />
                        {/* 4. Audit (Bottom Right) */}
                        <path d="M 320 320 Q 260 260 200 200" stroke="url(#beamGrad)" strokeWidth="2" strokeDasharray="6,6" fill="none" className="animate-beam-random-4" />
                        {/* 5. Vendors (Far Right) */}
                        <path d="M 380 200 Q 290 200 200 200" stroke="url(#beamGrad)" strokeWidth="2" strokeDasharray="6,6" fill="none" className="animate-beam-random-5" />
                        {/* 6. RAG (Far Left) */}
                        <path d="M 20 200 Q 110 200 200 200" stroke="url(#beamGrad)" strokeWidth="2" strokeDasharray="6,6" fill="none" className="animate-beam-random-6" />
                    </svg>
                </div>
            </div>
        </div>

        {/* WORKFLOW ROADMAP */}
        <div className="mb-40">
            <div className="text-center mb-20">
                <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Lifecycle Workflow</h2>
                <h3 className="text-4xl font-black text-[#0a1628] uppercase tracking-tight">The Neural Procurement Loop</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                {[
                    { step: '01', title: 'Neural Drafting', desc: 'AI generates a 100% compliant RFP draft using RAG context.', icon: Brain },
                    { step: '02', title: 'Sovereign Review', desc: 'Bank officials refine the draft in a secure, internal environment.', icon: FileSearch },
                    { step: '03', title: 'Live Publication', desc: 'Document goes live with an instant, dedicated Q&A assistant.', icon: Globe },
                    { step: '04', title: 'Resolutions', desc: 'Intelligent corrigenda and vendor query approvals finalize the bid.', icon: CheckCircle2 }
                ].map((item, i) => (
                    <div key={i} className="relative z-10 p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/20 text-center group hover:border-[#0033a0] transition-all">
                        <div className="w-12 h-12 bg-[#0a1628] text-[#c8a96a] rounded-full flex items-center justify-center mx-auto mb-6 font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                            {item.step}
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-3">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-bold">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* INTELLIGENCE MODULES */}
        <div className="mb-40 p-12 bg-[#0a1628] rounded-[4rem] shadow-3xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40" />
            <div className="flex flex-col lg:flex-row gap-20 relative z-10">
                <div className="lg:w-1/3">
                    <h2 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] mb-6">Brain Architecture</h2>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tight leading-tight mb-8">Sovereign <br/>Intelligence <br/>Modules</h3>
                    <p className="text-slate-400 text-sm font-medium leading-loose mb-10">IndiBid operates via discrete, specialized knowledge bases that ensure your RFPs are legally bulletproof and technically precise.</p>
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-widest"><Database size={14} /> Total Vector Chunks: 50,000+</div>
                </div>
                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {[
                        { label: 'Regulatory Brain', desc: 'RBI Master Directions, Outsourcing Circulars, and Digital Payment Security Controls.', icon: ShieldCheck, color: 'text-blue-400' },
                        { label: 'Legal Framework', desc: 'World Bank standard procurement rules and institutional contract laws.', icon: Scale, color: 'text-indigo-400' },
                        { label: 'Technical Stack', desc: 'Microservices, ISO 27001, SOC2, and core banking integration standards.', icon: Code, color: 'text-emerald-400' },
                        { label: 'Operational Logic', desc: 'Milestone tracking, SLA templates, and evaluation scoring matrices.', icon: GitMerge, color: 'text-amber-400' }
                    ].map((mod, i) => (
                        <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                            <mod.icon className={`${mod.color} mb-6`} size={32} />
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-3">{mod.label}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-bold">{mod.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-12 border-y border-slate-100 bg-white/30 backdrop-blur-sm rounded-[3rem] px-12 mb-40">
            {[
                { label: 'RAG Latency', val: '< 200ms' },
                { label: 'Compliance Index', val: '100%' },
                { label: 'Drafting Speed', val: '12x Faster' },
                { label: 'Audit Security', val: 'Immutable' }
            ].map((m, i) => (
                <div key={i} className="flex flex-col gap-2 text-center md:text-left">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{m.label}</span>
                    <span className="text-3xl font-black text-[#0a1628] tracking-tight">{m.val}</span>
                </div>
            ))}
        </div>

        {/* SECURITY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 pb-40 text-left">
            <div className="space-y-12">
                <h2 className="text-5xl font-black uppercase tracking-tighter leading-tight text-[#0a1628]">Banking <br/><span className="text-blue-500">Security Layer</span></h2>
                <div className="space-y-10">
                    <div className="flex gap-6 group">
                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-xl group-hover:bg-blue-600 group-hover:text-white transition-all"><ShieldCheck size={28} /></div>
                        <div>
                            <h5 className="font-black text-sm uppercase tracking-widest mb-2">Verification Protocol</h5>
                            <p className="text-slate-500 text-sm font-medium leading-loose max-w-sm">Mandatory CIN/GST verification and manual administrator clearance required for access.</p>
                        </div>
                    </div>
                    <div className="flex gap-6 group">
                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 shadow-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><Lock size={28} /></div>
                        <div>
                            <h5 className="font-black text-sm uppercase tracking-widest mb-2">Zero-Trust Intelligence</h5>
                            <p className="text-slate-500 text-sm font-medium leading-loose max-w-sm">Multi-category RAG ensures AI responses are 100% compliant with published context.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-60 h-60 bg-blue-50 rounded-full -mr-20 -mt-20 blur-[100px] opacity-50" />
                <Cpu className="text-blue-600 mb-8" size={56} />
                <h3 className="text-2xl font-black uppercase tracking-tight mb-6 text-[#0a1628]">Infrastructure</h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10 text-left">Neural engine powered by categorized FAISS vector stores and Mistral AI.</p>
                <div className="grid grid-cols-2 gap-6">
                    {['RBI KB', 'Accelerated Embeds', 'RBAC Logic', 'Real-time Sync'].map((text, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#0033a0] bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                            <CheckCircle size={16} className="text-emerald-500" /> {text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-200 bg-white pt-24 pb-12 text-left">
        <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                <div className="lg:col-span-5 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#0033a0] rounded-xl flex items-center justify-center shadow-xl text-white font-black text-xl">IB</div>
                        <div className="flex flex-col text-left">
                            <span className="text-2xl font-black tracking-tighter uppercase text-[#0a1628]">Indian <span className="text-blue-600">Bank</span></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">Institutional RFP Engine</span>
                        </div>
                    </div>
                    <p className="text-[15px] text-slate-500 font-medium leading-loose max-w-sm text-left">Providing sovereign document intelligence for India's premier financial institutions.</p>
                </div>
                <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 text-left">
                    <div className="space-y-6 text-left">
                        <h6 className="text-xs font-black text-[#0033a0] uppercase tracking-[0.2em]">Administrative</h6>
                        <ul className="space-y-4">
                            <li><Link href="/login?role=bank" className="text-[15px] font-bold text-slate-500 hover:text-[#0033a0] transition-colors">Drafting Console</Link></li>
                            <li><Link href="/bank/audit" className="text-[15px] font-bold text-slate-500 hover:text-[#0033a0] transition-colors">Audit Ledger</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-6 text-left">
                        <h6 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em]">Partner Portal</h6>
                        <ul className="space-y-4">
                            <li><Link href="/login?role=vendor" className="text-[15px] font-bold text-slate-500 hover:text-[#0033a0] transition-colors">Active Bids</Link></li>
                            <li><Link href="/signup?role=vendor" className="text-[15px] font-bold text-slate-500 hover:text-[#0033a0] transition-colors">Onboarding</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-6 text-left">
                        <h6 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Framework</h6>
                        <ul className="space-y-4 text-[15px] font-bold text-slate-400 uppercase tracking-tighter">
                            <li>Status: <span className="text-emerald-500 uppercase">Secure</span></li>
                            <li>v1.0.4-LTS</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="pt-10 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                <span>© 2026 Indian Bank Institutional Systems</span>
                <span className="text-slate-200">Secure | Compliant | Sovereign</span>
            </div>
        </div>
      </footer>

      {/* GLOBAL ANIMATIONS */}
      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes beam-random { 
            0%, 100% { opacity: 0; stroke-dashoffset: 100; } 
            20%, 80% { opacity: 1; }
            50% { stroke-dashoffset: 0; }
        }
        .animate-spin-slow { animation: spin-slow 25s linear infinite; }
        .animate-reverse-spin { animation: reverse-spin 20s linear infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; animation-delay: 2s; }
        
        .animate-beam-random-1 { animation: beam-random 4s infinite; animation-delay: 0s; }
        .animate-beam-random-2 { animation: beam-random 5s infinite; animation-delay: 1s; }
        .animate-beam-random-3 { animation: beam-random 6s infinite; animation-delay: 2s; }
        .animate-beam-random-4 { animation: beam-random 4.5s infinite; animation-delay: 0.5s; }
        .animate-beam-random-5 { animation: beam-random 5.5s infinite; animation-delay: 1.5s; }
        .animate-beam-random-6 { animation: beam-random 6.5s infinite; animation-delay: 2.5s; }

        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes reverse-spin { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>
    </div>
  );
}

function DomainBadge({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
    return (
        <div className="bg-white p-4 rounded-[1.5rem] shadow-2xl border border-slate-50 flex flex-col items-center gap-2 group hover:border-blue-500 transition-all cursor-default">
            <Icon size={24} className={`${color} group-hover:scale-110 transition-transform`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-[#0033a0]">{label}</span>
        </div>
    );
}
