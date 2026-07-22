document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated()) { window.location.href = '../login.html'; return; }
  loadWishlist();
});

async function loadWishlist() {
  try {
    const response = await fetch(config.endpoints.wishlist.get, { headers: auth.getAuthHeaders() });
    const wishlist = await response.json();
    displayWishlist(wishlist.products || []);
  } catch (error) { console.error('Error:', error); }
}

function displayWishlist(products) {
  const container = document.getElementById('wishlistContainer');
  if (!container) return;
  if (products.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:40px;grid-column:1/-1;">Your wishlist is empty</p>';
    return;
  }
  container.innerHTML = products.map(product => `
    <div class="product-card">
      <a href="../product-details.html?id=${product._id}">
        <div class="product-image"><img src="${product.images?.[0] ? 'http://localhost:5000/uploads/'+product.images[0] : 'https://via.placeholder.com/300?text=No+Image'}" alt="${product.name}"></div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="price">₹${product.price} <span class="unit">/ ${product.unit}</span></p>
          <div class="product-actions">
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();addToCart('${product._id}')">Add to Cart</button>
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();removeFromWishlist('${product._id}')">Remove</button>
          </div>
        </div>
      </a>
    </div>
  `).join('');
}

async function addToCart(productId) {
  const response = await fetch(config.endpoints.cart.add, {
    method: 'POST', headers: auth.getAuthHeaders(),
    body: JSON.stringify({ productId, quantity: 1 })
  });
  if (response.ok) alert('Added to cart!');
}

async function removeFromWishlist(productId) {
  const response = await fetch(config.endpoints.wishlist.remove(productId), {
    method: 'DELETE', headers: auth.getAuthHeaders()
  });
  if (response.ok) loadWishlist();
}