import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getUser';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function UserDashboard({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  await connectDB();

  // Query orders directly from DB (avoids HTTP cookie-forwarding issues)
  const rawOrders = await Order.find({ userId: user.userId })
    .sort({ createdAt: -1 })
    .lean();

  // Serialise Mongo docs for client component
  const orders = rawOrders.map(o => {
    const serialised = JSON.parse(JSON.stringify(o));
    return {
      ...serialised,
      items: o.products || [],
      status: o.orderStatus || 'processing',
    };
  });

  const params = await searchParams;
  const justOrdered = params?.order === 'success';

  return <DashboardClient user={user} orders={orders} justOrdered={justOrdered} />;
}