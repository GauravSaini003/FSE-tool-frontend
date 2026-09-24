import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardList, PackageCheck, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderApi } from '../../api/order.api';
import { ORDER_STATUS } from '../../utils/constants';

export const DispatchQueuePage = () => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState('');
  const [form, setForm] = useState({ courier: '', awb: '', tracking: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const { data } = await orderApi.getOrders({ status: ORDER_STATUS.READY_FOR_DISPATCH });
        const list = Array.isArray(data) ? data : data?.orders || data?.data || [];
        setOrders(list);
        setSelected(list[0]?._id || list[0]?.id || '');
        if (list[0]) setForm({ courier: list[0].courier || '', awb: list[0].awb || '', tracking: list[0].tracking || '' });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load dispatch queue');
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, []);

  const currentOrder = useMemo(
    () => orders.find((order) => (order._id || order.id) === selected) || orders[0],
    [orders, selected]
  );

  const selectOrder = (order) => {
    setSelected(order._id || order.id);
    setForm({ courier: order.courier || '', awb: order.awb || '', tracking: order.tracking || '' });
  };

  const updateStatus = async (status) => {
    if (!currentOrder) return;
    setSaving(true);

    try {
      const id = currentOrder._id || currentOrder.id;
      await orderApi.updateOrderStatus(id, { status, ...form });
      setOrders((prev) => prev.filter((order) => (order._id || order.id) !== id));
      setSelected('');
      toast.success(`Order marked ${status.toLowerCase().replaceAll('_', ' ')}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update dispatch status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-sm text-slate-500">Loading dispatch queue...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Dispatch</p>
          <h2 className="text-2xl font-bold text-slate-800">Dispatch queue</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
          <Truck className="h-4 w-4" /> {orders.length} ready
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ClipboardList className="mb-3 h-5 w-5 text-blue-600" />
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Queued orders</p>
          <p className="mt-3 text-3xl font-bold text-slate-800">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Truck className="mb-3 h-5 w-5 text-amber-600" />
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Dispatch state</p>
          <p className="mt-3 text-lg font-bold text-slate-800">Ready for dispatch</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <PackageCheck className="mb-3 h-5 w-5 text-emerald-600" />
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Selected order</p>
          <p className="mt-3 truncate text-lg font-bold text-slate-800">{currentOrder?._id || currentOrder?.id || 'None'}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.45fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Orders to process</h3>
          <div className="space-y-3">
            {orders.map((order) => {
              const id = order._id || order.id;
              return (
                <button key={id} type="button" onClick={() => selectOrder(order)} className={`w-full rounded-xl border p-3 text-left ${selected === id ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">{id}</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">{order.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{order.customerName || order.customer?.name || 'Customer'}</p>
                  <p className="mt-1 text-xs text-slate-500">{order.items?.length || 0} item(s)</p>
                </button>
              );
            })}
            {!orders.length && <p className="text-sm text-slate-500">No orders are ready for dispatch.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 border-b border-slate-100 pb-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Selected order</p>
            <h3 className="mt-1 text-xl font-bold text-slate-800">{currentOrder?._id || currentOrder?.id || 'No order selected'}</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input value={form.courier} onChange={(event) => setForm({ ...form, courier: event.target.value })} placeholder="Courier" className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm" />
            <input value={form.awb} onChange={(event) => setForm({ ...form, awb: event.target.value })} placeholder="AWB" className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm" />
            <input value={form.tracking} onChange={(event) => setForm({ ...form, tracking: event.target.value })} placeholder="Tracking link" className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm md:col-span-2" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button disabled={!currentOrder || saving} onClick={() => updateStatus(ORDER_STATUS.DISPATCHED)} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Mark as dispatched'}</button>
            <button disabled={!currentOrder || saving} onClick={() => updateStatus(ORDER_STATUS.DELIVERED)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">Mark as delivered</button>
          </div>
        </div>
      </div>
    </div>
  );
};
