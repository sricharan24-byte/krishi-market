document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated() || !auth.isFarmer()) { window.location.href = '../login.html'; return; }
  document.getElementById('addProductForm').addEventListener('submit', addProduct);
});

async function addProduct(e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append('name', document.getElementById('productName').value);
  formData.append('description', document.getElementById('productDescription').value);
  formData.append('category', document.getElementById('productCategory').value);
  formData.append('price', document.getElementById('productPrice').value);
  formData.append('unit', document.getElementById('productUnit').value);
  formData.append('quantity', document.getElementById('productQuantity').value);
  formData.append('isOrganic', document.getElementById('productOrganic').checked);

  const files = document.getElementById('productImages').files;
  for (let i = 0; i < files.length; i++) formData.append('images', files[i]);

  try {
    const token = auth.getToken();
    const response = await fetch(config.endpoints.products.all, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (response.ok) {
      alert('Product added successfully!');
      window.location.href = 'products.html';
    } else {
      const data = await response.json();
      alert(data.message || 'Failed to add product');
    }
  } catch (error) { console.error('Error:', error); alert('Error adding product'); }
}