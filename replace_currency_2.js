const fs = require('fs');
const path = require('path');

const files = [
  'app/page.js',
  'app/ProductCard.js',
  'app/cart/CartClient.js',
  'app/products/ProductsClient.js',
  'app/products/[id]/page.js',
  'app/admin/AdminClient.js'
];

files.forEach(f => {
  const absolutePath = path.join(__dirname, f);
  if (!fs.existsSync(absolutePath)) return;
  
  let c = fs.readFileSync(absolutePath, 'utf8');

  // Replace literal $ before {product, e.g. }>${product.price
  c = c.replace(/>\$\{product/g, '>₹${product');
  c = c.replace(/>\$\{\(product\.originalPrice/g, '>₹${(product.originalPrice');

  // Replace lines that start with some spaces and then ${product...
  c = c.replace(/(\s+)\$\{(product\.price\?\.toLocaleString\(\))/g, '$1₹${$2');
  c = c.replace(/(\s+)\$\{(product\.originalPrice\?\.toLocaleString\(\))/g, '$1₹${$2');

  // Replace Save $
  c = c.replace(/Save \$\{\(product/g, 'Save ₹${(product');

  // Replace ${product?.price
  c = c.replace(/>\$\{product\?\.price/g, '>₹${product?.price');

  // Specific matches
  c = c.replace(/each<\/p>/g, ' each</p>');
  c = c.replace(/\$\{product\?\.price\?\.toLocaleString\(\)\}/g, '₹${product?.price?.toLocaleString()}');

  // AdminClient.js
  c = c.replace(/>\$\{\(p.price/g, '>₹${(p.price');
  c = c.replace(/>\$\{p.originalPrice/g, '>₹${p.originalPrice');
  c = c.replace(/>\$\{\(o.totalAmount/g, '>₹${(o.totalAmount');

  // Any left >$
  c = c.replace(/>\$/g, '>₹');

  fs.writeFileSync(absolutePath, c);
  console.log('Updated ' + f);
});
