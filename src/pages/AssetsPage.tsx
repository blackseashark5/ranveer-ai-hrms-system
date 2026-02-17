import { useEffect, useState } from 'react';
import { getAll, add, update, KEYS } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { Plus, Monitor, X } from 'lucide-react';
import { toast } from 'sonner';

const ASSET_TYPES = ['Laptop', 'Phone', 'ID Card', 'Badge'];

const AssetsPage = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: 'Laptop', model: '', serial: '', assignedTo: '', condition: 'good', notes: '' });
  const user = getCurrentUser();
  const canEdit = user?.role === 'admin' || user?.role === 'hr';

  const load = () => { setAssets(getAll(KEYS.ASSETS)); setEmployees(getAll(KEYS.EMPLOYEES)); };
  useEffect(load, []);

  const getEmpName = (id: string) => {
    const emp = employees.find((e: any) => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unassigned';
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.model || !form.serial) { toast.error('Model and serial required'); return; }
    // Check duplicate serial
    if (assets.some(a => a.serial === form.serial)) { toast.error('Serial number already exists'); return; }
    // Check double assignment
    if (form.assignedTo && assets.some(a => a.assignedTo === form.assignedTo && a.type === form.type)) {
      toast.error(`This employee already has a ${form.type} assigned`);
      return;
    }
    add(KEYS.ASSETS, { id: 'asset_' + Date.now(), ...form, assignedDate: form.assignedTo ? new Date().toISOString().split('T')[0] : null });
    toast.success('Asset added');
    setShowAdd(false);
    setForm({ type: 'Laptop', model: '', serial: '', assignedTo: '', condition: 'good', notes: '' });
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">Assets</h1>
        {canEdit && <button onClick={() => setShowAdd(true)} className="btn-primary text-xs"><Plus size={16} /> Add Asset</button>}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ASSET_TYPES.map(type => (
          <div key={type} className="stat-card">
            <Monitor size={18} className="text-accent mb-2" />
            <p className="text-xl font-bold text-foreground">{assets.filter(a => a.type === type).length}</p>
            <p className="text-xs text-muted-foreground">{type}s</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="data-table overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Model</th>
            <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Serial</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Assigned To</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Condition</th>
            <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Notes</th>
          </tr></thead>
          <tbody>
            {assets.map(asset => (
              <tr key={asset.id} className="border-b border-border">
                <td className="p-3 font-medium">{asset.type}</td>
                <td className="p-3">{asset.model}</td>
                <td className="p-3 font-mono text-xs hidden md:table-cell">{asset.serial}</td>
                <td className="p-3">{asset.assignedTo ? getEmpName(asset.assignedTo) : <span className="text-muted-foreground italic">Unassigned</span>}</td>
                <td className="p-3"><span className={asset.condition === 'good' ? 'badge-active' : 'badge-pending'}>{asset.condition}</span></td>
                <td className="p-3 text-muted-foreground text-xs hidden lg:table-cell">{asset.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">Add Asset</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-muted rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><label className="block text-sm font-medium text-foreground mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} className="input-field">
                  {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Model *</label><input value={form.model} onChange={e => setForm(f => ({...f, model: e.target.value}))} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Serial # *</label><input value={form.serial} onChange={e => setForm(f => ({...f, serial: e.target.value}))} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Assign To</label>
                <select value={form.assignedTo} onChange={e => setForm(f => ({...f, assignedTo: e.target.value}))} className="input-field">
                  <option value="">None</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Condition</label>
                <select value={form.condition} onChange={e => setForm(f => ({...f, condition: e.target.value}))} className="input-field">
                  <option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Notes</label><input value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} className="input-field" /></div>
              <button type="submit" className="btn-primary w-full">Add Asset</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsPage;
