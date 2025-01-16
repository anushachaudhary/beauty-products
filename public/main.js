document.addEventListener('DOMContentLoaded', () => {
  const cartIcon = document.querySelector('#cart-icon');
  const signupBtn = document.getElementById('signup-btn');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userNameDisplay = document.getElementById('user-name');
  const cartItemsContainer = document.querySelector('.cart-items');

  updateCartQuantity();
  
  // Check if cart items container exists for cart.html page
  if (cartItemsContainer) {
    loadCartItems();
  }
  
  // Check user login status when the page loads
  checkUserLoginStatus();
  
  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Redirect to login or sign-up page
  if (signupBtn) {
    signupBtn.addEventListener('click', () => redirectTo('/login'));
  }
  if (loginBtn) {
    loginBtn.addEventListener('click', () => redirectTo('/login'));
  }
  
  // Cart icon functionality for redirecting to cart page
  if (cartIcon) {
    cartIcon.addEventListener('click', () => redirectTo('cart.html'));
  }
  
  // Setup buttons on the homepage (add to cart and buy)
  if (!cartItemsContainer) {
    setupButtons();  // Setup Add to Cart and Buy buttons for product pages
  }
});

/**
 * Check user login status and update UI accordingly
 */
function checkUserLoginStatus() {
  fetch('/user') // Mock endpoint for user authentication
    .then(response => response.json())
    .then(user => {
      const logoutBtn = document.getElementById('logout-btn');
      const loginBtn = document.getElementById('login-btn');
      const signupBtn = document.getElementById('signup-btn');
      const userNameDisplay = document.getElementById('user-name');

      if (user && user.name) {
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (userNameDisplay) userNameDisplay.textContent = `Welcome, ${user.name}!`;
      } else {
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        if (userNameDisplay) userNameDisplay.textContent = '';
      }
    });
}

/**
 * Logout functionality
 */
function handleLogout() {
  // Clear the cart from localStorage
  localStorage.removeItem('cart');

  // Logout the user and reload the page
  fetch('/logout', { method: 'GET', credentials: 'include' })
    .then(() => {
      updateCartQuantity(); // Reset cart quantity displayed on the cart icon
      window.location.reload();
    });
}

/**
 * Setup Add to Cart and Buy button event listeners
 */
function setupButtons() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const buyButtons = document.querySelectorAll('.buy');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', handleAddToCart);
  });

  buyButtons.forEach(button => {
    button.addEventListener('click', handleBuy);
  });
}

/**
 * Handle Add to Cart functionality
 */
function handleAddToCart(event) {
  fetch('/user')
    .then(response => response.json())
    .then(user => {
      if (!user.name) {
        alert('You need to log in to add items to your cart.');
        event.preventDefault();
        return;
      }

      const button = event.target;
      const product = button.closest('.product');
      if (!product) {
        alert('Product not found.');
        return;
      }

      const productImage = product.querySelector('img').src;
      const productName = product.querySelector('.product-name').textContent;
      const productPrice = product.querySelector('.product-price').textContent;

      const cartItem = { image: productImage, name: productName, price: productPrice, quantity: 1 };

      // Get cart from localStorage, or initialize it if it doesn't exist
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Check if the product already exists in the cart
      const existingItem = cart.find(item => item.name === cartItem.name);

      if (existingItem) {
        // If item exists, increment the quantity
        existingItem.quantity++;
      } else {
        // If it's a new item, add it to the cart
        cart.push(cartItem);
      }

      // Save updated cart back to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));

      alert('Item added to cart!');
      updateCartQuantity();
    });
}

/**
 * Handle Buy functionality
 */
function handleBuy(event) {
  fetch('/user')
    .then(response => response.json())
    .then(user => {
      if (!user.name) {
        alert('You need to log in to make a purchase.');
        event.preventDefault();
        return;
      }
      alert('Purchase successful!');
      // Add logic for purchasing the product here
    });
}

/**
 * Update the quantity displayed on the cart page and in the cart total
 */
function updateCartQuantity() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update the cart icon quantity display
  const quantityDisplay = document.querySelector('.quantity');
  if (quantityDisplay) {
    quantityDisplay.textContent = totalQuantity; // Set the total quantity
  }
}

/**
 * Create a cart item DOM element
 * @param {string} image - Product image URL
 * @param {string} name - Product name
 * @param {string} price - Product price
 * @param {number} quantity - Product quantity
 * @returns {HTMLElement} - Cart item element
 */
function createCartItem(image, name, price, quantity) {
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-item');
  cartItem.innerHTML = `
    <img src="${image}" alt="Product Image">
    <div class="item-details">
      <p class="item-name">${name}</p>
      <p class="item-price">${price}</p>
      <div class="quantity">${quantity}</div>
    </div>
    <button class="remove-btn">Remove</button>
  `;

  const removeButton = cartItem.querySelector('.remove-btn');
  removeButton.addEventListener('click', () => {
    removeItemFromCart(name);
  });

  return cartItem;
}

/**
 * Remove item from cart and update localStorage
 * @param {string} name - The name of the item to remove
 */
function removeItemFromCart(name) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Find the item in the cart
  const itemIndex = cart.findIndex(item => item.name === name);

  if (itemIndex > -1) {
    // If the item exists, decrease its quantity
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity--;
    } else {
      // If quantity is 1, remove the item from the cart
      cart.splice(itemIndex, 1);
    }
    
    // Update cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Reload the cart items to reflect changes
    loadCartItems();
    updateCartQuantity();
  }
}

/**
 * Load Cart Items from localStorage and display them in cart.html
 */
function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.querySelector('.cart-items');

  // Clear existing cart items in the DOM
  cartItemsContainer.innerHTML = '';

  // Display each item in the cart
  cart.forEach(item => {
    const cartItem = createCartItem(item.image, item.name, item.price, item.quantity);
    cartItemsContainer.appendChild(cartItem);
  });

  // Update cart total
  updateCartTotal(cart);
}

/**
 * Update the cart total price on cart.html
 */
function updateCartTotal(cart) {
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('Rs. ', '')) * item.quantity, 0);
  document.getElementById('cart-total').textContent = total;
}

/**
 * Redirect to a given URL
 * @param {string} url - The URL to redirect to
 */
function redirectTo(url) {
  window.location.href = url;
}
