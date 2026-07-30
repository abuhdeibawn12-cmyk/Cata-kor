(() => {
  const root = window.Shopify?.routes?.root || "/";
  const drawer = document.querySelector("#CartDrawer");
  const moneyFormatter = new Intl.NumberFormat(document.documentElement.lang || "en-US", {
    style: "currency",
    currency: window.Shopify?.currency?.active || "USD"
  });

  const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);

  const formatMoney = (cents) => moneyFormatter.format(Number(cents || 0) / 100);
  const flashDialog = document.querySelector("#FlashOfferDialog");
  let flashDiscountCode = "";

  const openCart = () => {
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    drawer.querySelector("[data-cart-close]")?.focus();
  };

  const closeCart = () => {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  };

  const cartLineMarkup = (item) => `
    <article class="cart-line" data-line-key="${escapeHtml(item.key)}">
      ${item.image ? `<img src="${escapeHtml(item.image)}&width=180" alt="${escapeHtml(item.product_title)}" width="92" height="92">` : ""}
      <div>
        <a href="${escapeHtml(item.url)}"><strong>${escapeHtml(item.product_title)}</strong></a>
        <p>${escapeHtml(item.variant_title || "")}</p>
        <span>${formatMoney(item.final_line_price)}</span>
        <div class="quantity-control">
          <button type="button" data-cart-quantity="${Math.max(0, item.quantity - 1)}" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-cart-quantity="${item.quantity + 1}" aria-label="Increase quantity">+</button>
        </div>
        <button class="text-button" type="button" data-cart-remove>Remove</button>
      </div>
    </article>`;

  const renderCart = (cart) => {
    document.querySelectorAll("[data-cart-count]").forEach((count) => {
      count.textContent = cart.item_count;
      count.hidden = cart.item_count === 0;
    });
    if (!drawer) return;

    const items = drawer.querySelector("[data-cart-items]");
    const summary = drawer.querySelector("[data-cart-summary]");
    const footer = drawer.querySelector("[data-cart-footer]");
    const total = drawer.querySelector("[data-cart-total]");

    if (summary) summary.textContent = `${cart.item_count} item${cart.item_count === 1 ? "" : "s"}`;
    if (total) total.textContent = formatMoney(cart.total_price);
    if (footer) footer.hidden = cart.item_count === 0;
    if (items) {
      items.innerHTML = cart.item_count
        ? cart.items.map(cartLineMarkup).join("")
        : `<div class="cart-empty"><p>Your shopping bag is empty.</p><a class="button button--lime" href="${root}collections/all">Shop products</a></div>`;
    }
  };

  const getCart = async () => {
    const response = await fetch(`${root}cart.js`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Unable to load cart");
    return response.json();
  };

  const changeCartLine = async (key, quantity) => {
    const before = await getCart();
    const removed = before.items.find((item) => item.key === key);
    const response = await fetch(`${root}cart/change.js`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ id: key, quantity })
    });
    if (!response.ok) throw new Error("Unable to update cart");
    let updated = await response.json();
    if (quantity === 0 && removed && !removed.properties?._flash_offer) {
      const linked = updated.items.filter((item) =>
        item.properties?._flash_source_handle === removed.handle &&
        !updated.items.some((candidate) => candidate.handle === removed.handle && !candidate.properties?._flash_offer)
      );
      for (const item of linked) {
        const linkedResponse = await fetch(`${root}cart/change.js`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ id: item.key, quantity: 0 })
        });
        updated = await linkedResponse.json();
      }
    }
    renderCart(updated);
  };

  const jarsFromTitle = (title = "") => Math.max(1, Number(String(title).match(/\d+/)?.[0] || 1));
  const regularItems = (cart) => cart.items.filter((item) => !item.properties?._flash_offer);
  const productJson = async (handle) => {
    const response = await fetch(`${root}products/${handle}.js`);
    if (!response.ok) throw new Error(`Unable to load ${handle}`);
    return response.json();
  };
  const variantForJars = (product, jars) =>
    product.variants.find((variant) => jarsFromTitle(variant.title) === jars && variant.available) ||
    product.variants.find((variant) => variant.available);

  const addVariant = async (variantId, quantity, properties = {}) => {
    const response = await fetch(`${root}cart/add.js`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ items: [{ id: variantId, quantity, properties }] })
    });
    if (!response.ok) throw new Error("Unable to add flash offer");
  };

  const buildFlashOffers = async (cart) => {
    const items = regularItems(cart);
    const latest = [...new Map(items.map((item) => [item.handle, item])).values()];
    const handlesInCart = new Set(items.map((item) => item.handle));
    const catalog = ["nad-advanced-500mg", "liposomal-glutathione", "nmn"];
    return Promise.all(latest.map(async (source, index) => {
      const sourceJars = jarsFromTitle(source.variant_title);
      if (sourceJars < 3) {
        const product = await productJson(source.handle);
        const jars = sourceJars + 1;
        return { source, product, variant: variantForJars(product, jars), jars, discount: 20, replaces: true };
      }
      let candidates = catalog.filter((handle) => handle !== source.handle && !handlesInCart.has(handle));
      if (!candidates.length) candidates = catalog.filter((handle) => handle !== source.handle);
      const handle = candidates[index % candidates.length];
      const product = await productJson(handle);
      return { source, product, variant: variantForJars(product, 1), jars: 1, discount: 25, replaces: false };
    }));
  };

  const showFlashOffers = async () => {
    const cart = await getCart();
    const offers = await buildFlashOffers(cart);
    if (!offers.length) {
      window.location.href = `${root}checkout`;
      return;
    }
    const grid = flashDialog?.querySelector("[data-flash-offers]");
    if (!grid) return;
    grid.innerHTML = offers.map((offer, index) => {
      const salePrice = Math.round(offer.variant.price * (1 - offer.discount / 100));
      return `<article class="flash-offer-card" data-flash-index="${index}">
        <small>BECAUSE YOU CHOSE ${escapeHtml(offer.source.product_title)}</small>
        ${offer.product.featured_image ? `<img src="${escapeHtml(offer.product.featured_image)}&width=420" alt="${escapeHtml(offer.product.title)}">` : ""}
        <h3>${escapeHtml(offer.product.title)}</h3>
        <p>${offer.jars} Jar${offer.jars === 1 ? "" : "s"} · ${offer.discount}% Flash Discount</p>
        <em>${offer.replaces ? `REPLACES YOUR CURRENT ${escapeHtml(offer.source.variant_title)} BUNDLE` : "ADDS A DIFFERENT PRODUCT TO YOUR ORDER"}</em>
        <div><s>${formatMoney(offer.variant.price)}</s> <strong>${formatMoney(salePrice)}</strong></div>
        <button class="button button--lime button--full" type="button" data-accept-flash="${index}">
          ${offer.replaces ? "REPLACE WITH THIS OFFER" : "ADD FLASH OFFER"}
        </button>
      </article>`;
    }).join("");
    flashDialog._offers = offers;
    flashDialog.hidden = false;
    document.body.classList.add("is-locked");
    closeCart();
  };

  const acceptFlashOffer = async (index, button) => {
    const offer = flashDialog?._offers?.[index];
    if (!offer || button.disabled) return;
    button.disabled = true;
    button.textContent = "UPDATING…";
    if (offer.replaces) await changeCartLine(offer.source.key, 0);
    await addVariant(offer.variant.id, offer.source.quantity || 1, {
      _flash_offer: "true",
      _flash_discount: String(offer.discount),
      _flash_source_handle: offer.replaces ? "" : offer.source.handle
    });
    flashDiscountCode = offer.discount === 25 ? "FLASH25" : "FLASH20";
    button.textContent = offer.replaces ? "BUNDLE UPGRADED" : "OFFER ADDED";
    renderCart(await getCart());
  };

  const continueCheckout = () => {
    flashDialog.hidden = true;
    document.body.classList.remove("is-locked");
    const destination = flashDiscountCode
      ? `${root}discount/${flashDiscountCode}?redirect=${encodeURIComponent(`${root}checkout`)}`
      : `${root}checkout`;
    window.location.href = destination;
  };

  document.addEventListener("click", async (event) => {
    const openButton = event.target.closest("[data-cart-open]");
    const closeButton = event.target.closest("[data-cart-close]");
    const menuButton = event.target.closest("[data-menu-toggle]");
    const mediaButton = event.target.closest("[data-media-target]");
    const variantButton = event.target.closest("[data-variant-button]");
    const productScrollButton = event.target.closest("[data-product-scroll]");
    const quantityButton = event.target.closest("[data-cart-quantity]");
    const removeButton = event.target.closest("[data-cart-remove]");
    const checkoutButton = event.target.closest("[data-start-checkout]");
    const flashButton = event.target.closest("[data-accept-flash]");
    const flashContinue = event.target.closest("[data-flash-continue]");
    const filterToggle = event.target.closest("[data-filter-toggle]");
    const toggleAllFaqs = event.target.closest("[data-toggle-all-faqs]");
    const reviewScroll = event.target.closest("[data-review-scroll]");
    const factsOpen = event.target.closest("[data-facts-open]");
    const factsClose = event.target.closest("[data-facts-close]");
    const factsTab = event.target.closest("[data-facts-tab]");
    const reviewPageGo = event.target.closest("[data-review-page-go]");
    const reviewPageChange = event.target.closest("[data-review-page-change]");

    if (openButton) {
      event.preventDefault();
      try { renderCart(await getCart()); } catch (error) { console.error(error); }
      openCart();
    }
    if (closeButton) closeCart();
    if (menuButton) {
      const navigation = document.querySelector("#MainNavigation");
      const open = navigation?.classList.toggle("is-open") || false;
      menuButton.setAttribute("aria-expanded", String(open));
    }
    if (mediaButton) {
      const gallery = mediaButton.closest("[data-product-gallery]");
      gallery?.querySelectorAll("[data-media-target]").forEach((button) => button.classList.toggle("is-active", button === mediaButton));
      gallery?.querySelectorAll("[data-media-id]").forEach((media) => media.classList.toggle("is-active", media.dataset.mediaId === mediaButton.dataset.mediaTarget));
    }
    if (variantButton) {
      const product = variantButton.closest("[data-product-root]");
      product?.querySelectorAll("[data-variant-button]").forEach((button) => {
        const selected = button === variantButton;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      const input = product?.querySelector("[data-variant-input]");
      const price = variantButton.dataset.priceFormatted;
      if (input) input.value = variantButton.dataset.variantId;
      product?.querySelectorAll("[data-product-price], [data-add-price]").forEach((element) => { element.textContent = price; });
    }
    if (productScrollButton) {
      const track = document.querySelector("[data-product-track]");
      const direction = Number(productScrollButton.dataset.productScroll || 1);
      track?.scrollBy({ left: direction * track.clientWidth * 0.78, behavior: "smooth" });
    }
    if (quantityButton || removeButton) {
      const line = event.target.closest("[data-line-key]");
      if (!line) return;
      event.preventDefault();
      const quantity = removeButton ? 0 : Number(quantityButton.dataset.cartQuantity);
      try { await changeCartLine(line.dataset.lineKey, quantity); } catch (error) { console.error(error); }
    }
    if (checkoutButton) {
      event.preventDefault();
      try { await showFlashOffers(); } catch (error) { console.error(error); window.location.href = `${root}checkout`; }
    }
    if (flashButton) {
      try { await acceptFlashOffer(Number(flashButton.dataset.acceptFlash), flashButton); } catch (error) { console.error(error); flashButton.disabled = false; flashButton.textContent = "PLEASE TRY AGAIN"; }
    }
    if (flashContinue) continueCheckout();
    if (filterToggle) {
      const menu = document.querySelector("[data-filter-menu]");
      const open = menu?.hasAttribute("hidden");
      menu?.toggleAttribute("hidden", !open);
      filterToggle.setAttribute("aria-expanded", String(open));
      filterToggle.querySelector("span").textContent = open ? "−" : "+";
    }
    if (toggleAllFaqs) {
      const details = [...document.querySelectorAll("[data-about-faqs] details")];
      const shouldOpen = details.some((detail) => !detail.open);
      details.forEach((detail) => { detail.open = shouldOpen; });
      toggleAllFaqs.textContent = shouldOpen ? "Close All" : "View All";
    }
    if (reviewScroll) {
      const track = document.querySelector("[data-review-track]");
      track?.scrollBy({ left: Number(reviewScroll.dataset.reviewScroll) * track.clientWidth * .78, behavior: "smooth" });
    }
    if (factsOpen) {
      const layer = document.querySelector("[data-facts-layer]");
      layer.hidden = false;
      document.body.classList.add("is-locked");
    }
    if (factsClose) {
      const layer = document.querySelector("[data-facts-layer]");
      layer.hidden = true;
      document.body.classList.remove("is-locked");
    }
    if (factsTab) {
      const name = factsTab.dataset.factsTab;
      document.querySelectorAll("[data-facts-tab]").forEach((tab) => tab.classList.toggle("is-active", tab === factsTab));
      document.querySelectorAll("[data-facts-panel]").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.factsPanel === name));
    }
    if (reviewPageGo || reviewPageChange) {
      const pages = [...document.querySelectorAll("[data-review-page]")];
      const current = Math.max(0, pages.findIndex((page) => page.classList.contains("is-active")));
      const requested = reviewPageGo
        ? Number(reviewPageGo.dataset.reviewPageGo) - 1
        : Math.min(pages.length - 1, Math.max(0, current + Number(reviewPageChange.dataset.reviewPageChange)));
      pages.forEach((page, index) => page.classList.toggle("is-active", index === requested));
      document.querySelectorAll("[data-review-page-go]").forEach((button) =>
        button.classList.toggle("is-active", Number(button.dataset.reviewPageGo) - 1 === requested)
      );
      document.querySelector("[data-review-pages]")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCart();
  });

  document.querySelectorAll("[data-product-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector("[data-add-to-cart]");
      const label = form.querySelector("[data-add-label]");
      if (button?.disabled) return;
      button.disabled = true;
      if (label) label.textContent = "Adding…";

      try {
        const response = await fetch(`${root}cart/add.js`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form)
        });
        if (!response.ok) throw new Error("Unable to add this product");
        renderCart(await getCart());
        openCart();
      } catch (error) {
        console.error(error);
        if (label) label.textContent = "Please try again";
      } finally {
        button.disabled = false;
        window.setTimeout(() => {
          if (label) label.textContent = "Add to cart";
        }, 1200);
      }
    });
  });

  const collectionGrid = document.querySelector("[data-collection-grid]");
  const updateCollection = () => {
    if (!collectionGrid) return;
    const availability = document.querySelector('input[name="availability"]:checked')?.value || "all";
    const sort = document.querySelector("[data-collection-sort]")?.value || "featured";
    const cards = [...collectionGrid.querySelectorAll("[data-collection-card]")];
    cards.forEach((card) => {
      const available = card.dataset.available === "true";
      card.hidden = availability === "in-stock" ? !available : availability === "out-of-stock" ? available : false;
    });
    cards.sort((a, b) => sort === "a-z"
      ? a.dataset.title.localeCompare(b.dataset.title)
      : sort === "z-a"
        ? b.dataset.title.localeCompare(a.dataset.title)
        : Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder)
    ).forEach((card) => collectionGrid.append(card));
    const visible = cards.filter((card) => !card.hidden).length;
    const count = document.querySelector("[data-visible-count]");
    const label = document.querySelector("[data-filter-label]");
    if (count) count.textContent = `${visible} product${visible === 1 ? "" : "s"}`;
    if (label) label.textContent = availability === "all" ? "Availability" : availability === "in-stock" ? "In stock" : "Out of stock";
  };
  document.querySelectorAll('input[name="availability"], [data-collection-sort]').forEach((control) =>
    control.addEventListener("change", updateCollection)
  );

  getCart().then(renderCart).catch(() => {});
})();
