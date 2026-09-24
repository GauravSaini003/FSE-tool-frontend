import React, { useEffect, useState } from 'react';
import { Tag, PlusCircle, Percent } from 'lucide-react';
import toast from 'react-hot-toast';
import { schemeApi } from '../../api/scheme.api';

export const SchemeListPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [form, setForm] = useState({ name: '', discount: '', type: 'Cashback' });

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const { data } = await schemeApi.getSchemes();
        setSchemes(Array.isArray(data) ? data : data?.schemes || data?.data || []);
      } catch (error) {
        setSchemes([]);
        toast.error(error.response?.data?.message || 'Unable to load schemes');
      }
    };

    fetchSchemes();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const scheme = {
      name: form.name,
      discount: Number(form.discount),
      type: form.type,
    };

    try {
      const { data } = await schemeApi.createScheme(scheme);
      setSchemes((prev) => [data.scheme || data.data || scheme, ...prev]);
      setForm({ name: '', discount: '', type: 'Cashback' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create scheme');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Offers</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">Scheme management</h2>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700">
          <PlusCircle className="h-4 w-4" /> New scheme
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {schemes.map((scheme) => (
            <div key={scheme.id || scheme._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Tag className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-700">
                  {scheme.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">{scheme.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{scheme.id || scheme._id}</p>
              <div className="mt-5 flex items-center gap-2 text-2xl font-bold text-slate-800">
                <Percent className="h-5 w-5 text-teal-600" /> {scheme.discount}%
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800">Create a scheme</h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Scheme name</label>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none" placeholder="Bulk season offer" required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Type</label>
              <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none">
                <option>Cashback</option>
                <option>Volume</option>
                <option>Seasonal</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Discount %</label>
              <input type="number" value={form.discount} onChange={(event) => setForm({ ...form, discount: event.target.value })} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:border-teal-500 focus:bg-white focus:outline-none" placeholder="10" required />
            </div>
            <button className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
              Save scheme
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};