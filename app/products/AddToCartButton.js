'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ productId }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAddToCart = () => {
    setLoading(true);
    
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    const existing = guestCart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      guestCart.push({ productId, quantity: 1 });
    }
    localStorage.setItem('guestCart', JSON.stringify(guestCart));
    
    setMessage('Added to cart!');
    setLoading(false);
    setTimeout(() => router.push('/cart'), 1000);
  };

  return (
    <div>
      <button onClick={handleAddToCart} disabled={loading} className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition shadow-lg">
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
      {message && <p className={`mt-2 text-sm ${message.includes('Added') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
    </div>
  );
}
