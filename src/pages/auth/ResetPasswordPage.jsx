import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';

export const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const token = params.get('token') || '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await authApi.resetPassword({ token, password });
      toast.success('Password reset successfully');
      setPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-teal-600">Security</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Reset password</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reset token</label>
            <input value={token} className="input-shell w-full rounded-2xl px-3 py-3 text-sm text-slate-800 outline-none" readOnly />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">New password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input-shell w-full rounded-2xl px-3 py-3 text-sm text-slate-800 outline-none" placeholder="Minimum 8 characters" required />
          </div>

          <button type="submit" disabled={loading || !token} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 disabled:opacity-60">
            {loading ? 'Resetting...' : 'Reset password'}
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
