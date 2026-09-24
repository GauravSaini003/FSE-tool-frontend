import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, PencilLine, Building2, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { customerApi } from '../../api/customer.api';

export const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', city: '', segment: 'Retail' });
  const [formErrors, setFormErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await customerApi.getCustomers();
        if (Array.isArray(data?.customers) && data.customers.length) {
          setCustomers(data.customers);
        }
      } catch (error) {
        setCustomers([]);
        toast.error(error.response?.data?.message || 'Unable to load customers');
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const text = `${customer.name} ${customer.phone} ${customer.city}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [customers, search]);

  const resetForm = () => {
    setForm({ name: '', phone: '', city: '', segment: 'Retail' });
    setFormErrors({});
    setEditingId(null);
  };

  const validateForm = () => {
    const errors = {};
    const name = form.name.trim();
    const phone = form.phone.trim();
    const city = form.city.trim();

    if (!name) errors.name = 'Name is required';
    else if (name.length < 2) errors.name = 'Name must be at least 2 characters';
    if (!phone) errors.phone = 'Phone is required';
    else if (!/^\+?[0-9\s()-]{7,20}$/.test(phone) || phone.replace(/\D/g, '').length < 7) errors.phone = 'Enter a valid phone number';
    if (!city) errors.city = 'City is required';
    else if (city.length < 2) errors.city = 'City must be at least 2 characters';
    if (!['Retail', 'SMB', 'Enterprise'].includes(form.segment)) errors.segment = 'Select a valid segment';

    setFormErrors(errors);
    return { errors, name, phone, city };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { errors, name, phone, city } = validateForm();
    if (Object.keys(errors).length) {
      toast.error('Please correct the highlighted fields');
      return;
    }

    setLoading(true);

    try {
      const customerData = { name, phone, city, segment: form.segment };
      if (editingId) {
        const { data } = await customerApi.updateCustomer(editingId, customerData);
        const updatedCustomer = data.customer || data.data || { ...customerData, id: editingId };
        setCustomers((prev) => prev.map((customer) => (customer.id === editingId || customer._id === editingId ? { ...customer, ...updatedCustomer } : customer)));
        toast.success('Customer updated successfully');
      } else {
        const newCustomer = { ...customerData, status: 'Active' };
        const { data } = await customerApi.createCustomer(newCustomer);
        setCustomers((prev) => [data.customer || data.data || newCustomer, ...prev]);
        toast.success('Customer created successfully');
      }
      resetForm();
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Unable to save customer';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (customer) => {
    setEditingId(customer.id || customer._id);
    setFormErrors({});
    setForm({ name: customer.name || '', phone: customer.phone || '', city: customer.city || '', segment: customer.segment || 'Retail' });
  };

  const viewOrders = async (customer) => {
    const id = customer.id || customer._id;
    setSelectedCustomer(customer);
    setOrdersLoading(true);
    try {
      const { data } = await customerApi.getCustomerOrders(id);
      setCustomerOrders(Array.isArray(data) ? data : data?.orders || data?.data || []);
    } catch (error) {
      setCustomerOrders([]);
      toast.error(error.response?.data?.message || 'Unable to load customer orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Customers</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">Customer directory</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">
            <Search className="h-4 w-4" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer"
              className="w-56 border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
          <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700">
            <Plus className="h-4 w-4" /> Add customer
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id || customer._id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                        {customer.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{customer.city}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-700">
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${customer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => startEditing(customer)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"><PencilLine className="h-3.5 w-3.5" /> Edit</button>
                      <button onClick={() => viewOrders(customer)} className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100"><ClipboardList className="h-3.5 w-3.5" /> Orders</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Quick add</p>
              <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit customer' : 'New customer'}</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Name</label>
              <input value={form.name} onChange={(event) => { setForm({ ...form, name: event.target.value }); setFormErrors((prev) => ({ ...prev, name: '' })); }} className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm focus:bg-white focus:outline-none ${formErrors.name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-teal-500'}`} placeholder="Customer name" required />
              {formErrors.name && <p className="mt-1 text-xs text-rose-600">{formErrors.name}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Phone</label>
              <input type="tel" value={form.phone} onChange={(event) => { setForm({ ...form, phone: event.target.value }); setFormErrors((prev) => ({ ...prev, phone: '' })); }} className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm focus:bg-white focus:outline-none ${formErrors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-teal-500'}`} placeholder="+91 9876543210" required />
              {formErrors.phone && <p className="mt-1 text-xs text-rose-600">{formErrors.phone}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">City</label>
              <input value={form.city} onChange={(event) => { setForm({ ...form, city: event.target.value }); setFormErrors((prev) => ({ ...prev, city: '' })); }} className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm focus:bg-white focus:outline-none ${formErrors.city ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-teal-500'}`} placeholder="Mumbai" required />
              {formErrors.city && <p className="mt-1 text-xs text-rose-600">{formErrors.city}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Segment</label>
              <select value={form.segment} onChange={(event) => { setForm({ ...form, segment: event.target.value }); setFormErrors((prev) => ({ ...prev, segment: '' })); }} className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm focus:bg-white focus:outline-none ${formErrors.segment ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-teal-500'}`}>
                <option>Retail</option>
                <option>SMB</option>
                <option>Enterprise</option>
              </select>
              {formErrors.segment && <p className="mt-1 text-xs text-rose-600">{formErrors.segment}</p>}
            </div>
            <button disabled={loading} className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
              {loading ? 'Saving...' : editingId ? 'Update customer' : 'Create customer'}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel edit</button>}
          </form>
        </div>
      </div>

      {selectedCustomer && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">Customer orders</p><h3 className="mt-1 text-lg font-bold text-slate-800">{selectedCustomer.name}</h3></div>
            <button type="button" onClick={() => setSelectedCustomer(null)} className="text-sm font-medium text-slate-500 hover:text-slate-800">Close</button>
          </div>
          {ordersLoading ? <p className="text-sm text-slate-500">Loading orders...</p> : customerOrders.length ? <div className="space-y-2">{customerOrders.map((order) => <div key={order._id || order.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm"><span className="font-semibold text-slate-800">{order._id || order.id}</span><span className="text-slate-600">{order.status} · ₹{order.totalAmount ?? order.total ?? 0}</span></div>)}</div> : <p className="text-sm text-slate-500">No orders found for this customer.</p>}
        </div>
      )}
    </div>
  );
};