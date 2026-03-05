// app/checkout/page.js
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getUser';
import CheckoutClient from './CheckoutClient';

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return <CheckoutClient />;
}