'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=5');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const seedProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?seed=true');
      const data = await res.json();
      setMessage(data.message);
      fetchProducts();
    } catch (error) {
      setMessage('Failed to seed products');
    } finally {
      setLoading(false);
    }
  };

  const testAddToCart = async (productId) => {
    setLoading(true);
    try {
      // First try localStorage directly
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const existing = guestCart.find(item => item.productId === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        guestCart.push({ productId, quantity: 1 });
      }
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      setMessage(`Added to localStorage cart. Cart now has ${guestCart.length} items`);
      
      // Also try API
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      setMessage(prev => prev + ` | API response: ${JSON.stringify(data)}`);
    } catch (error) {
      setMessage(`Cart error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Debug Cart Functionality</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={seedProducts} 
          disabled={loading}
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          {loading ? 'Loading...' : 'Seed Products'}
        </button>
        <button 
          onClick={fetchProducts}
          style={{ padding: '10px 20px' }}
        >
          Refresh Products
        </button>
      </div>

      {message && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f0f0f0', 
          marginBottom: '20px',
          wordBreak: 'break-all'
        }}>
          {message}
        </div>
      )}

      <h2>Products ({products.length})</h2>
      {products.length === 0 ? (
        <p>No products found. Click "Seed Products" to add some.</p>
      ) : (
        <div>
          {products.map(product => (
            <div key={product._id} style={{ 
              border: '1px solid #ccc', 
              padding: '10px', 
              margin: '10px 0' 
            }}>
              <h3>{product.title}</h3>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>ID: {product._id}</p>
              <button 
                onClick={() => testAddToCart(product._id)}
                disabled={loading}
                style={{ padding: '5px 10px' }}
              >
                Test Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}