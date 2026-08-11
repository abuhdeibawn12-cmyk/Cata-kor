# Cata-Kor Shopify theme

This is a Shopify Online Store 2.0 theme connected through GitHub.

## Connect through Shopify

1. In Shopify Admin, open **Online Store → Themes**.
2. Select **Add theme → Connect from GitHub**.
3. Install or authorize the Shopify GitHub app when prompted.
4. Choose the repository `abuhdeibawn12-cmyk/Cata-kor`.
5. Choose the branch `codex/shopify-theme`.
6. Connect it as an unpublished theme, preview it, and publish only when ready.

Shopify automatically pulls future commits from this branch. Changes saved in
Shopify's theme editor or code editor are also committed back to this branch.

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

The live checkout flash offers also require three private products. Follow
[`SHOPIFY_SETUP.md`](SHOPIFY_SETUP.md) for their exact handles, tags, variants,
prices, inventory, and discount exclusions. Flash prices are real Shopify
variant prices so the amount shown in the bag is preserved at checkout.

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
- The theme adds the separately priced private flash variants to checkout. Use
  Shopify Functions or a compatible upsell app only if stricter server-side
  offer-eligibility enforcement is required.

## Development

Run Shopify's official checks from the repository root:

```sh
shopify theme check --path shopify-theme
```

Preview against a Shopify store:

```sh
shopify theme dev --path shopify-theme --store your-store
```
