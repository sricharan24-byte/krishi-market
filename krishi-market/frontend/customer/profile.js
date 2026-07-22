document.addEventListener('DOMContentLoaded', async () => {
  if (!auth.isAuthenticated()) { window.location.href = '../login.html'; return; }
  await loadProfile();
  
  document.getElementById('profileForm').addEventListener('submit', updateProfile);
});

async function loadProfile() {
  try {
    const response = await fetch(config.endpoints.auth.profile, { headers: auth.getAuthHeaders() });
    const user = await response.json();
    
    document.getElementById('avatarInitial').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('editName').value = user.name || '';
    document.getElementById('editEmail').value = user.email || '';
    document.getElementById('editPhone').value = user.phone || '';
    document.getElementById('editStreet').value = user.address?.street || '';
    document.getElementById('editCity').value = user.address?.city || '';
    document.getElementById('editState').value = user.address?.state || '';
    document.getElementById('editZip').value = user.address?.zipCode || '';
    document.getElementById('editCountry').value = user.address?.country || 'India';
  } catch (error) { console.error('Error:', error); }
}

async function updateProfile(e) {
  e.preventDefault();
  const user = auth.getUser();
  
  try {
    const response = await fetch(config.endpoints.users.byId(user._id), {
      method: 'PUT',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify({
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        address: {
          street: document.getElementById('editStreet').value,
          city: document.getElementById('editCity').value,
          state: document.getElementById('editState').value,
          zipCode: document.getElementById('editZip').value,
          country: document.getElementById('editCountry').value
        }
      })
    });
    
    if (response.ok) {
      alert('Profile updated successfully!');
      await loadProfile();
    } else {
      const data = await response.json();
      alert(data.message || 'Failed to update profile');
    }
  } catch (error) { console.error('Error:', error); }
}