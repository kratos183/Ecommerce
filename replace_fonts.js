const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walkDir(file));
      }
    } else { 
      if (file.endsWith('.js') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walkDir(path.join(__dirname, 'app'));
let changesMade = 0;

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    let original = c;
    
    // Replace inline styles
    c = c.replace(/fontFamily:\s*['"](?:Syne|DM Sans|Syne,\s*sans-serif|DM Sans,\s*sans-serif|Syne,sans-serif|DM Sans,sans-serif|'Syne',\s*sans-serif|'DM Sans',\s*sans-serif)['"]/gi, "fontFamily: 'sans-serif'");
    
    // Replace css font-family
    c = c.replace(/font-family:\s*['"]?(?:Syne|DM Sans)['"]?(\s*,\s*sans-serif)?/gi, "font-family: sans-serif");
    
    // Replace CSS custom properties like --font-mono etc if user wanted just a clean font
    c = c.replace(/@import url\('.*?googleapis.*?fonts.*?'\);?/gi, '');
    
    if (c !== original) {
      fs.writeFileSync(f, c);
      changesMade++;
      console.log('Updated ' + f);
    }
  }
});
console.log('Total files updated: ' + changesMade);
