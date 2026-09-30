(function () {
  'use strict';

  function updateCommerceLinks() {
    if (!window.catakorStore) return;

    document.querySelectorAll('a[href="/cart/"], a[href="/cart"]').forEach(function (link) {
      link.href = window.catakorStore.cartUrl;
    });

    document.querySelectorAll('a[href="/my-account/"], a[href="/my-account"]').forEach(function (link) {
      link.href = window.catakorStore.accountUrl;
    });

    document.querySelectorAll('.catakor-cart-count, .cart-count-bubble span[aria-hidden="true"]').forEach(function (count) {
      var cartCount = Number(window.catakorStore.cartCount || 0);
      count.textContent = String(cartCount);
      count.classList.add('catakor-cart-count');
      count.hidden = cartCount === 0;
    });
  }

  function initialiseCartDrawer() {
    var drawer = document.querySelector('#CartDrawer');
    if (!drawer || !window.catakorStore) return;

    function lockPage() {
      document.body.classList.add('is-locked');
    }

    function unlockPage() {
      document.body.classList.remove('is-locked');
    }

    function openCart() {
      drawer.hidden = false;
      drawer.setAttribute('aria-hidden', 'false');
      lockPage();
      var closeButton = drawer.querySelector('[data-cart-close]');
      if (closeButton) closeButton.focus();
    }

    function closeCart() {
      drawer.hidden = true;
      drawer.setAttribute('aria-hidden', 'true');
      unlockPage();
    }

    function updateCount(count) {
      window.catakorStore.cartCount = Number(count || 0);
      document.querySelectorAll('.catakor-cart-count').forEach(function (node) {
        node.textContent = String(window.catakorStore.cartCount);
        node.hidden = window.catakorStore.cartCount === 0;
      });
    }

    function applyFragments(fragments) {
      Object.keys(fragments || {}).forEach(function (selector) {
        var template = document.createElement('template');
        template.innerHTML = String(fragments[selector]).trim();
        var replacement = template.content.firstElementChild;
        if (!replacement) return;
        document.querySelectorAll(selector).forEach(function (node) {
          node.replaceWith(replacement.cloneNode(true));
        });
      });
      var countNode = document.querySelector('.catakor-cart-count');
      if (countNode) updateCount(Number(countNode.textContent || 0));
    }

    function applyCartPayload(payload) {
      var content = drawer.querySelector('[data-cart-content]');
      var summary = drawer.querySelector('[data-cart-summary]');
      if (content && typeof payload.content === 'string') content.innerHTML = payload.content;
      if (summary && payload.summary) summary.textContent = payload.summary;
      updateCount(payload.count);
    }

    async function changeCartLine(button, quantity) {
      var body = new URLSearchParams();
      body.set('action', 'catakor_update_cart');
      body.set('nonce', window.catakorStore.cartNonce);
      body.set('cart_item_key', button.dataset.cartKey || '');
      body.set('quantity', String(quantity));
      button.disabled = true;
      var response = await fetch(window.catakorStore.ajaxUrl, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: body.toString()
      });
      var result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.data && result.data.message ? result.data.message : 'Unable to update the shopping bag.');
      applyCartPayload(result.data);
    }

    document.addEventListener('click', function (event) {
      var openButton = event.target.closest('[data-cart-open], #cart-icon-bubble, .menu-drawer__topbar-icon--cart');
      var closeButton = event.target.closest('[data-cart-close]');
      var quantityButton = event.target.closest('[data-cart-quantity]');
      var removeButton = event.target.closest('[data-cart-remove]');

      if (openButton) {
        event.preventDefault();
        openCart();
        return;
      }
      if (closeButton || event.target === drawer) {
        event.preventDefault();
        closeCart();
        return;
      }
      if (quantityButton || removeButton) {
        event.preventDefault();
        var button = quantityButton || removeButton;
        var quantity = removeButton ? 0 : Number(button.dataset.cartQuantity || 0);
        changeCartLine(button, quantity).catch(function (error) {
          button.disabled = false;
          window.console.error(error);
        });
      }
    });

    document.addEventListener('submit', function (event) {
      var form = event.target.closest('[data-woo-product-form]');
      if (!form) return;
      event.preventDefault();
      var button = form.querySelector('[type="submit"]');
      var label = form.querySelector('[data-add-label]');
      if (button && button.disabled) return;
      if (button) button.disabled = true;
      if (label) label.textContent = 'ADDING…';

      fetch(window.catakorStore.addToCartUrl, {
        method: 'POST',
        credentials: 'same-origin',
        body: new FormData(form)
      })
        .then(function (response) { return response.json(); })
        .then(function (result) {
          if (result.error) throw new Error('This selection could not be added to the shopping bag.');
          applyFragments(result.fragments || {});
          openCart();
        })
        .catch(function (error) {
          window.console.error(error);
          if (label) label.textContent = 'PLEASE TRY AGAIN';
        })
        .finally(function () {
          if (button) button.disabled = false;
          window.setTimeout(function () { if (label) label.textContent = 'ADD TO CART'; }, 1000);
        });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !drawer.hidden) closeCart();
    });
  }

  function initialiseDetailsMenus() {
    document.querySelectorAll('details').forEach(function (details) {
      var summary = details.querySelector(':scope > summary');
      if (details.classList.contains('menu-drawer-container') && summary) {
        summary.addEventListener('click', function (event) {
          event.preventDefault();
          details.open = !details.open;
        });
      }

      details.addEventListener('toggle', function () {
        if (details.classList.contains('menu-drawer-container')) {
          details.classList.toggle('menu-opening', details.open);
        }
        if (summary) summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
        if (!details.open) return;
        details.parentElement.querySelectorAll(':scope > details[open]').forEach(function (other) {
          if (other !== details) other.open = false;
        });
      });
    });
  }

  function initialiseFaqs() {
    document.querySelectorAll('[data-toggle-all-faqs]').forEach(function (button) {
      button.addEventListener('click', function () {
        var container = document.querySelector('[data-about-faqs]');
        if (!container) return;
        var details = Array.from(container.querySelectorAll('details'));
        var shouldOpen = details.some(function (item) { return !item.open; });
        details.forEach(function (item) { item.open = shouldOpen; });
        button.textContent = shouldOpen ? 'Close All' : 'View All';
      });
    });
  }

  function initialiseScienceReviews() {
    document.querySelectorAll('[data-science-reviews]').forEach(function (section) {
      var track = section.querySelector('[data-review-track]');
      var cards = Array.from(section.querySelectorAll('[data-science-review-card]'));
      var dots = Array.from(section.querySelectorAll('[data-science-review-go]'));
      if (!track || !cards.length) return;

      function goTo(index) {
        var safeIndex = Math.max(0, Math.min(index, cards.length - 1));
        cards[safeIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === safeIndex);
          if (dotIndex === safeIndex) dot.setAttribute('aria-current', 'true');
          else dot.removeAttribute('aria-current');
        });
      }

      section.querySelectorAll('[data-review-scroll]').forEach(function (button) {
        button.addEventListener('click', function () {
          var left = track.scrollLeft + Number(button.dataset.reviewScroll || 1) * (cards[0].getBoundingClientRect().width + 20);
          track.scrollTo({ left: left, behavior: 'smooth' });
        });
      });
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () { goTo(Number(dot.dataset.scienceReviewGo || 0)); });
      });
    });
  }

  function initialiseProductGallery() {
    document.querySelectorAll('[data-secondary-gallery]').forEach(function (gallery) {
      var data = gallery.querySelector('[data-secondary-gallery-json]');
      var image = gallery.querySelector('[data-secondary-main-image]');
      if (!data || !image) return;
      var images;
      try { images = JSON.parse(data.textContent); } catch (error) { return; }
      var index = 0;
      var thumbnailStart = 0;
      var thumbnails = Array.from(gallery.querySelectorAll('[data-gallery-index]'));
      var visibleThumbnails = 6;

      function renderThumbnails() {
        thumbnails.forEach(function (button, buttonIndex) {
          button.hidden = buttonIndex < thumbnailStart || buttonIndex >= thumbnailStart + visibleThumbnails;
        });
        gallery.querySelectorAll('[data-thumbnail-shift]').forEach(function (button) {
          var direction = Number(button.dataset.thumbnailShift || 0);
          button.disabled = direction < 0 ? thumbnailStart === 0 : thumbnailStart >= Math.max(0, thumbnails.length - visibleThumbnails);
        });
      }

      function select(nextIndex) {
        index = (nextIndex + images.length) % images.length;
        image.src = images[index];
        if (index < thumbnailStart) thumbnailStart = index;
        if (index >= thumbnailStart + visibleThumbnails) thumbnailStart = index - visibleThumbnails + 1;
        thumbnails.forEach(function (button) {
          button.classList.toggle('is-active', Number(button.dataset.galleryIndex) === index);
        });
        renderThumbnails();
      }
      thumbnails.forEach(function (button) {
        button.addEventListener('click', function () { select(Number(button.dataset.galleryIndex)); });
      });
      gallery.querySelectorAll('[data-gallery-step]').forEach(function (button) {
        button.addEventListener('click', function () { select(index + Number(button.dataset.galleryStep)); });
      });
      gallery.querySelectorAll('[data-thumbnail-shift]').forEach(function (button) {
        button.addEventListener('click', function () {
          thumbnailStart = Math.max(0, Math.min(thumbnailStart + Number(button.dataset.thumbnailShift || 0), Math.max(0, thumbnails.length - visibleThumbnails)));
          renderThumbnails();
        });
      });
      renderThumbnails();
    });
  }

  function initialiseVariationPacks() {
    document.querySelectorAll('[data-product-root]').forEach(function (product) {
      var form = product.querySelector('[data-woo-product-form]');
      if (!form) return;
      product.querySelectorAll('[data-secondary-pack]').forEach(function (button) {
        button.addEventListener('click', function () {
          product.querySelectorAll('[data-secondary-pack]').forEach(function (item) {
            item.classList.toggle('is-selected', item === button);
            item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
          });
          var variationInput = form.querySelector('[data-variation-input]');
          if (variationInput) variationInput.value = button.dataset.variationId || '';
          var attributes;
          try { attributes = JSON.parse(button.dataset.attributes || '{}'); } catch (error) { attributes = {}; }
          Object.keys(attributes).forEach(function (name) {
            var input = form.querySelector('[data-variation-attribute="' + CSS.escape(name) + '"]');
            if (!input) {
              input = document.createElement('input');
              input.type = 'hidden';
              input.name = name;
              input.dataset.variationAttribute = name;
              form.appendChild(input);
            }
            input.value = attributes[name];
          });
          var price = Number(button.dataset.total || 0).toFixed(2);
          product.querySelectorAll('[data-secondary-total], [data-add-price]').forEach(function (node) {
            node.textContent = '$' + price;
          });
          var capsuleCount = product.querySelector('[data-selected-capsules]');
          if (capsuleCount && button.dataset.jars) capsuleCount.textContent = String(Number(button.dataset.jars) * 60) + ' Capsules';
        });
      });
    });
  }

  function initialiseCollectionTools() {
    var toggle = document.querySelector('[data-filter-toggle]');
    var menu = document.querySelector('[data-filter-menu]');
    var grid = document.querySelector('[data-collection-grid]');
    var sort = document.querySelector('[data-collection-sort]');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        menu.hidden = !menu.hidden;
        toggle.setAttribute('aria-expanded', menu.hidden ? 'false' : 'true');
      });
      menu.addEventListener('change', function () {
        var value = menu.querySelector('input:checked').value;
        grid.querySelectorAll('[data-collection-card]').forEach(function (card) {
          card.hidden = value === 'in-stock' ? card.dataset.available !== 'true' : value === 'out-of-stock' ? card.dataset.available === 'true' : false;
        });
      });
    }
    if (sort && grid) {
      sort.addEventListener('change', function () {
        var cards = Array.from(grid.querySelectorAll('[data-collection-card]'));
        cards.sort(function (a, b) {
          if (sort.value === 'a-z') return a.dataset.title.localeCompare(b.dataset.title);
          if (sort.value === 'z-a') return b.dataset.title.localeCompare(a.dataset.title);
          return Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder);
        }).forEach(function (card) { grid.appendChild(card); });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateCommerceLinks();
    initialiseDetailsMenus();
	initialiseCartDrawer();
    initialiseFaqs();
    initialiseScienceReviews();
    initialiseProductGallery();
    initialiseVariationPacks();
    initialiseCollectionTools();
  });

  document.body.addEventListener('wc_fragments_refreshed', updateCommerceLinks);
  document.body.addEventListener('added_to_cart', updateCommerceLinks);
})();
