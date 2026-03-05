  const handleAddToCart = async () => {
    setAdded(true);
    const cart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    const existing = cart.find(item => item.productId === product._id);
    if (existing) existing.quantity += qty;
    else cart.push({ productId: product._id, quantity: qty });
    localStorage.setItem('guestCart', JSON.stringify(cart));
    
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, quantity: qty }),
      });
    } catch {}
    
    setTimeout(() => setAdded(false), 2000);
  };
