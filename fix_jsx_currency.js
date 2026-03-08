const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/products/ProductsClient.js',
  'app/products/[id]/page.js',
  'app/page.js',
  'app/cart/CartClient.js'
];

filesToFix.forEach(f => {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) return;

  let c = fs.readFileSync(p, 'utf8');

  // Any line that has some whitespaces, then ₹${, should probably be ₹{ in JSX
  c = c.replace(/(\s+)₹\$\{(product\.price)/g, '$1₹{$2');
  c = c.replace(/(\s+)₹\$\{(product\.originalPrice)/g, '$1₹{$2');
  c = c.replace(/Save ₹\$\{\(/g, 'Save ₹{(');

  fs.writeFileSync(p, c);
  console.log(`Fixed ${f}`);
});
