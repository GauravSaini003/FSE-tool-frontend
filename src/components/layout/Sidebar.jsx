import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { ROLES } from '../../utils/constants';
import { LayoutDashboard, Users, Package, ShoppingBag, Tag, UserCheck, Truck, ShieldCheck } from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();

  const getNavItems = () => {
    const common = [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/orders', label: 'Orders', icon: ShoppingBag },
    ];

    if (user?.role === ROLES.FSE) {
      common.push({ to: '/customers', label: 'My Customers', icon: Users });
      common.push({ to: '/products', label: 'Products', icon: Package });
    }

    if (user?.role === ROLES.TEAM_LEADER) {
      common.push({ to: '/customers', label: 'Customer Insights', icon: Users });
    }

    if (user?.role === ROLES.WAREHOUSE) {
      common.push({ to: '/products', label: 'Inventory / Stock', icon: Package });
    }

    if (user?.role === ROLES.ADMIN) {
      common.push(
        { to: '/customers', label: 'Customers', icon: Users },
        { to: '/products', label: 'Products', icon: Package },
        { to: '/schemes', label: 'Schemes', icon: Tag },
        { to: '/users', label: 'User Management', icon: UserCheck }
      );
    }

    if (user?.role === ROLES.DISPATCH) {
      common.push({ to: '/dispatch-queue', label: 'Dispatch Queue', icon: Truck });
    }

    if (user?.role === ROLES.ADMIN) {
      common.push({ to: '/users', label: 'People', icon: ShieldCheck });
    }

    return common;
  };

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-slate-200 bg-slate-950 text-slate-100 shadow-[10px_0_30px_rgba(15,23,42,0.10)]">
      <div className="border-b border-slate-800 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 text-base font-bold text-slate-950 shadow-lg shadow-teal-500/30">
            SO
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-teal-300/80">Operations</p>
            <h2 className="text-xl font-bold tracking-tight text-white">Seoly</h2>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {getNavItems().map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Current role</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">{user?.role || 'USER'}</span>
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
          </div>
        </div>
      </div>
    </aside>
  );
};