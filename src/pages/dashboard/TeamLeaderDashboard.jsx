import React, { useEffect, useState } from 'react';
import { CheckCircle2, RotateCcw, Users, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderApi } from '../../api/order.api';
import { ORDER_STATUS } from '../../utils/constants';

export const TeamLeaderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const [{ data: submittedData }, { data: reviewData }] = await Promise.all([
          orderApi.getOrders({ status: ORDER_STATUS.SUBMITTED }),
          orderApi.getOrders({ status: ORDER_STATUS.UNDER_REVIEW }),
        ]);
        const submitted = Array.isArray(submittedData) ? submittedData : submittedData?.orders || submittedData?.data || [];
        const underReview = Array.isArray(reviewData) ? reviewData : reviewData?.orders || reviewData?.data || [];
        const uniqueOrders = [...submitted, ...underReview].filter((order, index, list) => {
          const id = order._id || order.id;
          return list.findIndex((entry) => (entry._id || entry.id) === id) === index;
        });
        setOrders(uniqueOrders);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load review queue');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const updateStatus = async (order, status) => {
    const id = order._id || order.id;
    setSavingId(id);
    try {
      await orderApi.updateOrderStatus(id, { status });
      setOrders((prev) => prev.filter((entry) => (entry._id || entry.id) !== id));
      toast.success(`Order ${status.toLowerCase().replaceAll('_', ' ')}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update order');
    } finally {
      setSavingId('');
    }
  };

  return (
    <div className="space-y-6">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Team lead</p><h2 className="mt-1 text-2xl font-bold text-slate-800">Approval review center</h2></div>
      <div className="grid gap-4 md:grid-cols-4"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Review queue</p><p className="mt-3 text-3xl font-bold text-slate-800">{loading ? '...' : orders.length}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Submitted</p><p className="mt-3 text-3xl font-bold text-slate-800">{orders.filter((order) => order.status === ORDER_STATUS.SUBMITTED).length}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Under review</p><p className="mt-3 text-3xl font-bold text-slate-800">{orders.filter((order) => order.status === ORDER_STATUS.UNDER_REVIEW).length}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Action</p><p className="mt-3 text-lg font-bold text-slate-800">Review orders</p></div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-slate-800">Orders awaiting action</h3><div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"><Users className="h-3.5 w-3.5" /> Live queue</div></div><div className="space-y-3">{orders.map((order) => { const id = order._id || order.id; return <div key={id} className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold text-slate-800">{id}</p><p className="text-sm text-slate-500">{order.customerName || order.customer?.name || 'Customer'} • {order.items?.length || 0} item(s)</p></div><div className="flex gap-2"><button disabled={savingId === id} onClick={() => updateStatus(order, ORDER_STATUS.APPROVED)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"><CheckCircle2 className="h-3.5 w-3.5" /> Approve</button><button disabled={savingId === id} onClick={() => updateStatus(order, ORDER_STATUS.REJECTED)} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"><XCircle className="h-3.5 w-3.5" /> Reject</button><button disabled={savingId === id} onClick={() => updateStatus(order, ORDER_STATUS.SENT_BACK)} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"><RotateCcw className="h-3.5 w-3.5" /> Send back</button></div></div>; })}{!loading && !orders.length && <p className="text-sm text-slate-500">No orders are waiting for review.</p>}</div></div>
    </div>
  );
};
