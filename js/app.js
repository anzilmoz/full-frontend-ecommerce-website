(function () {
  const PRODUCTS = [
    {
      id: 'aurora-jacket',
      name: 'Aurora Wind Jacket',
      category: 'Apparel',
      price: 148,
      rating: 4.9,
      badge: 'Best Seller',
      description: 'A lightweight weather layer with a clean silhouette and packable structure.',
      features: ['Water-resistant shell', 'Hidden pocket system', 'Fold-away hood'],
      toneA: '#1d7d71',
      toneB: '#2faca0',
    },
    {
      id: 'drift-tote',
      name: 'Drift Carry Tote',
      category: 'Travel',
      price: 82,
      rating: 4.7,
      badge: 'New Arrival',
      description: 'Roomy enough for a day trip, sharp enough for the office commute.',
      features: ['Laptop sleeve', 'Magnetic top closure', 'Reinforced straps'],
      toneA: '#f26c4f',
      toneB: '#f39b51',
    },
    {
      id: 'sunset-lamp',
      name: 'Sunset Arc Lamp',
      category: 'Home',
      price: 124,
      rating: 4.8,
      badge: 'Featured',
      description: 'Soft ambient lighting with a sculptural profile for modern rooms.',
      features: ['Warm dimmer modes', 'Metal base', 'Low-profile silhouette'],
      toneA: '#9b6ef3',
      toneB: '#f26c4f',
    },
    {
      id: 'grain-board',
      name: 'Grain Desk Board',
      category: 'Desk',
      price: 68,
      rating: 4.6,
      badge: 'Editor Pick',
      description: 'A textured desk mat that frames your laptop, mouse, and everyday tools.',
      features: ['Non-slip backing', 'Easy-clean finish', 'Soft edge stitching'],
      toneA: '#233a63',
      toneB: '#336f9d',
    },
    {
      id: 'kinetic-bottle',
      name: 'Kinetic Bottle',
      category: 'Wellness',
      price: 36,
      rating: 4.5,
      badge: 'Hydration',
      description: 'A streamlined insulated bottle built for desk days and long walks.',
      features: ['Double-wall insulation', 'Leak-safe cap', 'Reusable design'],
      toneA: '#f1ba4f',
      toneB: '#f26c4f',
    },
    {
      id: 'mono-speaker',
      name: 'Mono Desk Speaker',
      category: 'Home',
      price: 96,
      rating: 4.8,
      badge: 'Top Rated',
      description: 'Compact sound with enough warmth to fill a small room or workspace.',
      features: ['Bluetooth pairing', 'Balanced output', 'USB-C charging'],
      toneA: '#0f766e',
      toneB: '#5fd3c3',
    },
    {
      id: 'weekender-cap',
      name: 'Weekender Cap',
      category: 'Apparel',
      price: 42,
      rating: 4.4,
      badge: 'Essential',
      description: 'An easy everyday cap with structure, comfort, and a low-key finish.',
      features: ['Adjustable strap', 'Breathable lining', 'Curved brim'],
      toneA: '#38476b',
      toneB: '#7d8bb8',
    },
    {
      id: 'trail-mug',
      name: 'Trail Mug',
      category: 'Travel',
      price: 28,
      rating: 4.3,
      badge: 'Compact',
      description: 'A grab-and-go mug that keeps drinks steady through the morning rush.',
      features: ['Spill-resistant lid', 'Insulated body', 'Cupholder friendly'],
      toneA: '#b45309',
      toneB: '#f59e0b',
    },
  ];

  const CART_KEY = 'northstar-cart';
  const SUPPORT_KEY = 'northstar-support-requests';
  const page = document.body.dataset.page || '';

  function money(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getProduct(id) {
    return PRODUCTS.find((product) => product.id === id);
  }

  function getCartMap() {
    return readJson(CART_KEY, {});
  }

  function setCartMap(cartMap) {
    writeJson(CART_KEY, cartMap);
    updateCartBadge();
  }

  function addToCart(id, quantity = 1) {
    const cartMap = getCartMap();
    cartMap[id] = (cartMap[id] || 0) + quantity;
    setCartMap(cartMap);
  }

  function updateCartQuantity(id, quantity) {
    const cartMap = getCartMap();
    if (quantity <= 0) {
      delete cartMap[id];
    } else {
      cartMap[id] = quantity;
    }
    setCartMap(cartMap);
  }

  function removeFromCart(id) {
    const cartMap = getCartMap();
    delete cartMap[id];
    setCartMap(cartMap);
  }

  function clearCart() {
    setCartMap({});
  }

  function getCartItems() {
    const cartMap = getCartMap();
    return Object.entries(cartMap)
      .map(([id, quantity]) => {
        const product = getProduct(id);
        if (!product) {
          return null;
        }
        return {
          ...product,
          quantity,
          lineTotal: product.price * quantity,
        };
      })
      .filter(Boolean);
  }

  function getCartCount() {
    return Object.values(getCartMap()).reduce((total, quantity) => total + quantity, 0);
  }

  function buildProductCard(product) {
    const featureList = product.features.map((feature) => `<li>${feature}</li>`).join('');

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-art" style="--tone-a:${product.toneA};--tone-b:${product.toneB}">
          <span class="product-badge">${product.badge}</span>
          <div class="product-art-visual"></div>
        </div>
        <div class="product-card-body">
          <div class="product-meta">
            <span class="category-pill">${product.category}</span>
            <span class="rating-pill">★ ${product.rating.toFixed(1)}</span>
          </div>
          <div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
          </div>
          <ul class="product-features">${featureList}</ul>
          <div class="product-footer">
            <span class="product-price">${money(product.price)}</span>
            <button class="button button-primary add-to-cart" type="button" data-add-to-cart="${product.id}">
              Add to cart
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function updateCartBadge() {
    const badge = document.querySelector('[data-cart-badge]');
    if (badge) {
      badge.textContent = String(getCartCount());
    }
  }

  function updateActiveNav() {
    const current = page;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      const isActive = link.dataset.nav === current;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function renderFeaturedProducts() {
    const grid = document.querySelector('[data-featured-grid]');
    if (!grid) {
      return;
    }
    grid.innerHTML = PRODUCTS.slice(0, 4).map(buildProductCard).join('');
  }

  function initShopPage() {
    const grid = document.querySelector('[data-shop-grid]');
    const search = document.querySelector('#shop-search');
    const sort = document.querySelector('#shop-sort');
    const count = document.querySelector('[data-shop-count]');
    const chips = Array.from(document.querySelectorAll('[data-category]'));
    const state = {
      query: '',
      category: 'All',
      sort: 'featured',
    };

    function applyFilters() {
      const query = state.query.trim().toLowerCase();
      let items = PRODUCTS.filter((product) => {
        const matchesQuery =
          !query ||
          [product.name, product.description, product.category, ...product.features]
            .join(' ')
            .toLowerCase()
            .includes(query);
        const matchesCategory = state.category === 'All' || product.category === state.category;
        return matchesQuery && matchesCategory;
      });

      if (state.sort === 'price-asc') {
        items = items.slice().sort((a, b) => a.price - b.price);
      } else if (state.sort === 'price-desc') {
        items = items.slice().sort((a, b) => b.price - a.price);
      } else if (state.sort === 'rating') {
        items = items.slice().sort((a, b) => b.rating - a.rating);
      } else {
        items = items.slice().sort((a, b) => b.rating - a.rating);
      }

      count.textContent = String(items.length);
      grid.innerHTML = items.length
        ? items.map(buildProductCard).join('')
        : `<div class="empty-state" style="grid-column: 1 / -1"><h3>No products matched your filters.</h3><p>Try a different search term or category.</p></div>`;
    }

    search?.addEventListener('input', (event) => {
      state.query = event.target.value;
      applyFilters();
    });

    sort?.addEventListener('change', (event) => {
      state.sort = event.target.value;
      applyFilters();
    });

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((button) => button.classList.remove('is-active'));
        chip.classList.add('is-active');
        state.category = chip.dataset.category;
        applyFilters();
      });
    });

    applyFilters();
  }

  function renderCartPage() {
    const list = document.querySelector('[data-cart-items]');
    const summary = document.querySelector('[data-cart-summary]');
    const message = document.querySelector('[data-cart-message]');

    if (!list || !summary) {
      return;
    }

    const items = getCartItems();
    const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
    const shipping = subtotal === 0 ? 0 : subtotal >= 250 ? 0 : 16;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    list.innerHTML = items.length
      ? items
          .map(
            (item) => `
              <article class="cart-item" data-cart-id="${item.id}">
                <div class="cart-item-art" style="--tone-a:${item.toneA};--tone-b:${item.toneB}"></div>
                <div>
                  <div class="cart-row-meta">
                    <div>
                      <h3 class="cart-title">${item.name}</h3>
                      <p class="cart-meta">${item.category} · ${money(item.price)} each</p>
                    </div>
                    <strong>${money(item.lineTotal)}</strong>
                  </div>
                  <div class="cart-controls">
                    <button class="qty-button" type="button" data-cart-action="decrease" data-id="${item.id}">-</button>
                    <span aria-label="Quantity">${item.quantity}</span>
                    <button class="qty-button" type="button" data-cart-action="increase" data-id="${item.id}">+</button>
                    <button class="remove-button" type="button" data-cart-action="remove" data-id="${item.id}">Remove</button>
                  </div>
                </div>
                <div class="category-pill">★ ${item.rating.toFixed(1)}</div>
              </article>
            `,
          )
          .join('')
      : `
        <div class="cart-empty">
          <h3>Your cart is empty.</h3>
          <p>Head to the shop page and add a few items to start the checkout flow.</p>
          <a class="button button-primary" href="./shop.html">Browse products</a>
        </div>
      `;

    summary.innerHTML = `
      <h2 class="summary-title">Order summary</h2>
      <div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
      <div class="summary-row"><span>Shipping</span><strong>${shipping === 0 ? 'Free' : money(shipping)}</strong></div>
      <div class="summary-row"><span>Estimated tax</span><strong>${money(tax)}</strong></div>
      <div class="summary-row summary-total"><span>Total</span><strong>${money(total)}</strong></div>
      <p class="summary-note">This checkout is simulated locally and does not contact a payment provider.</p>
      <button class="button button-primary checkout-button" type="button" data-action="checkout" ${items.length ? '' : 'disabled'}>
        Complete checkout
      </button>
      <button class="button button-secondary clear-cart-button" type="button" data-action="clear-cart" ${items.length ? '' : 'disabled'}>
        Clear cart
      </button>
    `;

    if (message) {
      message.hidden = true;
      message.textContent = '';
    }
  }

  function flashCartMessage(text) {
    const message = document.querySelector('[data-cart-message]');
    if (!message) {
      return;
    }
    message.textContent = text;
    message.hidden = false;
  }

  function renderSupportLog() {
    const log = document.querySelector('[data-support-log]');
    if (!log) {
      return;
    }

    const requests = readJson(SUPPORT_KEY, []);
    log.innerHTML = requests.length
      ? requests
          .slice()
          .reverse()
          .map(
            (request) => `
              <article class="support-ticket">
                <div class="support-ticket-meta">
                  <strong>${request.topic}</strong>
                  <span class="category-pill">${request.status}</span>
                </div>
                <p>${request.name} · ${request.email}${request.orderId ? ` · ${request.orderId}` : ''}</p>
                <p>${request.message}</p>
                <p class="cart-meta">Saved ${request.createdAt}</p>
              </article>
            `,
          )
          .join('')
      : `
        <div class="support-empty">
          <h3>No requests yet.</h3>
          <p>Submit the form to store a support ticket in local storage.</p>
        </div>
      `;
  }

  function initSupportPage() {
    const form = document.querySelector('#support-form');
    if (!form) {
      return;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const request = {
        name: String(data.get('name') || '').trim(),
        email: String(data.get('email') || '').trim(),
        orderId: String(data.get('orderId') || '').trim(),
        topic: String(data.get('topic') || '').trim(),
        message: String(data.get('message') || '').trim(),
        status: 'Saved locally',
        createdAt: new Date().toLocaleString(),
      };

      const requests = readJson(SUPPORT_KEY, []);
      requests.push(request);
      writeJson(SUPPORT_KEY, requests);
      form.reset();
      renderSupportLog();
    });

    renderSupportLog();
  }

  function bindGlobalActions() {
    document.addEventListener('click', (event) => {
      const addButton = event.target.closest('[data-add-to-cart]');
      if (addButton) {
        addToCart(addButton.dataset.addToCart);
        return;
      }

      const cartAction = event.target.closest('[data-cart-action]');
      if (!cartAction) {
        const checkoutButton = event.target.closest('[data-action="checkout"]');
        if (checkoutButton) {
          const items = getCartItems();
          if (items.length) {
            flashCartMessage('Checkout complete. Your local cart has been cleared.');
            clearCart();
            renderCartPage();
          }
        }

        const clearButton = event.target.closest('[data-action="clear-cart"]');
        if (clearButton) {
          clearCart();
          renderCartPage();
        }
        return;
      }

      const itemId = cartAction.dataset.id;
      const action = cartAction.dataset.cartAction;
      const cartMap = getCartMap();
      const currentQuantity = cartMap[itemId] || 0;

      if (action === 'increase') {
        updateCartQuantity(itemId, currentQuantity + 1);
      } else if (action === 'decrease') {
        updateCartQuantity(itemId, currentQuantity - 1);
      } else if (action === 'remove') {
        removeFromCart(itemId);
      }

      renderCartPage();
    });
  }

  function bootstrap() {
    updateActiveNav();
    updateCartBadge();

    if (page === 'home') {
      renderFeaturedProducts();
    }

    if (page === 'shop') {
      initShopPage();
    }

    if (page === 'cart') {
      renderCartPage();
    }

    if (page === 'support') {
      initSupportPage();
    }

    bindGlobalActions();
  }

  bootstrap();
})();