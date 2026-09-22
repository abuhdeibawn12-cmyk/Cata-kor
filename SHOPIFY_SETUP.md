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

## Private flash products

Create three additional active products with these exact handles and the tag
`flash-offer`:

- `nad-advanced-500mg-flash-offer`
- `liposomal-glutathione-flash-offer`
- `nmn-flash-offer`

Keep these products out of collections, search recommendations, navigation, and
sales channels other than Online Store. The theme redirects their product pages
and marks them `noindex,nofollow`; customers receive them only through the
checkout flash-offer dialog.

Give every flash product variants titled `1 Jar`, `2 Jars`, and `3 Jars`, with
these exact prices:

| Flash product | 1 Jar (25% off) | 2 Jars (20% off) | 3 Jars (20% off) |
| --- | ---: | ---: | ---: |
| NAD+ | $29.99 | $55.98 | $79.18 |
| Liposomal Glutathione | $29.99 | $55.98 | $79.18 |
| NMN | $29.99 | $57.58 | $81.58 |

Make the variants available and configure their inventory/fulfillment to match
the corresponding regular bundles. The theme deliberately omits an offer when
the expected flash variant is unavailable or has a different price, preventing
the drawer from advertising a price Shopify checkout will not honor.

## Discounts

- `CATA10`: 10% off regular products only, with a $100 USD minimum eligible purchase.
- Do not create `FLASH20` or `FLASH25` codes. The private flash variants already
  contain their final checkout prices.
- Exclude all products tagged `flash-offer`, subscriptions, and bundles from `CATA10` and any automatic
  promotion so discounts cannot stack.
- For stricter offer-eligibility enforcement, use Shopify Functions or a
  compatible upsell app; theme code cannot prevent direct cart API requests.

## Spanish storefront

- In Shopify Admin, go to **Settings → Languages**, add Spanish, and assign it
  to both the Spain and Mexico markets.
- Use Shopify Translate & Adapt to translate products, collections, pages,
  policies, navigation, and theme content. Review medical, legal, shipping, and
  guarantee wording manually before publishing.
- Publish Spanish after review. The header language selector is conditional and
  appears automatically as soon as Shopify exposes more than one published
  storefront language.
- Shopify will serve the Spanish storefront from a localized URL such as `/es`.
  Theme-owned internal links use the localized `routes.root_url` so customers
  remain in Spanish while navigating.

## Pages

The theme routes `/pages/about-us` and `/pages/science-benefits` directly, so their
layout does not depend on manual template assignment. Creating matching Shopify
pages is still recommended for navigation, SEO, and admin organization.
