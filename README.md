# Catakor Original for WooCommerce

This theme ports the merchant-owned Catakor Shopify storefront to WordPress and WooCommerce.

- `generated/header.html`, `generated/home.html`, and `generated/footer.html` are mechanically extracted from `../catakor-source.html`.
- Shopify analytics, cart, checkout, and app scripts are removed.
- Internal storefront routes are mapped to their WooCommerce equivalents.
- Product, cart, account, and checkout screens use WooCommerce as the system of record.

Regenerate the source fragments from the workspace root with:

```sh
node scripts/build-catakor-original-theme.mjs
```
