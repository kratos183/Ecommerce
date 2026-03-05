const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Product Schema
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, index: true },
  images: [{ type: String }],
  specifications: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Test function
async function testDB() {
  try {
    // Check if products exist
    const count = await Product.countDocuments();
    console.log('Products in database:', count);
    
    if (count === 0) {
      console.log('Seeding products...');
      const products = [
        { title: 'iPhone 15 Pro', description: 'Latest iPhone', price: 999, stock: 10, category: 'Mobiles' },
        { title: 'MacBook Pro', description: 'Apple laptop', price: 1999, stock: 5, category: 'Laptops' },
        { title: 'AirPods Pro', description: 'Wireless earbuds', price: 249, stock: 20, category: 'Accessories' }
      ];
      
      await Product.insertMany(products);
      console.log('Products seeded successfully');
    }
    
    // List all products
    const allProducts = await Product.find().limit(5);
    console.log('Sample products:', allProducts.map(p => ({ id: p._id, title: p.title, price: p.price })));
    
  } catch (error) {
    console.error('Database test error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testDB();