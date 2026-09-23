# NMN offer rollback checkpoint — 2026-09-23

The storefront theme before the NMN pricing restructure is preserved on:

- Branch: `codex/rollback-nmn-pricing-2026-09-23`
- Commit: `35ac483`

## Original Shopify NMN configuration

Product ID: `9287810154708`

| Variant ID | Original title | Original SKU | Original price |
| --- | --- | --- | ---: |
| `48397080395988` | 1 Jar | `NMN-1 JAR` | $39.99 |
| `48397080428756` | 2 Jars | `NMN-2 JARs` | $71.98 |
| `48397080461524` | 3 Jars | `NMN-3 JARs` | $101.97 |

Original subscription plan group: `2555543764`

- Title: Subscribe & Save 15%
- Delivery options: every 1, 2, or 3 months
- Discount: 15% for every option
- Products: NMN, NAD+ Advanced, Liposomal Glutathione

## New NMN-only configuration

| Variant ID | New title | New SKU | New price | Weight |
| --- | --- | --- | ---: | ---: |
| `48397080395988` | 1 Jar | `NMN-1 JAR` | $49.99 | unchanged |
| `48397080428756` | 2 Jars | `NMN-2 JARs` | $74.99 | unchanged |
| `48397080461524` | 4 Jars | `NMN-4 JARs` | $112.48 | 0.60 kg |

New NMN-only subscription plan group: `5729747156`

- Title: NMN Subscribe & Save 15%
- Applies only to variant `48397080461524` (4 Jars)
- Delivery: every 4 months
- Discount: 15%
- Expected subscription price: $95.61 per delivery

## Rollback procedure

1. Restore the theme files from `codex/rollback-nmn-pricing-2026-09-23`.
2. Restore the three NMN variant titles, SKUs, and prices listed above.
3. Remove NMN-only subscription plan group `5729747156` created for the four-jar offer.
4. Confirm the original shared subscription plan still contains all three NMN variants.

Existing subscription contracts must not be edited or cancelled during a rollback.

## Original NMN flash-offer configuration

Product ID: `9299640156372`

| Variant ID | Original title | Original SKU | Original price |
| --- | --- | --- | ---: |
| `48456066957524` | 1 Jar | `NMN-FLASH-1 JAR` | $29.99 |
| `48456066990292` | 2 Jars | `NMN-FLASH-2 JARs` | $57.58 |
| `48456067023060` | 3 Jars | `NMN-FLASH-3 JARs` | $81.58 |

The new NMN upgrade offers use 10% off so the 15% subscription remains the best recurring price. Complementary one-jar flash offers remain unchanged.

The new flash configuration keeps the one-jar price at $29.99, sets two jars to $67.49, and changes variant `48456067023060` to 4 Jars at $101.23 with SKU `NMN-FLASH-4 JARs` and weight 0.60 kg.

Bestfulfill must map `NMN-4 JARs` and `NMN-FLASH-4 JARs` to four physical jars. The SKU changes are deliberate so the former three-jar mapping cannot silently fulfill the new four-jar promise.
