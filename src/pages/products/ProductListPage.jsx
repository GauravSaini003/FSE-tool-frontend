import React, { useEffect, useState } from 'react';
import { Plus, Package2, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { productApi } from '../../api/product.api';

export const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productId: '', sku: '', name: '', category: 'Home', price: '', stock: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setForm({ productId: '', sku: '', name: '', category: 'Home', price: '', stock: '' });
    setEditingId(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productApi.getProducts();
        if (Array.isArray(data?.products) && data.products.length) {
          setProducts(data.products);
        }
      } catch (error) {
        setProducts([]);
        toast.error(error.response?.data?.message || 'Unable to load products');
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const productId = form.productId.trim();
    const sku = form.sku.trim();
    const name = form.name.trim();

    if (!productId || !sku || !name || form.price === '' || form.stock === '') {
      toast.error(!productId ? 'Product ID is required' : !sku ? 'SKU is required' : !name ? 'Product name is required' : 'Price and stock are required');
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(stock) || stock < 0) {
      toast.error('Price and stock must be valid non-negative numbers');
      return;
    }

    setLoading(true);

    const product = { productId, sku, name, category: form.category, price, stock };

    try {
      if (editingId) {
        const { data } = await productApi.updateProduct(editingId, product);
        const updatedProduct = data.product || data.data || { ...product, id: editingId };
        setProducts((prev) => prev.map((entry) => (entry.id === editingId || entry._id === editingId ? { ...entry, ...updatedProduct } : entry)));
        toast.success('Product updated successfully');
      } else {
        const { data } = await productApi.createProduct(product);
        setProducts((prev) => [data.product || data.data || product, ...prev]);
        toast.success('Product created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save product');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (product) => {
    setEditingId(product.id || product._id);
    setForm({ productId: product.productId || '', sku: product.sku || '', name: product.name || '', category: product.category || 'Home', price: product.price ?? '', stock: product.stock ?? '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Catalog</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">Product management</h2>
        </div>
        <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.id || product._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Package2 className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                  {product.category}
                </span>
              </div>
              <button type="button" onClick={() => startEditing(product)} className="text-left text-lg font-bold text-slate-800 hover:text-teal-700">{product.name}</button>
              <p className="mt-2 text-sm text-slate-500">{product.productId || product.id || product._id} · SKU: {product.sku || 'N/A'}</p>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Price</p>
                  <p className="mt-1 text-xl font-bold text-slate-800">₹{product.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Stock</p>
                  <p className="mt-1 text-lg font-bold text-emerald-600">{product.stock}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Inventory</p>
              <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit product' : 'New product'}</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Product ID</label>
              <input value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none" placeholder="PRD-1001" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">SKU</label>
              <input value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none" placeholder="WP-2500" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Product name</label>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none" placeholder="Water purifier" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Category</label>
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none">
                <option>Home</option>
                <option>Industrial</option>
                <option>Automation</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Price</label>
              <input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none" placeholder="2499" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Stock</label>
              <input type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none" placeholder="20" required />
            </div>
            <button disabled={loading} className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
              {loading ? 'Saving...' : editingId ? 'Update product' : 'Create product'}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel edit</button>}
          </form>
        </div>
      </div>
    </div>
  );
};