import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingBag, Clock, CheckCircle, Users, WalletCards } from 'lucide-react';
import toast from 'react-hot-toast';
import { customerApi } from '../../api/customer.api';
import { orderApi } from '../../api/order.api';
import { ORDER_STATUS } from '../../utils/constants';

export const FSEDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const [{ data: orderData }, { data: customerData }] = await Promise.all([orderApi.getOrders(), customerApi.getCustomers()]);
        setOrders(Array.isArray(orderData) ? orderData : orderData?.orders || orderData?.data || []);
        setCustomers(Array.isArray(customerData) ? customerData : customerData?.customers || customerData?.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load dashboard summary');
      }
    };
    loadSummary();
  }, []);

  const pending = orders.filter((order) => [ORDER_STATUS.SUBMITTED, ORDER_STATUS.UNDER_REVIEW].includes(order.status));
  const delivered = orders.filter((order) => order.status === ORDER_STATUS.DELIVERED);
  const collected = orders.filter((order) => order.status === ORDER_STATUS.DELIVERED).reduce((sum, order) => sum + Number(order.totalAmount ?? order.total ?? 0), 0);
  const pendingValue = pending.reduce((sum, order) => sum + Number(order.totalAmount ?? order.total ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">FSE workspace</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">Field execution dashboard</h2>
        </div>
        <Link
          to="/orders/new"
          className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" /> Create order
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><ShoppingBag className="h-5 w-5" /></div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Active orders</p>
          <p className="mt-3 text-3xl font-bold text-slate-800">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Clock className="h-5 w-5" /></div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Pending review</p>
          <p className="mt-3 text-3xl font-bold text-slate-800">{pending.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle className="h-5 w-5" /></div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Delivered</p>
          <p className="mt-3 text-3xl font-bold text-slate-800">{delivered.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Users className="h-5 w-5" /></div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Customers</p>
          <p className="mt-3 text-3xl font-bold text-slate-800">{customers.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Recent order summary</h3>
            <Link to="/orders" className="text-sm font-semibold text-teal-600 hover:text-teal-700">View all</Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div key={order._id || order.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div>
                  <p className="font-semibold text-slate-800">{order._id || order.id}</p>
                  <p className="text-sm text-slate-500">{order.customerName || order.customer?.name || 'Customer'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{order.status}</p>
                  <p className="mt-1 font-semibold text-slate-800">₹{order.totalAmount ?? order.total ?? 0}</p>
                </div>
              </div>
            ))}
            {!orders.length && <p className="text-sm text-slate-500">No orders found.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><WalletCards className="h-5 w-5" /></div>
            <h3 className="text-lg font-bold text-slate-800">Payment status</h3>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Delivered order value</p><p className="mt-1 text-2xl font-bold text-slate-800">₹{collected}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Pending order value</p><p className="mt-1 text-2xl font-bold text-slate-800">₹{pendingValue}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};