import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'shopify-theme', 'assets', 'theme.css.liquid');
const destination = path.join(root, 'woocommerce-theme', 'assets', 'shopify-port.css');

let css = fs.readFileSync(source, 'utf8');
css = css.replace(
  /\{\{\s*'([^']+)'\s*\|\s*asset_url\s*\}\}/g,
  './original/$1',
);

if (/\{[{%]/.test(css)) {
  throw new Error('Unresolved Liquid remains in generated WooCommerce CSS');
}

fs.writeFileSync(destination, css);
console.log(`Generated ${destination}`);
