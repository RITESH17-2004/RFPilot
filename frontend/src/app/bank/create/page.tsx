"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, ShieldCheck, Cpu, Briefcase, IndianRupee, Calendar, Clock, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';

export default function CreateRFP() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    project_type: "",
    budget: "",
    timeline: "",
    requirements: "",
    issuance_date: "",
    submission_deadline: "",
    evaluation_strategy: "",
    bank_profile: {
      bank_name: "Bajaj FinTech Bank",
      department: "Digital Infrastructure",
      contact_person: "Rahul Sharma",
      contact_email: "rahul.sharma@bajaj.com",
      location: "Pune, India"
    },
    // Expert Mode Fields
    eligibility_criteria: "",
    compliance_standards: "",
    technical_stack: "",
    sla_requirements: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/rfp/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('RFP Draft generated via AI. You can now review it in the dashboard.');
        router.push('/bank');
      } else {
        alert('Failed to generate RFP.');
      }
    } catch (err) {
      alert('Error connecting to backend.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 custom-scrollbar overflow-y-auto">
      <div className="max-w-6xl mx-auto pb-20">
        <Link href="/bank?view=management" className="flex items-center text-slate-500 hover:text-indigo-600 mb-8 font-semibold transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to My RFPs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0a1628] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
              <Sparkles size={40} className="mb-6 text-[#c8a96a]" />
              <h1 className="text-2xl font-black mb-4 leading-tight tracking-tight uppercase">RFP Expert Draftsman</h1>
              <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8 uppercase tracking-widest">
                Professional-grade document generation powered by multi-category RAG.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/10">
                  <CheckCircle size={14} className="text-emerald-400" /> Standard World Bank Format
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/10">
                  <ShieldCheck size={14} className="text-indigo-400" /> RBI Compliance Injected
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/10">
                  <Zap size={14} className="text-amber-400" /> Zero-Placeholder Mode
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Pro Tip</h4>
               <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Filling the <span className="text-indigo-600 font-bold">Expert Mode</span> fields significantly reduces AI ambiguity and produces higher-fidelity legal clauses.
               </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-200 text-slate-900">
              <form onSubmit={handleSubmit} className="space-y-12">
                
                {/* Basic Section */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                     <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">01. Project Essentials</h2>
                     <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-full">CORE PARAMETERS</span>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Title</label>
                    <div className="relative group">
                      <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                      <input type="text" className="w-full pl-14 pr-6 py-5 bg-slate-50 focus:bg-white border-2 border-transparent focus:border-indigo-600 rounded-3xl outline-none font-bold text-slate-900 transition-all shadow-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Next-Gen Mobile Banking Platform 2026" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Category</label>
                      <div className="relative">
                        <Cpu className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input type="text" className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-3xl outline-none font-bold text-sm shadow-sm" value={formData.project_type} onChange={e => setFormData({...formData, project_type: e.target.value})} placeholder="e.g. Mobile Application, Cloud, Security" required />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Evaluation Strategy</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input type="text" className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-3xl outline-none font-bold text-sm shadow-sm" value={formData.evaluation_strategy} onChange={e => setFormData({...formData, evaluation_strategy: e.target.value})} placeholder="e.g. QCBS 70:30" required />
                      </div>
                    </div>
                  </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Issuance Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input type="date" className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-3xl outline-none font-bold text-sm shadow-sm" value={formData.issuance_date} onChange={e => setFormData({...formData, issuance_date: e.target.value})} placeholder="Select Date" required />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Submission Deadline</label>
                      <div className="relative">
                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input type="date" className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-3xl outline-none font-bold text-sm shadow-sm" value={formData.submission_deadline} onChange={e => setFormData({...formData, submission_deadline: e.target.value})} placeholder="Select Deadline" required />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estimated Budget (INR/USD)</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input type="text" className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-3xl outline-none font-bold text-sm shadow-sm" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="e.g. INR 10 Crores - 15 Crores" required />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Implementation Timeline</label>
                      <div className="relative">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input type="text" className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-3xl outline-none font-bold text-sm shadow-sm" value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})} placeholder="e.g. 8 Months" required />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expert Mode Section */}
                <div className="space-y-10 bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-6">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white">
                            <Zap size={16} />
                        </div>
                        <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">02. Expert Mode Configuration</h2>
                     </div>
                     <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[9px] font-black rounded-full uppercase tracking-widest">Advanced RAG Control</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Eligibility Criteria</label>
                        <textarea rows={3} className="w-full p-6 bg-white border-2 border-slate-100 focus:border-indigo-600 rounded-3xl outline-none font-medium text-xs leading-relaxed shadow-sm transition-all" value={formData.eligibility_criteria} onChange={e => setFormData({...formData, eligibility_criteria: e.target.value})} placeholder="e.g. Minimum 5 years in banking tech; ISO 27001 Certified." />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Compliance Standards</label>
                        <textarea rows={3} className="w-full p-6 bg-white border-2 border-slate-100 focus:border-indigo-600 rounded-3xl outline-none font-medium text-xs leading-relaxed shadow-sm transition-all" value={formData.compliance_standards} onChange={e => setFormData({...formData, compliance_standards: e.target.value})} placeholder="e.g. PCI-DSS, ISO 27001, RBI Guidelines 2024." />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Technical Stack Preference</label>
                        <textarea rows={3} className="w-full p-6 bg-white border-2 border-slate-100 focus:border-indigo-600 rounded-3xl outline-none font-medium text-xs leading-relaxed shadow-sm transition-all" value={formData.technical_stack} onChange={e => setFormData({...formData, technical_stack: e.target.value})} placeholder="e.g. Microservices, React Native, PostgreSQL, AWS." />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SLA Requirements</label>
                        <textarea rows={3} className="w-full p-6 bg-white border-2 border-slate-100 focus:border-indigo-600 rounded-3xl outline-none font-medium text-xs leading-relaxed shadow-sm transition-all" value={formData.sla_requirements} onChange={e => setFormData({...formData, sla_requirements: e.target.value})} placeholder="e.g. 99.95% Availability; 1-hour response for P1." />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Scope of Work (SOW)</label>
                  <textarea rows={6} className="w-full p-8 bg-slate-50 focus:bg-white border-2 border-transparent focus:border-indigo-600 rounded-[2.5rem] outline-none font-medium text-sm leading-loose shadow-sm transition-all" value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} placeholder="Detail the technical and functional requirements..." required />
                </div>

                <button type="submit" disabled={loading} className="w-full py-6 bg-[#0a1628] hover:bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center disabled:bg-slate-300 active:scale-[0.98] group">
                  {loading ? (
                    <><Loader2 className="animate-spin mr-3" size={24} /> Drafting Regulatory-Dense Document...</>
                  ) : (
                    <><Sparkles className="mr-3 group-hover:rotate-12 transition-transform" size={24} /> Generate High-Fidelity RFP</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
