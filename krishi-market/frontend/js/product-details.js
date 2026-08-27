let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (productId) {
    loadProduct(productId);
    loadReviews(productId);
  }
});

async function loadProduct(productId) {
  try {
    const response = await fetch(config.endpoints.products.byId(productId));
    currentProduct = await response.json();
    displayProduct(currentProduct);
  } catch (error) {
    console.error('Error loading product:', error);
  }
}

function displayProduct(product) {
  document.getElementById('productNameBreadcrumb').textContent = product.name;
  
  const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;
  const imageUrl = (typeof config !== 'undefined' && config.getImageUrl)
    ? config.getImageUrl(firstImage, 'https://via.placeholder.com/500x400?text=No+Image')
    : (firstImage ? `/uploads/${firstImage}` : 'https://via.placeholder.com/500x400?text=No+Image');
  
  const stars = Math.round(product.ratings || 0);
  
  const container = document.getElementById('productDetails');
  container.innerHTML = `
    <div class="product-gallery">
      <div class="main-image">
        <img src="${imageUrl}" alt="${product.name}">
      </div>
    </div>
    <div class="product-info-section">
      <h1>${product.name}</h1>
      <p class="farmer-name">Sold by: ${product.farmer?.name || 'Local Farmer'}</p>
      <p class="product-price">₹${product.price} <span class="product-unit">/ ${product.unit}</span></p>
      ${product.isOrganic ? '<span class="organic-badge">Certified Organic</span>' : ''}
      <div class="rating" style="margin: 15px 0;">
        ${'<i class="fas fa-star"></i>'.repeat(stars)}${'<i class="far fa-star"></i>'.repeat(5-stars)}
        <span>(${product.numReviews || 0} reviews)</span>
      </div>
      <p class="product-description">${product.description}</p>
      <div class="product-meta">
        <span><i class="fas fa-box"></i> ${product.quantity} ${product.unit} available</span>
        <span><i class="fas fa-tag"></i> ${product.category}</span>
      </div>
      <div class="quantity-selector">
        <label>Quantity:</label>
        <div class="qty-controls">
          <button onclick="changeQty(-1)">-</button>
          <span id="qtyDisplay">1</span>
          <button onclick="changeQty(1)">+</button>
        </div>
      </div>
      <div class="product-actions-lg">
        <button class="btn btn-primary" onclick="addToCart('${product._id}')">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
        <button class="btn btn-outline" onclick="addToWishlist('${product._id}')">
          <i class="fas fa-heart"></i> Add to Wishlist
        </button>
      </div>
    </div>
  `;
}

let qty = 1;
function changeQty(delta) {
  qty = Math.max(1, qty + delta);
  document.getElementById('qtyDisplay').textContent = qty;
}

async function addToCart(productId) {
  if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }
  
  try {
    const response = await fetch(config.endpoints.cart.add, {
      method: 'POST',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify({ productId, quantity: qty })
    });
    
    if (response.ok) {
      alert('Added to cart successfully!');
    } else {
      alert('Failed to add to cart');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function addToWishlist(productId) {
  if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }
  
  try {
    const response = await fetch(config.endpoints.wishlist.add, {
      method: 'POST',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify({ productId })
    });
    
    if (response.ok) {
      alert('Added to wishlist!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function loadReviews(productId) {
  try {
    const response = await fetch(config.endpoints.reviews.byProduct(productId));
    const reviews = await response.json();
    displayReviews(reviews);
  } catch (error) {
    console.error('Error loading reviews:', error);
  }
}

function displayReviews(reviews) {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;
  
  if (reviews.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:40px;">No reviews yet.</p>';
    return;
  }
  
  container.innerHTML = reviews.map(review => `
    <div class="review-card">
      <div class="review-header">
        <span class="reviewer-name">${review.user?.name || 'Anonymous'}</span>
        <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
      </div>
      <div class="rating" style="margin-bottom: 10px;">
        ${'<i class="fas fa-star"></i>'.repeat(review.rating)}${'<i class="far fa-star"></i>'.repeat(5-review.rating)}
      </div>
      <p class="review-comment">${review.comment}</p>
    </div>
  `).join('');
}