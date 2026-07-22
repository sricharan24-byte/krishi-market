document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated()) { window.location.href = '../login.html'; return; }
  loadAllOrders();
});

async function loadAllOrders() {
  try {
    const response = await fetch(config.endpoints.orders.all, { headers: auth.getAuthHeaders() });
    const orders = await response.json();
    displayAllOrders(orders);
  } catch (error) { console.error('Error:', error); }
}

function displayAllOrders(orders) {
  const tbody = document.getElementById('allOrdersBody');
  if (!tbody) return;
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;">No orders found</td></tr>';
    return;
  }
  tbody.innerHTML = orders.map(order => `
    <tr>
      <td>#${order._id.slice(-8)}</td>
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td>${order.orderItems.length} items</td>
      <td>₹${order.totalPrice.toFixed(2)}</td>
      <td><span class="status-badge status-${order.status}">${order.status}</span></td>
      <td>${order.isPaid ? 'Paid' : 'Unpaid'}</td>
      <td><button class="btn btn-sm btn-outline" onclick="viewOrderDetail('${order._id}')">View</button></td>
    </tr>
  `).join('');
}

function viewOrderDetail(orderId) {
  window.location.href = `orders.html?id=${orderId}`;
}