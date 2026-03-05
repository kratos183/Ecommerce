import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true, default: 1 }
  }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
