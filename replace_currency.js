const fs = require('fs');
const path = require('path');

const files = [
  'app/products/ProductsClient.js',
  'app/products/[id]/page.js',
  'app/Navbar.js',
  'app/admin/AdminClient.js',
  'app/cart/CartClient.js',
  'app/ProductCard.js',
  'app/page.js',
  'app/checkout/CheckoutClient.js'
];

files.forEach(f => {
  const absolutePath = path.join(__dirname, f);
  if (!fs.existsSync(absolutePath)) return;
  
  let c = fs.readFileSync(absolutePath, 'utf8');

  // Regexes for specific currency text
  c = c.replace(/Under \$300/g, 'Under ₹300');
  c = c.replace(/\$300 – \$700/g, '₹300 – ₹700');
  c = c.replace(/\$700 – \$1,200/g, '₹700 – ₹1,200');
  c = c.replace(/\$1,200/g, '₹1,200');
  c = c.replace(/price: '\$(.*?)'/g, "price: '₹$1'");
  c = c.replace(/Price \(\$\)/g, 'Price (₹)');
  c = c.replace(/Original Price \(\$\)/g, 'Original Price (₹)');
  c = c.replace(/over \$50/g, 'over ₹50');

  // Dollar literal before template literal, e.g., `${
  c = c.replace(/\$\$\{/g, '₹${');
  
  // Dollar literal right after tags or before values
  c = c.replace(/>\$/g, '>₹');

  fs.writeFileSync(absolutePath, c);
  console.log('Updated ' + f);
});
