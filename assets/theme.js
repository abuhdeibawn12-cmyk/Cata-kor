(() => {
  const root = window.Shopify?.routes?.root || "/";
  const drawer = document.querySelector("#CartDrawer");
  const flashDialog = document.querySelector("#FlashOfferDialog");
  const testCartMode = document.body.dataset.cartMode === "test";
  const testCartStorageKey = "catakor-test-cart-v2";
  const productHandles = ["nad-advanced-500mg", "liposomal-glutathione", "nmn"];
  const flashProductHandles = {
    "nad-advanced-500mg": "nad-advanced-500mg-flash-offer",
    "liposomal-glutathione": "liposomal-glutathione-flash-offer",
    nmn: "nmn-flash-offer"
  };
  let productCatalogPromise;
  const moneyFormatter = new Intl.NumberFormat(document.documentElement.lang || "en-US", {
    style: "currency",
    currency: window.Shopify?.currency?.active || "USD"
  });

  const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[character]);
  const formatMoney = (cents) => moneyFormatter.format(Number(cents || 0) / 100);
  const imageUrl = (source, width = 180) => {
    if (!source) return "";
    return `${source}${source.includes("?") ? "&" : "?"}width=${width}`;
  };
  const jarsFromTitle = (title = "") => Math.max(1, Number(String(title).match(/\d+/)?.[0] || 1));
  const isFlashItem = (item) => item.properties?._flash_offer === "true";
  const isSubscriptionItem = (item) => Boolean(item.selling_plan_allocation);
  const purchaseLabel = (item) => {
    if (!isSubscriptionItem(item)) return "One-time purchase";
    return item.selling_plan_allocation?.selling_plan?.name || "Delivered every month · Save 15%";
  };
  const effectiveLinePrice = (item) => Number(item.final_line_price || 0);
  const effectiveSubtotal = (cart) =>
    cart.items.reduce((total, item) => total + effectiveLinePrice(item), 0);
  const hasPendingFlashOffer = (cart) => {
    const acceptedSourceTokens = new Set(cart.items
      .filter(isFlashItem)
      .map((item) => item.properties?._flash_source_token)
      .filter(Boolean));
    return cart.items.some((item) =>
      !isFlashItem(item) && !isSubscriptionItem(item) && !acceptedSourceTokens.has(`${item.handle}:${item.variant_id}`)
    );
  };

  const lockPage = () => document.body.classList.add("is-locked");
  const unlockPage = () => {
    if (drawer?.hidden !== false && flashDialog?.hidden !== false && document.querySelector("[data-review-dialog]")?.hidden !== false) {
      document.body.classList.remove("is-locked");
    }
  };
  const openCart = () => {
    if (!drawer) return;
    drawer.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    lockPage();
    drawer.querySelector("[data-cart-close]")?.focus();
  };
  const closeCart = () => {
    if (!drawer) return;
    drawer.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
    unlockPage();
  };

  const cartLineMarkup = (item) => {
    const flash = isFlashItem(item);
    const lineSale = effectiveLinePrice(item);
    const originalUnit = Number(item.properties?._flash_original_price_cents || 0);
    const displayTitle = item.properties?._flash_display_title || item.product_title;
    const displayVariant = item.properties?._flash_display_variant || item.variant_title || "1 Jar";
    return `
      <article data-line-key="${escapeHtml(item.key)}">
        ${item.image ? `<img src="${escapeHtml(imageUrl(item.image))}" alt="">` : ""}
        <div class="global-cart-item-copy">
          ${flash ? `<span class="global-flash-label">FLASH SALE · ${escapeHtml(item.properties?._flash_discount || "")}% OFF</span>` : ""}
          <h3>${escapeHtml(displayTitle)}</h3>
          <p>${escapeHtml(displayVariant)} · ${escapeHtml(purchaseLabel(item))}</p>
          <div class="global-cart-price">
            ${flash && originalUnit ? `<del>${formatMoney(originalUnit * item.quantity)}</del>` : ""}
            <strong>${formatMoney(lineSale)}</strong>
          </div>
          <div class="global-cart-quantity">
            <span>${flash ? "Flash bundle quantity" : "Bundle quantity"}</span>
            ${flash
              ? `<div><b aria-label="${item.quantity} flash bundles">${item.quantity}</b></div>`
              : `<div>
                  <button type="button" data-cart-quantity="${Math.max(0, item.quantity - 1)}" aria-label="Decrease quantity">−</button>
                  <b aria-label="${item.quantity} bundles">${item.quantity}</b>
                  <button type="button" data-cart-quantity="${item.quantity + 1}" aria-label="Increase quantity">+</button>
                </div>`}
          </div>
        </div>
        <button class="global-cart-remove" type="button" data-cart-remove>Remove</button>
      </article>`;
  };

  const renderCart = (cart) => {
    document.querySelectorAll("[data-cart-count]").forEach((count) => {
      count.textContent = cart.item_count;
      count.hidden = cart.item_count === 0;
    });
    if (!drawer) return;
    const content = drawer.querySelector("[data-cart-content]");
    const summary = drawer.querySelector("[data-cart-summary]");
    if (summary) {
      summary.textContent = cart.items.length
        ? `${cart.items.length} product selection${cart.items.length === 1 ? "" : "s"}`
        : "Your bag is empty";
    }
    if (!content) return;
    const showFlashTeaser = hasPendingFlashOffer(cart);
    const hasOneTimePurchase = cart.items.some((item) => !isFlashItem(item) && !isSubscriptionItem(item));
    content.innerHTML = cart.items.length
      ? `<div class="global-cart-items" data-cart-items>${cart.items.map(cartLineMarkup).join("")}</div>
         ${showFlashTeaser ? `<div class="global-cart-offer-hint" role="note">
           <span>⚡ Limited One-Time Offer</span>
           <strong>A Private Flash Deal Is Waiting</strong>
           <p>Use the checkout button below to reveal it. No code required.</p>
         </div>` : ""}
         <div class="global-cart-summary"><span>SUBTOTAL</span><strong data-cart-total>${formatMoney(effectiveSubtotal(cart))}</strong></div>
         <button class="global-cart-checkout" type="button" data-start-checkout>${showFlashTeaser ? "CHECKOUT &amp; REVEAL OFFER →" : "CHECKOUT"}</button>
         <button class="global-cart-continue" type="button" data-cart-close>CONTINUE SHOPPING</button>
         ${hasOneTimePurchase ? '<p class="global-cart-note">CATA15 can be applied to one-time items at checkout.</p>' : ""}`
      : `<div class="global-empty-cart">
           <span>0</span><h3>Your shopping bag is empty</h3>
           <p>Choose a product and build your daily longevity routine.</p>
           <button type="button" data-cart-close>CONTINUE SHOPPING</button>
         </div>`;
  };

  const buildCart = (items = []) => ({
    items,
    item_count: items.reduce((total, item) => total + Number(item.quantity || 0), 0),
    total_price: items.reduce((total, item) => total + Number(item.final_line_price || 0), 0)
  });
  const readTestCart = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(testCartStorageKey) || "[]");
      return buildCart(Array.isArray(parsed) ? parsed : []);
    } catch (_) {
      return buildCart();
    }
  };
  const writeTestCart = (items) => {
    const cart = buildCart(items);
    localStorage.setItem(testCartStorageKey, JSON.stringify(cart.items));
    window.dispatchEvent(new CustomEvent("catakor:cart-change", { detail: cart }));
    return cart;
  };
  const loadProductCatalog = async () => {
    if (!productCatalogPromise) {
      const handles = [...productHandles, ...Object.values(flashProductHandles)];
      productCatalogPromise = Promise.all(handles.map(async (handle) => {
        const response = await fetch(`${root}products/${handle}.js`);
        if (!response.ok) throw new Error(`Unable to load ${handle}`);
        return response.json();
      }));
    }
    return productCatalogPromise;
  };
  const findVariant = async (variantId) => {
    for (const product of await loadProductCatalog()) {
      const variant = product.variants.find((candidate) => Number(candidate.id) === Number(variantId));
      if (variant) return { product, variant };
    }
    throw new Error("Unable to find this product option");
  };
  const getCart = async () => {
    if (testCartMode) return readTestCart();
    const response = await fetch(`${root}cart.js`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Unable to load cart");
    return response.json();
  };
  const updateLine = async (key, quantity) => {
    if (testCartMode) {
      const items = readTestCart().items
        .map((item) => item.key === key
          ? {
              ...item,
              quantity,
              final_line_price: item.price * quantity,
              final_price: item.price
            }
          : item)
        .filter((item) => item.quantity > 0);
      return writeTestCart(items);
    }
    const response = await fetch(`${root}cart/change.js`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ id: key, quantity })
    });
    if (!response.ok) throw new Error("Unable to update cart");
    return response.json();
  };
  const addVariant = async (variantId, quantity = 1, properties = {}, fallbackProduct = null, sellingPlanId = null) => {
    if (testCartMode) {
      let product;
      let variant;
      try {
        ({ product, variant } = await findVariant(variantId));
      } catch (error) {
        if (!fallbackProduct) throw error;
        product = {
          handle: fallbackProduct.handle,
          title: fallbackProduct.title,
          featured_image: fallbackProduct.image
        };
        variant = {
          id: variantId,
          title: fallbackProduct.variantTitle,
          price: fallbackProduct.price,
          featured_image: fallbackProduct.image ? { src: fallbackProduct.image } : null
        };
      }
      const flash = properties?._flash_offer === "true";
      const propertyKey = flash
        ? `${properties._flash_source_token || "replacement"}:${properties._flash_discount || ""}`
        : `regular:${sellingPlanId || "one-time"}`;
      const key = `${variant.id}:${propertyKey}`;
      const cart = readTestCart();
      const existing = cart.items.find((item) => item.key === key);
      const nextQuantity = Number(existing?.quantity || 0) + quantity;
      const allocation = sellingPlanId
        ? variant.selling_plan_allocations?.find((candidate) => Number(candidate.selling_plan_id) === Number(sellingPlanId))
        : null;
      const price = Number(allocation?.price || variant.price || 0);
      const line = {
        key,
        id: Number(variant.id),
        variant_id: Number(variant.id),
        handle: product.handle,
        product_title: product.title,
        variant_title: variant.title,
        quantity: nextQuantity,
        price,
        final_price: price,
        final_line_price: price * nextQuantity,
        image: variant.featured_image?.src || product.featured_image || "",
        properties,
        selling_plan_allocation: allocation
          ? {
              ...allocation,
              selling_plan: allocation.selling_plan || {
                id: Number(sellingPlanId),
                name: "Delivered every month · Save 15%"
              }
            }
          : null
      };
      return writeTestCart(existing
        ? cart.items.map((item) => item.key === key ? line : item)
        : [...cart.items, line]);
    }
    const item = { id: variantId, quantity, properties };
    if (sellingPlanId) item.selling_plan = Number(sellingPlanId);
    const response = await fetch(`${root}cart/add.js`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ items: [item] })
    });
    if (!response.ok) throw new Error("Unable to add item");
    return response.json();
  };
  const productFallbackFromForm = (form) => {
    const productRoot = form.closest("[data-product-root]");
    const selectedPack = productRoot?.querySelector(
      '[data-nad-pack][aria-pressed="true"], [data-secondary-pack][aria-pressed="true"]'
    );
    const productType = productRoot?.dataset.secondaryProduct || "nad";
    const handle = productType === "glutathione"
      ? "liposomal-glutathione"
      : productType === "nmn" ? "nmn" : "nad-advanced-500mg";
    const image = productRoot?.querySelector("[data-nad-main-image], [data-secondary-main-image]")?.currentSrc
      || productRoot?.querySelector("[data-nad-main-image], [data-secondary-main-image]")?.src
      || "";
    const jars = Math.max(1, Number(selectedPack?.dataset.jars || 1));
    const total = Number(selectedPack?.dataset.total || 0);
    return {
      handle,
      title: productRoot?.querySelector("h1")?.textContent?.trim() || "Cata-Kor Supplement",
      variantTitle: `${jars} ${jars === 1 ? "Jar" : "Jars"}`,
      price: Math.round(total * 100),
      image
    };
  };
  const selectedPackFor = (product) => product?.querySelector(
    '[data-nad-pack][aria-pressed="true"], [data-secondary-pack][aria-pressed="true"]'
  );
  const refreshPurchaseOptions = (product) => {
    if (!product) return;
    const pack = selectedPackFor(product);
    const form = product.querySelector("[data-product-form]");
    if (!pack || !form) return;
    const oneTimeCents = Number(pack.dataset.oneTimeCents || Math.round(Number(pack.dataset.total || 0) * 100));
    const subscriptionCents = Number(pack.dataset.subscriptionCents || oneTimeCents);
    const sellingPlanId = Number(pack.dataset.sellingPlanId || 0);
    const requestedMode = product.dataset.purchaseMode || "one-time";
    const mode = requestedMode === "subscription" && sellingPlanId ? "subscription" : "one-time";
    product.dataset.purchaseMode = mode;

    product.querySelectorAll("[data-purchase-mode]").forEach((button) => {
      const selected = button.dataset.purchaseMode === mode;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    product.querySelectorAll("[data-plan-one-time-price], [data-plan-compare-price]").forEach((element) => {
      element.textContent = formatMoney(oneTimeCents);
    });
    product.querySelectorAll("[data-plan-subscription-price]").forEach((element) => {
      element.textContent = formatMoney(subscriptionCents);
    });

    const sellingPlanInput = form.querySelector("[data-selling-plan-input]");
    if (sellingPlanInput) {
      sellingPlanInput.value = String(sellingPlanId || "");
      sellingPlanInput.disabled = mode !== "subscription" || !sellingPlanId;
    }
    const selectedPrice = mode === "subscription" ? subscriptionCents : oneTimeCents;
    const addPrice = form.querySelector("[data-add-price]");
    if (addPrice) addPrice.textContent = formatMoney(selectedPrice);
    product.classList.toggle("is-subscription-selected", mode === "subscription");
    const flashHint = product.querySelector(".product-flash-hint");
    if (flashHint) flashHint.hidden = mode === "subscription";
  };
  document.querySelectorAll("[data-product-root]").forEach(refreshPurchaseOptions);
  const sourceToken = (item) => `${item.handle}:${item.variant_id}`;
  const removeOrphanFlashItems = async (cart, removedRegular) => {
    if (!removedRegular || isFlashItem(removedRegular)) return cart;
    const token = sourceToken(removedRegular);
    const sourceStillExists = cart.items.some((item) => !isFlashItem(item) && sourceToken(item) === token);
    if (sourceStillExists) return cart;
    let updated = cart;
    const orphans = updated.items.filter((item) => item.properties?._flash_source_token === token);
    for (const orphan of orphans) updated = await updateLine(orphan.key, 0);
    return updated;
  };
  const changeCartLine = async (key, quantity) => {
    const before = await getCart();
    const changed = before.items.find((item) => item.key === key);
    let updated = await updateLine(key, quantity);
    if (quantity === 0) updated = await removeOrphanFlashItems(updated, changed);
    renderCart(updated);
    return updated;
  };

  const productJson = async (handle) => {
    const response = await fetch(`${root}products/${handle}.js`);
    if (!response.ok) throw new Error(`Unable to load ${handle}`);
    return response.json();
  };
  const normalVariantForJars = (product, jars) =>
    product.variants.find((variant) =>
      jarsFromTitle(variant.title) === jars &&
      (testCartMode || variant.available) &&
      !/flash/i.test(variant.title)
    ) || product.variants.find((variant) => (testCartMode || variant.available) && !/flash/i.test(variant.title));
  const flashVariantForJars = (product, jars, expectedPrice) =>
    product.variants.find((variant) =>
      jarsFromTitle(variant.title) === jars &&
      (testCartMode || variant.available) &&
      Number(variant.price) === expectedPrice
    );
  const flashSelectionFor = async (regularHandle, jars, expectedPrice) => {
    const handle = flashProductHandles[regularHandle];
    if (!handle) return null;
    try {
      const product = await productJson(handle);
      const variant = flashVariantForJars(product, jars, expectedPrice);
      if (!variant) {
        console.warn(`Flash product ${handle} is missing an available ${jars}-jar variant priced at ${expectedPrice} cents.`);
        return null;
      }
      return { product, variant };
    } catch (error) {
      console.warn(`Unable to load flash product ${handle}.`, error);
      return null;
    }
  };
  const regularItems = (cart) => cart.items.filter((item) => !isFlashItem(item) && !isSubscriptionItem(item));

  const buildFlashOffers = async (cart) => {
    const latestByProduct = new Map();
    const acceptedSourceTokens = new Set(cart.items
      .filter(isFlashItem)
      .map((item) => item.properties?._flash_source_token)
      .filter(Boolean));
    const regular = regularItems(cart).filter((item) => !acceptedSourceTokens.has(sourceToken(item)));
    regular.forEach((item) => {
      if (!latestByProduct.has(item.handle)) latestByProduct.set(item.handle, item);
    });
    const presentOrProposed = new Set(cart.items.map((item) =>
      item.properties?._flash_display_handle || item.handle
    ));
    const offers = [];
    for (const source of latestByProduct.values()) {
      const sourceJars = jarsFromTitle(source.variant_title);
      if (sourceJars < 3) {
        const product = await productJson(source.handle);
        const jars = sourceJars + 1;
        const variant = normalVariantForJars(product, jars);
        if (!variant) continue;
        const discount = 20;
        const salePrice = Math.round(variant.price * (1 - discount / 100));
        const flashSelection = await flashSelectionFor(source.handle, jars, salePrice);
        if (flashSelection) offers.push({
          source, product, variant,
          flashProduct: flashSelection.product,
          flashVariant: flashSelection.variant,
          jars, discount, salePrice, replaces: true
        });
        continue;
      }
      const alternatives = productHandles.filter((handle) => handle !== source.handle);
      let candidates = alternatives.filter((handle) => !presentOrProposed.has(handle));
      if (!candidates.length) candidates = alternatives;
      const handle = candidates[Math.floor(Math.random() * candidates.length)];
      presentOrProposed.add(handle);
      const product = await productJson(handle);
      const variant = normalVariantForJars(product, 1);
      if (!variant) continue;
      const discount = 25;
      const salePrice = Math.round(variant.price * (1 - discount / 100));
      const flashSelection = await flashSelectionFor(handle, 1, salePrice);
      if (flashSelection) offers.push({
        source, product, variant,
        flashProduct: flashSelection.product,
        flashVariant: flashSelection.variant,
        jars: 1, discount, salePrice, replaces: false
      });
    }
    return offers;
  };

  const flashOfferMarkup = (offer, index) => {
    const sourceName = offer.source.product_title.replace(/\s+\d+\s*MG$/i, "");
    return `<article data-flash-index="${index}">
      <span>BECAUSE YOU CHOSE ${escapeHtml(sourceName.toUpperCase())}</span>
      ${offer.product.featured_image ? `<img src="${escapeHtml(imageUrl(offer.product.featured_image, 500))}" alt="${escapeHtml(offer.product.title)}">` : ""}
      <h3>${escapeHtml(offer.product.title)}</h3>
      <p>${offer.jars} ${offer.jars === 1 ? "Jar" : "Jars"} · ${offer.discount}% Flash Discount</p>
      <small class="global-offer-mode">${offer.replaces
        ? `REPLACES YOUR CURRENT ${escapeHtml(sourceName.toUpperCase())} BUNDLE`
        : "ADDS A DIFFERENT PRODUCT TO YOUR ORDER"}</small>
      <div><del>${formatMoney(offer.variant.price)}</del><strong>${formatMoney(offer.salePrice)}</strong></div>
      <button type="button" data-accept-flash="${index}">${offer.replaces ? "REPLACE WITH THIS OFFER" : "ADD FLASH OFFER"}</button>
    </article>`;
  };
  const showFlashOffers = async () => {
    const cart = await getCart();
    const offers = await buildFlashOffers(cart);
    if (!offers.length) {
      window.location.href = `${root}checkout`;
      return;
    }
    const grid = flashDialog?.querySelector("[data-flash-offers]");
    if (!flashDialog || !grid) {
      window.location.href = `${root}checkout`;
      return;
    }
    grid.innerHTML = offers.map(flashOfferMarkup).join("");
    flashDialog._offers = offers;
    flashDialog._accepted = new Set();
    const continueButton = flashDialog.querySelector("[data-flash-continue]");
    if (continueButton) continueButton.textContent = "NO THANKS, CONTINUE";
    closeCart();
    flashDialog.hidden = false;
    lockPage();
  };
  const acceptFlashOffer = async (index, button) => {
    const offer = flashDialog?._offers?.[index];
    if (!offer || button.disabled) return;
    button.disabled = true;
    button.textContent = "UPDATING…";
    await addVariant(offer.flashVariant.id, offer.replaces ? offer.source.quantity : 1, {
      _flash_offer: "true",
      _flash_discount: String(offer.discount),
      _flash_original_price_cents: String(offer.variant.price),
      _flash_source_token: offer.replaces ? "" : sourceToken(offer.source),
      _flash_display_handle: offer.product.handle,
      _flash_display_title: offer.product.title,
      _flash_display_variant: offer.variant.title
    }, {
      handle: offer.flashProduct.handle,
      title: offer.flashProduct.title,
      variantTitle: offer.flashVariant.title,
      price: offer.flashVariant.price,
      image: offer.product.featured_image
    });
    if (offer.replaces) await updateLine(offer.source.key, 0);
    flashDialog._accepted.add(index);
    button.textContent = offer.replaces ? "BUNDLE UPGRADED" : "OFFER ADDED";
    const continueButton = flashDialog.querySelector("[data-flash-continue]");
    if (continueButton) continueButton.textContent = "CONTINUE WITH MY OFFERS";
    renderCart(await getCart());
  };
  const continueCheckout = () => {
    if (flashDialog) flashDialog.hidden = true;
    unlockPage();
    if (testCartMode) {
      renderCart(readTestCart());
      openCart();
      const checkoutButton = drawer?.querySelector("[data-start-checkout]");
      if (checkoutButton) {
        checkoutButton.textContent = "TEST CART READY";
        checkoutButton.title = "Live checkout will be connected during launch configuration.";
      }
      return;
    }
    window.location.href = `${root}checkout`;
  };
  const continueShoppingFromOffer = () => {
    if (flashDialog) flashDialog.hidden = true;
    unlockPage();
  };

  const preloadGalleryImages = (sources) => {
    sources.forEach((source) => {
      const image = new Image();
      image.decoding = "async";
      image.src = source;
    });
  };

  const swapGalleryImage = (image, source, alt) => {
    if (!image) return;
    const absoluteSource = new URL(source, window.location.href).href;
    if (image.src === absoluteSource) {
      image.alt = alt;
      return;
    }
    const token = `${Date.now()}-${Math.random()}`;
    image.dataset.swapToken = token;
    image.classList.add("is-changing");
    window.setTimeout(() => {
      if (image.dataset.swapToken !== token) return;
      image.src = source;
      image.alt = alt;
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        if (image.dataset.swapToken === token) image.classList.remove("is-changing");
      }));
    }, 90);
  };

  const setSecondaryGalleryIndex = (gallery, requestedIndex) => {
    if (!gallery) return;
    const data = JSON.parse(gallery.querySelector("[data-secondary-gallery-json]")?.textContent || "[]");
    if (!data.length) return;
    const index = Math.max(0, Math.min(data.length - 1, requestedIndex));
    gallery.dataset.galleryActive = String(index);
    const main = gallery.querySelector("[data-secondary-main-image]");
    if (main) {
      main.dataset.baseAlt ||= main.alt.replace(/\s+product view \d+$/i, "");
      swapGalleryImage(main, data[index], `${main.dataset.baseAlt} product view ${index + 1}`);
    }
    gallery.querySelector(".secondary-main-image")?.classList.toggle("has-star", index === 0);
    gallery.querySelectorAll("[data-gallery-index]").forEach((button) =>
      button.classList.toggle("is-active", Number(button.dataset.galleryIndex) === index)
    );
    const windowStart = Math.max(0, Math.min(Number(gallery.dataset.thumbnailStart || 0), Math.max(0, data.length - 6)));
    gallery.dataset.thumbnailStart = String(windowStart);
    gallery.querySelectorAll("[data-gallery-index]").forEach((button) => {
      const itemIndex = Number(button.dataset.galleryIndex);
      button.hidden = itemIndex < windowStart || itemIndex >= windowStart + 6;
    });
    const arrows = gallery.querySelectorAll("[data-thumbnail-shift]");
    arrows.forEach((button) => {
      button.disabled = Number(button.dataset.thumbnailShift) < 0 ? windowStart === 0 : windowStart >= data.length - 6;
    });
  };
  document.querySelectorAll("[data-secondary-gallery]").forEach((gallery) => {
    preloadGalleryImages(JSON.parse(gallery.querySelector("[data-secondary-gallery-json]")?.textContent || "[]"));
    gallery.dataset.galleryActive = "0";
    gallery.dataset.thumbnailStart = "0";
    setSecondaryGalleryIndex(gallery, 0);
  });

  const setNadGalleryIndex = (gallery, requestedIndex) => {
    if (!gallery) return;
    const data = JSON.parse(gallery.querySelector("[data-nad-gallery-json]")?.textContent || "[]");
    if (!data.length) return;
    const index = Math.max(0, Math.min(data.length - 1, requestedIndex));
    let start = Number(gallery.dataset.thumbnailStart || 0);
    if (index < start) start = index;
    if (index >= start + 6) start = index - 5;
    start = Math.max(0, Math.min(data.length - 6, start));
    gallery.dataset.galleryActive = String(index);
    gallery.dataset.thumbnailStart = String(start);
    const main = gallery.querySelector("[data-nad-main-image]");
    if (main) swapGalleryImage(main, data[index], `Liposomal NAD+ product image ${index + 1}`);
    gallery.querySelector(".product-star-shape").hidden = index !== 0;
    gallery.querySelector(".thumbnail-track")?.style.setProperty("--thumbnail-start", start);
    gallery.querySelectorAll("[data-nad-gallery-index]").forEach((button) =>
      button.classList.toggle("active", Number(button.dataset.nadGalleryIndex) === index)
    );
    gallery.querySelectorAll("[data-nad-thumbnail-shift]").forEach((button) => {
      button.disabled = Number(button.dataset.nadThumbnailShift) < 0 ? start === 0 : start >= data.length - 6;
    });
    const count = gallery.querySelector("[data-nad-gallery-count]");
    if (count) count.textContent = `${index + 1} / ${data.length}`;
    gallery.querySelectorAll("[data-nad-gallery-step]").forEach((button) => {
      button.disabled = Number(button.dataset.nadGalleryStep) < 0 ? index === 0 : index === data.length - 1;
    });
  };
  document.querySelectorAll("[data-nad-gallery]").forEach((gallery) => {
    preloadGalleryImages(JSON.parse(gallery.querySelector("[data-nad-gallery-json]")?.textContent || "[]"));
    gallery.dataset.galleryActive = "0";
    gallery.dataset.thumbnailStart = "0";
    setNadGalleryIndex(gallery, 0);
  });

  const updateScienceReviewState = (section, requestedIndex) => {
    const cards = [...section.querySelectorAll("[data-science-review-card]")];
    if (!cards.length) return 0;
    const index = Math.max(0, Math.min(cards.length - 1, requestedIndex));
    section.dataset.scienceReview = String(index);
    section.querySelectorAll("[data-science-review-go]").forEach((button) => {
      const active = Number(button.dataset.scienceReviewGo) === index;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    return index;
  };
  const setScienceReview = (section, requestedIndex) => {
    if (!section) return;
    const cards = [...section.querySelectorAll("[data-science-review-card]")];
    const index = updateScienceReviewState(section, requestedIndex);
    const track = section.querySelector("[data-review-track]");
    if (track && cards[index]) track.scrollTo({ left: cards[index].offsetLeft, behavior: "smooth" });
  };
  document.querySelectorAll("[data-science-reviews]").forEach((section) => {
    const track = section.querySelector("[data-review-track]");
    updateScienceReviewState(section, 0);
    let frame;
    track?.addEventListener("scroll", () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const cards = [...section.querySelectorAll("[data-science-review-card]")];
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;
        cards.forEach((card, index) => {
          const distance = Math.abs(card.offsetLeft - track.scrollLeft);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        updateScienceReviewState(section, closestIndex);
      });
    }, { passive: true });
  });

  const setNmnReviewPage = (section, requestedPage) => {
    const page = Math.max(1, Math.min(20, requestedPage));
    section.dataset.reviewPage = String(page);
    section.querySelectorAll("[data-nmn-review-page]").forEach((panel) => {
      const active = Number(panel.dataset.nmnReviewPage) === page;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    const pagination = section.querySelector("[data-nmn-review-pagination]");
    const items = page <= 4
      ? [1, 2, 3, 4, "ellipsis", 20]
      : page >= 17
        ? [1, "ellipsis", 17, 18, 19, 20]
        : [1, "ellipsis", page - 1, page, page + 1, "ellipsis", 20];
    if (pagination) {
      pagination.innerHTML = `<button type="button" data-nmn-review-go="${page - 1}" ${page === 1 ? "disabled" : ""} aria-label="Previous review page">←</button>
        ${items.map((item, index) => item === "ellipsis"
          ? `<span>…</span>`
          : `<button type="button" class="${page === item ? "is-active" : ""}" data-nmn-review-go="${item}" ${page === item ? 'aria-current="page"' : ""}>${item}</button>`
        ).join("")}
        <button type="button" data-nmn-review-go="${page + 1}" ${page === 20 ? "disabled" : ""} aria-label="Next review page">→</button>`;
    }
    const count = section.querySelector("[data-nmn-review-page-count]");
    if (count) count.textContent = `Page ${page} of 20`;
    const picturesOnly = section.querySelector("[data-pictures-only]")?.checked;
    section.querySelectorAll(`[data-nmn-review-page="${page}"] article`).forEach((article) => {
      article.hidden = Boolean(picturesOnly && article.dataset.hasReviewImage !== "true");
    });
  };
  document.querySelectorAll("[data-nmn-reviews]").forEach((section) => setNmnReviewPage(section, 1));

  const compactPaginationItems = (page, totalPages) => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
    if (page <= 4) return [1, 2, 3, 4, "ellipsis", totalPages];
    if (page >= totalPages - 3) return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages];
  };

  const initializeNadCustomerReviews = async (section) => {
    const status = section.querySelector("[data-nad-customer-status]");
    const list = section.querySelector("[data-nad-customer-list]");
    const pagination = section.querySelector("[data-nad-customer-pagination]");
    const sort = section.querySelector("[data-nad-customer-sort]");
    const picturesOnly = section.querySelector("[data-nad-customer-pictures]");
    const photoStrip = section.querySelector("[data-nad-customer-photos]");
    const histogram = section.querySelector("[data-nad-customer-histogram]");
    const perPage = 5;
    let currentPage = 1;
    let reviews = [];

    const safeImageUrl = (url) => /^https:\/\//i.test(String(url || "")) ? String(url) : "";
    const starsMarkup = (rating) => Array.from({ length: 5 }, (_, index) =>
      `<span class="${index < rating ? "is-filled" : ""}">&#9733;</span>`
    ).join("");
    const filteredReviews = () => {
      const withIndex = reviews.map((review, index) => ({ review, index }));
      const filtered = picturesOnly.checked
        ? withIndex.filter(({ review }) => review.pictures?.some(safeImageUrl))
        : withIndex;
      if (sort.value === "highest") filtered.sort((a, b) => b.review.rating - a.review.rating || a.index - b.index);
      if (sort.value === "lowest") filtered.sort((a, b) => a.review.rating - b.review.rating || a.index - b.index);
      return filtered.map(({ review }) => review);
    };

    const render = () => {
      const visibleReviews = filteredReviews();
      const totalPages = Math.max(1, Math.ceil(visibleReviews.length / perPage));
      currentPage = Math.max(1, Math.min(currentPage, totalPages));
      const start = (currentPage - 1) * perPage;
      const pageReviews = visibleReviews.slice(start, start + perPage);

      status.textContent = visibleReviews.length
        ? `Showing ${start + 1}\u2013${Math.min(start + perPage, visibleReviews.length)} of ${visibleReviews.length} reviews`
        : "No customer reviews match this filter.";
      list.innerHTML = pageReviews.map((review) => {
        const initial = Array.from(review.name || "A")[0] || "A";
        const photos = (review.pictures || []).map(safeImageUrl).filter(Boolean);
        return `<article class="nad-customer-review" data-review-uuid="${escapeHtml(review.uuid)}">
          <div class="nad-customer-review__stars" role="img" aria-label="${review.rating} out of 5 stars">${starsMarkup(review.rating)}</div>
          <div class="nad-customer-review__person">
            <span aria-hidden="true">${escapeHtml(initial.toUpperCase())}</span>
            <div><strong>${escapeHtml(review.name || "Anonymous")}</strong>${review.verified ? '<em>Verified</em>' : ""}<small>${escapeHtml(review.date)}</small></div>
          </div>
          ${review.title ? `<h3>${escapeHtml(review.title)}</h3>` : ""}
          ${review.body ? `<p>${escapeHtml(review.body)}</p>` : ""}
          ${photos.length ? `<div class="nad-customer-review__media">${photos.map((url) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener"><img src="${escapeHtml(url)}" alt="Customer photo from ${escapeHtml(review.name || "a reviewer")}" width="360" height="360" loading="lazy"></a>`).join("")}</div>` : ""}
        </article>`;
      }).join("");

      pagination.hidden = visibleReviews.length <= perPage;
      pagination.innerHTML = `<button type="button" data-nad-customer-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""} aria-label="Previous review page">&#8592;</button>
        ${compactPaginationItems(currentPage, totalPages).map((item) => item === "ellipsis"
          ? '<span aria-hidden="true">&hellip;</span>'
          : `<button type="button" class="${currentPage === item ? "is-active" : ""}" data-nad-customer-page="${item}" ${currentPage === item ? 'aria-current="page"' : ""}>${item}</button>`
        ).join("")}
        <button type="button" data-nad-customer-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""} aria-label="Next review page">&#8594;</button>`;
    };

    try {
      const response = await fetch(section.dataset.reviewsUrl, { credentials: "same-origin" });
      if (!response.ok) throw new Error(`Review data returned ${response.status}`);
      const payload = await response.json();
      reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
      section.querySelector("[data-nad-customer-average]").textContent = Number(payload.averageRating || 0).toFixed(1);
      section.querySelector("[data-nad-customer-total]").textContent = String(payload.totalReviews || reviews.length);

      histogram.innerHTML = [5, 4, 3, 2, 1].map((rating) => {
        const count = Number(payload.histogram?.[rating] || 0);
        const percent = reviews.length ? (count / reviews.length) * 100 : 0;
        return `<div><span>${rating} star</span><i><b style="width:${percent.toFixed(2)}%"></b></i><small>${count}</small></div>`;
      }).join("");

      const photoReviews = reviews.flatMap((review) => (review.pictures || [])
        .map(safeImageUrl)
        .filter(Boolean)
        .map((url) => ({ url, uuid: review.uuid, name: review.name }))
      ).filter((photo, index, all) => all.findIndex((candidate) => candidate.url === photo.url) === index).slice(0, 12);
      if (photoReviews.length) {
        photoStrip.hidden = false;
        photoStrip.innerHTML = photoReviews.map((photo) => `<button type="button" data-nad-customer-photo="${escapeHtml(photo.uuid)}" aria-label="Show review from ${escapeHtml(photo.name || "customer")}"><img src="${escapeHtml(photo.url)}" alt="Customer review photo" width="180" height="180" loading="lazy"></button>`).join("");
      }

      sort.addEventListener("change", () => { currentPage = 1; render(); });
      picturesOnly.addEventListener("change", () => { currentPage = 1; render(); });
      pagination.addEventListener("click", (event) => {
        const button = event.target.closest("[data-nad-customer-page]");
        if (!button || button.disabled) return;
        currentPage = Number(button.dataset.nadCustomerPage);
        render();
        list.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      photoStrip.addEventListener("click", (event) => {
        const button = event.target.closest("[data-nad-customer-photo]");
        if (!button) return;
        picturesOnly.checked = true;
        sort.value = "recent";
        const pictureReviews = reviews.filter((review) => review.pictures?.some(safeImageUrl));
        const position = pictureReviews.findIndex((review) => review.uuid === button.dataset.nadCustomerPhoto);
        currentPage = Math.max(1, Math.floor(Math.max(0, position) / perPage) + 1);
        render();
        list.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      render();
    } catch (error) {
      console.error(error);
      status.textContent = "Customer reviews could not be loaded. Please refresh the page to try again.";
    }
  };
  document.querySelectorAll("[data-nad-customer-reviews]").forEach(initializeNadCustomerReviews);

  document.querySelectorAll("[data-nmn-experts]").forEach((section) => {
    section.dataset.expertStart = "0";
  });
  const rotateExperts = (section, direction) => {
    const grid = section.querySelector(".nmn-expert-grid");
    if (!grid) return;
    const cards = [...grid.querySelectorAll("[data-expert-card]")];
    const current = Number(section.dataset.expertStart || 0);
    const next = (current + direction + cards.length) % cards.length;
    section.dataset.expertStart = String(next);
    const ordered = Array.from({ length: cards.length }, (_, index) => cards[(next + index) % cards.length]);
    ordered.forEach((card, index) => {
      card.hidden = index >= 4;
      grid.append(card);
    });
  };

  document.addEventListener("click", async (event) => {
    const target = event.target;
    const openButton = target.closest("[data-cart-open]");
    const closeButton = target.closest("[data-cart-close]");
    const menuButton = target.closest("[data-menu-toggle]");
    const quantityButton = target.closest("[data-cart-quantity]");
    const removeButton = target.closest("[data-cart-remove]");
    const checkoutButton = target.closest("[data-start-checkout]");
    const flashButton = target.closest("[data-accept-flash]");
    const flashContinue = target.closest("[data-flash-continue]");
    const flashShopMore = target.closest("[data-flash-shop-more]");
    const galleryThumb = target.closest("[data-gallery-index]");
    const galleryStep = target.closest("[data-gallery-step]");
    const thumbnailShift = target.closest("[data-thumbnail-shift]");
    const packButton = target.closest("[data-secondary-pack]");
    const purchaseModeButton = target.closest("[data-purchase-mode]");
    const expertStep = target.closest("[data-expert-step]");
    const nmnReviewGo = target.closest("[data-nmn-review-go]");
    const reviewFilter = target.closest("[data-nmn-review-filter]");
    const pictureFilter = target.closest("[data-review-picture-filter]");
    const reviewFormOpen = target.closest("[data-review-form-open]");
    const reviewFormClose = target.closest("[data-review-form-close]");
    const mediaButton = target.closest("[data-media-target]");
    const variantButton = target.closest("[data-variant-button]");
    const factsOpen = target.closest("[data-facts-open]");
    const factsClose = target.closest("[data-facts-close]");
    const factsTab = target.closest("[data-facts-tab]");
    const filterToggle = target.closest("[data-filter-toggle]");
    const toggleAllFaqs = target.closest("[data-toggle-all-faqs]");
    const reviewScroll = target.closest("[data-review-scroll]");
    const scienceReviewGo = target.closest("[data-science-review-go]");
    const reviewPageGo = target.closest("[data-review-page-go]");
    const reviewPageChange = target.closest("[data-review-page-change]");
    const productScrollButton = target.closest("[data-product-scroll]");
    const homeExpertToggle = target.closest("[data-home-expert-toggle]");
    const nadGalleryThumb = target.closest("[data-nad-gallery-index]");
    const nadGalleryStep = target.closest("[data-nad-gallery-step]");
    const nadThumbnailShift = target.closest("[data-nad-thumbnail-shift]");
    const nadPack = target.closest("[data-nad-pack]");
    const storyPlay = target.closest("[data-story-play]");
    const nadReviewGo = target.closest("[data-nad-review-go]");
    const nadReviewStep = target.closest("[data-nad-review-step]");

    if (openButton) {
      event.preventDefault();
      try { renderCart(await getCart()); } catch (error) { console.error(error); }
      openCart();
    }
    if (closeButton) closeCart();
    if (target === drawer) closeCart();
    if (menuButton) {
      const navigation = document.querySelector("#MainNavigation");
      const open = navigation?.classList.toggle("is-open") || false;
      menuButton.setAttribute("aria-expanded", String(open));
    }
    if (quantityButton || removeButton) {
      const line = target.closest("[data-line-key]");
      if (!line) return;
      event.preventDefault();
      const quantity = removeButton ? 0 : Number(quantityButton.dataset.cartQuantity);
      try { await changeCartLine(line.dataset.lineKey, quantity); } catch (error) { console.error(error); }
    }
    if (checkoutButton) {
      event.preventDefault();
      try { await showFlashOffers(); }
      catch (error) {
        console.error(error);
        window.location.href = `${root}checkout`;
      }
    }
    if (flashButton) {
      try { await acceptFlashOffer(Number(flashButton.dataset.acceptFlash), flashButton); }
      catch (error) { console.error(error); flashButton.disabled = false; flashButton.textContent = "PLEASE TRY AGAIN"; }
    }
    if (flashContinue) continueCheckout();
    if (flashShopMore) continueShoppingFromOffer();
    if (galleryThumb || galleryStep || thumbnailShift) {
      const gallery = target.closest("[data-secondary-gallery]");
      if (galleryThumb) setSecondaryGalleryIndex(gallery, Number(galleryThumb.dataset.galleryIndex));
      if (galleryStep) setSecondaryGalleryIndex(gallery, Number(gallery.dataset.galleryActive || 0) + Number(galleryStep.dataset.galleryStep));
      if (thumbnailShift) {
        gallery.dataset.thumbnailStart = String(Number(gallery.dataset.thumbnailStart || 0) + Number(thumbnailShift.dataset.thumbnailShift));
        setSecondaryGalleryIndex(gallery, Number(gallery.dataset.galleryActive || 0));
      }
    }
    if (packButton) {
      const product = packButton.closest("[data-product-root]");
      product.querySelectorAll("[data-secondary-pack]").forEach((button) => {
        const selected = button === packButton;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      product.querySelector("[data-variant-input]").value = packButton.dataset.variantId;
      product.querySelector("[data-selected-capsules]").textContent = `${Number(packButton.dataset.jars) * 60} Capsules`;
      refreshPurchaseOptions(product);
    }
    if (nadGalleryThumb || nadGalleryStep || nadThumbnailShift) {
      const gallery = target.closest("[data-nad-gallery]");
      if (nadGalleryThumb) setNadGalleryIndex(gallery, Number(nadGalleryThumb.dataset.nadGalleryIndex));
      if (nadGalleryStep) setNadGalleryIndex(gallery, Number(gallery.dataset.galleryActive || 0) + Number(nadGalleryStep.dataset.nadGalleryStep));
      if (nadThumbnailShift) {
        gallery.dataset.thumbnailStart = String(Number(gallery.dataset.thumbnailStart || 0) + Number(nadThumbnailShift.dataset.nadThumbnailShift));
        setNadGalleryIndex(gallery, Number(gallery.dataset.galleryActive || 0));
      }
    }
    if (nadPack) {
      const product = nadPack.closest("[data-product-root]");
      product.querySelectorAll("[data-nad-pack]").forEach((button) => {
        const selected = button === nadPack;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      product.querySelector("[data-variant-input]").value = nadPack.dataset.variantId;
      product.querySelector("[data-nad-capsules]").textContent = `${Number(nadPack.dataset.jars) * 60} Capsules`;
      refreshPurchaseOptions(product);
    }
    if (purchaseModeButton) {
      const product = purchaseModeButton.closest("[data-product-root]");
      product.dataset.purchaseMode = purchaseModeButton.dataset.purchaseMode;
      refreshPurchaseOptions(product);
    }
    if (storyPlay) {
      const card = storyPlay.closest(".story-card");
      const video = card.querySelector("video");
      try {
        await video.play();
        video.controls = true;
        card.classList.add("is-playing");
        storyPlay.hidden = true;
      } catch (error) { console.error(error); }
    }
    if (expertStep) rotateExperts(expertStep.closest("[data-nmn-experts]"), Number(expertStep.dataset.expertStep));
    if (nmnReviewGo) {
      const section = nmnReviewGo.closest("[data-nmn-reviews]");
      setNmnReviewPage(section, Number(nmnReviewGo.dataset.nmnReviewGo));
      section.querySelector(".nmn-review-list.is-active")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (reviewFilter) {
      const panel = reviewFilter.closest("[data-nmn-reviews]").querySelector("[data-nmn-review-filter-panel]");
      panel.hidden = !panel.hidden;
      reviewFilter.classList.toggle("is-active", !panel.hidden);
      reviewFilter.setAttribute("aria-expanded", String(!panel.hidden));
    }
    if (pictureFilter) {
      const section = pictureFilter.closest("[data-nmn-reviews]");
      section.querySelector("[data-pictures-only]").checked = true;
      setNmnReviewPage(section, Number(section.dataset.reviewPage || 1));
    }
    if (reviewFormOpen) {
      const dialog = document.querySelector("[data-review-dialog]");
      dialog.hidden = false;
      lockPage();
    }
    if (reviewFormClose || target.matches("[data-review-dialog]")) {
      const dialog = document.querySelector("[data-review-dialog]");
      dialog.hidden = true;
      unlockPage();
    }
    if (mediaButton) {
      const gallery = mediaButton.closest("[data-product-gallery]");
      gallery.querySelectorAll("[data-media-target]").forEach((button) => button.classList.toggle("is-active", button === mediaButton));
      gallery.querySelectorAll("[data-media-id]").forEach((media) => media.classList.toggle("is-active", media.dataset.mediaId === mediaButton.dataset.mediaTarget));
    }
    if (variantButton) {
      const product = variantButton.closest("[data-product-root]");
      product.querySelectorAll("[data-variant-button]").forEach((button) => {
        const selected = button === variantButton;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      product.querySelector("[data-variant-input]").value = variantButton.dataset.variantId;
      product.querySelectorAll("[data-product-price], [data-add-price]").forEach((element) => { element.textContent = variantButton.dataset.priceFormatted; });
    }
    if (factsOpen) { document.querySelector("[data-facts-layer]").hidden = false; lockPage(); }
    if (factsClose) { document.querySelector("[data-facts-layer]").hidden = true; unlockPage(); }
    if (factsTab) {
      document.querySelectorAll("[data-facts-tab]").forEach((tab) => {
        tab.classList.toggle("active", tab === factsTab);
        tab.classList.toggle("is-active", tab === factsTab);
      });
      document.querySelectorAll("[data-facts-panel]").forEach((panel) => {
        const active = panel.dataset.factsPanel === factsTab.dataset.factsTab;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });
    }
    if (filterToggle) {
      const menu = document.querySelector("[data-filter-menu]");
      menu.hidden = !menu.hidden;
      filterToggle.setAttribute("aria-expanded", String(!menu.hidden));
      filterToggle.querySelector("span").textContent = menu.hidden ? "+" : "−";
    }
    if (toggleAllFaqs) {
      const details = [...document.querySelectorAll("[data-about-faqs] details")];
      const shouldOpen = details.some((detail) => !detail.open);
      details.forEach((detail) => { detail.open = shouldOpen; });
      toggleAllFaqs.textContent = shouldOpen ? "Close All" : "View All";
    }
    if (reviewScroll) {
      const section = reviewScroll.closest("[data-science-reviews]");
      setScienceReview(section, Number(section?.dataset.scienceReview || 0) + Number(reviewScroll.dataset.reviewScroll));
    }
    if (scienceReviewGo) setScienceReview(scienceReviewGo.closest("[data-science-reviews]"), Number(scienceReviewGo.dataset.scienceReviewGo));
    if (reviewPageGo || reviewPageChange) {
      const pages = [...document.querySelectorAll("[data-review-page]")];
      const current = Math.max(0, pages.findIndex((page) => page.classList.contains("is-active")));
      const requested = reviewPageGo
        ? Number(reviewPageGo.dataset.reviewPageGo) - 1
        : Math.min(pages.length - 1, Math.max(0, current + Number(reviewPageChange.dataset.reviewPageChange)));
      pages.forEach((page, index) => page.classList.toggle("is-active", index === requested));
      document.querySelectorAll("[data-review-page-go]").forEach((button) => button.classList.toggle("is-active", Number(button.dataset.reviewPageGo) - 1 === requested));
    }
    if (productScrollButton) {
      const track = document.querySelector("[data-product-track]");
      track?.scrollBy({ left: Number(productScrollButton.dataset.productScroll) * track.clientWidth * 0.78, behavior: "smooth" });
    }
    if (nadReviewGo || nadReviewStep) {
      const section = target.closest("[data-nad-reviews]");
      const track = section.querySelector("[data-nad-review-track]");
      const cards = [...track.children];
      const current = Number(section.dataset.reviewActive || 0);
      const requested = nadReviewGo
        ? Number(nadReviewGo.dataset.nadReviewGo)
        : Math.max(0, Math.min(cards.length - 1, current + Number(nadReviewStep.dataset.nadReviewStep)));
      section.dataset.reviewActive = String(requested);
      track.scrollTo({ left: cards[requested].offsetLeft, behavior: "smooth" });
      section.querySelectorAll("[data-nad-review-go]").forEach((button) =>
        button.classList.toggle("active", Number(button.dataset.nadReviewGo) === requested)
      );
      section.querySelectorAll("[data-nad-review-step]").forEach((button) => {
        button.disabled = Number(button.dataset.nadReviewStep) < 0 ? requested === 0 : requested >= cards.length - 4;
      });
    }
    if (homeExpertToggle) {
      const card = homeExpertToggle.closest("[data-home-expert]");
      const active = !card.classList.contains("is-active");
      document.querySelectorAll("[data-home-expert]").forEach((expert) => expert.classList.remove("is-active"));
      card.classList.toggle("is-active", active);
      card.querySelector(".expert-trigger")?.setAttribute("aria-expanded", String(active));
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-pictures-only]")) {
      const section = event.target.closest("[data-nmn-reviews]");
      setNmnReviewPage(section, Number(section.dataset.reviewPage || 1));
    }
  });
  document.addEventListener("submit", async (event) => {
    const reviewForm = event.target.closest("[data-review-form]");
    if (reviewForm) {
      event.preventDefault();
      reviewForm.closest("[data-review-form-content]").hidden = true;
      document.querySelector("[data-review-thanks]").hidden = false;
      return;
    }
    const form = event.target.closest("[data-product-form]");
    if (!form) return;
    event.preventDefault();
    const button = form.querySelector("[data-add-to-cart]");
    const label = form.querySelector("[data-add-label]");
    if (button?.disabled) return;
    button.disabled = true;
    if (label) label.textContent = "ADDING…";
    try {
      const variantId = Number(form.querySelector("[name='id']")?.value || 0);
      const quantity = Number(form.querySelector("[name='quantity']")?.value || 1);
      const sellingPlanId = Number(form.querySelector("[name='selling_plan']:not(:disabled)")?.value || 0) || null;
      await addVariant(variantId, quantity, {}, productFallbackFromForm(form), sellingPlanId);
      renderCart(await getCart());
      openCart();
    } catch (error) {
      console.error(error);
      if (label) {
        label.textContent = error?.message || "PLEASE TRY AGAIN";
        label.title = error?.message || "";
      }
    } finally {
      button.disabled = false;
      window.setTimeout(() => { if (label) label.textContent = "ADD TO CART"; }, 900);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeCart();
    if (flashDialog) flashDialog.hidden = true;
    const reviewDialog = document.querySelector("[data-review-dialog]");
    if (reviewDialog) reviewDialog.hidden = true;
    unlockPage();
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
  updateCollection();

  getCart().then((cart) => {
    renderCart(cart);
    if (document.querySelector("[data-cart-page]")) {
      window.requestAnimationFrame(openCart);
    }
  }).catch(() => {});
})();
