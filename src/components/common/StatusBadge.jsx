import React from 'react';
import { ORDER_STATUS } from '../../utils/constants';

const statusStyles = {
  [ORDER_STATUS.SUBMITTED]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.UNDER_REVIEW]: 'bg-amber-100 text-amber-800',
  [ORDER_STATUS.APPROVED]: 'bg-emerald-100 text-emerald-800',
  [ORDER_STATUS.REJECTED]: 'bg-rose-100 text-rose-800',
  [ORDER_STATUS.SENT_BACK]: 'bg-orange-100 text-orange-800',
  [ORDER_STATUS.STOCK_CONFIRMED]: 'bg-indigo-100 text-indigo-800',
  [ORDER_STATUS.READY_FOR_DISPATCH]: 'bg-purple-100 text-purple-800',
  [ORDER_STATUS.DISPATCHED]: 'bg-cyan-100 text-cyan-800',
  [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
};

export const StatusBadge = ({ status }) => {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-slate-100 text-slate-800'}`}>
      {status ? status.replace(/_/g, ' ') : 'UNKNOWN'}
    </span>
  );
};