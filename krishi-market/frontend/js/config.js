const API_URL = 'http://localhost:5000/api';

const config = {
  API_URL,
  endpoints: {
    auth: {
      login: `${API_URL}/auth/login`,
      register: `${API_URL}/auth/register`,
      profile: `${API_URL}/auth/profile`
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