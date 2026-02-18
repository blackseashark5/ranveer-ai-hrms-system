import { useState, useEffect } from 'react';
import { getAll, add, remove, KEYS } from '@/lib/storage';
import { Plus, Pencil, Trash2, Star, X } from 'lucide-react';
import { toast } from 'sonner';

interface Report {
  id: string;
  reportName: string;
  module: string;
  folder: string;
  isFavourite: boolean;
  createdAt: string;
}

const MODULES = ['Lead', 'Contact', 'Account', 'Opportunity', 'Campaign', 'Employee', 'Attendance', 'Leave', 'Payroll'];
const FOLDERS = ['Lead Folder', 'Default Reports', 'Opportunity Folder', 'HR Folder', 'Custom'];

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ reportName: '', module: 'Lead', folder: 'Default Reports' });
  const [sideFilter, setSideFilter] = useState<'all' | 'favourites'>('all');

  const load = () => setReports(getAll<Report>(KEYS.REPORTS));
  useEffect(() => { load(); }, []);

  const filtered = reports.filter(r => {
    const q = search.toLowerCase();
    const match = !q || r.reportName.toLowerCase().includes(q);
    const modMatch = !filterModule || r.module === filterModule;
    const favMatch = sideFilter === 'all' || r.isFavourite;
    return match && modMatch && favMatch;
  });

  const toggleFav = (id: string) => {
    const r = reports.find(x => x.id === id);
    if (r) {
      const updated = reports.map(x => x.id === id ? { ...x, isFavourite: !x.isFavourite } : x);
      localStorage.setItem(KEYS.REPORTS, JSON.stringify(updated));
      load();
    }
  };

  const save = () => {
    if (!form.reportName) { toast.error('Report name required'); return; }
    add(KEYS.REPORTS, { ...form, id: `rep_${Date.now()}`, isFavourite: false, createdAt: new Date().toISOString() });
    toast.success('Report created');
    setShowModal(false); load();
  };

  const del = (id: string) => { if (confirm('Delete?')) { remove(KEYS.REPORTS, id); load(); toast.success('Deleted'); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="page-header mb-0">Reports</h1>
        <button onClick={() => { setForm({ reportName: '', module: 'Lead', folder: 'Default Reports' }); setShowModal(true); }} className="btn-primary"><Plus size={16} /> New Report</button>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 card-section">
          <div className="flex flex-wrap gap-3 mb-4">
            <input className="input-field flex-1 min-w-[200px]" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="input-field w-auto" value={filterModule} onChange={e => setFilterModule(e.target.value)}>
              <option value="">All Modules</option>
              {MODULES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div className="text-xs text-muted-foreground mb-3">Select ({filtered.length})</div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr className="bg-primary/5">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Report Name ↕</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Module ↕</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Folder ↕</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{r.reportName}</td>
                    <td className="px-4 py-3 text-sm">{r.module}</td>
                    <td className="px-4 py-3 text-sm">{r.folder}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => toggleFav(r.id)} className={`p-1.5 rounded-lg ${r.isFavourite ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'}`}><Star size={14} fill={r.isFavourite ? 'currentColor' : 'none'} /></button>
                        <button onClick={() => del(r.id)} className="p-1.5 hover:bg-red-50 text-destructive rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No reports found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-48 shrink-0 hidden lg:block">
          <div className="card-section space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Reports</h4>
              <button onClick={() => setSideFilter('all')} className={`block text-sm w-full text-left px-2 py-1 rounded ${sideFilter === 'all' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>All Reports</button>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Favourites</h4>
              <button onClick={() => setSideFilter('favourites')} className={`block text-sm w-full text-left px-2 py-1 rounded ${sideFilter === 'favourites' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}>Reports</button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-foreground/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">New Report</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-muted-foreground">Report Name *</label><input className="input-field mt-1" value={form.reportName} onChange={e => setForm({ ...form, reportName: e.target.value })} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Module</label><select className="input-field mt-1" value={form.module} onChange={e => setForm({ ...form, module: e.target.value })}>{MODULES.map(m => <option key={m}>{m}</option>)}</select></div>
              <div><label className="text-xs font-medium text-muted-foreground">Folder</label><select className="input-field mt-1" value={form.folder} onChange={e => setForm({ ...form, folder: e.target.value })}>{FOLDERS.map(f => <option key={f}>{f}</option>)}</select></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
              <button onClick={save} className="btn-primary">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
