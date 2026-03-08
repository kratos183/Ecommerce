import crypto from 'crypto';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = await request.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await connectDB();
      // Payment is verified
      await Order.findByIdAndUpdate(dbOrderId, {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id
      });
      return Response.json({ message: "Payment verified successfully" }, { status: 200 });
    } else {
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
