import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '@/lib/auth';
import {
  LayoutDashboard, Users, Clock, CalendarDays, Wallet,
  Briefcase, Ticket, TrendingUp, Monitor, Megaphone,
  Settings, LogOut, Menu, X, Bell, Target, Building2,
  FileBarChart, Calendar
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/employees', label: 'Employees', icon: Users },
  { path: '/attendance', label: 'Attendance', icon: Clock },
  { path: '/leave', label: 'Leave', icon: CalendarDays },
  { path: '/payroll', label: 'Payroll', icon: Wallet },
  { path: '/recruitment', label: 'Recruitment', icon: Briefcase },
  { path: '/tickets', label: 'Tickets', icon: Ticket },
  { path: '/performance', label: 'Performance', icon: TrendingUp },
  { path: '/assets', label: 'Assets', icon: Monitor },
  { path: '/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/leads', label: 'Leads', icon: Target },
  { path: '/accounts', label: 'Accounts', icon: Building2 },
  { path: '/reports', label: 'Reports', icon: FileBarChart },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 sidebar-gradient transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        <div className="flex items-center justify-between p-5 pb-6">
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">HRMS</h1>
            <p className="text-sidebar-foreground/60 text-xs mt-0.5">Human Resource Management</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-sidebar-foreground/80 hover:text-sidebar-foreground">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sidebar-primary/20 text-sidebar-foreground shadow-sm'
                    : 'text-sidebar-foreground/75 hover:bg-sidebar-primary/10 hover:text-sidebar-foreground'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-foreground/15">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-foreground font-bold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-sidebar-foreground/50 capitalize">{user?.role || 'Employee'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sidebar-foreground/60 hover:text-sidebar-foreground text-sm w-full px-2 py-1.5 rounded-lg hover:bg-sidebar-primary/10 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-muted rounded-lg text-foreground">
            <Menu size={22} />
          </button>
          <div className="hidden lg:block">
            <span className="text-sm font-medium text-muted-foreground capitalize">
              {location.pathname.replace('/', '') || 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 hover:bg-muted rounded-lg text-foreground">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
