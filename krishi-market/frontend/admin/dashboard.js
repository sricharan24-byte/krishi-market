document.addEventListener('DOMContentLoaded', async () => {
  if (!auth.isAuthenticated() || !auth.isAdmin()) { window.location.href = '../login.html'; return; }
  try {
    const usersRes = await fetch(config.endpoints.users.all, { headers: auth.getAuthHeaders() });
    const users = await usersRes.json();
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalFarmers').textContent = users.filter(u => u.role === 'farmer').length;

    const prodRes = await fetch(config.endpoints.products.all);
    const products = await prodRes.json();
    document.getElementById('totalProducts').textContent = products.length;

    const orderRes = await fetch(config.endpoints.orders.all, { headers: auth.getAuthHeaders() });
    const orders = await orderRes.json();
    document.getElementById('totalOrders').textContent = orders.length;
  } catch (error) { console.error('Error:', error); }
});