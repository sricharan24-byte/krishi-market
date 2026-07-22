document.addEventListener('DOMContentLoaded', async () => {
  if (!auth.isAuthenticated() || !auth.isAdmin()) { window.location.href = '../login.html'; return; }
  const res = await fetch(config.endpoints.users.all, { headers: auth.getAuthHeaders() });
  const users = await res.json();
  const farmers = users.filter(u => u.role === 'farmer');
  
  const tbody = document.getElementById('farmersTableBody');
  if (farmers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;">No farmers registered</td></tr>';
    return;
  }
  tbody.innerHTML = farmers.map(f => `
    <tr>
      <td>${f.name}</td>
      <td>${f.email}</td>
      <td>${f.phone || 'N/A'}</td>
      <td>${f._id}</td>
      <td>${f.isActive ? '<span class="in-stock">Active</span>' : '<span class="out-of-stock">Inactive</span>'}</td>
      <td class="action-buttons">
        <button class="btn-view">View</button>
        <button class="btn-delete" onclick="deleteFarmer('${f._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
});
async function deleteFarmer(id) {
  if (!confirm('Remove this farmer?')) return;
  const res = await fetch(config.endpoints.users.byId(id), { method: 'DELETE', headers: auth.getAuthHeaders() });
  if (res.ok) location.reload();
}