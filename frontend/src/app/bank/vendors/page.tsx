"use client";
import React, { useEffect, useState, Fragment } from 'react';
import {
  Loader2, Users, Search, CheckCircle, XCircle,
  ShieldCheck, Briefcase, FileText,
  ChevronDown, ChevronUp, Phone,
  Clock, Filter, RefreshCw, Mail
} from 'lucide-react';
import BankSidebar from '@/components/BankSidebar';

const STATUS_CONFIG = {
  approved: {
    label: 'Verified',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Restricted',
    dot: 'bg-red-400',
    badge: 'bg-red-50 text-red-600 border-red-100',
    icon: XCircle,
  },
  pending: {
    label: 'Under Review',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-600 border-amber-100',
    icon: Clock,
  },
};

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
    <div className="min-h-screen bg-[#f0f4f8] flex">
      <BankSidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-[#0a1628] uppercase tracking-tight flex items-center gap-3">
                  <div className="p-2 bg-[#0a1628] rounded-lg text-[#c8a96a]">
                    <Users size={20} />
                  </div>
                  Vendor Registry
                </h1>
                <p className="text-slate-400 text-sm font-medium mt-1 ml-[44px]">
                  Manage third-party vendor access and verification status
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchVendors(true)}
                  className="px-5 py-3 rounded-2xl bg-[#0a1628] text-[#c8a96a] hover:bg-slate-800 transition-all text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 active:scale-95"
                >
                  <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                  Refresh
                </button>
                <div className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Identity Layer Active
                </div>
              </div>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-4 gap-5">
              {[
                { label: 'Total Vendors', value: counts.all, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Verified', value: counts.approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Pending Review', value: counts.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Restricted', value: counts.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} p-5 rounded-[2rem] flex items-center justify-between border border-white/60 shadow-sm`}>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
                    <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                    <s.icon size={20} className={s.color} />
                  </div>
                </div>
              ))}
            </div>

            {/* ── Search + Filter Row ── */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Search by organization or email address…"
                  className="w-full pl-13 pr-6 py-4 bg-white rounded-2xl border-2 border-transparent focus:border-[#c8a96a]/50 outline-none shadow-sm font-bold text-sm transition-all"
                  style={{ paddingLeft: '3.25rem' }}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
                {(['all', 'approved', 'pending', 'rejected'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filterStatus === s
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
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
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
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0a1628] text-[10px] font-black uppercase tracking-[0.15em] text-[#c8a96a]">
                      <th className="px-10 py-5">Organization</th>
                      <th className="px-10 py-5">Status</th>
                      <th className="px-10 py-5">Vendor ID</th>
                      <th className="px-10 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredVendors.map((v) => {
                      const cfg = STATUS_CONFIG[v.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
                      const isExpanded = expandedVendorId === v.id;

                      return (
                        <Fragment key={v.id}>
                          <tr className={`hover:bg-slate-50/50 transition-all group ${isExpanded ? 'bg-slate-50/60' : ''}`}>
                            {/* Org */}
                            <td className="px-10 py-7">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shrink-0 group-hover:border-[#c8a96a]/20 transition-colors">
                                  <Briefcase size={16} className="text-slate-400 group-hover:text-[#c8a96a] transition-colors" />
                                </div>
                                <div>
                                  <span className="font-bold text-slate-800 text-sm block">{v.organization || 'Individual Vendor'}</span>
                                  <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">{v.email}</span>
                                </div>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-10 py-7">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${cfg.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                                {cfg.label}
                              </span>
                            </td>

                            {/* ID */}
                            <td className="px-10 py-7">
                              <span className="font-mono text-xs font-black text-slate-400">#V{String(v.id).padStart(5, '0')}</span>
                            </td>

                            {/* Actions */}
                            <td className="px-10 py-7 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setExpandedVendorId(isExpanded ? null : v.id)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 bg-[#0a1628] text-[#c8a96a] hover:bg-[#122654] shadow-md"
                                >
                                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                  {isExpanded ? 'Close' : 'Details'}
                                </button>

                                {v.status === 'pending' ? (
                                  <>
                                    <button
                                      onClick={() => handleAction(v.id, 'REJECT')}
                                      className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                                      title="Reject"
                                    >
                                      <XCircle size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleAction(v.id, 'APPROVE')}
                                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c8a96a] text-[#0a1628] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#b8995a] transition-all shadow-md shadow-amber-200/20 active:scale-95"
                                    >
                                      <CheckCircle size={12} />
                                      Approve
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => handleAction(v.id, v.status === 'approved' ? 'REJECT' : 'APPROVE')}
                                    className={`px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all active:scale-95 ${v.status === 'approved'
                                        ? 'text-red-500 border-red-200 hover:bg-red-50'
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
                            <tr>
                              <td colSpan={4} className="px-10 py-7 bg-slate-50/70">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                  {/* Registration */}
                                  <DetailCard
                                    icon={<FileText size={13} />}
                                    title="Registration"
                                    rows={[
                                      { label: 'Reg. ID', value: v.registration_id || '—' },
                                      { label: 'Category', value: v.vendor_category || 'General Service' },
                                      { label: 'In Business', value: v.years_in_business ? `${v.years_in_business} yrs` : '—' },
                                    ]}
                                  />

                                  {/* Contact */}
                                  <DetailCard
                                    icon={<Phone size={13} />}
                                    title="Contact"
                                    rows={[
                                      { label: 'Phone', value: v.contact_phone || '—' },
                                      { label: 'Email', value: v.email },
                                      { label: 'Website', value: v.website || '—', href: v.website },
                                    ]}
                                  />

                                  {/* Audit Status */}
                                  <div className="rounded-2xl bg-[#0a1628] shadow-xl p-5 flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center gap-2 mb-4">
                                        <div className="w-7 h-7 rounded-lg bg-[#c8a96a]/15 flex items-center justify-center">
                                          <ShieldCheck size={13} className="text-[#c8a96a]" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Audit Status</span>
                                      </div>
                                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${v.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                          : v.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                                        {v.status === 'approved' ? 'Verified & Active' : v.status === 'rejected' ? 'Access Restricted' : 'Awaiting Verification'}
                                      </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-500 font-medium">Vendor ID</span>
                                        <span className="text-[10px] text-white/70 font-bold font-mono">#V{String(v.id).padStart(5, '0')}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-500 font-medium">Record</span>
                                        <span className="text-[10px] text-white/70 font-bold">Third-Party Vendor</span>
                                      </div>
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

            {/* Footer */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold pb-2">
              <span>{filteredVendors.length} of {vendors.length} vendors displayed</span>
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
    <div className="rounded-2xl bg-[#0a1628] shadow-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#c8a96a]/15 flex items-center justify-center text-[#c8a96a]">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">{title}</span>
      </div>
      <div className="space-y-2.5">
        {rows.map(r => (
          <div key={r.label} className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-500 font-medium">{r.label}</span>
            {r.href ? (
              <a
                href={r.href.startsWith('http') ? r.href : `https://${r.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#c8a96a] hover:text-[#e8c97a] transition-colors truncate max-w-[160px]"
              >
                {r.value}
              </a>
            ) : (
              <span className="text-[11px] font-bold text-white/70 truncate max-w-[160px]">{r.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
