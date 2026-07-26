import assert from "node:assert/strict";
import test from "node:test";

import {
  applyFlashOffer,
  buildFlashOffers,
  normalizeCartItems,
  removeCartLine,
} from "../app/cartModel.ts";

function regularLine(productId, jars, updatedAt = 1) {
  return {
    id: `${productId}-${jars}`,
    productId,
    jars,
    quantity: 1,
    price: 1,
    originalPrice: 1,
    isFlashSale: false,
    updatedAt,
  };
}

test("creates one flash offer for every regular product in the bag", () => {
  const offers = buildFlashOffers([
    regularLine("nad", 1),
    regularLine("glutathione", 2),
    regularLine("nmn", 3),
  ], () => 0);

  assert.equal(offers.length, 3);
  assert.deepEqual(
    offers.map(({ sourceProductId, productId, jars, salePrice }) => ({
      sourceProductId,
      productId,
      jars,
      salePrice,
    })),
    [
      { sourceProductId: "nad", productId: "nad", jars: 2, salePrice: 54.38 },
      { sourceProductId: "glutathione", productId: "glutathione", jars: 3, salePrice: 78.87 },
      { sourceProductId: "nmn", productId: "nad", jars: 1, salePrice: 28.68 },
    ],
  );
});

test("uses the most recently selected bundle for each product", () => {
  const [offer] = buildFlashOffers([
    regularLine("nmn", 1, 1),
    regularLine("nmn", 2, 2),
  ]);

  assert.equal(offer.jars, 3);
  assert.equal(offer.salePrice, 81.58);
});

test("does not create new offers from accepted flash-sale lines", () => {
  const flashLine = {
    ...regularLine("glutathione", 1),
    id: "flash-existing",
    isFlashSale: true,
  };

  assert.deepEqual(buildFlashOffers([flashLine]), []);
});

test("calculates every same-product upgrade flash price", () => {
  const cases = [
    ["nad", 1, 2, 54.38],
    ["nad", 2, 3, 78.19],
    ["glutathione", 1, 2, 51.66],
    ["glutathione", 2, 3, 78.87],
    ["nmn", 1, 2, 57.58],
    ["nmn", 2, 3, 81.58],
  ];

  for (const [productId, sourceJars, offerJars, salePrice] of cases) {
    const [offer] = buildFlashOffers([regularLine(productId, sourceJars)]);
    assert.equal(offer.productId, productId);
    assert.equal(offer.jars, offerJars);
    assert.equal(offer.salePrice, salePrice);
  }
});

test("calculates every alternate-product one-jar flash price", () => {
  const cases = [
    ["nad", 0, "glutathione", 25.49],
    ["nad", 0.999, "nmn", 29.99],
    ["glutathione", 0, "nad", 28.68],
    ["glutathione", 0.999, "nmn", 29.99],
    ["nmn", 0, "nad", 28.68],
    ["nmn", 0.999, "glutathione", 25.49],
  ];

  for (const [sourceProductId, random, productId, salePrice] of cases) {
    const [offer] = buildFlashOffers([regularLine(sourceProductId, 3)], () => random);
    assert.equal(offer.productId, productId);
    assert.equal(offer.jars, 1);
    assert.equal(offer.salePrice, salePrice);
  }
});

test("an accepted 1-to-2 or 2-to-3 upgrade replaces the original line", () => {
  const source = { ...regularLine("nad", 1), quantity: 2 };
  const [offer] = buildFlashOffers([source]);
  const updatedCart = applyFlashOffer([source], offer, 10);

  assert.equal(updatedCart.some((line) => line.id === source.id), false);
  assert.equal(updatedCart.length, 1);
  assert.equal(updatedCart[0].jars, 2);
  assert.equal(updatedCart[0].quantity, 2);
  assert.equal(updatedCart[0].price, 54.38);
  assert.equal(updatedCart[0].isFlashSale, true);
});

test("an accepted three-jar cross-sell keeps the original bundle", () => {
  const source = regularLine("nmn", 3);
  const [offer] = buildFlashOffers([source], () => 0);
  const updatedCart = applyFlashOffer([source], offer, 10);

  assert.equal(updatedCart.some((line) => line.id === source.id), true);
  assert.equal(updatedCart.length, 2);
  assert.equal(updatedCart.find((line) => line.isFlashSale)?.price, 28.68);
  assert.equal(updatedCart.find((line) => line.isFlashSale)?.sourceLineId, source.id);
});

test("removing a qualifying three-jar bundle also removes its flash cross-sell", () => {
  const source = regularLine("glutathione", 3);
  const [offer] = buildFlashOffers([source], () => 0.999);
  const cartWithOffer = applyFlashOffer([source], offer, 10);
  const updatedCart = removeCartLine(cartWithOffer, source.id);

  assert.deepEqual(updatedCart, []);
});

test("prefers a cross-sell product that is not already in the cart", () => {
  const glutathione = regularLine("glutathione", 3, 2);
  const nmn = regularLine("nmn", 1, 1);
  const offers = buildFlashOffers([glutathione, nmn], () => 0.999);
  const glutathioneOffer = offers.find(
    (offer) => offer.sourceProductId === "glutathione",
  );

  assert.equal(glutathioneOffer.productId, "nad");
});

test("randomizes valid alternatives when every product is already represented", () => {
  const offers = buildFlashOffers([
    regularLine("nad", 1),
    regularLine("glutathione", 3),
    regularLine("nmn", 1),
  ], () => 0.999);
  const glutathioneOffer = offers.find(
    (offer) => offer.sourceProductId === "glutathione",
  );

  assert.equal(glutathioneOffer.productId, "nmn");
});

test("repairs linked legacy cross-sells and removes legacy orphans", () => {
  const source = regularLine("glutathione", 3);
  const legacyOffer = {
    ...regularLine("nmn", 1, 2),
    id: "flash-legacy",
    isFlashSale: true,
    discountPercent: 25,
    sourceProductId: "glutathione",
  };

  const normalized = normalizeCartItems([source, legacyOffer]);
  assert.equal(normalized[1].sourceLineId, source.id);
  assert.deepEqual(normalizeCartItems([legacyOffer]), []);
});
