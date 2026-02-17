import { useEffect, useState } from 'react';
import { getAll, add, update, KEYS } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { Plus, Check, XIcon, X } from 'lucide-react';
import { toast } from 'sonner';

const LEAVE_TYPES = ['casual', 'sick', 'paid', 'unpaid'];

const Leave = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showApply, setShowApply] = useState(false);
  const [tab, setTab] = useState<'all' | 'pending' | 'mine'>('all');
  const [form, setForm] = useState({ type: 'casual', from: '', to: '', reason: '' });
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';

  const load = () => {
    setLeaves(getAll(KEYS.LEAVES));
    setEmployees(getAll(KEYS.EMPLOYEES));
  };
  useEffect(load, []);

  const getEmpName = (id: string) => {
    const emp = employees.find((e: any) => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : id;
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.reason) { toast.error('Fill all fields'); return; }
    const from = new Date(form.from);
    const to = new Date(form.to);
    if (to < from) { toast.error('End date must be after start date'); return; }
    const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    // Check overlap
    const myLeaves = leaves.filter((l: any) => l.userId === (user?.employeeId || user?.id) && l.status !== 'rejected');
    const overlap = myLeaves.some((l: any) => new Date(l.from) <= to && new Date(l.to) >= from);
    if (overlap) { toast.error('Overlapping leave exists'); return; }
    const leave = { id: 'leave_' + Date.now(), userId: user?.employeeId || user?.id, type: form.type, from: form.from, to: form.to, days, reason: form.reason, status: 'pending', appliedAt: new Date().toISOString(), decisionAt: null, approverId: null };
    add(KEYS.LEAVES, leave);
    toast.success('Leave applied');
    setShowApply(false);
    setForm({ type: 'casual', from: '', to: '', reason: '' });
    load();
  };

  const handleDecision = (id: string, status: 'approved' | 'rejected') => {
    update(KEYS.LEAVES, id, { status, decisionAt: new Date().toISOString(), approverId: user?.employeeId || user?.id });
    toast.success(`Leave ${status}`);
    load();
  };

  const filtered = tab === 'pending' ? leaves.filter((l: any) => l.status === 'pending')
    : tab === 'mine' ? leaves.filter((l: any) => l.userId === (user?.employeeId || user?.id))
    : leaves;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">Leave Management</h1>
        <button onClick={() => setShowApply(true)} className="btn-primary text-xs"><Plus size={16} /> Apply Leave</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(['all', 'pending', 'mine'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium border-b-2 capitalize transition-colors ${tab === t ? 'border-accent text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t === 'mine' ? 'My Leaves' : t} {t === 'pending' && `(${leaves.filter((l: any) => l.status === 'pending').length})`}
          </button>
        ))}
      </div>

      {/* Leave balances */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {LEAVE_TYPES.map(type => {
          const used = leaves.filter((l: any) => l.userId === (user?.employeeId || user?.id) && l.type === type && l.status === 'approved').reduce((s: number, l: any) => s + l.days, 0);
          const total = type === 'casual' ? 12 : type === 'sick' ? 10 : type === 'paid' ? 15 : 5;
          return (
            <div key={type} className="stat-card">
              <p className="text-xs text-muted-foreground capitalize mb-1">{type} Leave</p>
              <p className="text-xl font-bold text-foreground">{total - used}<span className="text-sm font-normal text-muted-foreground">/{total}</span></p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="data-table overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left p-3 font-medium text-muted-foreground">Employee</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
            <th className="text-left p-3 font-medium text-muted-foreground">From</th>
            <th className="text-left p-3 font-medium text-muted-foreground">To</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Days</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Reason</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
            {isAdmin && <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>}
          </tr></thead>
          <tbody>
            {filtered.map((l: any) => (
              <tr key={l.id} className="border-b border-border">
                <td className="p-3 font-medium">{getEmpName(l.userId)}</td>
                <td className="p-3 capitalize">{l.type}</td>
                <td className="p-3">{l.from}</td>
                <td className="p-3">{l.to}</td>
                <td className="p-3">{l.days}</td>
                <td className="p-3 max-w-[200px] truncate text-muted-foreground">{l.reason}</td>
                <td className="p-3"><span className={l.status === 'approved' ? 'badge-approved' : l.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}>{l.status}</span></td>
                {isAdmin && (
                  <td className="p-3 text-right">
                    {l.status === 'pending' && (
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleDecision(l.id, 'approved')} className="p-1.5 hover:bg-emerald-50 rounded text-emerald-600" title="Approve"><Check size={15} /></button>
                        <button onClick={() => handleDecision(l.id, 'rejected')} className="p-1.5 hover:bg-red-50 rounded text-primary" title="Reject"><XIcon size={15} /></button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No leave records</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Apply Modal */}
      {showApply && (
        <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4" onClick={() => setShowApply(false)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">Apply for Leave</h2>
              <button onClick={() => setShowApply(false)} className="p-1 hover:bg-muted rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Leave Type</label>
                <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} className="input-field">
                  {LEAVE_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-foreground mb-1">From</label><input type="date" value={form.from} onChange={e => setForm(f => ({...f, from: e.target.value}))} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">To</label><input type="date" value={form.to} onChange={e => setForm(f => ({...f, to: e.target.value}))} className="input-field" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Reason</label>
                <textarea value={form.reason} onChange={e => setForm(f => ({...f, reason: e.target.value}))} className="input-field min-h-[80px]" placeholder="Provide reason..." />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Submit</button>
                <button type="button" onClick={() => setShowApply(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
