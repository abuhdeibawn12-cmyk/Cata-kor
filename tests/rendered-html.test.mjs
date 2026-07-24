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
  assert.match(html, /29\.58/);
  assert.match(html, /30\.99/);
  assert.match(html, /35\.24/);
  assert.match(html, /88\.74/);
  assert.match(html, /ONE-TIME PURCHASE/);
  assert.doesNotMatch(html, /Subscribe &amp; Save|Choose Plan|RECOMMENDED DAILY USE/);
  assert.match(html, /PEACE-OF-MIND GUARANTEE/);
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
  assert.doesNotMatch(html, /Cellular Power Trio|CEO(?:&#x27;|')s Bundle|NAD\+ &amp; NMN Complex &amp; Glutathione/);
  assert.doesNotMatch(html, /<a[^>]*href="https?:\/\/(?:www\.)?catakor\.com/i);
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
