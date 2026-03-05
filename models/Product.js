import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String }, // For seed data compatibility
  name: { type: String, required: true }, // The main identifier used by frontend
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, index: true },
  image: { type: String },
  images: [{ type: String }],
  specifications: { type: Object },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
