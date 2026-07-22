document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated() || !auth.isFarmer()) { window.location.href = '../login.html'; return; }
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (productId) { loadProduct(productId); document.getElementById('editProductForm').addEventListener('submit', (e) => updateProduct(e, productId)); }
});

async function loadProduct(id) {
  const response = await fetch(config.endpoints.products.byId(id));
  const product = await response.json();
  document.getElementById('editName').value = product.name;
  document.getElementById('editDescription').value = product.description;
  document.getElementById('editCategory').value = product.category;
  document.getElementById('editPrice').value = product.price;
  document.getElementById('editUnit').value = product.unit;
  document.getElementById('editQuantity').value = product.quantity;
  document.getElementById('editOrganic').checked = product.isOrganic;
}

async function updateProduct(e, id) {
  e.preventDefault();
  const formData = new FormData();
  formData.append('name', document.getElementById('editName').value);
  formData.append('description', document.getElementById('editDescription').value);
  formData.append('category', document.getElementById('editCategory').value);
  formData.append('price', document.getElementById('editPrice').value);
  formData.append('unit', document.getElementById('editUnit').value);
  formData.append('quantity', document.getElementById('editQuantity').value);
  formData.append('isOrganic', document.getElementById('editOrganic').checked);
  const files = document.getElementById('editImages').files;
  for (let i = 0; i < files.length; i++) formData.append('images', files[i]);

  const response = await fetch(config.endpoints.products.byId(id), {
    method: 'PUT', headers: { 'Authorization': `Bearer ${auth.getToken()}` }, body: formData
  });
  if (response.ok) { alert('Product updated!'); window.location.href = 'products.html'; }
  else { const d = await response.json(); alert(d.message || 'Update failed'); }
}