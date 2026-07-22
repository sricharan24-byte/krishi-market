document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated() || !auth.isFarmer()) { window.location.href = '../login.html'; return; }
  loadFarmerProducts();
});

async function loadFarmerProducts() {
  try {
    const response = await fetch(config.endpoints.products.myProducts, { headers: auth.getAuthHeaders() });
    const products = await response.json();
    displayFarmerProducts(products);
  } catch (error) { console.error('Error:', error); }
}

function displayFarmerProducts(products) {
  const tbody = document.getElementById('farmerProductsBody');
  if (!tbody) return;
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;">No products yet</td></tr>';
    return;
  }
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>₹${p.price}/${p.unit}</td>
      <td>${p.quantity} ${p.unit}</td>
      <td class="${p.quantity > 10 ? 'in-stock' : p.quantity > 0 ? 'low-stock' : 'out-of-stock'}">${p.quantity > 10 ? 'In Stock' : p.quantity > 0 ? 'Low Stock' : 'Out of Stock'}</td>
      <td class="action-buttons">
        <button class="btn-view" onclick="viewProduct('${p._id}')">View</button>
        <button class="btn-edit" onclick="editProduct('${p._id}')">Edit</button>
        <button class="btn-delete" onclick="deleteProduct('${p._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function viewProduct(id) { window.location.href = `../product-details.html?id=${id}`; }
function editProduct(id) { window.location.href = `edit-product.html?id=${id}`; }

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  const response = await fetch(config.endpoints.products.byId(id), { method: 'DELETE', headers: auth.getAuthHeaders() });
  if (response.ok) { alert('Product deleted'); loadFarmerProducts(); }
  else { alert('Failed to delete'); }
}