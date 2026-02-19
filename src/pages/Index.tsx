import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '@/lib/auth';
import { initializeMockData } from '@/lib/mockData';
import { toast } from 'sonner';
import { Eye, EyeOff, Shield, Users, Clock, BarChart3, Lock, Mail } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    initializeMockData();
    setTimeout(() => {
      const user = login(email, password);
      if (user) {
        toast.success(`Welcome back, ${user.name}!`);
        navigate('/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
      setLoading(false);
    }, 500);
  };

  const features = [
    { icon: Users, label: 'Employee Management', desc: 'Track & manage workforce' },
    { icon: Clock, label: 'Attendance & Leave', desc: 'Automated time tracking' },
    { icon: BarChart3, label: 'Payroll & Reports', desc: 'Analytics & insights' },
    { icon: Shield, label: 'Role-Based Access', desc: 'Admin, HR & Employee' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 sidebar-gradient items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-10 w-40 h-40 rounded-full bg-white/5" />

        <div className="text-center max-w-md relative z-10 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 shadow-lg">
            <span className="text-4xl font-bold text-white">HR</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">HRMS Portal</h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Manage your workforce efficiently. Track attendance, process payroll, handle leaves, and more — all in one place.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {features.map((f, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left hover:bg-white/15 transition-colors">
                <f.icon className="w-5 h-5 text-white/90 mb-2" />
                <div className="text-sm font-semibold text-white">{f.label}</div>
                <div className="text-xs text-white/60">{f.desc}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 text-white/80 text-sm">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">150+</div>
              <div>Employees</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">98%</div>
              <div>Attendance</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">4.8★</div>
              <div>Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent-foreground">HR</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">HRMS Portal</h1>
          </div>

          <div className="card-section p-8">
            <h2 className="text-xl font-bold text-foreground mb-1">Welcome back</h2>
            <p className="text-muted-foreground text-sm mb-6">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="admin@company.test"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="Password123!"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="rounded border-input" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-accent hover:underline font-medium">Forgot password?</Link>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground">or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="btn-ghost border border-border text-sm" onClick={() => toast.info('SSO coming soon')}>
                <Shield className="w-4 h-4" /> SSO Login
              </button>
              <button className="btn-ghost border border-border text-sm" onClick={() => toast.info('Microsoft login coming soon')}>
                <svg className="w-4 h-4" viewBox="0 0 21 21"><rect x="1" y="1" width="9" height="9" fill="hsl(var(--destructive))" /><rect x="11" y="1" width="9" height="9" fill="hsl(var(--accent))" /><rect x="1" y="11" width="9" height="9" fill="hsl(var(--accent))" /><rect x="11" y="11" width="9" height="9" fill="hsl(var(--muted-foreground))" /></svg>
                Microsoft
              </button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account? <Link to="/signup" className="text-accent font-medium hover:underline">Sign up</Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-xl">
            <p className="text-xs font-medium text-muted-foreground mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium text-foreground">Admin:</span> admin@company.test / Password123!</p>
              <p><span className="font-medium text-foreground">HR:</span> hr@company.test / Password123!</p>
              <p><span className="font-medium text-foreground">Employee:</span> emp@company.test / Password123!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
