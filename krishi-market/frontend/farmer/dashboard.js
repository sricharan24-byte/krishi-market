document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated() || !auth.isFarmer()) { window.location.href = '../login.html'; return; }
  loadStats();
});

async function loadStats() {
  try {
    const prodRes = await fetch(config.endpoints.products.myProducts, { headers: auth.getAuthHeaders() });
    const products = await prodRes.json();
    document.getElementById('totalProducts').textContent = products.length;

    const orderRes = await fetch(config.endpoints.orders.all, { headers: auth.getAuthHeaders() });
    const orders = await orderRes.json();
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('deliveredOrders').textContent = orders.filter(o => o.status === 'delivered').length;
    const revenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.totalPrice, 0);
    document.getElementById('totalRevenue').textContent = `₹${revenue.toFixed(2)}`;
  } catch (error) { console.error('Error:', error); }
}