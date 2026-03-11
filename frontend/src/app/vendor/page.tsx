"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, Search, ShieldCheck, ExternalLink, Clock, MapPin, LogOut, Building2, Sparkles } from 'lucide-react';

export default function VendorDashboard() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userEmail, setUserEmail] = useState('vendor@company.com');
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('rfp_user_email');
    if (email) setUserEmail(email);
    fetch('http://localhost:8000/rfps')
      .then(res => res.json())
      .then(data => { setRfps(data.filter((r: any) => r.status === 'published')); setLoading(false); })
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
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* Top Navigation */}
      <nav className="bg-[#0a1628] sticky top-0 z-50 shadow-xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-8 h-[68px] flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#c8a96a] to-[#e8c97a] rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/30">
              <span className="text-[#0a1628] font-black">B</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Bajaj <span className="text-[#c8a96a]">FinPortal</span></span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/vendor" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-white/10">
              <Store size={15} /> Explore Tenders
            </Link>
            <Link href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              My Submissions
            </Link>
            <Link href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              Guidelines
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
              <ShieldCheck size={13} /> Verified Profile
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-400 rounded-lg flex items-center justify-center text-white font-black text-sm">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors text-xs font-semibold ml-1">
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Sub-header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#122654] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-[#c8a96a]" />
              <span className="text-[#c8a96a] text-xs font-bold uppercase tracking-widest">Live Opportunities</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Available Tenders</h1>
            <p className="text-slate-400 text-sm mt-1">Explore institution-grade RFPs and get instant AI clarifications.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
            <input
              type="text"
              placeholder="Search active bids..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/8 border border-white/10 rounded-xl text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c8a96a]/50 transition-all backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* RFP Grid */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-72 skeleton rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((rfp: any) => (
              <div key={rfp.id} className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-400 hover:-translate-y-1">
                {/* Card top accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#0a1628] via-indigo-600 to-[#c8a96a]" />
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-12 h-12 bg-[#0a1628] group-hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-colors duration-400 shadow-md">
                      <Building2 size={22} className="text-white" />
                    </div>
                    <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      Active
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#0a1628] mb-3 group-hover:text-indigo-700 transition-colors leading-tight">{rfp.title}</h3>

                  <div className="flex flex-wrap gap-3 mb-5">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                      <Clock size={13} /> {new Date(rfp.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                      <MapPin size={13} /> Mumbai HQ
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                    {rfp.content || "Institution-grade RFP document describing technical and compliance requirements."}
                  </p>

                  <Link href={`/vendor/${rfp.id}`} className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#0a1628] hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-md shadow-slate-300/30">
                    Access Bid Documents <ExternalLink size={15} />
                  </Link>
                </div>
              </div>
            ))}

            {!loading && filtered.length === 0 && (
              <div className="col-span-full py-24 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-5">
                  <Search size={30} />
                </div>
                <h3 className="text-xl font-bold text-[#0a1628] mb-2">No Tenders Found</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  {searchTerm ? `No RFPs match "${searchTerm}"` : "There are no published RFPs available. Please check back later."}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}