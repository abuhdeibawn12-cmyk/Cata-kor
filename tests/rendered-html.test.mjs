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
  assert.match(html, /Cata-Kor NAD \| Age on your terms/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("server-renders the Liposomal NAD product page", async () => {
  const response = await render("/products/nad-advanced-500mg");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /LIPOSOMAL NAD/);
  assert.match(html, /Select Quantity/);
  assert.match(html, /Subscribe &amp; Save/);
  assert.match(html, /PEACE-OF-MIND GUARANTEE/);
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
});
