import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../../api/order.api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/useAuth';
import { ROLES, ORDER_STATUS, TEAM_LEADER_TRANSITIONS } from '../../utils/constants';
import toast from 'react-hot-toast';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await orderApi.getOrderById(id);
        setOrder(data.order || data.data || data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    if ([ORDER_STATUS.REJECTED, ORDER_STATUS.SENT_BACK].includes(status) && !reason.trim()) {
      toast.error('Add a reason before rejecting or sending back an order');
      return;
    }

    try {
      await orderApi.updateOrderStatus(id, { status, reason: reason.trim() });
      toast.success(`Order status updated to ${status}`);
      setOrder((prev) => ({ ...prev, status }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  if (!order) return <div className="p-4 text-sm text-slate-500">Loading details...</div>;

  const statusActions = [
    { label: 'Approve', value: ORDER_STATUS.APPROVED, className: 'bg-emerald-600 hover:bg-emerald-700' },
    { label: 'Reject', value: ORDER_STATUS.REJECTED, className: 'bg-rose-600 hover:bg-rose-700' },
    { label: 'Send back', value: ORDER_STATUS.SENT_BACK, className: 'bg-amber-600 hover:bg-amber-700' },
  ].filter((action) => TEAM_LEADER_TRANSITIONS[order.status]?.includes(action.value));

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Order #{order._id || order.id}</h2>
          <p className="text-xs text-slate-500">Customer: {order.customerName || order.customer?.name || 'N/A'} · Total: ₹{order.totalAmount ?? order.total ?? 0}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Payment</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{order.paymentInfo || 'Cash on delivery'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Items</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{order.items?.length || 0} product(s)</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{order.status}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Order summary</p>
        <div className="mt-3 space-y-2">
          {(order.items || []).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm text-slate-700">
              <span>{item.name || item.productId}</span>
              <span>{item.quantity || 1} × ₹{item.unitPrice || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {user?.role === ROLES.TEAM_LEADER && statusActions.length > 0 && (
        <div className="p-4 bg-slate-50 rounded-lg space-y-3">
          <p className="text-sm font-semibold text-slate-700">Team Leader Actions</p>
          <input
            type="text"
            placeholder="Add rejection or send-back reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm mb-2"
          />
          <div className="flex gap-2">
            {statusActions.map((action) => (
              <button
                key={action.value}
                onClick={() => handleStatusUpdate(action.value)}
                className={`${action.className} px-3 py-1.5 rounded text-xs font-medium text-white`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {user?.role === ROLES.TEAM_LEADER && statusActions.length === 0 && (
        <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No Team Leader actions are available for this order status.</p>
      )}
    </div>
  );
};