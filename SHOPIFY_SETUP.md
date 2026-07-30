# Required Shopify catalog configuration

The theme owns the storefront design and behavior. Shopify owns sellable products,
variants, inventory, discounts, checkout, orders, and customers. Configure these
resources once so every theme update from GitHub continues to work.

## Product handles and variants

Create three active products with these exact handles:

- `nad-advanced-500mg`
- `liposomal-glutathione`
- `nmn`

Each product needs available variants titled:

- `1 Jar`
- `2 Jars`
- `3 Jars`

Set the variant totals to:

| Product | 1 Jar | 2 Jars | 3 Jars |
| --- | ---: | ---: | ---: |
| NAD+ | $39.99 | $69.98 | $98.97 |
| Liposomal Glutathione | $39.99 | $69.98 | $98.97 |
| NMN | $39.99 | $71.98 | $101.97 |

Add each product to the `shop-all` collection.

## Discounts

- `CATA15`: 15% off regular products only.
- `FLASH20`: 20% off eligible flash bundle variants only.
- `FLASH25`: 25% off eligible different-product flash items only.

Exclude line items marked with the private `_flash_offer` property from CATA15.
The secure implementation should use Shopify Functions or a compatible discount
app to validate those private properties at checkout.

## Pages

The theme routes `/pages/about-us` and `/pages/science-benefits` directly, so their
layout does not depend on manual template assignment. Creating matching Shopify
pages is still recommended for navigation, SEO, and admin organization.
