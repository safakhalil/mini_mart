import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../common/Logo';

interface AdminLoginPageProps {
  onBackToCustomer: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBackToCustomer }) => {
  const { adminLogin } = useStore();
  const [email, setEmail] = useState('admin@247mart.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await adminLogin(email, password);
    setIsLoading(false);
  };

  const handleQuickDemoLogin = async () => {
    setEmail('admin@247mart.com');
    setPassword('admin123');
    setIsLoading(true);
    await adminLogin('admin@247mart.com', 'admin123');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to store button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBackToCustomer}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customer Store</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-4">
        <div className="inline-flex justify-center">
          <Logo variant="light" size="lg" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Store Operations Portal</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Admin & Staff Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage inventory, live orders, sales analytics and promotions.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-8 shadow-2xl rounded-3xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Quick Demo Login Button */}
          <div className="pt-4 border-t border-slate-800 space-y-3 text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>1-Click Demo Login as Administrator</span>
            </button>

            <div className="text-[11px] text-slate-500">
              <span>Credentials: </span>
              <code className="text-slate-400">admin@247mart.com</code> /{' '}
              <code className="text-slate-400">admin123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
