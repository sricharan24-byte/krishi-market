document.addEventListener('DOMContentLoaded', async () => {
  if (!auth.isAuthenticated() || !auth.isAdmin()) { window.location.href = '../login.html'; return; }
  const res = await fetch(config.endpoints.users.all, { headers: auth.getAuthHeaders() });
  const users = await res.json();
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td><span class="organic-badge">${u.role}</span></td>
      <td>${u.isActive ? '<span class="in-stock">Active</span>' : '<span class="out-of-stock">Inactive</span>'}</td>
      <td>${new Date(u.createdAt).toLocaleDateString()}</td>
      <td class="action-buttons">
        <button class="btn-view" onclick="viewUser('${u._id}')">View</button>
        <button class="btn-delete" onclick="deleteUser('${u._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
});
function viewUser(id) { window.location.href = `users.html?id=${id}`; }
async function deleteUser(id) {
  if (!confirm('Delete this user?')) return;
  const res = await fetch(config.endpoints.users.byId(id), { method: 'DELETE', headers: auth.getAuthHeaders() });
  if (res.ok) location.reload();
}