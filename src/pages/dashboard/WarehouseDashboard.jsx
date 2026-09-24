import React, { useEffect, useState } from 'react';
import { PackageCheck, Boxes, ClipboardList, CircleDashed } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderApi } from '../../api/order.api';
import { ORDER_STATUS } from '../../utils/constants';

export const WarehouseDashboard = () => {
  const [orders, setOrders] = useState(null);
  const [savingId, setSavingId] = useState('');
  const loading = orders === null;

  const loadOrders = async () => {
    try {
      const { data } = await orderApi.getOrders({ status: 'WAREHOUSE' });
      setOrders(Array.isArray(data) ? data : data?.orders || data?.data || []);
    } catch (error) {
      setOrders([]);
      toast.error(error.response?.data?.message || 'Unable to load warehouse orders');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const confirmStock = async (order) => {
    const id = order._id || order.id;
    setSavingId(id);
    try {
      await orderApi.updateOrderStatus(id, { status: ORDER_STATUS.STOCK_CONFIRMED });
      setOrders((prev) => prev.filter((entry) => (entry._id || entry.id) !== id));
      toast.success('Stock confirmed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to confirm stock');
    } finally {
      setSavingId('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Warehouse</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-800">Stock and order fulfillment</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Boxes className="mb-4 h-5 w-5 text-blue-600" /><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Warehouse orders</p><p className="mt-3 text-3xl font-bold text-slate-800">{loading ? '...' : orders.length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><CircleDashed className="mb-4 h-5 w-5 text-amber-600" /><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Awaiting confirmation</p><p className="mt-3 text-3xl font-bold text-slate-800">{loading ? '...' : orders.length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><PackageCheck className="mb-4 h-5 w-5 text-emerald-600" /><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Next action</p><p className="mt-3 text-lg font-bold text-slate-800">Confirm stock</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><ClipboardList className="mb-4 h-5 w-5 text-violet-600" /><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Next status</p><p className="mt-3 text-lg font-bold text-slate-800">Stock confirmed</p></div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-800">Incoming stock confirmations</h3>
        <div className="space-y-3">
          {!loading && orders.map((order) => {
            const id = order._id || order.id;
            return (
              <div key={id} className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{id}</p>
                  <p className="text-sm text-slate-500">{order.customerName || order.customer?.name || 'Customer'} · {order.items?.length || 0} item(s)</p>
                </div>
                <button disabled={savingId === id} onClick={() => confirmStock(order)} className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50">{savingId === id ? 'Saving...' : 'Confirm stock'}</button>
              </div>
            );
          })}
          {!loading && !orders.length && <p className="text-sm text-slate-500">No orders require stock confirmation.</p>}
        </div>
      </div>
    </div>
  );
};