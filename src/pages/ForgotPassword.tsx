import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    // Simulate sending reset email
    const token = 'reset_' + Date.now();
    localStorage.setItem('hr_reset_token', JSON.stringify({ email, token, expiry: Date.now() + 3600000 }));
    setSent(true);
    toast.success('Reset link sent! (simulated)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-accent-foreground">HR</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground text-sm mt-1">We'll send you a reset link</p>
        </div>

        <div className="card-section p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✉️</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Check your email</h3>
              <p className="text-sm text-muted-foreground mb-6">We've sent a password reset link to <strong>{email}</strong> (simulated)</p>
              <Link to="/" className="btn-secondary">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="your@email.com" />
              </div>
              <button type="submit" className="btn-primary w-full">Send Reset Link</button>
            </form>
          )}
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/" className="text-accent font-medium hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
