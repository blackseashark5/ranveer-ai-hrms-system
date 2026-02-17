import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '@/lib/auth';
import { initializeMockData } from '@/lib/mockData';
import { toast } from 'sonner';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'employee' as const, password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    initializeMockData();
    try {
      signup(form);
      toast.success('Account created! Please sign in.');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-accent-foreground">HR</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join the HRMS platform</p>
        </div>

        <div className="card-section p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="input-field" placeholder="you@company.test" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="input-field" placeholder="+91-9800000000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Role *</label>
              <select value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value as any}))} className="input-field">
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password *</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} className="input-field" placeholder="Min 8 characters" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password *</label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm(f => ({...f, confirmPassword: e.target.value}))} className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
