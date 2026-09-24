import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error) => {
    const response = error.response?.data;
    if (Array.isArray(response?.errors)) {
      return response.errors.map((entry) => entry.message || entry.msg).filter(Boolean).join(', ');
    }
    return response?.message || response?.error || 'Registration failed';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    if (payload.name.length < 2) {
      toast.error('Enter your full name');
      return;
    }

    if (payload.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const { data } = await authApi.register(payload);
      localStorage.setItem('accessToken', data.accessToken || data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-teal-600">Create account</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Register</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
            <UserPlus className="h-5 w-5" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Name</label>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="input-shell w-full rounded-2xl px-3 py-3 text-sm text-slate-800 outline-none" placeholder="Jane Doe" required />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Email</label>
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="input-shell w-full rounded-2xl px-3 py-3 text-sm text-slate-800 outline-none" placeholder="you@example.com" required />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Password</label>
            <input type="password" minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="input-shell w-full rounded-2xl px-3 py-3 text-sm text-slate-800 outline-none" placeholder="Minimum 8 characters" required />
          </div>

          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
          <Link to="/login" className="inline-flex items-center gap-2 font-medium text-teal-600 hover:text-teal-700">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};
