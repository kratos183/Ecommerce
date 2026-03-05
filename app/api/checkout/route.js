import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const cart = await Cart.findOne({ userId: user.userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) return Response.json({ error: 'Cart is empty' }, { status: 400 });

    const orderProducts = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (!product) return Response.json({ error: `Product ${item.productId._id} not found` }, { status: 404 });
      if (product.stock < item.quantity) return Response.json({ error: `Insufficient stock for ${product.title}` }, { status: 400 });

      orderProducts.push({ productId: product._id, quantity: item.quantity, price: product.price });
      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({ userId: user.userId, products: orderProducts, totalAmount, paymentStatus: 'pending', orderStatus: 'processing' });

    for (const item of orderProducts) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    await Cart.findOneAndDelete({ userId: user.userId });
    return Response.json({ message: 'Order created successfully', order, paymentRequired: true }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
