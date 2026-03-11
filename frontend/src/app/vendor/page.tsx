"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, ShieldCheck, Clock, MapPin, 
  LogOut, Building2, Sparkles, Filter, LayoutGrid, List,
  CheckCircle, ArrowRight, Shield, Globe, Cpu,
  Briefcase, BarChart3, FileText, ChevronRight, Landmark,
  BellRing, Award, Activity
} from 'lucide-react';

export default function VendorDashboard() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState('vendor@company.com');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('rfp_user_email');
    if (email) setUserEmail(email);
    fetch('http://localhost:8000/rfps')
      .then(res => res.json())
      .then(data => { 
        setRfps(data.filter((r: any) => r.status === 'published')); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rfp_role');
    localStorage.removeItem('rfp_user_email');
    router.push('/');
  };

  const filtered = (rfps as any[]).filter((r: any) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] text-[#1a202c] font-sans selection:bg-[#004a99]/10 selection:text-[#004a99]">
      
      {/* Indian Banking Standard Header */}
      <nav className="bg-white border-b-2 border-[#f0f0f0] sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-8 h-[80px] flex items-center justify-between">
          {/* Bank Branding */}
          <Link href="/vendor" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#004a99] to-[#003366] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/10 group-hover:scale-105 transition-transform">
              <Landmark size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-black text-[#004a99] tracking-tight leading-none uppercase">Indian Bank</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
                    <Shield size={10} className="text-[#e81c24]" /> Digital Procurement Cell
                </span>
            </div>
          </Link>

          {/* Institutional Menu */}
          <div className="hidden lg:flex items-center gap-1 bg-[#f8fafc] p-1.5 rounded-2xl border border-slate-200">
            <Link href="/vendor" className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-[#004a99] shadow-md shadow-blue-900/10 transition-all">
              <Globe size={14} /> Live Tenders
            </Link>
            <Link href="#" className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#004a99] hover:bg-white transition-all">
              <Briefcase size={14} /> My Bids
            </Link>
            <Link href="#" className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#004a99] hover:bg-white transition-all">
              <Activity size={14} /> Analytics
            </Link>
          </div>

          {/* Compliance & User Profile */}
          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-3 pr-6 border-r border-slate-200">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-[#004a99] uppercase tracking-widest">Bank Verified</span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Status: Active Bidder</span>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-inner">
                    <ShieldCheck size={20} />
                </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-[#004a99] rounded-xl flex items-center justify-center transition-all relative">
                <BellRing size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#e81c24] rounded-full border-2 border-white" />
              </button>
              <div className="w-px h-8 bg-slate-200 mx-1" />
              <button 
                onClick={handleLogout}
                className="group flex items-center gap-3 pl-2 pr-4 py-2 hover:bg-red-50 rounded-2xl transition-all"
              >
                <div className="w-10 h-10 bg-[#004a99] rounded-full flex items-center justify-center text-white font-black text-sm shadow-md group-hover:bg-[#e81c24] transition-colors">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                    <span className="text-xs font-black text-slate-700">{userEmail.split('@')[0]}</span>
                    <LogOut size={12} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero: "Unified Procurement Portal" */}
      <div className="bg-white border-b border-slate-200 relative">
        <div className="max-w-[1440px] mx-auto px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#004a99]/5 rounded-full border border-[#004a99]/10 text-[11px] font-black text-[#004a99] uppercase tracking-widest mb-6">
              <Sparkles size={14} className="text-[#004a99]" /> Official e-Procurement System
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-[#0a1628] tracking-tight leading-[1.05] mb-6">
              Empowering India's <br />
              <span className="text-[#004a99]">Digital Banking Future.</span>
            </h1>
            <p className="text-lg font-medium text-slate-500 max-w-lg leading-relaxed mb-10">
              Access secure, AI-verified Request for Proposals (RFPs) and participate in institutional digital transformation projects.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                    <CheckCircle size={16} className="text-emerald-500" /> ISO 27001 Certified
                </div>
                <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                    <CheckCircle size={16} className="text-emerald-500" /> RBI Compliant Node
                </div>
            </div>
          </div>

          <div className="w-full lg:w-[420px] bg-[#f8fafc] p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Search size={16} className="text-[#004a99]" /> Tender Search Engine
            </h3>
            <div className="space-y-4">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#004a99] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Keyword or Tender ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#004a99] transition-all"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase hover:bg-slate-50 transition-all">
                        <Filter size={14} /> Filter
                    </button>
                    <div className="flex bg-white border border-slate-200 p-1 rounded-2xl">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`flex-1 flex items-center justify-center py-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#004a99] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            <LayoutGrid size={14} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`flex-1 flex items-center justify-center py-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#004a99] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            <List size={14} />
                        </button>
                    </div>
                </div>
                <div className="pt-2">
                    <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest leading-relaxed">
                        Authorized vendors must acknowledge RBI compliance <br /> guidelines before accessing bid documents.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <main className="max-w-[1440px] mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-12">
            <div>
                <h2 className="text-2xl font-black text-[#0a1628] uppercase tracking-tight flex items-center gap-3">
                    <span className="w-2 h-8 bg-[#e81c24] rounded-full" /> 
                    Available Tenders
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Showing active opportunities from Indian Bank Digital Cell.</p>
            </div>
            <div className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-black text-[#004a99] uppercase tracking-widest shadow-sm">
                {rfps.length} Active Records
            </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4"}>
            {filtered.map((rfp: any) => (
              viewMode === 'grid' ? (
                <div key={rfp.id} className="group bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-blue-900/10 hover:border-[#004a99] transition-all duration-500 relative flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                        <div className="w-14 h-14 bg-[#f8fafc] text-[#004a99] rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-[#004a99] group-hover:text-white transition-all duration-500 shadow-sm">
                            <Building2 size={24} />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 group-hover:text-[#004a99] transition-colors">Ref #IB-{rfp.id}</span>
                            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                Open
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-black text-[#0a1628] mb-4 group-hover:text-[#004a99] transition-colors leading-[1.3] tracking-tight">{rfp.title}</h3>

                    <div className="flex flex-wrap gap-4 mb-8">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                            <Clock size={14} className="text-[#004a99]" /> {new Date(rfp.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                            <Award size={14} className="text-[#c8a96a]" /> Digital Cell
                        </div>
                    </div>

                    <p className="text-[13px] font-medium text-slate-500 mb-8 line-clamp-3 leading-relaxed flex-1 italic">
                        {(() => {
                            try {
                                const sections = JSON.parse(rfp.content);
                                if (Array.isArray(sections) && sections.length > 0) {
                                    return sections[0].executive_summary || sections[0].description || "Institutional tender document covering technical architecture and compliance framework.";
                                }
                            } catch (e) {
                                // Fallback to raw content or default if not JSON
                            }
                            return rfp.content || "Secure institutional tender document covering technical architecture and compliance framework for Indian Bank's digital expansion.";
                        })()}
                    </p>

                    <Link 
                        href={`/vendor/${rfp.id}`} 
                        className="mt-auto flex items-center justify-center gap-3 w-full py-4 bg-[#004a99] hover:bg-[#003366] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98]"
                    >
                        Access Documents <ArrowRight size={14} />
                    </Link>
                </div>
              ) : (
                <Link key={rfp.id} href={`/vendor/${rfp.id}`} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#004a99] flex items-center justify-between transition-all group">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-slate-50 group-hover:bg-[#004a99] rounded-xl flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-[#0a1628] tracking-tight">{rfp.title}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">IB-REF-{rfp.id} · Issued {new Date(rfp.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <span className="text-xs font-black text-emerald-600 uppercase">Live Opportunity</span>
                        <ChevronRight size={20} className="text-slate-300 group-hover:text-[#004a99] transition-all group-hover:translate-x-1" />
                    </div>
                </Link>
              )
            ))}

            {!loading && filtered.length === 0 && (
              <div className="col-span-full py-32 bg-white border-2 border-dashed border-slate-200 rounded-[3rem] text-center opacity-80">
                <Search size={48} className="text-slate-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tight mb-2">No Records Identified</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto">Please refine your search parameters or check the unified tender ledger later.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Corporate Footer Status */}
      <footer className="bg-white border-t border-slate-200 py-12 px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
                <Landmark size={20} className="text-[#004a99]" />
                <div className="flex flex-col">
                    <span className="text-xs font-black text-[#0a1628] uppercase tracking-tight">Indian Bank Procurement</span>
                    <span className="text-[10px] font-medium text-slate-400">© 2026 Indian Bank Institutional Division. All rights reserved.</span>
                </div>
            </div>
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-emerald-500" /> SSL Secured
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-emerald-500" /> AES-256 Encrypted
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
