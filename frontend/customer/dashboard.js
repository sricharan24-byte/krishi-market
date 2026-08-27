document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated() || !auth.isCustomer()) {
    window.location.href = '../login.html';
    return;
  }
  loadOrders();
  loadWishlistCount();
});

async function loadOrders() {
  try {
    const response = await fetch(config.endpoints.orders.all, {
      headers: auth.getAuthHeaders()
    });
    const orders = await response.json();
    displayOrders(orders);
    updateStats(orders);
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

function displayOrders(orders) {
  const tbody = document.getElementById('ordersBody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:30px;">No orders yet</td></tr>';
    return;
  }

  tbody.innerHTML = orders.slice(0, 10).map(order => `
    <tr>
      <td>#${order._id.slice(-8)}</td>
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td>₹${order.totalPrice.toFixed(2)}</td>
      <td><span class="status-badge status-${order.status}">${order.status}</span></td>
      <td><button class="btn btn-sm btn-outline" onclick="viewOrder('${order._id}')">View</button></td>
    </tr>
  `).join('');
}

function updateStats(orders) {
  document.getElementById('totalOrders').textContent = orders.length;
  document.getElementById('pendingOrders').textContent = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  document.getElementById('deliveredOrders').textContent = orders.filter(o => o.status === 'delivered').length;
}

async function loadWishlistCount() {
  try {
    const response = await fetch(config.endpoints.wishlist.get, {
      headers: auth.getAuthHeaders()
    });
    const wishlist = await response.json();
    document.getElementById('wishlistCount').textContent = wishlist.products?.length || 0;
  } catch (error) {
    console.error('Error:', error);
  }
}

function viewOrder(orderId) {
  window.location.href = `orders.html?id=${orderId}`;
}