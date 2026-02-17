import { useEffect, useState } from 'react';
import { getAll, add, KEYS } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { Plus, X, Megaphone, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', publishDate: '', expiryDate: '', audience: 'all' });
  const user = getCurrentUser();
  const canCreate = user?.role === 'admin' || user?.role === 'hr';

  const load = () => {
    const ann = getAll(KEYS.ANNOUNCEMENTS);
    ann.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAnnouncements(ann);
  };
  useEffect(load, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body) { toast.error('Title and body required'); return; }
    add(KEYS.ANNOUNCEMENTS, {
      id: 'ann_' + Date.now(), ...form,
      createdBy: user?.employeeId || user?.id,
      createdAt: new Date().toISOString(),
    });
    toast.success('Announcement published');
    setShowCreate(false);
    setForm({ title: '', body: '', publishDate: '', expiryDate: '', audience: 'all' });
    load();
  };

  const isActive = (ann: any) => {
    const now = new Date();
    if (ann.expiryDate && new Date(ann.expiryDate) < now) return false;
    if (ann.publishDate && new Date(ann.publishDate) > now) return false;
    return true;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">Announcements</h1>
        {canCreate && <button onClick={() => setShowCreate(true)} className="btn-primary text-xs"><Plus size={16} /> New Announcement</button>}
      </div>

      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className={`card-section transition-opacity ${!isActive(ann) ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <Megaphone size={18} className="text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground text-sm">{ann.title}</h3>
                  {!isActive(ann) && <span className="badge-inactive">Expired</span>}
                  {ann.audience !== 'all' && <span className="badge-status bg-accent/20 text-accent-foreground text-xs">{ann.audience}</span>}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{ann.body}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(ann.createdAt).toLocaleDateString()}</span>
                  {ann.expiryDate && <span>Expires: {ann.expiryDate}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Megaphone size={40} className="mx-auto mb-3 text-muted" />
            <p>No announcements yet</p>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">New Announcement</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-muted rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div><label className="block text-sm font-medium text-foreground mb-1">Title *</label><input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Body *</label><textarea value={form.body} onChange={e => setForm(f => ({...f, body: e.target.value}))} className="input-field min-h-[100px]" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-foreground mb-1">Publish Date</label><input type="date" value={form.publishDate} onChange={e => setForm(f => ({...f, publishDate: e.target.value}))} className="input-field" /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1">Expiry Date</label><input type="date" value={form.expiryDate} onChange={e => setForm(f => ({...f, expiryDate: e.target.value}))} className="input-field" /></div>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Target Audience</label>
                <select value={form.audience} onChange={e => setForm(f => ({...f, audience: e.target.value}))} className="input-field">
                  <option value="all">All</option>
                  {['Engineering','HR','Finance','Marketing','Operations','Design','Sales'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">Publish</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
