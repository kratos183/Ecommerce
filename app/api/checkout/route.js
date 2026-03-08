import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth';
import Razorpay from 'razorpay';

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const reqData = await request.json();
    const { paymentMethod, ...shipping } = reqData;

    await connectDB();
    const cart = await Cart.findOne({ userId: user.userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) return Response.json({ error: 'Cart is empty' }, { status: 400 });

    const orderProducts = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      if (!item.productId) continue;
      const product = await Product.findById(item.productId._id);
      if (!product) return Response.json({ error: `Product ${item.productId._id} not found` }, { status: 404 });
      if (product.stock < item.quantity) return Response.json({ error: `Insufficient stock for ${product.title || product.name}` }, { status: 400 });

      orderProducts.push({ productId: product._id, quantity: item.quantity, price: product.price });
      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({ 
      userId: user.userId, 
      products: orderProducts, 
      totalAmount, 
      paymentStatus: 'pending', 
      orderStatus: 'processing',
      shippingAddress: shipping
    });

    for (const item of orderProducts) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    await Cart.findOneAndDelete({ userId: user.userId });

    // Handle Razorpay specific order creation
    if (paymentMethod === 'card' || paymentMethod === 'upi' || paymentMethod === 'razorpay') {
      try {
        const razorpay = new Razorpay({
          key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100), // convert to paisa
          currency: 'INR',
          receipt: order._id.toString(),
        });

        return Response.json({ 
          message: 'Order created successfully', 
          order, 
          paymentRequired: true,
          rzpOrderId: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency
        }, { status: 201 });
      } catch (err) {
        console.error('Razorpay Error:', err);
        return Response.json({ error: 'Failed to initialize payment gateway.' }, { status: 500 });
      }
    }

    return Response.json({ message: 'Order created successfully', order, paymentRequired: false }, { status: 201 });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
