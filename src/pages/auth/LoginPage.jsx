import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import toast from 'react-hot-toast';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Successfully logged in');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.20),transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.18),transparent_24%)]" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-lg font-black text-slate-950">
                SO
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-teal-200">Operations</p>
                <h1 className="text-2xl font-bold">Seoly</h1>
              </div>
            </div>
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.25em] text-teal-200/80">Workflow portal</p>
              <h2 className="max-w-sm text-4xl font-extrabold leading-tight tracking-tight">Manage every order, stock, and dispatch milestone in one place.</h2>
            </div>
          </div>

          <div className="grid gap-3 text-sm text-slate-200">
            {['FSE order capture', 'Team leader approvals', 'Warehouse stock flow', 'Dispatch tracking'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 lg:p-10">
          <div className="mb-8 text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">Welcome back</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Sign in</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="input-shell flex items-center gap-3 rounded-2xl px-3 py-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="input-shell flex items-center gap-3 rounded-2xl px-3 py-3">
              <LockKeyhole className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:from-teal-500 hover:to-emerald-400 disabled:opacity-60"
            >
              {loading ? 'Authenticating...' : 'Sign in'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <Link to="/register" className="font-medium text-teal-600 hover:text-teal-700">Create account</Link>
            <Link to="/forgot-password" className="font-medium text-slate-600 hover:text-slate-800">Forgot password?</Link>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center text-xs text-slate-500">
            Use your team credentials to access the workflow dashboard.
          </div>
        </div>
      </div>
    </div>
  );
};