document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated() || !auth.isFarmer()) { window.location.href = '../login.html'; return; }
  loadOrders();
});

async function loadOrders() {
  try {
    const response = await fetch(config.endpoints.orders.all, { headers: auth.getAuthHeaders() });
    const orders = await response.json();
    displayOrders(orders);
  } catch (error) { console.error('Error:', error); }
}

function displayOrders(orders) {
  const tbody = document.getElementById('farmerOrdersBody');
  if (!tbody) return;
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;">No orders received</td></tr>';
    return;
  }
  tbody.innerHTML = orders.map(order => `
    <tr>
      <td>#${order._id.slice(-8)}</td>
      <td>${order.user?.name || 'Customer'}</td>
      <td>${order.orderItems.length} items</td>
      <td>₹${order.totalPrice.toFixed(2)}</td>
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td><span class="status-badge status-${order.status}">${order.status}</span></td>
      <td><button class="btn btn-sm btn-outline" onclick="viewOrder('${order._id}')">View</button></td>
    </tr>
  `).join('');
}

function viewOrder(id) { window.location.href = `../customer/orders.html?id=${id}`; }