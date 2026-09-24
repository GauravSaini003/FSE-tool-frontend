import React from 'react';
import { useAuth } from '../../context/useAuth';
import { LogOut, Search, Bell } from 'lucide-react';

export const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-md md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Welcome</p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
            Hello, {user?.name || 'User'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              placeholder="Search"
              className="w-40 border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
            <Bell className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-xs font-bold text-white">
              {user?.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-slate-800">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-500">{user?.email || 'user@seoly.com'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};