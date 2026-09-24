import React, { useEffect, useState } from 'react';
import { Users, Package, Tag, BarChart3, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { userApi } from '../../api/user.api';
import { productApi } from '../../api/product.api';
import { schemeApi } from '../../api/scheme.api';
import { orderApi } from '../../api/order.api';

export const AdminDashboard = () => {
  const [summary, setSummary] = useState({ users: [], products: [], schemes: [], orders: [] });

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const [users, products, schemes, orders] = await Promise.all([userApi.getUsers(), productApi.getProducts(), schemeApi.getSchemes(), orderApi.getOrders()]);
        const list = (response, key) => Array.isArray(response.data) ? response.data : response.data?.[key] || response.data?.data || [];
        setSummary({ users: list(users, 'users'), products: list(products, 'products'), schemes: list(schemes, 'schemes'), orders: list(orders, 'orders') });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load admin summary');
      }
    };
    loadSummary();
  }, []);

  return (
  <div className="space-y-6">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Administrative control</p>
      <h2 className="mt-1 text-2xl font-bold text-slate-800">System management dashboard</h2>
    </div>

    <div className="grid gap-4 md:grid-cols-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Users className="h-5 w-5" /></div><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Users</p><p className="mt-3 text-3xl font-bold text-slate-800">{summary.users.length}</p></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Package className="h-5 w-5" /></div><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Products</p><p className="mt-3 text-3xl font-bold text-slate-800">{summary.products.length}</p></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Tag className="h-5 w-5" /></div><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Schemes</p><p className="mt-3 text-3xl font-bold text-slate-800">{summary.schemes.length}</p></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><BarChart3 className="h-5 w-5" /></div><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Orders</p><p className="mt-3 text-3xl font-bold text-slate-800">{summary.orders.length}</p></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><ShieldCheck className="h-5 w-5" /></div><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Active users</p><p className="mt-3 text-3xl font-bold text-slate-800">{summary.users.filter((user) => user.status === 'Active').length}</p></div>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="mb-4 text-lg font-bold text-slate-800">Management overview</h3><div className="space-y-3"><p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Use the management pages to review users, products, schemes, and orders returned by the backend.</p></div></div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="mb-4 text-lg font-bold text-slate-800">Order status coverage</h3><div className="space-y-3"><p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{summary.orders.filter((order) => order.status === 'DELIVERED').length} delivered orders are included in the current backend response.</p></div></div>
    </div>
  </div>
  );
};