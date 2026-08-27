// =======================================================
// KRISHI MARKET - GLOBAL CONFIGURATION
// Supports Localhost, LAN / Wi-Fi IP, and Cloud domains
// =======================================================

(function (global) {
  function getBackendBaseUrl() {
    if (typeof window !== 'undefined') {
      // 1. Check for manual runtime override
      if (window.KRISHI_BACKEND_URL) {
        return window.KRISHI_BACKEND_URL.replace(/\/+$/, '');
      }
      try {
        const storedUrl = localStorage.getItem('krishi_backend_url');
        if (storedUrl) {
          return storedUrl.replace(/\/+$/, '');
        }
      } catch (e) {
        // localStorage may be disabled
      }

      // 2. Derive automatically from browser window location
      if (window.location && window.location.protocol.startsWith('http')) {
        const { protocol, hostname, port } = window.location;

        // If served directly from Express backend (port 5000) or standard web ports
        if (!port || port === '5000' || port === '80' || port === '443') {
          return `${protocol}//${hostname}${port ? ':' + port : ''}`;
        }

        // If served via a dev static server (e.g., Live Server on 5500, Vite 5173, etc.)
        // connect to the Express backend running on port 5000 of the SAME host/IP
        return `${protocol}//${hostname}:5000`;
      }
    }

    // 3. Fallback for file:/// or isolated environments
    return 'http://localhost:5000';
  }

  const BASE_URL = getBackendBaseUrl();
  const API_URL = `${BASE_URL}/api`;
  const UPLOAD_URL = `${BASE_URL}/uploads`;

  function getImageUrl(imageName, fallback = 'https://via.placeholder.com/300x200?text=No+Image') {
    if (!imageName) return fallback;
    if (typeof imageName === 'string' && (imageName.startsWith('http://') || imageName.startsWith('https://') || imageName.startsWith('data:'))) {
      return imageName;
    }
    return `${UPLOAD_URL}/${imageName}`;
  }

  const config = {
    BASE_URL,
    API_URL,
    UPLOAD_URL,
    getImageUrl,
    endpoints: {
      auth: {
        login: `${API_URL}/auth/login`,
        register: `${API_URL}/auth/register`,
        profile: `${API_URL}/auth/profile`,
        forgotPassword: `${API_URL}/auth/forgot-password`,
        verifyOtp: `${API_URL}/auth/verify-otp`,
        resetPassword: `${API_URL}/auth/reset-password`
      },
      products: {
        all: `${API_URL}/products`,
        byId: (id) => `${API_URL}/products/${id}`,
        myProducts: `${API_URL}/products/my-products`
      },
      cart: {
        get: `${API_URL}/cart`,
        add: `${API_URL}/cart`,
        update: (id) => `${API_URL}/cart/${id}`,
        remove: (id) => `${API_URL}/cart/${id}`,
        clear: `${API_URL}/cart`
      },
      orders: {
        all: `${API_URL}/orders`,
        byId: (id) => `${API_URL}/orders/${id}`,
        pay: (id) => `${API_URL}/orders/${id}/pay`,
        deliver: (id) => `${API_URL}/orders/${id}/deliver`
      },
      wishlist: {
        get: `${API_URL}/wishlist`,
        add: `${API_URL}/wishlist`,
        remove: (id) => `${API_URL}/wishlist/${id}`
      },
      reviews: {
        byProduct: (id) => `${API_URL}/reviews/product/${id}`,
        create: (id) => `${API_URL}/reviews/${id}`
      },
      users: {
        all: `${API_URL}/users`,
        byId: (id) => `${API_URL}/users/${id}`
      },
      payments: {
        create: `${API_URL}/payments`,
        all: `${API_URL}/payments`
      },
      notifications: {
        all: `${API_URL}/notifications`,
        markRead: (id) => `${API_URL}/notifications/${id}`,
        delete: (id) => `${API_URL}/notifications/${id}`
      }
    }
  };

  // Expose to global scope (window or global)
  global.config = config;
  global.API_URL = API_URL;
  global.BASE_URL = BASE_URL;
  global.UPLOAD_URL = UPLOAD_URL;
  global.getImageUrl = getImageUrl;
})(typeof window !== 'undefined' ? window : this);