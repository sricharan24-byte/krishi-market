document.addEventListener('DOMContentLoaded', async () => {
  if (!auth.isAuthenticated() || !auth.isAdmin()) { window.location.href = '../login.html'; return; }
  try {
    const usersRes = await fetch(config.endpoints.users.all, { headers: auth.getAuthHeaders() });
    const users = await usersRes.json();
    document.getElementById('totalFarmers').textContent = users.filter(u => u.role === 'farmer').length;

    const orderRes = await fetch(`${config.endpoints.orders.all}/all`, { headers: auth.getAuthHeaders() });
    const orders = await orderRes.json();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toFixed(2)}`;
    document.getElementById('avgOrderValue').textContent = `₹${avgOrderValue.toFixed(2)}`;
  } catch (error) { console.error('Error:', error); }
});