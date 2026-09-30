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

    document.querySelectorAll('.cart-count-bubble span[aria-hidden="true"]').forEach(function (count) {
      count.textContent = String(window.catakorStore.cartCount || 0);
      count.classList.add('catakor-cart-count');
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

      function select(nextIndex) {
        index = (nextIndex + images.length) % images.length;
        image.src = images[index];
        gallery.querySelectorAll('[data-gallery-index]').forEach(function (button) {
          button.classList.toggle('is-active', Number(button.dataset.galleryIndex) === index);
        });
      }
      gallery.querySelectorAll('[data-gallery-index]').forEach(function (button) {
        button.addEventListener('click', function () { select(Number(button.dataset.galleryIndex)); });
      });
      gallery.querySelectorAll('[data-gallery-step]').forEach(function (button) {
        button.addEventListener('click', function () { select(index + Number(button.dataset.galleryStep)); });
      });
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
    initialiseFaqs();
    initialiseScienceReviews();
    initialiseProductGallery();
    initialiseVariationPacks();
    initialiseCollectionTools();
  });

  document.body.addEventListener('wc_fragments_refreshed', updateCommerceLinks);
  document.body.addEventListener('added_to_cart', updateCommerceLinks);
})();
