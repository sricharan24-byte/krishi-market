document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        const response = await fetch(config.endpoints.auth.login, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          auth.setAuth(data.token, data);
          window.location.href = `${data.role}/dashboard.html`;
        } else {
          showAlert(data.message || 'Login failed', 'error');
        }
      } catch (error) {
        showAlert('Network error. Please try again.', 'error');
      }
    });
  }
  
  function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    const form = document.querySelector('.auth-form');
    form.insertBefore(alert, form.firstChild);
    
    setTimeout(() => alert.remove(), 5000);
  }
});