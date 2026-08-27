document.addEventListener('DOMContentLoaded', async () => {
  if (!auth.isAuthenticated() || !auth.isAdmin()) { window.location.href = '../login.html'; return; }
  const res = await fetch(`${config.endpoints.orders.all}/all`, { headers: auth.getAuthHeaders() });
  const orders = await res.json();
  const tbody = document.getElementById('adminOrdersBody');
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:30px;">No orders</td></tr>';
    return;
  }
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td>#${o._id.slice(-8)}</td>
      <td>${o.user?.name || 'Unknown'}</td>
      <td>${o.orderItems.length} items</td>
      <td>₹${o.totalPrice.toFixed(2)}</td>
      <td>${new Date(o.createdAt).toLocaleDateString()}</td>
      <td><span class="status-badge status-${o.status}">${o.status}</span></td>
      <td>${o.isPaid ? 'Paid' : 'Unpaid'}</td>
      <td class="action-buttons">
        <button class="btn-view">View</button>
        ${!o.isDelivered ? `<button class="btn-edit" onclick="markDelivered('${o._id}')">Deliver</button>` : ''}
      </td>
    </tr>
  `).join('');
});

async function markDelivered(id) {
  const res = await fetch(config.endpoints.orders.deliver(id), { method: 'PUT', headers: auth.getAuthHeaders() });
  if (res.ok) location.reload();
}