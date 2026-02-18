import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAll, KEYS } from '@/lib/storage';
import { getCurrentUser } from '@/lib/auth';
import { Users, Clock, CalendarDays, Ticket, Wallet, UserPlus, CheckSquare, Megaphone, PlusCircle, Target, Building2, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, FunnelChart, Funnel, LabelList, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const DEPT_COLORS = ['hsl(205,100%,75%)', 'hsl(355,78%,56%)', 'hsl(150,60%,50%)', 'hsl(45,100%,60%)', 'hsl(280,60%,60%)', 'hsl(30,80%,55%)', 'hsl(190,70%,50%)'];
const LEAD_SOURCE_COLORS = ['hsl(355,78%,56%)', 'hsl(30,80%,55%)', 'hsl(205,100%,60%)', 'hsl(150,60%,50%)', 'hsl(280,60%,60%)', 'hsl(355,78%,70%)', 'hsl(205,60%,45%)', 'hsl(150,80%,60%)'];
const ACCOUNT_COLORS = ['hsl(270,60%,70%)', 'hsl(355,70%,65%)', 'hsl(30,90%,60%)', 'hsl(190,70%,50%)', 'hsl(280,50%,55%)', 'hsl(150,60%,50%)', 'hsl(205,80%,55%)', 'hsl(45,90%,55%)'];

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, present: 0, pendingLeaves: 0, openTickets: 0, payrollDue: 0, totalLeads: 0, totalAccounts: 0 });
  const [deptData, setDeptData] = useState<{name:string;value:number}[]>([]);
  const [leaveData, setLeaveData] = useState<{name:string;count:number}[]>([]);
  const [activities, setActivities] = useState<{text:string;time:string}[]>([]);
  const [leadSourceData, setLeadSourceData] = useState<{name:string;value:number}[]>([]);
  const [accountTypeData, setAccountTypeData] = useState<{name:string;value:number}[]>([]);
  const [wonLeads, setWonLeads] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<{month:string;hires:number;attrition:number}[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    const employees = getAll(KEYS.EMPLOYEES);
    const attendance = getAll(KEYS.ATTENDANCE);
    const leaves = getAll(KEYS.LEAVES);
    const tickets = getAll(KEYS.TICKETS);
    const payrolls = getAll(KEYS.PAYROLLS);
    const leads = getAll<any>(KEYS.LEADS);
    const accounts = getAll<any>(KEYS.ACCOUNTS);

    const today = new Date().toISOString().split('T')[0];
    const todayAtt = attendance.filter((a: any) => a.date === today && a.status === 'present');
    const pending = leaves.filter((l: any) => l.status === 'pending');
    const open = tickets.filter((t: any) => t.status === 'open' || t.status === 'in_progress');
    const payDue = payrolls.filter((p: any) => p.status === 'pending');

    setStats({ total: employees.length, present: todayAtt.length, pendingLeaves: pending.length, openTickets: open.length, payrollDue: payDue.length, totalLeads: leads.length, totalAccounts: accounts.length });

    // Department distribution
    const deptMap: Record<string,number> = {};
    employees.forEach((e: any) => { deptMap[e.department] = (deptMap[e.department] || 0) + 1; });
    setDeptData(Object.entries(deptMap).map(([name, value]) => ({ name, value })));

    // Leave type breakdown
    const leaveMap: Record<string,number> = {};
    leaves.forEach((l: any) => { leaveMap[l.type] = (leaveMap[l.type] || 0) + 1; });
    setLeaveData(Object.entries(leaveMap).map(([name, count]) => ({ name, count })));

    // Lead source funnel
    const srcMap: Record<string,number> = {};
    leads.forEach((l: any) => { srcMap[l.leadSource] = (srcMap[l.leadSource] || 0) + 1; });
    setLeadSourceData(Object.entries(srcMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value));

    // Account type pie
    const accMap: Record<string,number> = {};
    accounts.forEach((a: any) => { accMap[a.accountType] = (accMap[a.accountType] || 0) + 1; });
    setAccountTypeData(Object.entries(accMap).map(([name, value]) => ({ name, value })));

    // Won/converted leads
    setWonLeads(leads.filter((l: any) => l.status === 'Converted' || l.status === 'Qualified').slice(0, 5));

    // Monthly trend (simulated)
    setMonthlyData([
      { month: 'Sep', hires: 3, attrition: 1 }, { month: 'Oct', hires: 5, attrition: 2 },
      { month: 'Nov', hires: 2, attrition: 1 }, { month: 'Dec', hires: 4, attrition: 0 },
      { month: 'Jan', hires: 6, attrition: 1 }, { month: 'Feb', hires: 3, attrition: 2 },
    ]);

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
    { label: 'Total Employees', value: stats.total, icon: Users, color: 'text-accent', change: '+12%', up: true },
    { label: 'Present Today', value: stats.present, icon: Clock, color: 'text-emerald-500', change: '+5%', up: true },
    { label: 'Pending Leaves', value: stats.pendingLeaves, icon: CalendarDays, color: 'text-amber-500', change: '-3%', up: false },
    { label: 'Open Tickets', value: stats.openTickets, icon: Ticket, color: 'text-primary', change: '+8%', up: true },
    { label: 'Payroll Due', value: stats.payrollDue, icon: Wallet, color: 'text-violet-500', change: '-2%', up: false },
    { label: 'Total Leads', value: stats.totalLeads, icon: Target, color: 'text-orange-500', change: '+18%', up: true },
    { label: 'Accounts', value: stats.totalAccounts, icon: Building2, color: 'text-sky-600', change: '+6%', up: true },
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {statCards.map((card, idx) => (
          <div key={card.label} className="stat-card animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-center justify-between mb-2">
              <card.icon className={card.color} size={20} />
              <span className={`flex items-center gap-0.5 text-[10px] font-medium ${card.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {card.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {card.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Row 1: Dept Pie + Lead Source Funnel + Won Leads Table */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-section">
          <h3 className="text-sm font-semibold text-foreground mb-4">Accounts by Type</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={accountTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={3}>
                  {accountTypeData.map((_, i) => <Cell key={i} fill={ACCOUNT_COLORS[i % ACCOUNT_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {accountTypeData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCOUNT_COLORS[i % ACCOUNT_COLORS.length] }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>

        <div className="card-section">
          <h3 className="text-sm font-semibold text-foreground mb-4">Leads by Source</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadSourceData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {leadSourceData.map((_, i) => <Cell key={i} fill={LEAD_SOURCE_COLORS[i % LEAD_SOURCE_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-section">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Won Leads</h3>
            <span className="text-xs text-primary font-medium">Records ({wonLeads.length})</span>
          </div>
          <div className="overflow-auto max-h-60">
            <table className="w-full text-sm">
              <thead><tr className="bg-primary/5"><th className="px-3 py-2 text-left text-xs font-semibold text-primary">First Name</th><th className="px-3 py-2 text-left text-xs font-semibold text-primary">Last Name</th><th className="px-3 py-2 text-left text-xs font-semibold text-primary">Email</th></tr></thead>
              <tbody>
                {wonLeads.map(l => (
                  <tr key={l.id} className="border-t border-border"><td className="px-3 py-2">{l.firstName}</td><td className="px-3 py-2">{l.lastName || '-'}</td><td className="px-3 py-2 text-muted-foreground">{l.email}</td></tr>
                ))}
                {wonLeads.length === 0 && <tr><td colSpan={3} className="text-center py-4 text-muted-foreground">No won leads</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 2: Dept Distribution + Leave Breakdown + Hires Trend */}
      <div className="grid lg:grid-cols-3 gap-6">
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

        <div className="card-section">
          <h3 className="text-sm font-semibold text-foreground mb-4">Hires vs Attrition</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210,20%,90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="hires" stroke="hsl(150,60%,50%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="attrition" stroke="hsl(355,78%,56%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Activity + Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
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

        <div className="card-section">
          <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
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
            <Link to="/leads" className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-accent/10 transition-colors">
              <Target size={18} className="text-orange-500" />
              <span className="text-sm font-medium text-foreground">Add Lead</span>
            </Link>
            <Link to="/calendar" className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-accent/10 transition-colors">
              <CalendarDays size={18} className="text-sky-600" />
              <span className="text-sm font-medium text-foreground">View Calendar</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
