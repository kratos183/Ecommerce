export const addToCart = async (productId, quantity) => {
  const cart = JSON.parse(localStorage.getItem('guestCart') || '[]');
  const existing = cart.find(item => item.productId === productId);
  if (existing) existing.quantity += quantity;
  else cart.push({ productId, quantity });
  localStorage.setItem('guestCart', JSON.stringify(cart));
  
  try {
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
  } catch {}
};
