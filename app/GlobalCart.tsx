"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  buildFlashOffers,
  FlashOffer,
  PRODUCT_CATALOG,
  roundCurrency,
  useCart,
} from "./CartContext";

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

export function GlobalCart() {
  const {
    items,
    subtotal,
    cartOpen,
    closeCart,
    openCart,
    addFlashOffer,
    setLineQuantity,
    removeLine,
    clearCart,
  } = useCart();
  const [flashOffers, setFlashOffers] = useState<FlashOffer[]>([]);
  const [flashOpen, setFlashOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [acceptedOffers, setAcceptedOffers] = useState<string[]>([]);
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [completedTotal, setCompletedTotal] = useState(0);

  const regularSubtotal = useMemo(
    () =>
      roundCurrency(
        items
          .filter((item) => !item.isFlashSale)
          .reduce((total, item) => total + item.price * item.quantity, 0),
      ),
    [items],
  );
  const flashSubtotal = roundCurrency(subtotal - regularSubtotal);
  const promoDiscount = promoApplied ? roundCurrency(regularSubtotal * 0.15) : 0;
  const checkoutTotal = roundCurrency(subtotal - promoDiscount);

  useEffect(() => {
    const overlayOpen = cartOpen || flashOpen || checkoutOpen;
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, checkoutOpen, flashOpen]);

  const startCheckout = () => {
    const offers = buildFlashOffers(items);
    closeCart();
    setAcceptedOffers([]);
    setFlashOffers(offers);
    if (offers.length) {
      setFlashOpen(true);
    } else {
      setCheckoutOpen(true);
    }
  };

  const continueToCheckout = () => {
    setFlashOpen(false);
    setCheckoutOpen(true);
  };

  const applyPromo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (promoInput.trim().toUpperCase() === "CATA15") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("That code is not valid.");
    }
  };

  const completeOrder = () => {
    setCompletedTotal(checkoutTotal);
    setOrderPlaced(true);
    clearCart();
  };

  const closeCheckout = () => {
    setCheckoutOpen(false);
    setOrderPlaced(false);
    setPromoApplied(false);
    setPromoInput("");
    setPromoError("");
  };

  return (
    <>
      {cartOpen && (
        <div className="global-cart-layer" role="presentation" onMouseDown={closeCart}>
          <aside
            className="global-cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-cart-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="global-cart-heading">
              <div>
                <h2 id="global-cart-title">YOUR SHOPPING BAG</h2>
                <p>{items.length ? `${items.length} product selection${items.length === 1 ? "" : "s"}` : "Your bag is empty"}</p>
              </div>
              <button type="button" onClick={closeCart} aria-label="Close shopping bag">×</button>
            </div>

            {items.length === 0 ? (
              <div className="global-empty-cart">
                <span>0</span>
                <h3>Your shopping bag is empty</h3>
                <p>Choose a product and build your daily longevity routine.</p>
                <button type="button" onClick={closeCart}>CONTINUE SHOPPING</button>
              </div>
            ) : (
              <>
                <div className="global-cart-items">
                  {items.map((item) => {
                    const product = PRODUCT_CATALOG[item.productId];
                    return (
                      <article key={item.id}>
                        <img src={product.image} alt="" />
                        <div className="global-cart-item-copy">
                          {item.isFlashSale && (
                            <span className="global-flash-label">FLASH SALE · {item.discountPercent}% OFF</span>
                          )}
                          <h3>{product.name}</h3>
                          <p>{item.jars} {item.jars === 1 ? "Jar" : "Jars"} · One-time purchase</p>
                          <div className="global-cart-price">
                            {item.isFlashSale && <del>{money(item.originalPrice)}</del>}
                            <strong>{money(item.price)}</strong>
                          </div>
                          <div className="global-cart-quantity">
                            <span>Bundle quantity</span>
                            <div>
                              <button
                                type="button"
                                onClick={() => setLineQuantity(item.id, item.quantity - 1)}
                                aria-label={`Decrease ${product.shortName} quantity`}
                              >
                                −
                              </button>
                              <b aria-label={`${item.quantity} bundles`}>{item.quantity}</b>
                              <button
                                type="button"
                                onClick={() => setLineQuantity(item.id, item.quantity + 1)}
                                aria-label={`Increase ${product.shortName} quantity`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          className="global-cart-remove"
                          type="button"
                          onClick={() => removeLine(item.id)}
                          aria-label={`Remove ${product.shortName}, ${item.jars} jar bundle`}
                        >
                          Remove
                        </button>
                      </article>
                    );
                  })}
                </div>
                <div className="global-cart-summary">
                  <span>SUBTOTAL</span>
                  <strong>{money(subtotal)}</strong>
                </div>
                <button className="global-cart-checkout" type="button" onClick={startCheckout}>
                  CHECKOUT
                </button>
                <button className="global-cart-continue" type="button" onClick={closeCart}>
                  CONTINUE SHOPPING
                </button>
                <p className="global-cart-note">CATA15 can be applied to regular items at checkout.</p>
              </>
            )}
          </aside>
        </div>
      )}

      {flashOpen && (
        <div className="global-offer-layer" role="presentation">
          <section className="global-offer-dialog" role="dialog" aria-modal="true" aria-labelledby="flash-title">
            <span className="global-offer-eyebrow">CHECKOUT-ONLY FLASH SALE</span>
            <h2 id="flash-title">YOUR PRIVATE BUNDLE OFFERS</h2>
            <p>One limited offer has been prepared for every regular product in your bag.</p>
            <div className="global-offer-grid">
              {flashOffers.map((offer) => {
                const product = PRODUCT_CATALOG[offer.productId];
                const source = PRODUCT_CATALOG[offer.sourceProductId];
                const accepted = acceptedOffers.includes(offer.id);
                return (
                  <article key={offer.id}>
                    <span>BECAUSE YOU CHOSE {source.shortName.toUpperCase()}</span>
                    <img src={product.image} alt={product.shortName} />
                    <h3>{product.shortName}</h3>
                    <p>{offer.jars} {offer.jars === 1 ? "Jar" : "Jars"} · {offer.discountPercent}% Flash Discount</p>
                    <div>
                      <del>{money(offer.originalPrice)}</del>
                      <strong>{money(offer.salePrice)}</strong>
                    </div>
                    <button
                      type="button"
                      disabled={accepted}
                      onClick={() => {
                        addFlashOffer(offer);
                        setAcceptedOffers((current) => [...current, offer.id]);
                      }}
                    >
                      {accepted ? "OFFER ADDED" : "ADD FLASH OFFER"}
                    </button>
                  </article>
                );
              })}
            </div>
            <button className="global-offer-continue" type="button" onClick={continueToCheckout}>
              {acceptedOffers.length ? "CONTINUE WITH MY OFFERS" : "NO THANKS, CONTINUE"}
            </button>
          </section>
        </div>
      )}

      {checkoutOpen && (
        <div className="global-checkout-layer" role="presentation" onMouseDown={closeCheckout}>
          <section
            className="global-checkout-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="global-checkout-close" type="button" onClick={closeCheckout} aria-label="Close checkout">×</button>
            {orderPlaced ? (
              <div className="global-order-success">
                <span>✓</span>
                <h2 id="checkout-title">ORDER CONFIRMED</h2>
                <p>Your testing order total was <b>{money(completedTotal)}</b>.</p>
                <button type="button" onClick={closeCheckout}>CONTINUE SHOPPING</button>
              </div>
            ) : (
              <>
                <span className="global-offer-eyebrow">SECURE CHECKOUT</span>
                <h2 id="checkout-title">ORDER SUMMARY</h2>
                <div className="global-checkout-items">
                  {items.map((item) => (
                    <div key={item.id}>
                      <span>
                        {PRODUCT_CATALOG[item.productId].shortName} · {item.jars} {item.jars === 1 ? "Jar" : "Jars"} × {item.quantity}
                        {item.isFlashSale && <em> FLASH</em>}
                      </span>
                      <strong>{money(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>
                <form className="global-promo-form" onSubmit={applyPromo}>
                  <label htmlFor="checkout-promo">Promo code</label>
                  <div>
                    <input
                      id="checkout-promo"
                      value={promoInput}
                      onChange={(event) => setPromoInput(event.target.value)}
                      placeholder="Enter CATA15"
                      disabled={promoApplied}
                    />
                    <button type="submit" disabled={promoApplied}>
                      {promoApplied ? "APPLIED" : "APPLY"}
                    </button>
                  </div>
                  {promoApplied && <p className="global-promo-success">CATA15 applied to regular items only.</p>}
                  {promoError && <p className="global-promo-error" role="alert">{promoError}</p>}
                </form>
                <div className="global-checkout-totals">
                  <div><span>Regular items</span><strong>{money(regularSubtotal)}</strong></div>
                  {flashSubtotal > 0 && <div><span>Flash-sale items</span><strong>{money(flashSubtotal)}</strong></div>}
                  {promoApplied && <div className="is-discount"><span>CATA15 · 15% off regular items</span><strong>−{money(promoDiscount)}</strong></div>}
                  <div className="is-total"><span>TOTAL</span><strong>{money(checkoutTotal)}</strong></div>
                </div>
                <button className="global-place-order" type="button" onClick={completeOrder}>
                  COMPLETE CHECKOUT
                </button>
                <p className="global-testing-note">Testing storefront · No payment will be charged.</p>
                <button className="global-back-to-cart" type="button" onClick={() => { setCheckoutOpen(false); openCart(); }}>
                  BACK TO SHOPPING BAG
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
