import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const cart = await Cart.findOne({ userId: user.userId }).populate('items.productId').lean();
    const formattedCart = cart ? {
      ...cart,
      items: cart.items.map(item => ({
        product: item.productId,
        quantity: item.quantity
      }))
    } : { userId: user.userId, items: [] };
    return Response.json({ cart: formattedCart });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { productId, quantity } = await request.json();
    
    console.log('Cart POST - ProductId:', productId, 'Quantity:', quantity);
    
    if (!productId || !quantity || quantity <= 0) {
      console.log('Cart POST - Invalid input');
      return Response.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log('Cart POST - Invalid product ID format');
      return Response.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    await connectDB();
    console.log('Cart POST - DB connected');
    
    const product = await Product.findById(productId);
    console.log('Cart POST - Product found:', !!product, product?.title);
    
    if (!product) {
      console.log('Cart POST - Product not found for ID:', productId);
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }
    if (product.stock < quantity) {
      console.log('Cart POST - Insufficient stock');
      return Response.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    const user = await getAuthUser();
    console.log('Cart POST - User:', user ? 'authenticated' : 'guest');

    if (!user) {
      console.log('Cart POST - Guest user, returning success');
      return Response.json({ message: 'Item added to cart', product: { _id: productId, quantity } });
    }

    let cart = await Cart.findOne({ userId: user.userId });
    console.log('Cart POST - Existing cart:', !!cart);
    
    if (!cart) {
      console.log('Cart POST - Creating new cart for user:', user.userId);
      cart = await Cart.create({ userId: user.userId, items: [{ productId, quantity }] });
      console.log('Cart POST - New cart created:', cart._id);
    } else {
      console.log('Cart POST - Updating existing cart');
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        console.log('Cart POST - Updated existing item quantity');
      } else {
        cart.items.push({ productId, quantity });
        console.log('Cart POST - Added new item to cart');
      }
      cart.updatedAt = Date.now();
      await cart.save();
      console.log('Cart POST - Cart saved');
    }
    return Response.json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Cart POST error:', error);
    return Response.json({ error: 'Failed to add to cart', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { productId, quantity } = await request.json();
    if (!productId || quantity == null || quantity < 0) return Response.json({ error: 'Invalid input' }, { status: 400 });

    await connectDB();
    const cart = await Cart.findOne({ userId: user.userId });
    if (!cart) return Response.json({ error: 'Cart not found' }, { status: 404 });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return Response.json({ error: 'Item not in cart' }, { status: 404 });

    if (quantity === 0) cart.items.splice(itemIndex, 1);
    else cart.items[itemIndex].quantity = quantity;

    cart.updatedAt = Date.now();
    await cart.save();
    return Response.json({ message: 'Cart updated', cart });
  } catch (error) {
    return Response.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    await connectDB();
    if (productId) {
      const cart = await Cart.findOne({ userId: user.userId });
      if (!cart) return Response.json({ error: 'Cart not found' }, { status: 404 });
      cart.items = cart.items.filter(item => item.productId.toString() !== productId);
      cart.updatedAt = Date.now();
      await cart.save();
      return Response.json({ message: 'Item removed from cart', cart });
    } else {
      await Cart.findOneAndDelete({ userId: user.userId });
      return Response.json({ message: 'Cart cleared' });
    }
  } catch (error) {
    return Response.json({ error: 'Failed to delete from cart' }, { status: 500 });
  }
}
