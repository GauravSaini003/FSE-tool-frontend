import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import { orderApi } from '../../api/order.api';
import { customerApi } from '../../api/customer.api';
import { productApi } from '../../api/product.api';

const createItem = (productId = '', quantity = 1) => ({
  productId,
  quantity: Number(quantity) || 1,
  unitPrice: 0,
  name: '',
});

export const CreateOrderPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customerId: '',
    paymentInfo: 'Cash on delivery',
    notes: '',
  });
  const [items, setItems] = useState([createItem()]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [customerRes, productRes] = await Promise.all([
          customerApi.getCustomers(),
          productApi.getProducts(),
        ]);

        const customerList = Array.isArray(customerRes?.data?.customers) ? customerRes.data.customers : [];
        const productList = Array.isArray(productRes?.data?.products) ? productRes.data.products : [];

        setCustomers(customerList);
        setProducts(productList);

        if (customerList[0]?._id || customerList[0]?.id) {
          setForm((prev) => ({ ...prev, customerId: customerList[0]._id || customerList[0].id }));
        }

        setItems((prev) => {
          if (prev[0]?.productId || !productList[0]) return prev;

          return [{
            productId: productList[0]._id || productList[0].id,
            quantity: 1,
            unitPrice: Number(productList[0].price || 0),
            name: productList[0].name,
          }];
        });
      } catch (error) {
        console.error('Failed to load customers/products', error);
      }
    };

    fetchMeta();
  }, []);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = products.find((entry) => (entry._id || entry.id) === item.productId);
      const unitPrice = Number(item.unitPrice || product?.price || 0);
      return sum + unitPrice * Number(item.quantity || 1);
    }, 0);
  }, [items, products]);

  const addItem = () => setItems((prev) => [...prev, createItem(products[0]?._id || products[0]?.id || '')]);

  const removeItem = (index) => setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));

  const updateItem = (index, field, value) => {
    setItems((prev) => prev.map((item, itemIndex) => {
      if (itemIndex !== index) return item;

      const updatedItem = { ...item, [field]: value };
      if (field === 'productId') {
        const selected = products.find((product) => (product._id || product.id) === value);
        if (selected) {
          updatedItem.unitPrice = Number(selected.price || 0);
          updatedItem.name = selected.name;
        }
      }

      return updatedItem;
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.customerId) {
      toast.error('Pick a customer before creating the order');
      return;
    }

    const payloadItems = items
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity || 1),
        unitPrice: Number(item.unitPrice || 0),
        name: item.name,
      }));

    if (!payloadItems.length) {
      toast.error('Add at least one item to the order');
      return;
    }

    setLoading(true);

    try {
      await orderApi.createOrder({
        customerId: form.customerId,
        paymentInfo: form.paymentInfo,
        notes: form.notes,
        items: payloadItems,
        totalAmount,
      });

      toast.success('Order created successfully');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600">Operations</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-800">Create order</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Customer</label>
            <select
              value={form.customerId}
              onChange={(event) => setForm((prev) => ({ ...prev, customerId: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer._id || customer.id} value={customer._id || customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Payment info</label>
            <input
              value={form.paymentInfo}
              onChange={(event) => setForm((prev) => ({ ...prev, paymentInfo: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none"
              placeholder="Cash / UPI / Credit"
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Order items</p>
            <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
              <Plus className="h-3.5 w-3.5" /> Add item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1.3fr_0.6fr_0.6fr_auto]">
                <select
                  value={item.productId}
                  onChange={(event) => updateItem(index, 'productId', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product._id || product.id} value={product._id || product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => updateItem(index, 'quantity', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Qty"
                />

                <input
                  type="number"
                  min="0"
                  value={item.unitPrice}
                  onChange={(event) => updateItem(index, 'unitPrice', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Price"
                />

                <button type="button" onClick={() => removeItem(index)} className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Notes</label>
          <textarea
            rows="3"
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none"
            placeholder="Any delivery or product notes"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Estimated total</span>
            <span className="text-2xl font-bold text-slate-900">₹{totalAmount}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit order'}
          </button>
        </div>
      </form>
    </div>
  );
};