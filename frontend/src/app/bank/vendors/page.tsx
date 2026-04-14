"use client";
import React, { useEffect, useState, Fragment } from 'react';
import {
  Loader2, Users, Search, CheckCircle, XCircle,
  ShieldCheck, Mail, Briefcase, FileText,
  ChevronDown, ChevronUp, Phone, Globe, Hash,
  Clock, TrendingUp, Filter, RefreshCw
} from 'lucide-react';
import BankSidebar from '@/components/BankSidebar';

const STATUS_CONFIG = {
  approved: {
    label: 'Verified',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    icon: CheckCircle,
    glow: 'shadow-emerald-500/10',
  },
  rejected: {
    label: 'Restricted',
    dot: 'bg-red-400',
    badge: 'bg-red-50 text-red-600 border-red-200',
    icon: XCircle,
    glow: 'shadow-red-500/10',
  },
  pending: {
    label: 'Under Review',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-600 border-amber-200',
    icon: Clock,
    glow: 'shadow-amber-500/10',
  },
};

function StatCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 px-6 py-5 flex flex-col gap-1 shadow-sm">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 ${color}`} />
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <span className="text-3xl font-black text-[#0a1628] tabular-nums">{count}</span>
    </div>
  );
}

export default function VendorRegistry() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedVendorId, setExpandedVendorId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const BACKEND_URL = "http://localhost:8000";

  const fetchVendors = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/vendors`);
      const data = await res.json();
      setVendors(Array.isArray(data) ? data : []);
    } catch {
      /* handle error */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchVendors(); }, []);

  const handleAction = async (id: number, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/vendors/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) fetchVendors();
    } catch { /* noop */ }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch =
      v.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.organization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: vendors.length,
    approved: vendors.filter(v => v.status === 'approved').length,
    pending: vendors.filter(v => v.status === 'pending').length,
    rejected: vendors.filter(v => v.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-['Sora',sans-serif]">
      {/* Import Sora font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .row-enter { animation: rowFade 0.3s ease forwards; }
        @keyframes rowFade { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .card-glow { transition: box-shadow 0.3s ease; }
        .card-glow:hover { box-shadow: 0 0 0 1px rgba(0,51,160,0.15), 0 8px 32px rgba(0,0,0,0.05); }
      `}</style>

      <BankSidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto scrollbar-thin">
          <div className="max-w-6xl mx-auto space-y-7">

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <Users size={18} className="text-[#0033a0]" />
                  </div>
                  <h1 className="text-xl font-black text-[#0a1628] tracking-tight">
                    Vendor Registry
                  </h1>
                </div>
                <p className="text-slate-500 text-sm ml-[52px]">
                  Manage third-party vendor access and verification status
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchVendors(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#0a1628] hover:border-slate-300 transition-all text-[11px] font-semibold uppercase tracking-widest shadow-sm"
                >
                  <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
                  Refresh
                </button>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm">
                  <ShieldCheck size={12} />
                  Identity Layer Active
                </div>
              </div>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Total Vendors" count={counts.all} color="bg-blue-500" />
              <StatCard label="Verified" count={counts.approved} color="bg-emerald-500" />
              <StatCard label="Pending" count={counts.pending} color="bg-amber-500" />
              <StatCard label="Restricted" count={counts.rejected} color="bg-red-500" />
            </div>

            {/* ── Search + Filter Row ── */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Search by organization or email address…"
                  className="w-full pl-11 pr-5 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-[#0a1628] placeholder-slate-400 focus:outline-none focus:border-[#0033a0]/40 focus:ring-4 focus:ring-[#0033a0]/10 transition-all font-medium shadow-sm"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
                {(['all', 'approved', 'pending', 'rejected'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                      filterStatus === s
                        ? 'bg-[#0033a0] text-white shadow-md'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {loading ? (
                <div className="p-24 flex flex-col items-center gap-5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-2 border-[#0033a0]/20 border-t-[#0033a0] animate-spin" />
                  </div>
                  <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em]">Loading vendors…</p>
                </div>
              ) : filteredVendors.length === 0 ? (
                <div className="p-20 text-center">
                  <Users size={32} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 font-semibold">No vendors found</p>
                  <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filter</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      <th className="px-7 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Organization</th>
                      <th className="px-7 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Status</th>
                      <th className="px-7 py-4 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Vendor ID</th>
                      <th className="px-7 py-4 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map((v, i) => {
                      const cfg = STATUS_CONFIG[v.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
                      const StatusIcon = cfg.icon;
                      const isExpanded = expandedVendorId === v.id;

                      return (
                        <Fragment key={v.id}>
                          <tr
                            className={`group border-b border-slate-100 transition-colors card-glow ${isExpanded ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}
                            style={{ animationDelay: `${i * 40}ms` }}
                          >
                            {/* Org */}
                            <td className="px-7 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                                  <Briefcase size={15} className="text-[#0033a0]" />
                                </div>
                                <div>
                                  <p className="font-bold text-[#0a1628] text-sm leading-tight">{v.organization || 'Individual Vendor'}</p>
                                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{v.email}</p>
                                </div>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-7 py-5">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${cfg.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                                {cfg.label}
                              </span>
                            </td>

                            {/* ID */}
                            <td className="px-7 py-5">
                              <span className="font-mono text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                #V{String(v.id).padStart(5, '0')}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-7 py-5">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setExpandedVendorId(isExpanded ? null : v.id)}
                                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${
                                    isExpanded
                                      ? 'bg-slate-100 text-[#0a1628] border-slate-200'
                                      : 'text-slate-500 hover:text-[#0a1628] border-transparent hover:border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                  {isExpanded ? 'Close' : 'Details'}
                                </button>

                                <div className="w-px h-5 bg-slate-200" />

                                {v.status === 'pending' ? (
                                  <>
                                    <button
                                      onClick={() => handleAction(v.id, 'REJECT')}
                                      className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                                      title="Reject"
                                    >
                                      <XCircle size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleAction(v.id, 'APPROVE')}
                                      className="flex items-center gap-2 px-4 py-2 bg-[#0033a0] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all active:scale-95 shadow-sm shadow-blue-200"
                                    >
                                      <CheckCircle size={12} />
                                      Approve
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => handleAction(v.id, v.status === 'approved' ? 'REJECT' : 'APPROVE')}
                                    className={`px-3.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                      v.status === 'approved'
                                        ? 'text-red-600 border-red-200 hover:bg-red-50'
                                        : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                                    }`}
                                  >
                                    {v.status === 'approved' ? 'Revoke' : 'Restore'}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* ── Expanded Detail Panel ── */}
                          {isExpanded && (
                            <tr className="bg-slate-50/50">
                              <td colSpan={4} className="px-7 py-7 border-b border-slate-100">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                                  {/* Registration */}
                                  <DetailCard
                                    icon={<FileText size={14} className="text-[#0033a0]" />}
                                    title="Registration"
                                    rows={[
                                      { label: 'Reg. ID', value: v.registration_id || '—' },
                                      { label: 'Category', value: v.vendor_category || 'General Service' },
                                      { label: 'In Business', value: v.years_in_business ? `${v.years_in_business} yrs` : '—' },
                                    ]}
                                  />

                                  {/* Contact */}
                                  <DetailCard
                                    icon={<Phone size={14} className="text-[#0033a0]" />}
                                    title="Contact"
                                    rows={[
                                      { label: 'Phone', value: v.contact_phone || '—' },
                                      { label: 'Email', value: v.email },
                                      { label: 'Website', value: v.website || '—', href: v.website },
                                    ]}
                                  />

                                  {/* System Status */}
                                  <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col justify-between shadow-sm">
                                    <div>
                                      <div className="flex items-center gap-2 mb-4">
                                        <ShieldCheck size={14} className="text-[#0033a0]" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Audit Trail</span>
                                      </div>
                                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${cfg.badge}`}>
                                        <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                                        {v.status === 'approved' ? 'Verified & Active' : v.status === 'rejected' ? 'Access Restricted' : 'Awaiting Verification'}
                                      </div>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-1.5">
                                      <InfoLine label="Vendor ID" value={`#V${String(v.id).padStart(5, '0')}`} mono />
                                      <InfoLine label="Record type" value="Third-Party Vendor" />
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pb-4">
              <span>{filteredVendors.length} of {vendors.length} vendors shown</span>
              <span>Vendor Registry · Secure Admin Panel</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ── */

function DetailCard({
  icon, title, rows
}: {
  icon: React.ReactNode;
  title: string;
  rows: { label: string; value: string; href?: string }[];
}) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{title}</span>
      </div>
      <div className="space-y-3">
        {rows.map(r => (
          <div key={r.label} className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 font-medium">{r.label}</span>
            {r.href ? (
              <a
                href={r.href.startsWith('http') ? r.href : `https://${r.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors truncate max-w-[160px]"
              >
                {r.value}
              </a>
            ) : (
              <span className="text-[11px] font-semibold text-[#0a1628] truncate max-w-[160px]">{r.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoLine({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-slate-500">{label}</span>
      <span className={`text-[10px] text-slate-700 font-medium ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
