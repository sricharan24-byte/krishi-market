document.addEventListener('DOMContentLoaded', async () => {
  if (!auth.isAuthenticated() || !auth.isFarmer()) { window.location.href = '../login.html'; return; }
  const response = await fetch(config.endpoints.auth.profile, { headers: auth.getAuthHeaders() });
  const user = await response.json();
  
  const card = document.getElementById('farmerProfileCard');
  card.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar">${user.name.charAt(0).toUpperCase()}</div>
      <div><h2>${user.name}</h2><p>${user.email}</p><span class="organic-badge">Farmer</span></div>
    </div>
    <form id="farmerProfileForm">
      <div class="form-group"><label>Name</label><input type="text" id="fName" value="${user.name || ''}" required></div>
      <div class="form-group"><label>Email</label><input type="email" id="fEmail" value="${user.email || ''}" required></div>
      <div class="form-group"><label>Phone</label><input type="tel" id="fPhone" value="${user.phone || ''}"></div>
      <div class="form-group"><label>Street</label><input type="text" id="fStreet" value="${user.address?.street || ''}"></div>
      <div class="form-row">
        <div class="form-group"><label>City</label><input type="text" id="fCity" value="${user.address?.city || ''}"></div>
        <div class="form-group"><label>State</label><input type="text" id="fState" value="${user.address?.state || ''}"></div>
      </div>
      <button type="submit" class="btn btn-primary">Update Profile</button>
    </form>`;
  
  document.getElementById('farmerProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch(config.endpoints.users.byId(user._id), {
      method: 'PUT', headers: auth.getAuthHeaders(),
      body: JSON.stringify({
        name: document.getElementById('fName').value,
        email: document.getElementById('fEmail').value,
        phone: document.getElementById('fPhone').value,
        address: { street: document.getElementById('fStreet').value, city: document.getElementById('fCity').value, state: document.getElementById('fState').value }
      })
    });
    if (res.ok) alert('Profile updated!');
    else alert('Update failed');
  });
});