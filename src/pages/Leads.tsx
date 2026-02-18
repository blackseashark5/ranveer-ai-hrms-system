import { useState, useEffect } from 'react';
import { getAll, add, update, remove, KEYS, exportCSV, downloadFile } from '@/lib/storage';
import { Search, Plus, Pencil, Trash2, Users, Download, X } from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  leadSource: string;
  industry: string;
  annualRevenue: number;
  status: string;
  createdAt: string;
}

const SOURCES = ['Website', 'Campaign', 'Referral', 'Event', 'Social Media', 'Email', 'Phone', 'Partner'];
const INDUSTRIES = ['Finance', 'Banking', 'Technology', 'Healthcare', 'Retail', 'Education', 'Manufacturing'];
const STATUSES = ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'];

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', firstName: '', lastName: '', email: '', phone: '', leadSource: 'Website', industry: 'Technology', annualRevenue: 0, status: 'New' });
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = () => setLeads(getAll<Lead>(KEYS.LEADS));
  useEffect(() => { load(); }, []);

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const match = !q || l.title.toLowerCase().includes(q) || l.firstName.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
    const srcMatch = !filterSource || l.leadSource === filterSource;
    const indMatch = !filterIndustry || l.industry === filterIndustry;
    return match && srcMatch && indMatch;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const openAdd = () => { setEditId(null); setForm({ title: '', firstName: '', lastName: '', email: '', phone: '', leadSource: 'Website', industry: 'Technology', annualRevenue: 0, status: 'New' }); setShowModal(true); };
  const openEdit = (l: Lead) => { setEditId(l.id); setForm({ title: l.title, firstName: l.firstName, lastName: l.lastName, email: l.email, phone: l.phone, leadSource: l.leadSource, industry: l.industry, annualRevenue: l.annualRevenue, status: l.status }); setShowModal(true); };

  const save = () => {
    if (!form.firstName || !form.email) { toast.error('First name and email required'); return; }
    if (editId) {
      update(KEYS.LEADS, editId, form);
      toast.success('Lead updated');
    } else {
      add(KEYS.LEADS, { ...form, id: `lead_${Date.now()}`, createdAt: new Date().toISOString() });
      toast.success('Lead added');
    }
    setShowModal(false); load();
  };

  const del = (id: string) => { if (confirm('Delete this lead?')) { remove(KEYS.LEADS, id); load(); toast.success('Lead deleted'); } };

  const exportLeads = () => {
    const csv = exportCSV(filtered, [
      { key: 'title', label: 'Title' }, { key: 'firstName', label: 'First Name' }, { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' }, { key: 'leadSource', label: 'Lead Source' }, { key: 'industry', label: 'Industry' },
      { key: 'annualRevenue', label: 'Annual Revenue' }, { key: 'status', label: 'Status' }
    ]);
    downloadFile(csv, 'leads_export.csv', 'text/csv');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="page-header mb-0">Leads</h1>
        <div className="flex gap-2">
          <button onClick={exportLeads} className="btn-secondary"><Download size={16} /> CSV</button>
          <button onClick={openAdd} className="btn-primary"><Plus size={16} /> New Lead</button>
        </div>
      </div>

      <div className="card-section">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="input-field pl-9" placeholder="Search leads..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="input-field w-auto" value={filterSource} onChange={e => { setFilterSource(e.target.value); setPage(1); }}>
            <option value="">All Sources</option>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input-field w-auto" value={filterIndustry} onChange={e => { setFilterIndustry(e.target.value); setPage(1); }}>
            <option value="">All Industries</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div className="text-xs text-muted-foreground mb-3">Select ({filtered.length})</div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="bg-primary/5">
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Title ↕</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary">First Name ↕</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Email ↕</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Lead Source ↕</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Industry ↕</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Annual Rev</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(l => (
                <tr key={l.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-sm">{l.title}</td>
                  <td className="px-4 py-3 text-sm">{l.firstName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{l.email}</td>
                  <td className="px-4 py-3 text-sm">{l.leadSource}</td>
                  <td className="px-4 py-3 text-sm">{l.industry}</td>
                  <td className="px-4 py-3 text-sm">INR {l.annualRevenue.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`badge-status ${l.status === 'Converted' ? 'bg-emerald-100 text-emerald-700' : l.status === 'Qualified' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>{l.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(l)} className="p-1.5 hover:bg-muted rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => del(l.id)} className="p-1.5 hover:bg-red-50 text-destructive rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No leads found</td></tr>}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-medium ${page === i + 1 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-foreground/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-lg p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">{editId ? 'Edit Lead' : 'New Lead'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-medium text-muted-foreground">Title</label><input className="input-field mt-1" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">First Name *</label><input className="input-field mt-1" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Last Name</label><input className="input-field mt-1" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Email *</label><input className="input-field mt-1" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Phone</label><input className="input-field mt-1" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Lead Source</label><select className="input-field mt-1" value={form.leadSource} onChange={e => setForm({ ...form, leadSource: e.target.value })}>{SOURCES.map(s => <option key={s}>{s}</option>)}</select></div>
              <div><label className="text-xs font-medium text-muted-foreground">Industry</label><select className="input-field mt-1" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}>{INDUSTRIES.map(i => <option key={i}>{i}</option>)}</select></div>
              <div><label className="text-xs font-medium text-muted-foreground">Annual Revenue</label><input className="input-field mt-1" type="number" value={form.annualRevenue} onChange={e => setForm({ ...form, annualRevenue: Number(e.target.value) })} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Status</label><select className="input-field mt-1" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
              <button onClick={save} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
