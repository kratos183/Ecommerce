import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getUser';

async function getStats() {
  try {
    const res = await fetch('http://localhost:3000/api/admin-stats', { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/');

  const data = await getStats();
  const stats = data?.stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm mb-2">Total Users</p><p className="text-3xl font-bold">{stats.totalUsers || 0}</p></div>
        <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm mb-2">Total Products</p><p className="text-3xl font-bold">{stats.totalProducts || 0}</p></div>
        <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm mb-2">Total Orders</p><p className="text-3xl font-bold">{stats.totalOrders || 0}</p></div>
        <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm mb-2">Revenue</p><p className="text-3xl font-bold text-green-600">${stats.totalRevenue || 0}</p></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Low Stock Products</h2>
        {stats.lowStockProducts?.length > 0 ? (
          <table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th></tr></thead><tbody className="divide-y">{stats.lowStockProducts.map(p => <tr key={p._id}><td className="px-6 py-4 text-sm">{p.title}</td><td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">{p.stock} left</span></td></tr>)}</tbody></table>
        ) : <p className="text-gray-500 text-center py-8">No low stock products</p>}
      </div>
    </div>
  );
}
