import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAll, KEYS } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { Users, Clock, CalendarDays, Ticket, Wallet, UserPlus, CheckSquare, Megaphone, PlusCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const DEPT_COLORS = ['hsl(205,100%,75%)', 'hsl(355,78%,56%)', 'hsl(150,60%,50%)', 'hsl(45,100%,60%)', 'hsl(280,60%,60%)', 'hsl(30,80%,55%)', 'hsl(190,70%,50%)'];

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, present: 0, pendingLeaves: 0, openTickets: 0, payrollDue: 0 });
  const [deptData, setDeptData] = useState<{name:string;value:number}[]>([]);
  const [leaveData, setLeaveData] = useState<{name:string;count:number}[]>([]);
  const [activities, setActivities] = useState<{text:string;time:string}[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    const employees = getAll(KEYS.EMPLOYEES);
    const attendance = getAll(KEYS.ATTENDANCE);
    const leaves = getAll(KEYS.LEAVES);
    const tickets = getAll(KEYS.TICKETS);
    const payrolls = getAll(KEYS.PAYROLLS);

    const today = new Date().toISOString().split('T')[0];
    const todayAtt = attendance.filter((a: any) => a.date === today && a.status === 'present');
    const pending = leaves.filter((l: any) => l.status === 'pending');
    const open = tickets.filter((t: any) => t.status === 'open' || t.status === 'in_progress');
    const payDue = payrolls.filter((p: any) => p.status === 'pending');

    setStats({ total: employees.length, present: todayAtt.length, pendingLeaves: pending.length, openTickets: open.length, payrollDue: payDue.length });

    // Department distribution
    const deptMap: Record<string,number> = {};
    employees.forEach((e: any) => { deptMap[e.department] = (deptMap[e.department] || 0) + 1; });
    setDeptData(Object.entries(deptMap).map(([name, value]) => ({ name, value })));

    // Leave type breakdown
    const leaveMap: Record<string,number> = {};
    leaves.forEach((l: any) => { leaveMap[l.type] = (leaveMap[l.type] || 0) + 1; });
    setLeaveData(Object.entries(leaveMap).map(([name, count]) => ({ name, count })));

    // Recent activities
    const acts: {text:string;time:string}[] = [];
    employees.slice(-5).reverse().forEach((e: any) => {
      acts.push({ text: `${e.firstName} ${e.lastName} joined as ${e.designation}`, time: e.joinDate });
    });
    leaves.filter((l: any) => l.status === 'approved').slice(-3).forEach((l: any) => {
      const emp = employees.find((e: any) => e.id === l.userId);
      if (emp) acts.push({ text: `${emp.firstName}'s ${l.type} leave approved`, time: l.decisionAt?.split('T')[0] || '' });
    });
    setActivities(acts.slice(0, 8));
  }, []);

  const statCards = [
    { label: 'Total Employees', value: stats.total, icon: Users, color: 'text-accent' },
    { label: 'Present Today', value: stats.present, icon: Clock, color: 'text-emerald-500' },
    { label: 'Pending Leaves', value: stats.pendingLeaves, icon: CalendarDays, color: 'text-amber-500' },
    { label: 'Open Tickets', value: stats.openTickets, icon: Ticket, color: 'text-primary' },
    { label: 'Payroll Due', value: stats.payrollDue, icon: Wallet, color: 'text-violet-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header mb-1">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.name} 👋</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="stat-card animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <card.icon className={card.color} size={22} />
            </div>
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Department Pie */}
        <div className="card-section">
          <h3 className="text-sm font-semibold text-foreground mb-4">Department Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                  {deptData.map((_, i) => <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {deptData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DEPT_COLORS[i % DEPT_COLORS.length] }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>

        {/* Leave Breakdown */}
        <div className="card-section">
          <h3 className="text-sm font-semibold text-foreground mb-4">Leave Type Breakdown</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaveData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(205,100%,75%)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card-section">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activities.map((act, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-foreground">{act.text}</p>
                  <p className="text-xs text-muted-foreground">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-section">
        <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/employees" className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-accent/10 transition-colors">
            <UserPlus size={18} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Add Employee</span>
          </Link>
          <Link to="/leave" className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-accent/10 transition-colors">
            <CheckSquare size={18} className="text-emerald-500" />
            <span className="text-sm font-medium text-foreground">Approve Leaves</span>
          </Link>
          <Link to="/announcements" className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-accent/10 transition-colors">
            <Megaphone size={18} className="text-amber-500" />
            <span className="text-sm font-medium text-foreground">Announcement</span>
          </Link>
          <Link to="/tickets" className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-accent/10 transition-colors">
            <PlusCircle size={18} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Raise Ticket</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
