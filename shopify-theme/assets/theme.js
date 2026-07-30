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
    const response = await fetch(`${root}cart/change.js`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ id: key, quantity })
    });
    if (!response.ok) throw new Error("Unable to update cart");
    renderCart(await response.json());
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

  getCart().then(renderCart).catch(() => {});
})();
