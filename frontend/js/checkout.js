document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }
  
  loadCheckoutSummary();
  
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', placeOrder);
  }
});

async function loadCheckoutSummary() {
  try {
    const response = await fetch(config.endpoints.cart.get, {
      headers: auth.getAuthHeaders()
    });
    
    if (response.ok) {
      const cart = await response.json();
      displayCheckoutSummary(cart);
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

function displayCheckoutSummary(cart) {
  const checkoutItems = document.getElementById('checkoutItems');
  if (!checkoutItems) return;
  
  if (!cart.items || cart.items.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  
  checkoutItems.innerHTML = cart.items.map(item => {
    const product = item.product || {};
    return `
      <div class="checkout-item">
        <span>${product.name || 'Product'} x ${item.quantity}</span>
        <span>₹${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
  }).join('');
  
  const itemsPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = 0.18 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  
  document.getElementById('checkoutSubtotal').textContent = `₹${itemsPrice.toFixed(2)}`;
  document.getElementById('checkoutShipping').textContent = shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toFixed(2)}`;
  document.getElementById('checkoutTax').textContent = `₹${taxPrice.toFixed(2)}`;
  document.getElementById('checkoutTotal').textContent = `₹${totalPrice.toFixed(2)}`;
}

async function placeOrder(e) {
  e.preventDefault();
  
  const street = document.getElementById('street').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const zipCode = document.getElementById('zipCode').value;
  const country = document.getElementById('country').value;
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  
  try {
    // First get cart items
    const cartResponse = await fetch(config.endpoints.cart.get, {
      headers: auth.getAuthHeaders()
    });
    const cart = await cartResponse.json();
    
    if (!cart.items || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    const orderItems = cart.items.map(item => ({
      product: item.product._id || item.product,
      quantity: item.quantity
    }));
    
    const orderResponse = await fetch(config.endpoints.orders.all, {
      method: 'POST',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify({
        orderItems,
        shippingAddress: { street, city, state, zipCode, country },
        paymentMethod
      })
    });
    
    if (orderResponse.ok) {
      // Clear cart after successful order
      await fetch(config.endpoints.cart.clear, {
        method: 'DELETE',
        headers: auth.getAuthHeaders()
      });
      
      alert('Order placed successfully!');
      window.location.href = 'customer/myorders.html';
    } else {
      const data = await orderResponse.json();
      alert(data.message || 'Failed to place order');
    }
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Error placing order. Please try again.');
  }
}