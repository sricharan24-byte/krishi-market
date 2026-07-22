document.addEventListener('DOMContentLoaded', async () => {
  if (!auth.isAuthenticated() || !auth.isAdmin()) { window.location.href = '../login.html'; return; }
  const res = await fetch(config.endpoints.products.all);
  const products = await res.json();
  const tbody = document.getElementById('adminProductsBody');
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;">No products</td></tr>';
    return;
  }
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.farmer?.name || 'Unknown'}</td>
      <td>${p.category}</td>
      <td>₹${p.price}/${p.unit}</td>
      <td class="${p.quantity > 0 ? 'in-stock' : 'out-of-stock'}">${p.quantity > 0 ? 'In Stock' : 'Out of Stock'}</td>
      <td class="action-buttons">
        <button class="btn-view">View</button>
        <button class="btn-delete" onclick="adminDeleteProduct('${p._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
});
async function adminDeleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  const res = await fetch(config.endpoints.products.byId(id), { method: 'DELETE', headers: auth.getAuthHeaders() });
  if (res.ok) location.reload();
}