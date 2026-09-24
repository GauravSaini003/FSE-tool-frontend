import React, { useEffect, useState } from 'react';
import { UserCog, ShieldCheck, Ban, UserPlus } from 'lucide-react';
import { userApi } from '../../api/user.api';
import toast from 'react-hot-toast';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'FSE', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await userApi.getUsers();
        if (Array.isArray(data?.users) && data.users.length) {
          setUsers(data.users);
        }
      } catch (error) {
        setUsers([]);
        toast.error(error.response?.data?.message || 'Unable to load users');
      }
    };

    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const current = users.find((user) => user.id === userId || user._id === userId);
      const nextStatus = current?.status === 'Active' ? 'Inactive' : 'Active';
      await userApi.updateStatus(userId, nextStatus);
      setUsers((prev) => prev.map((user) => (user.id === userId || user._id === userId ? { ...user, status: nextStatus } : user)));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update user status');
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await userApi.createUser(form);
      setUsers((prev) => [data.user || data.data || form, ...prev]);
      setForm({ name: '', email: '', role: 'FSE', password: '' });
      toast.success('User created');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">Access</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-800">User management</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          <UserCog className="h-4 w-4" /> {users.length} users
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.35fr]">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id || user._id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                      {user.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-700">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleToggleStatus(user.id || user._id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
                      user.status === 'Active' ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {user.status === 'Active' ? <Ban className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleCreateUser} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3"><UserPlus className="h-5 w-5 text-teal-600" /><h3 className="text-lg font-bold text-slate-800">Create user</h3></div>
        <div className="space-y-3">
          <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" placeholder="Full name" />
          <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" placeholder="Email" />
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"><option>FSE</option><option>TEAM_LEADER</option><option>WAREHOUSE</option><option>DISPATCH</option><option>ADMIN</option></select>
          <input required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" placeholder="Temporary password" />
          <button disabled={loading} className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Creating...' : 'Create user'}</button>
        </div>
      </form>
      </div>
    </div>
  );
};