import connectDB from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Sum ALL orders' totalAmount (not just 'paid') — checkout creates orders as 'pending'
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Low stock products (stock <= 5)
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select('title name stock category')
      .sort({ stock: 1 })
      .limit(10)
      .lean();

    return Response.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockProducts,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
