import { useEffect, useState } from 'react';
import { getAll, add, update, KEYS } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { Plus, X, Target } from 'lucide-react';
import { toast } from 'sonner';

const Performance = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ userId: '', title: '', description: '', targetMetric: '', deadline: '', progress: 0 });
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';

  const load = () => {
    const p = getAll('hr_performance');
    const e = getAll(KEYS.EMPLOYEES);
    setGoals(isAdmin ? p : p.filter((g: any) => g.userId === (user?.employeeId || user?.id)));
    setEmployees(e);
  };
  useEffect(load, []);

  const getEmpName = (id: string) => {
    const emp = employees.find((e: any) => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : id;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.userId) { toast.error('Fill required fields'); return; }
    add('hr_performance', { id: 'perf_' + Date.now(), ...form, status: 'in_progress', rating: null, feedback: '', createdAt: new Date().toISOString() });
    toast.success('Goal added');
    setShowAdd(false);
    load();
  };

  const updateProgress = (id: string, progress: number) => {
    update('hr_performance', id, { progress: Math.min(100, Math.max(0, progress)) });
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">Performance</h1>
        {isAdmin && <button onClick={() => setShowAdd(true)} className="btn-primary text-xs"><Plus size={16} /> Add Goal</button>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {goals.map(goal => (
          <div key={goal.id} className="card-section">
            <div className="flex items-start gap-3 mb-3">
              <Target size={18} className="text-accent mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm">{goal.title}</h3>
                <p className="text-xs text-muted-foreground">{getEmpName(goal.userId)} · Due {goal.deadline}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{goal.description}</p>
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{goal.progress}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${goal.progress}%` }} />
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-2 mt-3">
                <input type="range" min={0} max={100} value={goal.progress} onChange={e => updateProgress(goal.id, Number(e.target.value))} className="flex-1" />
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">Target: {goal.targetMetric}</p>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="col-span-2 text-center py-12 text-muted-foreground">
            <Target size={40} className="mx-auto mb-3 text-muted" />
            <p>No performance goals set</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">Add Goal</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-muted rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><label className="block text-sm font-medium text-foreground mb-1">Employee *</label>
                <select value={form.userId} onChange={e => setForm(f => ({...f, userId: e.target.value}))} className="input-field">
                  <option value="">Select...</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Title *</label><input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Description</label><textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="input-field min-h-[60px]" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-foreground mb-1">Target Metric</label><input value={form.targetMetric} onChange={e => setForm(f => ({...f, targetMetric: e.target.value}))} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">Deadline</label><input type="date" value={form.deadline} onChange={e => setForm(f => ({...f, deadline: e.target.value}))} className="input-field" /></div>
              </div>
              <button type="submit" className="btn-primary w-full">Add Goal</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;
