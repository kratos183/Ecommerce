import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth';
import { sanitizeInput, validatePrice } from '@/lib/validations';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const seed = searchParams.get('seed');

    if (seed === 'true') {
      const products = [
        { title: 'MacBook Pro 16"', description: 'Apple M3 Max chip, 36GB RAM, 1TB SSD', price: 2499, stock: 15, category: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60', specifications: { processor: 'M3 Max', ram: '36GB', storage: '1TB SSD' } },
        { title: 'Dell XPS 15', description: 'Intel i9, 32GB RAM, 1TB SSD, RTX 4060', price: 1899, stock: 20, category: 'Laptops', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=60', specifications: { processor: 'Intel i9', ram: '32GB', storage: '1TB SSD' } },
        { title: 'HP Spectre x360', description: 'Intel i7, 16GB RAM, 512GB SSD, Touchscreen', price: 1299, stock: 12, category: 'Laptops', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60', specifications: { processor: 'Intel i7', ram: '16GB', storage: '512GB SSD' } },
        { title: 'Lenovo ThinkPad X1', description: 'Intel i7, 16GB RAM, 512GB SSD, Business Laptop', price: 1499, stock: 18, category: 'Laptops', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=60', specifications: { processor: 'Intel i7', ram: '16GB', storage: '512GB SSD' } },
        { title: 'iPhone 15 Pro Max', description: 'A17 Pro chip, 256GB, Titanium design', price: 1199, stock: 30, category: 'Mobiles', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60', specifications: { storage: '256GB', display: '6.7"', camera: '48MP' } },
        { title: 'Samsung Galaxy S24 Ultra', description: 'Snapdragon 8 Gen 3, 512GB, S Pen included', price: 1299, stock: 25, category: 'Mobiles', image: 'https://images.unsplash.com/photo-1610945265064-3201021bc282?w=800&auto=format&fit=crop&q=60', specifications: { storage: '512GB', display: '6.8"', camera: '200MP' } },
        { title: 'Google Pixel 8 Pro', description: 'Tensor G3, 256GB, Best camera phone', price: 999, stock: 22, category: 'Mobiles', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=60', specifications: { storage: '256GB', display: '6.7"', camera: '50MP' } },
        { title: 'OnePlus 12', description: 'Snapdragon 8 Gen 3, 256GB, 100W charging', price: 799, stock: 28, category: 'Mobiles', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cd8fa?w=800&auto=format&fit=crop&q=60', specifications: { storage: '256GB', display: '6.82"', camera: '50MP' } },
        { title: 'iPad Pro 12.9"', description: 'M2 chip, 256GB, Liquid Retina XDR display', price: 1099, stock: 16, category: 'Tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60', specifications: { storage: '256GB', display: '12.9"', chip: 'M2' } },
        { title: 'Samsung Galaxy Tab S9', description: 'Snapdragon 8 Gen 2, 256GB, AMOLED display', price: 899, stock: 14, category: 'Tablets', image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&auto=format&fit=crop&q=60', specifications: { storage: '256GB', display: '11"', processor: 'Snapdragon 8 Gen 2' } },
        { title: 'Microsoft Surface Pro 9', description: 'Intel i7, 16GB RAM, 256GB SSD, 2-in-1', price: 1299, stock: 10, category: 'Tablets', image: 'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=800&auto=format&fit=crop&q=60', specifications: { processor: 'Intel i7', ram: '16GB', storage: '256GB' } },
        { title: 'AirPods Pro 2', description: 'Active Noise Cancellation, USB-C charging', price: 249, stock: 50, category: 'Accessories', image: 'https://images.unsplash.com/photo-1606220838315-056192d5e92c?w=800&auto=format&fit=crop&q=60', specifications: { type: 'Wireless Earbuds', battery: '6 hours', features: 'ANC' } },
        { title: 'Sony WH-1000XM5', description: 'Premium noise cancelling headphones', price: 399, stock: 35, category: 'Accessories', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=60', specifications: { type: 'Over-ear Headphones', battery: '30 hours', features: 'ANC' } },
        { title: 'Logitech MX Master 3S', description: 'Wireless mouse for professionals', price: 99, stock: 40, category: 'Accessories', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=60', specifications: { type: 'Wireless Mouse', connectivity: 'Bluetooth', battery: '70 days' } },
        { title: 'Apple Magic Keyboard', description: 'Wireless keyboard with numeric keypad', price: 129, stock: 45, category: 'Accessories', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60', specifications: { type: 'Wireless Keyboard', connectivity: 'Bluetooth', layout: 'Full-size' } },
        { title: 'Samsung T7 SSD 1TB', description: 'Portable external SSD, 1050MB/s read speed', price: 149, stock: 60, category: 'Accessories', image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&auto=format&fit=crop&q=60', specifications: { capacity: '1TB', speed: '1050MB/s', type: 'External SSD' } },
      ];
      await Product.deleteMany({});
      await Product.insertMany(products.map(p => ({ ...p, name: p.title })));
      return Response.json({ message: 'Products seeded', count: products.length });
    }

    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = sanitizeInput(searchParams.get('category'));
    const search = sanitizeInput(searchParams.get('search'));
    const sort = searchParams.get('sort');
    const minPrice = parseFloat(searchParams.get('minPrice'));
    const maxPrice = parseFloat(searchParams.get('maxPrice'));
    const minRating = parseFloat(searchParams.get('rating'));

    const query = {};
    if (category) query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
    ];

    // Price range filter
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    // Rating filter
    if (!isNaN(minRating)) {
      query.rating = { $gte: minRating };
    }

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    if (page > totalPages && totalPages > 0) {
      return Response.json({ error: 'Page not found' }, { status: 404 });
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'price_asc') sortQuery = { price: 1 };
    if (sort === 'price_desc') sortQuery = { price: -1 };
    if (sort === 'newest') sortQuery = { createdAt: -1 };
    if (sort === 'rating_desc') sortQuery = { rating: -1 };
    if (sort === 'popular') sortQuery = { reviews: -1 };

    const products = await Product.find(query).sort(sortQuery).skip((page - 1) * limit).limit(limit).lean();

    return Response.json({ products, pagination: { currentPage: page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const title = sanitizeInput(body.title || body.name); // Support both title and name
    const description = sanitizeInput(body.description);
    const { price, stock, category, image, images, specifications } = body;

    if (!title || !description || price == null) return Response.json({ error: 'Missing required fields' }, { status: 400 });
    if (!validatePrice(Number(price)) || Number(stock) < 0) return Response.json({ error: 'Invalid values' }, { status: 400 });

    await connectDB();
    const product = await Product.create({ title, name: title, description, price: Number(price), stock: Number(stock) || 0, category, image, images: images || [], specifications: specifications || {}, createdBy: user.userId });
    return Response.json({ message: 'Product created', product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return Response.json({ error: 'Failed to create product', details: error.message }, { status: 500 });
  }
}
export async function DELETE(request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return Response.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await connectDB();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json({ message: 'Product deleted successfully', id });
  } catch (error) {
    console.error('Delete product error:', error);
    return Response.json({ error: 'Failed to delete product', details: error.message }, { status: 500 });
  }
}
