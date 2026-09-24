import React, { useEffect, useState } from 'react';
import { orderApi } from '../../api/order.api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Link } from 'react-router-dom';

export const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderApi.getOrders();
        const list = Array.isArray(data) ? data : data?.orders || data?.data || [];
        setOrders(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-4 text-sm text-slate-500">Loading orders...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Orders</h2>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-600">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-slate-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id || order.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-xs">{order._id || order.id}</td>
                  <td className="p-4">{order.customerName || order.customer?.name || 'N/A'}</td>
                  <td className="p-4 font-medium">₹{order.totalAmount ?? order.total ?? 0}</td>
                  <td className="p-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/orders/${order._id || order.id}`}
                      className="text-teal-600 hover:text-teal-700 font-medium text-xs"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};