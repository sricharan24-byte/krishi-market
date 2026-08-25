// Auth utility functions
const TOKEN_KEY = 'krishi_market_token';
const USER_KEY = 'krishi_market_user';

const auth = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token') || '';
  },

  getUser() {
    const raw = localStorage.getItem(USER_KEY) || localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  setAuth(token, user) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem('token', token);
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role) localStorage.setItem('userRole', user.role);
      if (user._id || user.id) localStorage.setItem('userId', user._id || user.id);
      if (user.email) localStorage.setItem('userEmail', user.email);
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');

    // Detect if inside a subfolder
    const isSubfolder = window.location.pathname.includes('/customer/') ||
                        window.location.pathname.includes('/farmer/') ||
                        window.location.pathname.includes('/admin/');
    window.location.href = isSubfolder ? '../login.html' : 'login.html';
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isFarmer() {
    const user = this.getUser();
    return user && user.role === 'farmer';
  },

  isCustomer() {
    const user = this.getUser();
    return user && user.role === 'customer';
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  },

  updateNavbar() {
    const authLinks = document.getElementById('authLinks');
    
    if (this.isAuthenticated()) {
      const user = this.getUser();
      const role = (user && user.role) ? user.role : 'customer';
      if (authLinks) {
        authLinks.innerHTML = `
          <a href="${role}/dashboard.html">Dashboard</a>
          <a href="#" onclick="auth.logout()">Logout</a>
        `;
      }
      // Update nav links for non-dynamic pages
      const navLinks = document.querySelector('.nav-links');
      if (navLinks && !authLinks) {
        const loginBtn = navLinks.querySelector('a[href="login.html"]');
        const registerBtn = navLinks.querySelector('a[href="register.html"]');
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        // Add dashboard and logout if not already there
        if (!document.getElementById('navDashboard')) {
          const dashLink = document.createElement('a');
          dashLink.id = 'navDashboard';
          dashLink.href = `${role}/dashboard.html`;
          dashLink.textContent = 'Dashboard';
          navLinks.insertBefore(dashLink, navLinks.firstChild);
          const logoutLink = document.createElement('a');
          logoutLink.href = '#';
          logoutLink.textContent = 'Logout';
          logoutLink.onclick = (e) => { e.preventDefault(); auth.logout(); };
          navLinks.appendChild(logoutLink);
        }
      }
    } else {
      if (authLinks) {
        authLinks.innerHTML = `
          <a href="login.html" class="btn btn-primary">Login</a>
          <a href="register.html" class="btn btn-secondary">Register</a>
        `;
      }
    }
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  auth.updateNavbar();
  
  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }
});