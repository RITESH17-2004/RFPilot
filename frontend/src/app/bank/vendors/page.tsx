"use client";
import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Users, Search, CheckCircle, XCircle, Globe, ShieldCheck, Mail, Phone, Briefcase, FileText } from 'lucide-react';
import Link from 'next/link';
import BankSidebar from '@/components/BankSidebar';

export default function VendorRegistry() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/admin/vendors`)
      .then(res => res.json())
      .then(data => {
        setVendors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleAction = async (id: number, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/vendors/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        alert(`Vendor ${action === 'APPROVE' ? 'Approved' : 'Rejected'} successfully.`);
        fetchVendors();
      }
    } catch {
      alert("Action failed.");
    }
  };

  const filteredVendors = vendors.filter(v => 
    v.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.organization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex">
      <BankSidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header & Status */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-[#0a1628] uppercase tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-[#0a1628] rounded-lg text-[#c8a96a]">
                        <Users size={20} />
                    </div>
                    Vendor Verification Registry
                </h1>
                <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <ShieldCheck size={14} className="text-[#c8a96a]" /> Identity Layer Active
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by company name or email..." 
                    className="w-full pl-14 pr-6 py-4 bg-white rounded-3xl border-2 border-transparent focus:border-indigo-600 outline-none shadow-sm font-bold text-sm transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                        <Loader2 size={40} className="animate-spin text-indigo-600" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Synchronizing Data...</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                            <tr>
                                <th className="px-10 py-6">Organization Details</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-right">Verification Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredVendors.map(v => (
                                <tr key={v.id} className="hover:bg-slate-50/40 transition-all group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                                                <Briefcase size={20} />
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-slate-800">{v.organization || 'Individual'}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><Mail size={10} /> {v.email}</span>
                                                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                                    <span className="text-[10px] font-black text-[#c8a96a] uppercase">ID: #V00{v.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        {v.status === 'approved' ? (
                                            <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                                <CheckCircle size={12} /> Verified
                                            </span>
                                        ) : v.status === 'rejected' ? (
                                            <span className="flex items-center gap-1.5 text-[9px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                                                <XCircle size={12} /> Access Denied
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                                <FileText size={12} /> Pending Review
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        {v.status === 'pending' && (
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                    onClick={() => handleAction(v.id, 'REJECT')}
                                                    className="p-3 bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl border border-slate-100 transition-all shadow-sm" 
                                                    title="Reject Application"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(v.id, 'APPROVE')}
                                                    className="px-6 py-3 bg-[#0a1628] text-[#c8a96a] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                                                >
                                                    Approve Access
                                                </button>
                                            </div>
                                        )}
                                        {v.status !== 'pending' && (
                                            <button 
                                                onClick={() => handleAction(v.id, v.status === 'approved' ? 'REJECT' : 'APPROVE')}
                                                className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
                                            >
                                                Toggle Access
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
