import { useState, useEffect, useMemo } from 'react';
import { getAll, add, remove, KEYS } from '@/lib/storage';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'task' | 'event' | 'meeting' | 'unavailability';
  color: string;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  task: 'bg-yellow-300 text-yellow-900',
  event: 'bg-pink-400 text-white',
  meeting: 'bg-emerald-400 text-white',
  unavailability: 'bg-gray-400 text-white',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '12:00', type: 'task' as CalendarEvent['type'] });
  const [filters, setFilters] = useState({ task: true, event: true, meeting: true, unavailability: true });

  const load = () => setEvents(getAll<CalendarEvent>(KEYS.CALENDAR_EVENTS));
  useEffect(() => { load(); }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const calendarDays = useMemo(() => {
    const days: { date: number; month: number; year: number; isCurrentMonth: boolean }[] = [];
    const prevDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) days.push({ date: prevDays - i, month: month - 1, year, isCurrentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ date: i, month, year, isCurrentMonth: true });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ date: i, month: month + 1, year, isCurrentMonth: false });
    return days;
  }, [year, month, firstDay, daysInMonth]);

  const getEventsForDay = (date: number, m: number, y: number) => {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr && filters[e.type]);
  };

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const save = () => {
    if (!form.title || !form.date) { toast.error('Title and date required'); return; }
    add(KEYS.CALENDAR_EVENTS, { ...form, id: `evt_${Date.now()}`, color: '', createdAt: new Date().toISOString() });
    toast.success('Event added');
    setShowModal(false); load();
  };

  const isToday = (d: number, m: number, y: number) => d === today.getDate() && m === today.getMonth() && y === today.getFullYear();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-header mb-0">Calendar</h1>
          <p className="text-sm text-muted-foreground">{monthName}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="p-2 hover:bg-muted rounded-lg"><ChevronLeft size={18} /></button>
          <button onClick={goToday} className="btn-primary text-xs px-3 py-1.5">Today</button>
          <button onClick={next} className="p-2 hover:bg-muted rounded-lg"><ChevronRight size={18} /></button>
          <button onClick={() => { setForm({ title: '', date: `${year}-${String(month+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`, time: '12:00', type: 'task' }); setShowModal(true); }} className="btn-primary ml-2"><Plus size={16} /> Add</button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 card-section">
          <div className="grid grid-cols-7">
            {DAYS.map(d => (
              <div key={d} className="py-3 text-center text-xs font-semibold text-muted-foreground border-b border-border">{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              const dayEvents = getEventsForDay(day.date, day.month, day.year);
              const showMax = 2;
              return (
                <div
                  key={i}
                  className={`min-h-[90px] p-1 border-b border-r border-border relative ${!day.isCurrentMonth ? 'bg-muted/30' : ''} ${isToday(day.date, day.month, day.year) ? 'bg-accent/15' : ''}`}
                >
                  <div className={`text-xs font-medium mb-1 text-right pr-1 ${!day.isCurrentMonth ? 'text-muted-foreground/50' : isToday(day.date, day.month, day.year) ? 'text-primary font-bold' : 'text-foreground'}`}>
                    {day.date}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, showMax).map(e => (
                      <div key={e.id} className={`text-[10px] px-1 py-0.5 rounded truncate ${TYPE_COLORS[e.type]}`}>
                        {e.time} {e.title}
                      </div>
                    ))}
                    {dayEvents.length > showMax && (
                      <div className="text-[10px] text-primary font-medium px-1">+{dayEvents.length - showMax} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-48 shrink-0 hidden lg:block">
          <div className="card-section space-y-3">
            {(['task', 'event', 'meeting', 'unavailability'] as const).map(type => (
              <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={filters[type]} onChange={() => setFilters(f => ({ ...f, [type]: !f[type] }))} className="w-4 h-4 rounded border-border text-primary accent-primary" />
                <span className="capitalize">{type === 'unavailability' ? 'Unavailability' : type + 's'}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-foreground/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">Add Event</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-muted-foreground">Title *</label><input className="input-field mt-1" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-muted-foreground">Date *</label><input className="input-field mt-1" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Time</label><input className="input-field mt-1" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></div>
              </div>
              <div><label className="text-xs font-medium text-muted-foreground">Type</label>
                <select className="input-field mt-1" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}>
                  <option value="task">Task</option>
                  <option value="event">Event</option>
                  <option value="meeting">Meeting</option>
                  <option value="unavailability">Unavailability</option>
                </select>
              </div>
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

export default CalendarPage;
