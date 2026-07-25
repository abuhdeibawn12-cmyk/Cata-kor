import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Cata-Kor homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /AGE ON YOUR/);
  assert.match(html, /BUILD YOUR DAILY LONGEVITY ROUTINE/);
  assert.match(html, /NMN Complex/);
  assert.match(html, /Liposomal Glutathione/);
  assert.match(html, /CA-AKG/);
  assert.match(html, /OUT OF STOCK/);
  assert.match(html, /EXTRA 15% OFF AT CHECKOUT/);
  assert.match(html, /CATA15/);
  assert.match(html, /\$38\.24/);
  assert.match(html, /\$39\.99/);
  assert.match(html, /\$33\.99/);
  assert.doesNotMatch(html, /Christmas in July/i);
  assert.doesNotMatch(html, /NMN Complex &amp; Liposomal Glutathione|NAD\+ &amp; NMN Complex &amp; Glutathione/);
  assert.match(html, /expert-card-flip/);
  assert.match(html, /expert-card-back/);
  assert.match(html, /href="\/pages\/science-benefits"/);
  assert.match(html, /hero-products-hq\.png/);
  assert.match(html, /founder-desktop-clear\.png/);
  assert.match(html, /My goal was never to make another supplement brand/);
  assert.doesNotMatch(html, /<a[^>]*href="https?:\/\/(?:www\.)?catakor\.com/i);
  assert.match(html, /Cata-Kor NAD \| Age on your terms/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("server-renders the Liposomal NAD product page", async () => {
  const response = await render("/products/nad-advanced-500mg");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /LIPOSOMAL NAD/);
  assert.match(html, /Select Quantity/);
  assert.match(html, /32\.58/);
  assert.match(html, /33\.99/);
  assert.match(html, /38\.24/);
  assert.match(html, /97\.74/);
  assert.match(html, /ONE-TIME PURCHASE/);
  assert.match(html, /Supplement Facts/);
  assert.match(html, /Serving Size: 2 Capsules/);
  assert.match(html, /Key Ingredients/);
  assert.match(html, /LipoNAD™ delivers β-NAD directly into cells/);
  assert.match(html, /Show more product images/);
  assert.match(html, /Open shopping bag with 0 items/);
  assert.match(html, /CATA15/);
  assert.match(html, /Account unavailable/);
  assert.doesNotMatch(html, /href="#footer"[^>]*aria-label="Cart|href="#footer"[^>]*aria-label="Log in"/);
  assert.match(html, /49c88503ac444cceaa07ad0941b19ff2/);
  assert.match(html, /626b669d4eae4d0f95088060c2662d1f/);
  assert.match(html, /1763917e32c14cbda12acec0ee8bcd3d/);
  assert.match(html, /Sidney Outlaw/);
  assert.match(html, /Morgan Adams/);
  assert.match(html, /Previous reviews/);
  assert.match(html, /Aaron before and after eight weeks using Cata-Kor/);
  assert.match(html, /FREQUENTLY ASK QUESTION/);
  assert.doesNotMatch(html, /Subscribe &amp; Save|Choose Plan|RECOMMENDED DAILY USE/);
  assert.match(html, /PEACE-OF-MIND/);
  assert.doesNotMatch(html, /<a[^>]*href="https?:\/\/(?:www\.)?catakor\.com/i);
});

test("server-renders the shop collection without bundles", async () => {
  const response = await render("/collections/shop-all");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /SHOP ALL/);
  assert.match(html, /NAD⁺ Advanced LipoNAD™ 500mg/);
  assert.match(html, /Cata-Kor Liposomal Glutathione/);
  assert.match(html, /NMN Supplement \| Quercetin \| TMG \| Resveratrol/);
  assert.match(html, /Skin, Hair &amp; Nails Supplement/);
  assert.match(html, /Out of stock/);
  assert.equal((html.match(/>Out of stock</g) ?? []).length, 1);
  assert.equal((html.match(/>View Product</g) ?? []).length, 3);
  assert.match(html, /href="\/products\/liposomal-glutathione"/);
  assert.match(html, /href="\/products\/nmn"/);
  assert.match(html, /Main_Glu\.png/);
  assert.match(html, /Main_NMN_42c0bc37/);
  assert.doesNotMatch(html, /Cellular Power Trio|CEO(?:&#x27;|')s Bundle|NAD\+ &amp; NMN Complex &amp; Glutathione/);
  assert.doesNotMatch(html, /<a[^>]*href="https?:\/\/(?:www\.)?catakor\.com/i);
});

test("server-renders the one-time Liposomal Glutathione product page", async () => {
  const response = await render("/products/liposomal-glutathione");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /LIPOSOMAL GLUTATHIONE/);
  assert.match(html, /1155MG/);
  assert.match(html, /Select Quantity/);
  assert.match(html, /\$32\.86/);
  assert.match(html, /\$32\.29/);
  assert.match(html, /\$33\.99/);
  assert.match(html, /\$98\.59/);
  assert.match(html, /ONE-TIME PURCHASE/);
  assert.match(html, /Main_Glu\.png/);
  assert.match(html, /\$64\.58 total/);
  assert.match(html, /What makes this glutathione supplement unique/);
  assert.match(html, /Add to Cart/);
  assert.match(html, /CATA15/);
  assert.doesNotMatch(html, /Subscribe &amp; Save|Choose Plan/);
});

test("server-renders the one-time NMN product page with exact jar pricing", async () => {
  const response = await render("/products/nmn");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /NMN 4-IN-1 NAD\+ SUPPORT/);
  assert.match(html, /1000MG/);
  assert.match(html, /Select Quantity/);
  assert.match(html, /\$39\.99/);
  assert.match(html, /\$35\.99/);
  assert.match(html, /\$33\.99/);
  assert.match(html, /\$101\.97/);
  assert.match(html, /\$71\.98/);
  assert.match(html, /ONE-TIME PURCHASE/);
  assert.match(html, /Main_NMN_42c0bc37/);
  assert.match(html, /\$71\.98 total/);
  assert.match(html, /Third-Party Tested/);
  assert.match(html, /Add to Cart/);
  assert.match(html, /CATA15/);
  assert.match(html, /Support Cellular/);
  assert.match(html, /Key Benefits/);
  assert.match(html, /Top Health Experts &amp; Medical Partners/);
  assert.match(html, /How We Compare/);
  assert.match(html, /Customer Reviews/);
  assert.match(html, /Page[\s\S]{0,40}1[\s\S]{0,40}of 20/);
  assert.match(html, /aria-label="Go to review page 20"/);
  assert.match(html, /Questions\? We/);
  assert.match(html, /Image_gp-inline-block/);
  assert.match(html, /benefits-img\.webp/);
  assert.match(html, /partner-image-1\.png/);
  assert.doesNotMatch(html, /Subscribe &amp; Save|Choose Plan|90 Days Supply|30 Days Supply/);
});

test("server-renders the complete science and quality page", async () => {
  const response = await render("/pages/science-benefits");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Certificate of Analysis/);
  assert.match(html, /Cata-Kor NMN Supplement/);
  assert.match(html, /Science and Quality/);
  assert.match(html, /Stefano Barberi/);
  assert.match(html, /Morgan Adams/);
  assert.match(html, /Play NAD\+ supplement video/);
  assert.match(html, /Questions We Receive Often/);
  assert.match(html, /coa-nad-advanced\.jpg/);
  assert.match(html, /liponad-study\.pdf/);
  assert.doesNotMatch(html, /<a[^>]*href="https?:\/\/(?:www\.)?catakor\.com/i);
});
