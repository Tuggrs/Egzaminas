// import App from "./App";

let products = [];
let cart = [];
let currentCategory = "all";

async function loadProducts() {
  try {
    const response = await fetch("http://localhost:3001/users");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    products = await response.json();
    renderFeaturedProducts();
    renderProducts();
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function renderFeaturedProducts() {
  const container = document.getElementById("featuredProducts");
  const featured = products.slice(0, 2);

  container.innerHTML = featured
    .map(
      (product, index) => `
    <div class="featured-product">
        <div class="product-badge ${index === 1 ? "dark" : ""}">Trending</div>

        <button class="wishlist-btn" onclick="toggleWishlist(${product.ID})">
            <i class="far fa-heart"></i>
        </button>

        <img src="${product.image}" alt="${product.name}" class="product-image" />
        <div class="product-info">
            <h4>${product.name.substring(0, 45)}...}</h4>
            <button class="product-price ${index === 1 ? "dark" : ""}" onclick="addToCart(${product.ID})">
            $${product.price}
            </button>
        </div>
    </div>`,
    )
    .join("");
}

function renderProducts() {
  const container = document.getElementById("productsGrid");
  const filteredProducts =
    currentCategory === "all"
      ? products
      : products.filter((p) => p.category === currentCategory);

  if (filteredProducts.length === 0) {
    container.innerHTML = `<div class="loading"><p>No products found</p></div>`;
    return;
  }

  container.innerHTML = filteredProducts
    .map(
      (product) => `
            <div class="product-card">
                <button class="wishlist-btn" onclick="toggleWishlist(${product.ID})">
                    <i class="far fa-heart"></i>
                </button>

                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h4>${product.name.substring(0, 45)}...</h4>
                    <p style="color: #64748b; font-size: 0.9rem; margin: 0.5rem 0;">
                    $${product.price}
                    </p>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.ID})">
                    Add to Cart
                    </button>
                </div>
            </div>

            `,
    )
    .join("");
}

//Cart functions

function addToCart(productId) {
  const product = products.find((p) => p.ID === productId);
  const existingItem = cart.find((item) => item.ID === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  showNotification(`${product.name} Added to cart!`);
  renderCheckout();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.ID !== productId);
  updateCartUI();
  renderCheckout();
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.ID === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartUI();
      renderCheckout();
    }
  }
}

function toggleWishlist(productId) {
  const btn = document.querySelector(
    `[onclick="toggleWishlist(${productId})"] i`,
  );

  if (btn.classList.contains("far")) {
    btn.className = "fas fa-heart";
    btn.style.color = "red";
  } else {
    btn.className = "far fa-heart";
    btn.style.color = "";
  }
}

function updateCartUI() {
  const badge = document.getElementById("cartBadge");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? "flex" : "none";
}

function showCheckout() {
  const overlay = document.getElementById("checkoutOverlay");
  overlay.style.display = "flex";
  renderCheckout();
}

function renderCheckout() {
  const content = document.getElementById("checkoutContent");
  const footer = document.getElementById("checkoutFooter");
  const totalAmount = document.getElementById("totalAmount");

  if (cart.length === 0) {
    content.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #e2e8f0; margin-bottom: 1rem;"></i>
        <p>Your cart is empty</p>
      </div>
    `;
    footer.style.display = "none";
    return;
  }

  content.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name.substring(0, 45)}...</div>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          <div class="quantity-controls">
            <button class="qty-btn" onclick="updateQuantity(${item.ID}, -1)">-</button>
            <span style="padding: 0 0.5rem;">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${item.ID}, 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart(${item.ID})">Remove</button>
          </div>
        </div>
      </div>
    `,
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalAmount.textContent = `Total: $${total.toFixed(2)}`;
  footer.style.display = "block";
}

// Add Product Form functions

function showAddProductForm() {
  const overlay = document.getElementById("addProductOverlay");
  overlay.style.display = "flex";
  renderAddProductForm();
}

  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", showCheckout);
  }

function renderAddProductForm() {
  const content = document.getElementById("checkoutContent");
}

// if (cart.length === 0) {
//   content.innerHTML = `
//     <div class="empty-cart">
//       <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #e2e8f0; margin-bottom: 1rem;"></i>
//       <p>Your cart is empty</p>
//     </div>
//   `;
//   footer.style.display = "none";
//   return;
// }

// content.innerHTML = cart
//   .map(
//     (item) => `
//     <div class="cart-item">
//       <img src="${item.image}" alt="${item.name}">
//       <div class="cart-item-info">
//         <div class="cart-item-title">${item.name.substring(0, 45)}...</div>
//         <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
//         <div class="quantity-controls">
//           <button class="qty-btn" onclick="updateQuantity(${item.ID}, -1)">-</button>
//           <span style="padding: 0 0.5rem;">${item.quantity}</span>
//           <button class="qty-btn" onclick="updateQuantity(${item.ID}, 1)">+</button>
//           <button class="remove-btn" onclick="removeFromCart(${item.ID})">Remove</button>
//         </div>
//       </div>
//     </div>
//   `
//   )
//   .join("");

// const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
// totalAmount.textContent = `Total: $${total.toFixed(2)}`
// footer.style.display = "block";
// }

// Notification function

function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.background = "#3b82f6";
  notification.style.color = "white";
  notification.style.padding = "0.75rem 1rem";
  notification.style.borderRadius = "8px";
  notification.style.fontWeight = "600";
  notification.style.zIndex = "2000";
  notification.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 2000);
}

function setupEventListeners() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentCategory = tab.dataset.category;
      renderProducts();
    });
  });

  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", showCheckout);
  }

  const closeCheckoutBtn = document.getElementById("closeCheckout");
  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener("click", () => {
      const overlay = document.getElementById("checkoutOverlay");
      if (overlay) overlay.style.display = "none";
    });
  }

  const checkoutOverlay = document.getElementById("checkoutOverlay");
  if (checkoutOverlay) {
    checkoutOverlay.addEventListener("click", (e) => {
      if (e.target.id === "checkoutOverlay") {
        checkoutOverlay.style.display = "none";
      }
    });
  }

  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showNotification("Your cart is empty!");
      } else {
        showNotification("Proceeding to checkout...");
      }
    });
  }

  const addProductBtn = document.getElementById("addProductBtn");
  if (addProductBtn) {
    addProductBtn.addEventListener("click", showAddProductForm);
  }

  const closeAddProductBtn = document.getElementById("closeAddProduct");
  if (closeAddProductBtn) {
    closeAddProductBtn.addEventListener("click", () => {
      const overlay = document.getElementById("addProductOverlay");
      if (overlay) overlay.style.display = "none";
    });
  }

    const closeAddProductBtnAfterSubmit = document.getElementById("closeAddProductAfterSubmit");
  if (closeAddProductBtnAfterSubmit) {
    closeAddProductBtnAfterSubmit.addEventListener("click", () => {
      const overlay = document.getElementById("addProductOverlay");
      if (overlay) overlay.style.display = "none";
    });
  }

  const addProductOverlay = document.getElementById("addProductOverlay");
  if (addProductOverlay) {
    addProductOverlay.addEventListener("click", (e) => {
      if (e.target.id === "addProductOverlay") {
        addProductOverlay.style.display = "none";
      }
    });
  }
}

let shopInitialized = false;

function initShop() {
  if (shopInitialized) return;
  shopInitialized = true;
  loadProducts();
  setupEventListeners();
}

window.initShop = initShop;
