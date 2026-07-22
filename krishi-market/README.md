# 🌾 Krishi Market - Agricultural Marketplace

Krishi Market is a full-stack agricultural marketplace platform that connects farmers directly with consumers. It allows farmers to list their produce and customers to buy fresh, organic products directly from the source.

## 🚀 Features

### For Customers
- Browse products by category, price, and organic status
- View detailed product information with ratings and reviews
- Add products to cart and wishlist
- Place orders with multiple payment methods
- Track order status
- Manage profile and view order history

### For Farmers
- Dashboard with sales analytics and revenue tracking
- Add, edit, and manage product listings
- Upload product images
- Mark products as organic
- View and manage inventory levels
- Track orders received

### For Admins
- Central dashboard with platform statistics
- Manage users, farmers, and products
- View and manage all orders
- Mark orders as delivered
- Generate reports and analytics

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Responsive design with CSS Grid/Flexbox
- Font Awesome icons
- Google Fonts (Inter)

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- Multer for file uploads
- Express Validator for input validation

## 📁 Project Structure

```
krishi-market/
├── frontend/          # Frontend HTML/CSS/JS files
│   ├── index.html     # Landing page
│   ├── login.html     # User login
│   ├── register.html  # User registration
│   ├── products.html  # Marketplace browsing
│   ├── cart.html      # Shopping cart
│   ├── checkout.html  # Checkout process
│   ├── customer/      # Customer dashboard & pages
│   ├── farmer/        # Farmer dashboard & pages
│   ├── admin/         # Admin dashboard & pages
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   └── assets/        # Images, icons, logos
├── backend/           # Node.js/Express backend
│   ├── server.js      # Entry point
│   ├── config/        # Database configuration
│   ├── models/        # MongoDB models
│   ├── controllers/   # Route controllers
│   ├── routes/        # API routes
│   ├── middleware/     # Auth, role, error middleware
│   ├── utils/         # Helpers & validators
│   └── uploads/       # Uploaded files
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd krishi-market/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/krishi_market
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
6. Open `frontend/index.html` in your browser or serve it via a live server.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Login user |
| `/api/auth/profile` | GET | Get user profile |
| `/api/products` | GET/POST | List/Create products |
| `/api/products/:id` | GET/PUT/DELETE | Product CRUD |
| `/api/cart` | GET/POST/DELETE | Cart operations |
| `/api/orders` | GET/POST | Order operations |
| `/api/wishlist` | GET/POST | Wishlist operations |
| `/api/reviews` | GET/POST | Review operations |
| `/api/users` | GET/DELETE | User management (admin) |

## 📄 License

This project is licensed under the MIT License.