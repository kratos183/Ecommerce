// app/admin/page.js  — Server Component
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getUser';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/');

  await connectDB();

  // ── Fetch stats directly from DB (no HTTP = no cookie issues) ──────────
  const [totalUsers, totalProducts, totalOrders, products, orders, revenueResult] =
    await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Product.find({}).sort({ createdAt: -1 }).limit(100).lean(),
      Order.find({}).sort({ createdAt: -1 }).lean(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

  const totalRevenue = revenueResult[0]?.total || 0;

  // Serialise Mongo docs (ObjectId → string, Date → ISO string)
  const serialise = (doc) =>
    JSON.parse(JSON.stringify(doc, (key, value) =>
      typeof value === 'object' && value?.constructor?.name === 'ObjectId'
        ? value.toString()
        : value
    ));

  const stats = { totalUsers, totalProducts, totalOrders, totalRevenue };

  const formattedOrders = orders.map(o => ({
    ...serialise(o),
    items: o.products || [],
    status: o.orderStatus || 'processing',
    user: null,           // populated below if needed
  }));

  // Populate user info on orders
  const userIds = [...new Set(orders.map(o => o.userId?.toString()).filter(Boolean))];
  if (userIds.length > 0) {
    const users = await User.find({ _id: { $in: userIds } }).select('name email').lean();
    const userMap = {};
    users.forEach(u => { userMap[u._id.toString()] = serialise(u); });
    formattedOrders.forEach(o => {
      o.user = userMap[o.userId?.toString()] || null;
    });
  }

  return (
    <AdminClient
      user={user}
      stats={stats}
      products={serialise(products)}
      orders={formattedOrders}
    />
  );
}