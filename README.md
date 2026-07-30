# Cata-Kor Shopify theme

This directory is an importable Shopify Online Store 2.0 theme. The packaged
upload file is stored at the repository root as
`Cata-Kor-Shopify-Theme-1.0.0.zip`.

## Upload

1. In Shopify Admin, open **Online Store → Themes**.
2. Select **Import theme → Upload zip file**.
3. Upload `Cata-Kor-Shopify-Theme-1.0.0.zip`.
4. Preview the imported theme before publishing it.

## Product setup

Create or update each product with three Shopify variants. Use the variant
names `1 Jar`, `2 Jars`, and `3 Jars`; the theme reads the leading number to
display the per-jar price.

| Product | 1 Jar | 2 Jars total | 3 Jars total |
| --- | ---: | ---: | ---: |
| NAD+ | $39.99 | $69.98 | $98.97 |
| Liposomal Glutathione | $39.99 | $69.98 | $98.97 |
| NMN | $39.99 | $71.98 | $101.97 |

Add product media to each product and set inventory on every variant. Shopify
will then control product availability, pricing, cart totals and checkout.

## Theme editor setup

1. Open **Customize** on the imported theme.
2. On the homepage, open **Featured products** and assign the three products.
3. Select the desired Shopify navigation menus in the Header and Footer.
4. Create pages with handles `about-us` and `science-benefits`.
5. Assign the `about` template to the About page and the `science` template to
   the Science page.
6. Choose an About hero image in the About template.

## Promotions and apps

- Create the `CATA15` discount code in Shopify Admin as 15% off eligible regular
  products. Configure its combinations so it cannot stack with flash-sale or
  subscription discounts.
- The product and reviews sections accept Shopify app blocks. Subscription and
  verified-reviews apps can therefore be installed later without rewriting the
  theme.
- Flash-sale replacement logic should be implemented through Shopify Functions
  or a compatible upsell app so the price and eligibility rules are enforced
  during Shopify checkout.

## Development

Run Shopify's official checks from the repository root:

```sh
shopify theme check --path shopify-theme
```

Preview against a Shopify store:

```sh
shopify theme dev --path shopify-theme --store your-store
```
