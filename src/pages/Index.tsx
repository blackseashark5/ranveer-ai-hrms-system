import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '@/lib/auth';
import { initializeMockData } from '@/lib/mockData';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 sidebar-gradient items-center justify-center p-12">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl font-bold text-white">HR</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">HRMS Portal</h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Manage your workforce efficiently. Track attendance, process payroll, handle leaves, and more — all in one place.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-white/80 text-sm">
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
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent-foreground">HR</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">HRMS Portal</h1>
          </div>

          <div className="card-section p-8">
            <h2 className="text-xl font-bold text-foreground mb-1">Welcome back</h2>
            <p className="text-muted-foreground text-sm mb-6">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="admin@company.test"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Password123!"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="rounded border-input" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-accent hover:underline font-medium">Forgot password?</Link>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

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
