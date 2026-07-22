document.addEventListener('DOMContentLoaded', () => {
  if (auth.isAuthenticated()) {
    loadCart();
  }
  
  const clearCartBtn = document.getElementById('clearCartBtn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }
});

async function loadCart() {
  try {
    const response = await fetch(config.endpoints.cart.get, {
      headers: auth.getAuthHeaders()
    });
    
    if (response.ok) {
      const cart = await response.json();
      displayCart(cart);
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

function displayCart(cart) {
  const emptyCart = document.getElementById('emptyCart');
  const cartContent = document.getElementById('cartContent');
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  
  if (!cart.items || cart.items.length === 0) {
    if (emptyCart) emptyCart.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    if (cartCount) cartCount.textContent = '0';
    return;
  }
  
  if (emptyCart) emptyCart.style.display = 'none';
  if (cartContent) cartContent.style.display = 'block';
  if (cartCount) cartCount.textContent = cart.items.length;
  
  if (cartItems) {
    cartItems.innerHTML = cart.items.map(item => {
      const product = item.product || {};
      const imageUrl = product.images && product.images.length > 0 
        ? `http://localhost:5000/uploads/${product.images[0]}` 
        : 'https://via.placeholder.com/100?text=No+Image';
      
      return `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${imageUrl}" alt="${product.name || 'Product'}">
          </div>
          <div class="cart-item-info">
            <h3>${product.name || 'Product'}</h3>
            <p>₹${item.price} / ${product.unit || 'unit'}</p>
          </div>
          <div class="cart-item-quantity">
            <button onclick="updateCartItem('${item.product}','${item.quantity - 1}')">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartItem('${item.product}','${item.quantity + 1}')">+</button>
          </div>
          <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
          <div class="cart-item-remove" onclick="removeFromCart('${item.product}')">
            <i class="fas fa-trash"></i>
          </div>
        </div>
      `;
    }).join('');
  }
  
  // Update summary
  const itemsPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = 0.18 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  
  document.getElementById('subtotal').textContent = `₹${itemsPrice.toFixed(2)}`;
  document.getElementById('shipping').textContent = shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toFixed(2)}`;
  document.getElementById('tax').textContent = `₹${taxPrice.toFixed(2)}`;
  document.getElementById('total').textContent = `₹${totalPrice.toFixed(2)}`;
}

async function updateCartItem(productId, quantity) {
  if (quantity < 1) {
    removeFromCart(productId);
    return;
  }
  
  try {
    const response = await fetch(config.endpoints.cart.update(productId), {
      method: 'PUT',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify({ quantity: parseInt(quantity) })
    });
    
    if (response.ok) {
      loadCart();
    }
  } catch (error) {
    console.error('Error updating cart:', error);
  }
}

async function removeFromCart(productId) {
  try {
    const response = await fetch(config.endpoints.cart.remove(productId), {
      method: 'DELETE',
      headers: auth.getAuthHeaders()
    });
    
    if (response.ok) {
      loadCart();
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
}

async function clearCart() {
  if (!confirm('Are you sure you want to clear your cart?')) return;
  
  try {
    const response = await fetch(config.endpoints.cart.clear, {
      method: 'DELETE',
      headers: auth.getAuthHeaders()
    });
    
    if (response.ok) {
      loadCart();
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
}