import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-slate-100/80 p-4 md:p-6 xl:p-8">
            <div className="mx-auto w-full max-w-[1500px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};