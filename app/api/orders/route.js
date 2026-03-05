import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const query = user.role === 'admin' ? {} : { userId: user.userId };
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    const formattedOrders = orders.map(order => ({ ...order, items: order.products || [], status: order.orderStatus || 'pending' }));
    return Response.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Orders API error:', error);
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
