import { useEffect, useState } from 'react';
import { getAll, add, update, KEYS } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { Plus, X, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const STATUSES = ['open', 'in_progress', 'resolved'];
const PRIORITIES = ['low', 'medium', 'high'];

const Tickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', category: 'IT' });
  const [reply, setReply] = useState('');
  const user = getCurrentUser();

  const load = () => { setTickets(getAll(KEYS.TICKETS)); setEmployees(getAll(KEYS.EMPLOYEES)); };
  useEffect(load, []);

  const getEmpName = (id: string) => {
    const emp = employees.find((e: any) => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : id;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { toast.error('Title required'); return; }
    add(KEYS.TICKETS, {
      id: 'ticket_' + Date.now(), ...form, createdBy: user?.employeeId || user?.id,
      assignedTo: null, status: 'open', messages: [{ from: user?.employeeId || user?.id, text: form.description, at: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    });
    toast.success('Ticket created');
    setShowCreate(false);
    setForm({ title: '', description: '', priority: 'medium', category: 'IT' });
    load();
  };

  const handleStatusChange = (id: string, status: string) => {
    update(KEYS.TICKETS, id, { status });
    toast.success('Status updated');
    load();
    if (selectedTicket?.id === id) setSelectedTicket({ ...selectedTicket, status });
  };

  const handleReply = () => {
    if (!reply.trim() || !selectedTicket) return;
    const ticket = tickets.find(t => t.id === selectedTicket.id);
    const msgs = [...(ticket.messages || []), { from: user?.employeeId || user?.id, text: reply, at: new Date().toISOString() }];
    update(KEYS.TICKETS, selectedTicket.id, { messages: msgs });
    setReply('');
    load();
    setSelectedTicket({ ...selectedTicket, messages: msgs });
    toast.success('Reply added');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">Tickets / Helpdesk</h1>
        <button onClick={() => setShowCreate(true)} className="btn-primary text-xs"><Plus size={16} /> Create Ticket</button>
      </div>

      {/* Kanban-style columns */}
      <div className="grid md:grid-cols-3 gap-4">
        {STATUSES.map(status => (
          <div key={status} className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${status === 'open' ? 'bg-sky-500' : status === 'in_progress' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <h3 className="text-sm font-semibold text-foreground capitalize">{status.replace('_', ' ')}</h3>
              <span className="text-xs text-muted-foreground">({tickets.filter(t => t.status === status).length})</span>
            </div>
            <div className="space-y-2">
              {tickets.filter(t => t.status === status).map(ticket => (
                <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="card-section cursor-pointer hover:shadow-md transition-shadow p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-foreground">{ticket.title}</h4>
                    <span className={ticket.priority === 'high' ? 'badge-high' : ticket.priority === 'medium' ? 'badge-medium' : 'badge-low'}>{ticket.priority}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{ticket.category} · {getEmpName(ticket.createdBy)}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare size={12} /> {ticket.messages?.length || 0}
                    <select value={ticket.status} onChange={e => { e.stopPropagation(); handleStatusChange(ticket.id, e.target.value); }} onClick={e => e.stopPropagation()} className="input-field text-xs py-0.5 px-1 w-auto ml-auto">
                      {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              {tickets.filter(t => t.status === status).length === 0 && (
                <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-lg">No tickets</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTicket(null)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">{selectedTicket.title}</h2>
              <button onClick={() => setSelectedTicket(null)} className="p-1 hover:bg-muted rounded-lg"><X size={18} /></button>
            </div>
            <div className="flex gap-2 mb-4">
              <span className={selectedTicket.priority === 'high' ? 'badge-high' : selectedTicket.priority === 'medium' ? 'badge-medium' : 'badge-low'}>{selectedTicket.priority}</span>
              <span className="badge-status bg-muted text-muted-foreground">{selectedTicket.category}</span>
            </div>
            <div className="space-y-3 mb-4">
              {selectedTicket.messages?.map((msg: any, i: number) => (
                <div key={i} className="bg-muted rounded-lg p-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span className="font-medium">{getEmpName(msg.from)}</span>
                    <span>{new Date(msg.at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-foreground">{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={reply} onChange={e => setReply(e.target.value)} className="input-field flex-1" placeholder="Type a reply..." onKeyDown={e => e.key === 'Enter' && handleReply()} />
              <button onClick={handleReply} className="btn-primary">Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-foreground/30 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">Create Ticket</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-muted rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div><label className="block text-sm font-medium text-foreground mb-1">Title *</label><input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Description</label><textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="input-field min-h-[80px]" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({...f, priority: e.target.value}))} className="input-field">
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-foreground mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="input-field">
                    {['IT','HR','Finance','Facilities'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">Submit Ticket</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
