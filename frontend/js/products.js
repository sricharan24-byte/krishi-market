let allProducts = [];
let currentPage = 1;
const productsPerPage = 12;

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setupFilters();
});

async function loadProducts() {
  try {
    const response = await fetch(config.endpoints.products.all);
    allProducts = await response.json();
    displayProducts();
    setupPagination();
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function setupFilters() {
  const applyBtn = document.getElementById('applyFilters');
  const clearBtn = document.getElementById('clearFilters');
  const sortBy = document.getElementById('sortBy');
  
  if (applyBtn) applyBtn.addEventListener('click', () => { currentPage = 1; displayProducts(); });
  if (clearBtn) clearBtn.addEventListener('click', clearFilters);
  if (sortBy) sortBy.addEventListener('change', () => { currentPage = 1; displayProducts(); });
}

function getFilteredProducts() {
  let filtered = [...allProducts];
  
  const category = document.getElementById('categoryFilter')?.value;
  const minPrice = parseFloat(document.getElementById('minPrice')?.value);
  const maxPrice = parseFloat(document.getElementById('maxPrice')?.value);
  const organicOnly = document.getElementById('organicFilter')?.checked;
  const sortBy = document.getElementById('sortBy')?.value;
  
  // Apply URL params
  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get('category');
  if (urlCategory) filtered = filtered.filter(p => p.category === urlCategory);
  else if (category) filtered = filtered.filter(p => p.category === category);
  
  if (minPrice) filtered = filtered.filter(p => p.price >= minPrice);
  if (maxPrice) filtered = filtered.filter(p => p.price <= maxPrice);
  if (organicOnly) filtered = filtered.filter(p => p.isOrganic);
  
  if (sortBy) {
    switch(sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.ratings - a.ratings); break;
      default: filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }
  
  return filtered;
}

function displayProducts() {
  const container = document.getElementById('productsContainer') || document.getElementById('featuredProducts');
  if (!container) return;
  
  const filtered = getFilteredProducts();
  const startIdx = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filtered.slice(startIdx, startIdx + productsPerPage);
  
  const countEl = document.getElementById('productsCount');
  if (countEl) countEl.textContent = `Showing ${paginatedProducts.length} of ${filtered.length} products`;
  
  container.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');
  
  // Add event listeners for add to cart buttons
  container.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(btn.dataset.id);
    });
  });
}

function createProductCard(product) {
  const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;
  const imageUrl = (typeof config !== 'undefined' && config.getImageUrl)
    ? config.getImageUrl(firstImage)
    : (firstImage ? `/uploads/${firstImage}` : 'https://via.placeholder.com/300x200?text=No+Image');
  
  const stars = Math.round(product.ratings || 0);
  
  return `
    <div class="product-card">
      <a href="product-details.html?id=${product._id}">
        <div class="product-image">
          <img src="${imageUrl}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="farmer">${product.farmer?.name || 'Local Farmer'}</p>
          <p class="price">₹${product.price} <span class="unit">/ ${product.unit}</span></p>
          <div class="rating">
            ${'<i class="fas fa-star"></i>'.repeat(stars)}${'<i class="far fa-star"></i>'.repeat(5-stars)}
            <span>(${product.numReviews || 0})</span>
          </div>
          ${product.isOrganic ? '<span class="organic-badge">Organic</span>' : ''}
          <div class="product-actions">
            <button class="btn btn-primary btn-sm add-to-cart" data-id="${product._id}">Add to Cart</button>
            <a href="product-details.html?id=${product._id}" class="btn btn-outline btn-sm">View</a>
          </div>
        </div>
      </a>
    </div>
  `;
}

function setupPagination() {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  
  const filtered = getFilteredProducts();
  const totalPages = Math.ceil(filtered.length / productsPerPage);
  
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === currentPage ? 'active' : '';
    btn.addEventListener('click', () => {
      currentPage = i;
      displayProducts();
      setupPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    pagination.appendChild(btn);
  }
}

function clearFilters() {
  document.getElementById('categoryFilter').value = '';
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.getElementById('organicFilter').checked = false;
  currentPage = 1;
  displayProducts();
  setupPagination();
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
      body: JSON.stringify({ productId, quantity: 1 })
    });
    
    if (response.ok) {
      const data = await response.json();
      const cartCount = document.getElementById('cartCount');
      if (cartCount) cartCount.textContent = data.items.length;
      alert('Product added to cart!');
    } else {
      alert('Failed to add to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}