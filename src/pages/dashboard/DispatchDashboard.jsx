import React, { useEffect, useState } from 'react';
import { MapPinned, PackageCheck, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderApi } from '../../api/order.api';
import { ORDER_STATUS } from '../../utils/constants';

export const DispatchDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await orderApi.getOrders();
        setOrders(Array.isArray(data) ? data : data?.orders || data?.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load dispatch metrics');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const ready = orders.filter((order) => order.status === ORDER_STATUS.READY_FOR_DISPATCH);
  const inTransit = orders.filter((order) => order.status === ORDER_STATUS.DISPATCHED);
  const delivered = orders.filter((order) => order.status === ORDER_STATUS.DELIVERED);

  return (
    <div className="space-y-6">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Dispatch</p><h2 className="mt-1 text-2xl font-bold text-slate-800">Courier and tracking management</h2></div>
      <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Truck className="mb-4 h-5 w-5 text-blue-600" /><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Ready to dispatch</p><p className="mt-3 text-3xl font-bold text-slate-800">{loading ? '...' : ready.length}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><MapPinned className="mb-4 h-5 w-5 text-amber-600" /><p className="text-xs uppercase tracking-[0.18em] text-slate-500">In transit</p><p className="mt-3 text-3xl font-bold text-slate-800">{loading ? '...' : inTransit.length}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><PackageCheck className="mb-4 h-5 w-5 text-emerald-600" /><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Delivered</p><p className="mt-3 text-3xl font-bold text-slate-800">{loading ? '...' : delivered.length}</p></div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="mb-4 text-lg font-bold text-slate-800">Current dispatch queue</h3><div className="space-y-3">{ready.map((order) => <div key={order._id || order.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold text-slate-800">{order._id || order.id}</p><p className="text-sm text-slate-500">{order.customerName || order.customer?.name || 'Customer'} • {order.courier || 'Courier not assigned'}</p></div><span className="rounded-full bg-violet-100 px-2 py-1 text-[10px] font-semibold uppercase text-violet-700">{order.awb || 'AWB pending'}</span></div>)}{!loading && !ready.length && <p className="text-sm text-slate-500">No orders are ready for dispatch.</p>}</div></div>
    </div>
  );
};
